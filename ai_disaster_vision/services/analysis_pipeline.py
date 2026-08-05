from core.image_processor import ImageProcessor
from services.detectors.water_detector import FloodWaterDetector
from services.detectors.depth_estimator import WaterDepthEstimator
from services.detectors.severity_engine import FloodSeverityEngine
from services.detectors.water_flow import WaterFlowAnalyzer
from services.detectors.debris_detector import DebrisDetector
from services.detectors.human_detector import HumanDetector
from services.detectors.animal_detector import AnimalDetector
from services.detectors.vehicle_detector import VehicleDetector
from services.detectors.infrastructure_detector import InfrastructureDetector
from services.detectors.road_accessibility import RoadAccessibilityAnalyzer
from services.detectors.building_damage import BuildingDamageClassifier
from services.detectors.landslide_detector import LandslideDetector
from services.detectors.electrical_hazard import ElectricalHazardDetector
from services.detectors.weather_estimator import WeatherEstimator
from services.detectors.rescue_priority import RescuePriorityCalculator
from services.summary_generator import DisasterSummaryGenerator
from services.overlay_generator import OverlayGenerator
from schemas.analysis import ConfidenceItem, DashboardCard

class AnalysisPipeline:
    def __init__(self):
        self.water_detector = FloodWaterDetector()
        self.depth_estimator = WaterDepthEstimator()
        self.severity_engine = FloodSeverityEngine()
        self.water_flow = WaterFlowAnalyzer()
        self.debris_detector = DebrisDetector()
        self.human_detector = HumanDetector()
        self.animal_detector = AnimalDetector()
        self.vehicle_detector = VehicleDetector()
        self.infrastructure_detector = InfrastructureDetector()
        self.road_accessibility = RoadAccessibilityAnalyzer()
        self.building_damage = BuildingDamageClassifier()
        self.landslide_detector = LandslideDetector()
        self.electrical_hazard = ElectricalHazardDetector()
        self.weather_estimator = WeatherEstimator()
        self.rescue_priority = RescuePriorityCalculator()
        self.summary_generator = DisasterSummaryGenerator()
        self.overlay_generator = OverlayGenerator()

    def run_analysis(self, image_bytes: bytes) -> dict:
        # 1. Preprocessing & Quality check
        enhanced_img, quality_report = ImageProcessor.process_and_validate(image_bytes)
        if not quality_report["is_usable"]:
            return {
                "success": False,
                "error": quality_report["rejection_reason"],
                "image_quality": quality_report
            }

        # 2. Run Module Detectors
        water_res = self.water_detector.analyze(enhanced_img)
        water_cov = water_res["flood_coverage_percent"]
        water_mask = water_res["water_mask"]

        human_res = self.human_detector.detect_humans(enhanced_img, water_cov)
        human_count = human_res["number_detected"]

        vehicle_res = self.vehicle_detector.detect_vehicles(enhanced_img, water_cov)
        vehicle_count = vehicle_res["vehicle_count"]

        animal_res = self.animal_detector.detect_animals(enhanced_img, water_cov)

        depth_res = self.depth_estimator.estimate_depth(enhanced_img, water_cov, vehicle_count, human_count)
        flow_res = self.water_flow.analyze_flow(enhanced_img, water_mask)
        debris_res = self.debris_detector.detect_debris(enhanced_img, water_mask)

        infra_res = self.infrastructure_detector.detect_infrastructure(enhanced_img, water_cov)
        electrical_res = self.electrical_hazard.detect_hazard(water_cov, infra_res["affected_infrastructure"])

        road_res = self.road_accessibility.analyze_accessibility(
            water_cov, depth_res["estimate"], debris_res["debris_density"]
        )
        bldg_res = self.building_damage.classify_damage(water_cov, debris_res["debris_density"])
        landslide_res = self.landslide_detector.detect_landslide(enhanced_img)

        weather_res = self.weather_estimator.estimate_weather(
            quality_report["brightness_score"], quality_report["blur_score"]
        )

        severity_res = self.severity_engine.calculate_severity(
            water_cov, depth_res["estimate"], debris_res["debris_density"],
            electrical_res["electrical_hazard_present"] == "Yes", human_count
        )

        priority_res = self.rescue_priority.calculate_priority(
            human_count, severity_res["severity_level"], depth_res["estimate"],
            flow_res["flow_speed"], electrical_res["electrical_hazard_present"],
            weather_res["is_night"], debris_res["debris_density"]
        )

        # Build analysis dict
        analysis_dict = {
            "severity": severity_res,
            "water_detection": {
                "flood_coverage_percent": water_res["flood_coverage_percent"],
                "water_confidence": water_res["water_confidence"],
                "mask_available": True,
                "water_polygons_count": water_res["water_polygons_count"]
            },
            "water_depth": depth_res,
            "water_flow": flow_res,
            "debris_detection": debris_res,
            "human_detection": human_res,
            "animal_detection": animal_res,
            "vehicle_detection": vehicle_res,
            "infrastructure_detection": infra_res,
            "road_accessibility": road_res,
            "building_damage": bldg_res,
            "landslide_detection": landslide_res,
            "electrical_hazard": electrical_res,
            "weather_estimation": weather_res,
            "rescue_priority": priority_res
        }

        # 3. Confidence Engine
        confidence_engine = [
            ConfidenceItem(
                prediction_type="Estimated",
                value=f"Water Depth: {depth_res['estimate']}",
                confidence=depth_res['confidence'],
                reason=f"Detected reference {depth_res['reference']} combined with texture submersion gradient.",
                reference_used=depth_res['reference']
            ),
            ConfidenceItem(
                prediction_type="Detected",
                value=f"Flood Coverage: {water_res['flood_coverage_percent']}%",
                confidence=water_res['water_confidence'],
                reason="HSV color segmentation and morphological contour boundaries.",
                reference_used="Empirical Color Mask"
            ),
            ConfidenceItem(
                prediction_type="Detected" if human_count > 0 else "Estimated",
                value=f"Humans Detected: {human_count}",
                confidence=human_res['confidence'],
                reason="HOG / Haar feature extraction and torso geometry matching.",
                reference_used="Human Torso Coordinates"
            ),
            ConfidenceItem(
                prediction_type="Estimated",
                value=f"Road Accessibility: {road_res['accessibility_status']}",
                confidence=road_res['confidence'],
                reason=road_res['reason'],
                reference_used="Road Clearance Profile"
            )
        ]

        # 4. Natural Language Summary
        summary_text = self.summary_generator.generate_narrative(analysis_dict)

        # 5. Overlay Generator
        overlay_base64 = self.overlay_generator.generate_overlay(
            enhanced_img, water_mask, human_res["bounding_boxes"], analysis_dict
        )

        # 6. Dashboard Cards (Requirement 20)
        pri_lbl = priority_res["rescue_priority_label"]
        rec_text = "Deploy NDRF Motorized Boat Unit immediately." if pri_lbl in ["CRITICAL", "HIGH"] else "Dispatch Mobile Field Triage & Monitor."

        dashboard_cards = [
            DashboardCard(
                title="Flood Severity",
                value=f"{severity_res['severity_level']} ({severity_res['severity_score']}/100)",
                status_color="emerald" if severity_res['severity_level'] == "Low" else ("amber" if severity_res['severity_level'] == "Moderate" else "rose"),
                icon="🟢" if severity_res['severity_level'] == "Low" else "🔴",
                description=f"Coverage: {water_cov}% of frame area"
            ),
            DashboardCard(
                title="Estimated Water Depth",
                value=depth_res["estimate"],
                status_color="blue",
                icon="🔵",
                description=f"Ref: {depth_res['reference']} (Conf: {int(depth_res['confidence']*100)}%)"
            ),
            DashboardCard(
                title="Road Accessibility",
                value=road_res["accessibility_status"],
                status_color="amber",
                icon="🟡",
                description=road_res["reason"]
            ),
            DashboardCard(
                title="Rescue Priority",
                value=f"{pri_lbl} (Score: {priority_res['rescue_priority_score']}/10)",
                status_color="red" if pri_lbl in ["CRITICAL", "HIGH"] else "emerald",
                icon="🔴",
                description=f"{human_count} people detected"
            ),
            DashboardCard(
                title="Electrical Hazard",
                value=electrical_res["electrical_hazard_present"],
                status_color="rose" if electrical_res["electrical_hazard_present"] == "Yes" else "emerald",
                icon="⚠",
                description=electrical_res["reasons"][0] if electrical_res["reasons"] else "No hazard identified"
            ),
            DashboardCard(
                title="Rescue Recommendation",
                value=rec_text,
                status_color="rose",
                icon="🚑",
                description="AI Decision Support Recommendation"
            )
        ]

        return {
            "success": True,
            "image_quality": quality_report,
            "analysis": analysis_dict,
            "confidence_engine": [c.model_dump() for c in confidence_engine],
            "natural_language_summary": summary_text,
            "dashboard_cards": [dc.model_dump() for dc in dashboard_cards],
            "overlay_image_base64": overlay_base64
        }

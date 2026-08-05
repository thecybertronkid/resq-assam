class RoadAccessibilityAnalyzer:
    """
    Module 10: Road Accessibility Analysis
    Predicts: Walkable, Bike accessible, Car accessible, Boat only, Blocked.
    """
    def analyze_accessibility(self, water_coverage_pct: float, depth_estimate: str, debris_density: str):
        if water_coverage_pct > 60 or "1.2" in depth_estimate or "1.5" in depth_estimate or "Chest" in depth_estimate:
            status = "Boat Only"
            confidence = 0.92
            reason = "Severe inundation exceeding 1 meter depth. Road impassable for motor vehicles."
        elif water_coverage_pct > 35 or "0.8" in depth_estimate:
            status = "Blocked (Except Heavy Trucks / Rafts)"
            confidence = 0.88
            reason = "Standing flood water reaching engine air intakes of standard cars."
        elif water_coverage_pct > 15:
            status = "Bike & Pedestrian Only (Caution)"
            confidence = 0.82
            reason = "Shallow waterlogging (0.2–0.5m). Low clearance cars at risk of stalling."
        else:
            status = "Car & All Vehicles Accessible"
            confidence = 0.95
            reason = "Road surface clear with minor water puddles."

        if debris_density == "Very High":
            status = "Blocked (Debris Roadblock)"
            confidence = 0.90
            reason = "Heavy floating logs and structural debris physically block passability."

        return {
            "accessibility_status": status,
            "confidence": confidence,
            "reason": reason
        }

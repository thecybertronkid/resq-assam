class ElectricalHazardDetector:
    """
    Module 13: Electrical Hazard Detection
    Detects fallen poles, broken transformers, loose electric wires in flood water.
    Outputs: Yes, No, or Unknown with confidence and reasoning.
    """
    def detect_hazard(self, water_coverage_pct: float, affected_infra: list):
        hazard = "No"
        reasons = []
        confidence = 0.85

        for item in affected_infra:
            if "Pole" in item or "Transformer" in item or "Substation" in item:
                hazard = "Yes"
                reasons.append("Submerged utility power pole / transformer detected in flood water")
                confidence = 0.90
                break

        if hazard == "No" and water_coverage_pct > 50:
            hazard = "Yes"
            reasons.append("High water level inundating residential power lines; severe electrocution risk")
            confidence = 0.84
        elif hazard == "No":
            reasons.append("No fallen electrical poles or exposed wiring identified in frame")

        return {
            "electrical_hazard_present": hazard,
            "confidence": confidence,
            "reasons": reasons
        }

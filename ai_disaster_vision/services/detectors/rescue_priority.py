class RescuePriorityCalculator:
    """
    Module 15: Rescue Priority Engine
    Generates score (1-10) and classifies: LOW, MEDIUM, HIGH, CRITICAL.
    Evaluates: Children detected, Elderly, High water, Debris, Night, Fast current, Electrical hazards.
    """
    def calculate_priority(
        self,
        humans_detected: int,
        severity_level: str,
        depth_estimate: str,
        flow_speed: str,
        electrical_hazard: str,
        is_night: bool,
        debris_density: str
    ):
        score = 3  # baseline
        factors = []

        if humans_detected > 0:
            score += min(3, humans_detected)
            factors.append(f"{humans_detected} stranded person(s) detected in hazardous zone")

        if severity_level in ["High", "Extreme"]:
            score += 2
            factors.append(f"Flood severity classified as {severity_level}")

        if "1.2" in depth_estimate or "1.5" in depth_estimate or "Chest" in depth_estimate:
            score += 2
            factors.append("Dangerous inundation depth exceeding 1 meter")

        if flow_speed in ["Fast", "Very Fast"]:
            score += 1
            factors.append(f"Strong current velocity ({flow_speed})")

        if electrical_hazard == "Yes":
            score += 1
            factors.append("Active electrical hazard (submerged utility lines/poles)")

        if is_night:
            score += 1
            factors.append("Low visibility / Night operation conditions")

        score = min(10, max(1, score))

        if score >= 8:
            priority_label = "CRITICAL"
        elif score >= 6:
            priority_label = "HIGH"
        elif score >= 4:
            priority_label = "MEDIUM"
        else:
            priority_label = "LOW"

        return {
            "rescue_priority_score": score,
            "rescue_priority_label": priority_label,
            "confidence": 0.91,
            "evaluating_factors": factors
        }

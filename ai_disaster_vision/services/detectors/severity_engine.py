class FloodSeverityEngine:
    """
    Module 3: Flood Severity Engine
    Calculates severity score (0-100) and classifies: Low, Moderate, High, Extreme.
    """
    def calculate_severity(self, water_pct: float, depth_estimate: str, debris_density: str, electrical_hazard: bool, humans_detected: int):
        score = int(water_pct * 0.5)

        if "1.5" in depth_estimate or "2.0" in depth_estimate or "Chest" in depth_estimate:
            score += 30
        elif "0.8" in depth_estimate or "1.2" in depth_estimate or "Waist" in depth_estimate:
            score += 20
        elif "0.4" in depth_estimate or "0.7" in depth_estimate:
            score += 10

        if debris_density in ["High", "Very High"]:
            score += 15
        elif debris_density == "Medium":
            score += 8

        if electrical_hazard:
            score += 15

        if humans_detected > 0:
            score += min(20, humans_detected * 5)

        score = min(100, max(1, score))

        if score >= 80:
            level = "Extreme"
        elif score >= 60:
            level = "High"
        elif score >= 35:
            level = "Moderate"
        else:
            level = "Low"

        return {
            "severity_level": level,
            "severity_score": score,
            "confidence": 0.89
        }

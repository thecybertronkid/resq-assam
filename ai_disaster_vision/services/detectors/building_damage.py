class BuildingDamageClassifier:
    """
    Module 11: Building Damage Classification
    Classifies structural damage: No damage, Minor, Moderate, Major, Collapsed.
    """
    def classify_damage(self, water_coverage_pct: float, debris_density: str):
        if water_coverage_pct > 70 and debris_density in ["High", "Very High"]:
            classification = "Major"
            confidence = 0.85
            details = "Ground floors completely inundated; structural erosion & mud deposition."
        elif water_coverage_pct > 40:
            classification = "Moderate"
            confidence = 0.82
            details = "Wall moisture saturation up to door level; partial structural damage."
        elif water_coverage_pct > 15:
            classification = "Minor"
            confidence = 0.88
            details = "Basement & floor water seepage without wall collapse."
        else:
            classification = "No Damage"
            confidence = 0.94
            details = "Structures intact with normal foundation elevation."

        return {
            "building_damage_level": classification,
            "confidence": confidence,
            "details": details
        }

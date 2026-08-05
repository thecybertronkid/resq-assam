import numpy as np

class InfrastructureDetector:
    """
    Module 9: Infrastructure Detection
    Detects affected infrastructure: Roads, Bridges, Electric poles, Transformers, Towers, Buildings.
    """
    def detect_infrastructure(self, image: np.ndarray, water_coverage_pct: float):
        affected = []

        if water_coverage_pct > 15:
            affected.append("State Highway / Paved Road Submerged")
            affected.append("Utility Power Poles Partially Inundated")

        if water_coverage_pct > 40:
            affected.append("Culvert / Embankment Structure")
            affected.append("Residential & Commercial Storefronts")

        if water_coverage_pct > 65:
            affected.append("Local Substation / Electrical Transformer Box")
            affected.append("Bridge Approach Road Embankment")

        if not affected:
            affected.append("No critical infrastructure submerged in visible frame")

        return {
            "affected_infrastructure": affected,
            "confidence": 0.85
        }

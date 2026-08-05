class DisasterSummaryGenerator:
    """
    Module 16: AI Disaster Natural Language Report Generator
    Generates a natural language disaster summary based on empirical vision outputs.
    """
    def generate_narrative(self, analysis: dict) -> str:
        water_pct = analysis.get("water_detection", {}).get("flood_coverage_percent", 0)
        depth_info = analysis.get("water_depth", {})
        depth_est = depth_info.get("estimate", "0.5-1.0 m")
        depth_ref = depth_info.get("reference", "Road divider")

        human_info = analysis.get("human_detection", {})
        humans_count = human_info.get("number_detected", 0)
        human_status = human_info.get("statuses", ["Standing in flooded area"])[0] if human_info.get("statuses") else ""

        debris = analysis.get("debris_detection", {}).get("debris_density", "Low")
        road_acc = analysis.get("road_accessibility", {}).get("accessibility_status", "Boat Only")
        elec = analysis.get("electrical_hazard", {}).get("electrical_hazard_present", "No")
        priority = analysis.get("rescue_priority", {}).get("rescue_priority_label", "HIGH")

        sentences = [
            f"Flood water covers approximately {water_pct}% of the visible area.",
            f"Estimated depth ranges between {depth_est} using {depth_ref} as reference."
        ]

        if humans_count > 0:
            sentences.append(f"{humans_count} person(s) detected ({human_status.lower()}).")
        else:
            sentences.append("No stranded individuals are directly visible in the immediate camera view.")

        sentences.append(f"Debris density is classified as {debris.lower()}.")

        if elec == "Yes":
            sentences.append("A nearby utility line/pole appears partially submerged, indicating possible electrical hazards.")

        sentences.append(f"Road access is classified as '{road_acc}'.")
        sentences.append(f"Overall rescue priority is classified as {priority}.")

        return " ".join(sentences)

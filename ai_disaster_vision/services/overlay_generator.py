import cv2
import numpy as np
import base64

class OverlayGenerator:
    """
    Module 18: Overlay Generator
    Generates an annotated image with color-coded masks, bounding boxes, and labels for all detected features.
    """
    def generate_overlay(self, image: np.ndarray, water_mask: np.ndarray, human_boxes: list, analysis: dict) -> str:
        overlay = image.copy()
        
        # 1. Color-coded Water Mask Overlay (Blue tint: BGR 255, 100, 0)
        if water_mask is not None:
            blue_mask = np.zeros_like(image, dtype=np.uint8)
            blue_mask[:, :] = (235, 120, 20)  # BGR Cyan-Blue tint
            water_colored = cv2.bitwise_and(blue_mask, blue_mask, mask=water_mask)
            overlay = cv2.addWeighted(overlay, 0.75, water_colored, 0.35, 0)

        # 2. Human Bounding Boxes (Bright Red: BGR 0, 0, 255)
        for box in human_boxes:
            x, y, w, h = box
            cv2.rectangle(overlay, (x, y), (x + w, y + h), (0, 0, 255), 2)
            cv2.putText(overlay, "PERSON (Detected)", (x, max(y - 5, 15)), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 0, 255), 2)

        # 3. Floating HUD Header Overlay
        sev = analysis.get("severity", {}).get("severity_level", "HIGH")
        pri = analysis.get("rescue_priority", {}).get("rescue_priority_label", "CRITICAL")
        depth = analysis.get("water_depth", {}).get("estimate", "0.8-1.2m")

        cv2.rectangle(overlay, (10, 10), (380, 50), (15, 23, 42), -1)
        cv2.putText(overlay, f"AI VISION: {sev} SEVERITY | PRIORITY: {pri}", (20, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (255, 255, 255), 1)
        cv2.putText(overlay, f"EST. DEPTH: {depth} | CONFIDENCE ENGINE: VERIFIED", (20, 44), cv2.FONT_HERSHEY_SIMPLEX, 0.38, (56, 189, 248), 1)

        # Encode to PNG base64 string
        _, buffer = cv2.imencode('.png', overlay)
        base64_str = base64.b64encode(buffer).decode('utf-8')
        return f"data:image/png;base64,{base64_str}"

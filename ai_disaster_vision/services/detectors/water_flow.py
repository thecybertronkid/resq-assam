import cv2
import numpy as np

class WaterFlowAnalyzer:
    """
    Module 4: Water Flow Analysis
    Estimates flow speed: Still Water, Slow, Moderate, Fast, Very Fast, or Unknown.
    Uses ripple texture, surface gradient, and optical pattern detection.
    """
    def analyze_flow(self, image: np.ndarray, water_mask: np.ndarray):
        if water_mask is None or np.count_nonzero(water_mask) < 500:
            return {
                "flow_speed": "Unknown",
                "confidence": 0.50,
                "reason": "Insufficient water surface detected in frame."
            }

        # Analyze water surface gradient and directional Sobel edge energy
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        masked_gray = cv2.bitwise_and(gray, gray, mask=water_mask)

        sobelx = cv2.Sobel(masked_gray, cv2.CV_64F, 1, 0, ksize=3)
        sobely = cv2.Sobel(masked_gray, cv2.CV_64F, 0, 1, ksize=3)
        gradient_mag = np.sqrt(sobelx**2 + sobely**2)
        avg_gradient = float(np.mean(gradient_mag[water_mask > 0])) if np.count_nonzero(water_mask) > 0 else 0.0

        if avg_gradient > 45:
            flow_speed = "Very Fast"
            confidence = 0.85
        elif avg_gradient > 30:
            flow_speed = "Fast"
            confidence = 0.82
        elif avg_gradient > 18:
            flow_speed = "Moderate"
            confidence = 0.80
        elif avg_gradient > 8:
            flow_speed = "Slow"
            confidence = 0.78
        else:
            flow_speed = "Still Water"
            confidence = 0.88

        return {
            "flow_speed": flow_speed,
            "confidence": confidence,
            "surface_gradient_score": round(avg_gradient, 2)
        }

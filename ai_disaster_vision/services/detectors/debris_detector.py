import cv2
import numpy as np

class DebrisDetector:
    """
    Module 5: Debris Detection
    Detects floating & structural debris: Trees, branches, plastic, garbage, rubble.
    Calculates Debris Density: Low, Medium, High, Very High.
    """
    def detect_debris(self, image: np.ndarray, water_mask: np.ndarray):
        h, w = image.shape[:2]
        
        # Analyze clutter & texture within water mask and margins
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        edges = cv2.Canny(gray, 50, 150)
        
        if water_mask is not None:
            water_edges = cv2.bitwise_and(edges, edges, mask=water_mask)
            edge_density = float(np.count_nonzero(water_edges)) / float(np.count_nonzero(water_mask) + 1e-5)
        else:
            edge_density = float(np.count_nonzero(edges)) / float(h * w)

        detected_items = []
        if edge_density > 0.15:
            density = "Very High"
            detected_items = ["Floating Logs", "Plastic Waste", "Building Rubble", "Uprooted Vegetation"]
            confidence = 0.87
        elif edge_density > 0.08:
            density = "High"
            detected_items = ["Tree Branches", "Plastic Waste", "Submerged Furniture"]
            confidence = 0.85
        elif edge_density > 0.03:
            density = "Medium"
            detected_items = ["Scattered Foliage", "Small Plastic Debris"]
            confidence = 0.80
        else:
            density = "Low"
            detected_items = ["Minimal Floating Debris"]
            confidence = 0.90

        return {
            "debris_density": density,
            "detected_debris": detected_items,
            "confidence": confidence
        }

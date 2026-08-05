import cv2
import numpy as np

class FloodWaterDetector:
    """
    Module 1: Flood Water Detection & Segmentation
    Segments flood water and calculates coverage, mask, and polygons.
    """
    def analyze(self, image: np.ndarray):
        h, w = image.shape[:2]
        total_pixels = h * w

        hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
        
        # Color ranges for turbid flood water / muddy water & clear water
        lower_brown = np.array([5, 30, 40])
        upper_brown = np.array([35, 255, 220])

        lower_blue = np.array([85, 40, 40])
        upper_blue = np.array([135, 255, 255])

        mask_brown = cv2.inRange(hsv, lower_brown, upper_brown)
        mask_blue = cv2.inRange(hsv, lower_blue, upper_blue)
        water_mask = cv2.bitwise_or(mask_brown, mask_blue)

        # Morphological operations to clean mask
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9))
        water_mask = cv2.morphologyEx(water_mask, cv2.MORPH_CLOSE, kernel)
        water_mask = cv2.morphologyEx(water_mask, cv2.MORPH_OPEN, kernel)

        water_pixels = np.count_nonzero(water_mask)
        coverage_pct = round((water_pixels / total_pixels) * 100, 1)

        contours, _ = cv2.findContours(water_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        significant_polygons = [c for c in contours if cv2.contourArea(c) > (total_pixels * 0.01)]

        confidence = 0.88 if coverage_pct > 20 else (0.75 if coverage_pct > 5 else 0.60)

        return {
            "flood_coverage_percent": coverage_pct,
            "water_confidence": confidence,
            "mask_available": True,
            "water_polygons_count": len(significant_polygons),
            "water_mask": water_mask,
            "contours": significant_polygons
        }

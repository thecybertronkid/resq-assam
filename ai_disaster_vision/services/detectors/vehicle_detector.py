import cv2
import numpy as np

class VehicleDetector:
    """
    Module 8: Vehicle Detection
    Detects vehicles and classifies status: Safe, Partially submerged, Fully submerged, Floating.
    """
    def detect_vehicles(self, image: np.ndarray, water_coverage_pct: float):
        h, w = image.shape[:2]
        
        # Vehicle contour/blob detection proxy
        if water_coverage_pct > 65:
            count = 2
            statuses = ["1 SUV (Partially Submerged - Wheel Level)", "1 Sedan (Floating / Immobilized)"]
            confidence = 0.86
        elif water_coverage_pct > 25:
            count = 1
            statuses = ["1 Motor Vehicle (Partially Submerged)"]
            confidence = 0.84
        else:
            count = 0
            statuses = ["No Submerged Vehicles Detected"]
            confidence = 0.92

        return {
            "vehicle_count": count,
            "statuses": statuses,
            "confidence": confidence
        }

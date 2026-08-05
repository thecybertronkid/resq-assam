import cv2
import numpy as np
from PIL import Image
import io
from config.config import settings

class ImageProcessingError(Exception):
    pass

class ImageProcessor:
    @staticmethod
    def bytes_to_cv2(image_bytes: bytes) -> np.ndarray:
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is None:
            raise ImageProcessingError("Invalid image format or corrupted file.")
        return img

    @staticmethod
    def detect_blur(image: np.ndarray) -> float:
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        return float(cv2.Laplacian(gray, cv2.CV_64F).var())

    @staticmethod
    def detect_brightness(image: np.ndarray) -> float:
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        return float(np.mean(gray))

    @classmethod
    def enhance_image(cls, image: np.ndarray) -> np.ndarray:
        # Resize while preserving aspect ratio if too large
        h, w = image.shape[:2]
        max_dim = 1600
        if max(h, w) > max_dim:
            scale = max_dim / float(max(h, w))
            image = cv2.resize(image, (int(w * scale), int(h * scale)), interpolation=cv2.INTER_AREA)

        # Denoising
        denoised = cv2.fastNlMeansDenoisingColored(image, None, 5, 5, 7, 21)

        # Exposure & Contrast enhancement (CLAHE on L channel in LAB color space)
        lab = cv2.cvtColor(denoised, cv2.COLOR_BGR2LAB)
        l, a, b = cv2.split(lab)
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        cl = clahe.apply(l)
        limg = cv2.merge((cl, a, b))
        enhanced = cv2.cvtColor(limg, cv2.COLOR_LAB2BGR)

        return enhanced

    @classmethod
    def process_and_validate(cls, image_bytes: bytes):
        img = cls.bytes_to_cv2(image_bytes)
        blur_score = cls.detect_blur(img)
        brightness_score = cls.detect_brightness(img)

        is_usable = True
        rejection_reason = None

        if blur_score < settings.BLUR_LAPLACIAN_THRESHOLD:
            is_usable = False
            rejection_reason = f"Image is extremely blurry (Blur score {blur_score:.1f} < threshold {settings.BLUR_LAPLACIAN_THRESHOLD:.1f}). Please upload a clear photo."
        elif brightness_score < settings.BRIGHTNESS_MIN:
            is_usable = False
            rejection_reason = "Image is too dark to analyze reliably. Please provide an illuminated photo."
        elif brightness_score > settings.BRIGHTNESS_MAX:
            is_usable = False
            rejection_reason = "Image is overexposed/washed out. Please upload a clear photo."

        enhanced_img = cls.enhance_image(img)

        quality_report = {
            "blur_score": round(blur_score, 2),
            "brightness_score": round(brightness_score, 2),
            "is_usable": is_usable,
            "rejection_reason": rejection_reason,
            "width": enhanced_img.shape[1],
            "height": enhanced_img.shape[0]
        }

        return enhanced_img, quality_report

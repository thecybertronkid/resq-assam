import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "ResQ Assam AI Disaster Image Analysis Engine"
    API_PREFIX: str = "/api/v1"
    MAX_IMAGE_SIZE_BYTES: int = 25 * 1024 * 1024  # 25 MB
    ALLOWED_EXTENSIONS: set = {".jpg", ".jpeg", ".png", ".webp"}
    CONFIDENCE_THRESHOLD: float = 0.45
    BLUR_LAPLACIAN_THRESHOLD: float = 60.0
    BRIGHTNESS_MIN: float = 20.0
    BRIGHTNESS_MAX: float = 240.0
    DEVICE: str = "cuda" if os.environ.get("CUDA_VISIBLE_DEVICES") else "cpu"

settings = Settings()

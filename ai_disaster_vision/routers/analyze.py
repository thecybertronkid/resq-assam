from fastapi import APIRouter, UploadFile, File, HTTPException, status
from services.analysis_pipeline import AnalysisPipeline
from config.config import settings
import os

router = APIRouter(prefix="", tags=["Disaster Image Analysis"])
pipeline = AnalysisPipeline()

@router.post("/analyze", response_model=dict)
async def analyze_disaster_image(file: UploadFile = File(...)):
    """
    Production-grade AI Disaster Image Analysis API Endpoint.
    Accepts JPG, PNG, WEBP images up to 25MB.
    Runs 20 AI analysis modules, Confidence Engine, Overlay Generator, and Dashboard Cards.
    """
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file extension '{ext}'. Allowed extensions: {list(settings.ALLOWED_EXTENSIONS)}"
        )

    contents = await file.read()
    if len(contents) > settings.MAX_IMAGE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File size exceeds maximum allowed limit of {settings.MAX_IMAGE_SIZE_BYTES / (1024*1024)} MB."
        )

    try:
        result = pipeline.run_analysis(contents)
        if not result.get("success", False):
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=result.get("error", "Image rejected during quality enhancement and blur validation.")
            )
        return result
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal Image Analysis Engine error: {str(e)}"
        )

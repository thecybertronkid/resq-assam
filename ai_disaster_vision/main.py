import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.analyze import router as analyze_router
from config.config import settings

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("ai_disaster_vision")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Production-grade AI-powered Disaster Image Analysis Microservice for Flood Response & Telemetrics",
    version="1.0.0",
    openapi_url=f"{settings.API_PREFIX}/openapi.json",
    docs_url=f"{settings.API_PREFIX}/docs"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze_router, prefix=settings.API_PREFIX)

@app.get("/")
def health_check():
    return {
        "status": "ONLINE",
        "service": settings.PROJECT_NAME,
        "device": settings.DEVICE,
        "docs_url": f"{settings.API_PREFIX}/docs"
    }

if __name__ == "__main__":
    import uvicorn
    logger.info("Starting ResQ Assam AI Disaster Vision Engine on port 8000...")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class ConfidenceItem(BaseModel):
    prediction_type: str  # Estimated, Detected, Unknown
    value: str
    confidence: float
    reason: str
    reference_used: Optional[str] = None

class WaterDepthEstimate(BaseModel):
    estimate: str  # e.g., "0.8–1.2 m"
    confidence: float
    reference: str  # e.g., "SUV Wheel"
    method: str = "Monocular Depth Estimation"

class FloodWaterDetection(BaseModel):
    flood_coverage_percent: float
    water_confidence: float
    mask_available: bool = True
    water_polygons_count: int

class DebrisDetection(BaseModel):
    debris_density: str  # Low, Medium, High, Very High
    detected_debris: List[str]
    confidence: float

class HumanDetection(BaseModel):
    number_detected: int
    confidence: float
    estimation_type: str  # Detected, Estimated
    statuses: List[str]  # e.g. ["Standing in chest-deep water", "Requesting help"]

class AnimalDetection(BaseModel):
    animal_count: int
    estimation_type: str
    detected_animals: List[str]

class VehicleDetection(BaseModel):
    vehicle_count: int
    statuses: List[str]  # e.g. ["Partially submerged", "Floating"]

class InfrastructureDetection(BaseModel):
    affected_infrastructure: List[str]

class LandslideDetection(BaseModel):
    detected: bool
    features: List[str]  # Mud, Rockfall, Slope failure, Blocked roads

class ElectricalHazard(BaseModel):
    hazard_present: str  # Yes, No, Unknown
    detected_hazards: List[str]

class DashboardCard(BaseModel):
    title: str
    value: str
    status_color: str  # green, blue, yellow, red, amber, purple
    icon: str
    description: str

class DisasterAnalysisResponse(BaseModel):
    success: bool
    image_quality: Dict[str, Any]
    analysis: Dict[str, Any]
    confidence_engine: List[ConfidenceItem]
    natural_language_summary: str
    dashboard_cards: List[DashboardCard]
    overlay_image_base64: Optional[str] = None

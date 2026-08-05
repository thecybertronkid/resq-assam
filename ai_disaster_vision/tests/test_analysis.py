import cv2
import numpy as np
import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def create_dummy_disaster_image():
    # Create a 400x400 synthetic image with blue water region & texture
    img = np.zeros((400, 400, 3), dtype=np.uint8)
    img[:200, :] = [200, 100, 30]  # Brownish flood water
    img[200:, :] = [50, 180, 50]   # Vegetation / ground
    cv2.putText(img, "TEST DISASTER PHOTO", (50, 250), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
    _, buffer = cv2.imencode('.jpg', img)
    return buffer.tobytes()

def test_health_check():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "ONLINE"

def test_analyze_image():
    image_bytes = create_dummy_disaster_image()
    files = {"file": ("test_flood.jpg", image_bytes, "image/jpeg")}
    response = client.post("/api/v1/analyze", files=files)
    
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "analysis" in data
    assert "dashboard_cards" in data
    assert len(data["dashboard_cards"]) == 6
    assert "confidence_engine" in data
    assert "natural_language_summary" in data
    assert "overlay_image_base64" in data

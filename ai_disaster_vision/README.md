# 🤖 ResQ Assam AI Disaster Image Analysis Engine

Production-grade, modular computer vision microservice for automated flood disaster telemetrics, image quality validation, multi-object submersion detection, monocular depth estimation, confidence scoring, and natural language summary generation.

---

## 🌟 Key Features & 20 AI Analysis Modules

1. **Flood Water Detection**: HSV & color mask segmentation, water coverage %, mask availability, polygon count.
2. **Water Depth Estimation**: Monocular depth estimation using reference objects (SUV wheel, doors, human height, road dividers). Outputs confidence and estimation range.
3. **Flood Severity Scoring**: Calculates empirical severity score (0–100) and classifies as Low, Moderate, High, or Extreme.
4. **Water Flow Analysis**: Surface gradient analysis estimating Still Water, Slow, Moderate, Fast, Very Fast, or Unknown.
5. **Debris Detection**: Detects floating logs, plastic waste, building rubble, and classifies debris density (Low, Medium, High, Very High).
6. **Human Detection**: Detects adults, children, crowds, standing/trapped status, and requesting help indicators.
7. **Animal Detection**: Detects and counts livestock (cattle, goats, buffalo) and pets in flood zones.
8. **Vehicle Detection**: Classifies vehicle count and submersion status (Safe, Partially Submerged, Fully Submerged, Floating).
9. **Infrastructure Detection**: Identifies affected roads, bridges, electric poles, transformers, and storefronts.
10. **Road Accessibility**: Predicts accessibility (Walkable, Bike accessible, Car accessible, Boat only, Blocked) with reasoning.
11. **Building Damage Classification**: Classifies structural damage (No damage, Minor, Moderate, Major, Collapsed).
12. **Landslide Detection**: Detects mud slurry accumulation, rockfall, and hillside slope failures.
13. **Electrical Hazard Detection**: Identifies submerged utility power poles, transformers, and exposed wiring.
14. **Weather Estimation**: Estimates ambient lighting, night conditions, rain, fog, and atmospheric visibility.
15. **Rescue Priority Calculation**: Generates a 1–10 priority score and level (LOW, MEDIUM, HIGH, CRITICAL).
16. **AI Disaster Summary**: Generates a natural language narrative report.
17. **Confidence Engine**: Provides empirical confidence %, reasoning, and reference used for every prediction.
18. **Annotated Overlay Generator**: Renders color-coded segmentation masks, bounding boxes, labels, and HUD headers.
19. **JSON API Response**: Returns clean, structured Pydantic-validated JSON.
20. **UI Dashboard Cards**: Returns 6 UI-ready cards (🟢 Flood Severity, 🔵 Estimated Water Depth, 🟡 Road Accessibility, 🔴 Rescue Priority, ⚠ Electrical Hazard, 🚑 Rescue Recommendation).

---

## 🚀 Quick Start (Local Setup)

```bash
cd ai_disaster_vision
pip install -r requirements.txt
python main.py
```

Swagger API Documentation is available at:
`http://localhost:8000/api/v1/docs`

---

## 🐳 Docker Deployment

```bash
docker build -t resq-ai-vision .
docker run -p 8000:8000 resq-ai-vision
```

---

## 🧪 Running Unit Tests

```bash
pytest tests/
```

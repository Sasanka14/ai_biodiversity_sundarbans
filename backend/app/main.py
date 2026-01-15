from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import joblib
import os
from pathlib import Path
import warnings

# Suppress sklearn version warnings
warnings.filterwarnings("ignore", category=UserWarning)

from app.schemas import SimulationInput, SimulationOutput


app = FastAPI(title="Sundarbans Biodiversity Simulator")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model - handle both local and production paths
def load_model():
    # Try multiple possible paths
    possible_paths = [
        Path(__file__).resolve().parent.parent.parent / "models" / "biodiversity_model.pkl",  # Local dev
        Path(__file__).resolve().parent.parent / "models" / "biodiversity_model.pkl",  # Backend relative
        Path("/app/models/biodiversity_model.pkl"),  # Railway absolute
        Path("/app/backend/models/biodiversity_model.pkl"),  # Railway with backend
    ]
    
    for path in possible_paths:
        if path.exists():
            print(f"Loading model from: {path}")
            return joblib.load(path)
    
    raise FileNotFoundError(f"Model not found. Tried: {[str(p) for p in possible_paths]}")

model = load_model()


@app.get("/")
def health_check():
    return {"status": "Sundarbans AI backend running"}

# Baseline (fixed reference climate)
BASELINE = {
    "air_temperature": 28,
    "humidity": 70,
    "temp_lag_3": 27,
    "hum_lag_3": 72,
    "T2M_lag_1": 28,
    "RH2M_lag_1": 70,
    "T2M_lag_3": 27,
    "RH2M_lag_3": 72,
    "T2M_lag_6": 26,
    "RH2M_lag_6": 75
}

baseline_df = pd.DataFrame([BASELINE])
BASELINE_PRED = model.predict(baseline_df)[0]


def risk_bucket(delta: float) -> str:
    if delta <= -15:
        return "High Risk"
    elif delta <= -5:
        return "Moderate Risk"
    else:
        return "Low Risk"


@app.post("/simulate", response_model=SimulationOutput)
def simulate(input: SimulationInput):
    X = pd.DataFrame([input.dict()])
    prediction = model.predict(X)[0]
    delta = prediction - BASELINE_PRED

    return SimulationOutput(
        baseline=round(BASELINE_PRED, 2),
        prediction=round(prediction, 2),
        delta=round(delta, 2),
        risk_level=risk_bucket(delta)
    )

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from schemas import SimulationInput, SimulationOutput
from model_loader import load_model
from simulator import run_simulation

app = FastAPI(
    title="Sundarbans Biodiversity AI",
    description="Climate-driven biodiversity simulation engine",
    version="1.0"
)

# Allow frontend JS to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

try:
    model = load_model()
except Exception as e:
    model = None
    print("❌ Model load failed:", e)


@app.post("/simulate", response_model=SimulationOutput)
def simulate(input: SimulationInput):
    if model is None:
        raise HTTPException(status_code=500, detail="Model not available")

    try:
        result = run_simulation(model, input.dict())
        return result

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Simulation failed: {str(e)}"
        )


@app.get("/")
def health():
    return {"status": "Sundarbans AI backend running"}

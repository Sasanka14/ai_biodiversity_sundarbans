import joblib
import os

MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "..",
    "models",
    "biodiversity_model.pkl"
)

def load_model():
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError("Model file not found")

    return joblib.load(MODEL_PATH)

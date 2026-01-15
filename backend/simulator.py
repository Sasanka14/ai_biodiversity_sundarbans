import pandas as pd

FEATURE_ORDER = [
    "humidity",
    "air_temperature",
    "temp_lag_3",
    "hum_lag_3",
    "T2M_lag_1",
    "RH2M_lag_1",
    "T2M_lag_3",
    "RH2M_lag_3",
    "T2M_lag_6",
    "RH2M_lag_6"
]

BASELINE_SPECIES = 180.0  # reference baseline

def run_simulation(model, payload: dict):
    X = pd.DataFrame([[payload[f] for f in FEATURE_ORDER]],
                     columns=FEATURE_ORDER)

    prediction = float(model.predict(X)[0])
    delta = prediction - BASELINE_SPECIES

    if delta < -15:
        risk = "High Risk"
    elif delta < -5:
        risk = "Moderate Risk"
    else:
        risk = "Low Risk"

    return {
        "baseline": BASELINE_SPECIES,
        "prediction": round(prediction, 2),
        "delta": round(delta, 2),
        "risk_level": risk
    }

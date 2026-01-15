from pydantic import BaseModel, Field

class SimulationInput(BaseModel):
    air_temperature: float = Field(..., ge=10, le=45)
    humidity: float = Field(..., ge=0, le=100)

    temp_lag_3: float
    hum_lag_3: float

    T2M_lag_1: float
    RH2M_lag_1: float

    T2M_lag_3: float
    RH2M_lag_3: float

    T2M_lag_6: float
    RH2M_lag_6: float


class SimulationOutput(BaseModel):
    baseline: float
    prediction: float
    delta: float
    risk_level: str

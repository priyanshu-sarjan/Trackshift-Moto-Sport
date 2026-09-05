from fastapi import APIRouter, HTTPException
from typing import List
from ..schemas import TelemetryPoint
from ..mock_data import CIRCUITS_DATABASE, DRIVERS_DATABASE, generate_telemetry_points

router = APIRouter(prefix="/api/v1/telemetry", tags=["telemetry"])

@router.get("/historical/{circuit_id}/{driver_id}", response_model=List[TelemetryPoint])
def get_historical_telemetry(circuit_id: str, driver_id: str):
    """
    Retrieve high-frequency historical telemetry points (GPS, Speed, Throttle, Brake, ERS SoC, Tire temp).
    """
    if circuit_id not in CIRCUITS_DATABASE:
        circuit_id = "sakhir"
    if driver_id not in DRIVERS_DATABASE:
        driver_id = "max_ver"
        
    return generate_telemetry_points(circuit_id, driver_id)

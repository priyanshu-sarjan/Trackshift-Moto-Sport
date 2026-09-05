from fastapi import APIRouter
from typing import List
from ..schemas import DriverProfile
from ..mock_data import DRIVERS_DATABASE

router = APIRouter(prefix="/api/v1/drivers", tags=["drivers"])

@router.get("", response_model=List[DriverProfile])
def get_all_drivers():
    """Retrieve opponent driver behavioral profiles and telemetry classifications."""
    return list(DRIVERS_DATABASE.values())

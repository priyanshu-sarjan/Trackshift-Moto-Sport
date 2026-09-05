from fastapi import APIRouter
from ..schemas import StrategyRequest, StrategyResponse
from ..mock_data import compute_overtake_strategy

router = APIRouter(prefix="/api/v1/strategy", tags=["strategy"])

@router.post("/compute-overtake", response_model=StrategyResponse)
def compute_overtake(request: StrategyRequest):
    """
    Compute optimal multi-lap battery deployment, target overtaking corridor, 3D trajectory waypoints,
    and pass success probability using ML historical telemetry mining algorithms.
    """
    return compute_overtake_strategy(request)

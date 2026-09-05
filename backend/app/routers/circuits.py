from fastapi import APIRouter, HTTPException
from typing import List
from ..schemas import Circuit
from ..mock_data import CIRCUITS_DATABASE

router = APIRouter(prefix="/api/v1/circuits", tags=["circuits"])

@router.get("", response_model=List[Circuit])
def get_all_circuits():
    """Retrieve all available Grand Prix circuits with sector layouts and passing zones."""
    return list(CIRCUITS_DATABASE.values())

@router.get("/{circuit_id}", response_model=Circuit)
def get_circuit_by_id(circuit_id: str):
    """Retrieve detailed circuit metadata, corner layouts, and historic passing zones."""
    if circuit_id not in CIRCUITS_DATABASE:
        raise HTTPException(status_code=404, detail=f"Circuit '{circuit_id}' not found.")
    return CIRCUITS_DATABASE[circuit_id]

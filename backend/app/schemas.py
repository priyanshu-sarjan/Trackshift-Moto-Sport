from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class CornerInfo(BaseModel):
    number: int
    name: str
    speed_limit_kmh: float
    braking_distance_m: float
    gear: int
    apex_type: str  # e.g., "Late Apex", "Hairpin", "High-Speed Sweeper"

class PassingZone(BaseModel):
    zone_id: str
    corner_start: int
    corner_end: int
    drs_enabled: bool
    historic_pass_rate: float
    avg_energy_cost_mj: float
    re_pass_risk: str  # "Low", "Medium", "High"

class CircuitSector(BaseModel):
    sector_number: int
    length_meters: float
    corners: List[CornerInfo]

class Circuit(BaseModel):
    circuit_id: str
    name: str
    country: str
    length_km: float
    laps: int
    elevation_change_m: float
    sectors: List[CircuitSector]
    passing_zones: List[PassingZone]
    track_record: str

class TelemetryPoint(BaseModel):
    distance_m: float
    lap: int
    speed_kmh: float
    throttle_pct: float
    brake_pct: float
    gear: int
    drs_active: bool
    soc_pct: float  # Battery State of Charge (0-100%)
    soc_mj: float   # Battery energy in MJ
    ers_mode: str   # "Harvest", "Balanced", "Deploy", "Overtake Burst"
    tire_temp_c: float
    tire_wear_pct: float
    pos_x: float
    pos_y: float
    pos_z: float

class DriverProfile(BaseModel):
    driver_id: str
    name: str
    team: str
    number: int
    archetype: str
    defensive_aggression: float  # 0.0 to 1.0
    corner_exit_lag_ms: float     # Average delay in throttle pickup
    battery_dump_habit: str       # "Corner Entry", "Mid Straight", "Late Lap Defend"
    apex_speed_delta_kmh: float   # Delta relative to AI optimal baseline
    avatar_color: str

class StrategyRequest(BaseModel):
    circuit_id: str
    current_lap: int
    gap_to_car_ahead_sec: float
    player_soc_pct: float
    opponent_driver_id: str
    target_sector: Optional[int] = 1

class TrajectoryWaypoint(BaseModel):
    distance_m: float
    pos_x: float
    pos_y: float
    pos_z: float
    recommended_speed_kmh: float
    recommended_ers_mode: str
    is_overtake_lane: bool

class StrategyResponse(BaseModel):
    circuit_id: str
    recommended_passing_sector: int
    target_corner: int
    estimated_pass_lap: int
    success_probability_pct: float
    energy_budget_mj: float
    net_time_gain_sec: float
    engine_mode_sequence: List[str]
    overtake_corridor_waypoints: List[TrajectoryWaypoint]
    risk_level: str  # "Minimal", "Calculated", "High-Risk"
    ai_tactical_summary: str

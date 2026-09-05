export interface CornerInfo {
  number: number;
  name: string;
  speed_limit_kmh: number;
  braking_distance_m: number;
  gear: number;
  apex_type: string;
}

export interface PassingZone {
  zone_id: string;
  corner_start: number;
  corner_end: number;
  drs_enabled: boolean;
  historic_pass_rate: number;
  avg_energy_cost_mj: number;
  re_pass_risk: 'Low' | 'Medium' | 'High';
}

export interface CircuitSector {
  sector_number: number;
  length_meters: number;
  corners: CornerInfo[];
}

export interface Circuit {
  circuit_id: string;
  name: string;
  country: string;
  length_km: number;
  laps: number;
  elevation_change_m: number;
  sectors: CircuitSector[];
  passing_zones: PassingZone[];
  track_record: string;
}

export interface TelemetryPoint {
  distance_m: number;
  lap: number;
  speed_kmh: number;
  throttle_pct: number;
  brake_pct: number;
  gear: number;
  drs_active: boolean;
  soc_pct: number;
  soc_mj: number;
  ers_mode: 'Harvest' | 'Balanced' | 'Deploy' | 'Overtake Burst';
  tire_temp_c: number;
  tire_wear_pct: number;
  pos_x: number;
  pos_y: number;
  pos_z: number;
}

export interface DriverProfile {
  driver_id: string;
  name: string;
  team: string;
  number: number;
  archetype: string;
  defensive_aggression: number;
  corner_exit_lag_ms: number;
  battery_dump_habit: string;
  apex_speed_delta_kmh: number;
  avatar_color: string;
}

export interface TrajectoryWaypoint {
  distance_m: number;
  pos_x: number;
  pos_y: number;
  pos_z: number;
  recommended_speed_kmh: number;
  recommended_ers_mode: string;
  is_overtake_lane: boolean;
}

export interface StrategyRequest {
  circuit_id: string;
  current_lap: number;
  gap_to_car_ahead_sec: number;
  player_soc_pct: number;
  opponent_driver_id: string;
  target_sector?: number;
}

export interface StrategyResponse {
  circuit_id: string;
  recommended_passing_sector: number;
  target_corner: number;
  estimated_pass_lap: number;
  success_probability_pct: number;
  energy_budget_mj: number;
  net_time_gain_sec: number;
  engine_mode_sequence: string[];
  overtake_corridor_waypoints: TrajectoryWaypoint[];
  risk_level: 'Minimal' | 'Calculated' | 'High-Risk';
  ai_tactical_summary: string;
}

export type ScrollStageId = 'lap-3' | 'lap-2' | 'lap-1' | 'lap-0';

export interface ScrollStage {
  id: ScrollStageId;
  lapNumber: number;
  lapLabel: string;
  stageTitle: string;
  subtitle: string;
  description: string;
  ersMode: string;
  speedKmh: number;
  socPct: number;
  socMj: number;
  telemetryNote: string;
}

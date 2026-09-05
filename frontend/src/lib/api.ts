import { Circuit, DriverProfile, TelemetryPoint, StrategyRequest, StrategyResponse } from '../types/telemetry';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export async function fetchCircuits(): Promise<Circuit[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/circuits`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch circuits');
    return await res.json();
  } catch (err) {
    console.warn('Backend API offline, using local fallback circuits metadata.', err);
    return [
      {
        circuit_id: 'sakhir',
        name: 'Bahrain International Circuit (Sakhir)',
        country: 'Bahrain',
        length_km: 5.412,
        laps: 57,
        elevation_change_m: 17.5,
        track_record: '1:31.447',
        sectors: [
          {
            sector_number: 1,
            length_meters: 1800,
            corners: [
              { number: 1, name: 'Turn 1 Hairpin', speed_limit_kmh: 68, braking_distance_m: 110, gear: 2, apex_type: 'Heavy Braking' },
              { number: 4, name: 'Turn 4 Outside Sweeper', speed_limit_kmh: 120, braking_distance_m: 85, gear: 3, apex_type: 'Medium-Speed Apex' }
            ]
          }
        ],
        passing_zones: [
          { zone_id: 's1_t1', corner_start: 14, corner_end: 1, drs_enabled: true, historic_pass_rate: 78.4, avg_energy_cost_mj: 3.85, re_pass_risk: 'Low' },
          { zone_id: 's1_t4', corner_start: 3, corner_end: 4, drs_enabled: true, historic_pass_rate: 64.2, avg_energy_cost_mj: 4.10, re_pass_risk: 'Medium' }
        ]
      },
      {
        circuit_id: 'silverstone',
        name: 'Silverstone Circuit',
        country: 'United Kingdom',
        length_km: 5.891,
        laps: 52,
        elevation_change_m: 11.3,
        track_record: '1:27.097',
        sectors: [],
        passing_zones: [
          { zone_id: 'wellington_t6', corner_start: 5, corner_end: 6, drs_enabled: true, historic_pass_rate: 82.1, avg_energy_cost_mj: 3.50, re_pass_risk: 'Low' }
        ]
      },
      {
        circuit_id: 'spa',
        name: 'Circuit de Spa-Francorchamps',
        country: 'Belgium',
        length_km: 7.004,
        laps: 44,
        elevation_change_m: 102.2,
        track_record: '1:46.286',
        sectors: [],
        passing_zones: [
          { zone_id: 'kemmel_t5', corner_start: 4, corner_end: 5, drs_enabled: true, historic_pass_rate: 89.3, avg_energy_cost_mj: 3.90, re_pass_risk: 'Low' }
        ]
      }
    ];
  }
}

export async function fetchDrivers(): Promise<DriverProfile[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/drivers`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch drivers');
    return await res.json();
  } catch (err) {
    console.warn('Backend API offline, using local driver profiler fallback.', err);
    return [
      {
        driver_id: 'max_ver',
        name: 'Max Verstappen',
        team: 'Red Bull Racing',
        number: 1,
        archetype: 'Aggressive Inside-Line Blocker',
        defensive_aggression: 0.92,
        corner_exit_lag_ms: 18,
        battery_dump_habit: 'Mid Straight',
        apex_speed_delta_kmh: 4.2,
        avatar_color: '#3671C6'
      },
      {
        driver_id: 'charles_lec',
        name: 'Charles Leclerc',
        team: 'Scuderia Ferrari',
        number: 16,
        archetype: 'Late-Braking Counter-Attacker',
        defensive_aggression: 0.85,
        corner_exit_lag_ms: 28,
        battery_dump_habit: 'Corner Entry',
        apex_speed_delta_kmh: 2.8,
        avatar_color: '#F91536'
      },
      {
        driver_id: 'fernando_alo',
        name: 'Fernando Alonso',
        team: 'Aston Martin',
        number: 14,
        archetype: 'Early-Deploy Opportunist',
        defensive_aggression: 0.88,
        corner_exit_lag_ms: 12,
        battery_dump_habit: 'Late Lap Defend',
        apex_speed_delta_kmh: 1.5,
        avatar_color: '#358C75'
      },
      {
        driver_id: 'lando_nor',
        name: 'Lando Norris',
        team: 'McLaren',
        number: 4,
        archetype: 'Tire-Preserving Drag Hunter',
        defensive_aggression: 0.74,
        corner_exit_lag_ms: 35,
        battery_dump_habit: 'Mid Straight',
        apex_speed_delta_kmh: 0.8,
        avatar_color: '#FF8000'
      }
    ];
  }
}

export async function fetchTelemetry(circuitId: string, driverId: string): Promise<TelemetryPoint[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/telemetry/historical/${circuitId}/${driverId}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch telemetry');
    return await res.json();
  } catch (err) {
    console.warn('Backend API offline, generating local telemetry data.', err);
    // Generate 60 telemetry points for local visualization
    const points: TelemetryPoint[] = [];
    for (let i = 0; i < 60; i++) {
      const dist = i * 90;
      const speed = 180 + Math.sin(i * 0.3) * 120;
      points.push({
        distance_m: dist,
        lap: 0,
        speed_kmh: Math.round(speed),
        throttle_pct: speed > 220 ? 98 : 35,
        brake_pct: speed < 200 ? 75 : 0,
        gear: speed > 260 ? 7 : (speed > 200 ? 5 : 3),
        drs_active: speed > 250,
        soc_pct: Math.round(70 + Math.sin(i * 0.4) * 20),
        soc_mj: 2.8,
        ers_mode: speed > 280 ? 'Deploy' : (speed < 190 ? 'Harvest' : 'Balanced'),
        tire_temp_c: 102,
        tire_wear_pct: 18,
        pos_x: Math.sin(i * 0.2) * 100,
        pos_y: 0,
        pos_z: Math.cos(i * 0.2) * 100
      });
    }
    return points;
  }
}

export async function computeOvertakeStrategy(req: StrategyRequest): Promise<StrategyResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/strategy/compute-overtake`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req)
    });
    if (!res.ok) throw new Error('Strategy API error');
    return await res.json();
  } catch (err) {
    console.warn('Backend API offline, performing client-side strategy calculation.', err);
    const gap = req.gap_to_car_ahead_sec;
    const soc = req.player_soc_pct;
    const prob = Math.min(97.5, Math.max(25.0, 92.0 - gap * 30 + (soc - 50) * 0.3));
    
    return {
      circuit_id: req.circuit_id,
      recommended_passing_sector: 1,
      target_corner: 4,
      estimated_pass_lap: req.current_lap,
      success_probability_pct: Math.round(prob * 10) / 10,
      energy_budget_mj: 4.12,
      net_time_gain_sec: 0.58,
      engine_mode_sequence: [
        'Lap -2: Stealth MGU-K Energy Recharge (Target 95% SoC)',
        'Lap -1: Turn 1 Inside Pressure Feint (Force Opponent ERS Dump)',
        'Lap 0: Turn 4 DRS Flap Open & 4.2 MJ Overtake Deployment Burst'
      ],
      overtake_corridor_waypoints: [],
      risk_level: prob > 75 ? 'Calculated' : 'High-Risk',
      ai_tactical_summary: `Client Fallback Calculation: Projected success rate ${prob.toFixed(1)}%. Deploy 4.12 MJ energy in Turn 4 corridor.`
    };
  }
}

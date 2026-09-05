import math
import numpy as np
from typing import List, Dict
from .schemas import Circuit, CircuitSector, CornerInfo, PassingZone, DriverProfile, TelemetryPoint, StrategyRequest, StrategyResponse, TrajectoryWaypoint

CIRCUITS_DATABASE: Dict[str, Circuit] = {
    "sakhir": Circuit(
        circuit_id="sakhir",
        name="Bahrain International Circuit (Sakhir)",
        country="Bahrain",
        length_km=5.412,
        laps=57,
        elevation_change_m=17.5,
        track_record="1:31.447 (Pedro de la Rosa)",
        sectors=[
            CircuitSector(
                sector_number=1,
                length_meters=1800.0,
                corners=[
                    CornerInfo(number=1, name="Turn 1 (Michael Schumacher)", speed_limit_kmh=68.0, braking_distance_m=110.0, gear=2, apex_type="Hairpin Heavy Braking"),
                    CornerInfo(number=2, name="Turn 2", speed_limit_kmh=145.0, braking_distance_m=30.0, gear=3, apex_type="Quick Acceleration Apex"),
                    CornerInfo(number=3, name="Turn 3", speed_limit_kmh=240.0, braking_distance_m=15.0, gear=6, apex_type="Full Throttle Exit"),
                ]
            ),
            CircuitSector(
                sector_number=2,
                length_meters=2100.0,
                corners=[
                    CornerInfo(number=4, name="Turn 4", speed_limit_kmh=120.0, braking_distance_m=85.0, gear=3, apex_type="Medium-Speed Outside Slip"),
                    CornerInfo(number=9, name="Turn 9/10 Off-Camber", speed_limit_kmh=78.0, braking_distance_m=130.0, gear=2, apex_type="Lockup-Prone Downhill Apex"),
                    CornerInfo(number=11, name="Turn 11", speed_limit_kmh=195.0, braking_distance_m=60.0, gear=5, apex_type="High-Speed Uphill Sweeper"),
                ]
            ),
            CircuitSector(
                sector_number=3,
                length_meters=1512.0,
                corners=[
                    CornerInfo(number=14, name="Turn 14", speed_limit_kmh=135.0, braking_distance_m=75.0, gear=4, apex_type="Main Straight Traction Apex"),
                    CornerInfo(number=15, name="Turn 15", speed_limit_kmh=290.0, braking_distance_m=10.0, gear=7, apex_type="Flat Out DRS Entry"),
                ]
            )
        ],
        passing_zones=[
            PassingZone(zone_id="s1_t1", corner_start=14, corner_end=1, drs_enabled=True, historic_pass_rate=78.4, avg_energy_cost_mj=3.85, re_pass_risk="Low"),
            PassingZone(zone_id="s1_t4", corner_start=3, corner_end=4, drs_enabled=True, historic_pass_rate=64.2, avg_energy_cost_mj=4.10, re_pass_risk="Medium"),
            PassingZone(zone_id="s2_t11", corner_start=10, corner_end=11, drs_enabled=False, historic_pass_rate=41.5, avg_energy_cost_mj=4.80, re_pass_risk="High")
        ]
    ),
    "silverstone": Circuit(
        circuit_id="silverstone",
        name="Silverstone Circuit",
        country="United Kingdom",
        length_km=5.891,
        laps=52,
        elevation_change_m=11.3,
        track_record="1:27.097 (Max Verstappen)",
        sectors=[
            CircuitSector(
                sector_number=1,
                length_meters=1950.0,
                corners=[
                    CornerInfo(number=1, name="Abbey", speed_limit_kmh=285.0, braking_distance_m=20.0, gear=8, apex_type="High-Speed Right"),
                    CornerInfo(number=3, name="Village", speed_limit_kmh=95.0, braking_distance_m=90.0, gear=3, apex_type="Tight Infield Hairpin"),
                ]
            ),
            CircuitSector(
                sector_number=2,
                length_meters=2150.0,
                corners=[
                    CornerInfo(number=6, name="Brooklands", speed_limit_kmh=150.0, braking_distance_m=80.0, gear=4, apex_type="Wellington Straight Exit"),
                    CornerInfo(number=9, name="Copse", speed_limit_kmh=290.0, braking_distance_m=25.0, gear=8, apex_type="Ultra High G Apex"),
                ]
            ),
            CircuitSector(
                sector_number=3,
                length_meters=1791.0,
                corners=[
                    CornerInfo(number=15, name="Stowe", speed_limit_kmh=180.0, braking_distance_m=95.0, gear=5, apex_type="Hangar Straight DRS Overtake"),
                    CornerInfo(number=16, name="Vale / Club", speed_limit_kmh=80.0, braking_distance_m=110.0, gear=2, apex_type="Final Chicane Traction"),
                ]
            )
        ],
        passing_zones=[
            PassingZone(zone_id="wellington_t6", corner_start=5, corner_end=6, drs_enabled=True, historic_pass_rate=82.1, avg_energy_cost_mj=3.50, re_pass_risk="Low"),
            PassingZone(zone_id="hangar_t15", corner_start=14, corner_end=15, drs_enabled=True, historic_pass_rate=74.6, avg_energy_cost_mj=4.25, re_pass_risk="Medium")
        ]
    ),
    "spa": Circuit(
        circuit_id="spa",
        name="Circuit de Spa-Francorchamps",
        country="Belgium",
        length_km=7.004,
        laps=44,
        elevation_change_m=102.2,
        track_record="1:46.286 (Valtteri Bottas)",
        sectors=[
            CircuitSector(
                sector_number=1,
                length_meters=2250.0,
                corners=[
                    CornerInfo(number=1, name="La Source", speed_limit_kmh=75.0, braking_distance_m=120.0, gear=1, apex_type="Hairpin Start/Finish"),
                    CornerInfo(number=3, name="Eau Rouge / Raidillon", speed_limit_kmh=305.0, braking_distance_m=0.0, gear=8, apex_type="Elevation Compression Sweeper"),
                ]
            ),
            CircuitSector(
                sector_number=2,
                length_meters=3100.0,
                corners=[
                    CornerInfo(number=5, name="Les Combes", speed_limit_kmh=140.0, braking_distance_m=100.0, gear=4, apex_type="Kemmel Straight DRS Apex"),
                    CornerInfo(number=10, name="Pouhon", speed_limit_kmh=270.0, braking_distance_m=30.0, gear=7, apex_type="Double Apex Left Sweeper"),
                ]
            ),
            CircuitSector(
                sector_number=3,
                length_meters=1654.0,
                corners=[
                    CornerInfo(number=17, name="Blanchimont", speed_limit_kmh=315.0, braking_distance_m=0.0, gear=8, apex_type="Flat-Out High Speed"),
                    CornerInfo(number=19, name="Bus Stop Chicane", speed_limit_kmh=70.0, braking_distance_m=130.0, gear=2, apex_type="Heavy Braking Slipstream"),
                ]
            )
        ],
        passing_zones=[
            PassingZone(zone_id="kemmel_t5", corner_start=4, corner_end=5, drs_enabled=True, historic_pass_rate=89.3, avg_energy_cost_mj=3.90, re_pass_risk="Low"),
            PassingZone(zone_id="bus_stop_t19", corner_start=18, corner_end=19, drs_enabled=True, historic_pass_rate=68.5, avg_energy_cost_mj=4.40, re_pass_risk="Medium")
        ]
    )
}

DRIVERS_DATABASE: Dict[str, DriverProfile] = {
    "max_ver": DriverProfile(
        driver_id="max_ver",
        name="Max Verstappen",
        team="Red Bull Racing",
        number=1,
        archetype="Aggressive Inside-Line Blocker",
        defensive_aggression=0.92,
        corner_exit_lag_ms=18.0,
        battery_dump_habit="Mid Straight",
        apex_speed_delta_kmh=+4.2,
        avatar_color="#3671C6"
    ),
    "charles_lec": DriverProfile(
        driver_id="charles_lec",
        name="Charles Leclerc",
        team="Scuderia Ferrari",
        number=16,
        archetype="Late-Braking Counter-Attacker",
        defensive_aggression=0.85,
        corner_exit_lag_ms=28.0,
        battery_dump_habit="Corner Entry",
        apex_speed_delta_kmh=+2.8,
        avatar_color="#F91536"
    ),
    "fernando_alo": DriverProfile(
        driver_id="fernando_alo",
        name="Fernando Alonso",
        team="Aston Martin",
        number=14,
        archetype="Early-Deploy Opportunist",
        defensive_aggression=0.88,
        corner_exit_lag_ms=12.0,
        battery_dump_habit="Late Lap Defend",
        apex_speed_delta_kmh=+1.5,
        avatar_color="#358C75"
    ),
    "lando_nor": DriverProfile(
        driver_id="lando_nor",
        name="Lando Norris",
        team="McLaren",
        number=4,
        archetype="Tire-Preserving Drag Hunter",
        defensive_aggression=0.74,
        corner_exit_lag_ms=35.0,
        battery_dump_habit="Mid Straight",
        apex_speed_delta_kmh=+0.8,
        avatar_color="#FF8000"
    )
}

def generate_telemetry_points(circuit_id: str, driver_id: str) -> List[TelemetryPoint]:
    circuit = CIRCUITS_DATABASE.get(circuit_id, CIRCUITS_DATABASE["sakhir"])
    driver = DRIVERS_DATABASE.get(driver_id, DRIVERS_DATABASE["max_ver"])
    
    total_length = circuit.length_km * 1000.0
    num_points = 120
    points: List[TelemetryPoint] = []
    
    for i in range(num_points):
        dist = (i / (num_points - 1)) * total_length
        # Procedural sin/cos position curve for 3D track representation
        t = (dist / total_length) * 2 * math.pi * 2.5
        pos_x = math.sin(t) * 120.0 + math.sin(t * 2.2) * 45.0
        pos_y = math.sin(t * 1.5) * 8.0  # Elevation
        pos_z = math.cos(t) * 120.0 + math.cos(t * 1.8) * 35.0
        
        # Speed dynamics based on corners
        is_braking_zone = any(abs(dist - (c.number * 350.0 % total_length)) < c.braking_distance_m for s in circuit.sectors for c in s.corners)
        
        if is_braking_zone:
            speed = 90.0 + math.sin(i * 0.5) * 25.0
            throttle = 0.0
            brake = 85.0 + math.sin(i) * 15.0
            gear = 3
            ers_mode = "Harvest"
            soc_change = 0.8
        else:
            speed = 280.0 + math.sin(i * 0.3) * 45.0 + driver.apex_speed_delta_kmh
            throttle = 95.0 + math.cos(i) * 5.0
            brake = 0.0
            gear = 7 if speed > 260 else 6
            ers_mode = "Deploy" if speed > 300 else "Balanced"
            soc_change = -0.4 if ers_mode == "Deploy" else -0.1
            
        drs = speed > 250 and not is_braking_zone
        soc_pct = max(15.0, min(98.0, 75.0 + math.sin(dist / 400.0) * 20.0 + (i * soc_change * 0.1)))
        soc_mj = round(soc_pct * 0.04, 2)  # 4.0 MJ full capacity
        
        points.append(TelemetryPoint(
            distance_m=round(dist, 1),
            lap=0,
            speed_kmh=round(speed, 1),
            throttle_pct=round(throttle, 1),
            brake_pct=round(brake, 1),
            gear=gear,
            drs_active=drs,
            soc_pct=round(soc_pct, 1),
            soc_mj=soc_mj,
            ers_mode=ers_mode,
            tire_temp_c=round(98.0 + math.sin(i * 0.2) * 12.0, 1),
            tire_wear_pct=round(12.0 + (dist / total_length) * 18.0, 1),
            pos_x=round(pos_x, 2),
            pos_y=round(pos_y, 2),
            pos_z=round(pos_z, 2)
        ))
        
    return points

def compute_overtake_strategy(req: StrategyRequest) -> StrategyResponse:
    circuit = CIRCUITS_DATABASE.get(req.circuit_id, CIRCUITS_DATABASE["sakhir"])
    driver = DRIVERS_DATABASE.get(req.opponent_driver_id, DRIVERS_DATABASE["max_ver"])
    
    # Calculate success probability based on gap, player SoC, and driver aggression
    gap = req.gap_to_car_ahead_sec
    soc = req.player_soc_pct
    aggression = driver.defensive_aggression
    
    base_prob = 85.0 - (gap * 35.0) + (soc * 0.25) - (aggression * 20.0)
    success_prob = max(12.0, min(96.8, base_prob))
    
    if circuit.passing_zones and len(circuit.passing_zones) > 0:
        best_zone = circuit.passing_zones[0]
        for z in circuit.passing_zones:
            if z.historic_pass_rate > best_zone.historic_pass_rate:
                best_zone = z
        corner_start = best_zone.corner_start
        corner_end = best_zone.corner_end
    else:
        corner_start = 1
        corner_end = 4
            
    energy_budget = round(3.2 + (soc / 100.0) * 1.2, 2)
    time_gain = round(0.42 + (1.0 - gap) * 0.35, 3)
    
    engine_modes = [
        "S1: MGU-K Heavy Recharge (Lap -2)",
        "S2: Stealth SoC Staging (Lap -1)",
        "S3 Entry: DRS Flap Open & 4.2 MJ ERS Overtake Burst",
        "Apex Exit: Late Apex Traction Cut & Defensive Lockout"
    ]
    
    # Generate 15 3D waypoints for the overtake corridor
    waypoints: List[TrajectoryWaypoint] = []
    total_len = circuit.length_km * 1000.0
    
    for k in range(15):
        dist = 1200.0 + k * 65.0
        t = (dist / total_len) * 2 * math.pi * 2.5
        
        # Overtaking lane shifts outside-in
        offset = 4.5 if k > 5 and k < 12 else 0.0
        pos_x = math.sin(t) * 120.0 + offset
        pos_y = math.sin(t * 1.5) * 8.0 + (0.5 if k > 5 else 0.0)
        pos_z = math.cos(t) * 120.0 + offset
        
        ers = "Overtake Burst" if 4 <= k <= 11 else ("Harvest" if k < 4 else "Balanced")
        spd = 312.0 if 5 <= k <= 12 else (180.0 if k < 3 else 285.0)
        
        waypoints.append(TrajectoryWaypoint(
            distance_m=round(dist, 1),
            pos_x=round(pos_x, 2),
            pos_y=round(pos_y, 2),
            pos_z=round(pos_z, 2),
            recommended_speed_kmh=round(spd, 1),
            recommended_ers_mode=ers,
            is_overtake_lane=(4 <= k <= 12)
        ))
        
    risk = "Calculated" if success_prob > 70 else ("Minimal" if success_prob > 85 else "High-Risk")
    
    summary = (
        f"AI Reinforcement Learning Policy recommends staging at Turn {corner_start}. "
        f"Rival driver {driver.name} exhibits {driver.corner_exit_lag_ms:.0f}ms corner-exit lag. "
        f"Deploying {energy_budget} MJ energy budget in Sector {req.target_sector} yields a projected "
        f"{time_gain:.2f}s delta, achieving a {success_prob:.1f}% overtake probability with outside-in corridor trajectory."
    )
    
    return StrategyResponse(
        circuit_id=req.circuit_id,
        recommended_passing_sector=corner_end,
        target_corner=corner_end,
        estimated_pass_lap=req.current_lap,
        success_probability_pct=round(success_prob, 1),
        energy_budget_mj=energy_budget,
        net_time_gain_sec=time_gain,
        engine_mode_sequence=engine_modes,
        overtake_corridor_waypoints=waypoints,
        risk_level=risk,
        ai_tactical_summary=summary
    )

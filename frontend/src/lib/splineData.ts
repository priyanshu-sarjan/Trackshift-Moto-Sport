import * as THREE from 'three';
import { ScrollStage } from '../types/telemetry';

export function createCircuitSplines(circuitId: string = 'sakhir') {
  let basePoints: THREE.Vector3[] = [];
  
  if (circuitId === 'silverstone') {
    basePoints = [
      new THREE.Vector3(-120, 0, -80),
      new THREE.Vector3(-60, 2, -140),
      new THREE.Vector3(40, 5, -120),
      new THREE.Vector3(120, 0, -40),
      new THREE.Vector3(140, -3, 40),
      new THREE.Vector3(80, -1, 110),
      new THREE.Vector3(-20, 3, 130),
      new THREE.Vector3(-100, 1, 60),
      new THREE.Vector3(-140, -2, -10),
    ];
  } else if (circuitId === 'spa') {
    basePoints = [
      new THREE.Vector3(-160, 15, -100),
      new THREE.Vector3(-80, 25, -160),
      new THREE.Vector3(50, 40, -130),
      new THREE.Vector3(150, 10, -50),
      new THREE.Vector3(170, -20, 60),
      new THREE.Vector3(90, -10, 150),
      new THREE.Vector3(-40, 5, 120),
      new THREE.Vector3(-120, 10, 40),
    ];
  } else {
    // Sakhir / Bahrain default
    basePoints = [
      new THREE.Vector3(-100, 0, -70),
      new THREE.Vector3(-40, 3, -130),
      new THREE.Vector3(60, 8, -100),
      new THREE.Vector3(130, 2, -20),
      new THREE.Vector3(110, -4, 70),
      new THREE.Vector3(40, -2, 120),
      new THREE.Vector3(-50, 4, 100),
      new THREE.Vector3(-120, 0, 20),
    ];
  }

  const mainTrackCurve = new THREE.CatmullRomCurve3(basePoints, true, 'centripetal', 0.5);
  
  // AI Optimal Line: Slight inside clip on turns, wide exit
  const optimalPoints = basePoints.map((pt, idx) => {
    const isApex = idx % 2 === 1;
    const offset = isApex ? -3.5 : 2.0;
    return new THREE.Vector3(
      pt.x + (idx % 2 === 0 ? offset : -offset * 0.5),
      pt.y + 0.3,
      pt.z + (idx % 3 === 0 ? offset * 0.8 : -offset)
    );
  });
  const aiOptimalCurve = new THREE.CatmullRomCurve3(optimalPoints, true, 'centripetal', 0.5);

  // Opponent Defending Line: Early apex lock, compromised exit
  const defendingPoints = basePoints.map((pt, idx) => {
    const isDefendZone = idx >= 3 && idx <= 6;
    const offset = isDefendZone ? -6.0 : 1.5;
    return new THREE.Vector3(
      pt.x + offset,
      pt.y + 0.1,
      pt.z + offset * 0.6
    );
  });
  const opponentDefendingCurve = new THREE.CatmullRomCurve3(defendingPoints, true, 'centripetal', 0.5);

  return {
    mainTrackCurve,
    aiOptimalCurve,
    opponentDefendingCurve
  };
}

export const SCROLL_STAGES: ScrollStage[] = [
  {
    id: 'lap-3',
    lapNumber: -3,
    lapLabel: 'LAP -3',
    stageTitle: 'Telemetry Match & Baseline Sync',
    subtitle: 'Correlating Corner-Exit Lag & ERS Harvest Rates',
    description: 'AI model mines telemetry from past 4 Grand Prix seasons. Lock on opponent’s throttle pickup delay (+28ms on Turn 4 exit) and establishes baseline speed delta.',
    ersMode: 'Balanced (Mode 4)',
    speedKmh: 284.5,
    socPct: 68.2,
    socMj: 2.73,
    telemetryNote: 'Telemetry correlated: Opponent exhibits early corner entry lift & battery dump at mid-straight.'
  },
  {
    id: 'lap-2',
    lapNumber: -2,
    lapLabel: 'LAP -2',
    stageTitle: 'Stealth Harvest & Battery Staging',
    subtitle: 'MGU-K Maximum Energy Storage in Slow Sectors',
    description: 'Car shifts into Stealth Harvest mode. Track dims into thermal view while MGU-K captures 125 kW during trail-braking through Turn 9/10 hairpin.',
    ersMode: 'Stealth Harvest (Mode 1)',
    speedKmh: 210.0,
    socPct: 95.4,
    socMj: 3.82,
    telemetryNote: 'Battery SoC surges to 95.4% (3.82 MJ). Max storage achieved for planned multi-lap overtake corridor.'
  },
  {
    id: 'lap-1',
    lapNumber: -1,
    lapLabel: 'LAP -1',
    stageTitle: 'Pressure Feint & Thermal Stressing',
    subtitle: 'Forcing Opponent ERS Dump & Inside Defensive Line',
    description: 'Chassis moves to inside dummy line. Forces defending rival to deploy 1.8 MJ emergency defensive burst early on the straight, inducing tire overheating.',
    ersMode: 'Feint / Staging (Mode 3)',
    speedKmh: 298.2,
    socPct: 88.0,
    socMj: 3.52,
    telemetryNote: 'Rival battery dump detected! Opponent SoC dropped to 22.1%. Defensive apex speed compromised by -8.4 km/h.'
  },
  {
    id: 'lap-0',
    lapNumber: 0,
    lapLabel: 'LAP 0',
    stageTitle: 'The Strike: 4.2 MJ Overtake Corridor',
    subtitle: 'Outside-In Slipstream Execution at Turn 4 Apex',
    description: 'DRS open + 4.2 MJ maximum ERS deployment burst. AI vehicle carries superior momentum around outside curve of Turn 4, completing deterministic overtake before turn-in.',
    ersMode: 'Overtake Burst (Mode 8)',
    speedKmh: 334.8,
    socPct: 45.0,
    socMj: 1.80,
    telemetryNote: 'PASS EXECUTED! Delta to lead: +0.642s. AI policy success probability: 96.8%.'
  }
];

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { FormulaCar3D } from './FormulaCar3D';
import { DynamicHUDOverlay } from './DynamicHUDOverlay';
import { ScrollStage } from '../../types/telemetry';

interface Scrollyteller3DProps {
  scrollProgress: number; // 0.0 to 1.0
  activeStage: ScrollStage;
  aiCurve: THREE.CatmullRomCurve3;
  opponentCurve: THREE.CatmullRomCurve3;
}

export function Scrollyteller3D({
  scrollProgress,
  activeStage,
  aiCurve,
  opponentCurve
}: Scrollyteller3DProps) {
  const { camera } = useThree();
  const playerCarRef = useRef<THREE.Group>(null);
  const opponentCarRef = useRef<THREE.Group>(null);

  // Position vectors for lerp calculation
  const targetCamPos = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    // Determine vehicle progress along the circuit spline based on scrollProgress
    const playerU = Math.min(0.99, Math.max(0.01, scrollProgress * 0.85 + 0.05));
    const playerPos = aiCurve.getPointAt(playerU);
    const playerTangent = aiCurve.getTangentAt(playerU).normalize();

    // Position player car
    if (playerCarRef.current) {
      playerCarRef.current.position.copy(playerPos);
      const lookTarget = playerPos.clone().add(playerTangent);
      playerCarRef.current.lookAt(lookTarget);
    }

    // Position opponent car ahead or behind based on lap stage
    const opponentU = activeStage.id === 'lap-0' 
      ? Math.max(0.01, playerU - 0.04) // Player passed opponent on Lap 0!
      : Math.min(0.99, playerU + 0.035); // Opponent ahead on Laps -3, -2, -1

    const opponentPos = opponentCurve.getPointAt(opponentU);
    const opponentTangent = opponentCurve.getTangentAt(opponentU).normalize();

    if (opponentCarRef.current) {
      opponentCarRef.current.position.copy(opponentPos);
      opponentCarRef.current.lookAt(opponentPos.clone().add(opponentTangent));
    }

    // Camera dynamic behavior based on Scrollytelling Stages:
    if (activeStage.id === 'lap-3') {
      // Stage 1: Close telemetry match zoom
      targetCamPos.current.set(playerPos.x + 8, playerPos.y + 6, playerPos.z + 12);
      targetLookAt.current.copy(playerPos);
    } else if (activeStage.id === 'lap-2') {
      // Stage 2: Stealth Harvest top-down bird's-eye view
      targetCamPos.current.set(playerPos.x, playerPos.y + 35, playerPos.z + 5);
      targetLookAt.current.copy(playerPos);
    } else if (activeStage.id === 'lap-1') {
      // Stage 3: Pressure Feint dual-car side view
      const midPoint = playerPos.clone().add(opponentPos).multiplyScalar(0.5);
      targetCamPos.current.set(midPoint.x + 18, midPoint.y + 12, midPoint.z + 18);
      targetLookAt.current.copy(midPoint);
    } else {
      // Stage 4 (Lap 0): Low-angle dynamic chase camera
      const chaseOffset = playerTangent.clone().multiplyScalar(-14).add(new THREE.Vector3(0, 4.5, 0));
      targetCamPos.current.copy(playerPos).add(chaseOffset);
      targetLookAt.current.copy(playerPos).add(new THREE.Vector3(0, 1.5, 0));
    }

    // Smooth camera interpolation
    camera.position.lerp(targetCamPos.current, delta * 3.5);
    camera.lookAt(targetLookAt.current);
  });

  // Calculate current player position for HUD overlay
  const playerU = Math.min(0.99, Math.max(0.01, scrollProgress * 0.85 + 0.05));
  const currentPos = aiCurve.getPointAt(playerU);

  return (
    <group>
      {/* Player AI Race Car */}
      <group ref={playerCarRef}>
        <FormulaCar3D
          color="#00F5FF"
          isOpponent={false}
          ersMode={activeStage.ersMode}
          speedKmh={activeStage.speedKmh}
        />
      </group>

      {/* Opponent Race Car */}
      <group ref={opponentCarRef}>
        <FormulaCar3D
          color="#FF3B30"
          isOpponent={true}
          ersMode="Balanced"
          speedKmh={activeStage.speedKmh - 12}
        />
      </group>

      {/* Dynamic Floating Telemetry HUD Overlay */}
      <DynamicHUDOverlay
        position={[currentPos.x, currentPos.y, currentPos.z]}
        speedKmh={activeStage.speedKmh}
        throttlePct={activeStage.id === 'lap-2' ? 45 : (activeStage.id === 'lap-0' ? 100 : 92)}
        socPct={activeStage.socPct}
        socMj={activeStage.socMj}
        ersMode={activeStage.ersMode}
        lapLabel={activeStage.lapLabel}
      />
    </group>
  );
}

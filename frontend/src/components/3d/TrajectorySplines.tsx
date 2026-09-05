import React, { useMemo } from 'react';
import * as THREE from 'three';

interface TrajectorySplinesProps {
  aiCurve: THREE.CatmullRomCurve3;
  opponentCurve: THREE.CatmullRomCurve3;
}

export function TrajectorySplines({ aiCurve, opponentCurve }: TrajectorySplinesProps) {
  // Generate 200 points for glowing AI optimal line
  const { aiPoints, opponentPoints, waypointNodes } = useMemo(() => {
    const aiPts = aiCurve.getPoints(200);
    const oppPts = opponentCurve.getPoints(120);
    
    // Generate waypoint nodes along the overtake zone
    const nodes: THREE.Vector3[] = [];
    for (let i = 0.35; i <= 0.65; i += 0.04) {
      nodes.push(aiCurve.getPointAt(i));
    }
    
    return {
      aiPoints: aiPts,
      opponentPoints: oppPts,
      waypointNodes: nodes
    };
  }, [aiCurve, opponentCurve]);

  return (
    <group>
      {/* Green/Cyan Glowing AI Optimal Line */}
      <line>
        <bufferGeometry attach="geometry" {...new THREE.BufferGeometry().setFromPoints(aiPoints)} />
        <lineBasicMaterial
          attach="material"
          color="#00F5FF"
          linewidth={4}
          transparent
          opacity={0.9}
        />
      </line>

      {/* Red Dotted / Dashed Defending Opponent Line */}
      <line>
        <bufferGeometry attach="geometry" {...new THREE.BufferGeometry().setFromPoints(opponentPoints)} />
        <lineDashedMaterial
          attach="material"
          color="#FF3B30"
          linewidth={2}
          dashSize={2}
          gapSize={1.5}
          transparent
          opacity={0.7}
        />
      </line>

      {/* Waypoint Pulse Nodes in Overtake Corridor */}
      {waypointNodes.map((pt, idx) => (
        <mesh key={idx} position={[pt.x, pt.y + 0.4, pt.z]}>
          <sphereGeometry args={[0.35, 12, 12]} />
          <meshStandardMaterial
            color="#39FF14"
            emissive="#39FF14"
            emissiveIntensity={0.8}
            transparent
            opacity={0.85}
          />
        </mesh>
      ))}
    </group>
  );
}

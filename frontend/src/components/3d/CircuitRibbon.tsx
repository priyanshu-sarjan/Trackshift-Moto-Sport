import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';

interface CircuitRibbonProps {
  curve: THREE.CatmullRomCurve3;
}

export function CircuitRibbon({ curve }: CircuitRibbonProps) {
  const { trackGeometry, kerbsGeometry, innerLinePoints, outerLinePoints } = useMemo(() => {
    const segments = 250;
    const trackWidth = 8.0;
    
    const positions: number[] = [];
    const kerbPositions: number[] = [];
    const innerPoints: THREE.Vector3[] = [];
    const outerPoints: THREE.Vector3[] = [];

    const points = curve.getPoints(segments);
    
    for (let i = 0; i <= segments; i++) {
      const u = i / segments;
      const point = curve.getPointAt(u);
      const tangent = curve.getTangentAt(u).normalize();
      const up = new THREE.Vector3(0, 1, 0);
      const normal = new THREE.Vector3().crossVectors(tangent, up).normalize();

      // Inner and outer edges of track ribbon
      const leftPt = point.clone().add(normal.clone().multiplyScalar(trackWidth / 2));
      const rightPt = point.clone().add(normal.clone().multiplyScalar(-trackWidth / 2));

      innerPoints.push(leftPt);
      outerPoints.push(rightPt);

      // Track ribbon quad vertices
      positions.push(leftPt.x, leftPt.y, leftPt.z);
      positions.push(rightPt.x, rightPt.y, rightPt.z);

      // Red/White Kerbs at corners (outer edges)
      const isCorner = Math.sin(u * Math.PI * 8) > 0.4;
      if (isCorner) {
        const kerbWidth = 1.2;
        const kerbLeft = rightPt.clone();
        const kerbRight = rightPt.clone().add(normal.clone().multiplyScalar(-kerbWidth));
        kerbPositions.push(kerbLeft.x, kerbLeft.y + 0.05, kerbLeft.z);
        kerbPositions.push(kerbRight.x, kerbRight.y + 0.05, kerbRight.z);
      }
    }

    // Build ribbon indices
    const indices: number[] = [];
    for (let i = 0; i < segments; i++) {
      const a = i * 2;
      const b = i * 2 + 1;
      const c = (i + 1) * 2;
      const d = (i + 1) * 2 + 1;
      indices.push(a, b, c);
      indices.push(b, d, c);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();

    const kerbGeo = new THREE.BufferGeometry();
    if (kerbPositions.length > 0) {
      const kerbIndices: number[] = [];
      const kerbSegs = (kerbPositions.length / 2) - 1;
      for (let i = 0; i < kerbSegs; i++) {
        const a = i * 2;
        const b = i * 2 + 1;
        const c = (i + 1) * 2;
        const d = (i + 1) * 2 + 1;
        kerbIndices.push(a, b, c);
        kerbIndices.push(b, d, c);
      }
      kerbGeo.setAttribute('position', new THREE.Float32BufferAttribute(kerbPositions, 3));
      kerbGeo.setIndex(kerbIndices);
      kerbGeo.computeVertexNormals();
    }

    return {
      trackGeometry: geo,
      kerbsGeometry: kerbGeo,
      innerLinePoints: innerPoints,
      outerLinePoints: outerPoints
    };
  }, [curve]);

  // Apex turn markers
  const turnMarkers = useMemo(() => {
    const markers = [
      { u: 0.12, label: 'T1 APEX' },
      { u: 0.38, label: 'T4 OUTSIDE' },
      { u: 0.65, label: 'T9 DOWNHILL' },
      { u: 0.88, label: 'T14 MAIN STRAIGHT' },
    ];
    return markers.map(m => {
      const pt = curve.getPointAt(m.u);
      return { ...m, pt };
    });
  }, [curve]);

  return (
    <group>
      {/* Dark Asphalt Circuit Ribbon */}
      <mesh geometry={trackGeometry} receiveShadow>
        <meshStandardMaterial 
          color="#121824" 
          roughness={0.65} 
          metalness={0.4} 
        />
      </mesh>

      {/* Red/White Kerbs */}
      <mesh geometry={kerbsGeometry}>
        <meshStandardMaterial 
          color="#FF3B30" 
          emissive="#FF3B30"
          emissiveIntensity={0.2}
          roughness={0.3} 
        />
      </mesh>

      {/* Glowing Track Limit Lines */}
      <line>
        <bufferGeometry attach="geometry" {...new THREE.BufferGeometry().setFromPoints(innerLinePoints)} />
        <lineBasicMaterial attach="material" color="#00F5FF" linewidth={2} transparent opacity={0.6} />
      </line>
      <line>
        <bufferGeometry attach="geometry" {...new THREE.BufferGeometry().setFromPoints(outerLinePoints)} />
        <lineBasicMaterial attach="material" color="#00F5FF" linewidth={2} transparent opacity={0.6} />
      </line>

      {/* Start/Finish Checker Line */}
      {curve && (
        <mesh position={curve.getPointAt(0)} rotation={[0, 0, 0]}>
          <boxGeometry args={[8.5, 0.1, 1.2]} />
          <meshStandardMaterial color="#FFFFFF" emissive="#00F5FF" emissiveIntensity={0.4} />
        </mesh>
      )}

      {/* Apex 3D Floating Labels */}
      {turnMarkers.map((m, idx) => (
        <group key={idx} position={[m.pt.x, m.pt.y + 4.5, m.pt.z]}>
          <mesh position={[0, -2, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 4, 8]} />
            <meshBasicMaterial color="#00F5FF" transparent opacity={0.5} />
          </mesh>
          <Text
            color="#00F5FF"
            fontSize={1.4}
            maxWidth={10}
            lineHeight={1}
            letterSpacing={0.08}
            textAlign="center"
            anchorX="center"
            anchorY="middle"
          >
            {m.label}
          </Text>
        </group>
      ))}
    </group>
  );
}

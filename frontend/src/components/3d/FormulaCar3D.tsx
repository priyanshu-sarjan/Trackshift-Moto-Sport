import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface FormulaCar3DProps {
  color?: string;
  isOpponent?: boolean;
  ersMode?: string;
  speedKmh?: number;
  scale?: number;
}

export function FormulaCar3D({
  color = '#00F5FF',
  isOpponent = false,
  ersMode = 'Deploy',
  speedKmh = 280,
  scale = 1.0
}: FormulaCar3DProps) {
  const wheelsRef = useRef<THREE.Group>(null);
  const ersAuraRef = useRef<THREE.Mesh>(null);

  // Wheel rotation & ERS pulsing animation
  useFrame((_, delta) => {
    if (wheelsRef.current) {
      const rotSpeed = (speedKmh / 3.6) * delta * 0.5;
      wheelsRef.current.children.forEach(child => {
        child.rotation.x += rotSpeed;
      });
    }
    if (ersAuraRef.current) {
      const isBurst = ersMode.includes('Burst') || ersMode.includes('Deploy');
      const targetScale = isBurst ? 1.25 + Math.sin(Date.now() * 0.01) * 0.08 : 0.9;
      ersAuraRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  const bodyColor = isOpponent ? '#FF3B30' : color;
  const carbonColor = '#10141D';

  return (
    <group scale={[scale, scale, scale]}>
      {/* ERS Energy Pulse Aura Shield */}
      {!isOpponent && (
        <mesh ref={ersAuraRef} position={[0, 0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <capsuleGeometry args={[0.9, 3.8, 8, 16]} />
          <meshBasicMaterial
            color={ersMode.includes('Harvest') ? '#39FF14' : '#00F5FF'}
            transparent
            opacity={ersMode.includes('Burst') ? 0.35 : 0.15}
            wireframe
          />
        </mesh>
      )}

      {/* Main Monocoque Chassis */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[0.85, 0.45, 3.2]} />
        <meshStandardMaterial color={carbonColor} metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Tapered Nosecone */}
      <mesh position={[0, 0.35, 1.9]} rotation={[0.15 + Math.PI / 2, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[0.38, 1.4, 4]} />
        <meshStandardMaterial color={bodyColor} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Cockpit & Driver Helmet */}
      <mesh position={[0, 0.65, 0.1]}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color={isOpponent ? '#FFD700' : '#00F5FF'} metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Titanium Halo Structure */}
      <mesh position={[0, 0.72, 0.3]} rotation={[Math.PI / 6, 0, 0]}>
        <torusGeometry args={[0.32, 0.04, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#4A5568" metalness={0.95} roughness={0.1} />
      </mesh>

      {/* Sidepods & Cooling Vents */}
      <mesh position={[-0.55, 0.4, -0.2]} castShadow>
        <boxGeometry args={[0.4, 0.42, 1.6]} />
        <meshStandardMaterial color={bodyColor} metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0.55, 0.4, -0.2]} castShadow>
        <boxGeometry args={[0.4, 0.42, 1.6]} />
        <meshStandardMaterial color={bodyColor} metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Front Wing Assembly */}
      <group position={[0, 0.2, 2.3]}>
        <mesh castShadow>
          <boxGeometry args={[2.1, 0.06, 0.45]} />
          <meshStandardMaterial color={bodyColor} metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Endplates */}
        <mesh position={[-1.02, 0.15, 0]}>
          <boxGeometry args={[0.04, 0.35, 0.5]} />
          <meshStandardMaterial color={carbonColor} />
        </mesh>
        <mesh position={[1.02, 0.15, 0]}>
          <boxGeometry args={[0.04, 0.35, 0.5]} />
          <meshStandardMaterial color={carbonColor} />
        </mesh>
      </group>

      {/* Rear Wing Assembly & DRS Flap */}
      <group position={[0, 0.9, -1.6]}>
        {/* Lower Element */}
        <mesh castShadow>
          <boxGeometry args={[1.7, 0.06, 0.4]} />
          <meshStandardMaterial color={carbonColor} />
        </mesh>
        {/* Upper DRS Flap (Glowing when active) */}
        <mesh position={[0, 0.25, 0]} castShadow>
          <boxGeometry args={[1.7, 0.06, 0.35]} />
          <meshStandardMaterial
            color={bodyColor}
            emissive={speedKmh > 270 ? bodyColor : '#000000'}
            emissiveIntensity={speedKmh > 270 ? 0.6 : 0}
          />
        </mesh>
        {/* Rear Wing Endplates */}
        <mesh position={[-0.85, 0.1, 0]}>
          <boxGeometry args={[0.04, 0.6, 0.55]} />
          <meshStandardMaterial color={bodyColor} />
        </mesh>
        <mesh position={[0.85, 0.1, 0]}>
          <boxGeometry args={[0.04, 0.6, 0.55]} />
          <meshStandardMaterial color={bodyColor} />
        </mesh>
      </group>

      {/* 4 Wheels & Carbon Rims */}
      <group ref={wheelsRef}>
        {/* Front Left */}
        <group position={[-0.95, 0.35, 1.4]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.35, 0.35, 0.42, 24]} />
            <meshStandardMaterial color="#1A202C" roughness={0.9} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.22, 0.22, 0.43, 16]} />
            <meshBasicMaterial color={bodyColor} />
          </mesh>
        </group>
        {/* Front Right */}
        <group position={[0.95, 0.35, 1.4]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.35, 0.35, 0.42, 24]} />
            <meshStandardMaterial color="#1A202C" roughness={0.9} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.22, 0.22, 0.43, 16]} />
            <meshBasicMaterial color={bodyColor} />
          </mesh>
        </group>
        {/* Rear Left */}
        <group position={[-1.0, 0.38, -1.2]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.38, 0.38, 0.52, 24]} />
            <meshStandardMaterial color="#1A202C" roughness={0.9} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.24, 0.24, 0.53, 16]} />
            <meshBasicMaterial color={bodyColor} />
          </mesh>
        </group>
        {/* Rear Right */}
        <group position={[1.0, 0.38, -1.2]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.38, 0.38, 0.52, 24]} />
            <meshStandardMaterial color="#1A202C" roughness={0.9} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.24, 0.24, 0.53, 16]} />
            <meshBasicMaterial color={bodyColor} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

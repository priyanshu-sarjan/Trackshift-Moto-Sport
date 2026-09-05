import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { CircuitRibbon } from './CircuitRibbon';
import { TrajectorySplines } from './TrajectorySplines';
import { Scrollyteller3D } from './Scrollyteller3D';
import { createCircuitSplines } from '../../lib/splineData';
import { ScrollStage } from '../../types/telemetry';

interface Canvas3DProps {
  circuitId: string;
  scrollProgress: number;
  activeStage: ScrollStage;
}

export function Canvas3D({ circuitId, scrollProgress, activeStage }: Canvas3DProps) {
  const { mainTrackCurve, aiOptimalCurve, opponentDefendingCurve } = useMemo(() => {
    return createCircuitSplines(circuitId);
  }, [circuitId]);

  const isStealthMode = activeStage.id === 'lap-2';

  return (
    <div className="w-full h-full relative overflow-hidden bg-obsidian-950">
      <Canvas
        camera={{ position: [0, 20, 40], fov: 50 }}
        shadows
        gl={{ antialias: true, alpha: false }}
      >
        {/* Atmospheric Fog */}
        <fog attach="fog" args={[isStealthMode ? '#050B14' : '#0B0E14', 20, 180]} />
        
        {/* Sky Background Stars */}
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />

        {/* Ambient & Directional Telemetry Lighting */}
        <ambientLight intensity={isStealthMode ? 0.15 : 0.4} />
        
        {/* Main Sun / Track Light */}
        <directionalLight
          position={[50, 80, 50]}
          intensity={isStealthMode ? 0.3 : 1.2}
          color={isStealthMode ? '#00F5FF' : '#FFFFFF'}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        
        {/* Cyan Neon Ground Fill Light */}
        <pointLight position={[0, 10, 0]} intensity={2.5} color="#00F5FF" distance={120} />
        {/* Acid Green Apex Accent Light */}
        <pointLight position={[40, 15, -100]} intensity={2.0} color="#39FF14" distance={90} />

        {/* 3D Track Ribbon */}
        <CircuitRibbon curve={mainTrackCurve} />

        {/* Trajectory Overlays (AI Optimal & Opponent Lines) */}
        <TrajectorySplines aiCurve={aiOptimalCurve} opponentCurve={opponentDefendingCurve} />

        {/* Vehicle Scrollyteller Controller */}
        <Scrollyteller3D
          scrollProgress={scrollProgress}
          activeStage={activeStage}
          aiCurve={aiOptimalCurve}
          opponentCurve={opponentDefendingCurve}
        />
      </Canvas>

      {/* Glass Corner Overlay Scanline */}
      <div className="absolute inset-0 pointer-events-none border border-cyan-500/10 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]" />
    </div>
  );
}

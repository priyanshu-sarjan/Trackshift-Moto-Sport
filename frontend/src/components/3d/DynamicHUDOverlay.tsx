import React from 'react';
import { Html } from '@react-three/drei';
import { Zap, Gauge, Flame, ShieldAlert } from 'lucide-react';

interface DynamicHUDOverlayProps {
  position: [number, number, number];
  speedKmh: number;
  throttlePct: number;
  socPct: number;
  socMj: number;
  ersMode: string;
  lapLabel: string;
}

export function DynamicHUDOverlay({
  position,
  speedKmh,
  throttlePct,
  socPct,
  socMj,
  ersMode,
  lapLabel
}: DynamicHUDOverlayProps) {
  const isDeploy = ersMode.includes('Burst') || ersMode.includes('Deploy');
  const isHarvest = ersMode.includes('Harvest');

  return (
    <Html position={[position[0], position[1] + 2.8, position[2]]} center distanceFactor={18}>
      <div className="pointer-events-none select-none min-w-[210px] p-3 rounded-xl glass-panel-cyan border border-cyan-400/40 text-slate-100 font-mono shadow-2xl backdrop-blur-md transition-all duration-300">
        {/* Top Header Tag */}
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-1.5 mb-2">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-[10px] font-bold tracking-widest text-cyan-400 font-display">
              {lapLabel} // AI TELEMETRY
            </span>
          </div>
          <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
            isDeploy ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50' : 
            isHarvest ? 'bg-acid-400/20 text-acid-400 border border-acid-400/50' : 
            'bg-slate-800 text-slate-400'
          }`}>
            {ersMode}
          </span>
        </div>

        {/* Telemetry Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          {/* Speed Indicator */}
          <div className="bg-obsidian-950/60 p-1.5 rounded-lg border border-slate-800/80">
            <div className="flex items-center space-x-1 text-slate-400 text-[10px]">
              <Gauge className="w-3 h-3 text-cyan-400" />
              <span>SPEED</span>
            </div>
            <div className="text-base font-bold font-display text-slate-50 mt-0.5">
              {Math.round(speedKmh)} <span className="text-[10px] font-mono text-cyan-400">km/h</span>
            </div>
          </div>

          {/* Throttle % */}
          <div className="bg-obsidian-950/60 p-1.5 rounded-lg border border-slate-800/80">
            <div className="flex items-center space-x-1 text-slate-400 text-[10px]">
              <Flame className="w-3 h-3 text-acid-400" />
              <span>THROTTLE</span>
            </div>
            <div className="text-base font-bold font-display text-acid-400 mt-0.5">
              {Math.round(throttlePct)}<span className="text-[10px] font-mono text-slate-400">%</span>
            </div>
          </div>
        </div>

        {/* Battery SoC Bar */}
        <div className="mt-2.5 bg-obsidian-950/60 p-1.5 rounded-lg border border-slate-800/80">
          <div className="flex items-center justify-between text-[10px] mb-1">
            <span className="flex items-center space-x-1 text-slate-300">
              <Zap className="w-3 h-3 text-gold-400" />
              <span>BATTERY SOC</span>
            </span>
            <span className="text-cyan-400 font-bold">{socPct}% ({socMj} MJ)</span>
          </div>
          {/* Progress bar */}
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                isHarvest ? 'bg-acid-400 shadow-[0_0_8px_#39FF14]' : 
                isDeploy ? 'bg-cyan-400 shadow-[0_0_8px_#00F5FF]' : 
                'bg-gold-400'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, socPct))}%` }}
            />
          </div>
        </div>
      </div>
    </Html>
  );
}

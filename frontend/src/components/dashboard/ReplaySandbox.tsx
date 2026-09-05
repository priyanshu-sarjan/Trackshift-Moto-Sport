import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Zap, Gauge, Flame, ShieldAlert, Award } from 'lucide-react';
import { TelemetryPoint } from '../../types/telemetry';
import { SCROLL_STAGES } from '../../lib/splineData';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface ReplaySandboxProps {
  telemetry: TelemetryPoint[];
}

export function ReplaySandbox({ telemetry }: ReplaySandboxProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(3); // Lap 0 default
  const [isPlaying, setIsPlaying] = useState(false);

  const activeStage = SCROLL_STAGES[currentStepIndex] || SCROLL_STAGES[3];

  // Calculate live telemetry charts slice based on step index
  const chartData = telemetry.slice(0, Math.min(telemetry.length, (currentStepIndex + 1) * 15)).map(t => ({
    dist: `${t.distance_m}m`,
    soc: t.soc_pct,
    throttle: t.throttle_pct,
    brake: t.brake_pct,
    speed: t.speed_kmh
  }));

  // Overtake probability gauge calculation
  const probPercentage = currentStepIndex === 3 ? 96.8 : (currentStepIndex === 2 ? 88.0 : (currentStepIndex === 1 ? 64.2 : 45.0));

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20">
        <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs mb-1">
          <Zap className="w-4 h-4" />
          <span>REAL-TIME STRATEGY REPLAY SANDBOX</span>
        </div>
        <h2 className="font-display text-2xl font-bold text-slate-100">
          Telemetry & Energy Deployment Sandbox
        </h2>
        <p className="text-xs text-slate-400 font-mono mt-1">
          Step through Lap -3 to Lap 0 to observe real-time battery SoC surge, throttle/brake deltas, and overtake success probability.
        </p>
      </div>

      {/* Interactive Lap Timeline Slider */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between font-mono text-xs">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-400/50 hover:bg-cyan-500/30 transition-all"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setCurrentStepIndex(0)}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-200 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <span className="font-display font-bold text-slate-100 text-sm">
              {activeStage.lapLabel}: {activeStage.stageTitle}
            </span>
          </div>

          <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-400/40 font-bold">
            ERS MODE: {activeStage.ersMode}
          </span>
        </div>

        {/* Step Buttons / Slider */}
        <div className="grid grid-cols-4 gap-3">
          {SCROLL_STAGES.map((stg, idx) => (
            <button
              key={stg.id}
              onClick={() => setCurrentStepIndex(idx)}
              className={`p-3 rounded-xl font-mono text-xs text-left transition-all ${
                currentStepIndex === idx
                  ? 'glass-panel-cyan border border-cyan-400 shadow-[0_0_15px_rgba(0,245,255,0.2)]'
                  : 'bg-obsidian-950/60 border border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="font-display font-bold text-cyan-400 mb-0.5">{stg.lapLabel}</div>
              <div className="text-[11px] font-bold text-slate-200 truncate">{stg.stageTitle}</div>
              <div className="text-[10px] text-slate-500 mt-1">SoC: {stg.socPct}%</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Charts & Gauge Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Recharts Telemetry Line Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Battery State of Charge Chart */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-base font-bold text-slate-100 flex items-center space-x-2">
                <Zap className="w-4 h-4 text-gold-400" />
                <span>BATTERY STATE-OF-CHARGE (%) OVER DISTANCE</span>
              </h3>
              <span className="text-xs font-mono text-cyan-400">
                CURRENT SOC: {activeStage.socPct}% ({activeStage.socMj} MJ)
              </span>
            </div>

            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis dataKey="dist" stroke="#64748B" tick={{ fill: '#94A3B8', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
                  <YAxis domain={[0, 100]} stroke="#64748B" tick={{ fill: '#94A3B8', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0B0E14', borderColor: '#FFB300', color: '#F8FAFC' }} />
                  <Line type="monotone" dataKey="soc" name="Battery SoC (%)" stroke="#FFB300" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Throttle & Brake Delta Chart */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-base font-bold text-slate-100 flex items-center space-x-2">
                <Flame className="w-4 h-4 text-acid-400" />
                <span>THROTTLE (%) & BRAKE (%) TELEMETRY DELTAS</span>
              </h3>
            </div>

            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis dataKey="dist" stroke="#64748B" tick={{ fill: '#94A3B8', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
                  <YAxis domain={[0, 100]} stroke="#64748B" tick={{ fill: '#94A3B8', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0B0E14', borderColor: '#39FF14', color: '#F8FAFC' }} />
                  <Line type="monotone" dataKey="throttle" name="Throttle (%)" stroke="#39FF14" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="brake" name="Brake (%)" stroke="#FF3B30" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column: Overtake Success Probability Gauge & Tactical Notes */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 text-center space-y-4">
            <div className="flex items-center justify-center space-x-2 text-cyan-400 font-mono text-xs">
              <Award className="w-4 h-4" />
              <span>AI OVERTAKE PROBABILITY GAUGE</span>
            </div>

            <div className="relative inline-flex items-center justify-center my-4">
              {/* Outer Circular Ring */}
              <svg className="w-44 h-44 transform -rotate-90">
                <circle cx="88" cy="88" r="70" stroke="#1E293B" strokeWidth="12" fill="transparent" />
                <circle
                  cx="88"
                  cy="88"
                  r="70"
                  stroke="#00F5FF"
                  strokeWidth="12"
                  strokeDasharray={440}
                  strokeDashoffset={440 - (440 * probPercentage) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="font-display text-3xl font-black text-slate-100 glow-text-cyan">
                  {probPercentage}%
                </span>
                <span className="text-[10px] font-mono text-slate-400">SUCCESS CONFIDENCE</span>
              </div>
            </div>

            <div className="bg-obsidian-950 p-4 rounded-xl border border-slate-800 text-left font-mono text-xs space-y-2">
              <div className="text-cyan-400 font-bold text-[11px]">TACTICAL CORRIDOR NOTE:</div>
              <p className="text-slate-300 text-[11px] leading-relaxed">{activeStage.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

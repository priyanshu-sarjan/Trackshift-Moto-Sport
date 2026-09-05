import React, { useState } from 'react';
import { ShieldAlert, Zap, Flame, UserCheck, Activity } from 'lucide-react';
import { DriverProfile } from '../../types/telemetry';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

interface DriverProfilerProps {
  drivers: DriverProfile[];
}

export function DriverProfiler({ drivers }: DriverProfilerProps) {
  const [selectedDriverId, setSelectedDriverId] = useState(drivers[0]?.driver_id || 'max_ver');
  const selectedDriver = drivers.find(d => d.driver_id === selectedDriverId) || drivers[0];

  // Apex speed differential comparison chart data
  const chartData = [
    { corner: 'T1 Braking', player: 70, rival: 70 + selectedDriver.apex_speed_delta_kmh },
    { corner: 'T1 Apex', player: 68, rival: 68 + selectedDriver.apex_speed_delta_kmh * 0.5 },
    { corner: 'T2 Acceleration', player: 145, rival: 145 - (selectedDriver.corner_exit_lag_ms * 0.4) },
    { corner: 'T4 Entry', player: 220, rival: 220 + selectedDriver.apex_speed_delta_kmh },
    { corner: 'T4 Outside Apex', player: 120, rival: 120 - 4 },
    { corner: 'Main Straight', player: 310, rival: 310 + (selectedDriver.battery_dump_habit === 'Mid Straight' ? 8 : -2) },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20">
        <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs mb-1">
          <ShieldAlert className="w-4 h-4" />
          <span>BEHAVIORAL CLASSIFICATION ENGINE</span>
        </div>
        <h2 className="font-display text-2xl font-bold text-slate-100">
          Opponent Driver Behavioral Profiler
        </h2>
        <p className="text-xs text-slate-400 font-mono mt-1">
          ML telemetry analysis of rival driver defensive habits, throttle pickup latency, and energy dump signatures.
        </p>
      </div>

      {/* Driver Archetype Cards Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {drivers.map((driver) => {
          const isSelected = driver.driver_id === selectedDriverId;
          return (
            <div
              key={driver.driver_id}
              onClick={() => setSelectedDriverId(driver.driver_id)}
              className={`cursor-pointer p-5 rounded-2xl transition-all duration-300 ${
                isSelected
                  ? 'glass-panel-cyan border border-cyan-400 scale-[1.02] shadow-[0_0_20px_rgba(0,245,255,0.2)]'
                  : 'glass-panel border border-slate-800 hover:border-cyan-500/40'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-display font-black text-slate-950 text-sm"
                  style={{ backgroundColor: driver.avatar_color }}
                >
                  #{driver.number}
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700">
                  {driver.team}
                </span>
              </div>

              <h3 className="font-display text-lg font-bold text-slate-100">{driver.name}</h3>
              <p className="text-xs font-mono text-cyan-400 mt-0.5">{driver.archetype}</p>

              <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>DEFENSIVE AGGRESSION:</span>
                  <span className="text-alert-500 font-bold">{Math.round(driver.defensive_aggression * 100)}%</span>
                </div>
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>CORNER EXIT LAG:</span>
                  <span className="text-acid-400 font-bold">+{driver.corner_exit_lag_ms} ms</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Driver Deep Dive & Throttle Delta Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Behavioral Metrics breakdown */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
          <h3 className="font-display text-base font-bold text-slate-100 flex items-center space-x-2">
            <UserCheck className="w-4 h-4 text-cyan-400" />
            <span>{selectedDriver.name} Profile</span>
          </h3>

          <div className="space-y-4 font-mono text-xs">
            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>DEFENSIVE AGGRESSION RATING</span>
                <span className="text-alert-500 font-bold">{selectedDriver.defensive_aggression * 100}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-alert-500 h-full rounded-full shadow-[0_0_8px_#FF3B30]"
                  style={{ width: `${selectedDriver.defensive_aggression * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-obsidian-950/80 p-3 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[10px]">BATTERY DUMP HABIT</span>
              <p className="text-sm font-bold text-gold-400 flex items-center space-x-1.5">
                <Zap className="w-4 h-4 text-gold-400" />
                <span>{selectedDriver.battery_dump_habit}</span>
              </p>
            </div>

            <div className="bg-obsidian-950/80 p-3 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[10px]">APEX SPEED DIFFERENTIAL</span>
              <p className="text-sm font-bold text-cyan-400 flex items-center space-x-1.5">
                <Flame className="w-4 h-4 text-cyan-400" />
                <span>{selectedDriver.apex_speed_delta_kmh > 0 ? `+${selectedDriver.apex_speed_delta_kmh}` : selectedDriver.apex_speed_delta_kmh} km/h</span>
              </p>
            </div>

            <div className="bg-obsidian-950/80 p-3 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[10px]">CORNER EXIT THROTTLE LAG</span>
              <p className="text-sm font-bold text-acid-400 flex items-center space-x-1.5">
                <Activity className="w-4 h-4 text-acid-400" />
                <span>+{selectedDriver.corner_exit_lag_ms} ms delay</span>
              </p>
            </div>
          </div>
        </div>

        {/* Apex Speed Differential Chart */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-base font-bold text-slate-100 flex items-center space-x-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>APEX SPEED & THROTTLE PICKUP DELTA GRAPH</span>
            </h3>
            <span className="text-xs font-mono text-cyan-400">
              AI BASELINE vs {selectedDriver.name.toUpperCase()}
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPlayer" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00F5FF" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#00F5FF" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorRival" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF3B30" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#FF3B30" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="corner" stroke="#64748B" tick={{ fill: '#94A3B8', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
                <YAxis stroke="#64748B" tick={{ fill: '#94A3B8', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B0E14', borderColor: '#00F5FF', color: '#F8FAFC', borderRadius: '12px' }}
                />
                <Area type="monotone" dataKey="player" name="AI Optimal Line" stroke="#00F5FF" strokeWidth={2} fillOpacity={1} fill="url(#colorPlayer)" />
                <Area type="monotone" dataKey="rival" name={selectedDriver.name} stroke="#FF3B30" strokeWidth={2} fillOpacity={1} fill="url(#colorRival)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Activity, Zap, Cpu, MapPin, Gauge, ShieldAlert } from 'lucide-react';
import { Circuit } from '../../types/telemetry';

interface HeaderNavProps {
  circuits: Circuit[];
  selectedCircuitId: string;
  onSelectCircuit: (id: string) => void;
  activeTab: 'scrollytell' | 'dashboard' | 'sandbox' | 'profiler';
  onSelectTab: (tab: 'scrollytell' | 'dashboard' | 'sandbox' | 'profiler') => void;
  systemStatus: string;
}

export function HeaderNav({
  circuits,
  selectedCircuitId,
  onSelectCircuit,
  activeTab,
  onSelectTab,
  systemStatus
}: HeaderNavProps) {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setTimeStr(d.toUTCString().split(' ')[4] + ' UTC');
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentCircuit = circuits.find(c => c.circuit_id === selectedCircuitId) || circuits[0];

  return (
    <header className="sticky top-0 z-50 w-full bg-obsidian-950/90 backdrop-blur-xl border-b border-cyan-500/20 px-4 py-2.5 flex items-center justify-between text-slate-100 font-mono shadow-2xl">
      {/* Brand Identity & Live Status */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-display font-black text-obsidian-950 text-sm shadow-[0_0_15px_rgba(0,245,255,0.5)]">
            AI
          </div>
          <div>
            <h1 className="font-display text-base font-bold tracking-wider text-slate-100 flex items-center space-x-2">
              <span>APEXINTEL</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-400/40 font-mono">
                PRO v2.4
              </span>
            </h1>
            <p className="text-[10px] text-slate-400 font-mono">F1 Energy & Overtake Intelligence</p>
          </div>
        </div>

        {/* Live System Ticker */}
        <div className="hidden lg:flex items-center space-x-3 px-3 py-1 rounded-lg bg-obsidian-900 border border-slate-800 text-xs">
          <div className="flex items-center space-x-1.5 text-acid-400">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span className="font-bold text-[11px] uppercase tracking-wider">{systemStatus}</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center space-x-1 text-slate-400 text-[11px]">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>RL POLICIES ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs & Circuit Selector */}
      <div className="flex items-center space-x-3">
        {/* Module Switcher Tabs */}
        <div className="flex items-center bg-obsidian-900 p-1 rounded-xl border border-slate-800 text-xs font-medium">
          <button
            onClick={() => onSelectTab('scrollytell')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
              activeTab === 'scrollytell'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400/50 shadow-[0_0_10px_rgba(0,245,255,0.2)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Gauge className="w-3.5 h-3.5" />
            <span>3D HERO VIEW</span>
          </button>

          <button
            onClick={() => onSelectTab('dashboard')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
              activeTab === 'dashboard'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400/50 shadow-[0_0_10px_rgba(0,245,255,0.2)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>PIT-WALL EXPLORER</span>
          </button>

          <button
            onClick={() => onSelectTab('profiler')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
              activeTab === 'profiler'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400/50 shadow-[0_0_10px_rgba(0,245,255,0.2)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>DRIVER PROFILER</span>
          </button>

          <button
            onClick={() => onSelectTab('sandbox')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
              activeTab === 'sandbox'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400/50 shadow-[0_0_10px_rgba(0,245,255,0.2)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>TELEMETRY SANDBOX</span>
          </button>
        </div>

        {/* Historic Circuit Selector Dropdown */}
        <div className="relative">
          <select
            value={selectedCircuitId}
            onChange={(e) => onSelectCircuit(e.target.value)}
            className="bg-obsidian-900 border border-cyan-500/40 text-cyan-400 text-xs rounded-xl px-3 py-1.5 font-mono focus:outline-none focus:border-cyan-400 cursor-pointer shadow-lg"
          >
            {circuits.map(c => (
              <option key={c.circuit_id} value={c.circuit_id} className="bg-obsidian-900 text-slate-100">
                GP: {c.name.split('(')[0]}
              </option>
            ))}
          </select>
        </div>

        {/* UTC Live Broadcast Clock */}
        <div className="hidden md:block text-xs font-mono text-slate-400 border-l border-slate-800 pl-3">
          {timeStr}
        </div>
      </div>
    </header>
  );
}

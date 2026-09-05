import React, { useState } from 'react';
import { MapPin, Trophy, Zap, Shield, Flame, ChevronRight, BarChart3 } from 'lucide-react';
import { Circuit, PassingZone } from '../../types/telemetry';

interface CircuitExplorerProps {
  circuits: Circuit[];
  selectedCircuit: Circuit;
  onSelectCircuit: (id: string) => void;
}

export function CircuitExplorer({
  circuits,
  selectedCircuit,
  onSelectCircuit
}: CircuitExplorerProps) {
  const [selectedSeason, setSelectedSeason] = useState('2025');

  return (
    <div className="w-full space-y-6">
      {/* Top Banner & Season Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-cyan-500/20">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs mb-1">
            <MapPin className="w-4 h-4" />
            <span>CIRCUIT INTELLIGENCE EXPLORER</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-slate-100">
            {selectedCircuit.name}
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Multi-Season Telemetry Aggregation ({selectedSeason} Season Dataset) // {selectedCircuit.country}
          </p>
        </div>

        {/* Season & Circuit Switcher */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-obsidian-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
            {['2022', '2023', '2024', '2025'].map((yr) => (
              <button
                key={yr}
                onClick={() => setSelectedSeason(yr)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  selectedSeason === yr
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400/50 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {yr}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Circuit Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <div className="text-slate-400 text-xs font-mono flex items-center space-x-1.5">
            <Trophy className="w-4 h-4 text-gold-400" />
            <span>LAP RECORD</span>
          </div>
          <div className="text-lg font-bold font-display text-slate-100 mt-2">
            {selectedCircuit.track_record}
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <div className="text-slate-400 text-xs font-mono flex items-center space-x-1.5">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <span>CIRCUIT LENGTH</span>
          </div>
          <div className="text-lg font-bold font-display text-cyan-400 mt-2">
            {selectedCircuit.length_km} <span className="text-xs text-slate-400">km</span>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <div className="text-slate-400 text-xs font-mono flex items-center space-x-1.5">
            <Zap className="w-4 h-4 text-acid-400" />
            <span>RACE LAPS</span>
          </div>
          <div className="text-lg font-bold font-display text-acid-400 mt-2">
            {selectedCircuit.laps} <span className="text-xs text-slate-400">Laps</span>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <div className="text-slate-400 text-xs font-mono flex items-center space-x-1.5">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <span>ELEVATION DELTA</span>
          </div>
          <div className="text-lg font-bold font-display text-slate-100 mt-2">
            +{selectedCircuit.elevation_change_m} <span className="text-xs text-slate-400">m</span>
          </div>
        </div>
      </div>

      {/* Sector Pass Matrix Table */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg font-bold text-slate-100 flex items-center space-x-2">
            <Flame className="w-5 h-5 text-cyan-400" />
            <span>HISTORIC SECTOR PASS MATRIX</span>
          </h3>
          <span className="text-xs font-mono text-cyan-400">
            {selectedCircuit.passing_zones.length} HIGH-CORRELATION ZONES IDENTIFIED
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="border-b border-cyan-500/20 text-slate-400 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">PASSING ZONE</th>
                <th className="py-3 px-4">CORNER RANGE</th>
                <th className="py-3 px-4">DRS ZONE</th>
                <th className="py-3 px-4">HISTORIC PASS SUCCESS %</th>
                <th className="py-3 px-4">ENERGY COST (MJ)</th>
                <th className="py-3 px-4">RIVAL RE-PASS RISK</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {selectedCircuit.passing_zones.map((zone: PassingZone) => (
                <tr key={zone.zone_id} className="hover:bg-cyan-500/5 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-cyan-400 font-display">
                    {zone.zone_id.toUpperCase()}
                  </td>
                  <td className="py-3.5 px-4 text-slate-200">
                    Turn {zone.corner_start} → Turn {zone.corner_end}
                  </td>
                  <td className="py-3.5 px-4">
                    {zone.drs_enabled ? (
                      <span className="px-2 py-0.5 rounded bg-acid-400/20 text-acid-400 border border-acid-400/40 text-[10px] font-bold">
                        DRS ACTIVE
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-500 text-[10px]">
                        NO DRS
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-cyan-400 h-full rounded-full shadow-[0_0_8px_#00F5FF]"
                          style={{ width: `${zone.historic_pass_rate}%` }}
                        />
                      </div>
                      <span className="font-bold text-slate-100">{zone.historic_pass_rate}%</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-gold-400 font-bold">
                    {zone.avg_energy_cost_mj} MJ
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                      zone.re_pass_risk === 'Low' ? 'bg-acid-400/20 text-acid-400 border border-acid-400/40' :
                      zone.re_pass_risk === 'Medium' ? 'bg-gold-400/20 text-gold-400 border border-gold-400/40' :
                      'bg-alert-500/20 text-alert-500 border border-alert-500/40'
                    }`}>
                      {zone.re_pass_risk.toUpperCase()} RISK
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

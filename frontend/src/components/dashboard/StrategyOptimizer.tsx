import React, { useState } from 'react';
import { Cpu, Zap, Award, Target, Flame, ArrowRight, ShieldCheck } from 'lucide-react';
import { StrategyResponse, DriverProfile } from '../../types/telemetry';
import { computeOvertakeStrategy } from '../../lib/api';

interface StrategyOptimizerProps {
  circuitId: string;
  drivers: DriverProfile[];
}

export function StrategyOptimizer({ circuitId, drivers }: StrategyOptimizerProps) {
  const [gapSec, setGapSec] = useState<number>(0.65);
  const [playerSoc, setPlayerSoc] = useState<number>(85.0);
  const [opponentId, setOpponentId] = useState<string>('max_ver');
  const [targetSector, setTargetSector] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<StrategyResponse | null>(null);

  const handleCompute = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await computeOvertakeStrategy({
        circuit_id: circuitId,
        current_lap: 0,
        gap_to_car_ahead_sec: gapSec,
        player_soc_pct: playerSoc,
        opponent_driver_id: opponentId,
        target_sector: targetSector
      });
      setResult(res);
    } catch (err) {
      console.error('Failed to compute strategy:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6 glass-panel p-6 rounded-2xl border border-cyan-500/30 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs mb-1">
            <Cpu className="w-4 h-4 animate-pulse" />
            <span>AI REINFORCEMENT LEARNING ENGINE</span>
          </div>
          <h3 className="font-display text-xl font-bold text-slate-100">
            Real-Time Overtake Strategy Calculator
          </h3>
        </div>
        <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold border border-cyan-400/40">
          FASTAPI BACKEND READY
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form Inputs */}
        <form onSubmit={handleCompute} className="space-y-4 font-mono text-xs">
          <div>
            <label className="block text-slate-300 mb-1 font-bold">GAP TO CAR AHEAD (SECONDS)</label>
            <input
              type="number"
              step="0.05"
              min="0.1"
              max="3.0"
              value={gapSec}
              onChange={(e) => setGapSec(parseFloat(e.target.value))}
              className="w-full bg-obsidian-950 border border-slate-800 rounded-xl px-3 py-2 text-cyan-400 font-bold focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-bold">PLAYER BATTERY SOC (%)</label>
            <input
              type="range"
              min="15"
              max="100"
              value={playerSoc}
              onChange={(e) => setPlayerSoc(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-slate-400 text-[10px] mt-0.5">
              <span>15% (Critical)</span>
              <span className="text-cyan-400 font-bold">{playerSoc}% ({(playerSoc * 0.04).toFixed(2)} MJ)</span>
              <span>100% (Max)</span>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-bold">DEFENDING OPPONENT DRIVER</label>
            <select
              value={opponentId}
              onChange={(e) => setOpponentId(e.target.value)}
              className="w-full bg-obsidian-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-bold focus:border-cyan-400 focus:outline-none cursor-pointer"
            >
              {drivers.map(d => (
                <option key={d.driver_id} value={d.driver_id}>
                  {d.name} ({d.team})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-bold">TARGET ATTACK SECTOR</label>
            <select
              value={targetSector}
              onChange={(e) => setTargetSector(parseInt(e.target.value))}
              className="w-full bg-obsidian-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-bold focus:border-cyan-400 focus:outline-none cursor-pointer"
            >
              <option value={1}>Sector 1 (Heavy Braking Hairpin)</option>
              <option value={2}>Sector 2 (Technical Infield / Sweepers)</option>
              <option value={3}>Sector 3 (DRS Main Straight)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-obsidian-950 font-display font-black text-sm uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(0,245,255,0.4)] flex items-center justify-center space-x-2 cursor-pointer"
          >
            {loading ? (
              <span>RUNNING ML CORRIDOR SIMULATION...</span>
            ) : (
              <>
                <Cpu className="w-4 h-4" />
                <span>COMPUTE OVERTAKE STRATEGY</span>
              </>
            )}
          </button>
        </form>

        {/* Right 2 Columns: Results Panel */}
        <div className="lg:col-span-2 space-y-4">
          {result ? (
            <div className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-obsidian-950 p-4 rounded-xl border border-cyan-500/30 text-center">
                  <div className="text-slate-400 text-[10px]">SUCCESS PROBABILITY</div>
                  <div className="text-2xl font-bold font-display text-cyan-400 mt-1">
                    {result.success_probability_pct}%
                  </div>
                </div>

                <div className="bg-obsidian-950 p-4 rounded-xl border border-gold-500/30 text-center">
                  <div className="text-slate-400 text-[10px]">ENERGY BUDGET</div>
                  <div className="text-2xl font-bold font-display text-gold-400 mt-1">
                    {result.energy_budget_mj} MJ
                  </div>
                </div>

                <div className="bg-obsidian-950 p-4 rounded-xl border border-acid-500/30 text-center">
                  <div className="text-slate-400 text-[10px]">PROJECTED DELTA</div>
                  <div className="text-2xl font-bold font-display text-acid-400 mt-1">
                    -{result.net_time_gain_sec} s
                  </div>
                </div>
              </div>

              {/* Recommended Engine Sequence */}
              <div className="bg-obsidian-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="text-slate-400 text-[11px] font-bold flex items-center space-x-1.5">
                  <Flame className="w-4 h-4 text-cyan-400" />
                  <span>RECOMMENDED ERS ENGINE MODE STAGING</span>
                </div>
                <div className="space-y-1.5">
                  {result.engine_mode_sequence.map((seq, i) => (
                    <div key={i} className="flex items-center space-x-2 text-slate-200 text-[11px]">
                      <ArrowRight className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span>{seq}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Tactical Summary */}
              <div className="bg-cyan-500/10 p-4 rounded-xl border border-cyan-400/40 text-cyan-300 text-[11px] leading-relaxed">
                <div className="font-bold mb-1 flex items-center space-x-1.5 text-cyan-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>AI POLICY DIRECTIVE</span>
                </div>
                {result.ai_tactical_summary}
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[220px] bg-obsidian-950/60 rounded-xl border border-slate-800 flex flex-col items-center justify-center p-6 text-center text-slate-500 font-mono text-xs">
              <Target className="w-10 h-10 text-slate-700 mb-2" />
              <p>Configure parameters on the left and click "COMPUTE OVERTAKE STRATEGY" to calculate multi-lap battery deployment corridors.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { HeaderNav } from '../components/dashboard/HeaderNav';
import { CircuitExplorer } from '../components/dashboard/CircuitExplorer';
import { DriverProfiler } from '../components/dashboard/DriverProfiler';
import { ReplaySandbox } from '../components/dashboard/ReplaySandbox';
import { StrategyOptimizer } from '../components/dashboard/StrategyOptimizer';
import { fetchCircuits, fetchDrivers, fetchTelemetry } from '../lib/api';
import { Circuit, DriverProfile, TelemetryPoint } from '../types/telemetry';
import { SCROLL_STAGES } from '../lib/splineData';
import { Zap, Gauge, MapPin, ChevronDown, Award } from 'lucide-react';

// Dynamic import for R3F Canvas3D with SSR disabled
const Canvas3D = dynamic(() => import('../components/3d/Canvas3D').then(m => m.Canvas3D), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-obsidian-950 flex flex-col items-center justify-center text-cyan-400 font-mono text-xs">
      <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mb-3" />
      <span>INITIALIZING 3D TELEMETRY SCROLL ENGINE...</span>
    </div>
  )
});

export default function Home() {
  const [circuits, setCircuits] = useState<Circuit[]>([]);
  const [drivers, setDrivers] = useState<DriverProfile[]>([]);
  const [telemetry, setTelemetry] = useState<TelemetryPoint[]>([]);
  const [selectedCircuitId, setSelectedCircuitId] = useState<string>('sakhir');
  const [activeTab, setActiveTab] = useState<'scrollytell' | 'dashboard' | 'sandbox' | 'profiler'>('scrollytell');
  
  // Scroll stage calculation (0.0 to 1.0)
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [currentStageIdx, setCurrentStageIdx] = useState<number>(0);
  const heroContainerRef = useRef<HTMLDivElement>(null);

  // Load initial data from backend API
  useEffect(() => {
    async function loadData() {
      const circs = await fetchCircuits();
      const drvs = await fetchDrivers();
      setCircuits(circs);
      setDrivers(drvs);
      if (circs.length > 0) {
        setSelectedCircuitId(circs[0].circuit_id);
      }
    }
    loadData();
  }, []);

  // Fetch telemetry whenever selected circuit changes
  useEffect(() => {
    async function loadTelem() {
      if (selectedCircuitId) {
        const data = await fetchTelemetry(selectedCircuitId, 'max_ver');
        setTelemetry(data);
      }
    }
    loadTelem();
  }, [selectedCircuitId]);

  // Handle scroll stage observation
  useEffect(() => {
    const handleScroll = () => {
      if (heroContainerRef.current) {
        const rect = heroContainerRef.current.getBoundingClientRect();
        const totalScroll = heroContainerRef.current.scrollHeight - window.innerHeight;
        if (totalScroll > 0) {
          const current = Math.min(1, Math.max(0, -rect.top / totalScroll));
          setScrollProgress(current);

          if (current < 0.25) setCurrentStageIdx(0);
          else if (current < 0.5) setCurrentStageIdx(1);
          else if (current < 0.75) setCurrentStageIdx(2);
          else setCurrentStageIdx(3);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const selectedCircuit = circuits.find(c => c.circuit_id === selectedCircuitId) || circuits[0];
  const activeStage = SCROLL_STAGES[currentStageIdx] || SCROLL_STAGES[0];

  return (
    <div className="min-h-screen bg-obsidian-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-400 selection:text-obsidian-950">
      {/* Top Header Navigation */}
      <HeaderNav
        circuits={circuits}
        selectedCircuitId={selectedCircuitId}
        onSelectCircuit={setSelectedCircuitId}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        systemStatus="TELEMETRY TELEPATHY CONNECTED"
      />

      {/* Main Content Render based on Active Tab */}
      {activeTab === 'scrollytell' && (
        <main ref={heroContainerRef} className="relative w-full">
          {/* Sticky Fullscreen 3D Viewport */}
          <div className="sticky top-[57px] w-full h-[calc(100vh-57px)] z-10">
            <Canvas3D
              circuitId={selectedCircuitId}
              scrollProgress={scrollProgress}
              activeStage={activeStage}
            />

            {/* Overlaid Scrollytelling Stage HUD Card */}
            <div className="absolute top-6 left-6 z-20 max-w-md pointer-events-none">
              <div className="p-5 rounded-2xl glass-panel-cyan border border-cyan-400/40 font-mono shadow-2xl backdrop-blur-xl space-y-2.5">
                <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                    <span className="font-display text-xs font-bold text-cyan-400 tracking-wider">
                      {activeStage.lapLabel}: {activeStage.stageTitle}
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-400/40">
                    STAGE {currentStageIdx + 1} / 4
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-100 font-display">
                  {activeStage.subtitle}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeStage.description}
                </p>

                <div className="pt-2 border-t border-cyan-500/20 text-[11px] text-cyan-400 font-bold flex items-center space-x-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  <span>{activeStage.telemetryNote}</span>
                </div>
              </div>
            </div>

            {/* Bottom Scroll Prompt Indicator */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none opacity-80 animate-bounce">
              <span className="text-[10px] font-mono text-cyan-400 tracking-widest uppercase mb-1">
                SCROLL TO ADVANCE LAP STAGES
              </span>
              <ChevronDown className="w-4 h-4 text-cyan-400" />
            </div>
          </div>

          {/* Vertical Scroll Height Triggers (4 Lap Stages) */}
          <div className="relative z-0">
            {/* Stage 1 Trigger */}
            <div className="h-screen flex items-end p-8">
              <div className="max-w-lg glass-panel p-6 rounded-2xl border border-slate-800 font-mono text-xs space-y-2">
                <span className="text-cyan-400 font-bold">LAP -3 TELEMETRY MATCH</span>
                <p className="text-slate-300">Mining 4-season Grand Prix telemetry to extract rival driver corner-exit lag and baseline acceleration profiles.</p>
              </div>
            </div>

            {/* Stage 2 Trigger */}
            <div className="h-screen flex items-end p-8">
              <div className="max-w-lg glass-panel p-6 rounded-2xl border border-slate-800 font-mono text-xs space-y-2">
                <span className="text-acid-400 font-bold">LAP -2 STEALTH HARVEST</span>
                <p className="text-slate-300">Recharging battery SoC to 95.4% (3.82 MJ) via MGU-K trail-braking in low-speed hairpins.</p>
              </div>
            </div>

            {/* Stage 3 Trigger */}
            <div className="h-screen flex items-end p-8">
              <div className="max-w-lg glass-panel p-6 rounded-2xl border border-slate-800 font-mono text-xs space-y-2">
                <span className="text-alert-500 font-bold">LAP -1 PRESSURE FEINT</span>
                <p className="text-slate-300">Forcing opponent to deploy emergency defensive ERS dump, overheating rival rear tires.</p>
              </div>
            </div>

            {/* Stage 4 Trigger */}
            <div className="h-screen flex items-end p-8">
              <div className="max-w-lg glass-panel p-6 rounded-2xl border border-cyan-500/30 font-mono text-xs space-y-2">
                <span className="text-cyan-400 font-bold">LAP 0 THE STRIKE</span>
                <p className="text-slate-300">DRS Flap open + 4.2 MJ ERS burst carrying superior momentum around Turn 4 outside-in corridor.</p>
              </div>
            </div>
          </div>

          {/* Pit-Wall Intelligence Sections below 3D viewport */}
          <div className="relative z-20 max-w-7xl mx-auto px-6 py-16 space-y-16 bg-obsidian-950">
            {/* Live Overtake Strategy Optimizer Form */}
            <StrategyOptimizer circuitId={selectedCircuitId} drivers={drivers} />

            {/* Historic Circuit Explorer */}
            {selectedCircuit && (
              <CircuitExplorer
                circuits={circuits}
                selectedCircuit={selectedCircuit}
                onSelectCircuit={setSelectedCircuitId}
              />
            )}
          </div>
        </main>
      )}

      {/* Tab 2: Pit-Wall Explorer */}
      {activeTab === 'dashboard' && selectedCircuit && (
        <main className="max-w-7xl mx-auto w-full px-6 py-8">
          <CircuitExplorer
            circuits={circuits}
            selectedCircuit={selectedCircuit}
            onSelectCircuit={setSelectedCircuitId}
          />
        </main>
      )}

      {/* Tab 3: Driver Profiler */}
      {activeTab === 'profiler' && (
        <main className="max-w-7xl mx-auto w-full px-6 py-8">
          <DriverProfiler drivers={drivers} />
        </main>
      )}

      {/* Tab 4: Telemetry Sandbox */}
      {activeTab === 'sandbox' && (
        <main className="max-w-7xl mx-auto w-full px-6 py-8">
          <ReplaySandbox telemetry={telemetry} />
        </main>
      )}

      {/* Enterprise Footer */}
      <footer className="w-full bg-obsidian-950 border-t border-slate-800/80 py-8 px-6 text-center font-mono text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="font-display font-bold text-slate-300">APEXINTEL PLATFORM</span>
            <span>// F1 Energy & Overtake Intelligence</span>
          </div>
          <p>© 2026 ApexIntel AI Systems. All telemetry metrics calculated via Reinforcement Learning policies.</p>
        </div>
      </footer>
    </div>
  );
}

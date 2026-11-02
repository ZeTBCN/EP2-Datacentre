import React, { useState, useMemo } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Sliders,
  ArrowUpRight,
  Droplets,
  ShieldCheck,
  Flame,
  Zap,
  Layers,
} from 'lucide-react';
import {
  DEFAULT_SIMULATION_PARAMS,
  SimulationParams,
  CoolingTopologyId,
  COOLING_TOPOLOGIES,
  calculateDistrictThermodynamics,
} from './utils/thermodynamics';
import {
  SCHEMATIC_NODES,
  SchematicNodeData,
  FlowCategory,
} from './data/schematicNodes';
import { FlowSchematicCanvas } from './components/FlowSchematicCanvas';
import { NodeSpecModal } from './components/NodeSpecModal';
import { CoolingComparisonDrawer } from './components/CoolingComparisonDrawer';
import { EconomicsAndCarbonGraphs } from './components/EconomicsAndCarbonGraphs';
import { PlumeAndVibrationDiagrams } from './components/PlumeAndVibrationDiagrams';

const FLOW_FILTER_OPTIONS: { id: FlowCategory; label: string }[] = [
  { id: 'all', label: 'All Thermal & Fluid Flows' },
  { id: 'tier1-passive', label: 'Tier 1 Passive (50–60°C)' },
  { id: 'tier2-boosted', label: 'Tier 2 HTHP (85–130°C)' },
  { id: 'electrical-orc', label: 'Grid & ORC/TEG Power' },
  { id: 'hydrological', label: 'Rainwater Sink Loop' },
];

export default function App() {
  const [params, setParams] = useState<SimulationParams>(DEFAULT_SIMULATION_PARAMS);
  const [selectedNode, setSelectedNode] = useState<SchematicNodeData | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [activeFlowFilter, setActiveFlowFilter] = useState<FlowCategory>('all');
  const [isAnimationPlaying, setIsAnimationPlaying] = useState<boolean>(true);
  const [isReferenceModalOpen, setIsReferenceModalOpen] = useState<boolean>(false);

  const results = useMemo(() => calculateDistrictThermodynamics(params), [params]);

  const handleResetParams = () => {
    setParams(DEFAULT_SIMULATION_PARAMS);
    setActiveFlowFilter('all');
  };

  const appendixNode = SCHEMATIC_NODES.find(
    (n) => n.id === 'bidirectional-vibration-isolation'
  )!;

  return (
    <div className="min-h-screen flex flex-col bg-[#181C24] text-[#C8D0DC]">
      {/* Strict 3-Zone Top Bar Contract (Low-Contrast Dark Slate) */}
      <header className="sticky top-0 z-30 flex items-center justify-between gap-8 px-6 py-3.5 bg-[#181C24]/95 backdrop-blur border-b border-[#2B3240]">
        {/* Zone 1: Brand Wordmark (single text element) */}
        <a
          href="#top"
          className="text-lg font-bold tracking-tight text-[#D5DEE8] whitespace-nowrap shrink-0"
        >
          ThermoVault 2045
        </a>

        {/* Zone 2: 5 Single-Line Navigation Links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-[#8A94A6]"
        >
          <a
            href="#schematic-workspace"
            className="hover:text-[#D5DEE8] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Flow Schematic
          </a>
          <a
            href="#economics-carbon"
            className="hover:text-[#D5DEE8] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Expenditure &amp; CO₂
          </a>
          <a
            href="#appendix-vibration"
            className="hover:text-[#D5DEE8] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Vibration &amp; Placement
          </a>
          <a
            href="#subsystems"
            className="hover:text-[#D5DEE8] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Subsystems
          </a>
          <a
            href="#cooling-matrix"
            className="hover:text-[#D5DEE8] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Cooling &amp; Hydrology
          </a>
        </nav>

        {/* Zone 3: 1 Primary Action Button */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={() => setIsReferenceModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-[#D5DEE8] bg-[#2C3A4E] border border-[#415673] hover:bg-[#34465E] transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            Engineering Dossier &amp; Blueprint
          </button>
        </div>
      </header>

      <main id="top" className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
        {/* Hero Header + Quantitative Telemetry Ribbon */}
        <section className="space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-5 border-b border-[#2B3240]">
            <div className="space-y-2 max-w-3xl">
              {/* Unboxed Metadata Line */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#8A94A6]">
                <span>2045 Urban District Architecture</span>
                <span aria-hidden="true">·</span>
                <span>Level -3 / -4 Bedrock Plaza Placement</span>
                <span aria-hidden="true">·</span>
                <span>11 Interactive Subsystem Nodes</span>
              </div>
              <h1
                className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#D5DEE8]"
                style={{ textWrap: 'balance' }}
              >
                Subterranean Data Centre Waste-Heat Recovery, 5GDHC &amp; Bidirectional Vibration Isolation Schematic
              </h1>
              <p className="text-sm sm:text-base text-[#9BA5B4] leading-relaxed max-w-2xl">
                Interactive thermodynamic and structural flow model coupling {params.computeCapacityMw} MW of base-isolated Level -3/-4 liquid-cooled compute beneath pedestrian plazas with a 5GDHC network, Lorentz-cycle HTHP boosters, and a 100,000 m³/year rainwater thermal sink.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setSelectedNode(SCHEMATIC_NODES[0])}
                className="px-4 py-2.5 text-xs font-mono font-semibold text-[#D5DEE8] bg-[#2C3A4E] border border-[#456180] hover:bg-[#354860] transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
              >
                Inspect Vault Specs (Node 01)
                <ArrowUpRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setSelectedNode(appendixNode)}
                className="px-4 py-2.5 text-xs font-mono font-semibold text-[#C8D0DC] bg-[#212733] border border-[#343E50] hover:bg-[#28303E] transition-colors cursor-pointer whitespace-nowrap"
              >
                Inspect Vibration Isolation (Node 11)
              </button>
            </div>
          </div>

          {/* 4-Column Full-Width Quantitative KPI Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-[#1E232D] border border-[#2B3240]">
              <div className="text-xs font-mono uppercase tracking-wider text-[#8A94A6]">
                Annual Basal Thermal Capture
              </div>
              <div className="mt-1.5 flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-mono font-bold text-[#D5DEE8] tabular-nums">
                  {results.annualThermalOutputMwh.toLocaleString()}
                </span>
                <span className="text-xs font-mono text-[#8A94A6]">MWh/yr</span>
              </div>
              <div className="mt-1.5 text-xs font-mono text-[#6DB39F]">
                ● {results.capturedThermalMw} MW_th continuous @ {results.coolantOutletTempC}°C outlet
              </div>
            </div>

            <div className="p-4 bg-[#1E232D] border border-[#2B3240]">
              <div className="text-xs font-mono uppercase tracking-wider text-[#8A94A6]">
                20,000-Resident NZEB Demand Coverage
              </div>
              <div className="mt-1.5 flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-mono font-bold text-[#D5DEE8] tabular-nums">
                  {results.districtDemandCoveragePercent}%
                </span>
                <span className="text-xs font-mono text-[#8A94A6]">
                  of {results.totalDistrictAnnualDemandMwh.toLocaleString()} MWh/yr
                </span>
              </div>
              <div className="mt-1.5 text-xs font-mono text-[#7CA8D4]">
                ◆ {results.annualDhwDemandMwh.toLocaleString()} MWh DHW + {results.annualSpaceHeatingDemandMwh.toLocaleString()} MWh Space
              </div>
            </div>

            <div className="p-4 bg-[#1E232D] border border-[#2B3240]">
              <div className="text-xs font-mono uppercase tracking-wider text-[#8A94A6]">
                Power Recuperated &amp; Residential Coverage
              </div>
              <div className="mt-1.5 flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-mono font-bold text-[#D5DEE8] tabular-nums">
                  {results.annualRecuperatedElectricMwh.toLocaleString()}
                </span>
                <span className="text-xs font-mono text-[#8A94A6]">
                  MWh/yr · <strong className="text-[#6DB39F]">{results.residentialPowerCoveragePercent}%</strong> Res. Power
                </span>
              </div>
              <div className="mt-1.5 text-xs font-mono text-[#7CA8D4]">
                ● {results.totalRecuperatedElectricalKw.toLocaleString()} kW_e reclaimed (ORC {results.orcEfficiencyPercent}% η + ZT {results.tegZtFigureOfMerit} TEG)
              </div>
            </div>

            <div className="p-4 bg-[#1E232D] border border-[#2B3240]">
              <div className="text-xs font-mono uppercase tracking-wider text-[#8A94A6]">
                Subterranean Placement &amp; Isolation
              </div>
              <div className="mt-1.5 flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-mono font-bold text-[#D5DEE8] tabular-nums">
                  -{results.trenchVibrationReductionPercent}%
                </span>
                <span className="text-xs font-mono text-[#8A94A6]">
                  ΔA (1.0m Foam Trench)
                </span>
              </div>
              <div className="mt-1.5 text-xs font-mono text-[#6DB39F]">
                ● Level -3/-4 Bedrock · Taylor Fluid Viscous Dampers
              </div>
            </div>
          </div>
        </section>

        {/* Main Interactive Two-Zone Sandbox (Flow Schematic Stage + Control Console) */}
        <section id="schematic-workspace" className="space-y-4">
          {/* Interactive Flow Filter & Playback Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#1E232D] p-3 border border-[#2B3240]">
            <div
              role="group"
              aria-label="Filter schematic flow pathways"
              className="flex flex-wrap items-center gap-1.5"
            >
              {FLOW_FILTER_OPTIONS.map((tab) => {
                const isActive = activeFlowFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveFlowFilter(tab.id)}
                    className={`px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-[#2E3E52] text-[#D5DEE8] border border-[#5B9BD5] font-semibold'
                        : 'bg-[#181C24] text-[#9BA5B4] border border-[#2B3240] hover:bg-[#232935] hover:text-[#C8D0DC]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAnimationPlaying((prev) => !prev)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium text-[#C8D0DC] bg-[#181C24] border border-[#2B3240] hover:bg-[#232935] transition-colors cursor-pointer whitespace-nowrap"
              >
                {isAnimationPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    Pause Flow Pulse
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    Resume Flow Pulse
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleResetParams}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium text-[#C8D0DC] bg-[#181C24] border border-[#2B3240] hover:bg-[#232935] transition-colors cursor-pointer whitespace-nowrap"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset 2045 Baseline
              </button>
            </div>
          </div>

          {/* Split Console Grid: Left 8/12 Schematic Canvas, Right 4/12 Parameter Deck */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            <div className="xl:col-span-8">
              <FlowSchematicCanvas
                params={params}
                results={results}
                selectedNodeId={selectedNode?.id ?? null}
                hoveredNodeId={hoveredNodeId}
                activeFlowFilter={activeFlowFilter}
                isAnimationPlaying={isAnimationPlaying}
                onSelectNode={(node) => setSelectedNode(node)}
                onHoverNode={(id) => setHoveredNodeId(id)}
              />
            </div>

            {/* Right Control & Parameter Deck */}
            <aside
              aria-label="Thermodynamic Simulation Parameter Controls"
              className="xl:col-span-4 bg-[#1E232D] border border-[#2B3240] p-5 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-[#2B3240] pb-3">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#7CA8D4]" />
                  <h2 className="text-sm font-bold text-[#D5DEE8] uppercase font-mono">
                    District Parameter Deck
                  </h2>
                </div>
                <span className="text-xs font-mono text-[#6DB39F] font-semibold">
                  ● LIVE SOLVER
                </span>
              </div>

              {/* Cooling Topology Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-mono uppercase text-[#8A94A6] font-semibold">
                  1. Subterranean Liquid Cooling Topology
                </label>
                <div className="grid grid-cols-1 gap-1.5">
                  {Object.values(COOLING_TOPOLOGIES).map((top) => {
                    const active = params.coolingTopology === top.id;
                    return (
                      <button
                        key={top.id}
                        type="button"
                        onClick={() =>
                          setParams((p) => ({
                            ...p,
                            coolingTopology: top.id as CoolingTopologyId,
                          }))
                        }
                        className={`p-2.5 text-left border transition-colors cursor-pointer ${
                          active
                            ? 'bg-[#263345] text-[#D5DEE8] border-[#5B9BD5]'
                            : 'bg-[#181C24] text-[#C8D0DC] border-[#2B3240] hover:bg-[#222834]'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span>{top.name}</span>
                          <span className="font-mono text-[11px] text-[#7CA8D4]">
                            PUE {top.pueNominal} · {top.outletTempNominal}°C
                          </span>
                        </div>
                        <div className="text-[11px] font-mono mt-0.5 text-[#8A94A6]">
                          Flow: {top.flowRatePerKwMin}–{top.flowRatePerKwMax} L/min/kW · CHF {top.criticalHeatFluxWcm2} W/cm²
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Parameter Sliders */}
              <div className="space-y-4 pt-2 border-t border-[#2B3240]">
                {/* Compute Capacity MW */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="slider-compute-mw" className="font-medium text-[#9BA5B4]">
                      Vault Compute Load
                    </label>
                    <span className="font-mono font-semibold text-[#D5DEE8]">
                      {params.computeCapacityMw} MW ({results.activeRackCount} racks)
                    </span>
                  </div>
                  <input
                    id="slider-compute-mw"
                    type="range"
                    min={2}
                    max={20}
                    step={1}
                    value={params.computeCapacityMw}
                    onChange={(e) =>
                      setParams((p) => ({ ...p, computeCapacityMw: Number(e.target.value) }))
                    }
                    className="w-full accent-[#5B9BD5] cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] font-mono text-[#6E7889]">
                    <span>2 MW</span>
                    <span>10 MW (Baseline)</span>
                    <span>20 MW</span>
                  </div>
                </div>

                {/* Rack Power Density */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="slider-rack-density" className="font-medium text-[#9BA5B4]">
                      2045 Rack Power Density
                    </label>
                    <span className="font-mono font-semibold text-[#D5DEE8]">
                      {params.rackDensityKw} kW/rack
                    </span>
                  </div>
                  <input
                    id="slider-rack-density"
                    type="range"
                    min={120}
                    max={250}
                    step={5}
                    value={params.rackDensityKw}
                    onChange={(e) =>
                      setParams((p) => ({ ...p, rackDensityKw: Number(e.target.value) }))
                    }
                    className="w-full accent-[#5B9BD5] cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] font-mono text-[#6E7889]">
                    <span>120 kW (GB200)</span>
                    <span>200–250 kW (2045 Target)</span>
                  </div>
                </div>

                {/* District Resident Count */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="slider-residents" className="font-medium text-[#9BA5B4]">
                      Urban District Population
                    </label>
                    <span className="font-mono font-semibold text-[#D5DEE8]">
                      {params.residentsCount.toLocaleString()} residents
                    </span>
                  </div>
                  <input
                    id="slider-residents"
                    type="range"
                    min={5000}
                    max={35000}
                    step={1000}
                    value={params.residentsCount}
                    onChange={(e) =>
                      setParams((p) => ({ ...p, residentsCount: Number(e.target.value) }))
                    }
                    className="w-full accent-[#5B9BD5] cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] font-mono text-[#6E7889]">
                    <span>5,000</span>
                    <span>20,000 (8,000 homes)</span>
                    <span>35,000</span>
                  </div>
                </div>

                {/* 5GDHC Twin Pipe Separation */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="slider-pipe-sep" className="font-medium text-[#9BA5B4]">
                      5GDHC Twin-Pipe Spacing
                    </label>
                    <span
                      className={`font-mono font-semibold ${
                        params.pipeSeparationCm >= 80 ? 'text-[#6DB39F]' : 'text-[#C89B54]'
                      }`}
                    >
                      {params.pipeSeparationCm} cm{' '}
                      {params.pipeSeparationCm >= 80
                        ? '(Optimal ≥80cm)'
                        : `(-${results.pipeThermalInterferencePenaltyPercent}% Plume Loss)`}
                    </span>
                  </div>
                  <input
                    id="slider-pipe-sep"
                    type="range"
                    min={30}
                    max={120}
                    step={5}
                    value={params.pipeSeparationCm}
                    onChange={(e) =>
                      setParams((p) => ({ ...p, pipeSeparationCm: Number(e.target.value) }))
                    }
                    className="w-full accent-[#5B9BD5] cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] font-mono text-[#6E7889]">
                    <span>30 cm (Plume Overlap)</span>
                    <span>80 cm Threshold</span>
                    <span>120 cm</span>
                  </div>
                </div>

                {/* HTHP Boost Temperature */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="slider-hthp-temp" className="font-medium text-[#9BA5B4]">
                      Tier 2 HTHP Boost Target
                    </label>
                    <span className="font-mono font-semibold text-[#D5DEE8]">
                      {params.hthpTargetTempC} °C
                    </span>
                  </div>
                  <input
                    id="slider-hthp-temp"
                    type="range"
                    min={85}
                    max={130}
                    step={5}
                    value={params.hthpTargetTempC}
                    onChange={(e) =>
                      setParams((p) => ({ ...p, hthpTargetTempC: Number(e.target.value) }))
                    }
                    className="w-full accent-[#5B9BD5] cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] font-mono text-[#6E7889]">
                    <span>85 °C (DHW Pasteurisation)</span>
                    <span>130 °C (Industrial Steam)</span>
                  </div>
                </div>

                {/* Seasonal Drought Buffer Days */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="slider-drought-days" className="font-medium text-[#9BA5B4]">
                      Seasonal Drought Buffer Design
                    </label>
                    <span className="font-mono font-semibold text-[#D5DEE8]">
                      {params.droughtDurationDays} days ({results.requiredDroughtStorageM3.toLocaleString()} m³)
                    </span>
                  </div>
                  <input
                    id="slider-drought-days"
                    type="range"
                    min={20}
                    max={60}
                    step={5}
                    value={params.droughtDurationDays}
                    onChange={(e) =>
                      setParams((p) => ({ ...p, droughtDurationDays: Number(e.target.value) }))
                    }
                    className="w-full accent-[#5B9BD5] cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] font-mono text-[#6E7889]">
                    <span>30d (8,220 m³)</span>
                    <span>45d (12,330 m³)</span>
                    <span>60d</span>
                  </div>
                </div>

                {/* Lorentz Cycle Toggle */}
                <div className="pt-2 border-t border-[#2B3240] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-[#C8D0DC]">
                      Non-Isothermal Lorentz Cycle HTHP
                    </div>
                    <div className="text-[11px] font-mono text-[#8A94A6]">
                      Boosts natural refrigerant efficiency by +25–30%
                    </div>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={params.useLorentzCycle}
                    onClick={() =>
                      setParams((p) => ({ ...p, useLorentzCycle: !p.useLorentzCycle }))
                    }
                    className={`px-3 py-1.5 text-xs font-mono font-semibold border transition-colors cursor-pointer ${
                      params.useLorentzCycle
                        ? 'bg-[#263C38] text-[#86C4B5] border-[#426E65]'
                        : 'bg-[#181C24] text-[#8A94A6] border-[#2B3240]'
                    }`}
                  >
                    {params.useLorentzCycle ? 'ENABLED (+27.5%)' : 'STANDARD'}
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </section>

        {/* Financial Expenditure / Saved Money & Cumulative CO2 Emissions Saved Graphs */}
        <EconomicsAndCarbonGraphs params={params} results={results} />

        {/* Visual Diagrams 1 & 2: Subsurface Thermal Plume Heatmap & Bidirectional Vibration Spectrum */}
        <PlumeAndVibrationDiagrams
          params={params}
          results={results}
          onUpdateParams={setParams}
        />

        {/* Section 2: Interactive Subsystem Engineering Directory */}
        <section id="subsystems" className="space-y-4 pt-6 border-t border-[#2B3240]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <div className="text-xs font-mono uppercase text-[#8A94A6]">
                04. Architectural Subsystems &amp; Telemetry Specifications
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#D5DEE8] mt-0.5">
                Interactive Component Directory (Click Any Subsystem for Full Specification Popup)
              </h2>
            </div>
            <span className="text-xs font-mono text-[#8A94A6]">
              11 Subterranean, Ground &amp; Residential Engineering Subsystems
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {SCHEMATIC_NODES.map((node) => {
              const live = node.getLiveMetrics(results, params);
              return (
                <div
                  key={node.id}
                  className="bg-[#1E232D] border border-[#2B3240] p-4 flex flex-col justify-between hover:border-[#3F4A5E] transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono text-[#8A94A6]">
                      <span className="font-semibold text-[#7CA8D4]">{node.code}</span>
                      <span>{node.stratum.toUpperCase()}</span>
                    </div>
                    <h3 className="text-sm font-bold text-[#D5DEE8] mt-1.5 leading-snug">
                      {node.title}
                    </h3>
                    <p className="text-xs text-[#9BA5B4] mt-1.5 line-clamp-3 leading-relaxed">
                      {node.summary}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#2B3240] space-y-2">
                    <div className="flex items-baseline justify-between text-xs font-mono">
                      <span className="text-[#8A94A6]">{live[0].label}:</span>
                      <span className="font-bold text-[#D5DEE8] tabular-nums">
                        {live[0].value} {live[0].unit}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedNode(node)}
                      className="w-full py-2 px-3 text-xs font-mono font-semibold text-[#C8D0DC] bg-[#181C24] border border-[#2B3240] hover:bg-[#2C3A4E] hover:text-[#D5DEE8] hover:border-[#5B9BD5] transition-colors cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap"
                    >
                      Open Technical Specs
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 3: Structural Isolation & Exact Subterranean Placement */}
        <section id="appendix-vibration" className="space-y-5 pt-6 border-t border-[#2B3240]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <div className="text-xs font-mono uppercase text-[#6DB39F]">
                05. Structural Isolation &amp; Subterranean Siting Engineering
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#D5DEE8] mt-0.5">
                Eliminating Vibrations &amp; Exact Subterranean Placement (Level -3 / -4 Bedrock)
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setSelectedNode(appendixNode)}
              className="px-3.5 py-2 text-xs font-mono font-semibold text-[#D5DEE8] bg-[#243635] border border-[#3E635D] hover:bg-[#2C4240] transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap self-start sm:self-auto"
            >
              Open Vibration &amp; Siting Specs (Node 11)
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-sm text-[#9BA5B4] leading-relaxed max-w-4xl">
            Protecting both highly sensitive server hardware (&lt;12 nm HDD read/write head tolerances) from external urban vibrations (subways, heavy traffic) and protecting overlying residential citizens from internal mechanical vibrations (pumps, chillers, backup generators) requires exhaustive bidirectional structural isolation.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1: Exact Subterranean Placement */}
            <div className="bg-[#1E232D] border border-[#2B3240] p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-[#7CA8D4]">
                  <span>PLACEMENT MANDATE</span>
                  <span>LEVEL -3 / -4</span>
                </div>
                <h3 className="text-sm font-bold text-[#D5DEE8] flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#7CA8D4]" />
                  Exact Subterranean Placement
                </h3>
                <p className="text-xs text-[#9BA5B4] leading-relaxed">
                  The 1–10 MW modular data centre vaults are positioned in the lowest possible sub-basement (<strong>Level -3 or -4</strong>), anchored directly into the bedrock. They must <strong>never</strong> be placed directly beneath central structural load-bearing pillars of residential towers to prevent vertical acoustic transmission.
                </p>
              </div>
              <div className="p-3 bg-[#181C24] border border-[#2B3240] font-mono text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#8A94A6]">Target Sub-Basement:</span>
                  <span className="text-[#C8D0DC] font-semibold">Level -3 to -4 Bedrock</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8A94A6]">Surface Footprint:</span>
                  <span className="text-[#6DB39F] font-semibold">Plazas &amp; Parking Zones</span>
                </div>
              </div>
            </div>

            {/* Card 2: Base Isolation Systems */}
            <div className="bg-[#1E232D] border border-[#2B3240] p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-[#6DB39F]">
                  <span>EXTERNAL ISOLATION</span>
                  <span>FLOATED SLAB</span>
                </div>
                <h3 className="text-sm font-bold text-[#D5DEE8]">
                  Base Isolation (&ldquo;Floated&rdquo; Slab)
                </h3>
                <p className="text-xs text-[#9BA5B4] leading-relaxed">
                  Utilizing <strong>elastomeric bearings</strong> or <strong>Taylor fluid viscous dampers</strong>, the entire data centre floor slab is structurally &ldquo;floated&rdquo; separate from surrounding earth and building foundations. Absorbs seismic energy, subways, and heavy urban traffic before inducing server micro-vibrations or read/write errors.
                </p>
              </div>
              <div className="p-3 bg-[#181C24] border border-[#2B3240] font-mono text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#8A94A6]">Bearing Hardware:</span>
                  <span className="text-[#C8D0DC] font-semibold">Elastomeric / Taylor Dampers</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8A94A6]">Protected Tolerance:</span>
                  <span className="text-[#6DB39F] font-semibold">&lt; 12 nm HDD Head Align</span>
                </div>
              </div>
            </div>

            {/* Card 3: Foam-Filled Trenches */}
            <div className="bg-[#1E232D] border border-[#2B3240] p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-[#C89B54]">
                  <span>PERIMETER BARRIER</span>
                  <span>-85% AMPLITUDE</span>
                </div>
                <h3 className="text-sm font-bold text-[#D5DEE8]">
                  1.0m Foam-Filled Trenches
                </h3>
                <p className="text-xs text-[#9BA5B4] leading-relaxed">
                  To mitigate ground-borne external vibrations propagating horizontally through the soil matrix, <strong>1.0-meter-deep trenches</strong> filled with high-density vibration-absorbing foam surround the perimeter of the subterranean vault walls, cutting incoming low-frequency vibration amplitude by up to <strong>85%</strong>.
                </p>
              </div>
              <div className="p-3 bg-[#181C24] border border-[#2B3240] font-mono text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#8A94A6]">Trench Geometry:</span>
                  <span className="text-[#C8D0DC] font-semibold">1.0m Perimeter Barrier</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8A94A6]">Amplitude Attenuation:</span>
                  <span className="text-[#6DB39F] font-semibold">Up to -85% Reduction</span>
                </div>
              </div>
            </div>

            {/* Card 4: Active Equipment Mounts & Acoustic Hangers */}
            <div className="bg-[#1E232D] border border-[#2B3240] p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-[#BA7396]">
                  <span>INTERNAL ISOLATION</span>
                  <span>ZERO FLANKING</span>
                </div>
                <h3 className="text-sm font-bold text-[#D5DEE8]">
                  Active Mounts &amp; Acoustic Hangers
                </h3>
                <p className="text-xs text-[#9BA5B4] leading-relaxed">
                  Every mechanical pump, compressor, chiller, and HVAC unit within the vault is mounted on <strong>tuned mass dampers, spring isolators, or pneumatic air mounts</strong>. All hydronic piping is suspended via <strong>acoustic hangers</strong>, preventing structure-borne noise from climbing the skeletal frame into residences.
                </p>
              </div>
              <div className="p-3 bg-[#181C24] border border-[#2B3240] font-mono text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#8A94A6]">Machinery Mounts:</span>
                  <span className="text-[#C8D0DC] font-semibold">TMD / Spring / Pneumatic</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8A94A6]">Conduit Suspension:</span>
                  <span className="text-[#6DB39F] font-semibold">Acoustic Pipe Hangers</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Table A Cooling Matrix & Thermal Energy Balance */}
        <section id="cooling-matrix" className="space-y-5 pt-6 border-t border-[#2B3240]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <div className="text-xs font-mono uppercase text-[#8A94A6]">
                02. Liquid Cooling Topologies &amp; Two-Tier District Energy Balance
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#D5DEE8] mt-0.5">
                High-Density Cooling Matrix (Table A) &amp; NZEB Thermal Allocation
              </h2>
            </div>
            <div className="text-xs font-mono text-[#8A94A6]">
              3D-Stacked Silicon Target: 200–250 kW/rack · Max CHF 492 W/cm²
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Table A */}
            <div className="lg:col-span-7 bg-[#1E232D] border border-[#2B3240] p-5">
              <h3 className="text-sm font-bold text-[#D5DEE8] mb-3 flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#C98253]" />
                Table A: Comparison of High-Density Data Centre Cooling Technologies
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-[#2B3240] font-mono text-xs text-[#8A94A6]">
                      <th className="py-2.5 pr-3">Cooling Topology</th>
                      <th className="py-2.5 px-3">Flow Rate (L/min/kW)</th>
                      <th className="py-2.5 px-3">Outlet Temp</th>
                      <th className="py-2.5 px-3">Pumping PUE</th>
                      <th className="py-2.5 pl-3">Capture</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2B3240]">
                    {Object.values(COOLING_TOPOLOGIES).map((spec) => {
                      const active = params.coolingTopology === spec.id;
                      return (
                        <tr
                          key={spec.id}
                          onClick={() =>
                            setParams((p) => ({ ...p, coolingTopology: spec.id }))
                          }
                          className={`cursor-pointer transition-colors ${
                            active ? 'bg-[#253042] font-semibold' : 'hover:bg-[#222834]'
                          }`}
                        >
                          <td className="py-3 pr-3 text-[#D5DEE8]">
                            <div>{spec.name}</div>
                            <div className="text-xs font-normal text-[#8A94A6] mt-0.5">
                              {spec.fluidType}
                            </div>
                          </td>
                          <td className="py-3 px-3 font-mono tabular-nums text-[#C8D0DC] whitespace-nowrap">
                            ~{spec.flowRatePerKwMin.toFixed(2)} – {spec.flowRatePerKwMax.toFixed(2)}
                          </td>
                          <td className="py-3 px-3 font-mono tabular-nums text-[#C8D0DC] whitespace-nowrap">
                            {spec.outletTempMin} – {spec.outletTempMax}°C
                          </td>
                          <td className="py-3 px-3 font-mono tabular-nums text-[#C8D0DC] whitespace-nowrap">
                            {spec.pueMin.toFixed(2)} – {spec.pueMax.toFixed(2)}
                          </td>
                          <td className="py-3 pl-3 font-mono tabular-nums whitespace-nowrap text-[#6DB39F]">
                            ~{Math.round(spec.heatCaptureFraction * 100)}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-[#8A94A6] font-mono">
                Note: Single-phase water systems encounter a microchannel &ldquo;flow rate wall&rdquo; (up to 220 L/min/rack) as GPU TDP exceeds 3.5–5.0 kW. Two-phase immersion leverages latent heat of vaporisation at 50–60°C saturation.
              </p>
            </div>

            {/* District Thermal Demand vs Supply Breakdown */}
            <div className="lg:col-span-5 bg-[#1E232D] border border-[#2B3240] p-5 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-sm font-bold text-[#D5DEE8] flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#7CA8D4]" />
                  Annual Thermal Supply vs. 20,000-Resident NZEB Baseline
                </h3>
                <p className="text-xs text-[#9BA5B4] mt-1">
                  In Passive House / NZEB construction (U-value ≤ 0.18 W/m²K, 41–45 kWh/m²/yr primary energy), Domestic Hot Water represents 70% of total thermal demand.
                </p>

                <div className="mt-4 space-y-3 font-mono text-xs">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-[#9BA5B4]">Subterranean Vault Thermal Output</span>
                      <span className="font-bold text-[#D5DEE8]">
                        {results.annualThermalOutputMwh.toLocaleString()} MWh/yr
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-[#181C24] overflow-hidden">
                      <div
                        className="h-full bg-[#C98253]"
                        style={{
                          width: `${Math.min(
                            100,
                            (results.annualThermalOutputMwh / 120000) * 100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-[#9BA5B4]">
                        Tier 2 Domestic Hot Water (9.63 kWh/home/day)
                      </span>
                      <span className="font-bold text-[#D5DEE8]">
                        {results.annualDhwDemandMwh.toLocaleString()} MWh/yr (70%)
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-[#181C24] overflow-hidden">
                      <div
                        className="h-full bg-[#BA7396]"
                        style={{
                          width: `${Math.min(
                            100,
                            (results.annualDhwDemandMwh / 120000) * 100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-[#9BA5B4]">
                        Tier 1 Space Heating (15 kWh/m²/yr × 100 m²)
                      </span>
                      <span className="font-bold text-[#D5DEE8]">
                        {results.annualSpaceHeatingDemandMwh.toLocaleString()} MWh/yr (30%)
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-[#181C24] overflow-hidden">
                      <div
                        className="h-full bg-[#C89B54]"
                        style={{
                          width: `${Math.min(
                            100,
                            (results.annualSpaceHeatingDemandMwh / 120000) * 100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-[#181C24] border border-[#2B3240] flex items-center justify-between text-xs font-mono">
                <span className="text-[#9BA5B4]">Total Power Recuperation (ORC + ZT {results.tegZtFigureOfMerit} TEG + Carnot):</span>
                <span className="font-bold text-[#7CA8D4]">
                  +{results.totalRecuperatedElectricalKw.toLocaleString()} kW_e ({results.residentialPowerCoveragePercent}% Res. Power)
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Hydrological Mass Balance & Subterranean Life-Safety / Acoustic / EMI Protocols */}
        <section id="hydrology-safety" className="space-y-5 pt-6 border-t border-[#2B3240]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <div className="text-xs font-mono uppercase text-[#8A94A6]">
                03. Closed-Loop Hydrology, Embodied Carbon &amp; Subterranean Hazard Engineering
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#D5DEE8] mt-0.5">
                Rainwater Thermal Regulation &amp; Acoustic / EMI Isolation Safeguards
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#1E232D] border border-[#2B3240] p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#D5DEE8] flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-[#7CA8D4]" />
                  Hydrological Mass Balance
                </h3>
                <span className="text-xs font-mono text-[#7CA8D4] font-semibold">
                  WUE {results.wueLitresPerKwh} L/kWh
                </span>
              </div>
              <p className="text-xs text-[#9BA5B4] leading-relaxed">
                Capturing 1,000 mm of annual precipitation across a 100,000 m² urban catchment yields <strong>100,000 m³/year</strong>. Transitioning from evaporative towers to closed-loop liquid cooling allows harvested rainwater to serve as the secondary thermal sink.
              </p>
              <div className="p-3 bg-[#181C24] border border-[#2B3240] font-mono text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#8A94A6]">30-Day Drought Cistern:</span>
                  <span className="font-semibold text-[#C8D0DC]">8,220 m³</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8A94A6]">45-Day Drought Cistern:</span>
                  <span className="font-semibold text-[#C8D0DC]">12,330 m³</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8A94A6]">Active Simulated Tank ({params.droughtDurationDays}d):</span>
                  <span className="font-bold text-[#7CA8D4]">
                    {results.requiredDroughtStorageM3.toLocaleString()} m³
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[#1E232D] border border-[#2B3240] p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#D5DEE8] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#6DB39F]" />
                  Acoustic Shock &amp; EMI Shielding
                </h3>
                <span className="text-xs font-mono text-[#6DB39F] font-semibold">
                  &lt; 110 dB SPL
                </span>
              </div>
              <p className="text-xs text-[#9BA5B4] leading-relaxed">
                Standard 200–300 bar inert-gas (IG-541/IG-100) fire nozzles generate <strong>130–145 dB</strong> acoustic shock, misaligning HDD read/write heads (&lt;12 nm tolerance) at ≥110 dB. Acoustic baffle nozzles and low-pressure water mist maintain SPL at {results.silencedNozzleAcousticDb} dB.
              </p>
              <div className="p-3 bg-[#181C24] border border-[#2B3240] font-mono text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#8A94A6]">Base Slab Isolation:</span>
                  <span className="font-semibold text-[#C8D0DC]">Taylor Fluid Viscous Dampers</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8A94A6]">Isolated Hum Frequency:</span>
                  <span className="font-semibold text-[#C8D0DC]">31.5 Hz – 125 Hz</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8A94A6]">EMI Dirty Electricity:</span>
                  <span className="font-semibold text-[#C8D0DC]">Shielded QXG Transformers</span>
                </div>
              </div>
            </div>

            <div className="bg-[#1E232D] border border-[#2B3240] p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#D5DEE8]">
                  Financial Payback &amp; Carbon Metrics
                </h3>
                <span className="text-xs font-mono text-[#9BA5B4] font-semibold">
                  2–12 Yr ROI
                </span>
              </div>
              <p className="text-xs text-[#9BA5B4] leading-relaxed">
                Real-world municipal waste-heat pilots demonstrate capital payback under <strong>2 years</strong> for subsidized deployments (Tallaght benchmark) and <strong>8–12 years</strong> in unsubsidized commercial markets, while requiring strict control of subsurface thermal plumes.
              </p>
              <div className="p-3 bg-[#181C24] border border-[#2B3240] font-mono text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#8A94A6]">Foundation Concrete Carbon:</span>
                  <span className="font-semibold text-[#C8D0DC]">0.162 – 0.243 kgCO₂e/kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8A94A6]">Annual Heating CO₂ Saved:</span>
                  <span className="font-bold text-[#6DB39F]">
                    {results.annualCo2DisplacedTonnes.toLocaleString()} tCO₂e/yr
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8A94A6]">Legionella DHW Mandate:</span>
                  <span className="font-semibold text-[#C8D0DC]">≥ 60°C draw-off / 85°C HTHP</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="mt-12 bg-[#151921] border-t border-[#2B3240] px-6 py-5">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8A94A6]">
          <div>
            ThermoVault 2045 — Subterranean Data Centre Waste-Heat Recovery, 5GDHC &amp; Bidirectional Vibration Isolation Architecture
          </div>
          <div className="flex items-center gap-4 font-mono">
            <button
              type="button"
              onClick={() => setIsReferenceModalOpen(true)}
              className="text-[#9BA5B4] hover:text-[#D5DEE8] underline underline-offset-4 cursor-pointer"
            >
              View Engineering Dossier, Table A &amp; Blueprint
            </button>
            <span aria-hidden="true">·</span>
            <span>NZEB / 5GDHC Engineering Model</span>
          </div>
        </div>
      </footer>

      {/* Interactive Technical Specification Popup Modal */}
      <NodeSpecModal
        node={selectedNode}
        params={params}
        results={results}
        onClose={() => setSelectedNode(null)}
        onSelectNode={(node) => setSelectedNode(node)}
      />

      {/* Research Brief & Reference Diagram Drawer Modal */}
      <CoolingComparisonDrawer
        isOpen={isReferenceModalOpen}
        activeTopology={params.coolingTopology}
        onSelectTopology={(topology) =>
          setParams((p) => ({ ...p, coolingTopology: topology }))
        }
        onClose={() => setIsReferenceModalOpen(false)}
      />
    </div>
  );
}

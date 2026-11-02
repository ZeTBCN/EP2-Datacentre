import React, { useEffect } from 'react';
import { X, FileText, Layers, ShieldCheck } from 'lucide-react';
import { COOLING_TOPOLOGIES, CoolingTopologyId } from '../utils/thermodynamics';

interface CoolingComparisonDrawerProps {
  isOpen: boolean;
  activeTopology: CoolingTopologyId;
  onSelectTopology: (topology: CoolingTopologyId) => void;
  onClose: () => void;
}

export const CoolingComparisonDrawer: React.FC<CoolingComparisonDrawerProps> = ({
  isOpen,
  activeTopology,
  onSelectTopology,
  onClose,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F1218]/75 backdrop-blur-xs p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reference-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-5xl bg-[#1E232D] text-[#C8D0DC] border border-[#323A4A] shadow-xl my-8 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between gap-4 px-6 py-4 bg-[#181C24] text-[#C8D0DC] border-b border-[#2B3240]">
          <div>
            <div className="text-xs font-mono text-[#7CA8D4]">
              EXECUTIVE ENGINEERING DOSSIER &amp; SYSTEM ARCHITECTURE BLUEPRINT
            </div>
            <h2 id="reference-modal-title" className="text-lg sm:text-xl font-bold text-[#D5DEE8] mt-0.5">
              2045 Subterranean Data Centre Feasibility Synthesis &amp; Reference Blueprint
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close research synthesis modal"
            className="p-2 text-[#8A94A6] hover:text-[#C8D0DC] hover:bg-[#252C3A] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {/* Interactive Table A Selector */}
          <div>
            <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
              <h3 className="text-sm font-semibold text-[#D5DEE8] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#7CA8D4]" />
                Table A: High-Density Data Centre Cooling Technologies (Click row to apply to simulator)
              </h3>
              <span className="text-xs font-mono text-[#8A94A6]">
                2045 Target Density: 200–250 kW/rack | Max CHF: 492 W/cm²
              </span>
            </div>
            <div className="overflow-x-auto border border-[#2B3240]">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-[#181C24] border-b border-[#2B3240] font-mono text-xs text-[#8A94A6]">
                    <th className="py-2.5 px-3.5">Cooling Technology</th>
                    <th className="py-2.5 px-3.5">Mechanism</th>
                    <th className="py-2.5 px-3.5">Flow Rate (L/min/kW)</th>
                    <th className="py-2.5 px-3.5">Outlet Temp (°C)</th>
                    <th className="py-2.5 px-3.5">Pumping PUE</th>
                    <th className="py-2.5 px-3.5">Heat Capture</th>
                    <th className="py-2.5 px-3.5">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2B3240]">
                  {Object.values(COOLING_TOPOLOGIES).map((spec) => {
                    const isSelected = activeTopology === spec.id;
                    return (
                      <tr
                        key={spec.id}
                        className={isSelected ? 'bg-[#253042]' : 'hover:bg-[#222834]'}
                      >
                        <td className="py-3 px-3.5 font-semibold text-[#D5DEE8]">
                          {spec.name}
                        </td>
                        <td className="py-3 px-3.5 text-xs text-[#9BA5B4] max-w-xs">
                          {spec.mechanism}
                        </td>
                        <td className="py-3 px-3.5 font-mono tabular-nums text-[#C8D0DC] whitespace-nowrap">
                          ~{spec.flowRatePerKwMin.toFixed(2)} – {spec.flowRatePerKwMax.toFixed(2)}
                        </td>
                        <td className="py-3 px-3.5 font-mono tabular-nums text-[#C8D0DC] whitespace-nowrap">
                          {spec.outletTempMin} – {spec.outletTempMax}°C
                        </td>
                        <td className="py-3 px-3.5 font-mono tabular-nums text-[#C8D0DC] whitespace-nowrap">
                          {spec.pueMin.toFixed(2)} – {spec.pueMax.toFixed(2)}
                        </td>
                        <td className="py-3 px-3.5 font-mono tabular-nums text-[#6DB39F] whitespace-nowrap">
                          ~{Math.round(spec.heatCaptureFraction * 100)}%
                        </td>
                        <td className="py-3 px-3.5">
                          <button
                            type="button"
                            onClick={() => onSelectTopology(spec.id)}
                            className={`px-3 py-1 text-xs font-mono font-medium transition-colors cursor-pointer whitespace-nowrap ${
                              isSelected
                                ? 'bg-[#354C66] text-[#D5DEE8] border border-[#5B9BD5]'
                                : 'bg-[#222834] text-[#9BA5B4] hover:bg-[#2A3140]'
                            }`}
                          >
                            {isSelected ? '● Active' : 'Simulate'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Structural Isolation & Subterranean Siting Synthesis */}
          <div className="p-4 border border-[#2B3240] bg-[#181C24] space-y-3">
            <h3 className="text-sm font-semibold text-[#D5DEE8] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#6DB39F]" />
              Subterranean Bedrock Siting &amp; Bidirectional Vibration Isolation Protocol
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#9BA5B4] leading-relaxed">
              <div>
                <div className="font-mono font-semibold text-[#7CA8D4] mb-1">
                  EXACT SUBTERRANEAN PLACEMENT (LEVEL -3 / -4 BEDROCK)
                </div>
                The 1–10 MW modular data centre vaults are positioned in the lowest sub-basement (Level -3 or -4), anchored directly into bedrock. They are never sited beneath central structural load-bearing pillars of residential towers to prevent vertical acoustic transmission. Instead, they are positioned beneath pedestrian plazas or commercial parking zones for spatial segregation and distinct acoustic zoning.
              </div>
              <div>
                <div className="font-mono font-semibold text-[#6DB39F] mb-1">
                  BIDIRECTIONAL VIBRATION MITIGATION TECHNOLOGIES
                </div>
                <ul className="space-y-1">
                  <li>· <strong>Base Isolation Systems:</strong> Floated slab on elastomeric bearings or Taylor fluid viscous dampers absorbs seismic &amp; subway/traffic micro-vibrations.</li>
                  <li>· <strong>Foam-Filled Trenches:</strong> 1.0m-deep dense foam perimeter trenches cut horizontal ground-borne low-frequency vibration amplitude by up to 85%.</li>
                  <li>· <strong>Active Mounts &amp; Acoustic Hangers:</strong> Pumps, chillers &amp; HVAC on tuned mass dampers, spring isolators, or pneumatic mounts; piping suspended on acoustic hangers.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 6 Executive Mandate Areas Grid */}
          <div>
            <h3 className="text-sm font-semibold text-[#D5DEE8] flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-[#7CA8D4]" />
              Six Core Feasibility Mandate Areas (2045 Temperate Oceanic Urban District)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-[#2B3240] bg-[#181C24]">
                <div className="text-xs font-mono text-[#7CA8D4] font-semibold">
                  01. COMPUTE &amp; LIQUID COOLING
                </div>
                <p className="text-xs text-[#9BA5B4] mt-1.5 leading-relaxed">
                  200–250 kW/rack densities with chip heat fluxes up to 492 W/cm² on porous lotus copper. Two-phase immersion reduces flow rate to 0.30–0.53 L/min/kW at 1.02–1.04 PUE.
                </p>
              </div>
              <div className="p-4 border border-[#2B3240] bg-[#181C24]">
                <div className="text-xs font-mono text-[#7CA8D4] font-semibold">
                  02. 5GDHC &amp; HTHP THERMODYNAMICS
                </div>
                <p className="text-xs text-[#9BA5B4] mt-1.5 leading-relaxed">
                  20,000 NZEB residents require 40,100 MWh/yr (28,100 DHW + 12,000 Space). Uninsulated 5GDHC pipes lose only 7.0 W/m at ≥80 cm spacing. Lorentz-cycle HTHPs boost efficiency by 25–30%.
                </p>
              </div>
              <div className="p-4 border border-[#2B3240] bg-[#181C24]">
                <div className="text-xs font-mono text-[#7CA8D4] font-semibold">
                  03. WASTE HEAT TO ELECTRICITY
                </div>
                <p className="text-xs text-[#9BA5B4] mt-1.5 leading-relaxed">
                  Organic Rankine Cycles (ORC) operate at 10–18% efficiency alongside solid-state skutterudite Thermoelectric Generators (TEGs) projected at ZT = 2.0–3.0.
                </p>
              </div>
              <div className="p-4 border border-[#2B3240] bg-[#181C24]">
                <div className="text-xs font-mono text-[#7CA8D4] font-semibold">
                  04. HYDROLOGICAL MASS BALANCE
                </div>
                <p className="text-xs text-[#9BA5B4] mt-1.5 leading-relaxed">
                  1,000 mm rainfall across a 100,000 m² urban catchment yields 100,000 m³/yr. Bridging a 30–45 day seasonal drought requires an underground tank of 8,220 to 12,330 m³.
                </p>
              </div>
              <div className="p-4 border border-[#2B3240] bg-[#181C24]">
                <div className="text-xs font-mono text-[#7CA8D4] font-semibold">
                  05. FINANCIAL &amp; CARBON METRICS
                </div>
                <p className="text-xs text-[#9BA5B4] mt-1.5 leading-relaxed">
                  Pilot paybacks range from &lt;2 years (subsidized Tallaght model) to 8–12 years commercial. Subterranean foundation concrete embodied carbon sits at 0.162–0.243 kgCO₂e/kg.
                </p>
              </div>
              <div className="p-4 border border-[#2B3240] bg-[#181C24]">
                <div className="text-xs font-mono text-[#7CA8D4] font-semibold">
                  06. ACOUSTIC, EMI &amp; SOIL HAZARDS
                </div>
                <p className="text-xs text-[#9BA5B4] mt-1.5 leading-relaxed">
                  Silenced fire nozzles keep SPL &lt;110 dB to protect HDD heads (&lt;12 nm tolerance). Foam trenches cut vibration by 85%/m, and shielded QXG transformers block EMI dirty electricity.
                </p>
              </div>
            </div>
          </div>

          {/* Original Architectural Diagram Attachment */}
          <div className="border border-[#2B3240] p-4 bg-[#181C24]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase text-[#8A94A6]">
                Reference Blueprint: Subterranean Thermal Architecture &amp; District Heating Integration
              </span>
              <span className="text-xs font-mono text-[#8A94A6]">
                Architectural Reference Schematic
              </span>
            </div>
            <img
              src="/assets/aistudio/EP2_Thermal_Architecture_4e176d1c.png"
              alt="Subterranean Thermal Architecture and District Heating Integration reference diagram"
              referrerPolicy="no-referrer"
              className="w-full max-h-[420px] object-contain border border-[#2B3240] bg-[#E2E8F0] p-2 opacity-90"
            />
          </div>
        </div>

        <div className="flex items-center justify-end px-6 py-3 bg-[#181C24] border-t border-[#2B3240]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#D5DEE8] bg-[#2F435A] border border-[#456180] hover:bg-[#38506B] transition-colors cursor-pointer"
          >
            Return to Interactive Schematic
          </button>
        </div>
      </div>
    </div>
  );
};

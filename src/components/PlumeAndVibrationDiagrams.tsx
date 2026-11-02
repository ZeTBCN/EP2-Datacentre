import React, { useState, useMemo } from 'react';
import { Thermometer, Activity, Volume2, CheckSquare, Square } from 'lucide-react';
import {
  SimulationParams,
  SimulationResults,
  calculatePlumeAndVibrationDiagnostics,
} from '../utils/thermodynamics';

interface PlumeAndVibrationDiagramsProps {
  params: SimulationParams;
  results: SimulationResults;
  onUpdateParams: React.Dispatch<React.SetStateAction<SimulationParams>>;
}

const SPACING_PRESETS = [
  { cm: 40, label: '40 cm (Plume Overlap -16%)' },
  { cm: 65, label: '65 cm (Marginal -6%)' },
  { cm: 85, label: '85 cm (Optimal ≥80 cm)' },
  { cm: 110, label: '110 cm (Wide Decoupled)' },
];

export const PlumeAndVibrationDiagrams: React.FC<PlumeAndVibrationDiagramsProps> = ({
  params,
  results,
  onUpdateParams,
}) => {
  const [enableFoamTrench, setEnableFoamTrench] = useState<boolean>(true);
  const [enableBaseIsolation, setEnableBaseIsolation] = useState<boolean>(true);
  const [enableActiveMounts, setEnableActiveMounts] = useState<boolean>(true);

  const diag = useMemo(
    () =>
      calculatePlumeAndVibrationDiagnostics(
        params,
        results,
        enableFoamTrench,
        enableBaseIsolation,
        enableActiveMounts
      ),
    [params, results, enableFoamTrench, enableBaseIsolation, enableActiveMounts]
  );

  // --- SVG Geometry for Diagram 1: 2D Subsurface Thermal Plume Cross-Section + Soil Temp Profile ---
  const d1W = 660;
  const d1H = 340;
  const centerX = d1W / 2;
  // Scale: 120 cm maps to 230 px -> ~1.916 px per cm
  const pxPerCm = 230 / 120;
  const supplyX = centerX - (params.pipeSeparationCm / 2) * pxPerCm;
  const returnX = centerX + (params.pipeSeparationCm / 2) * pxPerCm;
  const pipeY = 104;

  // Lower profile curve geometry inside Diagram 1 (y = 205 to 305)
  const profTop = 204;
  const profBottom = 304;
  const profH = profBottom - profTop;
  const minTempC = 10;
  const maxTempC = 65;

  const getOffsetX = (offsetCm: number) => centerX + offsetCm * pxPerCm;
  const getTempY = (tempC: number) =>
    profBottom - ((Math.min(maxTempC, Math.max(minTempC, tempC)) - minTempC) / (maxTempC - minTempC)) * profH;

  const combinedSoilPolyline = diag.soilProfile
    .map((pt) => `${getOffsetX(pt.offsetCm).toFixed(1)},${getTempY(pt.soilTempC).toFixed(1)}`)
    .join(' ');

  const combinedSoilArea = [
    `${getOffsetX(-120).toFixed(1)},${profBottom}`,
    ...diag.soilProfile.map(
      (pt) => `${getOffsetX(pt.offsetCm).toFixed(1)},${getTempY(pt.soilTempC).toFixed(1)}`
    ),
    `${getOffsetX(120).toFixed(1)},${profBottom}`,
  ].join(' ');

  // --- SVG Geometry for Diagram 2: Vibration Frequency Spectrum (16 Hz - 250 Hz) ---
  const d2W = 660;
  const d2H = 225;
  const d2Pad = { top: 24, right: 28, bottom: 38, left: 56 };
  const d2PlotW = d2W - d2Pad.left - d2Pad.right;
  const d2PlotH = d2H - d2Pad.top - d2Pad.bottom;

  const minDbV = 35;
  const maxDbV = 105;

  const getFreqX = (idx: number) =>
    d2Pad.left + (idx / Math.max(1, diag.vibrationBands.length - 1)) * d2PlotW;
  const getDbY = (db: number) =>
    d2Pad.top + d2PlotH - ((Math.min(maxDbV, Math.max(minDbV, db)) - minDbV) / (maxDbV - minDbV)) * d2PlotH;

  const unmitigatedLine = diag.vibrationBands
    .map((b, i) => `${getFreqX(i).toFixed(1)},${getDbY(b.unmitigatedDbV).toFixed(1)}`)
    .join(' ');

  const trenchOnlyLine = diag.vibrationBands
    .map((b, i) => `${getFreqX(i).toFixed(1)},${getDbY(b.afterTrenchDbV).toFixed(1)}`)
    .join(' ');

  const isolatedLine = diag.vibrationBands
    .map((b, i) => `${getFreqX(i).toFixed(1)},${getDbY(b.fullyIsolatedDbV).toFixed(1)}`)
    .join(' ');

  const isolatedArea = [
    `${getFreqX(0).toFixed(1)},${(d2Pad.top + d2PlotH).toFixed(1)}`,
    ...diag.vibrationBands.map(
      (b, i) => `${getFreqX(i).toFixed(1)},${getDbY(b.fullyIsolatedDbV).toFixed(1)}`
    ),
    `${getFreqX(diag.vibrationBands.length - 1).toFixed(1)},${(d2Pad.top + d2PlotH).toFixed(1)}`,
  ].join(' ');

  const thresholdY = getDbY(62);

  return (
    <section id="plume-vibration-diagrams" className="space-y-6 pt-6 border-t border-[#2B3240]">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-mono uppercase text-[#7CA8D4]">
            03. Subsurface Soil Physics &amp; Vibro-Acoustic Attenuation Diagnostics
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#D5DEE8] mt-0.5">
            5GDHC Subsurface Thermal Plume Heatmap &amp; Bidirectional Vibration Spectrum
          </h2>
          <p className="text-sm text-[#9BA5B4] mt-1 max-w-3xl">
            Interactive cross-sectional models illustrating how twin-pipe horizontal spacing governs radial soil heat-gain interference (≥80 cm threshold) and how multi-stage structural isolation attenuates 16–250 Hz mechanical and urban transit vibrations.
          </p>
        </div>

        {/* Preset Pipe Separation Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 shrink-0">
          {SPACING_PRESETS.map((preset) => {
            const active = params.pipeSeparationCm === preset.cm;
            return (
              <button
                key={preset.cm}
                type="button"
                onClick={() =>
                  onUpdateParams((prev) => ({ ...prev, pipeSeparationCm: preset.cm }))
                }
                className={`px-2.5 py-1.5 text-xs font-mono border transition-colors cursor-pointer whitespace-nowrap ${
                  active
                    ? 'bg-[#283548] text-[#D5DEE8] border-[#5B9BD5] font-semibold'
                    : 'bg-[#1E232D] text-[#8A94A6] border-[#2B3240] hover:text-[#C8D0DC]'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* =====================================================================
            VISUAL DIAGRAM 1: 5GDHC SUBSURFACE THERMAL PLUME & PIPE SPACING HEATMAP
           ===================================================================== */}
        <div className="xl:col-span-6 bg-[#1E232D] border border-[#2B3240] p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-mono uppercase text-[#C98253] flex items-center gap-1.5">
                <Thermometer className="w-3.5 h-3.5" />
                Diagram 1 · 2D Subsurface Thermal Plume &amp; Isotherm Profile
              </span>
              <span
                className={`text-xs font-mono font-semibold ${
                  params.pipeSeparationCm >= 80 ? 'text-[#6DB39F]' : 'text-[#C89B54]'
                }`}
              >
                {params.pipeSeparationCm >= 80
                  ? `● Optimal Separation (${params.pipeSeparationCm} cm ≥ 80 cm)`
                  : `▲ Plume Collision (-${results.pipeThermalInterferencePenaltyPercent}% Ground Heat Gain)`}
              </span>
            </div>
            <h3 className="text-base font-bold text-[#D5DEE8]">
              Uninsulated 5GDHC Twin-Pipe Soil Plume Cross-Section
            </h3>
            <p className="text-xs text-[#9BA5B4]">
              Placing uninsulated 25–40 mm supply ({diag.supplyPipeTempC}°C) and return ({diag.returnPipeTempC}°C) pipes closer than 80 cm causes radial thermal plumes to overlap in the soil matrix, eroding the ΔT gradient and losing up to 20% of ambient ground heat gains.
            </p>
          </div>

          {/* Interactive Pipe Separation Slider */}
          <div className="p-3 bg-[#181C24] border border-[#2B3240] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center justify-between sm:justify-start gap-2 text-xs font-mono">
              <label htmlFor="diagram-pipe-sep-slider" className="text-[#9BA5B4]">
                Horizontal Pipe Center-to-Center Spacing:
              </label>
              <span className="font-bold text-[#D5DEE8] bg-[#253042] px-2 py-0.5 border border-[#3E506B] tabular-nums">
                {params.pipeSeparationCm} cm
              </span>
            </div>
            <input
              id="diagram-pipe-sep-slider"
              type="range"
              min={30}
              max={120}
              step={5}
              value={params.pipeSeparationCm}
              onChange={(e) =>
                onUpdateParams((prev) => ({
                  ...prev,
                  pipeSeparationCm: Number(e.target.value),
                }))
              }
              className="w-full sm:w-44 accent-[#C98253] cursor-pointer"
            />
          </div>

          {/* 2D Soil Cross-Section & Temperature Profile SVG */}
          <div className="w-full bg-[#181C24] border border-[#2B3240] p-2">
            <svg
              viewBox={`0 0 ${d1W} ${d1H}`}
              className="w-full h-auto block select-none"
              role="img"
              aria-label="2D Subsurface Thermal Plume Heatmap and Soil Temperature Profile"
            >
              <defs>
                <radialGradient id="warmPlumeGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#D97B43" stopOpacity="0.68" />
                  <stop offset="45%" stopColor="#C98253" stopOpacity="0.32" />
                  <stop offset="80%" stopColor="#C89B54" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#C89B54" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="coolPlumeGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#5B9BD5" stopOpacity="0.62" />
                  <stop offset="50%" stopColor="#569EA8" stopOpacity="0.28" />
                  <stop offset="85%" stopColor="#569EA8" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#569EA8" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Upper Half: 2D Soil Matrix Cross-Section (-2.5m Trench Depth) */}
              <rect x="24" y="18" width={d1W - 48} height="156" fill="#1B202B" stroke="#2B3240" />

              {/* Surface Permeable Plaza Stratum Line */}
              <line x1="24" y1="36" x2={d1W - 24} y2="36" stroke="#364052" strokeWidth="1.5" strokeDasharray="5 4" />
              <text x="34" y="31" fill="#8A94A6" fontSize="9.5" className="font-mono">
                UNDISTURBED SOIL MATRIX (-2.5m DEPTH · AMBIENT 12.5°C)
              </text>
              <text x={d1W - 34} y="31" textAnchor="end" fill="#8A94A6" fontSize="9.5" className="font-mono">
                LINE LOSS: {results.effectiveLineLossWm} W/m
              </text>

              {/* 80 cm Optimal Threshold Reference Brackets */}
              <line
                x1={centerX - 40 * pxPerCm}
                y1="44"
                x2={centerX - 40 * pxPerCm}
                y2="168"
                stroke="#5AA897"
                strokeWidth="1"
                strokeDasharray="3 3"
                opacity="0.65"
              />
              <line
                x1={centerX + 40 * pxPerCm}
                y1="44"
                x2={centerX + 40 * pxPerCm}
                y2="168"
                stroke="#5AA897"
                strokeWidth="1"
                strokeDasharray="3 3"
                opacity="0.65"
              />
              <text x={centerX} y="52" textAnchor="middle" fill="#6DB39F" fontSize="9.5" className="font-mono">
                ├─ Minimum 80 cm Optimal Separation Threshold ─┤
              </text>

              {/* Radial Thermal Plume Around Warm Supply Pipe */}
              <circle cx={supplyX} cy={pipeY} r={68} fill="url(#warmPlumeGrad)" />
              <circle
                cx={supplyX}
                cy={pipeY}
                r={46}
                fill="none"
                stroke="#C98253"
                strokeWidth="1"
                strokeDasharray="3 3"
                opacity="0.65"
              />

              {/* Radial Thermal Plume Around Cool Return Pipe */}
              <circle cx={returnX} cy={pipeY} r={62} fill="url(#coolPlumeGrad)" />
              <circle
                cx={returnX}
                cy={pipeY}
                r={42}
                fill="none"
                stroke="#5B9BD5"
                strokeWidth="1"
                strokeDasharray="3 3"
                opacity="0.65"
              />

              {/* Plume Interference Collision Zone Highlight when < 80 cm */}
              {params.pipeSeparationCm < 80 && (
                <g>
                  <ellipse
                    cx={centerX}
                    cy={pipeY}
                    rx={Math.max(12, (80 - params.pipeSeparationCm) * 0.65)}
                    ry="44"
                    fill="#C87A7A"
                    opacity="0.22"
                    stroke="#D48484"
                    strokeWidth="1.2"
                    strokeDasharray="3 2"
                  />
                  <text
                    x={centerX}
                    y={pipeY - 48}
                    textAnchor="middle"
                    fill="#E09F67"
                    fontSize="9.5"
                    fontWeight="700"
                    className="font-mono"
                  >
                    PLUME OVERLAP ({diag.plumeOverlapIntensityPercent}% INTERFERENCE)
                  </text>
                </g>
              )}

              {/* Distance Dimension Arrow Between Pipes */}
              <line
                x1={supplyX}
                y1={pipeY + 46}
                x2={returnX}
                y2={pipeY + 46}
                stroke="#C8D0DC"
                strokeWidth="1.2"
              />
              <text
                x={centerX}
                y={pipeY + 60}
                textAnchor="middle"
                fill="#D5DEE8"
                fontSize="10.5"
                fontWeight="700"
                className="font-mono"
              >
                d = {params.pipeSeparationCm} cm ({results.pipeThermalInterferencePenaltyPercent === 0 ? '0% Gain Loss' : `-${results.pipeThermalInterferencePenaltyPercent}% Gain Loss`})
              </text>

              {/* Warm Supply Pipe Cross-Section */}
              <circle
                cx={supplyX}
                cy={pipeY}
                r="14"
                fill="#2A1E1B"
                stroke="#E08B55"
                strokeWidth="2.5"
              />
              <text
                x={supplyX}
                y={pipeY + 3.5}
                textAnchor="middle"
                fill="#F0B289"
                fontSize="9.5"
                fontWeight="700"
                className="font-mono"
              >
                {Math.round(diag.supplyPipeTempC)}°
              </text>
              <text
                x={supplyX - 18}
                y={pipeY - 18}
                textAnchor="end"
                fill="#E08B55"
                fontSize="10"
                fontWeight="600"
                className="font-mono"
              >
                Supply ({diag.supplyPipeTempC}°C)
              </text>

              {/* Cool Return Pipe Cross-Section */}
              <circle
                cx={returnX}
                cy={pipeY}
                r="14"
                fill="#192533"
                stroke="#6BA8E0"
                strokeWidth="2.5"
              />
              <text
                x={returnX}
                y={pipeY + 3.5}
                textAnchor="middle"
                fill="#9BC6ED"
                fontSize="9.5"
                fontWeight="700"
                className="font-mono"
              >
                21°
              </text>
              <text
                x={returnX + 18}
                y={pipeY - 18}
                textAnchor="start"
                fill="#7CA8D4"
                fontSize="10"
                fontWeight="600"
                className="font-mono"
              >
                Return ({diag.returnPipeTempC}°C)
              </text>

              {/* Lower Half: Soil Temperature Isotherm Curve (°C vs Horizontal Offset cm) */}
              <text x="34" y="194" fill="#9BA5B4" fontSize="10" fontWeight="600" className="font-mono">
                RADIAL SOIL TEMPERATURE PROFILE T_soil(x) · MIDPOINT: {diag.midpointSoilTempC}°C
              </text>

              {[15, 35, 55].map((tVal) => {
                const y = getTempY(tVal);
                return (
                  <g key={tVal}>
                    <line
                      x1={getOffsetX(-120)}
                      y1={y}
                      x2={getOffsetX(120)}
                      y2={y}
                      stroke="#262D3B"
                      strokeWidth="1"
                    />
                    <text
                      x={getOffsetX(-120) - 6}
                      y={y + 3.5}
                      textAnchor="end"
                      fill="#8A94A6"
                      fontSize="9.5"
                      className="font-mono"
                    >
                      {tVal}°C
                    </text>
                  </g>
                );
              })}

              <polygon points={combinedSoilArea} fill="#C98253" opacity="0.16" />
              <polyline
                fill="none"
                stroke="#E08B55"
                strokeWidth="2.2"
                points={combinedSoilPolyline}
              />

              {/* X-Axis Distance Ticks (-120 cm to +120 cm) */}
              {[-120, -80, -40, 0, 40, 80, 120].map((cm) => {
                const x = getOffsetX(cm);
                return (
                  <text
                    key={cm}
                    x={x}
                    y={d1H - 12}
                    textAnchor="middle"
                    fill="#8A94A6"
                    fontSize="9.5"
                    className="font-mono"
                  >
                    {cm > 0 ? `+${cm}cm` : `${cm}cm`}
                  </text>
                );
              })}
            </svg>
          </div>

          {/* Bottom Summary Metrics for Diagram 1 */}
          <div className="grid grid-cols-3 gap-3 font-mono text-xs">
            <div className="p-2.5 bg-[#181C24] border border-[#2B3240]">
              <div className="text-[#8A94A6]">Midpoint Soil Temp</div>
              <div className="text-sm font-bold text-[#D5DEE8] mt-0.5 tabular-nums">
                {diag.midpointSoilTempC}°C
              </div>
            </div>
            <div className="p-2.5 bg-[#181C24] border border-[#2B3240]">
              <div className="text-[#8A94A6]">Ground Heat Gain η</div>
              <div
                className={`text-sm font-bold mt-0.5 tabular-nums ${
                  diag.groundHeatGainEfficiencyPercent === 100
                    ? 'text-[#6DB39F]'
                    : 'text-[#C89B54]'
                }`}
              >
                {diag.groundHeatGainEfficiencyPercent}% ({100 - diag.groundHeatGainEfficiencyPercent}% loss)
              </div>
            </div>
            <div className="p-2.5 bg-[#181C24] border border-[#2B3240]">
              <div className="text-[#8A94A6]">Aquifer / Soil Safety</div>
              <div className="text-sm font-bold text-[#6DB39F] mt-0.5">
                {params.pipeSeparationCm >= 80 ? 'Protected' : 'Plume Risk'}
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================================
            VISUAL DIAGRAM 2: BIDIRECTIONAL VIBRATION & ACOUSTIC SPECTRUM (Hz / dB)
           ===================================================================== */}
        <div className="xl:col-span-6 bg-[#1E232D] border border-[#2B3240] p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-mono uppercase text-[#6DB39F] flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                Diagram 2 · Bidirectional Vibration &amp; Acoustic Shock Spectrum
              </span>
              <span className="text-xs font-mono text-[#7CA8D4]">
                Target: &lt;62 dB_v Structural · &lt;110 dB Fire SPL
              </span>
            </div>
            <h3 className="text-base font-bold text-[#D5DEE8]">
              16–250 Hz Structural Attenuation &amp; Fire-Suppression Acoustic Ceiling
            </h3>
            <p className="text-xs text-[#9BA5B4]">
              Toggle each subterranean isolation layer below to observe how the 1.0 m perimeter foam trench (-85% amplitude), Taylor fluid viscous base dampers, and active pneumatic/spring mounts suppress 31.5–125 Hz resonance.
            </p>
          </div>

          {/* Interactive Isolation Layer Toggles */}
          <div
            role="group"
            aria-label="Toggle subterranean vibration isolation layers"
            className="grid grid-cols-1 sm:grid-cols-3 gap-2"
          >
            <button
              type="button"
              onClick={() => setEnableFoamTrench((v) => !v)}
              className={`p-2.5 text-left border text-xs font-mono transition-colors cursor-pointer flex items-center gap-2 ${
                enableFoamTrench
                  ? 'bg-[#213331] text-[#86C4B5] border-[#426E65]'
                  : 'bg-[#181C24] text-[#8A94A6] border-[#2B3240]'
              }`}
            >
              {enableFoamTrench ? (
                <CheckSquare className="w-4 h-4 shrink-0 text-[#6DB39F]" />
              ) : (
                <Square className="w-4 h-4 shrink-0 text-[#8A94A6]" />
              )}
              <div>
                <div className="font-semibold">1.0m Foam Trench</div>
                <div className="text-[10px] opacity-80">-85% Wave (-16.5 dB)</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setEnableBaseIsolation((v) => !v)}
              className={`p-2.5 text-left border text-xs font-mono transition-colors cursor-pointer flex items-center gap-2 ${
                enableBaseIsolation
                  ? 'bg-[#243242] text-[#9BC6ED] border-[#4D6B8E]'
                  : 'bg-[#181C24] text-[#8A94A6] border-[#2B3240]'
              }`}
            >
              {enableBaseIsolation ? (
                <CheckSquare className="w-4 h-4 shrink-0 text-[#7CA8D4]" />
              ) : (
                <Square className="w-4 h-4 shrink-0 text-[#8A94A6]" />
              )}
              <div>
                <div className="font-semibold">Floated Base Slab</div>
                <div className="text-[10px] opacity-80">Taylor Fluid Dampers</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setEnableActiveMounts((v) => !v)}
              className={`p-2.5 text-left border text-xs font-mono transition-colors cursor-pointer flex items-center gap-2 ${
                enableActiveMounts
                  ? 'bg-[#332735] text-[#D49BBA] border-[#6E4B62]'
                  : 'bg-[#181C24] text-[#8A94A6] border-[#2B3240]'
              }`}
            >
              {enableActiveMounts ? (
                <CheckSquare className="w-4 h-4 shrink-0 text-[#BA7396]" />
              ) : (
                <Square className="w-4 h-4 shrink-0 text-[#8A94A6]" />
              )}
              <div>
                <div className="font-semibold">Active TMD &amp; Hangers</div>
                <div className="text-[10px] opacity-80">Spring / Acoustic</div>
              </div>
            </button>
          </div>

          {/* Part A: 16 Hz – 250 Hz Structural Vibration Frequency Spectrum SVG */}
          <div className="w-full bg-[#181C24] border border-[#2B3240] p-2">
            <svg
              viewBox={`0 0 ${d2W} ${d2H}`}
              className="w-full h-auto block select-none"
              role="img"
              aria-label="Bidirectional Vibration Frequency Attenuation Spectrum from 16 Hz to 250 Hz"
            >
              {[40, 60, 80, 100].map((db) => {
                const y = getDbY(db);
                return (
                  <g key={db}>
                    <line
                      x1={d2Pad.left}
                      y1={y}
                      x2={d2W - d2Pad.right}
                      y2={y}
                      stroke="#262D3B"
                      strokeWidth="1"
                    />
                    <text
                      x={d2Pad.left - 8}
                      y={y + 3.5}
                      textAnchor="end"
                      fill="#8A94A6"
                      fontSize="9.5"
                      className="font-mono"
                    >
                      {db} dB_v
                    </text>
                  </g>
                );
              })}

              {/* Safe Micro-Vibration Threshold Line (62 dB_v) */}
              <line
                x1={d2Pad.left}
                y1={thresholdY}
                x2={d2W - d2Pad.right}
                y2={thresholdY}
                stroke="#C89B54"
                strokeWidth="1.4"
                strokeDasharray="5 3"
              />
              <text
                x={d2W - d2Pad.right - 4}
                y={thresholdY - 6}
                textAnchor="end"
                fill="#C89B54"
                fontSize="9.5"
                fontWeight="600"
                className="font-mono"
              >
                Safe HDD (&lt;12 nm) &amp; Residential Threshold (62 dB_v)
              </text>

              {/* Curve 1: Unmitigated Subway / Traffic / Chiller Hum */}
              <polyline
                fill="none"
                stroke="#C87A7A"
                strokeWidth="2"
                strokeDasharray="4 3"
                points={unmitigatedLine}
              />

              {/* Curve 2: After 1.0m Foam Trench Only */}
              <polyline
                fill="none"
                stroke="#7CA8D4"
                strokeWidth="1.75"
                opacity="0.7"
                points={trenchOnlyLine}
              />

              {/* Curve 3: Active Attenuated Spectrum */}
              <polygon points={isolatedArea} fill="#5AA897" opacity="0.18" />
              <polyline
                fill="none"
                stroke="#6DB39F"
                strokeWidth="2.75"
                points={isolatedLine}
              />

              {/* Frequency Band Points & Labels */}
              {diag.vibrationBands.map((band, idx) => {
                const cx = getFreqX(idx);
                const cy = getDbY(band.fullyIsolatedDbV);
                const rawY = getDbY(band.unmitigatedDbV);
                return (
                  <g key={band.freqHz}>
                    <circle cx={cx} cy={rawY} r="3" fill="#C87A7A" />
                    <circle
                      cx={cx}
                      cy={cy}
                      r="4.5"
                      fill={band.fullyIsolatedDbV <= 62 ? '#6DB39F' : '#E09F67'}
                      stroke="#181C24"
                      strokeWidth="1.5"
                    />
                    <text
                      x={cx}
                      y={cy - 8}
                      textAnchor="middle"
                      fill="#D5DEE8"
                      fontSize="9.5"
                      fontWeight="600"
                      className="font-mono"
                    >
                      {band.fullyIsolatedDbV}
                    </text>
                    <text
                      x={cx}
                      y={d2H - 12}
                      textAnchor="middle"
                      fill="#8A94A6"
                      fontSize="9.5"
                      className="font-mono"
                    >
                      {band.freqHz} Hz
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Part B: Fire-Suppression Acoustic Shock Comparator (<110 dB HDD Threshold) */}
          <div className="p-3.5 bg-[#181C24] border border-[#2B3240] space-y-2.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#C8D0DC] font-semibold flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-[#7CA8D4]" />
                Fire-Suppression Acoustic Shock vs. 110 dB HDD Failure Limit
              </span>
              <span className="text-[#6DB39F]">Head Tolerance: &lt;12 nm</span>
            </div>

            <div className="space-y-2 font-mono text-xs">
              <div>
                <div className="flex justify-between text-[11px] mb-0.5">
                  <span className="text-[#9BA5B4]">Unbaffled 300-Bar Inert Gas (IG-541/IG-100)</span>
                  <span className="text-[#D48484] font-bold">138 dB (HDD Head Crash ≥110 dB)</span>
                </div>
                <div className="w-full h-2.5 bg-[#1E232D] relative overflow-hidden">
                  <div className="h-full bg-[#C87A7A]" style={{ width: '92%' }} />
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-[#E09F67]"
                    style={{ left: '73.3%' }}
                    title="110 dB HDD Failure Threshold"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-0.5">
                  <span className="text-[#9BA5B4]">Acoustic Baffle Silencer Nozzles + Water Mist</span>
                  <span className="text-[#6DB39F] font-bold">{results.silencedNozzleAcousticDb} dB (Safe &lt;110 dB Limit)</span>
                </div>
                <div className="w-full h-2.5 bg-[#1E232D] relative overflow-hidden">
                  <div className="h-full bg-[#5AA897]" style={{ width: '65.3%' }} />
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-[#E09F67]"
                    style={{ left: '73.3%' }}
                    title="110 dB HDD Failure Threshold"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

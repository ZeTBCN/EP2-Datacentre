import React, { useState, useMemo } from 'react';
import { TrendingUp, Leaf, Coins, Building2 } from 'lucide-react';
import {
  SimulationParams,
  SimulationResults,
  FundingRegimeId,
  ConcreteSpecId,
  calculateEconomicsAndCarbonSeries,
} from '../utils/thermodynamics';

interface EconomicsAndCarbonGraphsProps {
  params: SimulationParams;
  results: SimulationResults;
}

const FUNDING_REGIMES: {
  id: FundingRegimeId;
  label: string;
  shortLabel: string;
  benchmarkTag: string;
  color: string;
  description: string;
}[] = [
  {
    id: 'subsidized-tallaght',
    label: 'Subsidized Pilot (Tallaght Benchmark)',
    shortLabel: 'Tallaght Pilot (<2 Yr)',
    benchmarkTag: '< 2 Yr Payback Benchmark',
    color: '#6DB39F',
    description:
      'Municipal & EU decarbonisation grant covers ~84% of district heat network & subterranean thermal interface CAPEX, matching the Tallaght pilot (<2 year payback).',
  },
  {
    id: 'municipal-ppp',
    label: 'Blended Municipal PPP (48% Grant)',
    shortLabel: 'Municipal PPP (~5 Yr)',
    benchmarkTag: '~5 Yr Payback Benchmark',
    color: '#7CA8D4',
    description:
      'Public-private utility co-investment where municipal green-bonds fund civil 5GDHC trenching while private compute operators fund the Level -3/-4 vault.',
  },
  {
    id: 'commercial-market',
    label: 'Standard Commercial Market (Unsubsidized)',
    shortLabel: 'Standard Market (8–12 Yr)',
    benchmarkTag: '8–12 Yr Market Benchmark',
    color: '#C98253',
    description:
      '100% private capital expenditure covering bedrock excavation, Taylor fluid viscous dampers, immersion baths, HTHP plant, and 5GDHC distribution.',
  },
];

export const EconomicsAndCarbonGraphs: React.FC<EconomicsAndCarbonGraphsProps> = ({
  params,
  results,
}) => {
  const [selectedRegime, setSelectedRegime] = useState<FundingRegimeId>('commercial-market');
  const [concreteSpec, setConcreteSpec] = useState<ConcreteSpecId>('low-carbon-0162');
  const [inspectedYear, setInspectedYear] = useState<number>(10);

  const econ = useMemo(
    () => calculateEconomicsAndCarbonSeries(params, results, concreteSpec),
    [params, results, concreteSpec]
  );

  const activeRegimeMeta = FUNDING_REGIMES.find((r) => r.id === selectedRegime)!;
  const inspectedPoint = econ.series[inspectedYear] ?? econ.series[10];

  // --- SVG Geometry for Graph 1: 20-Year Cumulative Cash Flow (€M) ---
  const cfWidth = 680;
  const cfHeight = 310;
  const cfPad = { top: 28, right: 28, bottom: 42, left: 62 };
  const cfPlotW = cfWidth - cfPad.left - cfPad.right;
  const cfPlotH = cfHeight - cfPad.top - cfPad.bottom;

  const minCashMeur = Math.min(
    -75,
    ...econ.series.map((d) =>
      Math.min(d.cumCashFlowCommercialMeur, d.cumCashFlowPppMeur, d.cumCashFlowSubsidizedMeur)
    )
  );
  const maxCashMeur = Math.max(
    110,
    ...econ.series.map((d) =>
      Math.max(d.cumCashFlowCommercialMeur, d.cumCashFlowPppMeur, d.cumCashFlowSubsidizedMeur)
    )
  );

  const getCfX = (year: number) => cfPad.left + (year / 20) * cfPlotW;
  const getCfY = (valMeur: number) =>
    cfPad.top + cfPlotH - ((valMeur - minCashMeur) / (maxCashMeur - minCashMeur)) * cfPlotH;

  const zeroY = getCfY(0);

  const buildPolyline = (getter: (pt: typeof econ.series[0]) => number) =>
    econ.series.map((pt) => `${getCfX(pt.year).toFixed(1)},${getCfY(getter(pt)).toFixed(1)}`).join(' ');

  const buildAreaAboveZero = (getter: (pt: typeof econ.series[0]) => number) => {
    const firstX = getCfX(0).toFixed(1);
    const lastX = getCfX(20).toFixed(1);
    const linePts = econ.series
      .map((pt) => `${getCfX(pt.year).toFixed(1)},${getCfY(getter(pt)).toFixed(1)}`)
      .join(' ');
    return `${firstX},${zeroY.toFixed(1)} ${linePts} ${lastX},${zeroY.toFixed(1)}`;
  };

  // --- SVG Geometry for Graph 3: 20-Year Cumulative CO2 Emissions Saved (tCO2e) ---
  const co2Width = 680;
  const co2Height = 310;
  const co2Pad = { top: 28, right: 28, bottom: 42, left: 68 };
  const co2PlotW = co2Width - co2Pad.left - co2Pad.right;
  const co2PlotH = co2Height - co2Pad.top - co2Pad.bottom;

  const maxCo2Tonnes = Math.max(
    220000,
    ...econ.series.map(
      (d) => d.cumHeatingCo2SavedTonnes + d.cumCoolingPueCo2SavedTonnes + d.cumOrcWaterCo2SavedTonnes
    )
  );

  const getCo2X = (year: number) => co2Pad.left + (year / 20) * co2PlotW;
  const getCo2Y = (tonnes: number) =>
    co2Pad.top + co2PlotH - (Math.max(0, tonnes) / maxCo2Tonnes) * co2PlotH;

  // Stacked Area polygons for CO2 (Layer 1: Heating, Layer 2: +Cooling PUE, Layer 3: +ORC & Water)
  const heatingAreaPoints = [
    `${getCo2X(0).toFixed(1)},${getCo2Y(0).toFixed(1)}`,
    ...econ.series.map(
      (pt) => `${getCo2X(pt.year).toFixed(1)},${getCo2Y(pt.cumHeatingCo2SavedTonnes).toFixed(1)}`
    ),
    `${getCo2X(20).toFixed(1)},${getCo2Y(0).toFixed(1)}`,
  ].join(' ');

  const coolingAreaPoints = [
    ...econ.series.map(
      (pt) =>
        `${getCo2X(pt.year).toFixed(1)},${getCo2Y(
          pt.cumHeatingCo2SavedTonnes + pt.cumCoolingPueCo2SavedTonnes
        ).toFixed(1)}`
    ),
    ...[...econ.series]
      .reverse()
      .map(
        (pt) => `${getCo2X(pt.year).toFixed(1)},${getCo2Y(pt.cumHeatingCo2SavedTonnes).toFixed(1)}`
      ),
  ].join(' ');

  const totalGrossAreaPoints = [
    ...econ.series.map(
      (pt) =>
        `${getCo2X(pt.year).toFixed(1)},${getCo2Y(
          pt.cumHeatingCo2SavedTonnes +
            pt.cumCoolingPueCo2SavedTonnes +
            pt.cumOrcWaterCo2SavedTonnes
        ).toFixed(1)}`
    ),
    ...[...econ.series]
      .reverse()
      .map(
        (pt) =>
          `${getCo2X(pt.year).toFixed(1)},${getCo2Y(
            pt.cumHeatingCo2SavedTonnes + pt.cumCoolingPueCo2SavedTonnes
          ).toFixed(1)}`
      ),
  ].join(' ');

  const netCo2LinePoints = econ.series
    .map((pt) => `${getCo2X(pt.year).toFixed(1)},${getCo2Y(pt.cumNetCo2SavedTonnes).toFixed(1)}`)
    .join(' ');

  const inspectedCashForActiveRegime =
    selectedRegime === 'subsidized-tallaght'
      ? inspectedPoint.cumCashFlowSubsidizedMeur
      : selectedRegime === 'municipal-ppp'
      ? inspectedPoint.cumCashFlowPppMeur
      : inspectedPoint.cumCashFlowCommercialMeur;

  return (
    <section id="economics-carbon" className="space-y-6 pt-6 border-t border-[#2B3240]">
      {/* Section Header + Controls */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-mono uppercase text-[#6DB39F]">
            02. Financial Expenditure, ROI Payback &amp; Decarbonisation Trajectories
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#D5DEE8] mt-0.5">
            Capital Expenditure / Money Saved &amp; Cumulative CO₂ Emissions Abatement Graphs
          </h2>
          <p className="text-sm text-[#9BA5B4] mt-1 max-w-3xl">
            Live 20-year financial cash flow and carbon abatement curves dynamically coupled to your{' '}
            <span className="font-mono text-[#C8D0DC]">{params.computeCapacityMw} MW</span> vault,{' '}
            <span className="font-mono text-[#C8D0DC]">
              {params.residentsCount.toLocaleString()}
            </span>{' '}
            residents, and{' '}
            <span className="font-mono text-[#C8D0DC]">
              {params.coolingTopology === 'two-phase-immersion'
                ? 'Two-Phase Immersion (PUE 1.03)'
                : params.coolingTopology === 'single-phase-immersion'
                ? 'Single-Phase Immersion (PUE 1.06)'
                : 'Direct-to-Chip (PUE 1.22)'}
            </span>{' '}
            configuration.
          </p>
        </div>

        {/* Concrete Embodied Carbon Spec Toggle */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <span className="text-xs font-mono text-[#8A94A6]">Vault Foundation Concrete:</span>
          <div
            role="group"
            aria-label="Subterranean concrete embodied carbon specification"
            className="flex items-center gap-1 bg-[#1E232D] p-1 border border-[#2B3240]"
          >
            <button
              type="button"
              onClick={() => setConcreteSpec('low-carbon-0162')}
              className={`px-2.5 py-1 text-xs font-mono transition-colors cursor-pointer whitespace-nowrap ${
                concreteSpec === 'low-carbon-0162'
                  ? 'bg-[#263C38] text-[#86C4B5] border border-[#426E65] font-semibold'
                  : 'text-[#8A94A6] hover:text-[#C8D0DC]'
              }`}
            >
              0.162 kgCO₂e/kg (Low-Carbon)
            </button>
            <button
              type="button"
              onClick={() => setConcreteSpec('standard-0243')}
              className={`px-2.5 py-1 text-xs font-mono transition-colors cursor-pointer whitespace-nowrap ${
                concreteSpec === 'standard-0243'
                  ? 'bg-[#2E3846] text-[#D5DEE8] border border-[#5B9BD5] font-semibold'
                  : 'text-[#8A94A6] hover:text-[#C8D0DC]'
              }`}
            >
              0.243 kgCO₂e/kg (Standard)
            </button>
          </div>
        </div>
      </div>

      {/* 4-Card Financial & Carbon Headline Telemetry Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-[#1E232D] border border-[#2B3240]">
          <div className="flex items-center justify-between text-xs font-mono uppercase text-[#8A94A6]">
            <span>Net CAPEX Outlay ({activeRegimeMeta.shortLabel})</span>
            <Building2 className="w-3.5 h-3.5 text-[#7CA8D4]" />
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-2xl font-mono font-bold text-[#D5DEE8] tabular-nums">
              €{econ.netCapexByRegimeMeur[selectedRegime].toFixed(1)}M
            </span>
            <span className="text-xs font-mono text-[#8A94A6]">
              (Gross €{results.grossCapexMillionEur.toFixed(1)}M)
            </span>
          </div>
          <div className="mt-1.5 text-xs font-mono text-[#9BA5B4]">
            ● Payback: <strong className="text-[#6DB39F]">{econ.paybackByRegimeYears[selectedRegime]} yrs</strong> ({activeRegimeMeta.benchmarkTag})
          </div>
        </div>

        <div className="p-4 bg-[#1E232D] border border-[#2B3240]">
          <div className="flex items-center justify-between text-xs font-mono uppercase text-[#8A94A6]">
            <span>Annual Money Saved vs. OPEX</span>
            <Coins className="w-3.5 h-3.5 text-[#C98253]" />
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-2xl font-mono font-bold text-[#6DB39F] tabular-nums">
              +€{results.annualNetSavingsMillionEur.toFixed(2)}M
            </span>
            <span className="text-xs font-mono text-[#8A94A6]">/yr net saved</span>
          </div>
          <div className="mt-1.5 text-xs font-mono text-[#9BA5B4]">
            ● €{results.annualGrossSavingsMillionEur.toFixed(2)}M gross saved − €{results.annualOpexMillionEur.toFixed(2)}M OPEX
          </div>
        </div>

        <div className="p-4 bg-[#1E232D] border border-[#2B3240]">
          <div className="flex items-center justify-between text-xs font-mono uppercase text-[#8A94A6]">
            <span>20-Year Cumulative Net Profit</span>
            <TrendingUp className="w-3.5 h-3.5 text-[#6DB39F]" />
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-2xl font-mono font-bold text-[#D5DEE8] tabular-nums">
              +€{econ.twentyYearNetGainByRegimeMeur[selectedRegime].toFixed(1)}M
            </span>
            <span className="text-xs font-mono text-[#8A94A6]">net cumulative</span>
          </div>
          <div className="mt-1.5 text-xs font-mono text-[#7CA8D4]">
            ◆ Tallaght Pilot: {results.paybackYearsSubsidized} yr ROI · Market: {results.paybackYearsCommercial} yr ROI
          </div>
        </div>

        <div className="p-4 bg-[#1E232D] border border-[#2B3240]">
          <div className="flex items-center justify-between text-xs font-mono uppercase text-[#8A94A6]">
            <span>Annual &amp; 20-Yr CO₂ Emissions Saved</span>
            <Leaf className="w-3.5 h-3.5 text-[#6DB39F]" />
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-2xl font-mono font-bold text-[#6DB39F] tabular-nums">
              {results.totalAnnualCo2SavedTonnes.toLocaleString()}
            </span>
            <span className="text-xs font-mono text-[#8A94A6]">tCO₂e/yr</span>
          </div>
          <div className="mt-1.5 text-xs font-mono text-[#9BA5B4]">
            ● 20-Yr Net: <strong className="text-[#D5DEE8]">{econ.twentyYearNetCo2SavedTonnes.toLocaleString()} tCO₂e</strong> (Concrete paid back in {econ.carbonPaybackMonths} mo)
          </div>
        </div>
      </div>

      {/* Interactive Regime Selector + Year Scrubber Toolbar */}
      <div className="bg-[#1E232D] border border-[#2B3240] p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="text-xs font-mono uppercase text-[#8A94A6]">
            Select Capital Financing Regime (Benchmark Comparison):
          </div>
          <div
            role="group"
            aria-label="Select capital financing regime"
            className="flex flex-wrap items-center gap-2"
          >
            {FUNDING_REGIMES.map((regime) => {
              const active = selectedRegime === regime.id;
              return (
                <button
                  key={regime.id}
                  type="button"
                  onClick={() => setSelectedRegime(regime.id)}
                  className={`px-3 py-1.5 text-xs font-mono transition-colors cursor-pointer flex items-center gap-2 ${
                    active
                      ? 'bg-[#283548] text-[#D5DEE8] border border-[#5B9BD5] font-semibold'
                      : 'bg-[#181C24] text-[#9BA5B4] border border-[#2B3240] hover:bg-[#222834] hover:text-[#C8D0DC]'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 inline-block"
                    style={{ backgroundColor: regime.color }}
                  />
                  <span>{regime.shortLabel}</span>
                  <span className="text-[11px] text-[#8A94A6]">
                    ({econ.paybackByRegimeYears[regime.id]} yr ROI)
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Year Scrubber (Year 0 to Year 20) */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-[#181C24] border border-[#2B3240] px-4 py-2.5 min-w-[320px]">
          <div className="flex items-center justify-between sm:justify-start gap-2">
            <label
              htmlFor="year-inspector-slider"
              className="text-xs font-mono uppercase text-[#8A94A6] whitespace-nowrap"
            >
              Inspect Horizon:
            </label>
            <span className="text-xs font-mono font-bold text-[#D5DEE8] bg-[#253042] px-2 py-0.5 border border-[#3E506B] tabular-nums">
              Year {inspectedYear} ({2045 + inspectedYear})
            </span>
          </div>
          <input
            id="year-inspector-slider"
            type="range"
            min={0}
            max={20}
            step={1}
            value={inspectedYear}
            onChange={(e) => setInspectedYear(Number(e.target.value))}
            className="w-full sm:w-36 accent-[#5B9BD5] cursor-pointer"
          />
        </div>
      </div>

      {/* Primary Two-Graph Row: Left = 20-Year Financial Cash Flow & Payback, Right = 20-Year CO2 Emissions Saved */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* GRAPH 1: 20-Year Cumulative Cash Flow, Expenditure & Saved Money (€M) */}
        <div className="xl:col-span-6 bg-[#1E232D] border border-[#2B3240] p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-mono uppercase text-[#7CA8D4]">
                Graph A · Cumulative Expenditure &amp; Net Money Saved (2045–2065)
              </span>
              <span className="text-xs font-mono text-[#6DB39F]">
                Year {inspectedYear} Balance:{' '}
                <strong>
                  {inspectedCashForActiveRegime >= 0 ? '+' : ''}€
                  {inspectedCashForActiveRegime.toFixed(1)}M
                </strong>
              </span>
            </div>
            <h3 className="text-base font-bold text-[#D5DEE8]">
              20-Year Cumulative Cash Flow &amp; Payback Horizon (€ Millions)
            </h3>
            <p className="text-xs text-[#9BA5B4]">
              Compares initial Year 0 CAPEX expenditure against cumulative operational savings across Subsidized Pilot (&lt;2 yrs, Tallaght), Municipal PPP (~{results.paybackYearsPpp} yrs), and Standard Market ({results.paybackYearsCommercial} yrs). Click any year point on the graph to inspect.
            </p>
          </div>

          {/* SVG Line & Area Chart */}
          <div className="w-full bg-[#181C24] border border-[#2B3240] p-2">
            <svg
              viewBox={`0 0 ${cfWidth} ${cfHeight}`}
              className="w-full h-auto block select-none"
              role="img"
              aria-label="20-Year Cumulative Expenditure and Saved Money Graph in Million Euros"
            >
              {/* Horizontal Grid Lines & Y-Axis Labels */}
              {[-60, -30, 0, 30, 60, 90, 120]
                .filter((v) => v >= minCashMeur - 10 && v <= maxCashMeur + 10)
                .map((tick) => {
                  const y = getCfY(tick);
                  const isZero = tick === 0;
                  return (
                    <g key={tick}>
                      <line
                        x1={cfPad.left}
                        y1={y}
                        x2={cfWidth - cfPad.right}
                        y2={y}
                        stroke={isZero ? '#5B6982' : '#262D3B'}
                        strokeWidth={isZero ? '1.5' : '1'}
                        strokeDasharray={isZero ? '4 3' : undefined}
                      />
                      <text
                        x={cfPad.left - 8}
                        y={y + 4}
                        textAnchor="end"
                        fill={isZero ? '#C8D0DC' : '#8A94A6'}
                        fontSize="10.5"
                        className="font-mono"
                      >
                        {tick > 0 ? `+€${tick}M` : `€${tick}M`}
                      </text>
                    </g>
                  );
                })}

              {/* Break-even label on zero line */}
              <text
                x={cfWidth - cfPad.right - 4}
                y={zeroY - 6}
                textAnchor="end"
                fill="#9BA5B4"
                fontSize="9.5"
                className="font-mono"
              >
                €0M Break-Even Threshold (Payback Crossover)
              </text>

              {/* Shaded area for currently selected regime */}
              <polygon
                points={buildAreaAboveZero((pt) =>
                  selectedRegime === 'subsidized-tallaght'
                    ? pt.cumCashFlowSubsidizedMeur
                    : selectedRegime === 'municipal-ppp'
                    ? pt.cumCashFlowPppMeur
                    : pt.cumCashFlowCommercialMeur
                )}
                fill={activeRegimeMeta.color}
                opacity="0.11"
              />

              {/* Curve 1: Commercial Market (8-12 Yr) */}
              <polyline
                fill="none"
                stroke="#C98253"
                strokeWidth={selectedRegime === 'commercial-market' ? '3' : '1.75'}
                opacity={selectedRegime === 'commercial-market' ? 1 : 0.65}
                points={buildPolyline((pt) => pt.cumCashFlowCommercialMeur)}
              />

              {/* Curve 2: Municipal PPP */}
              <polyline
                fill="none"
                stroke="#7CA8D4"
                strokeWidth={selectedRegime === 'municipal-ppp' ? '3' : '1.75'}
                opacity={selectedRegime === 'municipal-ppp' ? 1 : 0.65}
                points={buildPolyline((pt) => pt.cumCashFlowPppMeur)}
              />

              {/* Curve 3: Subsidized Pilot (Tallaght <2 Yr) */}
              <polyline
                fill="none"
                stroke="#6DB39F"
                strokeWidth={selectedRegime === 'subsidized-tallaght' ? '3' : '1.75'}
                opacity={selectedRegime === 'subsidized-tallaght' ? 1 : 0.65}
                points={buildPolyline((pt) => pt.cumCashFlowSubsidizedMeur)}
              />

              {/* Payback Crossover Vertical Marker for Commercial Market */}
              {results.paybackYearsCommercial <= 20 && (
                <g>
                  <circle
                    cx={getCfX(results.paybackYearsCommercial)}
                    cy={zeroY}
                    r="4.5"
                    fill="#C98253"
                    stroke="#181C24"
                    strokeWidth="1.5"
                  />
                  <text
                    x={getCfX(results.paybackYearsCommercial)}
                    y={zeroY + 15}
                    textAnchor="middle"
                    fill="#C98253"
                    fontSize="9.5"
                    fontWeight="600"
                    className="font-mono"
                  >
                    Market ROI: {results.paybackYearsCommercial}y
                  </text>
                </g>
              )}

              {/* Payback Crossover Marker for Subsidized Tallaght Pilot */}
              {results.paybackYearsSubsidized <= 20 && (
                <g>
                  <circle
                    cx={getCfX(results.paybackYearsSubsidized)}
                    cy={zeroY}
                    r="4.5"
                    fill="#6DB39F"
                    stroke="#181C24"
                    strokeWidth="1.5"
                  />
                  <text
                    x={getCfX(results.paybackYearsSubsidized) + 4}
                    y={zeroY - 8}
                    textAnchor="start"
                    fill="#6DB39F"
                    fontSize="9.5"
                    fontWeight="600"
                    className="font-mono"
                  >
                    Tallaght: {results.paybackYearsSubsidized}y
                  </text>
                </g>
              )}

              {/* Vertical Inspected Year Cursor Line */}
              <line
                x1={getCfX(inspectedYear)}
                y1={cfPad.top}
                x2={getCfX(inspectedYear)}
                y2={cfHeight - cfPad.bottom}
                stroke="#7CA8D4"
                strokeWidth="1.2"
                strokeDasharray="3 3"
              />

              {/* Interactive Year Nodes */}
              {econ.series.map((pt) => {
                const cx = getCfX(pt.year);
                const val =
                  selectedRegime === 'subsidized-tallaght'
                    ? pt.cumCashFlowSubsidizedMeur
                    : selectedRegime === 'municipal-ppp'
                    ? pt.cumCashFlowPppMeur
                    : pt.cumCashFlowCommercialMeur;
                const cy = getCfY(val);
                const isSelected = pt.year === inspectedYear;
                return (
                  <g
                    key={pt.year}
                    onClick={() => setInspectedYear(pt.year)}
                    onMouseEnter={() => setInspectedYear(pt.year)}
                    className="cursor-pointer"
                  >
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isSelected ? 5.5 : 3}
                      fill={isSelected ? '#D5DEE8' : activeRegimeMeta.color}
                      stroke="#181C24"
                      strokeWidth="1.5"
                    />
                    {pt.year % 2 === 0 && (
                      <text
                        x={cx}
                        y={cfHeight - 14}
                        textAnchor="middle"
                        fill={isSelected ? '#D5DEE8' : '#8A94A6'}
                        fontSize="10"
                        fontWeight={isSelected ? '700' : '400'}
                        className="font-mono"
                      >
                        Y{pt.year}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Legend & Inspected Year Readout Box */}
          <div className="p-3 bg-[#181C24] border border-[#2B3240] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5 text-[#6DB39F]">
                <span className="w-2.5 h-2.5 bg-[#6DB39F] inline-block" />
                Tallaght Subsidized ({results.paybackYearsSubsidized}y)
              </span>
              <span className="flex items-center gap-1.5 text-[#7CA8D4]">
                <span className="w-2.5 h-2.5 bg-[#7CA8D4] inline-block" />
                Municipal PPP ({results.paybackYearsPpp}y)
              </span>
              <span className="flex items-center gap-1.5 text-[#C98253]">
                <span className="w-2.5 h-2.5 bg-[#C98253] inline-block" />
                Standard Market ({results.paybackYearsCommercial}y)
              </span>
            </div>
            <div className="text-[#C8D0DC]">
              Y{inspectedYear}: Tallaght{' '}
              <strong className="text-[#6DB39F]">
                {inspectedPoint.cumCashFlowSubsidizedMeur >= 0 ? '+' : ''}€
                {inspectedPoint.cumCashFlowSubsidizedMeur.toFixed(1)}M
              </strong>{' '}
              · Market{' '}
              <strong className="text-[#C98253]">
                {inspectedPoint.cumCashFlowCommercialMeur >= 0 ? '+' : ''}€
                {inspectedPoint.cumCashFlowCommercialMeur.toFixed(1)}M
              </strong>
            </div>
          </div>
        </div>

        {/* GRAPH 2 (Right Top): 20-Year Cumulative CO2 Emissions Saved & Concrete Embodied Carbon */}
        <div className="xl:col-span-6 bg-[#1E232D] border border-[#2B3240] p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-mono uppercase text-[#6DB39F]">
                Graph B · Cumulative CO₂ Emissions Saved vs. Embodied Carbon (tCO₂e)
              </span>
              <span className="text-xs font-mono text-[#D5DEE8]">
                Year {inspectedYear} Net Saved:{' '}
                <strong className="text-[#6DB39F]">
                  {inspectedPoint.cumNetCo2SavedTonnes.toLocaleString()} tCO₂e
                </strong>
              </span>
            </div>
            <h3 className="text-base font-bold text-[#D5DEE8]">
              20-Year Stacked CO₂ Emissions Saved &amp; Concrete Carbon Payback
            </h3>
            <p className="text-xs text-[#9BA5B4]">
              Accounts for Year 0 subterranean foundation concrete embodied carbon ({concreteSpec === 'low-carbon-0162' ? '0.162' : '0.243'} kgCO₂e/kg ={' '}
              {econ.embodiedCarbonTonnes.toLocaleString()} tCO₂e, paid back in {econ.carbonPaybackMonths} months) vs. displaced district heating gas, immersion cooling PUE savings, and ORC/rainwater credits.
            </p>
          </div>

          {/* SVG Stacked Area CO2 Graph */}
          <div className="w-full bg-[#181C24] border border-[#2B3240] p-2">
            <svg
              viewBox={`0 0 ${co2Width} ${co2Height}`}
              className="w-full h-auto block select-none"
              role="img"
              aria-label="20-Year Cumulative CO2 Emissions Saved Stacked Area Graph"
            >
              {/* Horizontal Grid Lines & Y-Axis Labels */}
              {[0, 50000, 100000, 150000, 200000, 250000]
                .filter((v) => v <= maxCo2Tonnes + 25000)
                .map((tick) => {
                  const y = getCo2Y(tick);
                  return (
                    <g key={tick}>
                      <line
                        x1={co2Pad.left}
                        y1={y}
                        x2={co2Width - co2Pad.right}
                        y2={y}
                        stroke="#262D3B"
                        strokeWidth="1"
                      />
                      <text
                        x={co2Pad.left - 8}
                        y={y + 4}
                        textAnchor="end"
                        fill="#8A94A6"
                        fontSize="10.5"
                        className="font-mono"
                      >
                        {tick === 0 ? '0 t' : `${(tick / 1000).toFixed(0)}k t`}
                      </text>
                    </g>
                  );
                })}

              {/* Stacked Area 1: Displaced District Heating Gas/Fossil CO2 */}
              <polygon points={heatingAreaPoints} fill="#5AA897" opacity="0.32" />

              {/* Stacked Area 2: Liquid Cooling PUE Electricity CO2 Saved */}
              <polygon points={coolingAreaPoints} fill="#5B9BD5" opacity="0.34" />

              {/* Stacked Area 3: ORC/TEG & Rainwater Loop CO2 Saved */}
              <polygon points={totalGrossAreaPoints} fill="#C98253" opacity="0.38" />

              {/* Net CO2 Saved Line (Gross minus Year 0 Foundation Concrete Embodied Carbon) */}
              <polyline
                fill="none"
                stroke="#6DB39F"
                strokeWidth="2.75"
                points={netCo2LinePoints}
              />

              {/* Year 0 Embodied Carbon Debt Annotation */}
              <g>
                <circle
                  cx={getCo2X(0)}
                  cy={getCo2Y(0)}
                  r="4.5"
                  fill="#C87A7A"
                  stroke="#181C24"
                  strokeWidth="1.5"
                />
                <text
                  x={getCo2X(0) + 10}
                  y={getCo2Y(0) - 10}
                  fill="#C89B54"
                  fontSize="9.5"
                  fontWeight="600"
                  className="font-mono"
                >
                  Y0 Concrete Debt: -{econ.embodiedCarbonTonnes.toLocaleString()} tCO₂e (Paid back in {econ.carbonPaybackMonths} mo)
                </text>
              </g>

              {/* Vertical Inspected Year Cursor Line */}
              <line
                x1={getCo2X(inspectedYear)}
                y1={co2Pad.top}
                x2={getCo2X(inspectedYear)}
                y2={co2Height - co2Pad.bottom}
                stroke="#6DB39F"
                strokeWidth="1.2"
                strokeDasharray="3 3"
              />

              {/* Interactive Year Nodes on Net CO2 Curve */}
              {econ.series.map((pt) => {
                const cx = getCo2X(pt.year);
                const cy = getCo2Y(pt.cumNetCo2SavedTonnes);
                const isSelected = pt.year === inspectedYear;
                return (
                  <g
                    key={pt.year}
                    onClick={() => setInspectedYear(pt.year)}
                    onMouseEnter={() => setInspectedYear(pt.year)}
                    className="cursor-pointer"
                  >
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isSelected ? 5.5 : 3}
                      fill={isSelected ? '#D5DEE8' : '#6DB39F'}
                      stroke="#181C24"
                      strokeWidth="1.5"
                    />
                    {pt.year % 2 === 0 && (
                      <text
                        x={cx}
                        y={co2Height - 14}
                        textAnchor="middle"
                        fill={isSelected ? '#D5DEE8' : '#8A94A6'}
                        fontSize="10"
                        fontWeight={isSelected ? '700' : '400'}
                        className="font-mono"
                      >
                        Y{pt.year}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* CO2 Legend & Inspected Year Breakdown */}
          <div className="p-3 bg-[#181C24] border border-[#2B3240] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5 text-[#6DB39F]">
                <span className="w-2.5 h-2.5 bg-[#5AA897] inline-block" />
                Heating Displaced ({results.annualCo2DisplacedTonnes.toLocaleString()} t/yr)
              </span>
              <span className="flex items-center gap-1.5 text-[#7CA8D4]">
                <span className="w-2.5 h-2.5 bg-[#5B9BD5] inline-block" />
                PUE Power Saved ({results.annualCoolingCo2SavedTonnes.toLocaleString()} t/yr)
              </span>
              <span className="flex items-center gap-1.5 text-[#C98253]">
                <span className="w-2.5 h-2.5 bg-[#C98253] inline-block" />
                ORC/TEG + Water ({results.annualOrcAndWaterCo2SavedTonnes.toLocaleString()} t/yr)
              </span>
            </div>
            <div className="text-[#C8D0DC]">
              Y{inspectedYear} Net:{' '}
              <strong className="text-[#6DB39F]">
                {inspectedPoint.cumNetCo2SavedTonnes.toLocaleString()} tCO₂e
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Two-Graph Row: Left = Annual Expenditure vs. Saved Money Bar Graph, Right = Subterranean CAPEX & Concrete Carbon Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* GRAPH 3: Annual Expenditure vs. Gross & Net Money Saved Breakdown (€M/yr) */}
        <div className="lg:col-span-6 bg-[#1E232D] border border-[#2B3240] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#2B3240] pb-3">
            <div>
              <div className="text-xs font-mono uppercase text-[#C98253]">
                Graph C · Annual Operational Expenditure vs. Saved Money Streams
              </div>
              <h3 className="text-sm sm:text-base font-bold text-[#D5DEE8] mt-0.5">
                Annual Cash Flow Waterfall (€M / Year)
              </h3>
            </div>
            <div className="text-right font-mono">
              <div className="text-xs text-[#8A94A6]">Net Annual Saving</div>
              <div className="text-base font-bold text-[#6DB39F] tabular-nums">
                +€{results.annualNetSavingsMillionEur.toFixed(2)}M / yr
              </div>
            </div>
          </div>

          <div className="space-y-3.5">
            {econ.annualCashBreakdown.map((item) => {
              const maxBarMeur = Math.max(6.0, results.annualGrossSavingsMillionEur);
              const widthPct = Math.min(100, Math.max(6, (item.amountMeur / maxBarMeur) * 100));
              const isExpense = item.type === 'expenditure';
              return (
                <div key={item.label} className="space-y-1">
                  <div className="flex items-baseline justify-between text-xs font-mono">
                    <span className="text-[#C8D0DC] font-medium">{item.label}</span>
                    <span
                      className={`font-bold tabular-nums ${
                        isExpense ? 'text-[#D48484]' : 'text-[#6DB39F]'
                      }`}
                    >
                      {isExpense ? '−' : '+'}€{item.amountMeur.toFixed(2)}M/yr
                    </span>
                  </div>
                  <div className="w-full h-3 bg-[#181C24] border border-[#2B3240] overflow-hidden">
                    <div
                      className="h-full transition-all duration-300"
                      style={{
                        width: `${widthPct}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                  <div className="text-[11px] font-mono text-[#8A94A6]">{item.detail}</div>
                </div>
              );
            })}
          </div>

          {/* Summary Comparison Bar: Total Gross Saved vs Annual Expenditure */}
          <div className="pt-3 border-t border-[#2B3240] grid grid-cols-3 gap-3 font-mono text-xs">
            <div className="p-2.5 bg-[#181C24] border border-[#2B3240]">
              <div className="text-[#8A94A6]">Gross Saved / Yr</div>
              <div className="text-sm font-bold text-[#6DB39F] mt-0.5 tabular-nums">
                +€{results.annualGrossSavingsMillionEur.toFixed(2)}M
              </div>
            </div>
            <div className="p-2.5 bg-[#181C24] border border-[#2B3240]">
              <div className="text-[#8A94A6]">Annual OPEX / Yr</div>
              <div className="text-sm font-bold text-[#D48484] mt-0.5 tabular-nums">
                −€{results.annualOpexMillionEur.toFixed(2)}M
              </div>
            </div>
            <div className="p-2.5 bg-[#181C24] border border-[#2B3240]">
              <div className="text-[#8A94A6]">Savings-to-OPEX Ratio</div>
              <div className="text-sm font-bold text-[#D5DEE8] mt-0.5 tabular-nums">
                {(results.annualGrossSavingsMillionEur / Math.max(0.1, results.annualOpexMillionEur)).toFixed(1)}× Coverage
              </div>
            </div>
          </div>
        </div>

        {/* GRAPH 4: Capital Expenditure (CAPEX) Allocation & Embodied Carbon Breakdown */}
        <div className="lg:col-span-6 bg-[#1E232D] border border-[#2B3240] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#2B3240] pb-3">
            <div>
              <div className="text-xs font-mono uppercase text-[#7CA8D4]">
                Graph D · Subterranean Capital Expenditure (CAPEX) Breakdown
              </div>
              <h3 className="text-sm sm:text-base font-bold text-[#D5DEE8] mt-0.5">
                Initial Infrastructure Expenditure by Subsystem (€{results.grossCapexMillionEur.toFixed(1)}M Gross)
              </h3>
            </div>
            <div className="text-right font-mono">
              <div className="text-xs text-[#8A94A6]">Embodied Carbon</div>
              <div className="text-base font-bold text-[#C8D0DC] tabular-nums">
                {econ.embodiedCarbonTonnes.toLocaleString()} tCO₂e
              </div>
            </div>
          </div>

          {/* Stacked Proportion Bar */}
          <div className="space-y-1.5">
            <div className="w-full h-4 bg-[#181C24] border border-[#2B3240] flex overflow-hidden">
              {econ.capexBreakdown.map((item) => (
                <div
                  key={item.code}
                  style={{
                    width: `${item.sharePercent}%`,
                    backgroundColor: item.color,
                  }}
                  title={`${item.label}: €${item.amountMeur}M (${item.sharePercent}%)`}
                  className="h-full border-r border-[#181C24] last:border-r-0 transition-all duration-300"
                />
              ))}
            </div>
            <div className="flex justify-between text-[11px] font-mono text-[#8A94A6]">
              <span>0%</span>
              <span>Gross Capital Allocation (€{results.grossCapexMillionEur.toFixed(1)}M Total)</span>
              <span>100%</span>
            </div>
          </div>

          <div className="space-y-3">
            {econ.capexBreakdown.map((item) => (
              <div key={item.code} className="space-y-1">
                <div className="flex items-baseline justify-between text-xs font-mono">
                  <span className="flex items-center gap-2 text-[#C8D0DC] font-medium">
                    <span
                      className="w-2.5 h-2.5 inline-block shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.label}</span>
                  </span>
                  <span className="font-bold text-[#D5DEE8] tabular-nums whitespace-nowrap">
                    €{item.amountMeur.toFixed(2)}M ({item.sharePercent}%)
                  </span>
                </div>
                <div className="text-[11px] font-mono text-[#8A94A6] pl-4">{item.detail}</div>
              </div>
            ))}
          </div>

          {/* Embodied Carbon vs Annual CO2 Saved Comparison Footer */}
          <div className="pt-3 border-t border-[#2B3240] p-3 bg-[#181C24] border border-[#2B3240] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
            <div>
              <span className="text-[#8A94A6]">Concrete Embodied Carbon Range: </span>
              <span className="text-[#C8D0DC] font-semibold">
                {results.embodiedCarbonLowTonnes.toLocaleString()} t (0.162) –{' '}
                {results.embodiedCarbonHighTonnes.toLocaleString()} t (0.243 kgCO₂e/kg)
              </span>
            </div>
            <div className="text-[#6DB39F] font-semibold">
              Offset Ratio: {(econ.twentyYearNetCo2SavedTonnes / Math.max(1, econ.embodiedCarbonTonnes)).toFixed(0)}× over 20 yrs
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

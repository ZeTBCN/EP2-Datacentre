import React from 'react';
import {
  SCHEMATIC_NODES,
  SchematicNodeData,
  FlowCategory,
} from '../data/schematicNodes';
import { SimulationParams, SimulationResults } from '../utils/thermodynamics';

interface FlowSchematicCanvasProps {
  params: SimulationParams;
  results: SimulationResults;
  selectedNodeId: string | null;
  hoveredNodeId: string | null;
  activeFlowFilter: FlowCategory;
  isAnimationPlaying: boolean;
  onSelectNode: (node: SchematicNodeData) => void;
  onHoverNode: (nodeId: string | null) => void;
}

export const FlowSchematicCanvas: React.FC<FlowSchematicCanvasProps> = ({
  params,
  results,
  selectedNodeId,
  hoveredNodeId,
  activeFlowFilter,
  isAnimationPlaying,
  onSelectNode,
  onHoverNode,
}) => {
  const showTier1 = activeFlowFilter === 'all' || activeFlowFilter === 'tier1-passive';
  const showTier2 = activeFlowFilter === 'all' || activeFlowFilter === 'tier2-boosted';
  const showElectrical = activeFlowFilter === 'all' || activeFlowFilter === 'electrical-orc';
  const showHydro = activeFlowFilter === 'all' || activeFlowFilter === 'hydrological';

  const animFast = isAnimationPlaying ? 'animate-flow-fast' : '';
  const animMed = isAnimationPlaying ? 'animate-flow-medium' : '';
  const animSlow = isAnimationPlaying ? 'animate-flow-slow' : '';
  const animRev = isAnimationPlaying ? 'animate-flow-reverse' : '';

  return (
    <div className="relative w-full bg-[#1E232D] border border-[#2B3240] rounded-none overflow-hidden">
      {/* Top Canvas Telemetry Bar (Low-Contrast Muted Slate) */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-2.5 bg-[#222834] border-b border-[#2B3240] text-xs">
        <div className="flex items-center gap-2.5 text-[#9BA5B4]">
          <span className="font-mono font-semibold text-[#C8D0DC] whitespace-nowrap">
            2045 THERMAL &amp; VIBRATION ARCHITECTURE SCHEMATIC
          </span>
          <span aria-hidden="true" className="text-[#454F62]">·</span>
          <span className="font-mono text-[#8A94A6]">
            Click any numbered node [01–11] for technical popup specifications
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3.5 font-mono text-xs">
          <span className="flex items-center gap-1.5 text-[#9BA5B4] whitespace-nowrap">
            <span className="inline-block w-3 h-0.5 bg-[#C98253]" />
            Tier 1 ({results.coolantOutletTempC}°C)
          </span>
          <span className="flex items-center gap-1.5 text-[#9BA5B4] whitespace-nowrap">
            <span className="inline-block w-3 h-0.5 bg-[#BA7396]" />
            Tier 2 HTHP ({params.hthpTargetTempC}°C)
          </span>
          <span className="flex items-center gap-1.5 text-[#9BA5B4] whitespace-nowrap">
            <span className="inline-block w-3 h-0.5 bg-[#569EA8]" />
            Grid / ORC ({results.totalFacilityPowerMw} MW)
          </span>
          <span className="flex items-center gap-1.5 text-[#9BA5B4] whitespace-nowrap">
            <span className="inline-block w-3 h-0.5 bg-[#5B9BD5]" />
            Rainwater ({(results.annualRainwaterHarvestM3 / 1000).toFixed(0)}k m³/yr)
          </span>
        </div>
      </div>

      {/* Main High-Fidelity Vector Flow Schematic (Low-Contrast Dark Slate) */}
      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox="0 0 1120 740"
          className="w-full h-auto min-w-[820px] select-none bg-[#181C24]"
          role="img"
          aria-label="Interactive 3-tier subterranean data centre waste-heat recovery, 5GDHC district heating, and Appendix 1 vibration isolation flow schematic"
        >
          <defs>
            {/* Subtle Low-Contrast Technical Grid */}
            <pattern id="tech-grid" width="28" height="28" patternUnits="userSpaceOnUse">
              <path
                d="M 28 0 L 0 0 0 28"
                fill="none"
                stroke="#222834"
                strokeWidth="0.65"
              />
            </pattern>

            {/* Muted Low-Glare Arrow Markers */}
            <marker
              id="arrow-orange"
              viewBox="0 0 10 10"
              refX="7"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill="#C98253" />
            </marker>
            <marker
              id="arrow-amber"
              viewBox="0 0 10 10"
              refX="7"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill="#C89B54" />
            </marker>
            <marker
              id="arrow-magenta"
              viewBox="0 0 10 10"
              refX="7"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill="#BA7396" />
            </marker>
            <marker
              id="arrow-cyan"
              viewBox="0 0 10 10"
              refX="7"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill="#569EA8" />
            </marker>
            <marker
              id="arrow-sky"
              viewBox="0 0 10 10"
              refX="7"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill="#5B9BD5" />
            </marker>
          </defs>

          {/* Background Grid */}
          <rect x="0" y="0" width="1120" height="740" fill="url(#tech-grid)" />

          {/* Stratum Tinted Background Bands (Soft Low-Contrast Delta) */}
          {/* Stratum 1: Residential */}
          <rect x="0" y="0" width="1120" height="255" fill="#1C212B" fillOpacity="0.6" />
          {/* Stratum 2: Ground / Infrastructure */}
          <rect x="0" y="255" width="1120" height="245" fill="#191E27" fillOpacity="0.7" />
          {/* Stratum 3: Subterranean Level -3 / -4 Bedrock */}
          <rect x="0" y="500" width="1120" height="240" fill="#151921" fillOpacity="0.85" />

          {/* Stratum Horizontal Divider Lines */}
          <line x1="28" y1="255" x2="1092" y2="255" stroke="#363F50" strokeWidth="1.5" />
          <line x1="28" y1="500" x2="1092" y2="500" stroke="#363F50" strokeWidth="1.5" />

          {/* Left-Hand Stratum Labels (Unobstructed Column x=34..165) */}
          <g className="font-sans">
            <text x="34" y="118" fill="#C8D0DC" fontSize="15" fontWeight="700">
              Residential
            </text>
            <text x="34" y="138" fill="#8A94A6" fontSize="11" className="font-mono">
              20,000 NZEB Residents
            </text>
            <text x="34" y="154" fill="#8A94A6" fontSize="11" className="font-mono">
              40,100 MWh/yr Demand
            </text>

            <text x="34" y="352" fill="#C8D0DC" fontSize="15" fontWeight="700">
              Ground /
            </text>
            <text x="34" y="372" fill="#C8D0DC" fontSize="15" fontWeight="700">
              Infrastructure
            </text>
            <text x="34" y="392" fill="#8A94A6" fontSize="11" className="font-mono">
              5GDHC + HTHP + PTES
            </text>
            <text x="34" y="408" fill="#8A94A6" fontSize="11" className="font-mono">
              Line Loss: {results.effectiveLineLossWm} W/m
            </text>

            <text x="34" y="582" fill="#C8D0DC" fontSize="15" fontWeight="700">
              Subterranean
            </text>
            <text x="34" y="600" fill="#8A94A6" fontSize="11" className="font-mono">
              Level -3 / -4 Bedrock
            </text>
            <text x="34" y="616" fill="#8A94A6" fontSize="11" className="font-mono">
              {params.computeCapacityMw} MW ({results.activeRackCount} Racks)
            </text>
            <text x="34" y="632" fill="#789890" fontSize="10.5" className="font-mono">
              Off Load-Bearing Pillars
            </text>
          </g>

          {/* ==============================================================
              STRATUM 1: RESIDENTIAL BUILDINGS & PEDESTRIAN PLAZA SEGREGATION
             ============================================================== */}
          {/* Background Urban Skyline Silhouettes */}
          <polygon points="215,255 215,52 260,34 260,255" fill="#232936" opacity="0.55" />
          <polygon points="390,255 390,25 450,48 450,255" fill="#232936" opacity="0.55" />
          <polygon points="620,255 620,40 675,20 675,255" fill="#232936" opacity="0.55" />
          <polygon points="810,255 810,32 870,55 870,255" fill="#232936" opacity="0.55" />

          {/* Appendix 1 Spatial Segregation Callout at Surface Plaza / Parking Zone */}
          <rect
            x="212"
            y="236"
            width="348"
            height="18"
            fill="#1F2632"
            stroke="#363F50"
            strokeWidth="1"
          />
          <text x="386" y="248" textAnchor="middle" fill="#8A94A6" fontSize="9.5" className="font-mono">
            PEDESTRIAN PLAZA &amp; PARKING ZONE · SPATIALLY OFFSET FROM TOWER PILLARS
          </text>

          {/* LEFT RESIDENTIAL CLUSTER (Passive Underfloor Focus + DHW) */}
          <g>
            {/* Multi-storey Apartment Building 1A */}
            <rect x="235" y="75" width="52" height="110" fill="#252C3A" stroke="#4F5B70" strokeWidth="1.5" />
            <rect x="287" y="95" width="44" height="90" fill="#252C3A" stroke="#4F5B70" strokeWidth="1.5" />
            {/* Windows */}
            {[86, 102, 118, 134, 150, 166].map((wy) => (
              <g key={wy}>
                <rect x="243" y={wy} width="14" height="8" fill="#1B202B" stroke="#3D4758" strokeWidth="1" />
                <rect x="264" y={wy} width="14" height="8" fill="#1B202B" stroke="#3D4758" strokeWidth="1" />
              </g>
            ))}
            {[108, 128, 148, 166].map((wy) => (
              <g key={wy}>
                <rect x="295" y={wy} width="12" height="10" fill="#1B202B" stroke="#3D4758" strokeWidth="1" />
                <rect x="312" y={wy} width="12" height="10" fill="#1B202B" stroke="#3D4758" strokeWidth="1" />
              </g>
            ))}
            {/* Underfloor Heating Box 1A */}
            <rect x="230" y="185" width="106" height="48" fill="#1D222C" stroke="#5A667D" strokeWidth="1.5" />
            <text x="283" y="205" textAnchor="middle" fill="#C8D0DC" fontSize="11.5" fontWeight="600">
              Underfloor
            </text>
            <text x="283" y="220" textAnchor="middle" fill="#C8D0DC" fontSize="11.5" fontWeight="600">
              Heating
            </text>

            {/* Gabled Residence 1B */}
            <polygon
              points="375,112 435,62 495,112 495,233 375,233"
              fill="#252C3A"
              stroke="#4F5B70"
              strokeWidth="1.5"
            />
            {/* Domestic Hot Water Box 1B (Upper) */}
            <rect x="387" y="114" width="96" height="46" fill="#1D222C" stroke="#5A667D" strokeWidth="1.5" />
            <text x="435" y="134" textAnchor="middle" fill="#C8D0DC" fontSize="11.5" fontWeight="600">
              Domestic
            </text>
            <text x="435" y="149" textAnchor="middle" fill="#C8D0DC" fontSize="11.5" fontWeight="600">
              Hot Water
            </text>
            {/* Underfloor Heating Box 1B (Lower) */}
            <rect x="387" y="185" width="96" height="48" fill="#1D222C" stroke="#5A667D" strokeWidth="1.5" />
            <text x="435" y="205" textAnchor="middle" fill="#C8D0DC" fontSize="11.5" fontWeight="600">
              Underfloor
            </text>
            <text x="435" y="220" textAnchor="middle" fill="#C8D0DC" fontSize="11.5" fontWeight="600">
              Heating
            </text>
          </g>

          {/* RIGHT RESIDENTIAL CLUSTER (HTHP Boosted DHW & Underfloor) */}
          <g>
            {/* Apartment Block 2A */}
            <polygon
              points="575,92 612,92 612,68 692,68 692,233 575,233"
              fill="#252C3A"
              stroke="#4F5B70"
              strokeWidth="1.5"
            />
            <rect x="585" y="96" width="16" height="10" fill="#1B202B" stroke="#3D4758" strokeWidth="1" />
            <rect x="625" y="78" width="22" height="12" fill="#1B202B" stroke="#3D4758" strokeWidth="1" />
            {/* Domestic Hot Water Box 2A */}
            <rect x="587" y="114" width="94" height="46" fill="#1D222C" stroke="#5A667D" strokeWidth="1.5" />
            <text x="634" y="134" textAnchor="middle" fill="#C8D0DC" fontSize="11.5" fontWeight="600">
              Domestic
            </text>
            <text x="634" y="149" textAnchor="middle" fill="#C8D0DC" fontSize="11.5" fontWeight="600">
              Hot Water
            </text>
            {/* Underfloor Heating Box 2A */}
            <rect x="587" y="185" width="94" height="48" fill="#1D222C" stroke="#5A667D" strokeWidth="1.5" />
            <text x="634" y="205" textAnchor="middle" fill="#C8D0DC" fontSize="11.5" fontWeight="600">
              Underfloor
            </text>
            <text x="634" y="220" textAnchor="middle" fill="#C8D0DC" fontSize="11.5" fontWeight="600">
              Heating
            </text>

            {/* Gabled Residence 2B */}
            <polygon
              points="742,112 802,62 862,112 862,233 742,233"
              fill="#252C3A"
              stroke="#4F5B70"
              strokeWidth="1.5"
            />
            {/* Domestic Hot Water Box 2B */}
            <rect x="754" y="114" width="96" height="46" fill="#1D222C" stroke="#5A667D" strokeWidth="1.5" />
            <text x="802" y="134" textAnchor="middle" fill="#C8D0DC" fontSize="11.5" fontWeight="600">
              Domestic
            </text>
            <text x="802" y="149" textAnchor="middle" fill="#C8D0DC" fontSize="11.5" fontWeight="600">
              Hot Water
            </text>
            {/* Underfloor Heating Box 2B */}
            <rect x="754" y="185" width="96" height="48" fill="#1D222C" stroke="#5A667D" strokeWidth="1.5" />
            <text x="802" y="205" textAnchor="middle" fill="#C8D0DC" fontSize="11.5" fontWeight="600">
              Underfloor
            </text>
            <text x="802" y="220" textAnchor="middle" fill="#C8D0DC" fontSize="11.5" fontWeight="600">
              Heating
            </text>
          </g>

          {/* ==============================================================
              STRATUM 2: GROUND / INFRASTRUCTURE COMPONENTS
             ============================================================== */}
          {/* Upper Plate Heat Exchanger Cluster (2x2 Isometric Cubes) */}
          <g>
            {[
              { cx: 344, cy: 326 },
              { cx: 368, cy: 326 },
              { cx: 344, cy: 350 },
              { cx: 368, cy: 350 },
            ].map((cube, idx) => (
              <g key={idx}>
                <rect
                  x={cube.cx}
                  y={cube.cy}
                  width="20"
                  height="20"
                  fill="#252C3A"
                  stroke="#6D7A91"
                  strokeWidth="1.4"
                />
                <polygon
                  points={`${cube.cx},${cube.cy} ${cube.cx + 6},${cube.cy - 5} ${cube.cx + 26},${cube.cy - 5} ${cube.cx + 20},${cube.cy}`}
                  fill="#2F3747"
                  stroke="#6D7A91"
                  strokeWidth="1.2"
                />
              </g>
            ))}
            <text x="398" y="312" fill="#C8D0DC" fontSize="12" fontWeight="600">
              Plate Heat Exchangers
            </text>
            <text x="398" y="326" fill="#8A94A6" fontSize="10" className="font-mono">
              Supply: {results.pheSupplyTempC}°C (ΔT 2.5°C)
            </text>
          </g>

          {/* Lower Plate Heat Exchanger Cluster (2x2 Isometric Cubes) */}
          <g>
            {[
              { cx: 454, cy: 405 },
              { cx: 478, cy: 405 },
              { cx: 454, cy: 429 },
              { cx: 478, cy: 429 },
            ].map((cube, idx) => (
              <g key={idx}>
                <rect
                  x={cube.cx}
                  y={cube.cy}
                  width="20"
                  height="20"
                  fill="#252C3A"
                  stroke="#6D7A91"
                  strokeWidth="1.4"
                />
                <polygon
                  points={`${cube.cx},${cube.cy} ${cube.cx + 6},${cube.cy - 5} ${cube.cx + 26},${cube.cy - 5} ${cube.cx + 20},${cube.cy}`}
                  fill="#2F3747"
                  stroke="#6D7A91"
                  strokeWidth="1.2"
                />
              </g>
            ))}
            <text x="502" y="472" fill="#C8D0DC" fontSize="12" fontWeight="600">
              Low-Grade Waste Heat ({results.coolantOutletTempC}°C)
            </text>
          </g>

          {/* HTHP Plant (Node 06) */}
          <g>
            <rect
              x="640"
              y="330"
              width="106"
              height="104"
              fill="#252C3A"
              stroke="#6D7A91"
              strokeWidth="1.75"
            />
            {/* 3 Heat Pump Compressor Circles with Triangles */}
            {[
              { cx: 693, cy: 354, dir: 'left' },
              { cx: 666, cy: 402, dir: 'up' },
              { cx: 718, cy: 402, dir: 'up' },
            ].map((hp, i) => (
              <g key={i}>
                <circle
                  cx={hp.cx}
                  cy={hp.cy}
                  r="14"
                  fill="#1B202B"
                  stroke="#8A94A6"
                  strokeWidth="1.5"
                />
                {hp.dir === 'left' ? (
                  <polygon
                    points={`${hp.cx - 8},${hp.cy} ${hp.cx + 6},${hp.cy - 7} ${hp.cx + 6},${hp.cy + 7}`}
                    fill="none"
                    stroke="#BA7396"
                    strokeWidth="1.4"
                  />
                ) : (
                  <polygon
                    points={`${hp.cx},${hp.cy - 8} ${hp.cx - 7},${hp.cy + 6} ${hp.cx + 7},${hp.cy + 6}`}
                    fill="none"
                    stroke="#BA7396"
                    strokeWidth="1.4"
                  />
                )}
              </g>
            ))}
            <text x="635" y="274" textAnchor="end" fill="#C8D0DC" fontSize="12.5" fontWeight="600">
              HTHP Plant
            </text>
            <text x="635" y="289" textAnchor="end" fill="#8A94A6" fontSize="10.5" className="font-mono">
              COP {results.hthpRealCop} ({params.useLorentzCycle ? 'Lorentz' : 'Std'})
            </text>
            <text x="728" y="274" fill="#C8D0DC" fontSize="12" fontWeight="600">
              High-Grade
            </text>
            <text x="728" y="289" fill="#C8D0DC" fontSize="12" fontWeight="600">
              Boosted Heat ({params.hthpTargetTempC}°C)
            </text>
          </g>

          {/* PTES / Carnot Battery Storage (Node 07) */}
          <g>
            <polygon
              points="835,375 852,363 898,363 898,430 881,442 835,442"
              fill="#2F3747"
              stroke="#6D7A91"
              strokeWidth="1.5"
            />
            <rect x="835" y="375" width="46" height="67" fill="#252C3A" stroke="#6D7A91" strokeWidth="1.5" />
            <line x1="881" y1="375" x2="898" y2="363" stroke="#6D7A91" strokeWidth="1.5" />
            <text x="866" y="460" textAnchor="middle" fill="#C8D0DC" fontSize="12" fontWeight="600">
              PTES / Carnot
            </text>
            <text x="866" y="474" textAnchor="middle" fill="#C8D0DC" fontSize="12" fontWeight="600">
              Battery Storage
            </text>
            <text x="866" y="489" textAnchor="middle" fill="#8A94A6" fontSize="10" className="font-mono">
              +{results.surplusThermalMwhPerYear.toLocaleString()} MWh/yr
            </text>
          </g>

          {/* Rainwater Catchment & Drought Buffer Tank (Node 08 - Clean Right Infrastructure Bay) */}
          <g opacity={showHydro ? 1 : 0.35}>
            <rect
              x="958"
              y="342"
              width="134"
              height="100"
              rx="4"
              fill="#1E2C3A"
              stroke="#5B9BD5"
              strokeWidth="1.5"
            />
            {/* Water level fill */}
            <rect
              x="960"
              y="376"
              width="130"
              height="64"
              fill="#24384B"
            />
            <line x1="960" y1="376" x2="1090" y2="376" stroke="#5B9BD5" strokeWidth="1.2" strokeDasharray="4 2" />
            <text x="1025" y="363" textAnchor="middle" fill="#B8C7D9" fontSize="11" fontWeight="700">
              Rainwater Cistern
            </text>
            <text x="1025" y="398" textAnchor="middle" fill="#88B4DC" fontSize="12" fontWeight="700" className="font-mono">
              {results.requiredDroughtStorageM3.toLocaleString()} m³
            </text>
            <text x="1025" y="415" textAnchor="middle" fill="#9BA9B8" fontSize="10" className="font-mono">
              {params.droughtDurationDays}d Drought Buffer
            </text>
            <text x="1025" y="431" textAnchor="middle" fill="#9BA9B8" fontSize="10" className="font-mono">
              WUE: {results.wueLitresPerKwh} L/kWh
            </text>
          </g>

          {/* ==============================================================
              STRATUM 3: SUBTERRANEAN DATA CENTRE & APPENDIX 1 ISOLATION
             ============================================================== */}
          {/* 1.0m Dense Foam-Filled Perimeter Trench (Appendix 1 [cite: 95]) */}
          <rect
            x="208"
            y="526"
            width="404"
            height="176"
            fill="none"
            stroke="#5AA897"
            strokeWidth="2"
            strokeDasharray="6 4"
          />
          <text x="214" y="519" fill="#8A94A6" fontSize="10" className="font-mono">
            1.0m Perimeter Foam Trench (-85% Vibration) · Base-Isolated Slab · Acoustic Pipe Hangers
          </text>

          {/* Subterranean Data Centre 3D Vault Box (Level -3 / -4 Bedrock) */}
          <g>
            {/* 3D Perspective Outer Vault */}
            <polygon
              points="222,548 256,528 598,528 598,654 564,674 222,674"
              fill="#232936"
              stroke="#6D7A91"
              strokeWidth="1.6"
            />
            <rect
              x="222"
              y="548"
              width="342"
              height="126"
              fill="#1C212B"
              stroke="#6D7A91"
              strokeWidth="1.6"
            />
            <line x1="564" y1="548" x2="598" y2="528" stroke="#6D7A91" strokeWidth="1.4" />

            <text x="402" y="567" textAnchor="middle" fill="#C8D0DC" fontSize="12.5" fontWeight="700">
              Level -3/-4 Vault ({params.coolingTopology === 'two-phase-immersion' ? '2-Phase Immersion' : params.coolingTopology === 'single-phase-immersion' ? '1-Phase Immersion' : 'Direct-to-Chip'})
            </text>

            {/* Server Rack Clusters (Left & Mid) */}
            {[262, 286, 310, 344, 368, 392, 416].map((rx, idx) => (
              <g key={rx}>
                <rect
                  x={rx}
                  y="590"
                  width="22"
                  height="64"
                  fill={idx >= 3 ? '#232936' : '#2C3444'}
                  stroke="#6D7A91"
                  strokeWidth="1.2"
                />
                <polygon
                  points={`${rx},590 ${rx + 6},584 ${rx + 28},584 ${rx + 22},590`}
                  fill="#364052"
                  stroke="#6D7A91"
                  strokeWidth="1.1"
                />
                {/* Server rack LED indicator lines */}
                <line x1={rx + 4} y1="602" x2={rx + 18} y2="602" stroke="#5B9BD5" strokeWidth="1.5" />
                <line x1={rx + 4} y1="614" x2={rx + 18} y2="614" stroke="#5B9BD5" strokeWidth="1.5" />
                <line x1={rx + 4} y1="626" x2={rx + 18} y2="626" stroke="#C98253" strokeWidth="1.5" />
              </g>
            ))}

            {/* Liquid Cooling Cylindrical Tanks on Tuned Mass / Pneumatic Mounts */}
            <g>
              {/* Primary Cylinder */}
              <rect
                x="458"
                y="590"
                width="54"
                height="64"
                rx="4"
                fill="#252C3A"
                stroke="#6D7A91"
                strokeWidth="1.5"
              />
              <ellipse
                cx="485"
                cy="590"
                rx="27"
                ry="7"
                fill="#30394A"
                stroke="#6D7A91"
                strokeWidth="1.5"
              />
              <text x="485" y="618" textAnchor="middle" fill="#C8D0DC" fontSize="11" fontWeight="600">
                Liquid
              </text>
              <text x="485" y="632" textAnchor="middle" fill="#C8D0DC" fontSize="11" fontWeight="600">
                Cooling
              </text>
              <text x="485" y="646" textAnchor="middle" fill="#7CA8D4" fontSize="9.5" className="font-mono">
                {results.totalCoolantFlowLmin} L/m
              </text>

              {/* Secondary Condenser Cylinder */}
              <rect
                x="522"
                y="594"
                width="30"
                height="60"
                rx="3"
                fill="#252C3A"
                stroke="#6D7A91"
                strokeWidth="1.5"
              />
              <ellipse
                cx="537"
                cy="594"
                rx="15"
                ry="5"
                fill="#30394A"
                stroke="#6D7A91"
                strokeWidth="1.5"
              />
            </g>

            {/* Appendix 1 Base Isolation Bearing Pads (Elastomeric / Taylor Fluid Viscous Dampers [cite: 102, 103]) */}
            {[245, 295, 345, 395, 445, 495, 545].map((bx) => (
              <g key={bx}>
                <rect
                  x={bx}
                  y="675"
                  width="22"
                  height="11"
                  rx="2"
                  fill="#243835"
                  stroke="#5AA897"
                  strokeWidth="1.3"
                />
                <line x1={bx + 3} y1="680.5" x2={bx + 19} y2="680.5" stroke="#5AA897" strokeWidth="1" />
              </g>
            ))}
            <text x="415" y="698" fill="#86B8AC" fontSize="10" className="font-mono">
              Floated Vault Slab: Elastomeric Bearings &amp; Taylor Fluid Viscous Dampers
            </text>
          </g>

          {/* Grid / Renewables + QXG Shielded Substation & ORC/TEG Module (Node 03) */}
          <g>
            <polygon
              points="790,545 812,530 895,530 895,620 873,635 790,635"
              fill="#2F3747"
              stroke="#6D7A91"
              strokeWidth="1.6"
            />
            <rect
              x="790"
              y="545"
              width="83"
              height="90"
              fill="#252C3A"
              stroke="#6D7A91"
              strokeWidth="1.6"
            />
            {/* Lightning Bolt Icon */}
            <polygon
              points="835,558 818,588 832,588 826,616 848,582 834,582"
              fill="#569EA8"
              fillOpacity="0.25"
              stroke="#569EA8"
              strokeWidth="1.4"
            />
            <text x="842" y="655" textAnchor="middle" fill="#C8D0DC" fontSize="12.5" fontWeight="600">
              Grid / Renewables
            </text>
            <text x="842" y="671" textAnchor="middle" fill="#8A94A6" fontSize="10.5" className="font-mono">
              QXG Shield + ORC/TEG (+{results.totalRecuperatedElectricalKw} kW_e)
            </text>
          </g>

          {/* ==============================================================
              ANIMATED THERMODYNAMIC & FLUID FLOW PIPELINES
             ============================================================== */}

          {/* 0. HYDROLOGICAL RAINWATER THERMAL SINK LOOP (Muted Sky Blue - Right Bay) */}
          <g opacity={showHydro ? 1 : 0.18}>
            <path
              d="M 862 112 L 1025 112 L 1025 338"
              fill="none"
              stroke="#345678"
              strokeWidth="4"
              opacity="0.45"
            />
            <path
              d="M 862 112 L 1025 112 L 1025 338"
              fill="none"
              stroke="#5B9BD5"
              strokeWidth="2.5"
              strokeDasharray="8 8"
              className={animSlow}
              markerEnd="url(#arrow-sky)"
            />
            <text x="955" y="103" textAnchor="middle" fill="#7CA8D4" fontSize="10.5" className="font-mono">
              100,000 m² Roof &amp; Plaza Catchment ({params.annualRainfallMm} mm/yr)
            </text>
            <path
              d="M 1025 442 L 1025 615 L 602 615"
              fill="none"
              stroke="#5B9BD5"
              strokeWidth="2.5"
              strokeDasharray="8 8"
              className={animMed}
              markerEnd="url(#arrow-sky)"
            />
          </g>

          {/* 1. TIER 1: LOW-GRADE WASTE HEAT & 5GDHC UNINSULATED PIPES (Muted Terracotta-Orange) */}
          <g opacity={showTier1 ? 1 : 0.18}>
            <path
              d="M 485 584 L 485 452"
              fill="none"
              stroke="#7A4E32"
              strokeWidth="5"
              opacity="0.4"
            />
            <path
              d="M 485 584 L 485 452"
              fill="none"
              stroke="#C98253"
              strokeWidth="3"
              strokeDasharray="10 6"
              className={animFast}
              markerEnd="url(#arrow-orange)"
            />
            <path
              d="M 538 588 L 538 485 L 470 485 L 470 452"
              fill="none"
              stroke="#C98253"
              strokeWidth="2.5"
              strokeDasharray="8 6"
              className={animRev}
              markerStart="url(#arrow-orange)"
            />

            {/* 5GDHC Uninsulated Bidirectional Twin Pipes (Left Loop) */}
            <path
              d="M 340 340 L 278 340 L 278 438 L 448 438"
              fill="none"
              stroke="#C98253"
              strokeWidth="2.75"
              strokeDasharray="10 6"
              className={animMed}
              markerEnd="url(#arrow-orange)"
            />
            <path
              d="M 448 418 L 302 418 L 302 360 L 340 360"
              fill="none"
              stroke="#C89B54"
              strokeWidth="2.75"
              strokeDasharray="10 6"
              className={animFast}
              markerEnd="url(#arrow-amber)"
            />
            <text x="180" y="382" fill="#C8D0DC" fontSize="11.5" fontWeight="600">
              5GDHC
            </text>
            <text x="180" y="397" fill="#C8D0DC" fontSize="11.5" fontWeight="600">
              Uninsulated
            </text>
            <text x="180" y="412" fill="#C8D0DC" fontSize="11.5" fontWeight="600">
              Pipes ({params.pipeSeparationCm}cm)
            </text>

            {/* Upper PHE to Residential Underfloor Heating (Building 1A & 1B) */}
            <path
              d="M 340 326 L 258 326 L 258 236"
              fill="none"
              stroke="#C98253"
              strokeWidth="3"
              strokeDasharray="10 6"
              className={animFast}
              markerEnd="url(#arrow-orange)"
            />
            <path
              d="M 358 318 L 358 134 L 385 134"
              fill="none"
              stroke="#C98253"
              strokeWidth="2.75"
              strokeDasharray="10 6"
              className={animMed}
              markerEnd="url(#arrow-orange)"
            />
            <text x="368" y="274" fill="#C8D0DC" fontSize="12" fontWeight="600">
              Underfloor Heating
            </text>

            {/* PHE to HTHP Plant Feed Lines */}
            <path
              d="M 392 340 L 636 340"
              fill="none"
              stroke="#C98253"
              strokeWidth="2.75"
              strokeDasharray="10 6"
              className={animFast}
              markerEnd="url(#arrow-orange)"
            />
            <path
              d="M 392 356 L 636 356"
              fill="none"
              stroke="#C89B54"
              strokeWidth="2.5"
              strokeDasharray="10 6"
              className={animRev}
            />
            <path
              d="M 504 412 L 605 412 L 605 378 L 636 378"
              fill="none"
              stroke="#C98253"
              strokeWidth="2.75"
              strokeDasharray="10 6"
              className={animFast}
              markerEnd="url(#arrow-orange)"
            />
            <path
              d="M 693 434 L 693 454 L 504 454"
              fill="none"
              stroke="#C98253"
              strokeWidth="2.5"
              strokeDasharray="10 6"
              className={animMed}
              markerEnd="url(#arrow-orange)"
            />
          </g>

          {/* 2. TIER 2: HIGH-GRADE HTHP BOOSTED HEAT & DHW / CARNOT STORAGE (Muted Rose-Mauve) */}
          <g opacity={showTier2 ? 1 : 0.18}>
            <path
              d="M 692 330 L 692 136 L 683 136"
              fill="none"
              stroke="#6E3F56"
              strokeWidth="5"
              opacity="0.4"
            />
            <path
              d="M 692 330 L 692 136 L 683 136"
              fill="none"
              stroke="#BA7396"
              strokeWidth="3"
              strokeDasharray="10 6"
              className={animFast}
              markerEnd="url(#arrow-magenta)"
            />
            <path
              d="M 692 136 L 752 136"
              fill="none"
              stroke="#BA7396"
              strokeWidth="3"
              strokeDasharray="10 6"
              className={animFast}
              markerEnd="url(#arrow-magenta)"
            />
            <path
              d="M 712 330 L 712 208 L 752 208"
              fill="none"
              stroke="#BA7396"
              strokeWidth="2.75"
              strokeDasharray="10 6"
              className={animMed}
              markerEnd="url(#arrow-magenta)"
            />
            <path
              d="M 674 330 L 674 208 L 683 208"
              fill="none"
              stroke="#BA7396"
              strokeWidth="2.75"
              strokeDasharray="10 6"
              className={animMed}
              markerEnd="url(#arrow-magenta)"
            />
            <path
              d="M 336 208 L 385 208"
              fill="none"
              stroke="#BA7396"
              strokeWidth="2.5"
              markerEnd="url(#arrow-magenta)"
              markerStart="url(#arrow-magenta)"
            />

            {/* HTHP Plant <-> PTES / Carnot Battery Storage Bidirectional Lines */}
            <path
              d="M 746 346 L 866 346 L 866 362"
              fill="none"
              stroke="#BA7396"
              strokeWidth="3"
              strokeDasharray="8 6"
              className={animFast}
              markerStart="url(#arrow-magenta)"
              markerEnd="url(#arrow-magenta)"
            />
            <path
              d="M 746 410 L 832 410"
              fill="none"
              stroke="#BA7396"
              strokeWidth="3"
              strokeDasharray="8 6"
              className={animFast}
              markerEnd="url(#arrow-magenta)"
            />
          </g>

          {/* 3. ELECTRICAL / RENEWABLES & ORC/TEG FEED (Muted Teal-Cyan) */}
          <g opacity={showElectrical ? 1 : 0.18}>
            <path
              d="M 790 562 L 690 562 L 690 714 L 348 714 L 348 662"
              fill="none"
              stroke="#2D5860"
              strokeWidth="5"
              opacity="0.4"
            />
            <path
              d="M 790 562 L 690 562 L 690 714 L 348 714 L 348 662"
              fill="none"
              stroke="#569EA8"
              strokeWidth="2.75"
              strokeDasharray="12 6"
              className={animFast}
              markerEnd="url(#arrow-cyan)"
            />
            <path
              d="M 790 578 L 706 578 L 706 726 L 485 726 L 485 662"
              fill="none"
              stroke="#569EA8"
              strokeWidth="2.75"
              strokeDasharray="12 6"
              className={animFast}
              markerEnd="url(#arrow-cyan)"
            />
            <path
              d="M 537 726 L 537 662"
              fill="none"
              stroke="#569EA8"
              strokeWidth="2.5"
              markerEnd="url(#arrow-cyan)"
            />
          </g>

          {/* ==============================================================
              INTERACTIVE CLICKABLE NODE CALLOUT HOTSPOTS (01 - 11)
             ============================================================== */}
          {SCHEMATIC_NODES.map((node) => {
            const isSelected = selectedNodeId === node.id;
            const isHovered = hoveredNodeId === node.id;
            const isFilterMatch =
              activeFlowFilter === 'all' ||
              node.flowCategories.includes(activeFlowFilter);

            return (
              <g
                key={node.id}
                transform={`translate(${node.coordinates.x}, ${node.coordinates.y})`}
                onClick={() => onSelectNode(node)}
                onMouseEnter={() => onHoverNode(node.id)}
                onMouseLeave={() => onHoverNode(null)}
                className="cursor-pointer"
                opacity={isFilterMatch ? 1 : 0.4}
              >
                {/* Outer Selection Ring */}
                {(isSelected || isHovered) && (
                  <circle
                    r="22"
                    fill="none"
                    stroke="#88B4DC"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                  />
                )}
                {/* Hotspot Button Body */}
                <circle
                  r="16"
                  fill={isSelected ? node.accentColor : '#2B384B'}
                  stroke="#9BA9B8"
                  strokeWidth="1.75"
                />
                {/* Node Number */}
                <text
                  y="4"
                  textAnchor="middle"
                  fill="#D5DEE8"
                  fontSize="10.5"
                  fontWeight="700"
                  className="font-mono"
                >
                  {node.code.replace('NODE ', '')}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Hover Mini-Inspector HUD */}
        {hoveredNodeId && (() => {
          const hovered = SCHEMATIC_NODES.find((n) => n.id === hoveredNodeId);
          if (!hovered) return null;
          const live = hovered.getLiveMetrics(results, params)[0];
          return (
            <div
              className="pointer-events-none absolute bottom-3 right-3 z-10 max-w-xs bg-[#1C212B]/95 text-[#C8D0DC] px-4 py-3 border border-[#343D4F] shadow-md"
              aria-live="polite"
            >
              <div className="flex items-center justify-between gap-3 text-[11px] font-mono text-[#7CA8D4]">
                <span>{hovered.code} · {hovered.stratumLabel.split(' ')[0].toUpperCase()}</span>
                <span>CLICK FOR POPUP SPECS</span>
              </div>
              <div className="text-sm font-semibold mt-0.5">{hovered.title}</div>
              {live && (
                <div className="mt-1.5 pt-1.5 border-t border-[#2B3240] flex items-center justify-between text-xs font-mono">
                  <span className="text-[#8A94A6]">{live.label}:</span>
                  <span className="text-[#C8D0DC] font-semibold">
                    {live.value} {live.unit}
                  </span>
                </div>
              )}
            </div>
          );
        })()}
      </div>

      {/* Accessible Interactive Node Directory Bar */}
      <div className="p-4 bg-[#202632] border-t border-[#2B3240]">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-mono uppercase tracking-wider text-[#8A94A6]">
            Interactive Schematic Subsystem Nodes — Click any component [01–11] to open Technical Specification Popup
          </span>
          <span className="text-xs font-mono text-[#8A94A6]">
            11 / 11 Architectural Subsystems Active
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {SCHEMATIC_NODES.map((node) => {
            const isSelected = selectedNodeId === node.id;
            const primaryMetric = node.getLiveMetrics(results, params)[0];
            return (
              <button
                key={node.id}
                type="button"
                onClick={() => onSelectNode(node)}
                onMouseEnter={() => onHoverNode(node.id)}
                onMouseLeave={() => onHoverNode(null)}
                className={`text-left p-2.5 border transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#7CA8D4] ${
                  isSelected
                    ? 'bg-[#2C3A4E] text-[#D5DEE8] border-[#5B9BD5]'
                    : 'bg-[#181C24] text-[#C8D0DC] border-[#2B3240] hover:border-[#3E495C] hover:bg-[#1E232D]'
                }`}
              >
                <div className="flex items-center justify-between gap-1 text-[11px] font-mono">
                  <span className={isSelected ? 'text-[#88B4DC] font-semibold' : 'text-[#7CA8D4] font-semibold'}>
                    {node.code}
                  </span>
                  <span className="text-[#8A94A6]">
                    {primaryMetric.value} {primaryMetric.unit.split(' ')[0]}
                  </span>
                </div>
                <div className="text-xs font-semibold truncate mt-1">
                  {node.title}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

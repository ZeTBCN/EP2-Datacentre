import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ShieldAlert, Cpu, BookOpen } from 'lucide-react';
import { SchematicNodeData, SCHEMATIC_NODES } from '../data/schematicNodes';
import { SimulationParams, SimulationResults, COOLING_TOPOLOGIES } from '../utils/thermodynamics';

interface NodeSpecModalProps {
  node: SchematicNodeData | null;
  params: SimulationParams;
  results: SimulationResults;
  onClose: () => void;
  onSelectNode: (node: SchematicNodeData) => void;
}

export const NodeSpecModal: React.FC<NodeSpecModalProps> = ({
  node,
  params,
  results,
  onClose,
  onSelectNode,
}) => {
  useEffect(() => {
    if (!node) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [node, onClose]);

  if (!node) return null;

  const currentIndex = SCHEMATIC_NODES.findIndex((n) => n.id === node.id);
  const prevNode =
    SCHEMATIC_NODES[(currentIndex - 1 + SCHEMATIC_NODES.length) % SCHEMATIC_NODES.length];
  const nextNode = SCHEMATIC_NODES[(currentIndex + 1) % SCHEMATIC_NODES.length];
  const liveMetrics = node.getLiveMetrics(results, params);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F1218]/75 backdrop-blur-xs p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-node-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-4xl bg-[#1E232D] text-[#C8D0DC] border border-[#323A4A] shadow-xl my-8 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 px-6 py-5 bg-[#181C24] text-[#C8D0DC] border-b border-[#2B3240]">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#7CA8D4]">
              <span>{node.code}</span>
              <span aria-hidden="true">·</span>
              <span>{node.stratumLabel}</span>
              <span aria-hidden="true">·</span>
              <span>2045 TECHNICAL SPECIFICATION SHEET</span>
            </div>
            <h2 id="modal-node-title" className="text-xl sm:text-2xl font-bold tracking-tight text-[#D5DEE8] mt-1">
              {node.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#9BA5B4] mt-1">
              {node.subtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close technical specification popup"
            className="p-2 text-[#8A94A6] hover:text-[#C8D0DC] hover:bg-[#252C3A] transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Live Telemetry Readout Strip */}
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-[#8A94A6] mb-2.5">
              Live Simulated Telemetry Point (Bound to Active District Parameters)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {liveMetrics.map((metric) => (
                <div
                  key={metric.label}
                  className="p-3.5 bg-[#181C24] border border-[#2B3240]"
                >
                  <div className="text-xs text-[#8A94A6] font-medium">
                    {metric.label}
                  </div>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="text-xl font-mono font-bold text-[#D5DEE8] tabular-nums">
                      {metric.value}
                    </span>
                    <span className="text-xs font-mono text-[#8A94A6]">
                      {metric.unit}
                    </span>
                  </div>
                  <div
                    className={`mt-1.5 text-[11px] font-mono font-semibold ${
                      metric.status === 'optimal'
                        ? 'text-[#6DB39F]'
                        : metric.status === 'elevated'
                        ? 'text-[#C89B54]'
                        : 'text-[#7CA8D4]'
                    }`}
                  >
                    {metric.statusText}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Engineering Overview & Architectural Role */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-[#2B3240]">
            <div>
              <h3 className="text-sm font-semibold text-[#D5DEE8] flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#7CA8D4]" />
                Subsystem Mechanism &amp; Summary
              </h3>
              <p className="mt-2 text-sm text-[#9BA5B4] leading-relaxed">
                {node.summary}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#D5DEE8]">
                2045 Urban District Integration Role
              </h3>
              <p className="mt-2 text-sm text-[#9BA5B4] leading-relaxed">
                {node.architecturalRole}
              </p>
            </div>
          </div>

          {/* Governing Thermodynamic / Hydrological Equation */}
          <div className="p-4 bg-[#181C24] text-[#C8D0DC] border border-[#2B3240]">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#7CA8D4]">
              Governing Thermodynamic &amp; Structural Relationship
            </div>
            <div className="mt-1.5 font-mono text-sm sm:text-base font-semibold text-[#D5DEE8] overflow-x-auto">
              {node.thermodynamicEquation.formula}
            </div>
            <div className="mt-1 text-xs text-[#8A94A6]">
              {node.thermodynamicEquation.caption}
            </div>
          </div>

          {/* Technical Specifications Table */}
          <div>
            <h3 className="text-sm font-semibold text-[#D5DEE8] mb-2.5">
              Empirical Parameters &amp; 2045 Design Specifications
            </h3>
            <div className="overflow-x-auto border border-[#2B3240]">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-[#181C24] border-b border-[#2B3240] font-mono text-xs text-[#8A94A6]">
                    <th className="py-2.5 px-3.5 font-semibold">Parameter</th>
                    <th className="py-2.5 px-3.5 font-semibold">Design Value</th>
                    <th className="py-2.5 px-3.5 font-semibold">Unit</th>
                    <th className="py-2.5 px-3.5 font-semibold">Engineering Benchmark &amp; Context</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2B3240]">
                  {node.staticSpecs.map((row) => (
                    <tr key={row.parameter} className="hover:bg-[#222834]">
                      <td className="py-2.5 px-3.5 font-medium text-[#C8D0DC]">
                        {row.parameter}
                      </td>
                      <td className="py-2.5 px-3.5 font-mono font-semibold text-[#7CA8D4] tabular-nums whitespace-nowrap">
                        {row.value}
                      </td>
                      <td className="py-2.5 px-3.5 font-mono text-[#8A94A6] whitespace-nowrap">
                        {row.unit || '—'}
                      </td>
                      <td className="py-2.5 px-3.5 text-[#9BA5B4]">
                        {row.benchmarkNote}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Embedded Table A if inspecting Liquid Cooling or Subterranean Vault */}
          {(node.id === 'liquid-cooling-plant' || node.id === 'subterranean-vault') && (
            <div>
              <h3 className="text-sm font-semibold text-[#D5DEE8] mb-2">
                Table A: High-Density Data Centre Cooling Technology Comparison
              </h3>
              <div className="overflow-x-auto border border-[#2B3240]">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#181C24] border-b border-[#2B3240] font-mono text-[#8A94A6]">
                      <th className="py-2 px-3">Cooling Topology</th>
                      <th className="py-2 px-3">Flow Rate (L/min/kW)</th>
                      <th className="py-2 px-3">Outlet Temp (°C)</th>
                      <th className="py-2 px-3">Pumping PUE</th>
                      <th className="py-2 px-3">Heat Capture</th>
                      <th className="py-2 px-3">Max CHF (W/cm²)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2B3240] font-mono">
                    {Object.values(COOLING_TOPOLOGIES).map((top) => {
                      const isCurrent = params.coolingTopology === top.id;
                      return (
                        <tr
                          key={top.id}
                          className={
                            isCurrent
                              ? 'bg-[#263244] font-semibold text-[#D5DEE8]'
                              : 'text-[#9BA5B4]'
                          }
                        >
                          <td className="py-2 px-3 font-sans">
                            {top.name} {isCurrent ? ' (Active)' : ''}
                          </td>
                          <td className="py-2 px-3 tabular-nums">
                            {top.flowRatePerKwMin.toFixed(2)} – {top.flowRatePerKwMax.toFixed(2)}
                          </td>
                          <td className="py-2 px-3 tabular-nums">
                            {top.outletTempMin} – {top.outletTempMax}°C
                          </td>
                          <td className="py-2 px-3 tabular-nums">
                            {top.pueMin.toFixed(2)} – {top.pueMax.toFixed(2)}
                          </td>
                          <td className="py-2 px-3 tabular-nums">
                            {Math.round(top.heatCaptureFraction * 100)}%
                          </td>
                          <td className="py-2 px-3 tabular-nums">
                            {top.criticalHeatFluxWcm2} W/cm²
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Hazard Mitigation & Life-Safety Protocol */}
          <div className="p-4 bg-[#252320] border border-[#4A4132]">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h3 className="text-sm font-semibold text-[#D6BA8A] flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#C89B54]" />
                Risk &amp; Structural / Biological Hazard Mitigation: {node.hazardMitigation.riskTitle}
              </h3>
              <span className="text-xs font-mono font-semibold text-[#C89B54]">
                {node.hazardMitigation.thresholdMetric}
              </span>
            </div>
            <p className="mt-1.5 text-xs sm:text-sm text-[#B2ABA0] leading-relaxed">
              {node.hazardMitigation.mitigationDetail}
            </p>
          </div>

          {/* Engineering Standards & Technical References */}
          <div className="pt-2 border-t border-[#2B3240]">
            <div className="text-xs font-mono text-[#8A94A6] flex items-center gap-1.5 mb-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              Engineering Standards &amp; Technical Specification References
            </div>
            <ul className="space-y-1 text-xs text-[#8A94A6] font-mono">
              {node.researchCitations.map((cite) => (
                <li key={cite}>· {cite}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Modal Footer with Prev / Next Subsystem Navigation */}
        <div className="flex items-center justify-between gap-4 px-6 py-3.5 bg-[#181C24] border-t border-[#2B3240]">
          <button
            type="button"
            onClick={() => onSelectNode(prevNode)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#C8D0DC] bg-[#222834] border border-[#323A4A] hover:bg-[#2A3140] transition-colors cursor-pointer whitespace-nowrap"
          >
            <ChevronLeft className="w-4 h-4" />
            Prev: {prevNode.code} ({prevNode.title.split(' ')[0]})
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-[#D5DEE8] bg-[#2F435A] border border-[#456180] hover:bg-[#38506B] transition-colors cursor-pointer whitespace-nowrap"
          >
            Close Specification Window
          </button>

          <button
            type="button"
            onClick={() => onSelectNode(nextNode)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#C8D0DC] bg-[#222834] border border-[#323A4A] hover:bg-[#2A3140] transition-colors cursor-pointer whitespace-nowrap"
          >
            Next: {nextNode.code} ({nextNode.title.split(' ')[0]})
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

import { SimulationResults, SimulationParams } from '../utils/thermodynamics';

export type StratumLayer = 'residential' | 'infrastructure' | 'subterranean';
export type FlowCategory = 'all' | 'tier1-passive' | 'tier2-boosted' | 'electrical-orc' | 'hydrological';

export interface SpecRow {
  parameter: string;
  value: string;
  unit?: string;
  benchmarkNote: string;
}

export interface SchematicNodeData {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  stratum: StratumLayer;
  stratumLabel: string;
  flowCategories: FlowCategory[];
  accentColor: string;
  coordinates: { x: number; y: number }; // SVG viewBox 1120 x 740 coordinates
  summary: string;
  architecturalRole: string;
  thermodynamicEquation: {
    formula: string;
    caption: string;
  };
  staticSpecs: SpecRow[];
  getLiveMetrics: (results: SimulationResults, params: SimulationParams) => {
    label: string;
    value: string;
    unit: string;
    status: 'nominal' | 'elevated' | 'optimal';
    statusText: string;
  }[];
  hazardMitigation: {
    riskTitle: string;
    mitigationDetail: string;
    thresholdMetric: string;
  };
  researchCitations: string[];
}

export const SCHEMATIC_NODES: SchematicNodeData[] = [
  {
    id: 'subterranean-vault',
    code: 'NODE 01',
    title: 'Subterranean AI/HPC Compute Vault (Level -3 / -4)',
    subtitle: '200–250 kW/Rack 3D-Stacked Silicon Clusters Anchored in Bedrock Beneath Plaza Zones',
    stratum: 'subterranean',
    stratumLabel: 'Subterranean Tier (Level -3 / -4 Bedrock)',
    flowCategories: ['all', 'tier1-passive', 'electrical-orc'],
    accentColor: '#5B9BD5',
    coordinates: { x: 245, y: 552 },
    summary:
      'High-density 1–10 MW modular subterranean compute vault positioned in the lowest sub-basement (Level -3 or -4) anchored into bedrock beneath pedestrian plazas or commercial parking zones—never beneath residential load-bearing pillars.',
    architecturalRole:
      'Acts as the primary basal thermal generator of the urban district. Spatial segregation beneath plazas/parking provides distinct acoustic zones while condensing 1–10 MW into 10–40 liquid-cooled racks.',
    thermodynamicEquation: {
      formula: 'q″_CHF = 492 W/cm²  |  Q̇_annual = P_IT × η_capture × 8,760 h',
      caption: 'Critical Heat Flux on porous lotus copper surfaces & annual basal thermal output',
    },
    staticSpecs: [
      {
        parameter: 'Exact Subterranean Placement',
        value: 'Level -3 to -4',
        unit: 'Bedrock Sub-Basement',
        benchmarkNote: 'Located beneath pedestrian plazas or commercial parking; offset from residential pillars',
      },
      {
        parameter: '2045 Rack Power Density',
        value: '200 – 250',
        unit: 'kW/rack',
        benchmarkNote: 'Up from 11 kW enterprise avg (2026) and 120 kW NVIDIA GB200 NVL72 (2024)',
      },
      {
        parameter: 'Chip Critical Heat Flux (CHF)',
        value: '202 – 492',
        unit: 'W/cm²',
        benchmarkNote: 'Air cooling physical ceiling is ~50 W/cm²; porous lotus copper reaches 492 W/cm²',
      },
      {
        parameter: 'Foundation Embodied Carbon',
        value: '0.162 – 0.243',
        unit: 'kgCO₂e/kg',
        benchmarkNote: 'Low-clinker subterranean structural concrete specification',
      },
      {
        parameter: 'Acoustic Fire Nozzle Ceiling',
        value: '< 110.0',
        unit: 'dB SPL',
        benchmarkNote: 'Unbaffled 300-bar IG-541 nozzles hit 130–145 dB, misaligning HDD heads (<12 nm tolerance)',
      },
    ],
    getLiveMetrics: (res, params) => [
      {
        label: 'Active Compute Load',
        value: params.computeCapacityMw.toFixed(1),
        unit: 'MW',
        status: 'nominal',
        statusText: '● NOMINAL',
      },
      {
        label: 'Condensed Rack Footprint',
        value: String(res.activeRackCount),
        unit: `racks @ ${params.rackDensityKw} kW`,
        status: 'optimal',
        statusText: '◆ LEVEL -3/-4',
      },
      {
        label: 'Annual Basal Heat Output',
        value: res.annualThermalOutputMwh.toLocaleString(),
        unit: 'MWh/yr',
        status: 'nominal',
        statusText: '● ACTIVE',
      },
      {
        label: 'Fire Nozzle Acoustic Level',
        value: String(res.silencedNozzleAcousticDb),
        unit: 'dB (Safe <110 dB)',
        status: 'optimal',
        statusText: '● PROTECTED',
      },
    ],
    hazardMitigation: {
      riskTitle: 'Vertical Pillar Acoustic Transmission & Inert-Gas Acoustic Shock',
      mitigationDetail:
        'Never positioned under central structural load-bearing pillars of residential towers. Sited under pedestrian plazas/commercial parking with baffled fire nozzles (<110 dB) and QXG EMI-shielded transformers.',
      thresholdMetric: 'Level -3/-4 Bedrock | SPL < 110 dB | Offset Pillars',
    },
    researchCitations: [
      'Subterranean Siting Standard: Level -3/-4 bedrock beneath pedestrian plazas & parking zones',
      'Compute Density Projection: 200–250 kW/rack 3D-stacked silicon, 492 W/cm² CHF on lotus copper',
      'Subterranean Fire & Acoustic Standard: Baffled nozzles (<110 dB) protecting <12 nm HDD head tolerance',
    ],
  },
  {
    id: 'liquid-cooling-plant',
    code: 'NODE 02',
    title: 'Two-Phase Immersion & Liquid Cooling Loop',
    subtitle: 'Latent Heat Fluorocarbon Vaporisation & Dielectric Bath Circulation',
    stratum: 'subterranean',
    stratumLabel: 'Subterranean Tier (Level -3 / -4)',
    flowCategories: ['all', 'tier1-passive', 'hydrological'],
    accentColor: '#C98253',
    coordinates: { x: 552, y: 582 },
    summary:
      'Captures up to 100% of server thermal dissipation through latent heat of vaporisation in low-boiling-point dielectric fluids, eliminating the single-phase microchannel "flow rate wall".',
    architecturalRole:
      'Steps down coolant circulation requirements from 1.5–2.0 L/min/kW (DLC) to 0.30–0.53 L/min/kW (Two-Phase Immersion) while delivering high-grade 50–60°C thermal vapor directly to the primary heat exchangers via acoustic-hanger-suspended piping.',
    thermodynamicEquation: {
      formula: 'Q̇ = ṁ · h_fg (Two-Phase Latent)   vs.   Q̇ = ṁ · c_p · ΔT (Single-Phase Sensible)',
      caption: 'Phase-change latent boiling eliminates parasitic pump load (PUE 1.02–1.04)',
    },
    staticSpecs: [
      {
        parameter: 'Two-Phase Flow Rate',
        value: '0.30 – 0.53',
        unit: 'L/min per kW',
        benchmarkNote: 'Gravity/vapor driven; avoids the 220 L/min/rack single-phase flow wall at 3.5–5.0 kW TDP',
      },
      {
        parameter: 'Single-Phase Immersion Flow',
        value: '1.00 – 1.50',
        unit: 'L/min per kW',
        benchmarkNote: 'Pumped synthetic esters with 40–50°C outlet temperature and 1.03–1.10 PUE',
      },
      {
        parameter: 'Direct-to-Chip (DLC) Flow',
        value: '1.50 – 2.00',
        unit: 'L/min per kW',
        benchmarkNote: '25–45°C outlet temp, 1.15–1.30 PUE, captures only 70–80% of rack heat',
      },
      {
        parameter: 'Pump & Piping Isolation',
        value: 'Tuned Mass + Acoustic Hangers',
        unit: 'isolation',
        benchmarkNote: 'Pumps mounted on spring/pneumatic isolators; piping suspended on acoustic hangers',
      },
    ],
    getLiveMetrics: (res, params) => [
      {
        label: 'Total Loop Flow Rate',
        value: res.totalCoolantFlowLmin.toLocaleString(),
        unit: 'L/min',
        status: params.coolingTopology === 'two-phase-immersion' ? 'optimal' : 'nominal',
        statusText: params.coolingTopology === 'two-phase-immersion' ? '◆ LOW PARASITIC' : '● PUMPED',
      },
      {
        label: 'Per-Rack Coolant Velocity',
        value: String(res.flowPerRackLmin),
        unit: 'L/min/rack',
        status: res.flowPerRackLmin > 220 ? 'elevated' : 'nominal',
        statusText: res.flowPerRackLmin > 220 ? '▲ FLOW WALL RISK' : '● NOMINAL',
      },
      {
        label: 'Coolant Outlet Temp',
        value: String(res.coolantOutletTempC),
        unit: '°C',
        status: res.coolantOutletTempC >= 50 ? 'optimal' : 'nominal',
        statusText: res.coolantOutletTempC >= 50 ? '◆ HIGH-GRADE' : '● MODERATE',
      },
      {
        label: 'Pumping PUE',
        value: res.pue.toFixed(2),
        unit: 'ratio',
        status: res.pue <= 1.05 ? 'optimal' : 'nominal',
        statusText: res.pue <= 1.05 ? '◆ ULTRA-LOW' : '● STANDARD',
      },
    ],
    hazardMitigation: {
      riskTitle: 'Microchannel Flow Rate Wall & Pump Structure-Borne Vibration',
      mitigationDetail:
        'Two-phase immersion reduces fluid flow volume by ~75%, while all circulation pumps use pneumatic air mounts and piping is suspended from acoustic hangers to prevent skeletal frame resonance.',
      thresholdMetric: '0.30–0.53 L/min/kW | PUE 1.02–1.04 | Acoustic Pipe Hangers',
    },
    researchCitations: [
      'Table A: High-Density Data Centre Cooling Technology Comparison Matrix',
      'Mechanical Isolation Specification: Active Pump Mounts & Suspended Acoustic Pipe Hangers',
    ],
  },
  {
    id: 'grid-orc-teg',
    code: 'NODE 03',
    title: 'Grid / Renewables Feed & ORC / Skutterudite TEG Recovery',
    subtitle: 'Bidirectional Electrical Substation, Organic Rankine & Solid-State Thermoelectrics',
    stratum: 'subterranean',
    stratumLabel: 'Subterranean Tier (-16m)',
    flowCategories: ['all', 'electrical-orc'],
    accentColor: '#569EA8',
    coordinates: { x: 855, y: 585 },
    summary:
      'Supplies primary renewable power through EMI-shielded QXG transformers while recuperating electrical power from low-grade thermal streams via Organic Rankine Cycles (ORC), skutterudite Thermoelectric Generators (TEGs), and Carnot recovery.',
    architecturalRole:
      'Closes the electro-thermal loop and offsets residential district electricity consumption. Backup generators and ORC turbines are isolated on tuned mass dampers and spring isolators to eliminate mechanical vibration transfer.',
    thermodynamicEquation: {
      formula: 'η_ORC = 10% – 18%   |   ZT_skutterudite = (S² · σ · T) / κ ≈ 2.0 – 3.0',
      caption: 'Dimensionless thermoelectric figure of merit (ZT) and Organic Rankine conversion efficiency',
    },
    staticSpecs: [
      {
        parameter: 'Organic Rankine Cycle (ORC) η',
        value: '10.0 – 18.0',
        unit: '%',
        benchmarkNote: 'Operates on low-grade ΔT between server condenser and rainwater cold sink',
      },
      {
        parameter: 'Skutterudite TEG Figure of Merit',
        value: '2.0 – 3.0',
        unit: 'ZT',
        benchmarkNote: '2045 phonon-glass electron-crystal metamaterial projection for solid-state generation',
      },
      {
        parameter: 'Transformer Harmonic Shielding',
        value: 'QXG Shielded',
        unit: 'Class',
        benchmarkNote: 'Prevents subterranean EMI and dirty electricity propagation into upper residences',
      },
      {
        parameter: 'Project Capital Payback',
        value: '1.5 – 12.0',
        unit: 'years',
        benchmarkNote: '<2 yrs subsidized (Tallaght municipal benchmark) to 8–12 yrs unsubsidized commercial market',
      },
    ],
    getLiveMetrics: (res) => [
      {
        label: 'Total Recuperated Power',
        value: res.annualRecuperatedElectricMwh.toLocaleString(),
        unit: `MWh/yr (${res.totalRecuperatedElectricalKw} kW_e)`,
        status: 'optimal',
        statusText: '◆ ACTIVE RECUPERATION',
      },
      {
        label: 'Residential Power Coverage',
        value: `${res.residentialPowerCoveragePercent}%`,
        unit: `of ${res.annualResidentialElectricDemandMwh.toLocaleString()} MWh/yr`,
        status: 'optimal',
        statusText: '◆ DISTRICT OFFSET',
      },
      {
        label: 'ORC Conversion Efficiency',
        value: res.orcEfficiencyPercent.toFixed(1),
        unit: '%',
        status: res.orcEfficiencyPercent >= 15 ? 'optimal' : 'nominal',
        statusText: '● ACTIVE',
      },
      {
        label: 'Skutterudite TEG Rating',
        value: res.tegZtFigureOfMerit.toFixed(2),
        unit: 'ZT',
        status: 'optimal',
        statusText: '◆ METAMATERIAL',
      },
    ],
    hazardMitigation: {
      riskTitle: 'Electromagnetic Interference (EMI) & Backup Generator Vibration',
      mitigationDetail:
        'QXG shielded transformers suppress harmonic distortion ("dirty electricity"), while backup generators and ORC expanders sit on pneumatic air mounts and spring isolators.',
      thresholdMetric: 'ZT 2.0–3.0 | η_ORC 10–18% | QXG Harmonic Isolation',
    },
    researchCitations: [
      'Electro-Thermal Recuperation Specification: ORC (10–18% η) & Skutterudite TEGs (ZT 2.0–3.0)',
      'Substation & Financial Benchmark: QXG EMI Shielding & Tallaght Municipal Payback Model',
    ],
  },
  {
    id: 'primary-phe-cluster',
    code: 'NODE 04',
    title: 'Primary & Secondary Plate Heat Exchangers (PHE)',
    subtitle: 'Modular Brazed/Gasketed Hydronic Decoupling Assemblies',
    stratum: 'infrastructure',
    stratumLabel: 'Ground / Infrastructure Tier (-3m to -10m)',
    flowCategories: ['all', 'tier1-passive', 'tier2-boosted'],
    accentColor: '#C98253',
    coordinates: { x: 438, y: 418 },
    summary:
      'Decouples the subterranean dielectric/coolant loop from the municipal 5GDHC water/brine network and residential hydronic loops using compact corrugated metal plate stacks.',
    architecturalRole:
      'Provides massive surface area for conductive heat transfer without fluid mixing. Scales modularly: as the urban district expands, engineers bolt additional corrugated plates into the existing frame.',
    thermodynamicEquation: {
      formula: 'Q̇_PHE = U · A_plates · ΔT_LMTD   |   ε = Q̇_actual / Q̇_max',
      caption: 'Log-Mean Temperature Difference (LMTD) conduction across modular gasketed plate packs',
    },
    staticSpecs: [
      {
        parameter: 'Primary Inlet Temperature',
        value: '50.0 – 60.0',
        unit: '°C',
        benchmarkNote: 'Direct thermal vapor/liquid feed from subterranean immersion condensers',
      },
      {
        parameter: 'Secondary Supply to Tier 1',
        value: '48.0 – 58.0',
        unit: '°C',
        benchmarkNote: 'Directly satisfies NZEB underfloor hydronic heating without compressor work',
      },
      {
        parameter: 'Hydraulic Isolation',
        value: '100',
        unit: '% Hermetic',
        benchmarkNote: 'Double-wall gasketed plates prevent dielectric fluid cross-contamination with potable/district loops',
      },
      {
        parameter: 'Acoustic Riser Suspension',
        value: 'Acoustic Hangers',
        unit: 'full decoupling',
        benchmarkNote: 'Prevents fluid pulsation noise from vibrating up the building skeletal frame',
      },
    ],
    getLiveMetrics: (res) => [
      {
        label: 'Primary Side Inlet',
        value: res.coolantOutletTempC.toFixed(1),
        unit: '°C',
        status: 'nominal',
        statusText: '● INLET',
      },
      {
        label: 'Secondary 5GDHC Supply',
        value: res.pheSupplyTempC.toFixed(1),
        unit: '°C',
        status: res.pheSupplyTempC >= 50 ? 'optimal' : 'nominal',
        statusText: '◆ LOW APPROACH ΔT',
      },
      {
        label: 'Thermal Power Transferred',
        value: res.capturedThermalMw.toFixed(2),
        unit: 'MW_th',
        status: 'optimal',
        statusText: '● FULL LOAD',
      },
      {
        label: 'Daily Energy Dispatched',
        value: res.dailyDistrictDemandMwh.toFixed(1),
        unit: 'MWh/day',
        status: 'nominal',
        statusText: '● BALANCED',
      },
    ],
    hazardMitigation: {
      riskTitle: 'Dielectric Fluid Cross-Contamination & Structural Riser Noise',
      mitigationDetail:
        'Double-gasketed vented plates ensure zero migration of coolants into the municipal water network, while acoustic pipe hangers isolate riser vibrations from residential slabs.',
      thresholdMetric: 'ΔT_approach ≤ 2.5°C | Zero Fluid Mixing',
    },
    researchCitations: [
      'Hydronic Heat Transfer Standard: Modular Brazed & Gasketed Plate Heat Exchangers (PHEs)',
      'Riser Structural Decoupling: Acoustic Hanger Suspension Standard',
    ],
  },
  {
    id: '5gdhc-network',
    code: 'NODE 05',
    title: '5GDHC Uninsulated Twin-Pipe Network',
    subtitle: 'Bidirectional Near-Ambient Thermal Grid with Ground Heat Gain',
    stratum: 'infrastructure',
    stratumLabel: 'Ground / Infrastructure Tier (-1.5m to -4m)',
    flowCategories: ['all', 'tier1-passive', 'tier2-boosted'],
    accentColor: '#C89B54',
    coordinates: { x: 278, y: 390 },
    summary:
      '5th Generation District Heating and Cooling (5GDHC) network operating with 25–40 mm uninsulated twin pipes that exchange warm and cold flows bidirectionally across the district.',
    architecturalRole:
      'Restricts distribution thermal losses to an ultra-low 7.0 W/m (compared to 30% summer losses in 3G/4G networks) and actively absorbs ambient ground heat when return fluid drops below soil temperature.',
    thermodynamicEquation: {
      formula: 'q_loss ≤ 7.0 W/m   |   d_separation ≥ 80 cm (ΔLoss_interference ≤ 20%)',
      caption: 'Minimum 80 cm twin-pipe separation prevents radiating thermal plume overlap in soil matrix',
    },
    staticSpecs: [
      {
        parameter: 'Uninsulated Twin-Pipe Diameter',
        value: '25 – 40',
        unit: 'mm',
        benchmarkNote: 'High-density polyethylene (HDPE) uninsulated bidirectional loops',
      },
      {
        parameter: 'Linear Thermal Loss Rate',
        value: '7.0',
        unit: 'W/m',
        benchmarkNote: 'Drastically outperforms classical 70–110°C networks (which lose up to 30% in summer)',
      },
      {
        parameter: 'Mandatory Pipe Separation',
        value: '≥ 80.0',
        unit: 'cm',
        benchmarkNote: 'Closer spacing overlaps warm supply and cool return plumes, losing up to 20% ground gain',
      },
      {
        parameter: 'Carrier Medium Temperature',
        value: '15–25 (ambient) / 50–60 (DC)',
        unit: '°C',
        benchmarkNote: 'Bidirectional water/brine loop supports simultaneous heating and cooling loads',
      },
    ],
    getLiveMetrics: (res, params) => [
      {
        label: 'Twin-Pipe Separation',
        value: String(params.pipeSeparationCm),
        unit: 'cm',
        status: params.pipeSeparationCm >= 80 ? 'optimal' : 'elevated',
        statusText: params.pipeSeparationCm >= 80 ? '◆ NO PLUME OVERLAP' : '▲ PLUME INTERFERENCE',
      },
      {
        label: 'Interference Gain Penalty',
        value: String(res.pipeThermalInterferencePenaltyPercent),
        unit: '% loss',
        status: res.pipeThermalInterferencePenaltyPercent === 0 ? 'optimal' : 'elevated',
        statusText: res.pipeThermalInterferencePenaltyPercent === 0 ? '● OPTIMAL ΔT' : '▲ SUB-80CM SPACING',
      },
      {
        label: 'Effective Pipe Line Loss',
        value: res.effectiveLineLossWm.toFixed(2),
        unit: 'W/m',
        status: res.effectiveLineLossWm <= 7.2 ? 'optimal' : 'elevated',
        statusText: '● 5GDHC SPEC',
      },
      {
        label: 'District Demand Coverage',
        value: String(res.districtDemandCoveragePercent),
        unit: '% of 40.1 GWh',
        status: res.districtDemandCoveragePercent >= 100 ? 'optimal' : 'nominal',
        statusText: res.districtDemandCoveragePercent >= 100 ? '◆ 100% SATISFIED' : '● PARTIAL',
      },
    ],
    hazardMitigation: {
      riskTitle: 'Soil Thermal Plume Overlap & Subsurface Microbial Shift',
      mitigationDetail:
        'Enforcing ≥80 cm horizontal separation between supply and return pipes prevents short-circuit thermal interference. Continuous soil temperature monitoring prevents long-term groundwater warming.',
      thresholdMetric: 'Spacing ≥ 80 cm | Line Loss 7.0 W/m',
    },
    researchCitations: [
      '5GDHC Network Standard: Uninsulated 25–40 mm Twin Pipes (7.0 W/m Loss, ≥80 cm Separation)',
      'Subsurface Ecology Protocol: Soil Thermal Plume & Groundwater Protection',
    ],
  },
  {
    id: 'hthp-plant',
    code: 'NODE 06',
    title: 'High-Temperature Heat Pump (HTHP) Plant',
    subtitle: 'Tier 2 Natural-Refrigerant Lorentz-Cycle Thermal Booster (85–130°C)',
    stratum: 'infrastructure',
    stratumLabel: 'Ground / Infrastructure Tier (-4m)',
    flowCategories: ['all', 'tier2-boosted'],
    accentColor: '#BA7396',
    coordinates: { x: 695, y: 385 },
    summary:
      'Upgrades 50–60°C Tier 1 waste heat to 85–130°C high-grade thermal energy using PFAS-free natural refrigerants and non-isothermal Lorentz cycles.',
    architecturalRole:
      'Guarantees strict Legionella pasteurisation (>60°C at tap) for Domestic Hot Water across 8,000 households (28,100 MWh/yr). Every HTHP compressor is isolated on tuned mass dampers, spring isolators, or pneumatic air mounts.',
    thermodynamicEquation: {
      formula: 'COP_real = η_Carnot(0.40–0.60) × [T_sink / (T_sink - T_source)] × (1 + Δη_Lorentz)',
      caption: 'Lorentz cycle gliding temperature match boosts efficiency by 25–30% over standard Rankine cycle',
    },
    staticSpecs: [
      {
        parameter: 'Tier 2 Delivery Temperature',
        value: '85.0 – 130.0',
        unit: '°C',
        benchmarkNote: 'Satisfies strict Legionella compliance and light industrial/commercial loads',
      },
      {
        parameter: 'Carnot Efficiency Ratio',
        value: '40.0 – 60.0',
        unit: '% of ideal Carnot',
        benchmarkNote: 'Industrial multi-stage compressors operating on low-GWP natural refrigerants',
      },
      {
        parameter: 'Lorentz Cycle Efficiency Gain',
        value: '+25.0 – +30.0',
        unit: '% boost',
        benchmarkNote: 'Non-isothermal zeotropic temperature glide matches sensible sink heating curve',
      },
      {
        parameter: 'Compressor Vibration Mounts',
        value: 'Tuned Mass / Pneumatic',
        unit: 'active mounts',
        benchmarkNote: 'Eliminates compressor mechanical vibration transmission into residential towers',
      },
    ],
    getLiveMetrics: (res, params) => [
      {
        label: 'Boosted Outlet Temp',
        value: String(params.hthpTargetTempC),
        unit: '°C',
        status: 'optimal',
        statusText: '◆ LEGIONELLA SAFE',
      },
      {
        label: 'Achieved Plant COP',
        value: res.hthpRealCop.toFixed(2),
        unit: `COP (Carnot ${res.hthpCarnotCop})`,
        status: res.hthpRealCop >= 4.0 ? 'optimal' : 'nominal',
        statusText: params.useLorentzCycle ? '◆ LORENTZ +27.5%' : '● STANDARD CYCLE',
      },
      {
        label: 'Compressor Electrical Load',
        value: res.hthpCompressorPowerMw.toFixed(2),
        unit: 'MW_e',
        status: 'nominal',
        statusText: '● ACTIVE BOOST',
      },
      {
        label: 'Annual DHW Load Served',
        value: res.annualDhwDemandMwh.toLocaleString(),
        unit: 'MWh/yr',
        status: 'optimal',
        statusText: '● 100% PASTEURISED',
      },
    ],
    hazardMitigation: {
      riskTitle: 'Legionella Pneumophila Proliferation & Compressor Vibration',
      mitigationDetail:
        'Tier 2 HTHPs ensure ≥85°C primary distribution and ≥60°C domestic draw-off using zero-PFAS natural refrigerants, while spring/pneumatic compressor mounts and acoustic pipe hangers isolate mechanical hum.',
      thresholdMetric: 'T_boost 85–130°C | η_Carnot 40–60% | Lorentz +25–30%',
    },
    researchCitations: [
      'Tier 2 HTHP Specification: Natural Refrigerants (40–60% Carnot, +25–30% Lorentz Cycle Boost)',
      'Public Health & Acoustic Standard: Legionella Pasteurisation & Active Compressor Isolation',
    ],
  },
  {
    id: 'ptes-carnot-storage',
    code: 'NODE 07',
    title: 'PTES / Carnot Battery Thermal Storage',
    subtitle: 'Pit Thermal Energy Storage & High-Grade Electro-Thermal Buffer',
    stratum: 'infrastructure',
    stratumLabel: 'Ground / Infrastructure Tier (-6m)',
    flowCategories: ['all', 'tier2-boosted', 'electrical-orc'],
    accentColor: '#8D76B8',
    coordinates: { x: 842, y: 368 },
    summary:
      'Buffers high-grade 85–130°C thermal energy from the HTHP plant in insulated subterranean Pit Thermal Energy Storage (PTES) and Carnot battery cells to decouple server load peaks from winter morning heating spikes.',
    architecturalRole:
      'Absorbs excess thermal output during off-peak night hours or summer days, discharging back into the Tier 2 manifold during peak residential draw or feeding the ORC/TEG loop for electrical power recuperation.',
    thermodynamicEquation: {
      formula: 'E_storage = V_pit · ρ · c_p · ΔT_charge   |   η_roundtrip = Q_discharge / Q_charge',
      caption: 'Sensible/phase-change thermal storage capacity across 85–130°C HTHP charge cycle',
    },
    staticSpecs: [
      {
        parameter: 'Charge Temperature Window',
        value: '85.0 – 130.0',
        unit: '°C',
        benchmarkNote: 'Directly charged by the Tier 2 HTHP high-grade manifold',
      },
      {
        parameter: 'Annual District Surplus Buffered',
        value: 'Up to 47,500',
        unit: 'MWh/yr @ 10 MW',
        benchmarkNote: '10 MW DC produces 87,600 MWh/yr vs. 40,100 MWh/yr baseline demand for 20,000 residents',
      },
      {
        parameter: 'Dispatch Mode',
        value: 'Bidirectional',
        unit: 'Thermal / Carnot',
        benchmarkNote: 'Supports diurnal DHW peak shaving and seasonal inter-month buffering',
      },
    ],
    getLiveMetrics: (res) => [
      {
        label: 'Annual Surplus Thermal',
        value: res.surplusThermalMwhPerYear.toLocaleString(),
        unit: 'MWh/yr',
        status: res.surplusThermalMwhPerYear > 0 ? 'optimal' : 'elevated',
        statusText: res.surplusThermalMwhPerYear > 0 ? '◆ CHARGING SURPLUS' : '▲ DEFICIT DRAW',
      },
      {
        label: 'Daily District Buffer',
        value: res.dailyDistrictDemandMwh.toFixed(1),
        unit: 'MWh/day',
        status: 'nominal',
        statusText: '● READY',
      },
      {
        label: 'CO₂ Displaced Annually',
        value: res.annualCo2DisplacedTonnes.toLocaleString(),
        unit: 'tCO₂e/yr',
        status: 'optimal',
        statusText: '◆ DECARBONISED',
      },
    ],
    hazardMitigation: {
      riskTitle: 'Diurnal Peak Mismatch & Groundwater Thermal Leakage',
      mitigationDetail:
        'Multi-layer composite liners with vacuum-insulated perimeter barriers prevent high-temperature PTES pits from radiating heat into surrounding urban aquifers.',
      thresholdMetric: '87,600 MWh/yr @ 10 MW vs 40,100 MWh/yr District Load',
    },
    researchCitations: [
      'District Energy Balance: 10 MW Basal Compute Output (87,600 MWh/yr) vs. 40,100 MWh/yr Demand',
      'Thermal Storage Architecture: PTES / Carnot Battery Bidirectional Manifold',
    ],
  },
  {
    id: 'rainwater-hydrological-sink',
    code: 'NODE 08',
    title: 'Rainwater Catchment & Drought Buffer Vault',
    subtitle: '100,000 m² Urban Catchment & Closed-Loop Secondary Thermal Sink',
    stratum: 'infrastructure',
    stratumLabel: 'Ground / Infrastructure Tier (-5m)',
    flowCategories: ['all', 'hydrological'],
    accentColor: '#5B9BD5',
    coordinates: { x: 960, y: 342 },
    summary:
      'Harvests 1,000 mm of annual temperate oceanic rainfall across a 100,000 m² urban roof/permeable plaza catchment (yielding 100,000 m³/year) to serve as a zero-evaporative secondary thermal sink.',
    architecturalRole:
      'Replaces thirsty evaporative cooling towers with a closed-loop hydrological buffer, pushing Water Usage Effectiveness (WUE) to near-zero while sizing subterranean storage between 8,220 m³ and 12,330 m³ to bridge 30-to-45-day seasonal droughts.',
    thermodynamicEquation: {
      formula: 'V_harvest = 1,000 mm × 100,000 m² = 100,000 m³/yr   |   V_drought(30–45d) = 8,220 – 12,330 m³',
      caption: 'Hydrological mass balance for temperate oceanic climate (Ireland / Northern Europe)',
    },
    staticSpecs: [
      {
        parameter: 'Urban Catchment Area',
        value: '100,000',
        unit: 'm² (10 ha)',
        benchmarkNote: 'Integrated district roofs, pedestrian plazas, and bioswale retention surfaces',
      },
      {
        parameter: 'Annual Rainwater Yield',
        value: '100,000',
        unit: 'm³/year',
        benchmarkNote: 'Based on 1,000 mm annual precipitation in Ireland / Northern Europe',
      },
      {
        parameter: '30-Day Drought Tank Volume',
        value: '8,220',
        unit: 'm³',
        benchmarkNote: 'Minimum subterranean cistern volume to bridge a 30-day dry spell at 274 m³/day',
      },
      {
        parameter: '45-Day Drought Tank Volume',
        value: '12,330',
        unit: 'm³',
        benchmarkNote: 'Extended climate-resilience cistern capacity for a 45-day seasonal drought',
      },
    ],
    getLiveMetrics: (res, params) => [
      {
        label: 'Annual Rainwater Harvest',
        value: res.annualRainwaterHarvestM3.toLocaleString(),
        unit: 'm³/yr',
        status: 'optimal',
        statusText: '◆ 100% CLOSED-LOOP',
      },
      {
        label: `Drought Buffer (${params.droughtDurationDays}d)`,
        value: res.requiredDroughtStorageM3.toLocaleString(),
        unit: 'm³ tank',
        status: params.droughtDurationDays <= 45 ? 'optimal' : 'elevated',
        statusText: params.droughtDurationDays <= 45 ? '● WITHIN 12,330 m³' : '▲ EXTENDED CIS-CAP',
      },
      {
        label: 'Daily Sink Circulation',
        value: res.dailyThermalSinkMakeUpM3.toFixed(1),
        unit: 'm³/day',
        status: 'nominal',
        statusText: '● BALANCED',
      },
      {
        label: 'Water Usage Effectiveness',
        value: res.wueLitresPerKwh.toFixed(2),
        unit: 'L/kWh (WUE)',
        status: 'optimal',
        statusText: '◆ NEAR-ZERO WUE',
      },
    ],
    hazardMitigation: {
      riskTitle: 'Seasonal Summer Droughts & Evaporative Water Depletion',
      mitigationDetail:
        'Eliminates open evaporative cooling towers completely. Subterranean concrete cisterns sized explicitly to 8,220–12,330 m³ guarantee uninterrupted heat rejection during 30–45 day summer dry spells.',
      thresholdMetric: '100,000 m³/yr yield | 8,220–12,330 m³ drought tank',
    },
    researchCitations: [
      'Hydrological Mass Balance Specification: 1,000 mm × 100,000 m² = 100,000 m³/yr; 8,220–12,330 m³ Cistern',
      'Zero-Evaporative Cooling Mandate: Near-Zero WUE Closed-Loop Secondary Sink',
    ],
  },
  {
    id: 'residential-tier1-ufh',
    code: 'NODE 09',
    title: 'NZEB Residential Underfloor Heating (Tier 1 Passive)',
    subtitle: 'Direct 50–60°C Hydronic Space Heating for 20,000 Residents',
    stratum: 'residential',
    stratumLabel: 'Surface Residential Tier (+0m to +45m)',
    flowCategories: ['all', 'tier1-passive'],
    accentColor: '#C98253',
    coordinates: { x: 230, y: 185 },
    summary:
      'Delivers unboosted 50–60°C thermal energy from the 5GDHC network via Plate Heat Exchangers directly into low-temperature radiant underfloor heating slabs across 8,000 NZEB / Passive House dwellings.',
    architecturalRole:
      'Satisfies 100% of the district’s 12,000 MWh/year space heating baseline without requiring heat pump compressor work, while load-bearing residential pillars are structurally segregated from the subterranean vault.',
    thermodynamicEquation: {
      formula: 'Q_space = 8,000 dwellings × 100 m² × 15 kWh/m²/yr = 12,000 MWh/yr',
      caption: 'Irish/Northern European NZEB space heating calculation (11–23 kWh/m²/yr range)',
    },
    staticSpecs: [
      {
        parameter: 'NZEB Primary Energy Mandate',
        value: '41.0 – 45.0',
        unit: 'kWh/m²/yr',
        benchmarkNote: 'Ireland & Northern European Nearly Zero Energy Building statutory baseline',
      },
      {
        parameter: 'Space Heating Load Range',
        value: '11.0 – 23.0 (15.0 avg)',
        unit: 'kWh/m²/yr',
        benchmarkNote: 'Enabled by envelope U-values ≤ 0.18 W/m²K and mechanical ventilation heat recovery',
      },
      {
        parameter: 'District Space Heating Total',
        value: '12,000',
        unit: 'MWh/year',
        benchmarkNote: 'Calculated for 20,000 residents (8,000 households at 2.5 persons/dwelling, 100 m² avg)',
      },
    ],
    getLiveMetrics: (res) => [
      {
        label: 'Connected Households',
        value: res.householdsCount.toLocaleString(),
        unit: 'dwellings',
        status: 'nominal',
        statusText: '● NZEB SPEC',
      },
      {
        label: 'Annual Space Heat Demand',
        value: res.annualSpaceHeatingDemandMwh.toLocaleString(),
        unit: 'MWh/yr',
        status: 'optimal',
        statusText: '◆ PASSIVE TIER 1',
      },
      {
        label: 'Hydronic Manifold Temp',
        value: res.pheSupplyTempC.toFixed(1),
        unit: '°C',
        status: 'optimal',
        statusText: '● DIRECT PHE',
      },
    ],
    hazardMitigation: {
      riskTitle: 'Overheating in Passive Envelopes & Structural Pillar Acoustic Transfer',
      mitigationDetail:
        'Smart mixing valves modulate radiant slab temperatures to 28–35°C, and residential tower load-bearing pillars are offset from the subterranean vault footprint.',
      thresholdMetric: 'U-value ≤ 0.18 W/m²K | 12,000 MWh/yr @ 20k residents',
    },
    researchCitations: [
      'NZEB Residential Baseline (20,000 Residents): 12,000 MWh/yr Space Heating (U ≤ 0.18 W/m²K)',
      'Structural Acoustic Segregation: Tower Load-Bearing Pillar Offset Standard',
    ],
  },
  {
    id: 'residential-tier2-dhw',
    code: 'NODE 10',
    title: 'Residential Domestic Hot Water (Tier 2 HTHP Boosted)',
    subtitle: 'High-Grade Pasteurised Hot Water Distribution (28,100 MWh/yr)',
    stratum: 'residential',
    stratumLabel: 'Surface Residential Tier (+0m to +45m)',
    flowCategories: ['all', 'tier2-boosted'],
    accentColor: '#BA7396',
    coordinates: { x: 587, y: 114 },
    summary:
      'Supplies Legionella-compliant Domestic Hot Water (DHW) across all residential apartments and townhomes via the high-grade loop fed by the Tier 2 HTHP plant.',
    architecturalRole:
      'Represents 70% of the total thermal energy demand in an NZEB district (28,100 MWh/yr out of 40,100 MWh/yr), because human hot water hygiene behaviour remains inelastic even when building envelopes approach zero heat loss.',
    thermodynamicEquation: {
      formula: 'Q_DHW = 8,000 households × 9.63 kWh/day = 77.04 MWh/day (28,120 MWh/yr)',
      caption: '40–60 L/person/day heated to ≥60°C at draw-off to guarantee Legionella eradication',
    },
    staticSpecs: [
      {
        parameter: 'Per-Capita Daily Draw',
        value: '40.0 – 60.0',
        unit: 'L / person / day',
        benchmarkNote: 'Heated to ≥60°C for public health Legionella compliance',
      },
      {
        parameter: 'Household Daily DHW Energy',
        value: '9.63',
        unit: 'kWh / household / day',
        benchmarkNote: 'Based on 2.5 residents per household in Irish municipal projections',
      },
      {
        parameter: 'District Daily DHW Load',
        value: '77.04',
        unit: 'MWh / day',
        benchmarkNote: 'Equals ~28,100 MWh/year across 8,000 households (20,000 residents)',
      },
      {
        parameter: 'Total Combined District Demand',
        value: '40,100',
        unit: 'MWh / year (~110 MWh/day)',
        benchmarkNote: '28,100 MWh DHW + 12,000 MWh Space Heating; <50% of a 10 MW data centre output',
      },
    ],
    getLiveMetrics: (res, params) => [
      {
        label: 'Annual DHW Energy',
        value: res.annualDhwDemandMwh.toLocaleString(),
        unit: 'MWh/yr',
        status: 'nominal',
        statusText: '● 70% OF TOTAL LOAD',
      },
      {
        label: 'Combined District Load',
        value: res.totalDistrictAnnualDemandMwh.toLocaleString(),
        unit: 'MWh/yr',
        status: 'optimal',
        statusText: `◆ ${res.districtDemandCoveragePercent}% COVERED`,
      },
      {
        label: 'Tap Pasteurisation Temp',
        value: `≥ 60°C (Loop ${params.hthpTargetTempC}°C)`,
        unit: 'verified',
        status: 'optimal',
        statusText: '◆ LEGIONELLA COMPLIANT',
      },
    ],
    hazardMitigation: {
      riskTitle: 'Legionella Biofilm in Domestic Risers & Scalding Protection',
      mitigationDetail:
        'High-grade 85–130°C loop charges building-level instantaneous fresh-water stations above 60°C while thermostatic mixing valves (TMVs) at fixtures cap point-of-use delivery at 48°C to prevent scalding.',
      thresholdMetric: '9.63 kWh/dwelling/day | 77.04 MWh/day | 28,100 MWh/yr',
    },
    researchCitations: [
      'NZEB Domestic Hot Water Baseline: 77.04 MWh/day (28,100 MWh/yr across 8,000 Dwellings)',
      'Municipal Hygiene Directive: ≥60°C Draw-Off & 85–130°C Tier 2 Pasteurisation Loop',
    ],
  },
  {
    id: 'bidirectional-vibration-isolation',
    code: 'NODE 11',
    title: 'Bidirectional Vibration Isolation & Plaza Placement',
    subtitle: 'Elastomeric / Taylor Fluid Viscous Base Isolation, 1.0m Foam Trenches & Acoustic Hangers',
    stratum: 'subterranean',
    stratumLabel: 'Subterranean Tier (Level -3 / -4 Bedrock Interface)',
    flowCategories: ['all', 'tier1-passive', 'electrical-orc'],
    accentColor: '#5AA897',
    coordinates: { x: 382, y: 692 },
    summary:
      'Exhaustive bidirectional structural isolation system that protects sensitive server hardware (HDD <12 nm head tolerance) from external urban vibrations (subways, heavy traffic) while shielding overlying residents from internal mechanical vibrations (pumps, chillers, backup generators).',
    architecturalRole:
      'Positions the 1–10 MW vault in Level -3 or -4 anchored into bedrock beneath pedestrian plazas or commercial parking zones—never under central structural load-bearing pillars of residential towers. Combines a "floated" base-isolated floor slab, 1.0m perimeter foam trenches, active equipment mounts, and acoustic pipe hangers.',
    thermodynamicEquation: {
      formula: 'T_transmissibility = √[ (1 + (2·ζ·r)²) / ((1 - r²)² + (2·ζ·r)²) ]   |   ΔA_trench = -85% / 1.0m',
      caption: 'Bidirectional base-isolation transmissibility & 1.0m foam trench horizontal wave attenuation',
    },
    staticSpecs: [
      {
        parameter: 'Sub-Basement Depth & Siting',
        value: 'Level -3 / -4 Bedrock',
        unit: 'Plaza / Parking Zone',
        benchmarkNote: 'Never placed under residential load-bearing pillars; spatially segregated acoustic zones',
      },
      {
        parameter: 'Base Isolation Slab System',
        value: 'Elastomeric / Taylor Dampers',
        unit: 'Floated Slab',
        benchmarkNote: 'Floats entire vault slab to absorb seismic, subway, and heavy traffic micro-vibrations',
      },
      {
        parameter: 'Perimeter Foam-Filled Trench',
        value: '1.0 m depth (-85% ΔA)',
        unit: 'amplitude cut',
        benchmarkNote: 'Dense vibration-absorbing foam trench around vault walls cuts horizontal soil waves by 85%',
      },
      {
        parameter: 'Active Mechanical Mounts',
        value: 'Tuned Mass / Spring / Pneumatic',
        unit: 'isolators',
        benchmarkNote: 'Installed on every pump, compressor, chiller, and HVAC unit inside the vault',
      },
      {
        parameter: 'Skeletal Frame Pipe Isolation',
        value: 'Suspended Acoustic Hangers',
        unit: 'decoupled',
        benchmarkNote: 'Prevents structure-borne noise from vibrating up the building frame into apartments',
      },
    ],
    getLiveMetrics: (res) => [
      {
        label: 'Horizontal Trench Attenuation',
        value: `-${res.trenchVibrationReductionPercent}`,
        unit: '% / 1.0m foam',
        status: 'optimal',
        statusText: '◆ SOIL WAVE BLOCKED',
      },
      {
        label: 'Base Slab Isolation',
        value: 'Floated',
        unit: 'Taylor / Elastomeric',
        status: 'optimal',
        statusText: '◆ SEISMIC / SUBWAY SAFE',
      },
      {
        label: 'Placement Segregation',
        value: 'Level -3/-4',
        unit: 'Under Plaza/Parking',
        status: 'optimal',
        statusText: '● OFF RESIDENTIAL PILLARS',
      },
      {
        label: 'Piping & Pump Isolation',
        value: '100%',
        unit: 'TMD + Acoustic Hangers',
        status: 'optimal',
        statusText: '● FRAME DECOUPLED',
      },
    ],
    hazardMitigation: {
      riskTitle: 'Bidirectional Vibration: Subway/Traffic Micro-Seismics & Mechanical Hum',
      mitigationDetail:
        'External subway/traffic vibrations degrade server read/write heads, while internal pumps/chillers/generators transmit 31.5–125 Hz hum into residences. Solved via Level -3/-4 bedrock siting under plazas, Taylor fluid viscous base dampers, 1.0m foam trenches (-85%), and acoustic pipe hangers.',
      thresholdMetric: 'Level -3/-4 Plaza | -85% Foam Trench | Taylor Fluid Dampers',
    },
    researchCitations: [
      'Subterranean Placement Mandate: Level -3/-4 Bedrock Beneath Pedestrian Plazas & Parking Zones',
      'Base Isolation Architecture: Elastomeric Bearings & Taylor Fluid Viscous Dampers Floated Slab',
      'Perimeter & Conduit Attenuation: 1.0m Foam Trenches (-85% ΔA), TMD Mounts & Acoustic Hangers',
    ],
  },
];


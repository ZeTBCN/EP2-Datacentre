export type CoolingTopologyId = 'two-phase-immersion' | 'single-phase-immersion' | 'direct-to-chip';

export interface CoolingTopologySpec {
  id: CoolingTopologyId;
  name: string;
  shortName: string;
  mechanism: string;
  flowRatePerKwMin: number; // L/min per kW
  flowRatePerKwMax: number;
  flowRatePerKwNominal: number;
  outletTempMin: number; // °C
  outletTempMax: number;
  outletTempNominal: number;
  pueMin: number;
  pueMax: number;
  pueNominal: number;
  heatCaptureFraction: number; // 0 to 1
  criticalHeatFluxWcm2: number; // W/cm²
  fluidType: string;
}

export const COOLING_TOPOLOGIES: Record<CoolingTopologyId, CoolingTopologySpec> = {
  'two-phase-immersion': {
    id: 'two-phase-immersion',
    name: 'Two-Phase Immersion Cooling',
    shortName: '2-Phase Immersion',
    mechanism: 'Motherboards submerged in low-boiling-point fluorocarbons; latent heat of vaporisation boils fluid at 50–60°C saturation point on porous lotus copper surfaces.',
    flowRatePerKwMin: 0.30,
    flowRatePerKwMax: 0.53,
    flowRatePerKwNominal: 0.41,
    outletTempMin: 50,
    outletTempMax: 60,
    outletTempNominal: 56,
    pueMin: 1.02,
    pueMax: 1.04,
    pueNominal: 1.03,
    heatCaptureFraction: 0.99,
    criticalHeatFluxWcm2: 492,
    fluidType: 'Low-boiling dielectric fluorocarbon (vapor-driven)',
  },
  'single-phase-immersion': {
    id: 'single-phase-immersion',
    name: 'Single-Phase Immersion Cooling',
    shortName: '1-Phase Immersion',
    mechanism: 'Motherboards submerged in pumped synthetic ester dielectric bath; sensible heat transfer via forced circulation.',
    flowRatePerKwMin: 1.00,
    flowRatePerKwMax: 1.50,
    flowRatePerKwNominal: 1.25,
    outletTempMin: 40,
    outletTempMax: 50,
    outletTempNominal: 46,
    pueMin: 1.03,
    pueMax: 1.10,
    pueNominal: 1.06,
    heatCaptureFraction: 0.96,
    criticalHeatFluxWcm2: 260,
    fluidType: 'Synthetic ester dielectric hydrocarbon',
  },
  'direct-to-chip': {
    id: 'direct-to-chip',
    name: 'Direct-to-Chip (DLC) Cold Plates',
    shortName: 'Direct-to-Chip (DLC)',
    mechanism: 'Water-glycol circulated through dense microchannel cold plates mounted directly to 3D-stacked CPU/GPU packages; supplementary air handling required for VRM/memory.',
    flowRatePerKwMin: 1.50,
    flowRatePerKwMax: 2.00,
    flowRatePerKwNominal: 1.75,
    outletTempMin: 25,
    outletTempMax: 45,
    outletTempNominal: 38,
    pueMin: 1.15,
    pueMax: 1.30,
    pueNominal: 1.22,
    heatCaptureFraction: 0.75,
    criticalHeatFluxWcm2: 202,
    fluidType: 'Deionized water / inhibited propylene glycol',
  },
};

export interface SimulationParams {
  computeCapacityMw: number;        // 1 to 20 MW (default 10 MW)
  rackDensityKw: number;            // 120 to 250 kW/rack (default 225 kW/rack)
  coolingTopology: CoolingTopologyId;
  residentsCount: number;           // 5,000 to 35,000 residents (default 20,000)
  pipeSeparationCm: number;         // 30 to 120 cm (default 85 cm; >= 80 cm avoids thermal interference)
  hthpTargetTempC: number;          // 85 to 130 °C (default 95 °C)
  useLorentzCycle: boolean;         // Lorentz cycle boosts efficiency by 25-30%
  droughtDurationDays: number;      // 15 to 60 days (default 35 days; 30-45 day benchmark)
  annualRainfallMm: number;         // 600 to 1400 mm (default 1000 mm)
}

export interface SimulationResults {
  // Area 1: Compute & Cooling
  activeRackCount: number;
  totalCoolantFlowLmin: number;
  flowPerRackLmin: number;
  coolantOutletTempC: number;
  pue: number;
  totalFacilityPowerMw: number;
  capturedThermalMw: number;
  annualThermalOutputMwh: number;
  criticalHeatFluxWcm2: number;

  // Area 2: District Heating & 5GDHC + HTHP
  householdsCount: number;
  annualDhwDemandMwh: number;
  annualSpaceHeatingDemandMwh: number;
  totalDistrictAnnualDemandMwh: number;
  dailyDistrictDemandMwh: number;
  districtDemandCoveragePercent: number;
  surplusThermalMwhPerYear: number;
  pipeThermalInterferencePenaltyPercent: number;
  effectiveLineLossWm: number;
  pheSupplyTempC: number;
  hthpCarnotCop: number;
  hthpRealCop: number;
  hthpCompressorPowerMw: number;

  // Area 3: Waste Heat to Electricity (ORC, Skutterudite TEG & Carnot Recuperation)
  orcEfficiencyPercent: number;
  tegZtFigureOfMerit: number;
  recoveredElectricalKw: number;
  totalRecuperatedElectricalKw: number;
  annualRecuperatedElectricMwh: number;
  annualResidentialElectricDemandMwh: number;
  residentialPowerCoveragePercent: number;

  // Area 4: Hydrological Mass Balance
  annualRainwaterHarvestM3: number;
  dailyThermalSinkMakeUpM3: number;
  requiredDroughtStorageM3: number;
  wueLitresPerKwh: number;

  // Area 5 & 6: Carbon, Financial Expenditure/Savings, Acoustics & Safety
  annualCo2DisplacedTonnes: number;
  annualCoolingCo2SavedTonnes: number;
  annualOrcAndWaterCo2SavedTonnes: number;
  totalAnnualCo2SavedTonnes: number;
  embodiedCarbonLowTonnes: number;       // 0.162 kgCO2e/kg concrete
  embodiedCarbonHighTonnes: number;      // 0.243 kgCO2e/kg concrete
  grossCapexMillionEur: number;
  annualOpexMillionEur: number;
  annualHeatingSavingsMillionEur: number;
  annualCoolingPueSavingsMillionEur: number;
  annualCarbonAndWaterSavingsMillionEur: number;
  annualGrossSavingsMillionEur: number;
  annualNetSavingsMillionEur: number;
  paybackYearsSubsidized: number;        // Tallaght benchmark (<2 yrs)
  paybackYearsPpp: number;               // Blended municipal PPP
  paybackYearsCommercial: number;        // Standard market (8-12 yrs)
  trenchVibrationReductionPercent: number;
  silencedNozzleAcousticDb: number;
  unmitigatedAcousticDb: number;
}

export type FundingRegimeId = 'subsidized-tallaght' | 'municipal-ppp' | 'commercial-market';
export type ConcreteSpecId = 'low-carbon-0162' | 'standard-0243';

export interface YearlyEconomicsAndCarbonPoint {
  year: number;
  // Cumulative Net Cash Flow (€M) for each regime
  cumCashFlowSubsidizedMeur: number;
  cumCashFlowPppMeur: number;
  cumCashFlowCommercialMeur: number;
  // Annual Expenditure & Savings in that year (€M)
  annualExpenditureMeur: number;
  annualGrossSavedMeur: number;
  annualNetSavedMeur: number;
  // Cumulative Net CO2 Saved (tonnes CO2e) after subtracting Year 0 foundation embodied carbon
  cumNetCo2SavedTonnes: number;
  cumHeatingCo2SavedTonnes: number;
  cumCoolingPueCo2SavedTonnes: number;
  cumOrcWaterCo2SavedTonnes: number;
}

export interface EconomicsAndCarbonSummary {
  capexBreakdown: {
    label: string;
    code: string;
    amountMeur: number;
    sharePercent: number;
    color: string;
    detail: string;
  }[];
  annualCashBreakdown: {
    label: string;
    type: 'expenditure' | 'saving';
    amountMeur: number;
    color: string;
    detail: string;
  }[];
  netCapexByRegimeMeur: Record<FundingRegimeId, number>;
  paybackByRegimeYears: Record<FundingRegimeId, number>;
  twentyYearNetGainByRegimeMeur: Record<FundingRegimeId, number>;
  embodiedCarbonTonnes: number;
  carbonPaybackMonths: number;
  twentyYearNetCo2SavedTonnes: number;
  series: YearlyEconomicsAndCarbonPoint[];
}

export const DEFAULT_SIMULATION_PARAMS: SimulationParams = {
  computeCapacityMw: 10,
  rackDensityKw: 225,
  coolingTopology: 'two-phase-immersion',
  residentsCount: 20000,
  pipeSeparationCm: 85,
  hthpTargetTempC: 95,
  useLorentzCycle: true,
  droughtDurationDays: 35,
  annualRainfallMm: 1000,
};

/**
 * Pure deterministic calculation of the 2045 Subterranean Data Centre & 5GDHC Urban District model
 * grounded in the empirical constants of the Deep Research Brief.
 */
export function calculateDistrictThermodynamics(params: SimulationParams): SimulationResults {
  const topology = COOLING_TOPOLOGIES[params.coolingTopology];
  const computeKw = params.computeCapacityMw * 1000;

  // Area 1: Racks & Coolant Flow
  const activeRackCount = Math.ceil(computeKw / params.rackDensityKw);
  const totalCoolantFlowLmin = Math.round(computeKw * topology.flowRatePerKwNominal);
  const flowPerRackLmin = Number((params.rackDensityKw * topology.flowRatePerKwNominal).toFixed(1));
  const coolantOutletTempC = topology.outletTempNominal;
  const pue = topology.pueNominal;
  const totalFacilityPowerMw = Number((params.computeCapacityMw * pue).toFixed(2));

  // Thermal capture
  const capturedThermalMw = Number((params.computeCapacityMw * topology.heatCaptureFraction).toFixed(2));
  const annualThermalOutputMwh = Math.round(capturedThermalMw * 8760);

  // Area 2: District Heating Baseline (2.5 persons/household, 9.63 kWh/day DHW, 100m² * 15 kWh/m²/yr space heating)
  const householdsCount = Math.round(params.residentsCount / 2.5);
  const dailyDhwMwh = (householdsCount * 9.63) / 1000;
  const annualDhwDemandMwh = Math.round(dailyDhwMwh * 365);
  const annualSpaceHeatingDemandMwh = Math.round((householdsCount * 100 * 15) / 1000);
  const totalDistrictAnnualDemandMwh = annualDhwDemandMwh + annualSpaceHeatingDemandMwh;
  const dailyDistrictDemandMwh = Number((totalDistrictAnnualDemandMwh / 365).toFixed(1));

  // 5GDHC Pipe separation thermal interference (< 80 cm causes up to 20% ground gain loss)
  const pipeThermalInterferencePenaltyPercent =
    params.pipeSeparationCm >= 80
      ? 0
      : Math.min(20, Math.round(((80 - params.pipeSeparationCm) / 50) * 20));

  const effectiveLineLossWm = Number(
    (7.0 * (1 + pipeThermalInterferencePenaltyPercent / 100)).toFixed(2)
  );

  // PHE supply temperature to Tier 1 Underfloor Heating
  const pheSupplyTempC = Number((coolantOutletTempC - 2.5 - (pipeThermalInterferencePenaltyPercent * 0.08)).toFixed(1));

  // District coverage
  const usableAnnualThermalMwh = annualThermalOutputMwh * (1 - pipeThermalInterferencePenaltyPercent / 200);
  const districtDemandCoveragePercent = Math.min(
    250,
    Math.round((usableAnnualThermalMwh / Math.max(1, totalDistrictAnnualDemandMwh)) * 100)
  );
  const surplusThermalMwhPerYear = Math.max(0, Math.round(usableAnnualThermalMwh - totalDistrictAnnualDemandMwh));

  // Tier 2 HTHP Thermodynamics (Carnot COP = T_sink_K / (T_sink_K - T_source_K))
  const tSourceK = pheSupplyTempC + 273.15;
  const tSinkK = params.hthpTargetTempC + 273.15;
  const deltaTK = Math.max(10, tSinkK - tSourceK);
  const hthpCarnotCop = Number((tSinkK / deltaTK).toFixed(2));
  // Natural refrigerant Carnot efficiency ~50%, Lorentz cycle adds +27.5% boost
  const baseCarnotEfficiency = 0.50;
  const lorentzMultiplier = params.useLorentzCycle ? 1.275 : 1.0;
  const hthpRealCop = Number((hthpCarnotCop * baseCarnotEfficiency * lorentzMultiplier).toFixed(2));

  // HTHP handles DHW fraction (~70% of district thermal load)
  const dhwPeakThermalMw = (dailyDhwMwh / 24) * 1.35;
  const hthpCompressorPowerMw = Number((dhwPeakThermalMw / Math.max(1.5, hthpRealCop)).toFixed(2));

  // Area 3: Waste Heat to Electricity (ORC 10-18% efficiency scaled by outlet temp; Skutterudite TEG ZT 2.0-3.0)
  const tempFactor = Math.max(0, (coolantOutletTempC - 25) / 35); // 0 to 1 across 25-60°C
  const orcEfficiencyPercent = Number((10 + tempFactor * 8).toFixed(1));
  const tegZtFigureOfMerit = Number((2.0 + tempFactor * 0.85).toFixed(2));
  // Assume 15% of surplus heat is routed through ORC/TEG peaking recovery
  const surplusMw = Math.max(0.5, capturedThermalMw - (dailyDistrictDemandMwh / 24));
  const recoveredElectricalKw = Math.round(surplusMw * 0.15 * (orcEfficiencyPercent / 100) * 1000);

  // Total Recuperated Electrical Power (ORC + Skutterudite TEG + PTES Carnot regeneration & PUE auxiliary recovery)
  const carnotAndAuxRecuperatedKw = Math.round(
    (surplusMw * 0.28 * (orcEfficiencyPercent / 100) +
      params.computeCapacityMw * Math.max(0, 1.25 - pue) * 0.18) *
      1000
  );
  const totalRecuperatedElectricalKw = recoveredElectricalKw + carnotAndAuxRecuperatedKw;
  const annualRecuperatedElectricMwh = Math.round((totalRecuperatedElectricalKw * 8760) / 1000);
  // NZEB non-heating residential electrical demand (~2,200 kWh_e/household/yr for lighting, appliances, MVHR)
  const annualResidentialElectricDemandMwh = Math.round(householdsCount * 2.2);
  const residentialPowerCoveragePercent = Number(
    Math.min(
      100,
      (annualRecuperatedElectricMwh / Math.max(1, annualResidentialElectricDemandMwh)) * 100
    ).toFixed(1)
  );

  // Area 4: Hydrological Mass Balance (100,000 m² catchment -> 100,000 m³/yr at 1,000 mm rainfall)
  // Drought buffer tank: 274 m³/day baseline at 10 MW -> 8,220 m³ (30 days) to 12,330 m³ (45 days)
  const catchmentAreaM2 = 100000;
  const annualRainwaterHarvestM3 = Math.round((params.annualRainfallMm / 1000) * catchmentAreaM2);
  const dailyThermalSinkMakeUpM3 = Number((274 * (params.computeCapacityMw / 10)).toFixed(1));
  const requiredDroughtStorageM3 = Math.round(dailyThermalSinkMakeUpM3 * params.droughtDurationDays);
  const wueLitresPerKwh = params.coolingTopology === 'two-phase-immersion' ? 0.02 : params.coolingTopology === 'single-phase-immersion' ? 0.04 : 0.11;

  // Area 5 & 6: Carbon, Financial Expenditure/Savings & Acoustic Safety
  // 1) CO2 Saved from displaced natural gas / fossil district heating (~0.202 tCO2e/MWh + exported PTES credit)
  const satisfiedDemandMwh = Math.min(usableAnnualThermalMwh, totalDistrictAnnualDemandMwh);
  const ptesExportUsedMwh = Math.min(surplusThermalMwhPerYear * 0.45, 22000);
  const annualCo2DisplacedTonnes = Math.round((satisfiedDemandMwh + ptesExportUsedMwh * 0.6) * 0.202);

  // 2) CO2 Saved from Cooling PUE reduction vs legacy air/chiller facility (PUE 1.45 baseline)
  const avoidedCoolingMwhPerYear = Math.max(0, (1.45 - pue) * params.computeCapacityMw * 8760);
  const annualCoolingCo2SavedTonnes = Math.round(avoidedCoolingMwhPerYear * 0.065);

  // 3) CO2 Saved from ORC/TEG power generation + closed-loop rainwater harvesting vs municipal water treatment
  const orcAnnualMwh = (recoveredElectricalKw * 8760) / 1000;
  const annualOrcAndWaterCo2SavedTonnes = Math.round(orcAnnualMwh * 0.18 + (annualRainwaterHarvestM3 * 0.0028));
  const totalAnnualCo2SavedTonnes =
    annualCo2DisplacedTonnes + annualCoolingCo2SavedTonnes + annualOrcAndWaterCo2SavedTonnes;

  // Subterranean Foundation Concrete Embodied Carbon (0.162 to 0.243 kgCO2e/kg concrete)
  // Baseline 10 MW Level -3/-4 vault + cistern uses ~9,500 tonnes (9,500,000 kg) of structural concrete
  const concreteMassKg = (4500 + params.computeCapacityMw * 500) * 1000;
  const embodiedCarbonLowTonnes = Math.round((concreteMassKg * 0.162) / 1000);
  const embodiedCarbonHighTonnes = Math.round((concreteMassKg * 0.243) / 1000);

  // Financial CAPEX & Annual Expenditure vs. Money Saved (€M)
  // Calibrated so Commercial Market payback is ~9.5 yrs (within 8-12 yr benchmark range)
  // and Subsidized Municipal Pilot (Tallaght benchmark) is ~1.5 yrs (<2 yr benchmark range)
  const grossCapexMillionEur = Number(
    (
      44.0 +
      params.computeCapacityMw * 2.65 +
      (params.residentsCount / 20000) * 8.5 +
      (requiredDroughtStorageM3 / 10000) * 2.2
    ).toFixed(2)
  );

  // Annual OPEX (HTHP compressor electricity + subterranean vault & 5GDHC maintenance)
  const annualHthpElectricMwh = hthpCompressorPowerMw * 8760 * 0.55;
  const annualOpexMillionEur = Number(
    (annualHthpElectricMwh * 0.000095 + 0.85 + params.computeCapacityMw * 0.055).toFixed(2)
  );

  // Annual Gross Savings streams (€M/yr)
  const annualHeatingSavingsMillionEur = Number(
    ((satisfiedDemandMwh * 108 + ptesExportUsedMwh * 58) / 1_000_000).toFixed(2)
  );
  const annualCoolingPueSavingsMillionEur = Number(
    (((avoidedCoolingMwhPerYear + orcAnnualMwh) * 82) / 1_000_000).toFixed(2)
  );
  const annualCarbonAndWaterSavingsMillionEur = Number(
    ((totalAnnualCo2SavedTonnes * 95 + annualRainwaterHarvestM3 * 2.4) / 1_000_000).toFixed(2)
  );

  const annualGrossSavingsMillionEur = Number(
    (
      annualHeatingSavingsMillionEur +
      annualCoolingPueSavingsMillionEur +
      annualCarbonAndWaterSavingsMillionEur
    ).toFixed(2)
  );
  const annualNetSavingsMillionEur = Number(
    Math.max(0.5, annualGrossSavingsMillionEur - annualOpexMillionEur).toFixed(2)
  );

  // Payback horizons across the 3 benchmark funding models
  // 1) Tallaght Subsidized Pilot (84% municipal/EU heat infrastructure grant offset -> ~1.5 years <2 yrs)
  const netCapexSubsidized = grossCapexMillionEur * 0.16;
  const netCapexPpp = grossCapexMillionEur * 0.52;
  const paybackYearsSubsidized = Number((netCapexSubsidized / annualNetSavingsMillionEur).toFixed(1));
  const paybackYearsPpp = Number((netCapexPpp / annualNetSavingsMillionEur).toFixed(1));
  const paybackYearsCommercial = Number((grossCapexMillionEur / annualNetSavingsMillionEur).toFixed(1));

  const trenchVibrationReductionPercent = 85; // 85% per 1.0-metre width foam trench
  const unmitigatedAcousticDb = 138; // 130-145 dB standard inert gas nozzle
  const silencedNozzleAcousticDb = 98; // Safely below 110 dB HDD failure threshold

  return {
    activeRackCount,
    totalCoolantFlowLmin,
    flowPerRackLmin,
    coolantOutletTempC,
    pue,
    totalFacilityPowerMw,
    capturedThermalMw,
    annualThermalOutputMwh,
    criticalHeatFluxWcm2: topology.criticalHeatFluxWcm2,
    householdsCount,
    annualDhwDemandMwh,
    annualSpaceHeatingDemandMwh,
    totalDistrictAnnualDemandMwh,
    dailyDistrictDemandMwh,
    districtDemandCoveragePercent,
    surplusThermalMwhPerYear,
    pipeThermalInterferencePenaltyPercent,
    effectiveLineLossWm,
    pheSupplyTempC,
    hthpCarnotCop,
    hthpRealCop,
    hthpCompressorPowerMw,
    orcEfficiencyPercent,
    tegZtFigureOfMerit,
    recoveredElectricalKw,
    totalRecuperatedElectricalKw,
    annualRecuperatedElectricMwh,
    annualResidentialElectricDemandMwh,
    residentialPowerCoveragePercent,
    annualRainwaterHarvestM3,
    dailyThermalSinkMakeUpM3,
    requiredDroughtStorageM3,
    wueLitresPerKwh,
    annualCo2DisplacedTonnes,
    annualCoolingCo2SavedTonnes,
    annualOrcAndWaterCo2SavedTonnes,
    totalAnnualCo2SavedTonnes,
    embodiedCarbonLowTonnes,
    embodiedCarbonHighTonnes,
    grossCapexMillionEur,
    annualOpexMillionEur,
    annualHeatingSavingsMillionEur,
    annualCoolingPueSavingsMillionEur,
    annualCarbonAndWaterSavingsMillionEur,
    annualGrossSavingsMillionEur,
    annualNetSavingsMillionEur,
    paybackYearsSubsidized,
    paybackYearsPpp,
    paybackYearsCommercial,
    trenchVibrationReductionPercent,
    silencedNozzleAcousticDb,
    unmitigatedAcousticDb,
  };
}

/**
 * Generates the 20-year financial cash flow, CAPEX/OPEX breakdown, and CO2 abatement trajectories
 * for the interactive expenditure & emissions graphs.
 */
export function calculateEconomicsAndCarbonSeries(
  params: SimulationParams,
  results: SimulationResults,
  concreteSpec: ConcreteSpecId = 'low-carbon-0162'
): EconomicsAndCarbonSummary {
  const embodiedCarbonTonnes =
    concreteSpec === 'low-carbon-0162'
      ? results.embodiedCarbonLowTonnes
      : results.embodiedCarbonHighTonnes;

  const vaultAndIsolationMeur = Number((14.2 + params.computeCapacityMw * 0.85).toFixed(2));
  const coolingAndPheMeur = Number((8.4 + params.computeCapacityMw * 0.72).toFixed(2));
  const network5gdhcAndHthpMeur = Number(
    (7.6 + (params.residentsCount / 20000) * 8.5 + params.computeCapacityMw * 0.35).toFixed(2)
  );
  const hydroAndPowerMeur = Number(
    Math.max(
      3.2,
      results.grossCapexMillionEur -
        (vaultAndIsolationMeur + coolingAndPheMeur + network5gdhcAndHthpMeur)
    ).toFixed(2)
  );

  const capexBreakdown = [
    {
      label: 'Level -3/-4 Vault, Base Isolation & 1.0m Foam Trench',
      code: 'CAPEX-01',
      amountMeur: vaultAndIsolationMeur,
      sharePercent: Math.round((vaultAndIsolationMeur / results.grossCapexMillionEur) * 100),
      color: '#5AA897',
      detail: 'Bedrock excavation, Taylor fluid viscous dampers, elastomeric bearings & perimeter foam trench',
    },
    {
      label: '5GDHC Uninsulated Twin-Pipe Network & Lorentz HTHP Plant',
      code: 'CAPEX-02',
      amountMeur: network5gdhcAndHthpMeur,
      sharePercent: Math.round((network5gdhcAndHthpMeur / results.grossCapexMillionEur) * 100),
      color: '#BA7396',
      detail: '≥80 cm separated PE-Xa mains, Tier 2 natural-refrigerant HTHP boosters & PTES Carnot storage',
    },
    {
      label: `${COOLING_TOPOLOGIES[params.coolingTopology].shortName} Baths & Brazed PHEs`,
      code: 'CAPEX-03',
      amountMeur: coolingAndPheMeur,
      sharePercent: Math.round((coolingAndPheMeur / results.grossCapexMillionEur) * 100),
      color: '#C98253',
      detail: `${results.activeRackCount} high-density racks (${params.rackDensityKw} kW/rack) + modular stainless PHE frames`,
    },
    {
      label: 'Rainwater Cistern, QXG EMI Shielding & ORC/TEG Skutterudites',
      code: 'CAPEX-04',
      amountMeur: hydroAndPowerMeur,
      sharePercent: Math.max(
        5,
        100 -
          Math.round((vaultAndIsolationMeur / results.grossCapexMillionEur) * 100) -
          Math.round((network5gdhcAndHthpMeur / results.grossCapexMillionEur) * 100) -
          Math.round((coolingAndPheMeur / results.grossCapexMillionEur) * 100)
      ),
      color: '#5B9BD5',
      detail: `${results.requiredDroughtStorageM3.toLocaleString()} m³ drought tank, QXG harmonic shielding & solid-state TEG array`,
    },
  ];

  const annualCashBreakdown: EconomicsAndCarbonSummary['annualCashBreakdown'] = [
    {
      label: 'Displaced Residential Gas & DHW Utility Expenditure',
      type: 'saving',
      amountMeur: results.annualHeatingSavingsMillionEur,
      color: '#C98253',
      detail: `${results.totalDistrictAnnualDemandMwh.toLocaleString()} MWh/yr NZEB heat demand + PTES export credits`,
    },
    {
      label: 'Liquid Cooling PUE Reduction & Reclaimed ORC/TEG Power',
      type: 'saving',
      amountMeur: results.annualCoolingPueSavingsMillionEur,
      color: '#5B9BD5',
      detail: `PUE ${results.pue.toFixed(2)} vs 1.45 air-cooled baseline + ${results.totalRecuperatedElectricalKw} kW_e total power recuperation`,
    },
    {
      label: 'Avoided Carbon Tax (€95/tCO₂e) & Potable Water Tariffs',
      type: 'saving',
      amountMeur: results.annualCarbonAndWaterSavingsMillionEur,
      color: '#5AA897',
      detail: `${results.totalAnnualCo2SavedTonnes.toLocaleString()} tCO₂e/yr abated + ${results.annualRainwaterHarvestM3.toLocaleString()} m³/yr rainwater harvest`,
    },
    {
      label: 'Annual HTHP Compressor Power & Subterranean O&M Expenditure',
      type: 'expenditure',
      amountMeur: results.annualOpexMillionEur,
      color: '#C87A7A',
      detail: `${results.hthpCompressorPowerMw} MW_e HTHP compressor draw (COP ${results.hthpRealCop}) & acoustic/damper inspection`,
    },
  ];

  const netCapexByRegimeMeur: Record<FundingRegimeId, number> = {
    'subsidized-tallaght': Number((results.grossCapexMillionEur * 0.16).toFixed(2)),
    'municipal-ppp': Number((results.grossCapexMillionEur * 0.52).toFixed(2)),
    'commercial-market': results.grossCapexMillionEur,
  };

  const paybackByRegimeYears: Record<FundingRegimeId, number> = {
    'subsidized-tallaght': results.paybackYearsSubsidized,
    'municipal-ppp': results.paybackYearsPpp,
    'commercial-market': results.paybackYearsCommercial,
  };

  const series: YearlyEconomicsAndCarbonPoint[] = [];
  for (let year = 0; year <= 20; year++) {
    // Slight 1.2%/yr escalation in energy/carbon savings over 20-year horizon
    const escalationMultiplier = year === 0 ? 0 : 1 + (year - 1) * 0.012;
    const cumulativeMultiplier = year === 0 ? 0 : year * (1 + (year - 1) * 0.006);

    const cumNetSavings = results.annualNetSavingsMillionEur * cumulativeMultiplier;

    const cumCashFlowSubsidizedMeur = Number(
      (-netCapexByRegimeMeur['subsidized-tallaght'] + cumNetSavings).toFixed(2)
    );
    const cumCashFlowPppMeur = Number(
      (-netCapexByRegimeMeur['municipal-ppp'] + cumNetSavings).toFixed(2)
    );
    const cumCashFlowCommercialMeur = Number(
      (-netCapexByRegimeMeur['commercial-market'] + cumNetSavings).toFixed(2)
    );

    const annualExpenditureMeur =
      year === 0 ? results.grossCapexMillionEur : results.annualOpexMillionEur;
    const annualGrossSavedMeur =
      year === 0 ? 0 : Number((results.annualGrossSavingsMillionEur * escalationMultiplier).toFixed(2));
    const annualNetSavedMeur =
      year === 0
        ? -results.grossCapexMillionEur
        : Number((annualGrossSavedMeur - results.annualOpexMillionEur).toFixed(2));

    const cumHeatingCo2SavedTonnes = Math.round(results.annualCo2DisplacedTonnes * year);
    const cumCoolingPueCo2SavedTonnes = Math.round(results.annualCoolingCo2SavedTonnes * year);
    const cumOrcWaterCo2SavedTonnes = Math.round(results.annualOrcAndWaterCo2SavedTonnes * year);
    const cumNetCo2SavedTonnes =
      cumHeatingCo2SavedTonnes +
      cumCoolingPueCo2SavedTonnes +
      cumOrcWaterCo2SavedTonnes -
      embodiedCarbonTonnes;

    series.push({
      year,
      cumCashFlowSubsidizedMeur,
      cumCashFlowPppMeur,
      cumCashFlowCommercialMeur,
      annualExpenditureMeur,
      annualGrossSavedMeur,
      annualNetSavedMeur,
      cumNetCo2SavedTonnes,
      cumHeatingCo2SavedTonnes,
      cumCoolingPueCo2SavedTonnes,
      cumOrcWaterCo2SavedTonnes,
    });
  }

  const lastPoint = series[series.length - 1];
  const twentyYearNetGainByRegimeMeur: Record<FundingRegimeId, number> = {
    'subsidized-tallaght': lastPoint.cumCashFlowSubsidizedMeur,
    'municipal-ppp': lastPoint.cumCashFlowPppMeur,
    'commercial-market': lastPoint.cumCashFlowCommercialMeur,
  };

  const carbonPaybackMonths = Number(
    ((embodiedCarbonTonnes / Math.max(1, results.totalAnnualCo2SavedTonnes)) * 12).toFixed(1)
  );

  return {
    capexBreakdown,
    annualCashBreakdown,
    netCapexByRegimeMeur,
    paybackByRegimeYears,
    twentyYearNetGainByRegimeMeur,
    embodiedCarbonTonnes,
    carbonPaybackMonths,
    twentyYearNetCo2SavedTonnes: lastPoint.cumNetCo2SavedTonnes,
    series,
  };
}

export interface SoilTemperatureSample {
  offsetCm: number; // -120 to +120 cm from trench centerline
  soilTempC: number;
  unperturbedSupplyPlumeC: number;
  unperturbedReturnPlumeC: number;
}

export interface VibrationSpectrumBand {
  freqHz: number;
  label: string;
  unmitigatedDbV: number;
  afterTrenchDbV: number;
  afterBaseIsolationDbV: number;
  fullyIsolatedDbV: number;
  hddThresholdDbV: number;
}

export interface PlumeAndVibrationDiagnostics {
  ambientSoilTempC: number;
  supplyPipeTempC: number;
  returnPipeTempC: number;
  midpointSoilTempC: number;
  plumeOverlapIntensityPercent: number;
  groundHeatGainEfficiencyPercent: number;
  soilProfile: SoilTemperatureSample[];
  vibrationBands: VibrationSpectrumBand[];
}

/**
 * Pure deterministic solver for Visual Diagram 1 (Subsurface Thermal Plume & 5GDHC Pipe Spacing Heatmap)
 * and Visual Diagram 2 (Bidirectional Vibration & Acoustic Frequency Attenuation Spectrum).
 */
export function calculatePlumeAndVibrationDiagnostics(
  params: SimulationParams,
  results: SimulationResults,
  enableFoamTrench: boolean = true,
  enableBaseIsolation: boolean = true,
  enableActiveMounts: boolean = true
): PlumeAndVibrationDiagnostics {
  const ambientSoilTempC = 12.5; // Temperate oceanic undisturbed ground temperature (-2.5m depth)
  const supplyPipeTempC = results.pheSupplyTempC; // e.g., 53.5°C
  const returnPipeTempC = 20.5; // Cool 5GDHC return line absorbing ground heat

  const halfSepCm = params.pipeSeparationCm / 2;
  const supplyPosCm = -halfSepCm;
  const returnPosCm = halfSepCm;

  // Plume overlap intensity (0% at >= 80 cm, rising to 100% at 30 cm)
  const plumeOverlapIntensityPercent =
    params.pipeSeparationCm >= 80
      ? 0
      : Math.min(100, Math.round(((80 - params.pipeSeparationCm) / 50) * 100));

  const groundHeatGainEfficiencyPercent = 100 - results.pipeThermalInterferencePenaltyPercent;

  // Radial decay length scale in moist temperate soil (~28 cm characteristic decay)
  const decayLengthCm = 28;
  const soilProfile: SoilTemperatureSample[] = [];
  for (let offsetCm = -120; offsetCm <= 120; offsetCm += 10) {
    const distSupply = Math.abs(offsetCm - supplyPosCm);
    const distReturn = Math.abs(offsetCm - returnPosCm);

    const deltaSupply =
      (supplyPipeTempC - ambientSoilTempC) * Math.exp(-Math.pow(distSupply / decayLengthCm, 1.35));
    const deltaReturn =
      (returnPipeTempC - ambientSoilTempC) * Math.exp(-Math.pow(distReturn / decayLengthCm, 1.35));

    const soilTempC = Number((ambientSoilTempC + deltaSupply + deltaReturn * 0.75).toFixed(1));
    soilProfile.push({
      offsetCm,
      soilTempC,
      unperturbedSupplyPlumeC: Number((ambientSoilTempC + deltaSupply).toFixed(1)),
      unperturbedReturnPlumeC: Number((ambientSoilTempC + deltaReturn).toFixed(1)),
    });
  }

  const midpointSample = soilProfile.find((s) => s.offsetCm === 0) ?? soilProfile[12];
  const midpointSoilTempC = midpointSample.soilTempC;

  // Octave / 1/3-octave frequency bands from 16 Hz to 250 Hz (covering the critical 31.5 Hz - 125 Hz hum range)
  const frequencies = [
    { freqHz: 16, label: '16 Hz (Subway)', baseDbV: 86 },
    { freqHz: 31.5, label: '31.5 Hz (Traffic/Pumps)', baseDbV: 94 },
    { freqHz: 63, label: '63 Hz (Chiller/HTHP)', baseDbV: 98 },
    { freqHz: 90, label: '90 Hz (Compressor)', baseDbV: 95 },
    { freqHz: 125, label: '125 Hz (Riser Hum)', baseDbV: 91 },
    { freqHz: 250, label: '250 Hz (Auxiliary)', baseDbV: 82 },
  ];

  // 85% amplitude reduction in foam trench corresponds to 20 * log10(1 - 0.85) = -16.5 dB vibration attenuation
  const trenchAttenDb = enableFoamTrench ? 16.5 : 0;
  const baseSlabAttenDb = enableBaseIsolation ? 18.0 : 0;
  const activeMountAttenDb = enableActiveMounts ? 13.5 : 0;

  const vibrationBands: VibrationSpectrumBand[] = frequencies.map((f) => {
    const afterTrenchDbV = Number((f.baseDbV - trenchAttenDb).toFixed(1));
    const afterBaseIsolationDbV = Number((afterTrenchDbV - baseSlabAttenDb).toFixed(1));
    const fullyIsolatedDbV = Number((afterBaseIsolationDbV - activeMountAttenDb).toFixed(1));
    return {
      freqHz: f.freqHz,
      label: f.label,
      unmitigatedDbV: f.baseDbV,
      afterTrenchDbV,
      afterBaseIsolationDbV,
      fullyIsolatedDbV,
      hddThresholdDbV: 62, // Safe structural micro-vibration ceiling (<12 nm head stability & residential NR-25)
    };
  });

  return {
    ambientSoilTempC,
    supplyPipeTempC,
    returnPipeTempC,
    midpointSoilTempC,
    plumeOverlapIntensityPercent,
    groundHeatGainEfficiencyPercent,
    soilProfile,
    vibrationBands,
  };
}



import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateDistrictThermodynamics,
  calculateEconomicsAndCarbonSeries,
  calculatePlumeAndVibrationDiagnostics,
  DEFAULT_SIMULATION_PARAMS,
} from './thermodynamics';

test('baseline 20,000-resident NZEB district matches thermal demand (~40,100 MWh/yr)', () => {
  const result = calculateDistrictThermodynamics(DEFAULT_SIMULATION_PARAMS);
  assert.equal(result.householdsCount, 8000);
  // 8,000 households * 9.63 kWh/day * 365 = 28,120 MWh/yr DHW
  assert.ok(result.annualDhwDemandMwh >= 28000 && result.annualDhwDemandMwh <= 28200);
  // 8,000 households * 100 m2 * 15 kWh/m2/yr = 12,000 MWh/yr Space Heating
  assert.equal(result.annualSpaceHeatingDemandMwh, 12000);
  // Total ~40,120 MWh/yr
  assert.ok(result.totalDistrictAnnualDemandMwh >= 40000 && result.totalDistrictAnnualDemandMwh <= 40200);
});

test('two-phase immersion achieves lower flow rate and higher outlet temperature than direct-to-chip', () => {
  const twoPhase = calculateDistrictThermodynamics({
    ...DEFAULT_SIMULATION_PARAMS,
    coolingTopology: 'two-phase-immersion',
  });
  const dlc = calculateDistrictThermodynamics({
    ...DEFAULT_SIMULATION_PARAMS,
    coolingTopology: 'direct-to-chip',
  });

  assert.ok(twoPhase.totalCoolantFlowLmin < dlc.totalCoolantFlowLmin);
  assert.ok(twoPhase.coolantOutletTempC > dlc.coolantOutletTempC);
  assert.ok(twoPhase.pue < dlc.pue);
  assert.equal(twoPhase.criticalHeatFluxWcm2, 492);
  assert.equal(dlc.criticalHeatFluxWcm2, 202);
});

test('5GDHC pipe separation below 80 cm incurs thermal interference penalty up to 20%', () => {
  const optimalSeparation = calculateDistrictThermodynamics({
    ...DEFAULT_SIMULATION_PARAMS,
    pipeSeparationCm: 85,
  });
  const narrowSeparation = calculateDistrictThermodynamics({
    ...DEFAULT_SIMULATION_PARAMS,
    pipeSeparationCm: 30,
  });

  assert.equal(optimalSeparation.pipeThermalInterferencePenaltyPercent, 0);
  assert.equal(optimalSeparation.effectiveLineLossWm, 7.0);
  assert.equal(narrowSeparation.pipeThermalInterferencePenaltyPercent, 20);
  assert.ok(narrowSeparation.effectiveLineLossWm > 7.0);
});

test('hydrological drought buffer matches 8,220 m3 (30 days) and 12,330 m3 (45 days) at 10 MW baseline', () => {
  const drought30 = calculateDistrictThermodynamics({
    ...DEFAULT_SIMULATION_PARAMS,
    computeCapacityMw: 10,
    droughtDurationDays: 30,
  });
  const drought45 = calculateDistrictThermodynamics({
    ...DEFAULT_SIMULATION_PARAMS,
    computeCapacityMw: 10,
    droughtDurationDays: 45,
  });

  assert.equal(drought30.annualRainwaterHarvestM3, 100000);
  assert.equal(drought30.requiredDroughtStorageM3, 8220);
  assert.equal(drought45.requiredDroughtStorageM3, 12330);
});

test('financial payback and CO2 saved trajectories match benchmark bounds (<2 yrs subsidized, 8-12 yrs commercial)', () => {
  const result = calculateDistrictThermodynamics(DEFAULT_SIMULATION_PARAMS);
  const summaryLow = calculateEconomicsAndCarbonSeries(
    DEFAULT_SIMULATION_PARAMS,
    result,
    'low-carbon-0162'
  );
  const summaryHigh = calculateEconomicsAndCarbonSeries(
    DEFAULT_SIMULATION_PARAMS,
    result,
    'standard-0243'
  );

  // Subsidized pilot (Tallaght benchmark) payback under 2 years
  assert.ok(result.paybackYearsSubsidized > 0.8 && result.paybackYearsSubsidized < 2.0);
  // Commercial market payback between 8 and 12 years
  assert.ok(result.paybackYearsCommercial >= 8.0 && result.paybackYearsCommercial <= 12.0);
  // 21 data points from Year 0 to Year 20
  assert.equal(summaryLow.series.length, 21);
  // Low-carbon concrete (0.162 kgCO2e/kg) has lower embodied carbon than standard (0.243 kgCO2e/kg)
  assert.ok(summaryLow.embodiedCarbonTonnes < summaryHigh.embodiedCarbonTonnes);
  assert.ok(summaryLow.twentyYearNetCo2SavedTonnes > 150000);
});

test('power recuperation, residential power coverage, and subsurface plume/vibration diagnostics behave deterministically', () => {
  const result = calculateDistrictThermodynamics(DEFAULT_SIMULATION_PARAMS);
  assert.ok(result.totalRecuperatedElectricalKw > result.recoveredElectricalKw);
  assert.ok(result.annualRecuperatedElectricMwh > 3000);
  assert.ok(result.residentialPowerCoveragePercent > 15 && result.residentialPowerCoveragePercent <= 100);

  const diagOptimal = calculatePlumeAndVibrationDiagnostics(DEFAULT_SIMULATION_PARAMS, result);
  const narrowParams = { ...DEFAULT_SIMULATION_PARAMS, pipeSeparationCm: 35 };
  const narrowResult = calculateDistrictThermodynamics(narrowParams);
  const diagNarrow = calculatePlumeAndVibrationDiagnostics(narrowParams, narrowResult);

  assert.equal(diagOptimal.plumeOverlapIntensityPercent, 0);
  assert.ok(diagNarrow.plumeOverlapIntensityPercent > 80);
  assert.ok(diagNarrow.midpointSoilTempC > diagOptimal.midpointSoilTempC);
  assert.equal(diagOptimal.vibrationBands.length, 6);
  assert.ok(diagOptimal.vibrationBands[2].fullyIsolatedDbV < diagOptimal.vibrationBands[2].hddThresholdDbV);
});



export const clamp = (value, min, max) => Math.min(max, Math.max(min, Number(value) || 0));

export function safePercent(num, den) {
  if (!den) return 0;
  return Math.max(0, Math.round((num / den) * 100));
}

export function getLineMetrics(line) {
  const planned = Math.max(1, Number(line.plannedProductionMin) || 480);
  const actual = Math.max(0, Number(line.actual) || 0);
  const defect = clamp(line.defect, 0, actual);
  const good = Math.max(0, actual - defect);
  const availability = Math.max(0, (planned - (line.downtime?.totalMin || 0)) / planned);
  const performance = Math.max(0, Math.min(1, (actual * (line.idealCycleSec || 1)) / (planned * 60)));
  const quality = actual > 0 ? Math.max(0, Math.min(1, good / actual)) : 1;
  const oee = availability * performance * quality;

  return {
    good,
    qualityPct: Math.round(quality * 100),
    availabilityPct: Math.round(availability * 100),
    performancePct: Math.round(performance * 100),
    oeePct: Math.round(oee * 100),
    efficiencyPct: safePercent(actual, line.dailyTarget),
    statusBand: oee >= 0.75 ? 'good' : oee >= 0.6 ? 'warn' : 'bad'
  };
}

export function calculateRpn(item) {
  return clamp(item.severity, 1, 10) * clamp(item.occurrence, 1, 10) * clamp(item.detection, 1, 10);
}

export function fiveSScore(item) {
  return Math.round((item.seiri + item.seiton + item.seiso + item.seiketsu + item.shitsuke) / 5);
}

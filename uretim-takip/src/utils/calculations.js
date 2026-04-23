export const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
export const pct = (n, d) => (d <= 0 ? 0 : (n / d) * 100);
export const oeeForLine = (line) => {
  const availability = Math.max(0, ((line.plannedProductionMin - line.downtimeTotal) / line.plannedProductionMin) * 100);
  const performance = Math.min(100, pct(line.actual * line.idealCycleSec, line.plannedProductionMin * 60));
  const quality = pct(line.actual - line.defect, line.actual);
  const oee = (availability * performance * quality) / 10000;
  return { availability, performance, quality, oee };
};
export const formatMin = (m) => `${Math.round(m)} dk`;
export const downloadCsv = (name, rows) => {
  const csv = rows.map((r) => r.map((c) => `"${String(c).replaceAll('"', '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = name;
  link.click();
};

import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { oeeForLine, pct, formatMin } from '../utils/calculations';
import KpiCard from '../components/common/KpiCard';

export default function DashboardPage() {
  const { state, search } = useApp();
  const lines = useMemo(() => state.lines.filter((l) => `${l.name} ${l.operator}`.toLowerCase().includes(search.toLowerCase())).sort((a, b) => a.order - b.order), [state.lines, search]);
  const kpi = useMemo(() => {
    const totalTarget = state.lines.reduce((s, l) => s + l.dailyTarget, 0);
    const totalActual = state.lines.reduce((s, l) => s + l.actual, 0);
    const oees = state.lines.map((l) => oeeForLine(l).oee);
    const avgOee = oees.reduce((a, b) => a + b, 0) / (oees.length || 1);
    const weak = state.lines.map((l) => ({ ...l, oee: oeeForLine(l).oee })).sort((a, b) => a.oee - b.oee)[0];
    const criticalRisk = state.fmea.filter((f) => f.severity * f.occurrence * f.detection >= 200).length;
    return { totalTarget, totalActual, avgOee, weak, criticalRisk };
  }, [state]);

  return <section>
    <div className="grid six">
      <KpiCard title="Toplam Hedef" value={kpi.totalTarget.toLocaleString('tr-TR')} sub="Günlük plan" />
      <KpiCard title="Toplam Gerçekleşen" value={kpi.totalActual.toLocaleString('tr-TR')} sub="Anlık üretim" tone="good" />
      <KpiCard title="Ortalama OEE" value={`%${kpi.avgOee.toFixed(1)}`} sub="Hat ortalaması" tone={kpi.avgOee < 65 ? 'bad' : 'good'} />
      <KpiCard title="Toplam Duruş" value={formatMin(state.lines.reduce((s, l) => s + l.downtimeTotal, 0))} sub="Bugün" tone="warn" />
      <KpiCard title="En Zayıf Hat" value={kpi.weak?.name ?? '-'} sub={`OEE %${kpi.weak ? oeeForLine(kpi.weak).oee.toFixed(1) : 0}`} tone="bad" />
      <KpiCard title="Kritik Risk" value={kpi.criticalRisk} sub="FMEA RPN ≥ 200" tone="warn" />
    </div>
    <div className="grid three mt">
      {lines.map((l) => { const oee = oeeForLine(l); return <article key={l.id} className={`line-card ${l.status}`}>
        <header><h3>{l.name}</h3><span>{l.type}</span></header>
        <p>Durum: <b>{l.status === 'running' ? 'Çalışıyor' : l.status === 'stopped' ? 'Duruşta' : 'Beklemede'}</b></p>
        <p>Hedef / Gerçekleşen: <b>{l.dailyTarget} / {l.actual}</b></p>
        <p>Verim: <b>%{pct(l.actual, l.dailyTarget).toFixed(1)}</b> | OEE: <b>%{oee.oee.toFixed(1)}</b></p>
        <p>Vardiya: <b>{l.shift}</b> | Operatör: <b>{l.operator || '-'}</b></p>
        <p>Son duruş: <b>{l.lastDowntimeReason || '-'}</b> | Toplam: <b>{formatMin(l.downtimeTotal)}</b></p>
      </article>; })}
    </div>
  </section>;
}

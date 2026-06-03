import { kpis } from '@/lib/production-data';

export function SummaryPanel() {
  return (
    <div className="panel summary">
      <h2>Yönetici Özeti</h2>
      <div className="insight">AI içgörüsü: Son 7 günlük eğilimde toplam verimlilik kaybının en büyük nedeni kısa duruşlar. Eğer vardiya başlangıç kontrol listesi dijitalleştirilirse ve ilk 20 dakikadaki ayar sapmaları otomatik işaretlenirse, OEE üzerinde %3-%5 iyileşme potansiyeli oluşabilir.</div>
      <div className="kpi-grid">
        {kpis.map((kpi) => <div className="kpi" key={kpi.title}><div className="t">{kpi.title}</div><div className="v">{kpi.value}</div><div className="s">{kpi.sub}</div></div>)}
      </div>
    </div>
  );
}

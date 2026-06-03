import { maintenanceTasks, productionOrders, qualityChecks, scrapRecords, stops } from '@/lib/production-data';

export function AdminTables() {
  return (
    <div className="admin-grid">
      <Table title="Üretim Emirleri" headers={['Emir', 'Ürün', 'Hat', 'Plan', 'Sağlam', 'Durum']} rows={productionOrders.map((o) => [o.id, o.product, o.line, o.planned.toLocaleString('tr-TR'), o.good.toLocaleString('tr-TR'), o.status])} />
      <Table title="Duruş Yönetimi" headers={['Kod', 'Hat', 'Neden', 'Dakika', 'Öncelik']} rows={stops.map((s) => [s.id, s.line, s.reason, `${s.minutes}`, s.severity])} />
      <Table title="Fire Yönetimi" headers={['Kod', 'Hat', 'Kategori', 'Adet', 'Aksiyon']} rows={scrapRecords.map((s) => [s.id, s.line, s.category, `${s.quantity}`, s.action])} />
      <Table title="Kalite Yönetimi" headers={['Kod', 'Emir', 'Metrik', 'Sonuç', 'CPK']} rows={qualityChecks.map((q) => [q.id, q.order, q.metric, q.result, `${q.cpk}`])} />
      <Table title="Bakım Yönetimi" headers={['Kod', 'Varlık', 'Tip', 'Kalan', 'Risk']} rows={maintenanceTasks.map((m) => [m.id, m.asset, m.type, `${m.dueInHours} saat`, m.risk])} />
    </div>
  );
}

function Table({ title, headers, rows }: { title: string; headers: string[]; rows: string[][] }) {
  return (
    <section className="panel section data-section">
      <div className="section-title">{title}</div>
      <div className="table-wrap"><table><thead><tr>{headers.map((h) => <th key={h}>{h}</th>)}</tr></thead><tbody>{rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>)}</tbody></table></div>
    </section>
  );
}

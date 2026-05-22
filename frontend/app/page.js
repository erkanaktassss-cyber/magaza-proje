import { getDashboard, getDowntimes, getHealth, getInventoryMoves, getLabApprovals, getLines, getMaintenance, getOee, getOrders, getUtilities } from '../lib/api';

const card = { border: '1px solid #ddd', borderRadius: 10, padding: 16, background: '#fff' };

export default async function Home() {
  const [health, dashboard, oee, lines, orders, downtimes, lab, inv, maint, util] = await Promise.all([
    getHealth().catch(() => ({ ok: false })),
    getDashboard().catch(() => ({})),
    getOee().catch(() => ({})),
    getLines().catch(() => []),
    getOrders().catch(() => []),
    getDowntimes().catch(() => []),
    getLabApprovals().catch(() => []),
    getInventoryMoves().catch(() => []),
    getMaintenance().catch(() => []),
    getUtilities().catch(() => []),
  ]);

  return <main style={{ padding: 20, fontFamily: 'Arial', background: '#f3f4f6' }}>
    <h1>Fabrika Dijital Üretim ve Verimlilik Yönetimi (MVP)</h1>
    <p>Durum: {health.ok ? '✅ API Aktif' : '❌ API Ulaşılamıyor'}</p>

    <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
      <div style={card}><h3>Günlük Üretim</h3><b>{dashboard.daily_total_production || 0}</b></div>
      <div style={card}><h3>Toplam Fire</h3><b>{dashboard.total_scrap || 0}</b></div>
      <div style={card}><h3>Duruş (dk)</h3><b>{dashboard.total_downtime_minutes || 0}</b></div>
      <div style={card}><h3>OEE</h3><b>%{((oee.oee || 0) * 100).toFixed(1)}</b></div>
    </section>

    <h2>Canlı Hat Ekranı</h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>{lines.map(l => <div key={l.id} style={card}>
      <b>{l.line_name}</b> - {l.status}<br />Ürün: {l.current_product}<br />Vardiya: {l.shift}<br />Hedef: {l.target_count} / Gerçekleşen: {l.instant_count} / Fire: {l.scrap_count}
    </div>)}</div>

    <h2>Üretim Emirleri</h2>
    <ul>{orders.slice(0, 5).map(o => <li key={o.id}>{o.product_name} ({o.product_code}) - Lot {o.lot_number} - {o.target_quantity} {o.unit}</li>)}</ul>

    <h2>Duruş Takibi</h2>
    <ul>{downtimes.slice(0, 5).map(d => <li key={d.id}>{d.reason} / {d.department} / {d.total_minutes} dk</li>)}</ul>

    <h2>Lab Onayı</h2>
    <ul>{lab.slice(0, 5).map(a => <li key={a.id}>Emir #{a.production_order_id}: {a.quality_result} - {a.approved ? 'Onaylı' : 'Onaysız'}</li>)}</ul>

    <h2>Depo Barkod / QR Hareketleri</h2>
    <ul>{inv.slice(0, 5).map(m => <li key={m.id}>{m.material_type} {m.material_code} - {m.quantity} {m.unit} ({m.movement_type})</li>)}</ul>

    <h2>Bakım Arıza</h2>
    <ul>{maint.slice(0, 5).map(m => <li key={m.id}>{m.fault_code} - {m.description} ({m.intervention_minutes} dk)</li>)}</ul>

    <h2>Enerji & Su Tüketimi</h2>
    <ul>{util.map(u => <li key={u.metric}>{u.metric}: {u.total.toFixed(2)}</li>)}</ul>
  </main>;
}

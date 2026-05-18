'use client'

const sidebar = [
  'Dashboard',
  'Satış Ekranı',
  'Siparişler',
  'Ürünler',
  'Raporlar',
  'Müşteriler',
  'Ayarlar',
]

function Sparkline({ data }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const points = data
    .map((value, i) => {
      const x = (i / (data.length - 1)) * 100
      const y = 100 - ((value - min) / (max - min || 1)) * 85 - 5
      return `${x},${y}`
    })
    .join(' ')

  return (
    <div className="chart-card">
      <div className="chart-head"><h3>Satış Trendi</h3><span>Son 12 saat</span></div>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="trend-svg">
        <polyline fill="none" stroke="url(#lineGradient)" strokeWidth="2.8" points={points} />
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

export default function PosDashboard({ dashboard, oee, lines, ai, topProducts, salesTrend }) {
  return (
    <main className="pos-shell">
      <aside className="sidebar glass">
        <div className="brand">Flowix POS</div>
        <nav>
          {sidebar.map((item, idx) => (
            <button key={item} className={`nav-btn ${idx === 0 ? 'active' : ''}`}>{item}</button>
          ))}
        </nav>
      </aside>

      <section className="content">
        <header className="glass topbar">
          <div>
            <h1>Premium POS Dashboard</h1>
            <p>Canlı operasyon, satış ve performans görünümü</p>
          </div>
          <button className="cta-btn">Yeni Sipariş</button>
        </header>

        <section className="stats-grid">
          <article className="glass stat-card"><h4>Günlük Satış</h4><p>₺{dashboard.daily_total_production}</p></article>
          <article className="glass stat-card"><h4>Toplam Fire</h4><p>{dashboard.total_scrap}</p></article>
          <article className="glass stat-card"><h4>Duruş</h4><p>{dashboard.total_downtime_minutes} dk</p></article>
          <article className="glass stat-card"><h4>Genel OEE</h4><p>%{(oee.oee * 100).toFixed(1)}</p></article>
        </section>

        <section className="main-grid">
          <Sparkline data={salesTrend} />

          <div className="glass top-products">
            <h3>Top Ürünler</h3>
            <ul>
              {topProducts.map((p) => (
                <li key={p.name}><span>{p.name}</span><b>{p.sales}</b><em>{p.growth}</em></li>
              ))}
            </ul>
          </div>

          <div className="glass table-wrap">
            <h3>Son Satışlar</h3>
            <table>
              <thead><tr><th>Hat</th><th>Makine</th><th>Durum</th><th>Çıktı</th></tr></thead>
              <tbody>
                {lines.map((l) => (
                  <tr key={l.id}>
                    <td>{l.line_name}</td><td>{l.machine_name}</td><td>{l.status}</td><td>{l.instant_count}/{l.target_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="glass ai-box">
            <h3>AI Önerileri</h3>
            {ai.recommendations.map((r, i) => <p key={i}>• {r}</p>)}
          </div>
        </section>
      </section>
    </main>
  )
}

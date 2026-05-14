import { getData } from '../lib/api'
export default async function Home(){
  const [dashboard,oee,lines,ai] = await Promise.all([getData('/dashboard'),getData('/oee'),getData('/lines'),getData('/ai-recommendations')])
  return <main className='wrap'>
    <h1 className='title'>FabrikaOS AI Dashboard</h1>
    <div className='grid'>
      <div className='card'><h3>Günlük Üretim</h3><p>{dashboard.daily_total_production}</p></div>
      <div className='card'><h3>Toplam Fire</h3><p>{dashboard.total_scrap}</p></div>
      <div className='card'><h3>Duruş Süresi</h3><p>{dashboard.total_downtime_minutes} dk</p></div>
      <div className='card'><h3>En Çok Duruş</h3><p>{dashboard.top_downtime_reason || '-'}</p></div>
      <div className='card'><h3>OEE</h3><p>%{(oee.oee*100).toFixed(1)}</p><p className='muted'>A:{(oee.availability*100).toFixed(1)} P:{(oee.performance*100).toFixed(1)} Q:{(oee.quality*100).toFixed(1)}</p></div>
    </div>
    <h2>Hatlar</h2><div className='grid'>{lines.map(l=><div key={l.id} className='card'><b>{l.line_name}</b><p>{l.machine_name}</p><p>{l.status}</p><p>{l.instant_count}/{l.target_count}</p></div>)}</div>
    <h2>AI Önerileri</h2><ul>{ai.recommendations.map((r,i)=><li key={i}>{r}</li>)}</ul>
  </main>
}

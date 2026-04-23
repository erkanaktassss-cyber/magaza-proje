import { useMemo, useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { useApp } from '../context/AppContext';

export default function FiveSPage() {
  const { state, actions } = useApp();
  const [f, setF] = useState({ department: '', seiri: 70, seiton: 70, seiso: 70, seiketsu: 70, shitsuke: 70 });
  const latest = state.fiveS.at(-1);
  const data = latest ? ['seiri', 'seiton', 'seiso', 'seiketsu', 'shitsuke'].map((k) => ({ key: k, value: latest[k] })) : [];
  const low = useMemo(() => data.slice().sort((a, b) => a.value - b.value)[0], [data]);
  return <section className="grid two">
    <div className="panel glass form-grid">
      <h2>5S Değerlendirme</h2>
      <input placeholder="Bölüm" value={f.department} onChange={(e) => setF({ ...f, department: e.target.value })} />
      {['seiri', 'seiton', 'seiso', 'seiketsu', 'shitsuke'].map((k) => <label key={k}>{k.toUpperCase()}<input type="range" min="0" max="100" value={f[k]} onChange={(e) => setF({ ...f, [k]: Number(e.target.value) })} /></label>)}
      <button onClick={() => f.department.trim() && actions.addFiveS(f)}>Puanları Kaydet</button>
    </div>
    <div className="panel glass">
      <h3>Radar Görünümü</h3>
      <div className="chart"><ResponsiveContainer><RadarChart data={data}><PolarGrid /><PolarAngleAxis dataKey="key" /><Radar dataKey="value" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.5} /></RadarChart></ResponsiveContainer></div>
      {low && <div className="warn-card">En düşük alan: <b>{low.key}</b> ({low.value})</div>}
    </div>
  </section>;
}

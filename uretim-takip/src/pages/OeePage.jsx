import { useMemo, useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useApp } from '../context/AppContext';
import { oeeForLine } from '../utils/calculations';

export default function OeePage() {
  const { state } = useApp();
  const [view, setView] = useState('gunluk');
  const rows = useMemo(() => state.lines.map((l) => ({ name: l.name, ...oeeForLine(l) })), [state.lines]);
  const low = rows.filter((r) => r.oee < 60);
  return <section className="grid two">
    <div className="panel glass">
      <div className="row"><h2>OEE Modülü</h2><select value={view} onChange={(e) => setView(e.target.value)}><option value="gunluk">Günlük</option><option value="haftalik">Haftalık</option></select></div>
      <div className="chart"><ResponsiveContainer><BarChart data={rows}><XAxis dataKey="name" hide /><YAxis /><Tooltip /><Bar dataKey="availability" fill="#60a5fa" /><Bar dataKey="performance" fill="#22c55e" /><Bar dataKey="quality" fill="#facc15" /></BarChart></ResponsiveContainer></div>
      <div className="chart"><ResponsiveContainer><LineChart data={rows}><XAxis dataKey="name" hide /><YAxis /><Tooltip /><Line dataKey="oee" stroke="#f472b6" strokeWidth={3} /></LineChart></ResponsiveContainer></div>
    </div>
    <div className="panel glass">{low.length ? low.map((l) => <div key={l.name} className="warn-card">⚠ Düşük OEE: <b>{l.name}</b> - %{l.oee.toFixed(1)} (A:{l.availability.toFixed(0)} P:{l.performance.toFixed(0)} Q:{l.quality.toFixed(0)})</div>) : <div className="ok-card">Tüm hatlar OEE açısından hedef üstünde.</div>}</div>
  </section>;
}

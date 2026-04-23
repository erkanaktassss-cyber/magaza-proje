import { useMemo, useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { useApp } from '../context/AppContext';

const colors = ['#3b82f6', '#14b8a6', '#8b5cf6', '#f59e0b'];

export default function DowntimePage() {
  const { state, actions } = useApp();
  const [lineId, setLineId] = useState(state.lines[0]?.id);
  const [reason, setReason] = useState(state.downtimeReasons[0]);
  const [type, setType] = useState('plansiz');
  const byLine = state.lines.map((l) => ({ name: l.name, value: Math.round(l.downtimeTotal) }));
  const byReason = useMemo(() => Object.values(state.downtimes.filter((d) => d.durationMin).reduce((a, d) => ({ ...a, [d.reason]: (a[d.reason] || 0) + d.durationMin }), {})).length ? Object.entries(state.downtimes.filter((d) => d.durationMin).reduce((a, d) => ({ ...a, [d.reason]: (a[d.reason] || 0) + d.durationMin }), {})).map(([name, value]) => ({ name, value: Math.round(value) })) : [{ name: 'Veri yok', value: 1 }], [state.downtimes]);
  return <section className="grid two">
    <div className="panel glass">
      <h2>Duruş Kontrolü</h2>
      <select value={lineId} onChange={(e) => setLineId(e.target.value)}>{state.lines.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}</select>
      <select value={type} onChange={(e) => setType(e.target.value)}><option value="planli">Planlı</option><option value="plansiz">Plansız</option></select>
      <select value={reason} onChange={(e) => setReason(e.target.value)}>{state.downtimeReasons.map((r) => <option key={r}>{r}</option>)}</select>
      <div className="row"><button onClick={() => actions.startDowntime({ lineId, reason, type })}>Duruş Başlat</button><button onClick={() => actions.endDowntime(lineId)}>Duruş Bitir</button></div>
      <div className="table-wrap"><table><thead><tr><th>Hat</th><th>Neden</th><th>Tip</th><th>Süre</th></tr></thead><tbody>{state.downtimes.slice().reverse().map((d) => <tr key={d.id}><td>{state.lines.find((l) => l.id === d.lineId)?.name}</td><td>{d.reason}</td><td>{d.type}</td><td>{d.durationMin ? `${Math.round(d.durationMin)} dk` : 'Aktif'}</td></tr>)}</tbody></table></div>
    </div>
    <div className="panel glass">
      <h3>En Çok Duran Hatlar</h3>
      <div className="chart"><ResponsiveContainer><BarChart data={byLine}><XAxis dataKey="name" hide /><YAxis /><Tooltip /><Bar dataKey="value" fill="#fb7185" /></BarChart></ResponsiveContainer></div>
      <h3>Duruş Nedeni Dağılımı</h3>
      <div className="chart"><ResponsiveContainer><PieChart><Pie data={byReason} dataKey="value" nameKey="name" outerRadius={80}>{byReason.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div>
    </div>
  </section>;
}

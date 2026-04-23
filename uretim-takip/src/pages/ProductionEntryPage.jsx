import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function ProductionEntryPage() {
  const { state, actions } = useApp();
  const [lineId, setLineId] = useState(state.lines[0]?.id);
  const [f, setF] = useState({ dailyTarget: 0, actual: 0, defect: 0, shift: '1. Vardiya', operator: '' });
  return <section className="panel glass form-grid">
    <h2>Üretim Girişi</h2>
    <select value={lineId} onChange={(e) => setLineId(e.target.value)}>{state.lines.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}</select>
    <input type="number" placeholder="Hedef" value={f.dailyTarget} onChange={(e) => setF({ ...f, dailyTarget: Number(e.target.value) })} />
    <input type="number" placeholder="Gerçekleşen" value={f.actual} onChange={(e) => setF({ ...f, actual: Number(e.target.value) })} />
    <input type="number" placeholder="Hatalı ürün" value={f.defect} onChange={(e) => setF({ ...f, defect: Number(e.target.value) })} />
    <select value={f.shift} onChange={(e) => setF({ ...f, shift: e.target.value })}><option>1. Vardiya</option><option>2. Vardiya</option><option>3. Vardiya</option></select>
    <input placeholder="Operatör" value={f.operator} onChange={(e) => setF({ ...f, operator: e.target.value })} />
    <button onClick={() => actions.saveProduction({ lineId, data: f })}>Kaydet ve Dashboard Güncelle</button>
  </section>;
}

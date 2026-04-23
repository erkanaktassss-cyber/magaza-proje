import { useState } from 'react';
import { useApp } from '../context/AppContext';

const empty = { name: '', type: 'Dolum', shift: '1. Vardiya', operator: '', dailyTarget: 0, actual: 0, defect: 0, status: 'idle', lastDowntimeReason: '', downtimeTotal: 0, idealCycleSec: 1.2, plannedProductionMin: 480 };

export default function LineManagementPage() {
  const { state, actions } = useApp();
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const submit = () => {
    if (!form.name.trim()) return;
    editing ? actions.updateLine(editing, form) : actions.addLine(form);
    setForm(empty); setEditing(null);
  };
  return <section className="grid two">
    <div className="panel glass">
      <h2>Hat Tanımı</h2>
      <input placeholder="Hat adı" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option>Dolum</option><option>Paketleme</option><option>Diğer</option></select>
      <input placeholder="Operatör" value={form.operator} onChange={(e) => setForm({ ...form, operator: e.target.value })} />
      <button onClick={submit}>{editing ? 'Güncelle' : 'Hat Ekle'}</button>
    </div>
    <div className="panel glass">
      {state.lines.sort((a, b) => a.order - b.order).map((l) => <div key={l.id} className="row">
        <span>{l.order}. {l.name} ({l.type})</span>
        <div>
          <button className="ghost" onClick={() => actions.reorderLine(l.id, 'up')}>↑</button>
          <button className="ghost" onClick={() => actions.reorderLine(l.id, 'down')}>↓</button>
          <button className="ghost" onClick={() => { setForm(l); setEditing(l.id); }}>Düzenle</button>
          <button className="ghost danger" onClick={() => actions.deleteLine(l.id)}>Sil</button>
        </div>
      </div>)}
    </div>
  </section>;
}

import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function FmeaPage() {
  const { state, actions } = useApp();
  const [f, setF] = useState({ process: '', failureMode: '', effect: '', cause: '', severity: 5, occurrence: 5, detection: 5, action: '', owner: '', dueDate: '', status: 'açık' });
  const rpn = f.severity * f.occurrence * f.detection;
  return <section className="grid two">
    <div className="panel glass form-grid">
      <h2>FMEA Kayıt</h2>
      {Object.entries(f).map(([k, v]) => ['severity', 'occurrence', 'detection'].includes(k) ? <input key={k} type="number" min="1" max="10" value={v} onChange={(e) => setF({ ...f, [k]: Number(e.target.value) })} placeholder={k} /> : k === 'status' ? <select key={k} value={v} onChange={(e) => setF({ ...f, status: e.target.value })}><option>açık</option><option>izlemede</option><option>kapalı</option></select> : <input key={k} value={v} onChange={(e) => setF({ ...f, [k]: e.target.value })} placeholder={k} />)}
      <div>RPN: <b>{rpn}</b></div>
      <button onClick={() => f.process.trim() && actions.addFmea(f)}>FMEA Kaydet</button>
    </div>
    <div className="panel glass table-wrap"><table><thead><tr><th>Proses</th><th>Hata Türü</th><th>RPN</th><th>Durum</th></tr></thead><tbody>{state.fmea.map((x) => { const val = x.severity * x.occurrence * x.detection; return <tr key={x.id} className={val >= 200 ? 'critical' : ''}><td>{x.process}</td><td>{x.failureMode}</td><td>{val}</td><td>{x.status}</td></tr>; })}</tbody></table></div>
  </section>;
}

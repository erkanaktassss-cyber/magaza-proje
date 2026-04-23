import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function SettingsPage() {
  const { state, actions } = useApp();
  const [s, setS] = useState(state.settings);
  return <section className="panel glass form-grid">
    <h2>Veri Entegrasyonu Ayarları</h2>
    <select value={s.source} onChange={(e) => setS({ ...s, source: e.target.value })}><option>Manuel</option><option>Barkod</option><option>Delta HMI/PLC</option></select>
    {s.source === 'Delta HMI/PLC' && ['ip', 'port', 'protocol', 'counterAddress', 'runAddress', 'alarmAddress'].map((k) => <input key={k} placeholder={k} value={s.delta[k]} onChange={(e) => setS({ ...s, delta: { ...s.delta, [k]: e.target.value } })} />)}
    <button onClick={() => actions.saveSettings(s)}>Ayarları Kaydet</button>
  </section>;
}

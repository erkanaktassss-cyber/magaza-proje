import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function KaizenPage() {
  const { state, actions } = useApp();
  const [filter, setFilter] = useState('all');
  const [f, setF] = useState({ title: '', description: '', status: 'yeni', area: 'zaman' });
  const list = state.kaizens.filter((k) => filter === 'all' || k.status === filter);
  return <section className="grid two">
    <div className="panel glass form-grid">
      <h2>Kaizen Öneri Girişi</h2>
      <input placeholder="Başlık" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} />
      <textarea placeholder="Açıklama" value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} />
      <select value={f.status} onChange={(e) => setF({ ...f, status: e.target.value })}><option>yeni</option><option>incelemede</option><option>kabul edildi</option><option>reddedildi</option><option>uygulandı</option></select>
      <select value={f.area} onChange={(e) => setF({ ...f, area: e.target.value })}><option>zaman</option><option>maliyet</option><option>kalite</option><option>iş güvenliği</option></select>
      <button onClick={() => { if (!f.title.trim()) return; actions.addKaizen(f); setF({ title: '', description: '', status: 'yeni', area: 'zaman' }); }}>Öneri Kaydet</button>
    </div>
    <div className="panel glass">
      <div className="row"><h3>Kaizen Listesi</h3><select value={filter} onChange={(e) => setFilter(e.target.value)}><option value="all">Tümü</option><option>yeni</option><option>incelemede</option><option>kabul edildi</option><option>reddedildi</option><option>uygulandı</option></select></div>
      <div className="table-wrap"><table><thead><tr><th>Başlık</th><th>Alan</th><th>Durum</th><th>Tarih</th></tr></thead><tbody>{list.map((k) => <tr key={k.id}><td>{k.title}</td><td>{k.area}</td><td><select value={k.status} onChange={(e) => actions.updateKaizenStatus(k.id, e.target.value)}><option>yeni</option><option>incelemede</option><option>kabul edildi</option><option>reddedildi</option><option>uygulandı</option></select></td><td>{k.createdAt}</td></tr>)}</tbody></table></div>
    </div>
  </section>;
}

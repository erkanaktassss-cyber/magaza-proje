import { Bell, Search, Tv2, RotateCcw } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Topbar() {
  const { state, search, setSearch, actions } = useApp();
  return (
    <header className="topbar glass">
      <div className="title-wrap">
        <h1>FabrikaOS Pro</h1>
        <p>Kurumsal Üretim Yönetim Platformu</p>
      </div>
      <div className="top-actions">
        <label className="search"><Search size={16} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Hat, operatör, süreç ara..." /></label>
        <button className="ghost" onClick={() => document.documentElement.requestFullscreen?.()}><Tv2 size={16} /> TV Modu</button>
        <button className="ghost" onClick={actions.reset}><RotateCcw size={16} /> Sıfırla</button>
        <button className="ghost"><Bell size={16} /> {state.notifications.length}</button>
      </div>
    </header>
  );
}

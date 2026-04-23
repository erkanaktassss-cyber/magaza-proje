import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Factory, ClipboardPlus, PauseCircle, Gauge, Lightbulb, Radar, ShieldAlert, BrainCircuit, Settings2, FileText, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

const items = [
  ['/', 'Dashboard', LayoutDashboard], ['/hat-yonetimi', 'Hat Yönetimi', Factory], ['/uretim-girisi', 'Üretim Girişi', ClipboardPlus], ['/durus', 'Duruş Yönetimi', PauseCircle],
  ['/oee', 'OEE', Gauge], ['/kaizen', 'Kaizen', Lightbulb], ['/bes-s', '5S', Radar], ['/fmea', 'FMEA', ShieldAlert], ['/analiz', 'Üretim Analiz Motoru', BrainCircuit], ['/ayarlar', 'Entegrasyon Ayarları', Settings2], ['/raporlar', 'Raporlama', FileText]
];

export default function Sidebar({ collapsed, setCollapsed }) {
  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <button className="ghost" onClick={() => setCollapsed((v) => !v)}>{collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}</button>
      {items.map(([to, label, Icon]) => (
        <NavLink key={to} to={to} className="menu-item">
          <Icon size={18} /><span>{label}</span>
        </NavLink>
      ))}
    </aside>
  );
}

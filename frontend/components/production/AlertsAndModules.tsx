import { alerts, modules } from '@/lib/production-data';

export function AlertsPanel() {
  return <div className="panel section"><div className="section-title">Akıllı Alarm Merkezi</div><div className="alerts">{alerts.map((alert) => <div className="alert-card" key={alert.title}><div className="alert-title">{alert.title}</div><div className="alert-text">{alert.text}</div><div className="small-pill">{alert.severity}</div></div>)}</div></div>;
}

export function ModulesPanel() {
  return <div className="panel section"><div className="section-title">Modül Yapısı</div><div className="module-grid">{modules.map((module) => <div className="module-card" key={module.title}><div className="module-title">{module.title}</div><div className="module-text">{module.text}</div></div>)}</div></div>;
}

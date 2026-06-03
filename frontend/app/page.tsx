import { AIAssistant } from '@/components/production/AIAssistant';
import { AlertsPanel, ModulesPanel } from '@/components/production/AlertsAndModules';
import { PerformanceRadar, WeeklyTrendChart } from '@/components/production/Charts';
import { HeroPanel } from '@/components/production/HeroPanel';
import { LineCards } from '@/components/production/LineCards';
import { SummaryPanel } from '@/components/production/SummaryPanel';

export default function HomePage() {
  return (
    <main className="container">
      <div className="system-bar panel">
        <div><strong>Elite Production AI</strong><span>MES + OEE + AI karar destek sistemi</span></div>
        <nav><a href="/login">JWT Login</a><a href="/admin">Admin Paneli</a><a href="/api/dashboard">API</a></nav>
      </div>
      <div className="top-grid"><HeroPanel /><SummaryPanel /></div>
      <div className="bottom-grid">
        <div className="left-col"><LineCards /><WeeklyTrendChart /><PerformanceRadar /></div>
        <div className="right-col"><AIAssistant /><AlertsPanel /><ModulesPanel /></div>
      </div>
    </main>
  );
}

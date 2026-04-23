import { Navigate, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import DashboardPage from './pages/DashboardPage';
import LineManagementPage from './pages/LineManagementPage';
import ProductionEntryPage from './pages/ProductionEntryPage';
import DowntimePage from './pages/DowntimePage';
import OeePage from './pages/OeePage';
import KaizenPage from './pages/KaizenPage';
import FiveSPage from './pages/FiveSPage';
import FmeaPage from './pages/FmeaPage';
import AnalysisPage from './pages/AnalysisPage';
import SettingsPage from './pages/SettingsPage';
import ReportsPage from './pages/ReportsPage';

export default function App() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="app-shell">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main className="main">
        <Topbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/hat-yonetimi" element={<LineManagementPage />} />
            <Route path="/uretim-girisi" element={<ProductionEntryPage />} />
            <Route path="/durus" element={<DowntimePage />} />
            <Route path="/oee" element={<OeePage />} />
            <Route path="/kaizen" element={<KaizenPage />} />
            <Route path="/bes-s" element={<FiveSPage />} />
            <Route path="/fmea" element={<FmeaPage />} />
            <Route path="/analiz" element={<AnalysisPage />} />
            <Route path="/ayarlar" element={<SettingsPage />} />
            <Route path="/raporlar" element={<ReportsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

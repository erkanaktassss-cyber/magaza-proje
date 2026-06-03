import { redirect } from 'next/navigation';
import { AdminTables } from '@/components/production/AdminTables';
import { AIAssistant } from '@/components/production/AIAssistant';
import { LineCards } from '@/components/production/LineCards';
import { SummaryPanel } from '@/components/production/SummaryPanel';
import { currentUser } from '@/lib/auth';

export default async function AdminPage() {
  const user = await currentUser();
  if (!user) redirect('/login');
  return (
    <main className="container admin-page">
      <div className="system-bar panel">
        <div><strong>Admin Paneli</strong><span>{user.name} · {user.role}</span></div>
        <nav><a href="/">Dashboard</a><a href="/api/production-orders">Üretim API</a></nav>
      </div>
      <div className="top-grid"><div><LineCards /></div><SummaryPanel /></div>
      <AdminTables />
      <div className="admin-assistant"><AIAssistant /></div>
    </main>
  );
}

import { PrismaClient } from '@prisma/client';
import { pbkdf2Sync } from 'crypto';

const prisma = new PrismaClient();
const hashPassword = (password, salt = 'elite-demo-salt') => `${salt}:${pbkdf2Sync(password, salt, 120000, 32, 'sha256').toString('hex')}`;

async function main() {
  await prisma.user.upsert({ where: { email: 'admin@eliteproduction.ai' }, update: {}, create: { email: 'admin@eliteproduction.ai', name: 'Admin Kullanıcı', role: 'ADMIN', passwordHash: hashPassword('Admin123!') } });
  const lines = [
    ['line-filling-1', 'Dolum Hattı 1', 'Çalışıyor', 2420],
    ['line-labeling', 'Etiketleme Hattı', 'Uyarı', 1930],
    ['line-packaging', 'Paketleme Hattı', 'Optimum', 2870]
  ];
  for (const [id, name, status, speed] of lines) await prisma.productionLine.upsert({ where: { id }, update: { status, speed }, create: { id, name, status, speed } });
  await prisma.productionOrder.upsert({ where: { id: 'PO-24061' }, update: {}, create: { id: 'PO-24061', product: 'Premium Köpüklü Dolum 500 ml', planned: 30000, produced: 24860, good: 24411, scrap: 449, status: 'RUNNING', dueDate: new Date('2026-06-03'), lineId: 'line-filling-1' } });
  await prisma.productionOrder.upsert({ where: { id: 'PO-24062' }, update: {}, create: { id: 'PO-24062', product: 'Etiketli Seri A', planned: 18000, produced: 12240, good: 11763, scrap: 477, status: 'WARNING', dueDate: new Date('2026-06-03'), lineId: 'line-labeling' } });
  await prisma.productionOrder.upsert({ where: { id: 'PO-24063' }, update: {}, create: { id: 'PO-24063', product: 'Koli Paket 12li', planned: 9000, produced: 8250, good: 8160, scrap: 90, status: 'RUNNING', dueDate: new Date('2026-06-04'), lineId: 'line-packaging' } });
  await prisma.stopEvent.upsert({ where: { id: 'ST-101' }, update: {}, create: { id: 'ST-101', lineId: 'line-labeling', reason: 'Senkron farkı', minutes: 28, severity: 'HIGH', shift: 'A', startedAt: new Date('2026-06-03T07:35:00Z') } });
  await prisma.scrapRecord.upsert({ where: { id: 'SC-501' }, update: {}, create: { id: 'SC-501', lineId: 'line-labeling', category: 'Etiket kayması', quantity: 312, rate: 3.9, action: 'Sensör hizalama kontrolü' } });
  await prisma.qualityCheck.upsert({ where: { id: 'QC-711' }, update: {}, create: { id: 'QC-711', orderId: 'PO-24061', metric: 'Dolum hacmi', result: 'Geçti', cpk: 1.42, owner: 'Kalite Ekibi' } });
  await prisma.maintenanceTask.upsert({ where: { id: 'MT-330' }, update: {}, create: { id: 'MT-330', asset: 'Dolum Pompası P-01', type: 'Kestirimci', dueAt: new Date(Date.now() + 16 * 60 * 60 * 1000), risk: 'Orta', mtbf: '122 saat', mttr: '38 dk' } });
}

main().finally(async () => prisma.$disconnect());

import { dashboard, demoUser } from './production-data';
import { hashPassword } from './auth';

type PrismaClientLike = {
  user: { findUnique: (args: unknown) => Promise<any> };
  productionOrder: { findMany: (args?: unknown) => Promise<any[]> };
  stopEvent: { findMany: (args?: unknown) => Promise<any[]> };
  scrapRecord: { findMany: (args?: unknown) => Promise<any[]> };
  qualityCheck: { findMany: (args?: unknown) => Promise<any[]> };
  maintenanceTask: { findMany: (args?: unknown) => Promise<any[]> };
};

declare global { var elitePrisma: PrismaClientLike | undefined; }

function loadPrisma(): PrismaClientLike | null {
  if (!process.env.DATABASE_URL) return null;
  if (global.elitePrisma) return global.elitePrisma;
  const dynamicRequire = eval('require') as NodeRequire;
  const prismaPackage = dynamicRequire('@prisma/client') as { PrismaClient: new () => PrismaClientLike };
  global.elitePrisma = new prismaPackage.PrismaClient();
  return global.elitePrisma;
}

export async function findUserByEmail(email: string) {
  if (email === demoUser.email) {
    return { ...demoUser, passwordHash: hashPassword(demoUser.password) };
  }
  const prisma = loadPrisma();
  if (!prisma) return null;
  return prisma.user.findUnique({ where: { email } });
}

export async function getDashboardData() {
  const prisma = loadPrisma();
  if (!prisma) return dashboard;
  const [productionOrders, stops, scrapRecords, qualityChecks, maintenanceTasks] = await Promise.all([
    prisma.productionOrder.findMany({ orderBy: { createdAt: 'desc' }, take: 8 }),
    prisma.stopEvent.findMany({ orderBy: { startedAt: 'desc' }, take: 8 }),
    prisma.scrapRecord.findMany({ orderBy: { createdAt: 'desc' }, take: 8 }),
    prisma.qualityCheck.findMany({ orderBy: { createdAt: 'desc' }, take: 8 }),
    prisma.maintenanceTask.findMany({ orderBy: { dueAt: 'asc' }, take: 8 })
  ]);
  return { ...dashboard, productionOrders, stops, scrapRecords, qualityChecks, maintenanceTasks };
}

export async function listResource(name: keyof typeof dashboard) {
  const data = await getDashboardData();
  return data[name];
}

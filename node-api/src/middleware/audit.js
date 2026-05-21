import { prisma } from '../prisma.js';
export async function auditLog(userId, module, action, payload = null) {
  await prisma.systemLog.create({ data: { userId, module, action, payload } });
}

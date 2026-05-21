import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('Admin123!', 10);
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: { username: 'admin', fullName: 'MES Admin', passwordHash: hash, role: Role.ADMIN }
  });
}

main().finally(() => prisma.$disconnect());

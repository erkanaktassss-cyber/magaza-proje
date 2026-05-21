import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { prisma } from '../prisma.js';
import { auditLog } from '../middleware/audit.js';

const router = Router();

router.post('/orders', auth(['ADMIN', 'PRODUCTION']), async (req, res) => {
  const order = await prisma.productionOrder.create({ data: req.body });
  await auditLog(req.user.sub, 'production', 'create_order', order);
  res.json(order);
});

router.post('/orders/:id/lab-decision', auth(['LAB', 'QUALITY']), async (req, res) => {
  const { status, additiveTaskOpen } = req.body;
  const order = await prisma.productionOrder.update({ where: { id: req.params.id }, data: { labApprovalStatus: status, additiveTaskOpen: !!additiveTaskOpen } });
  await auditLog(req.user.sub, 'lab', 'lab_decision', { id: order.id, status });
  res.json(order);
});

router.post('/orders/:id/filling', auth(['ADMIN', 'PRODUCTION']), async (req, res) => {
  const po = await prisma.productionOrder.findUnique({ where: { id: req.params.id } });
  if (!po) return res.status(404).json({ message: 'Üretim emri bulunamadı' });
  if (po.labApprovalStatus !== 'APPROVED') return res.status(400).json({ message: 'Lab onayı olmayan ürün doluma açılamaz.' });
  if (po.additiveTaskOpen) return res.status(400).json({ message: 'İlave tamamlanmadan tekrar lab onayı açılamaz/doluma geçilemez.' });
  const filling = await prisma.fillingOrder.create({ data: { fillNo: req.body.fillNo, productionOrderId: po.id } });
  await auditLog(req.user.sub, 'filling', 'create_filling_order', filling);
  res.json(filling);
});

router.get('/dashboard', auth(), async (_req, res) => {
  const [orders, fills, logs] = await Promise.all([
    prisma.productionOrder.count(),
    prisma.fillingOrder.count(),
    prisma.systemLog.findMany({ orderBy: { createdAt: 'desc' }, take: 10 })
  ]);
  res.json({ orders, fills, recentLogs: logs });
});

export default router;

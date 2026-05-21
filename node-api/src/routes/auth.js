import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma.js';
const router = Router();
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) return res.status(401).json({ message: 'Hatalı giriş' });
  const token = jwt.sign({ sub: user.id, role: user.role, name: user.fullName }, process.env.JWT_SECRET || 'mes-secret', { expiresIn: '12h' });
  res.json({ token, user: { id: user.id, fullName: user.fullName, role: user.role } });
});
export default router;

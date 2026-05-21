import jwt from 'jsonwebtoken';

export const auth = (roles = []) => (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Token gerekli' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'mes-secret');
    if (roles.length && !roles.includes(payload.role)) return res.status(403).json({ message: 'Yetkisiz' });
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ message: 'Geçersiz token' });
  }
};

import jwt from 'jsonwebtoken';

export function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'unauthorized' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    next();
  } catch (e) {
    res.status(401).json({ error: 'unauthorized' });
  }
}

import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  try {
    await User.create({ username, password: hash });
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ error: 'user exists' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ error: 'invalid' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: 'invalid' });
  const token = jwt.sign({ id: user._id, username }, process.env.JWT_SECRET || 'secret');
  res.json({ token });
});

export default router;

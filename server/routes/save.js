import express from 'express';
import Savegame from '../models/Savegame.js';
import { auth } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  const saves = await Savegame.find({ userId: req.user.id });
  res.json(saves);
});

router.post('/', auth, async (req, res) => {
  const { data } = req.body;
  const save = await Savegame.create({ userId: req.user.id, data });
  res.json(save);
});

router.delete('/:id', auth, async (req, res) => {
  await Savegame.deleteOne({ _id: req.params.id, userId: req.user.id });
  res.json({ ok: true });
});

export default router;

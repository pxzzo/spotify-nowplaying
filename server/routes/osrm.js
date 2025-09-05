import express from 'express';
import { route } from '../lib/osrmClient.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { from, to } = req.query;
  if (!from || !to) return res.status(400).json({ error: 'bad request' });
  const [fromLat, fromLng] = from.split(',').map(Number);
  const [toLat, toLng] = to.split(',').map(Number);
  const data = await route({ lat: fromLat, lng: fromLng }, { lat: toLat, lng: toLng });
  res.json(data);
});

export default router;

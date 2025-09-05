import express from 'express';
import { fetchStations } from '../lib/overpassClient.js';
import { apiLimiter } from '../middlewares/rateLimit.js';

const router = express.Router();

const filters = {
  fire: 'amenity=fire_station',
  ems: 'emergency=ambulance_station',
  police: 'amenity=police'
};

router.get('/:type', apiLimiter, async (req, res) => {
  const { bbox } = req.query;
  const { type } = req.params;
  const filter = filters[type];
  if (!bbox || !filter) return res.status(400).json({ error: 'bad request' });
  const data = await fetchStations(bbox, filter);
  res.json(data || { elements: [] });
});

export default router;

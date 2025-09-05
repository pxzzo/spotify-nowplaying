import fetch from 'node-fetch';

const OSRM_URL = process.env.OSRM_URL || 'https://router.project-osrm.org';

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const toRad = deg => deg * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export async function route(from, to) {
  const url = `${OSRM_URL}/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=false`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch(url, { signal: controller.signal });
=======
  try {
    const res = await fetch(url, { timeout: 5000 });

    if (!res.ok) throw new Error('osrm');
    const data = await res.json();
    const { distance, duration } = data.routes[0];
    return { distance, duration };
  } catch (e) {
    const distance = haversine(from.lat, from.lng, to.lat, to.lng);

    const speed = 50; // km/h fallback
    const duration = (distance / 1000) / speed * 3600;
    return { distance, duration };
  } finally {
    clearTimeout(timer);
=======
    const speed = 50; // km/h
    const duration = (distance / 1000) / speed * 3600;
    return { distance, duration };

  }
}

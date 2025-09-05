import { API_BASE } from '../config.js';

export async function estimate(from, to, speedKmh = 60) {
  try {
    const res = await fetch(`${API_BASE}/osrm?from=${from.lat},${from.lng}&to=${to.lat},${to.lng}`);
    return await res.json();
  } catch (e) {
    const R = 6371e3;
    const toRad = deg => deg * Math.PI / 180;
    const dLat = toRad(to.lat - from.lat);
    const dLon = toRad(to.lng - from.lng);
    const a = Math.sin(dLat/2)**2 + Math.cos(toRad(from.lat))*Math.cos(toRad(to.lat))*Math.sin(dLon/2)**2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return { distance, duration: (distance / 1000) / speedKmh * 3600 };
  }
}

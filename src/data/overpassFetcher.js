import { API_BASE } from '../config.js';

export async function fetchStations(type, bbox) {
  try {
    const res = await fetch(`${API_BASE}/overpass/${type}?bbox=${bbox}`);
    return await res.json();
  } catch (e) {
    return null;
  }
}

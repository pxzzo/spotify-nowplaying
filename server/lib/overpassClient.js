import fetch from 'node-fetch';
import { get, set } from './cache.js';

const OVERPASS_URL = process.env.OVERPASS_URL || 'https://overpass-api.de/api/interpreter';

export async function fetchStations(bbox, filter) {
  const query = `[out:json];node[${filter}](${bbox});out;`;
  const cached = get(query);
  if (cached) return cached;
  try {
    const url = `${OVERPASS_URL}?data=${encodeURIComponent(query)}`;
    const res = await fetch(url, { timeout: 10000 });
    const json = await res.json();
    set(query, json);
    return json;
  } catch (e) {
    return null;
  }
}

import { state, addMission } from '../data/repository.js';
import { emit } from '../core/eventBus.js';

const categories = [
  {
    id: 'brand_klein',
    label: 'Brand klein',
    needs: [{ capability: 'brand', count: 1 }],
    duration: 5 * 60 * 1000
  },
  {
    id: 'rtw_einsatz',
    label: 'Akute Erkrankung',
    needs: [{ capability: 'patient', count: 1 }],
    duration: 5 * 60 * 1000
  },
  {
    id: 'polizei_lage',
    label: 'Polizeilage',
    needs: [{ capability: 'polizei', count: 1 }],
    duration: 5 * 60 * 1000
  }
];

function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

function nextDelay() {
  const now = new Date();
  const hour = now.getHours();
  const week = now.getDay();
  let base = 15 * 60 * 1000; // 15 min
  if (hour >= 7 && hour <= 18) base *= 0.5; // more during day
  if (week === 0 || week === 6) base *= 1.2; // weekends a bit less
  return randomInRange(base * 0.5, base * 1.5);
}

function randomCoords() {
  const stations = state.stations;
  if (stations.length === 0) return { lat: 50, lng: 10 };
  const s = stations[Math.floor(Math.random() * stations.length)];
  const lat = s.lat + randomInRange(-0.05, 0.05);
  const lng = s.lng + randomInRange(-0.05, 0.05);
  return { lat, lng };
}

export function startNotrufGenerator() {
  schedule();
}

function schedule() {
  const delay = nextDelay();
  setTimeout(() => {
    const cat = categories[Math.floor(Math.random() * categories.length)];
    const { lat, lng } = randomCoords();
    const mission = {
      id: 'm-' + Date.now(),
      category: cat.label,
      lat,
      lng,
      needs: cat.needs,
      duration: cat.duration,
      status: 'neu'
    };
    addMission(mission);
    emit('mission:new', mission);
    schedule();
  }, delay);
}


import { state, load } from '../data/repository.js';
import { fetchStations } from '../data/overpassFetcher.js';
import { importJson } from '../data/jsonImporter.js';

export async function initMap() {
  const app = document.getElementById('app');
  app.innerHTML = '<div id="map" class="h-96"></div><input type="file" id="upload" class="mt-2" />';
  const map = L.map('map').setView([51.3, 10.1], 6);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
  }).addTo(map);

  document.getElementById('upload').addEventListener('change', async e => {
    const data = await importJson(e.target.files[0]).catch(() => null);
    if (data) { load(data); render(); }
  });

  function render() {
    state.stations.forEach(s => {
      L.marker([s.lat, s.lng]).addTo(map).bindPopup(s.name);
    });
    state.vehicles.forEach(v => {
      if (v.lat && v.lng) L.circleMarker([v.lat, v.lng]).addTo(map).bindPopup(v.kind);
    });
  }

  const demo = await fetch('demo.json').then(r => r.json()).catch(() => null);
  if (demo) { load(demo); render(); }
}

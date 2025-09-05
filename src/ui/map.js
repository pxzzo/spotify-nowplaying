import { state, load } from '../data/repository.js';
import { importJson } from '../data/jsonImporter.js';
import { on } from '../core/eventBus.js';

let map;
const vehicleMarkers = new Map();
const missionMarkers = new Map();
=======
import { fetchStations } from '../data/overpassFetcher.js';
import { importJson } from '../data/jsonImporter.js';

export async function initMap() {
  const app = document.getElementById('app');
  app.innerHTML = '<div id="map" class="h-96"></div><input type="file" id="upload" class="mt-2" />';
  map = L.map('map').setView([51.3, 10.1], 6);
=======
  const map = L.map('map').setView([51.3, 10.1], 6);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
  }).addTo(map);

  document.getElementById('upload').addEventListener('change', async e => {
    const data = await importJson(e.target.files[0]).catch(() => null);
    if (data) { load(data); renderAll(); }
  });

  on('state:update', () => renderAll());
  on('mission:new', m => addMissionMarker(m));
  on('tick', () => updateVehicleMarkers());

  const demo = await fetch('demo.json').then(r => r.json()).catch(() => null);
  if (demo) { load(demo); renderAll(); }
}

function renderAll() {
  renderStations();
  renderVehicles();
  renderMissions();
}

function renderStations() {
  state.stations.forEach(s => {
    if (!s._marker) {
      s._marker = L.marker([s.lat, s.lng]).addTo(map).bindPopup(s.name);
    } else {
      s._marker.setLatLng([s.lat, s.lng]);
    }
  });
}

function renderVehicles() {
  state.vehicles.forEach(v => {
    let marker = vehicleMarkers.get(v.id);
    if (!marker) {
      marker = L.circleMarker([v.lat, v.lng], { color: statusColor(v.status) }).addTo(map).bindPopup(v.kind);
      vehicleMarkers.set(v.id, marker);
    } else {
      marker.setStyle({ color: statusColor(v.status) });
      marker.setLatLng([v.lat, v.lng]);
    }
  });
}

function renderMissions() {
  // remove resolved
  missionMarkers.forEach((marker, id) => {
    const mission = state.missions.find(m => m.id === id);
    if (!mission || mission.status === 'abgeschlossen') {
      map.removeLayer(marker);
      missionMarkers.delete(id);
    }
  });
  state.missions.forEach(m => {
    if (!missionMarkers.has(m.id)) {
      const marker = L.marker([m.lat, m.lng], { icon: L.icon({ iconUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-icon.png', iconAnchor: [12, 41] }) }).addTo(map).bindPopup(m.category);
      missionMarkers.set(m.id, marker);
    }
  });
}

function addMissionMarker(m) {
  if (!missionMarkers.has(m.id)) {
    const marker = L.marker([m.lat, m.lng]).addTo(map).bindPopup(m.category);
    missionMarkers.set(m.id, marker);
  }
}

function updateVehicleMarkers() {
  state.vehicles.forEach(v => {
    const marker = vehicleMarkers.get(v.id);
    if (marker) marker.setLatLng([v.lat, v.lng]);
  });
}

function statusColor(status) {
  switch (status) {
    case 'S3': return 'orange';
    case 'S4': return 'red';
    case 'S8': return 'yellow';
    default: return 'green';
  }
}

=======
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

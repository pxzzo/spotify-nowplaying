import { emit } from '../core/eventBus.js';

const STORAGE_KEY = 'leitstelle_state';

export const state = {
  stations: [],
  vehicles: [],
  missions: []
};

export function load(data) {
  state.stations = data.stations || [];
  state.vehicles = data.vehicles || [];
  state.missions = data.missions || [];
  save();
  emit('state:update');
}

export function restore() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      const data = JSON.parse(raw);
      state.stations = data.stations || [];
      state.vehicles = data.vehicles || [];
      state.missions = data.missions || [];
      emit('state:update');
    } catch {}
  }
}

export function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function addMission(mission) {
  state.missions.push(mission);
  save();
  emit('state:update');
}

export function updateVehicle(vehicle) {
  const idx = state.vehicles.findIndex(v => v.id === vehicle.id);
  if (idx >= 0) {
    state.vehicles[idx] = vehicle;
    save();
    emit('state:update');
  }
}

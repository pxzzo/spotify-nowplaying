import { on, emit } from '../core/eventBus.js';
import { state, updateVehicle, save } from '../data/repository.js';
import { routing } from '../routing/adapter.js';

export function initMissionEngine() {
  on('tick', step);
}

function step(dt) {
  state.vehicles.forEach(v => {
    if (v.move) {
      v.move.progress += dt;
      const ratio = v.move.progress / v.move.duration;
      if (ratio >= 1) {
        v.lat = v.move.to.lat;
        v.lng = v.move.to.lng;
        if (v.move.onArrive === 'mission') {
          v.status = 'S4';
          const mission = state.missions.find(m => m.id === v.move.missionId);
          if (mission) {
            mission.status = 'abgeschlossen';
            save();
            emit('state:update');
          }
          setTimeout(() => {
            returnToStation(v);
          }, v.move.missionDuration || 3000);
        } else {
          v.status = 'S1';
        }
        v.move = null;
        updateVehicle(v);
      } else {
        v.lat = v.move.from.lat + (v.move.to.lat - v.move.from.lat) * ratio;
        v.lng = v.move.from.lng + (v.move.to.lng - v.move.from.lng) * ratio;
      }
    }
  });
}

export async function sendVehicle(vehicle, { lat, lng, missionId, onArrive }) {
  const from = { lat: vehicle.lat, lng: vehicle.lng };
  const to = { lat, lng };
  const route = await routing.estimate(from, to, vehicle.speedKmh);
  vehicle.move = {
    from,
    to,
    duration: route.duration * 1000,
    progress: 0,
    missionId,
    onArrive,
    missionDuration: route.duration * 500 // arbitrary
  };
  updateVehicle(vehicle);
}

function returnToStation(vehicle) {
  const station = state.stations.find(s => s.id === vehicle.stationId);
  if (!station) {
    vehicle.status = 'S1';
    updateVehicle(vehicle);
    return;
  }
  vehicle.status = 'S8';
  sendVehicle(vehicle, { lat: station.lat, lng: station.lng, onArrive: 'home' });
}


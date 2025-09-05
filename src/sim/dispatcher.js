import { state, updateVehicle } from '../data/repository.js';
import { on } from '../core/eventBus.js';
import { sendVehicle } from './missionEngine.js';

function selectVehicles(mission) {
  const selected = [];
  mission.needs.forEach(need => {
    const avail = state.vehicles.filter(v =>
      (v.status === 'S1' || v.status === 'S2') &&
      v.capabilities?.includes(need.capability) &&
      !selected.includes(v)
    );
    for (let i = 0; i < need.count && i < avail.length; i++) {
      selected.push(avail[i]);
    }
  });
  return selected;
}

async function dispatch(mission) {
  const vehicles = selectVehicles(mission);
  vehicles.forEach(v => {
    v.status = 'S3';
    sendVehicle(v, { lat: mission.lat, lng: mission.lng, missionId: mission.id, onArrive: 'mission' });
    updateVehicle(v);
  });
  mission.assigned = vehicles.map(v => v.id);
}

export function initDispatcher() {
  on('mission:new', dispatch);
}


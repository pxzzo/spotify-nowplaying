
import { state } from '../data/repository.js';
import { on } from '../core/eventBus.js';

export function initPanels() {
  const missionsDiv = document.createElement('div');
  missionsDiv.id = 'missions';
  missionsDiv.className = 'm-2 p-2 border max-w-md';

  const vehiclesDiv = document.createElement('div');
  vehiclesDiv.id = 'vehicles';
  vehiclesDiv.className = 'm-2 p-2 border max-w-md';

  document.body.append(missionsDiv, vehiclesDiv);

  function render() {
    missionsDiv.innerHTML = '<h2 class="font-bold">Einsätze</h2>' +
      state.missions.map(m => `<div>${m.category} - ${m.status}</div>`).join('');
    vehiclesDiv.innerHTML = '<h2 class="font-bold">Fahrzeuge</h2>' +
      state.vehicles.map(v => `<div>${v.id} - ${v.status}</div>`).join('');
  }

  render();
  on('state:update', render);
=======
export function initPanels() {
  // UI panels placeholder
}

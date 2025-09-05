export const state = {
  stations: [],
  vehicles: []
};

export function load(data) {
  state.stations = data.stations || [];
  state.vehicles = data.vehicles || [];
}

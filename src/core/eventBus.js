const listeners = {};

export function on(evt, fn) {
  (listeners[evt] = listeners[evt] || []).push(fn);
}

export function emit(evt, data) {
  (listeners[evt] || []).forEach(fn => fn(data));
}

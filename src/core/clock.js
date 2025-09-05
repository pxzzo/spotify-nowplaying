import { emit } from './eventBus.js';

let speed = 1;
export function setSpeed(s) { speed = s; }
let last = Date.now();

export function start() {
  function tick() {
    const now = Date.now();
    const delta = (now - last) * speed;
    last = now;
    emit('tick', delta);
    requestAnimationFrame(tick);
  }
  tick();
}

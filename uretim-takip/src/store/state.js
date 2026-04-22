import { loadState, saveState, resetState } from '../services/storageService.js';

let state = loadState();
const listeners = new Set();

export function getState() {
  return state;
}

export function setState(mutator) {
  mutator(state);
  saveState(state);
  listeners.forEach((fn) => fn(state));
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function resetAll() {
  state = resetState();
  saveState(state);
  listeners.forEach((fn) => fn(state));
}

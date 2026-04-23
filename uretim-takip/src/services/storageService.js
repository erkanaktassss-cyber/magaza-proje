import { sampleState } from '../data/sampleData';
const KEY = 'fabrika_os_state_v1';
export const storageService = {
  load() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : sampleState;
    } catch {
      return sampleState;
    }
  },
  save(state) {
    localStorage.setItem(KEY, JSON.stringify(state));
  },
  reset() {
    localStorage.setItem(KEY, JSON.stringify(sampleState));
    return sampleState;
  }
};

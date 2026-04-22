import { SAMPLE_STATE } from '../data/sampleData.js';

const STORAGE_KEY = 'fabrika_pro_suite_v1';

export function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return structuredClone(SAMPLE_STATE);
  try {
    const parsed = JSON.parse(raw);
    return {
      ...structuredClone(SAMPLE_STATE),
      ...parsed,
      meta: { ...SAMPLE_STATE.meta, ...(parsed.meta || {}) }
    };
  } catch {
    return structuredClone(SAMPLE_STATE);
  }
}

export function saveState(state) {
  state.meta.lastUpdated = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function resetState() {
  localStorage.removeItem(STORAGE_KEY);
  return structuredClone(SAMPLE_STATE);
}

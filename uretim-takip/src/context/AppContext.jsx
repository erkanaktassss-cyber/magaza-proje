import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { storageService } from '../services/storageService';
import { uid } from '../utils/calculations';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [state, setState] = useState(storageService.load());
  const [search, setSearch] = useState('');

  useEffect(() => storageService.save(state), [state]);

  const actions = useMemo(() => ({
    reset: () => setState(storageService.reset()),
    addLine: (line) => setState((s) => ({ ...s, lines: [...s.lines, { ...line, id: uid(), order: s.lines.length + 1 }] })),
    updateLine: (id, payload) => setState((s) => ({ ...s, lines: s.lines.map((l) => (l.id === id ? { ...l, ...payload } : l)) })),
    deleteLine: (id) => setState((s) => ({ ...s, lines: s.lines.filter((l) => l.id !== id) })),
    reorderLine: (id, dir) => setState((s) => {
      const lines = [...s.lines].sort((a, b) => a.order - b.order);
      const i = lines.findIndex((l) => l.id === id);
      const j = dir === 'up' ? i - 1 : i + 1;
      if (i < 0 || j < 0 || j >= lines.length) return s;
      [lines[i], lines[j]] = [lines[j], lines[i]];
      return { ...s, lines: lines.map((l, idx) => ({ ...l, order: idx + 1 })) };
    }),
    saveProduction: (payload) => setState((s) => ({ ...s, lines: s.lines.map((l) => (l.id === payload.lineId ? { ...l, ...payload.data, status: payload.data.actual > 0 ? 'running' : 'idle' } : l)) })),
    startDowntime: ({ lineId, reason, type }) => setState((s) => ({ ...s, downtimes: [...s.downtimes, { id: uid(), lineId, reason, type, startAt: new Date().toISOString(), endAt: null }], lines: s.lines.map((l) => (l.id === lineId ? { ...l, status: 'stopped', lastDowntimeReason: reason } : l)) })),
    endDowntime: (lineId) => setState((s) => {
      const active = [...s.downtimes].reverse().find((d) => d.lineId === lineId && !d.endAt);
      if (!active) return s;
      const endAt = new Date().toISOString();
      const mins = (new Date(endAt) - new Date(active.startAt)) / 60000;
      return {
        ...s,
        downtimes: s.downtimes.map((d) => (d.id === active.id ? { ...d, endAt, durationMin: mins } : d)),
        lines: s.lines.map((l) => (l.id === lineId ? { ...l, status: 'running', downtimeTotal: l.downtimeTotal + mins } : l))
      };
    },
    addKaizen: (item) => setState((s) => ({ ...s, kaizens: [{ id: uid(), ...item, createdAt: new Date().toISOString().slice(0, 10) }, ...s.kaizens] })),
    updateKaizenStatus: (id, status) => setState((s) => ({ ...s, kaizens: s.kaizens.map((k) => (k.id === id ? { ...k, status } : k)) })),
    addFiveS: (entry) => setState((s) => ({ ...s, fiveS: [...s.fiveS, { id: uid(), ...entry, date: new Date().toISOString().slice(0, 10) }] })),
    addFmea: (entry) => setState((s) => ({ ...s, fmea: [{ id: uid(), ...entry }, ...s.fmea] })),
    saveSettings: (settings) => setState((s) => ({ ...s, settings }))
  }), []);

  return <AppContext.Provider value={{ state, actions, search, setSearch }}>{children}</AppContext.Provider>;
};

export const useApp = () => useContext(AppContext);

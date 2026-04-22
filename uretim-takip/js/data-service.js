(function () {
  const STORAGE_KEY = "fabrika_os_v4";

  const STATUS_COLORS = { iyi: "good", orta: "warn", dusuk: "bad" };

  const uid = (prefix = "id") => `${prefix}_${Math.random().toString(36).slice(2, 7)}_${Date.now().toString(36)}`;
  const nowIso = () => new Date().toISOString();
  const pct = (a, b) => (!b ? 0 : Math.max(0, Math.round((a / b) * 100)));
  const clamp = (value, min, max) => Math.max(min, Math.min(max, Number(value) || min));
  const minutesDiff = (start, end) => Math.max(1, Math.round((new Date(end) - new Date(start)) / 60000));
  const todayStr = () => new Date().toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric", weekday: "long" });

  function createLine(name, group, seed = {}) {
    return {
      id: uid("line"),
      name,
      group,
      operator: seed.operator || "",
      shift: seed.shift || "1. Vardiya",
      target: seed.target || 1000,
      actual: seed.actual || 0,
      goodCount: seed.goodCount || 0,
      idealCycleSec: seed.idealCycleSec || 3,
      plannedProductionMin: seed.plannedProductionMin || 480,
      downtime: {
        totalMin: seed.totalStop || 0,
        active: null,
        logs: seed.logs || []
      }
    };
  }

  function defaultState() {
    return {
      meta: { createdAt: nowIso(), lastUpdated: nowIso() },
      integration: {
        source: "manuel",
        delta: { ip: "192.168.1.10", port: 502, counter: "D100", run: "M10", alarm: "M20" },
        lastMockRun: null
      },
      downtimeReasons: ["arıza", "malzeme bekleme", "kalite kontrol", "ayar", "enerji kesintisi"],
      lines: [
        createLine("Dolum Hattı A", "dolum", { operator: "Ahmet Usta", shift: "1. Vardiya", target: 1400, actual: 1180, goodCount: 1140, totalStop: 34, logs: [{ id: uid("stop"), start: nowIso(), end: nowIso(), type: "plansiz", reason: "arıza", minutes: 22 }] }),
        createLine("Dolum Hattı B", "dolum", { operator: "Merve Kaya", shift: "2. Vardiya", target: 1300, actual: 1205, goodCount: 1180, totalStop: 20, logs: [{ id: uid("stop"), start: nowIso(), end: nowIso(), type: "planli", reason: "ayar", minutes: 12 }] }),
        createLine("Paketleme Hattı A", "paketleme", { operator: "Özgür Demir", shift: "1. Vardiya", target: 1600, actual: 1240, goodCount: 1185, totalStop: 58, logs: [{ id: uid("stop"), start: nowIso(), end: nowIso(), type: "plansiz", reason: "malzeme bekleme", minutes: 31 }] }),
        createLine("Paketleme Hattı B", "paketleme", { operator: "Selin Nur", shift: "3. Vardiya", target: 1500, actual: 1460, goodCount: 1420, totalStop: 14, logs: [{ id: uid("stop"), start: nowIso(), end: nowIso(), type: "planli", reason: "kalite kontrol", minutes: 9 }] }),
        createLine("Yardımcı Hat", "diger", { operator: "Kerem İşler", shift: "1. Vardiya", target: 600, actual: 480, goodCount: 462, totalStop: 17, logs: [{ id: uid("stop"), start: nowIso(), end: nowIso(), type: "plansiz", reason: "enerji kesintisi", minutes: 7 }] })
      ],
      kaizens: [
        { id: uid("kaizen"), title: "Kapak besleme standardı", owner: "İpek Arslan", status: "uygulandı", gainTime: 18, gainCost: 12500, gainQuality: 7 },
        { id: uid("kaizen"), title: "Setup SMED iyileştirmesi", owner: "Can Alkan", status: "incelemede", gainTime: 25, gainCost: 18000, gainQuality: 4 }
      ],
      fiveS: [
        { id: uid("5s"), department: "Dolum Alanı", seiri: 86, seiton: 82, seiso: 79, seiketsu: 84, shitsuke: 81 },
        { id: uid("5s"), department: "Paketleme Alanı", seiri: 78, seiton: 73, seiso: 75, seiketsu: 77, shitsuke: 72 }
      ],
      fmea: [
        { id: uid("fmea"), process: "Dolum", type: "Yetersiz dolum", effect: "Ağırlık dışı ürün", cause: "Valf gecikmesi", s: 8, o: 5, d: 4, rpn: 160, owner: "Kalite Müh.", targetDate: "2026-05-05", status: "aksiyonda" },
        { id: uid("fmea"), process: "Paketleme", type: "Etiket kayması", effect: "Müşteri şikayeti", cause: "Sensör sapması", s: 7, o: 4, d: 5, rpn: 140, owner: "Bakım", targetDate: "2026-05-02", status: "açık" }
      ],
      weeklyOeeHistory: []
    };
  }

  function lineOee(line) {
    const planned = Math.max(1, line.plannedProductionMin);
    const availability = Math.max(0, (planned - line.downtime.totalMin) / planned);
    const performance = Math.max(0, Math.min(1, (line.actual * line.idealCycleSec) / (planned * 60)));
    const quality = line.actual > 0 ? Math.max(0, Math.min(1, line.goodCount / line.actual)) : 1;
    const oee = availability * performance * quality;
    return {
      availability: Math.round(availability * 100),
      performance: Math.round(performance * 100),
      quality: Math.round(quality * 100),
      oee: Math.round(oee * 100)
    };
  }

  function oeeClass(score) {
    if (score >= 75) return "iyi";
    if (score >= 55) return "orta";
    return "dusuk";
  }

  function loadState() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    try {
      const parsed = JSON.parse(raw);
      return {
        ...defaultState(),
        ...parsed,
        integration: { ...defaultState().integration, ...(parsed.integration || {}) },
        lines: Array.isArray(parsed.lines) && parsed.lines.length ? parsed.lines : defaultState().lines
      };
    } catch {
      return defaultState();
    }
  }

  function saveState(state) {
    state.meta.lastUpdated = nowIso();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  window.DataService = {
    STORAGE_KEY,
    STATUS_COLORS,
    uid,
    nowIso,
    pct,
    clamp,
    minutesDiff,
    todayStr,
    createLine,
    defaultState,
    lineOee,
    oeeClass,
    loadState,
    saveState
  };
})();

(function () {
  const { pct } = window.DataService;

  function totalDowntimeByLine(state) {
    return state.lines.map((line) => ({ name: line.name, total: line.downtime.totalMin })).sort((a, b) => b.total - a.total);
  }

  function topDowntimeReasons(state) {
    const map = new Map();
    state.lines.forEach((line) => line.downtime.logs.forEach((log) => map.set(log.reason, (map.get(log.reason) || 0) + 1)));
    return [...map.entries()].map(([reason, count]) => ({ reason, count })).sort((a, b) => b.count - a.count);
  }

  function weakestLine(state) {
    if (!state.lines.length) return null;
    return [...state.lines].map((line) => ({ ...line, efficiency: pct(line.actual, line.target || 1) })).sort((a, b) => a.efficiency - b.efficiency)[0];
  }

  function highestFmeaRisk(state) {
    if (!state.fmea.length) return null;
    return [...state.fmea].sort((a, b) => b.rpn - a.rpn)[0];
  }

  function fiveSAvg(item) {
    return Math.round((item.seiri + item.seiton + item.seiso + item.seiketsu + item.shitsuke) / 5);
  }

  function lowestFiveS(state) {
    if (!state.fiveS.length) return null;
    return [...state.fiveS].sort((a, b) => fiveSAvg(a) - fiveSAvg(b))[0];
  }

  function aiRespond(state, question) {
    const q = question.toLowerCase();
    if (q.includes("zayıf") || q.includes("en zayıf")) {
      const line = weakestLine(state);
      return line ? `En zayıf hat ${line.name}. Verim oranı ${pct(line.actual, line.target)}%.` : "Hat verisi yok.";
    }
    if (q.includes("duruş") && q.includes("neden")) {
      const top = topDowntimeReasons(state)[0];
      return top ? `En sık duruş nedeni: ${top.reason} (${top.count} tekrar).` : "Duruş kaydı yok.";
    }
    if (q.includes("kaizen") && q.includes("hangi")) {
      const line = weakestLine(state);
      return line ? `Kaizen önceliği için önerilen hat: ${line.name}.` : "Öneri için veri yok.";
    }
    if (q.includes("fmea") || q.includes("kritik risk")) {
      const risk = highestFmeaRisk(state);
      return risk ? `En kritik FMEA riski: ${risk.process} / ${risk.type}, RPN ${risk.rpn}.` : "FMEA kaydı yok.";
    }
    if (q.includes("5s") || q.includes("en düşük")) {
      const low = lowestFiveS(state);
      return low ? `En düşük 5S puanı: ${low.department} (ortalama ${fiveSAvg(low)}).` : "5S kaydı yok.";
    }
    return "Üretim Analiz Motoru: OEE, duruş, kaizen, 5S ve FMEA sorularını analiz edebilirim.";
  }

  window.AnalyticsEngine = {
    totalDowntimeByLine,
    topDowntimeReasons,
    weakestLine,
    highestFmeaRisk,
    fiveSAvg,
    lowestFiveS,
    aiRespond
  };
})();

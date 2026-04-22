const STORAGE_KEY = "fabrika_os_v3";

const STATUS_COLORS = { iyi: "good", orta: "warn", dusuk: "bad" };

function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 7)}_${Date.now().toString(36)}`;
}

function nowIso() { return new Date().toISOString(); }

function todayStr() {
  return new Date().toLocaleDateString("tr-TR", {
    day: "2-digit", month: "long", year: "numeric", weekday: "long"
  });
}

function pct(a, b) { return !b ? 0 : Math.max(0, Math.round((a / b) * 100)); }

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, Number(value) || min));
}

function minutesDiff(start, end) {
  return Math.max(1, Math.round((new Date(end) - new Date(start)) / 60000));
}

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

let state = loadState();

function saveState() {
  state.meta.lastUpdated = nowIso();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getLine(id) { return state.lines.find((line) => line.id === id); }

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

function totalDowntimeByLine() {
  return state.lines.map((line) => ({ name: line.name, total: line.downtime.totalMin })).sort((a, b) => b.total - a.total);
}

function topDowntimeReasons() {
  const map = new Map();
  state.lines.forEach((line) => line.downtime.logs.forEach((log) => map.set(log.reason, (map.get(log.reason) || 0) + 1)));
  return [...map.entries()].map(([reason, count]) => ({ reason, count })).sort((a, b) => b.count - a.count);
}

function weakestLine() {
  if (!state.lines.length) return null;
  return [...state.lines].map((line) => ({ ...line, efficiency: pct(line.actual, line.target || 1) })).sort((a, b) => a.efficiency - b.efficiency)[0];
}

function highestFmeaRisk() {
  if (!state.fmea.length) return null;
  return [...state.fmea].sort((a, b) => b.rpn - a.rpn)[0];
}

function fiveSAvg(item) {
  return Math.round((item.seiri + item.seiton + item.seiso + item.seiketsu + item.shitsuke) / 5);
}

function lowestFiveS() {
  if (!state.fiveS.length) return null;
  return [...state.fiveS].sort((a, b) => fiveSAvg(a) - fiveSAvg(b))[0];
}

function bindTabs() {
  document.querySelectorAll(".menu-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".menu-btn").forEach((item) => item.classList.remove("active"));
      document.querySelectorAll(".tab").forEach((tab) => tab.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(`tab-${btn.dataset.tab}`).classList.add("active");
    });
  });
}

function lineCard(line) {
  const o = lineOee(line);
  const efficiency = pct(line.actual, line.target);
  const badge = STATUS_COLORS[oeeClass(o.oee)];
  const activeStop = line.downtime.active ? `${line.downtime.active.type} / ${line.downtime.active.reason}` : "Çalışıyor";
  const lastReason = line.downtime.logs.at(-1)?.reason || "-";

  return `
    <article class="line-card">
      <div class="section-head">
        <h4>${line.name}</h4>
        <span class="badge ${badge}">OEE ${o.oee}%</span>
      </div>
      <div class="kpi">
        <span>Tip <strong>${line.group}</strong></span>
        <span>Operatör <strong>${line.operator || "-"}</strong></span>
        <span>Vardiya <strong>${line.shift}</strong></span>
        <span>Hedef <strong>${line.target}</strong></span>
        <span>Gerçekleşen <strong>${line.actual}</strong></span>
        <span>Verim <strong>${efficiency}%</strong></span>
        <span>Duruş Durumu <strong>${activeStop}</strong></span>
        <span>Son Sebep <strong>${lastReason}</strong></span>
      </div>
      <div class="inline-actions top-gap">
        <input data-action="rename" data-id="${line.id}" value="${line.name}" />
        <select data-action="group" data-id="${line.id}">
          <option value="dolum" ${line.group === "dolum" ? "selected" : ""}>Dolum</option>
          <option value="paketleme" ${line.group === "paketleme" ? "selected" : ""}>Paketleme</option>
          <option value="diger" ${line.group === "diger" ? "selected" : ""}>Diğer</option>
        </select>
        <button class="btn" data-action="update" data-id="${line.id}">Kaydet</button>
        <button class="btn btn-danger" data-action="delete" data-id="${line.id}">Sil</button>
      </div>
      <div class="form-grid top-gap">
        <label>Operatör<input data-action="operator" data-id="${line.id}" value="${line.operator}" /></label>
        <label>Vardiya
          <select data-action="shift" data-id="${line.id}">
            <option ${line.shift === "1. Vardiya" ? "selected" : ""}>1. Vardiya</option>
            <option ${line.shift === "2. Vardiya" ? "selected" : ""}>2. Vardiya</option>
            <option ${line.shift === "3. Vardiya" ? "selected" : ""}>3. Vardiya</option>
          </select>
        </label>
        <label>Hedef<input type="number" min="0" data-action="target" data-id="${line.id}" value="${line.target}" /></label>
        <label>Gerçekleşen<input type="number" min="0" data-action="actual" data-id="${line.id}" value="${line.actual}" /></label>
        <label>Sağlam Ürün<input type="number" min="0" data-action="good" data-id="${line.id}" value="${line.goodCount}" /></label>
      </div>
    </article>
  `;
}

function renderLineManagement() {
  document.getElementById("lineCards").innerHTML = state.lines.map(lineCard).join("");

  document.querySelectorAll("[data-action='update']").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const line = getLine(id);
      if (!line) return;
      const newName = document.querySelector(`[data-action='rename'][data-id='${id}']`).value.trim();
      const newGroup = document.querySelector(`[data-action='group'][data-id='${id}']`).value;
      if (!newName) return alert("Hat adı zorunludur.");
      line.name = newName;
      line.group = newGroup;
      saveState();
      renderAll();
    });
  });

  document.querySelectorAll("[data-action='delete']").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (state.lines.length <= 1) return alert("En az bir hat kalmalıdır.");
      state.lines = state.lines.filter((line) => line.id !== btn.dataset.id);
      saveState();
      renderAll();
    });
  });

  ["operator", "shift", "target", "actual", "good"].forEach((field) => {
    document.querySelectorAll(`[data-action='${field}']`).forEach((input) => {
      input.addEventListener("change", () => {
        const line = getLine(input.dataset.id);
        if (!line) return;
        if (field === "operator") line.operator = input.value.trim();
        if (field === "shift") line.shift = input.value;
        if (field === "target") line.target = Math.max(0, Number(input.value) || 0);
        if (field === "actual") line.actual = Math.max(0, Number(input.value) || 0);
        if (field === "good") line.goodCount = clamp(input.value, 0, line.actual || 999999);
        saveState();
        renderAll();
      });
    });
  });
}

function renderTvDashboard() {
  document.getElementById("tvGrid").innerHTML = state.lines.map((line) => {
    const o = lineOee(line);
    const efficiency = pct(line.actual, line.target);
    const status = line.downtime.active ? "bad" : efficiency >= 100 ? "good" : "warn";
    return `
      <article class="tv-card ${status}">
        <h4>${line.name}</h4>
        <p>Hedef / Gerçekleşen: <strong>${line.target} / ${line.actual}</strong></p>
        <p>Verim: <strong>${efficiency}%</strong> • OEE: <strong>${o.oee}%</strong></p>
        <p>Duruş Durumu: <strong>${line.downtime.active ? "Duruşta" : "Çalışıyor"}</strong></p>
        <p>Son Duruş Sebebi: <strong>${line.downtime.logs.at(-1)?.reason || "-"}</strong></p>
      </article>
    `;
  }).join("");

  const risk = highestFmeaRisk();
  document.getElementById("criticalRiskCard").innerHTML = risk
    ? `<h4>En Kritik FMEA Riski</h4><p><strong>${risk.process} / ${risk.type}</strong></p><p>RPN: <strong>${risk.rpn}</strong> • Sorumlu: ${risk.owner || "-"}</p><p>Hedef: ${risk.targetDate || "-"}</p>`
    : "<h4>En Kritik FMEA Riski</h4><p>Kayıt bulunmuyor.</p>";

  const weak = weakestLine();
  document.getElementById("weakLineCard").innerHTML = weak
    ? `<h4>Kaizen Öncelikli Hat</h4><p><strong>${weak.name}</strong></p><p>Verim: <strong>${pct(weak.actual, weak.target)}%</strong></p><p>Toplam Duruş: ${weak.downtime.totalMin} dk</p>`
    : "<h4>Kaizen Öncelikli Hat</h4><p>Veri yok.</p>";
}

function renderOee() {
  document.getElementById("oeeCards").innerHTML = state.lines.map((line) => {
    const o = lineOee(line);
    const cls = STATUS_COLORS[oeeClass(o.oee)];
    return `
      <article class="line-card">
        <div class="section-head"><h4>${line.name}</h4><span class="badge ${cls}">${o.oee}%</span></div>
        <div class="kpi">
          <span>Availability <strong>${o.availability}%</strong></span>
          <span>Performance <strong>${o.performance}%</strong></span>
          <span>Quality <strong>${o.quality}%</strong></span>
          <span>OEE <strong>${o.oee}%</strong></span>
        </div>
      </article>
    `;
  }).join("");

  document.getElementById("dailyOeeList").innerHTML = state.lines.map((line) => {
    const o = lineOee(line);
    return `<div class="list-item"><strong>${line.name}</strong> • Günlük OEE: ${o.oee}% (A:${o.availability} P:${o.performance} Q:${o.quality})</div>`;
  }).join("");

  if (!state.weeklyOeeHistory.length) {
    const base = state.lines.map((line) => ({ name: line.name, score: lineOee(line).oee }));
    state.weeklyOeeHistory = Array.from({ length: 7 }, (_, i) => {
      const dayName = new Date(Date.now() - (6 - i) * 86400000).toLocaleDateString("tr-TR", { weekday: "short" });
      const avg = Math.round(base.reduce((acc, x) => acc + clamp(x.score + (i - 3) * 2, 30, 95), 0) / (base.length || 1));
      return { day: dayName, avg };
    });
    saveState();
  }

  document.getElementById("weeklyOeeChart").innerHTML = state.weeklyOeeHistory.map((item) => `
    <div class="bar-row">
      <span>${item.day}</span>
      <span class="bar"><i style="width:${item.avg}%"></i></span>
      <strong>${item.avg}%</strong>
    </div>
  `).join("");
}

function populateLineAndReasonSelects() {
  document.getElementById("stopLineSelect").innerHTML = state.lines.map((line) => `<option value="${line.id}">${line.name}</option>`).join("");
  document.getElementById("stopReasonSelect").innerHTML = state.downtimeReasons.map((r) => `<option value="${r}">${r}</option>`).join("");

  document.getElementById("reasonChips").innerHTML = state.downtimeReasons.map((reason, idx) => `<span class="chip">${reason}<button data-reason-index="${idx}">×</button></span>`).join("");
  document.querySelectorAll("[data-reason-index]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (state.downtimeReasons.length <= 1) return;
      state.downtimeReasons.splice(Number(btn.dataset.reasonIndex), 1);
      saveState();
      renderAll();
    });
  });
}

function renderDowntime() {
  document.getElementById("stopLineRanking").innerHTML = totalDowntimeByLine().map((x) => `<div class="list-item"><strong>${x.name}</strong> • ${x.total} dk</div>`).join("");
  document.getElementById("stopReasonRanking").innerHTML = topDowntimeReasons().map((x) => `<div class="list-item"><strong>${x.reason}</strong> • ${x.count} tekrar</div>`).join("") || "<div class='list-item'>Kayıt yok</div>";
}

function renderKaizen() {
  document.getElementById("kaizenTable").innerHTML = state.kaizens.map((k) => `
    <tr>
      <td>${k.title}</td>
      <td>${k.owner}</td>
      <td>${k.status}</td>
      <td>${k.gainTime} dk/gün</td>
      <td>${k.gainCost} ₺/ay</td>
      <td>${k.gainQuality}%</td>
      <td><button class="btn btn-danger" data-kaizen-id="${k.id}">Sil</button></td>
    </tr>
  `).join("");

  document.querySelectorAll("[data-kaizen-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.kaizens = state.kaizens.filter((item) => item.id !== btn.dataset.kaizenId);
      saveState();
      renderAll();
    });
  });
}

function renderFiveS() {
  document.getElementById("fiveSChart").innerHTML = state.fiveS.map((item) => {
    const avg = fiveSAvg(item);
    return `<div class="bar-row"><span>${item.department}</span><span class="bar"><i style="width:${avg}%"></i></span><strong>${avg}</strong></div>`;
  }).join("") || "<div class='list-item'>5S kaydı bulunmuyor.</div>";

  const missing = [];
  state.fiveS.forEach((item) => {
    ["seiri", "seiton", "seiso", "seiketsu", "shitsuke"].forEach((key) => {
      if (item[key] < 80) missing.push(`${item.department} • ${key.toUpperCase()} (${item[key]})`);
    });
  });
  document.getElementById("fiveSMissing").innerHTML = missing.map((x) => `<div class="list-item">${x}</div>`).join("") || "<div class='list-item'>Eksik alan yok.</div>";
}

function renderFmea() {
  const sorted = [...state.fmea].sort((a, b) => b.rpn - a.rpn);
  document.getElementById("fmeaTable").innerHTML = sorted.map((f) => `
    <tr>
      <td>${f.process}</td><td>${f.type}</td><td>${f.effect}</td><td>${f.cause}</td><td>${f.s}</td><td>${f.o}</td><td>${f.d}</td><td>${f.rpn}</td><td>${f.owner || "-"}</td><td>${f.targetDate || "-"}</td><td>${f.status}</td>
    </tr>
  `).join("");
}

function renderAiSignals() {
  const weak = weakestLine();
  const topReason = topDowntimeReasons()[0];
  const risk = highestFmeaRisk();
  const low5s = lowestFiveS();
  document.getElementById("analysisSignals").innerHTML = `
    <div class="signal">En zayıf hat: <strong>${weak?.name || "-"}</strong></div>
    <div class="signal">En çok duruş: <strong>${topReason?.reason || "-"}</strong></div>
    <div class="signal">Kritik FMEA: <strong>${risk ? `${risk.type} (${risk.rpn})` : "-"}</strong></div>
    <div class="signal">En düşük 5S: <strong>${low5s?.department || "-"}</strong></div>
  `;
}

function aiRespond(question) {
  const q = question.toLowerCase();
  if (q.includes("zayıf") || q.includes("en zayıf")) {
    const line = weakestLine();
    return line ? `En zayıf hat ${line.name}. Verim oranı ${pct(line.actual, line.target)}%.` : "Hat verisi yok.";
  }
  if (q.includes("duruş") && q.includes("neden")) {
    const top = topDowntimeReasons()[0];
    return top ? `En sık duruş nedeni: ${top.reason} (${top.count} tekrar).` : "Duruş kaydı yok.";
  }
  if (q.includes("kaizen") && q.includes("hangi")) {
    const line = weakestLine();
    return line ? `Kaizen önceliği için önerilen hat: ${line.name}.` : "Öneri için veri yok.";
  }
  if (q.includes("fmea") || q.includes("kritik risk")) {
    const risk = highestFmeaRisk();
    return risk ? `En kritik FMEA riski: ${risk.process} / ${risk.type}, RPN ${risk.rpn}.` : "FMEA kaydı yok.";
  }
  if (q.includes("5s") || q.includes("en düşük")) {
    const low = lowestFiveS();
    return low ? `En düşük 5S puanı: ${low.department} (ortalama ${fiveSAvg(low)}).` : "5S kaydı yok.";
  }
  return "Üretim Analiz Motoru: OEE, duruş, kaizen, 5S ve FMEA sorularını analiz edebilirim.";
}

function addChatMessage(type, text) {
  const node = document.createElement("div");
  node.className = `msg ${type}`;
  node.textContent = text;
  const box = document.getElementById("chatBox");
  box.appendChild(node);
  box.scrollTop = box.scrollHeight;
}

function reports() {
  const totalTarget = state.lines.reduce((acc, l) => acc + l.target, 0);
  const totalActual = state.lines.reduce((acc, l) => acc + l.actual, 0);
  const avgOee = Math.round(state.lines.reduce((acc, l) => acc + lineOee(l).oee, 0) / (state.lines.length || 1));
  return {
    daily: `Günlük Üretim Raporu\nTarih: ${todayStr()}\nToplam Hedef: ${totalTarget}\nToplam Gerçekleşen: ${totalActual}\nVerim: ${pct(totalActual, totalTarget)}%`,
    shift: `Vardiya Raporu\n${state.lines.map((l) => `${l.name} • ${l.shift} • Operatör: ${l.operator || "-"}`).join("\n")}`,
    oee: `OEE Raporu\n${state.lines.map((l) => `${l.name}: ${lineOee(l).oee}%`).join("\n")}\nOrtalama OEE: ${avgOee}%`,
    stop: `Duruş Raporu\n${totalDowntimeByLine().map((d) => `${d.name}: ${d.total} dk`).join("\n")}`,
    kaizen: `Kaizen Raporu\nToplam: ${state.kaizens.length}\nUygulanan: ${state.kaizens.filter((k) => k.status === "uygulandı").length}`,
    fmea: `FMEA Raporu\nToplam kayıt: ${state.fmea.length}\nKritik (RPN>=150): ${state.fmea.filter((f) => f.rpn >= 150).length}`
  };
}

function exportCsv() {
  const headers = ["Hat", "Tip", "Hedef", "Gerçekleşen", "Verim", "Duruş", "OEE", "Vardiya", "Operatör"];
  const rows = state.lines.map((l) => [l.name, l.group, l.target, l.actual, pct(l.actual, l.target), l.downtime.totalMin, lineOee(l).oee, l.shift, l.operator]);
  const csv = [headers, ...rows].map((r) => r.join(";")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `uretim-rapor-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
}

function exportExcel() {
  const rows = state.lines.map((l) => `<tr><td>${l.name}</td><td>${l.group}</td><td>${l.target}</td><td>${l.actual}</td><td>${pct(l.actual, l.target)}%</td><td>${lineOee(l).oee}%</td></tr>`).join("");
  const table = `<table><tr><th>Hat</th><th>Tip</th><th>Hedef</th><th>Gerçekleşen</th><th>Verim</th><th>OEE</th></tr>${rows}</table>`;
  const blob = new Blob([`<html><body>${table}</body></html>`], { type: "application/vnd.ms-excel" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `uretim-rapor-${new Date().toISOString().slice(0, 10)}.xls`;
  a.click();
}

function renderIntegration() {
  document.getElementById("integrationStatus").textContent = `Kaynak: ${state.integration.source.toUpperCase()}`;
  document.getElementById("dataSourceType").value = state.integration.source;
  document.getElementById("deltaIp").value = state.integration.delta.ip || "";
  document.getElementById("deltaPort").value = state.integration.delta.port || "";
  document.getElementById("deltaCounter").value = state.integration.delta.counter || "";
  document.getElementById("deltaRun").value = state.integration.delta.run || "";
  document.getElementById("deltaAlarm").value = state.integration.delta.alarm || "";

  const isDelta = state.integration.source === "delta";
  document.getElementById("deltaSettings").style.opacity = isDelta ? "1" : "0.5";

  document.getElementById("integrationSummary").innerHTML = `
    <div class="list-item"><strong>Aktif Kaynak:</strong> ${state.integration.source}</div>
    <div class="list-item"><strong>Delta IP:</strong> ${state.integration.delta.ip || "-"}</div>
    <div class="list-item"><strong>Port:</strong> ${state.integration.delta.port || "-"}</div>
    <div class="list-item"><strong>Sayaç / Run / Alarm:</strong> ${state.integration.delta.counter || "-"} / ${state.integration.delta.run || "-"} / ${state.integration.delta.alarm || "-"}</div>
    <div class="list-item"><strong>Son Mock Veri:</strong> ${state.integration.lastMockRun ? new Date(state.integration.lastMockRun).toLocaleString("tr-TR") : "Henüz yok"}</div>
  `;
}

function simulateDataFlow() {
  state.lines.forEach((line) => {
    const increment = Math.floor(Math.random() * 22);
    line.actual += increment;
    line.goodCount = Math.max(0, line.actual - Math.floor(Math.random() * 8));
  });
  state.integration.lastMockRun = nowIso();
  saveState();
  renderAll();
}

function bindActions() {
  document.getElementById("todayInfo").textContent = todayStr();

  document.getElementById("tvModeBtn").addEventListener("click", () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
  });

  document.getElementById("resetBtn").addEventListener("click", () => {
    if (!confirm("Tüm veriler sıfırlanacak. Emin misiniz?")) return;
    localStorage.removeItem(STORAGE_KEY);
    state = defaultState();
    saveState();
    renderAll();
  });

  document.getElementById("addLineBtn").addEventListener("click", () => {
    const name = document.getElementById("lineNameInput").value.trim();
    const group = document.getElementById("lineGroupInput").value;
    if (!name) return alert("Hat adı giriniz.");
    state.lines.push(createLine(name, group));
    document.getElementById("lineNameInput").value = "";
    saveState();
    renderAll();
  });

  document.getElementById("addReasonBtn").addEventListener("click", () => {
    const value = document.getElementById("newReasonInput").value.trim().toLowerCase();
    if (!value) return;
    if (!state.downtimeReasons.includes(value)) state.downtimeReasons.push(value);
    document.getElementById("newReasonInput").value = "";
    saveState();
    renderAll();
  });

  document.getElementById("startStopBtn").addEventListener("click", () => {
    const line = getLine(document.getElementById("stopLineSelect").value);
    if (!line) return;
    if (line.downtime.active) return alert("Seçili hatta aktif duruş var.");
    line.downtime.active = {
      id: uid("stop"),
      start: nowIso(),
      type: document.getElementById("stopTypeSelect").value,
      reason: document.getElementById("stopReasonSelect").value
    };
    saveState();
    renderAll();
  });

  document.getElementById("endStopBtn").addEventListener("click", () => {
    const line = getLine(document.getElementById("stopLineSelect").value);
    if (!line?.downtime.active) return alert("Aktif duruş kaydı yok.");
    const end = nowIso();
    const min = minutesDiff(line.downtime.active.start, end);
    line.downtime.logs.push({ ...line.downtime.active, end, minutes: min });
    line.downtime.totalMin += min;
    line.downtime.active = null;
    saveState();
    renderAll();
  });

  document.getElementById("addKaizenBtn").addEventListener("click", () => {
    const title = document.getElementById("kaizenTitle").value.trim();
    const owner = document.getElementById("kaizenOwner").value.trim();
    if (!title || !owner) return alert("Başlık ve öneri sahibi zorunlu.");
    state.kaizens.push({
      id: uid("kaizen"),
      title,
      owner,
      status: document.getElementById("kaizenStatus").value,
      gainTime: Math.max(0, Number(document.getElementById("gainTime").value) || 0),
      gainCost: Math.max(0, Number(document.getElementById("gainCost").value) || 0),
      gainQuality: Math.max(0, Number(document.getElementById("gainQuality").value) || 0)
    });
    document.getElementById("kaizenTitle").value = "";
    document.getElementById("kaizenOwner").value = "";
    saveState();
    renderAll();
  });

  document.getElementById("addFiveSBtn").addEventListener("click", () => {
    const department = document.getElementById("fiveSDept").value.trim();
    if (!department) return alert("Bölüm adı zorunlu.");
    state.fiveS.push({
      id: uid("5s"),
      department,
      seiri: clamp(document.getElementById("seiriInput").value, 0, 100),
      seiton: clamp(document.getElementById("seitonInput").value, 0, 100),
      seiso: clamp(document.getElementById("seisoInput").value, 0, 100),
      seiketsu: clamp(document.getElementById("seiketsuInput").value, 0, 100),
      shitsuke: clamp(document.getElementById("shitsukeInput").value, 0, 100)
    });
    document.getElementById("fiveSDept").value = "";
    saveState();
    renderAll();
  });

  document.getElementById("addFmeaBtn").addEventListener("click", () => {
    const process = document.getElementById("fmeaProcess").value.trim();
    const type = document.getElementById("fmeaType").value.trim();
    if (!process || !type) return alert("Proses ve hata türü zorunlu.");
    const s = clamp(document.getElementById("fmeaS").value, 1, 10);
    const o = clamp(document.getElementById("fmeaO").value, 1, 10);
    const d = clamp(document.getElementById("fmeaD").value, 1, 10);
    state.fmea.push({
      id: uid("fmea"),
      process,
      type,
      effect: document.getElementById("fmeaEffect").value.trim(),
      cause: document.getElementById("fmeaCause").value.trim(),
      s,
      o,
      d,
      rpn: s * o * d,
      owner: document.getElementById("fmeaOwner").value.trim(),
      targetDate: document.getElementById("fmeaTarget").value,
      status: document.getElementById("fmeaStatus").value
    });
    ["fmeaProcess", "fmeaType", "fmeaEffect", "fmeaCause", "fmeaOwner", "fmeaTarget"].forEach((id) => document.getElementById(id).value = "");
    saveState();
    renderAll();
  });

  document.getElementById("askAiBtn").addEventListener("click", () => {
    const input = document.getElementById("aiInput");
    const question = input.value.trim();
    if (!question) return;
    addChatMessage("user", question);
    addChatMessage("ai", aiRespond(question));
    input.value = "";
  });

  const reportOutput = document.getElementById("reportOutput");
  document.getElementById("dailyReportBtn").addEventListener("click", () => reportOutput.textContent = reports().daily);
  document.getElementById("shiftReportBtn").addEventListener("click", () => reportOutput.textContent = reports().shift);
  document.getElementById("oeeReportBtn").addEventListener("click", () => reportOutput.textContent = reports().oee);
  document.getElementById("stopReportBtn").addEventListener("click", () => reportOutput.textContent = reports().stop);
  document.getElementById("kaizenReportBtn").addEventListener("click", () => reportOutput.textContent = reports().kaizen);
  document.getElementById("fmeaReportBtn").addEventListener("click", () => reportOutput.textContent = reports().fmea);
  document.getElementById("csvExportBtn").addEventListener("click", exportCsv);
  document.getElementById("excelExportBtn").addEventListener("click", exportExcel);

  document.getElementById("saveIntegrationBtn").addEventListener("click", () => {
    state.integration.source = document.getElementById("dataSourceType").value;
    state.integration.delta.ip = document.getElementById("deltaIp").value.trim();
    state.integration.delta.port = Number(document.getElementById("deltaPort").value) || "";
    state.integration.delta.counter = document.getElementById("deltaCounter").value.trim();
    state.integration.delta.run = document.getElementById("deltaRun").value.trim();
    state.integration.delta.alarm = document.getElementById("deltaAlarm").value.trim();
    saveState();
    renderAll();
    alert("Entegrasyon ayarları kaydedildi.");
  });

  document.getElementById("dataSourceType").addEventListener("change", (e) => {
    state.integration.source = e.target.value;
    saveState();
    renderIntegration();
  });

  document.getElementById("simulateDataBtn").addEventListener("click", simulateDataFlow);
}

function renderAll() {
  renderLineManagement();
  renderTvDashboard();
  renderOee();
  populateLineAndReasonSelects();
  renderDowntime();
  renderKaizen();
  renderFiveS();
  renderFmea();
  renderAiSignals();
  renderIntegration();
}

bindTabs();
bindActions();
renderAll();
addChatMessage("ai", "Üretim Analiz Motoru aktif. OEE, duruş, kaizen, 5S ve FMEA sorularınızı sorabilirsiniz.");

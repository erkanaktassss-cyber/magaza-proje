const STORAGE_KEY = "fabrika_os_v2";

const STATUS_COLORS = {
  iyi: "good",
  orta: "warn",
  dusuk: "bad"
};

function nowIso() {
  return new Date().toISOString();
}

function todayStr() {
  return new Date().toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    weekday: "long"
  });
}

function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}_${Date.now().toString(36)}`;
}

function pct(a, b) {
  if (!b) return 0;
  return Math.max(0, Math.round((a / b) * 100));
}

function minutesDiff(start, end) {
  return Math.max(1, Math.round((new Date(end) - new Date(start)) / 60000));
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, Number(value) || min));
}

function defaultState() {
  return {
    meta: { createdAt: nowIso(), lastUpdated: nowIso() },
    downtimeReasons: ["arıza", "malzeme bekleme", "kalite kontrol", "ayar", "temizlik"],
    lines: [
      createLine("Dolum Hattı 1", "dolum"),
      createLine("Dolum Hattı 2", "dolum"),
      createLine("Paketleme Hattı 1", "paketleme"),
      createLine("Paketleme Hattı 2", "paketleme")
    ],
    kaizens: [],
    fiveS: [],
    fmea: [],
    weeklyOeeHistory: []
  };
}

function createLine(name, group) {
  return {
    id: uid("line"),
    name,
    group,
    operator: "",
    shift: "1. Vardiya",
    target: 1000,
    actual: 0,
    goodCount: 0,
    idealCycleSec: 3,
    plannedProductionMin: 480,
    downtime: {
      totalMin: 0,
      active: null,
      logs: []
    }
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
      lines: Array.isArray(parsed.lines) ? parsed.lines : defaultState().lines
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

function getLine(id) {
  return state.lines.find((line) => line.id === id);
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

function totalDowntimeByLine() {
  return state.lines
    .map((line) => ({ name: line.name, total: line.downtime.totalMin }))
    .sort((a, b) => b.total - a.total);
}

function topDowntimeReasons() {
  const map = new Map();
  state.lines.forEach((line) => {
    line.downtime.logs.forEach((log) => {
      map.set(log.reason, (map.get(log.reason) || 0) + 1);
    });
  });
  return [...map.entries()].map(([reason, count]) => ({ reason, count })).sort((a, b) => b.count - a.count);
}

function lowestFiveS() {
  if (!state.fiveS.length) return null;
  const withAvg = state.fiveS.map((item) => ({
    ...item,
    score: Math.round((item.seiri + item.seiton + item.seiso + item.seiketsu + item.shitsuke) / 5)
  }));
  return withAvg.sort((a, b) => a.score - b.score)[0];
}

function highestFmeaRisk() {
  if (!state.fmea.length) return null;
  return [...state.fmea].sort((a, b) => b.rpn - a.rpn)[0];
}

function weakestLine() {
  if (!state.lines.length) return null;
  return [...state.lines]
    .map((line) => ({ ...line, efficiency: pct(line.actual, line.target || 1) }))
    .sort((a, b) => a.efficiency - b.efficiency)[0];
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
  const efficiency = pct(line.actual, line.target);
  const oeeData = lineOee(line);
  const scoreClass = STATUS_COLORS[oeeClass(oeeData.oee)];
  return `
    <article class="line-card">
      <div class="section-head">
        <h4>${line.name}</h4>
        <span class="badge ${scoreClass}">OEE ${oeeData.oee}%</span>
      </div>
      <div class="kpi">
        <span>Grup <strong>${line.group}</strong></span>
        <span>Vardiya <strong>${line.shift}</strong></span>
        <span>Operatör <strong>${line.operator || "-"}</strong></span>
        <span>Hedef <strong>${line.target}</strong></span>
        <span>Gerçekleşen <strong>${line.actual}</strong></span>
        <span>Verim <strong>${efficiency}%</strong></span>
        <span>Duruş <strong>${line.downtime.totalMin} dk</strong></span>
        <span>Son Sebep <strong>${line.downtime.logs.at(-1)?.reason || "-"}</strong></span>
      </div>
      <div class="inline-actions top-gap">
        <input data-action="rename" data-id="${line.id}" value="${line.name}" />
        <button class="btn" data-action="update" data-id="${line.id}">Güncelle</button>
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
        <label>Günlük Hedef<input type="number" min="0" data-action="target" data-id="${line.id}" value="${line.target}" /></label>
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
      const value = document.querySelector(`[data-action='rename'][data-id='${id}']`).value.trim();
      if (!line || !value) return;
      line.name = value;
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
  ["operator", "shift", "target", "actual", "good"].forEach((action) => {
    document.querySelectorAll(`[data-action='${action}']`).forEach((input) => {
      input.addEventListener("change", () => {
        const line = getLine(input.dataset.id);
        if (!line) return;
        if (action === "operator") line.operator = input.value.trim();
        if (action === "shift") line.shift = input.value;
        if (action === "target") line.target = Math.max(0, Number(input.value) || 0);
        if (action === "actual") line.actual = Math.max(0, Number(input.value) || 0);
        if (action === "good") line.goodCount = clamp(input.value, 0, line.actual || 999999);
        saveState();
        renderAll();
      });
    });
  });
}

function renderTvDashboard() {
  const html = state.lines
    .map((line) => {
      const oeeData = lineOee(line);
      const eff = pct(line.actual, line.target);
      const status = line.downtime.active ? "bad" : eff >= 100 ? "good" : "warn";
      const stopReason = line.downtime.active?.reason || line.downtime.logs.at(-1)?.reason || "-";
      return `
        <article class="tv-card ${status}">
          <h4>${line.name}</h4>
          <p>Hedef / Gerçekleşen: <strong>${line.target} / ${line.actual}</strong></p>
          <p>Duruş: <strong>${line.downtime.totalMin} dk</strong></p>
          <p>Sebep: <strong>${stopReason}</strong></p>
          <p>Verim: <strong>${eff}%</strong> • OEE: <strong>${oeeData.oee}%</strong></p>
        </article>
      `;
    })
    .join("");
  document.getElementById("tvGrid").innerHTML = html;
}

function renderOee() {
  document.getElementById("oeeCards").innerHTML = state.lines
    .map((line) => {
      const o = lineOee(line);
      const cls = STATUS_COLORS[oeeClass(o.oee)];
      return `
        <article class="line-card">
          <div class="section-head">
            <h4>${line.name}</h4>
            <span class="badge ${cls}">${o.oee}%</span>
          </div>
          <div class="kpi">
            <span>Availability <strong>${o.availability}%</strong></span>
            <span>Performance <strong>${o.performance}%</strong></span>
            <span>Quality <strong>${o.quality}%</strong></span>
            <span>OEE <strong>${o.oee}%</strong></span>
          </div>
        </article>
      `;
    })
    .join("");

  document.getElementById("dailyOeeList").innerHTML = state.lines
    .map((line) => {
      const o = lineOee(line);
      return `<div class="list-item"><strong>${line.name}</strong> • Günlük OEE: ${o.oee}%</div>`;
    })
    .join("");

  if (!state.weeklyOeeHistory.length) {
    const snapshot = state.lines.map((line) => ({ name: line.name, oee: lineOee(line).oee }));
    state.weeklyOeeHistory = Array.from({ length: 7 }, (_, idx) => ({
      day: `Gün-${idx + 1}`,
      values: snapshot.map((x) => ({ ...x, oee: clamp(x.oee - (idx * 2 - 5), 30, 95) }))
    }));
  }
  document.getElementById("weeklyOeeList").innerHTML = state.weeklyOeeHistory
    .map((item) => {
      const avg = Math.round(item.values.reduce((acc, v) => acc + v.oee, 0) / (item.values.length || 1));
      return `<div class="list-item"><strong>${item.day}</strong> Ortalama OEE: ${avg}%</div>`;
    })
    .join("");
}

function populateLineSelects() {
  const options = state.lines.map((line) => `<option value="${line.id}">${line.name}</option>`).join("");
  document.getElementById("stopLineSelect").innerHTML = options;
}

function populateReasons() {
  const options = state.downtimeReasons.map((reason) => `<option value="${reason}">${reason}</option>`).join("");
  document.getElementById("stopReasonSelect").innerHTML = options;
  document.getElementById("reasonChips").innerHTML = state.downtimeReasons
    .map((reason, idx) => `<span class="chip">${reason}<button data-reason-index="${idx}">×</button></span>`)
    .join("");
  document.querySelectorAll("[data-reason-index]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (state.downtimeReasons.length <= 1) return;
      state.downtimeReasons.splice(Number(btn.dataset.reasonIndex), 1);
      saveState();
      renderAll();
    });
  });
}

function renderDowntimeReports() {
  document.getElementById("stopLineRanking").innerHTML = totalDowntimeByLine()
    .map((item) => `<div class="list-item"><strong>${item.name}</strong> • ${item.total} dk</div>`)
    .join("");
  document.getElementById("stopReasonRanking").innerHTML = topDowntimeReasons()
    .map((item) => `<div class="list-item"><strong>${item.reason}</strong> • ${item.count} kez</div>`)
    .join("") || "<div class='list-item'>Kayıt yok</div>";
}

function renderKaizen() {
  document.getElementById("kaizenTable").innerHTML = state.kaizens
    .map(
      (k) => `
      <tr>
        <td>${k.title}</td><td>${k.owner}</td><td>${k.status}</td>
        <td>${k.gainTime} dk/gün</td><td>${k.gainCost} ₺/ay</td><td>%${k.gainQuality}</td>
        <td><button class="btn btn-danger" data-kaizen-id="${k.id}">Sil</button></td>
      </tr>
    `
    )
    .join("");
  document.querySelectorAll("[data-kaizen-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.kaizens = state.kaizens.filter((item) => item.id !== btn.dataset.kaizenId);
      saveState();
      renderAll();
    });
  });
}

function fiveSAvg(item) {
  return Math.round((item.seiri + item.seiton + item.seiso + item.seiketsu + item.shitsuke) / 5);
}

function renderFiveS() {
  document.getElementById("fiveSChart").innerHTML = state.fiveS
    .map((item) => {
      const avg = fiveSAvg(item);
      return `
        <div class="bar-row">
          <span>${item.department}</span>
          <span class="bar"><i style="width:${avg}%"></i></span>
          <strong>${avg}</strong>
        </div>
      `;
    })
    .join("") || "<div class='list-item'>Henüz 5S girişi yok.</div>";

  const missing = [];
  state.fiveS.forEach((item) => {
    ["seiri", "seiton", "seiso", "seiketsu", "shitsuke"].forEach((key) => {
      if (item[key] < 80) missing.push(`${item.department} • ${key.toUpperCase()} (${item[key]})`);
    });
  });
  document.getElementById("fiveSMissing").innerHTML = missing.map((m) => `<div class="list-item">${m}</div>`).join("") || "<div class='list-item'>Eksik alan bulunmuyor.</div>";
}

function renderFmea() {
  const sorted = [...state.fmea].sort((a, b) => b.rpn - a.rpn);
  document.getElementById("fmeaTable").innerHTML = sorted
    .map(
      (f) => `
      <tr>
        <td>${f.process}</td><td>${f.type}</td><td>${f.effect}</td><td>${f.cause}</td>
        <td>${f.s}</td><td>${f.o}</td><td>${f.d}</td><td>${f.rpn}</td>
        <td>${f.owner}</td><td>${f.targetDate || "-"}</td><td>${f.status}</td>
      </tr>
    `
    )
    .join("");
}

function addChatMessage(type, text) {
  const div = document.createElement("div");
  div.className = `msg ${type}`;
  div.textContent = text;
  const box = document.getElementById("chatBox");
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

function aiRespond(question) {
  const q = question.toLowerCase();
  if (q.includes("zayıf hat") || q.includes("en zayıf")) {
    const line = weakestLine();
    if (!line) return "Henüz hat verisi bulunmuyor.";
    return `Bugün en zayıf hat: ${line.name} (Verim: ${pct(line.actual, line.target)}%).`;
  }
  if (q.includes("duruş") && q.includes("neden")) {
    const top = topDowntimeReasons()[0];
    return top ? `En çok duruş nedeni: ${top.reason} (${top.count} tekrar).` : "Duruş kaydı bulunamadı.";
  }
  if (q.includes("kaizen") && q.includes("hangi hat")) {
    const line = weakestLine();
    return line ? `Kaizen önceliği için önerilen hat: ${line.name}.` : "Önceliklendirme için veri yok.";
  }
  if (q.includes("fmea") || q.includes("risk")) {
    const risk = highestFmeaRisk();
    return risk ? `En kritik FMEA maddesi: ${risk.process} / ${risk.type}, RPN: ${risk.rpn}.` : "FMEA kaydı yok.";
  }
  if (q.includes("5s") || q.includes("en düşük bölüm")) {
    const low = lowestFiveS();
    return low ? `5S puanı en düşük bölüm: ${low.department} (Ortalama: ${fiveSAvg(low)}).` : "5S verisi bulunmuyor.";
  }
  return "Bu demo analiz motoru; hat performansı, duruş, kaizen, 5S ve FMEA ile ilgili sorular sorabilirsiniz.";
}

function generateReports() {
  const totalTarget = state.lines.reduce((acc, l) => acc + l.target, 0);
  const totalActual = state.lines.reduce((acc, l) => acc + l.actual, 0);
  const totalStop = state.lines.reduce((acc, l) => acc + l.downtime.totalMin, 0);
  const avgOee = Math.round(state.lines.reduce((acc, l) => acc + lineOee(l).oee, 0) / (state.lines.length || 1));

  return {
    daily: `Günlük Üretim Raporu\nTarih: ${todayStr()}\nToplam Hedef: ${totalTarget}\nToplam Gerçekleşen: ${totalActual}\nVerim: ${pct(totalActual, totalTarget)}%\nToplam Duruş: ${totalStop} dk`,
    weekly: `Haftalık Verimlilik (simülasyon)\nSon 7 gün ortalama OEE: ${avgOee}%\nEn iyi hat: ${[...state.lines].sort((a, b) => lineOee(b).oee - lineOee(a).oee)[0]?.name || "-"}`,
    shift: `Vardiya Raporu\n${state.lines.map((l) => `${l.name} • ${l.shift} • Operatör: ${l.operator || "-"}`).join("\n")}`,
    oee: `OEE Raporu\n${state.lines.map((l) => `${l.name}: ${lineOee(l).oee}% (A:${lineOee(l).availability}/P:${lineOee(l).performance}/Q:${lineOee(l).quality})`).join("\n")}`,
    stop: `Duruş Raporu\n${totalDowntimeByLine().map((s) => `${s.name}: ${s.total} dk`).join("\n")}\n---\nSebepler\n${topDowntimeReasons().map((r) => `${r.reason}: ${r.count}`).join("\n")}`,
    kaizen: `Kaizen Raporu\nToplam Öneri: ${state.kaizens.length}\nUygulanan: ${state.kaizens.filter((k) => k.status === "uygulandı").length}\nKabul: ${state.kaizens.filter((k) => k.status === "kabul edildi").length}`,
    fmea: `FMEA Risk Raporu\nToplam Madde: ${state.fmea.length}\nKritik (RPN >= 150): ${state.fmea.filter((f) => f.rpn >= 150).length}\nEn kritik: ${highestFmeaRisk()?.type || "-"}`
  };
}

function downloadCsv() {
  const headers = ["Hat", "Grup", "Hedef", "Gerçekleşen", "Verim", "Duruş dk", "OEE", "Vardiya", "Operatör"];
  const rows = state.lines.map((l) => [
    l.name,
    l.group,
    l.target,
    l.actual,
    pct(l.actual, l.target),
    l.downtime.totalMin,
    lineOee(l).oee,
    l.shift,
    l.operator
  ]);
  const csv = [headers, ...rows].map((r) => r.join(";")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `uretim-raporu-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
}

function bindActions() {
  document.getElementById("todayInfo").textContent = todayStr();

  document.getElementById("tvModeBtn").addEventListener("click", () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
  });

  document.getElementById("resetBtn").addEventListener("click", () => {
    if (!confirm("Tüm kayıtlar silinecek. Emin misiniz?")) return;
    localStorage.removeItem(STORAGE_KEY);
    state = defaultState();
    saveState();
    renderAll();
  });

  document.getElementById("addLineBtn").addEventListener("click", () => {
    const name = document.getElementById("lineNameInput").value.trim();
    const group = document.getElementById("lineGroupInput").value;
    if (!name) return alert("Hat adı girin.");
    state.lines.push(createLine(name, group));
    document.getElementById("lineNameInput").value = "";
    saveState();
    renderAll();
  });

  document.getElementById("addReasonBtn").addEventListener("click", () => {
    const reason = document.getElementById("newReasonInput").value.trim().toLowerCase();
    if (!reason) return;
    if (!state.downtimeReasons.includes(reason)) state.downtimeReasons.push(reason);
    document.getElementById("newReasonInput").value = "";
    saveState();
    renderAll();
  });

  document.getElementById("startStopBtn").addEventListener("click", () => {
    const line = getLine(document.getElementById("stopLineSelect").value);
    if (!line) return;
    if (line.downtime.active) return alert("Seçili hatta aktif duruş zaten var.");
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
    if (!line?.downtime.active) return alert("Aktif duruş yok.");
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
    if (!title || !owner) return alert("Başlık ve öneri sahibi zorunludur.");
    state.kaizens.push({
      id: uid("kaizen"),
      title,
      owner,
      status: document.getElementById("kaizenStatus").value,
      gainTime: Math.max(0, Number(document.getElementById("gainTime").value) || 0),
      gainCost: Math.max(0, Number(document.getElementById("gainCost").value) || 0),
      gainQuality: Math.max(0, Number(document.getElementById("gainQuality").value) || 0)
    });
    ["kaizenTitle", "kaizenOwner"].forEach((id) => (document.getElementById(id).value = ""));
    saveState();
    renderAll();
  });

  document.getElementById("addFiveSBtn").addEventListener("click", () => {
    const department = document.getElementById("fiveSDept").value.trim();
    if (!department) return alert("Bölüm adı zorunludur.");
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
    if (!process || !type) return alert("Proses ve hata türü zorunludur.");
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
    ["fmeaProcess", "fmeaType", "fmeaEffect", "fmeaCause", "fmeaOwner", "fmeaTarget"].forEach((id) => {
      document.getElementById(id).value = "";
    });
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
  document.getElementById("dailyReportBtn").addEventListener("click", () => (reportOutput.textContent = generateReports().daily));
  document.getElementById("weeklyReportBtn").addEventListener("click", () => (reportOutput.textContent = generateReports().weekly));
  document.getElementById("shiftReportBtn").addEventListener("click", () => (reportOutput.textContent = generateReports().shift));
  document.getElementById("oeeReportBtn").addEventListener("click", () => (reportOutput.textContent = generateReports().oee));
  document.getElementById("stopReportBtn").addEventListener("click", () => (reportOutput.textContent = generateReports().stop));
  document.getElementById("kaizenReportBtn").addEventListener("click", () => (reportOutput.textContent = generateReports().kaizen));
  document.getElementById("fmeaReportBtn").addEventListener("click", () => (reportOutput.textContent = generateReports().fmea));
  document.getElementById("csvExportBtn").addEventListener("click", downloadCsv);
}

function renderAll() {
  renderLineManagement();
  renderTvDashboard();
  renderOee();
  populateLineSelects();
  populateReasons();
  renderDowntimeReports();
  renderKaizen();
  renderFiveS();
  renderFmea();
}

bindTabs();
bindActions();
renderAll();
addChatMessage("ai", "Merhaba, ben FabrikaOS AI Asistanı. Üretim sorularınızı cevaplayabilirim.");

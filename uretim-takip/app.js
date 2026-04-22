(function () {
  const {
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
  } = window.DataService;

  const {
    totalDowntimeByLine,
    topDowntimeReasons,
    weakestLine,
    highestFmeaRisk,
    fiveSAvg,
    lowestFiveS,
    productionAlerts,
    aiRespond
  } = window.AnalyticsEngine;

  let state = loadState();
  let lineFilter = "";
  let oeeViewMode = "gunluk";

  const save = () => saveState(state);
  const getLine = (id) => state.lines.find((line) => line.id === id);

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
    const filtered = state.lines.filter((line) => line.name.toLowerCase().includes(lineFilter));
    document.getElementById("lineCards").innerHTML = filtered.map(lineCard).join("") || `<div class="list-item">Filtreye uygun hat bulunamadı.</div>`;

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
        save();
        renderAll();
      });
    });

    document.querySelectorAll("[data-action='delete']").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (state.lines.length <= 1) return alert("En az bir hat kalmalıdır.");
        state.lines = state.lines.filter((line) => line.id !== btn.dataset.id);
        save();
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
          save();
          renderAll();
        });
      });
    });
  }

  function renderSummary() {
    const totalTarget = state.lines.reduce((acc, l) => acc + l.target, 0);
    const totalActual = state.lines.reduce((acc, l) => acc + l.actual, 0);
    const totalStop = state.lines.reduce((acc, l) => acc + l.downtime.totalMin, 0);
    const avgOee = Math.round(state.lines.reduce((acc, l) => acc + lineOee(l).oee, 0) / (state.lines.length || 1));
    document.getElementById("summaryKpis").innerHTML = `
      <div class="kpi-tile"><span>Toplam Hedef</span><strong>${totalTarget}</strong></div>
      <div class="kpi-tile"><span>Toplam Gerçekleşen</span><strong>${totalActual}</strong></div>
      <div class="kpi-tile"><span>Genel Verim</span><strong>${pct(totalActual, totalTarget)}%</strong></div>
      <div class="kpi-tile"><span>Toplam Duruş</span><strong>${totalStop} dk</strong></div>
      <div class="kpi-tile"><span>Ortalama OEE</span><strong>${avgOee}%</strong></div>
    `;
  }

  function renderOperationAlerts() {
    const alerts = productionAlerts(state);
    document.getElementById("operationsAlerts").innerHTML = alerts.length
      ? alerts.map((alert) => `<div class="alert-item ${alert.level}"><strong>${alert.title}</strong><p>${alert.detail}</p></div>`).join("")
      : "<div class='list-item'>Kritik alarm bulunmuyor. Sistem stabil çalışıyor.</div>";
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

    const risk = highestFmeaRisk(state);
    document.getElementById("criticalRiskCard").innerHTML = risk
      ? `<h4>En Kritik FMEA Riski</h4><p><strong>${risk.process} / ${risk.type}</strong></p><p>RPN: <strong>${risk.rpn}</strong> • Sorumlu: ${risk.owner || "-"}</p><p>Hedef: ${risk.targetDate || "-"}</p>`
      : "<h4>En Kritik FMEA Riski</h4><p>Kayıt bulunmuyor.</p>";

    const weak = weakestLine(state);
    document.getElementById("weakLineCard").innerHTML = weak
      ? `<h4>Kaizen Öncelikli Hat</h4><p><strong>${weak.name}</strong></p><p>Verim: <strong>${pct(weak.actual, weak.target)}%</strong></p><p>Toplam Duruş: ${weak.downtime.totalMin} dk</p>`
      : "<h4>Kaizen Öncelikli Hat</h4><p>Veri yok.</p>";
  }

  function renderOee() {
    document.getElementById("oeeCards").innerHTML = state.lines.map((line) => {
      const o = lineOee(line);
      const adjusted = oeeViewMode === "haftalik" ? clamp(o.oee + (Math.round(Math.random() * 8) - 4), 35, 98) : o.oee;
      const cls = STATUS_COLORS[oeeClass(o.oee)];
      return `<article class="line-card"><div class="section-head"><h4>${line.name}</h4><span class="badge ${cls}">${adjusted}%</span></div><div class="kpi"><span>Availability <strong>${o.availability}%</strong></span><span>Performance <strong>${o.performance}%</strong></span><span>Quality <strong>${o.quality}%</strong></span><span>OEE <strong>${adjusted}%</strong></span></div></article>`;
    }).join("");

    document.getElementById("dailyOeeList").innerHTML = state.lines.map((line) => {
      const o = lineOee(line);
      return `<div class="list-item"><strong>${line.name}</strong> • Günlük OEE: ${o.oee}% (A:${o.availability} P:${o.performance} Q:${o.quality})</div>`;
    }).join("");

    if (!state.weeklyOeeHistory.length) {
      const base = state.lines.map((line) => lineOee(line).oee);
      state.weeklyOeeHistory = Array.from({ length: 7 }, (_, i) => ({
        day: new Date(Date.now() - (6 - i) * 86400000).toLocaleDateString("tr-TR", { weekday: "short" }),
        avg: Math.round(base.reduce((acc, score) => acc + clamp(score + (i - 3) * 2, 30, 95), 0) / (base.length || 1))
      }));
      save();
    }

    document.getElementById("weeklyOeeChart").innerHTML = state.weeklyOeeHistory
      .map((item) => `<div class="bar-row"><span>${item.day}</span><span class="bar"><i style="width:${item.avg}%"></i></span><strong>${item.avg}%</strong></div>`)
      .join("");
  }

  function populateLineAndReasonSelects() {
    document.getElementById("stopLineSelect").innerHTML = state.lines.map((line) => `<option value="${line.id}">${line.name}</option>`).join("");
    document.getElementById("stopReasonSelect").innerHTML = state.downtimeReasons.map((r) => `<option value="${r}">${r}</option>`).join("");

    document.getElementById("reasonChips").innerHTML = state.downtimeReasons.map((reason, idx) => `<span class="chip">${reason}<button data-reason-index="${idx}">×</button></span>`).join("");
    document.querySelectorAll("[data-reason-index]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (state.downtimeReasons.length <= 1) return;
        state.downtimeReasons.splice(Number(btn.dataset.reasonIndex), 1);
        save();
        renderAll();
      });
    });
  }

  function renderDowntime() {
    document.getElementById("stopLineRanking").innerHTML = totalDowntimeByLine(state).map((x) => `<div class="list-item"><strong>${x.name}</strong> • ${x.total} dk</div>`).join("");
    document.getElementById("stopReasonRanking").innerHTML = topDowntimeReasons(state).map((x) => `<div class="list-item"><strong>${x.reason}</strong> • ${x.count} tekrar</div>`).join("") || "<div class='list-item'>Kayıt yok</div>";
  }

  function renderKaizen() {
    document.getElementById("kaizenTable").innerHTML = state.kaizens.map((k) => `<tr><td>${k.title}</td><td>${k.owner}</td><td>${k.status}</td><td>${k.gainTime} dk/gün</td><td>${k.gainCost} ₺/ay</td><td>${k.gainQuality}%</td><td><button class="btn btn-danger" data-kaizen-id="${k.id}">Sil</button></td></tr>`).join("");
    document.querySelectorAll("[data-kaizen-id]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.kaizens = state.kaizens.filter((item) => item.id !== btn.dataset.kaizenId);
        save();
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
    state.fiveS.forEach((item) => ["seiri", "seiton", "seiso", "seiketsu", "shitsuke"].forEach((key) => item[key] < 80 && missing.push(`${item.department} • ${key.toUpperCase()} (${item[key]})`)));
    document.getElementById("fiveSMissing").innerHTML = missing.map((x) => `<div class="list-item">${x}</div>`).join("") || "<div class='list-item'>Eksik alan yok.</div>";
  }

  function renderFmea() {
    const sorted = [...state.fmea].sort((a, b) => b.rpn - a.rpn);
    document.getElementById("fmeaTable").innerHTML = sorted.map((f) => `<tr><td>${f.process}</td><td>${f.type}</td><td>${f.effect}</td><td>${f.cause}</td><td>${f.s}</td><td>${f.o}</td><td>${f.d}</td><td>${f.rpn}</td><td>${f.owner || "-"}</td><td>${f.targetDate || "-"}</td><td>${f.status}</td></tr>`).join("");
  }

  function renderAiSignals() {
    const weak = weakestLine(state);
    const topReason = topDowntimeReasons(state)[0];
    const risk = highestFmeaRisk(state);
    const low5s = lowestFiveS(state);
    document.getElementById("analysisSignals").innerHTML = `
      <div class="signal">En zayıf hat: <strong>${weak?.name || "-"}</strong></div>
      <div class="signal">En çok duruş: <strong>${topReason?.reason || "-"}</strong></div>
      <div class="signal">Kritik FMEA: <strong>${risk ? `${risk.type} (${risk.rpn})` : "-"}</strong></div>
      <div class="signal">En düşük 5S: <strong>${low5s?.department || "-"}</strong></div>
    `;
  }

  function addChatMessage(type, text) {
    const node = document.createElement("div");
    node.className = `msg ${type}`;
    node.textContent = text;
    const box = document.getElementById("chatBox");
    box.appendChild(node);
    box.scrollTop = box.scrollHeight;
  }

  function renderIntegration() {
    document.getElementById("integrationStatus").textContent = `Kaynak: ${state.integration.source.toUpperCase()}`;
    document.getElementById("dataSourceType").value = state.integration.source;
    document.getElementById("deltaIp").value = state.integration.delta.ip || "";
    document.getElementById("deltaPort").value = state.integration.delta.port || "";
    document.getElementById("deltaCounter").value = state.integration.delta.counter || "";
    document.getElementById("deltaRun").value = state.integration.delta.run || "";
    document.getElementById("deltaAlarm").value = state.integration.delta.alarm || "";
    document.getElementById("deltaSettings").style.opacity = state.integration.source === "delta" ? "1" : "0.5";

    document.getElementById("integrationSummary").innerHTML = `
      <div class="list-item"><strong>Aktif Kaynak:</strong> ${state.integration.source}</div>
      <div class="list-item"><strong>Delta IP:</strong> ${state.integration.delta.ip || "-"}</div>
      <div class="list-item"><strong>Port:</strong> ${state.integration.delta.port || "-"}</div>
      <div class="list-item"><strong>Sayaç / Run / Alarm:</strong> ${state.integration.delta.counter || "-"} / ${state.integration.delta.run || "-"} / ${state.integration.delta.alarm || "-"}</div>
      <div class="list-item"><strong>Son Mock Veri:</strong> ${state.integration.lastMockRun ? new Date(state.integration.lastMockRun).toLocaleString("tr-TR") : "Henüz yok"}</div>
    `;
  }

  function renderAll() {
    renderSummary();
    renderOperationAlerts();
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

  function bindActions() {
    document.getElementById("todayInfo").textContent = todayStr();

    document.getElementById("tvModeBtn").addEventListener("click", () => {
      if (!document.fullscreenElement) document.documentElement.requestFullscreen();
      else document.exitFullscreen();
    });

    document.getElementById("resetBtn").addEventListener("click", () => {
      if (!confirm("Tüm veriler sıfırlanacak. Emin misiniz?")) return;
      state = defaultState();
      save();
      renderAll();
    });

    document.getElementById("addLineBtn").addEventListener("click", () => {
      const name = document.getElementById("lineNameInput").value.trim();
      const group = document.getElementById("lineGroupInput").value;
      if (!name) return alert("Hat adı giriniz.");
      state.lines.push(createLine(name, group));
      document.getElementById("lineNameInput").value = "";
      save();
      renderAll();
    });


    document.getElementById("lineSearchInput").addEventListener("input", (e) => {
      lineFilter = e.target.value.trim().toLowerCase();
      renderLineManagement();
    });

    document.getElementById("oeeViewMode").addEventListener("change", (e) => {
      oeeViewMode = e.target.value;
      renderOee();
    });

    document.getElementById("addReasonBtn").addEventListener("click", () => {
      const value = document.getElementById("newReasonInput").value.trim().toLowerCase();
      if (!value) return;
      if (!state.downtimeReasons.includes(value)) state.downtimeReasons.push(value);
      document.getElementById("newReasonInput").value = "";
      save();
      renderAll();
    });

    document.getElementById("startStopBtn").addEventListener("click", () => {
      const line = getLine(document.getElementById("stopLineSelect").value);
      if (!line) return;
      if (line.downtime.active) return alert("Seçili hatta aktif duruş var.");
      line.downtime.active = { id: uid("stop"), start: nowIso(), type: document.getElementById("stopTypeSelect").value, reason: document.getElementById("stopReasonSelect").value };
      save();
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
      save();
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
      save();
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
      save();
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
      ["fmeaProcess", "fmeaType", "fmeaEffect", "fmeaCause", "fmeaOwner", "fmeaTarget"].forEach((id) => (document.getElementById(id).value = ""));
      save();
      renderAll();
    });

    document.getElementById("askAiBtn").addEventListener("click", () => {
      const input = document.getElementById("aiInput");
      const question = input.value.trim();
      if (!question) return;
      addChatMessage("user", question);
      addChatMessage("ai", aiRespond(state, question));
      const confidence = Math.min(98, 70 + Math.floor(Math.random() * 26));
      document.getElementById("aiConfidence").textContent = `${confidence}%`;
      input.value = "";
    });

    const reportOutput = document.getElementById("reportOutput");
    document.getElementById("dailyReportBtn").addEventListener("click", () => (reportOutput.textContent = window.ReportService.reports(state).daily));
    document.getElementById("shiftReportBtn").addEventListener("click", () => (reportOutput.textContent = window.ReportService.reports(state).shift));
    document.getElementById("oeeReportBtn").addEventListener("click", () => (reportOutput.textContent = window.ReportService.reports(state).oee));
    document.getElementById("stopReportBtn").addEventListener("click", () => (reportOutput.textContent = window.ReportService.reports(state).stop));
    document.getElementById("kaizenReportBtn").addEventListener("click", () => (reportOutput.textContent = window.ReportService.reports(state).kaizen));
    document.getElementById("fmeaReportBtn").addEventListener("click", () => (reportOutput.textContent = window.ReportService.reports(state).fmea));
    document.getElementById("csvExportBtn").addEventListener("click", () => window.ReportService.exportCsv(state));
    document.getElementById("excelExportBtn").addEventListener("click", () => window.ReportService.exportExcel(state));

    document.getElementById("saveIntegrationBtn").addEventListener("click", () => {
      state.integration.source = document.getElementById("dataSourceType").value;
      state.integration.delta.ip = document.getElementById("deltaIp").value.trim();
      state.integration.delta.port = Number(document.getElementById("deltaPort").value) || "";
      state.integration.delta.counter = document.getElementById("deltaCounter").value.trim();
      state.integration.delta.run = document.getElementById("deltaRun").value.trim();
      state.integration.delta.alarm = document.getElementById("deltaAlarm").value.trim();
      save();
      renderAll();
      alert("Entegrasyon ayarları kaydedildi.");
    });

    document.getElementById("dataSourceType").addEventListener("change", (e) => {
      state.integration.source = e.target.value;
      save();
      renderIntegration();
    });

    document.getElementById("simulateDataBtn").addEventListener("click", () => {
      state.lines.forEach((line) => {
        const increment = Math.floor(Math.random() * 22);
        line.actual += increment;
        line.goodCount = Math.max(0, line.actual - Math.floor(Math.random() * 8));
      });
      state.integration.lastMockRun = nowIso();
      save();
      renderAll();
    });
  }

  bindTabs();
  bindActions();
  renderAll();
  addChatMessage("ai", "Üretim Analiz Motoru aktif. OEE, duruş, kaizen, 5S ve FMEA sorularınızı sorabilirsiniz.");
})();

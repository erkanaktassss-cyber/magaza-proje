(() => {
  const deepClone = (obj) => JSON.parse(JSON.stringify(obj));
  const uid = (prefix = 'id') => `${prefix}_${Math.random().toString(36).slice(2, 8)}_${Date.now().toString(36)}`;
  const toTrDate = (iso) => new Date(iso).toLocaleString('tr-TR');
  const todayLabel = () => new Date().toLocaleString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  const minsBetween = (start, end) => Math.max(1, Math.round((new Date(end) - new Date(start)) / 60000));
  const clamp = (value, min, max) => Math.min(max, Math.max(min, Number(value) || 0));
  const safePercent = (num, den) => (!den ? 0 : Math.max(0, Math.round((num / den) * 100)));
  const calculateRpn = (item) => clamp(item.severity, 1, 10) * clamp(item.occurrence, 1, 10) * clamp(item.detection, 1, 10);
  const fiveSScore = (item) => Math.round((item.seiri + item.seiton + item.seiso + item.seiketsu + item.shitsuke) / 5);

  function getLineMetrics(line) {
    const planned = Math.max(1, Number(line.plannedProductionMin) || 480);
    const actual = Math.max(0, Number(line.actual) || 0);
    const defect = clamp(line.defect, 0, actual);
    const good = Math.max(0, actual - defect);
    const availability = Math.max(0, (planned - (line.downtime?.totalMin || 0)) / planned);
    const performance = Math.max(0, Math.min(1, (actual * (line.idealCycleSec || 1)) / (planned * 60)));
    const quality = actual > 0 ? Math.max(0, Math.min(1, good / actual)) : 1;
    const oee = availability * performance * quality;
    return {
      qualityPct: Math.round(quality * 100),
      availabilityPct: Math.round(availability * 100),
      performancePct: Math.round(performance * 100),
      oeePct: Math.round(oee * 100),
      efficiencyPct: safePercent(actual, line.dailyTarget),
      statusBand: oee >= 0.75 ? 'good' : oee >= 0.6 ? 'warn' : 'bad'
    };
  }

  const SAMPLE_STATE = {
    meta: { plantName: 'Marmara İçecek Üretim Tesisi', createdAt: new Date().toISOString(), lastUpdated: new Date().toISOString() },
    settings: {
      dataSource: 'manual', barcodePrefix: '869',
      delta: { ip: '192.168.1.35', port: 502, protocol: 'Modbus TCP', counterAddress: '40001', runAddress: '00001', alarmAddress: '10001' },
      ai: { provider: 'mock', openAiBaseUrl: 'https://api.openai.com/v1', model: 'gpt-4.1-mini' }
    },
    downtimeReasons: ['Mekanik arıza', 'Malzeme bekleme', 'Kalite kontrol bekleme', 'Operatör değişimi', 'Planlı bakım', 'Temizlik / CIP'],
    lines: [
      { id: 'line_dolum_a', name: 'Dolum Hattı A', type: 'dolum', group: 'Gazlı İçecek', order: 1, shift: '1. Vardiya', operator: 'Hakan Yılmaz', status: 'running', dailyTarget: 24000, actual: 19850, defect: 420, barcode: '8691234567001', idealCycleSec: 0.95, plannedProductionMin: 480, downtime: { totalMin: 38, active: null, logs: [] }, oeeHistory: [73, 75, 78, 76, 80, 81, 79] },
      { id: 'line_dolum_b', name: 'Dolum Hattı B', type: 'dolum', group: 'Meyve Suyu', order: 2, shift: '2. Vardiya', operator: 'Elif Demir', status: 'stopped', dailyTarget: 18000, actual: 11620, defect: 390, barcode: '8691234567002', idealCycleSec: 1.1, plannedProductionMin: 480, downtime: { totalMin: 92, active: { id: 'stop_active_1', reason: 'Mekanik arıza', type: 'plansiz', startAt: new Date(Date.now() - 1000 * 60 * 14).toISOString() }, logs: [] }, oeeHistory: [68, 66, 64, 62, 63, 60, 57] },
      { id: 'line_pack_a', name: 'Paketleme Hattı A', type: 'paketleme', group: 'Shrink', order: 3, shift: '1. Vardiya', operator: 'Sena Kılıç', status: 'running', dailyTarget: 22000, actual: 17610, defect: 180, barcode: '8691234567003', idealCycleSec: 1.02, plannedProductionMin: 480, downtime: { totalMin: 45, active: null, logs: [] }, oeeHistory: [72, 74, 76, 74, 77, 78, 79] },
      { id: 'line_pack_b', name: 'Paketleme Hattı B', type: 'paketleme', group: 'Koli', order: 4, shift: '3. Vardiya', operator: 'Mert Akın', status: 'idle', dailyTarget: 20000, actual: 15240, defect: 350, barcode: '8691234567004', idealCycleSec: 1.15, plannedProductionMin: 480, downtime: { totalMin: 61, active: null, logs: [] }, oeeHistory: [70, 69, 67, 66, 67, 68, 69] }
    ],
    kaizens: [{ id: 'kz_1', title: 'Dolum nozulu değişim süresi standardizasyonu', description: 'SMED standardı.', department: 'Dolum Hattı B', status: 'uygulandı', gains: { time: 35, cost: 15000, quality: 4, safety: 2 }, createdAt: new Date(Date.now() - 86400000 * 8).toISOString() }],
    fiveS: [{ id: '5s_1', department: 'Dolum Alanı', seiri: 88, seiton: 80, seiso: 83, seiketsu: 79, shitsuke: 76, note: 'Etiketleme yenileme gerekli.' }],
    fmea: [{ id: 'fm_1', process: 'Dolum', failureMode: 'Kapak tork düşüklüğü', effect: 'Sızıntı ve iade', cause: 'Tork başlığı aşınması', severity: 8, occurrence: 6, detection: 5, action: 'Aylık tork başlığı değişim planı', owner: 'Bakım Mühendisi', targetDate: '2026-05-03', status: 'açık' }]
  };

  const STORAGE_KEY = 'fabrika_pro_suite_v1';
  const el = (id) => document.getElementById(id);
  const on = (id, eventName, handler) => {
    const node = el(id);
    if (!node) {
      console.warn(`Eksik DOM elemanı: #${id}`);
      return;
    }
    node.addEventListener(eventName, handler);
  };

  function normalizeLine(line, index) {
    const base = deepClone(SAMPLE_STATE.lines[0]);
    return {
      ...base,
      ...line,
      id: line && line.id ? line.id : uid('line'),
      name: line && line.name ? line.name : `Hat ${index + 1}`,
      order: Number.isFinite(line?.order) ? line.order : index + 1,
      downtime: {
        ...base.downtime,
        ...(line?.downtime || {}),
        logs: Array.isArray(line?.downtime?.logs) ? line.downtime.logs : []
      },
      oeeHistory: Array.isArray(line?.oeeHistory) && line.oeeHistory.length ? line.oeeHistory : base.oeeHistory
    };
  }

  function normalizeState(parsed) {
    const defaults = deepClone(SAMPLE_STATE);
    const safe = parsed && typeof parsed === 'object' ? parsed : {};

    const normalized = {
      ...defaults,
      ...safe,
      meta: { ...defaults.meta, ...(safe.meta || {}) },
      settings: {
        ...defaults.settings,
        ...(safe.settings || {}),
        delta: {
          ...defaults.settings.delta,
          ...((safe.settings && safe.settings.delta) || {})
        },
        ai: {
          ...defaults.settings.ai,
          ...((safe.settings && safe.settings.ai) || {})
        }
      },
      downtimeReasons: Array.isArray(safe.downtimeReasons) ? safe.downtimeReasons : defaults.downtimeReasons,
      lines: Array.isArray(safe.lines) && safe.lines.length ? safe.lines.map(normalizeLine) : defaults.lines.map(normalizeLine),
      kaizens: Array.isArray(safe.kaizens) ? safe.kaizens : defaults.kaizens,
      fiveS: Array.isArray(safe.fiveS) ? safe.fiveS : defaults.fiveS,
      fmea: Array.isArray(safe.fmea) ? safe.fmea : defaults.fmea
    };

    normalized.lines.forEach((line, index) => {
      line.order = index + 1;
    });

    return normalized;
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return deepClone(SAMPLE_STATE);
      return normalizeState(JSON.parse(raw));
    } catch {
      return deepClone(SAMPLE_STATE);
    }
  }

  let state = loadState();
  const save = () => { state.meta.lastUpdated = new Date().toISOString(); localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); };

  const aiAnswer = (question) => {
    const q = question.toLocaleLowerCase('tr-TR');
    const weak = [...state.lines].sort((a, b) => getLineMetrics(a).oeePct - getLineMetrics(b).oeePct)[0];
    if (q.includes('zayıf')) return `En zayıf hat: ${weak.name}. OEE %${getLineMetrics(weak).oeePct}.`;
    if (q.includes('duruş')) return `En yüksek duruş kaybı olan hat: ${[...state.lines].sort((a, b) => b.downtime.totalMin - a.downtime.totalMin)[0].name}.`;
    if (q.includes('fmea')) return `En kritik FMEA: ${state.fmea.map((x) => ({ ...x, rpn: calculateRpn(x) })).sort((a, b) => b.rpn - a.rpn)[0].failureMode}.`;
    if (q.includes('5s')) return `En düşük 5S bölümü: ${state.fiveS.map((x) => ({ ...x, score: fiveSScore(x) })).sort((a, b) => a.score - b.score)[0].department}.`;
    return 'Analiz tamamlandı. Daha spesifik bir soru sorabilirsiniz.';
  };

  function renderAll() {
    el('today').textContent = todayLabel();
    el('plantName').textContent = state.meta.plantName;
    el('lastUpdated').textContent = `Son güncelleme: ${toTrDate(state.meta.lastUpdated)}`;

    const totalTarget = state.lines.reduce((s, l) => s + l.dailyTarget, 0);
    const totalActual = state.lines.reduce((s, l) => s + l.actual, 0);
    const avgOee = Math.round(state.lines.reduce((s, l) => s + getLineMetrics(l).oeePct, 0) / Math.max(1, state.lines.length));
    const totalDown = state.lines.reduce((s, l) => s + l.downtime.totalMin, 0);
    const weakest = [...state.lines].sort((a, b) => safePercent(a.actual, a.dailyTarget) - safePercent(b.actual, b.dailyTarget))[0];
    const critical = state.lines.filter((l) => getLineMetrics(l).oeePct < 60).length;

    el('summaryCards').innerHTML = [
      ['Toplam Hedef', totalTarget], ['Toplam Gerçekleşen', totalActual], ['Ortalama OEE', `%${avgOee}`], ['Toplam Duruş', `${totalDown} dk`], ['En Zayıf Hat', weakest?.name || '-'], ['Kritik Alarm', `${critical} adet`]
    ].map(([t, v]) => `<div class="summary-item"><small>${t}</small><strong>${v}</strong></div>`).join('');

    el('lineCards').innerHTML = state.lines.sort((a,b)=>a.order-b.order).map((line) => {
      const m = getLineMetrics(line);
      const statusText = line.status === 'running' ? 'Çalışıyor' : line.status === 'stopped' ? 'Duruşta' : 'Beklemede';
      const lastReason = line.downtime.active?.reason || line.downtime.logs.slice(-1)[0]?.reason || '-';
      return `<article class="line-card ${m.statusBand}"><div class="card-head"><h4>${line.name}</h4><span class="pill">${line.type}</span></div><div class="kpi-grid"><span>Hedef<b>${line.dailyTarget}</b></span><span>Gerçekleşen<b>${line.actual}</b></span><span>Verim<b>%${m.efficiencyPct}</b></span><span>Durum<b>${statusText}</b></span><span>Duruş<b>${line.downtime.totalMin} dk</b></span><span>Son Sebep<b>${lastReason}</b></span><span>OEE<b>%${m.oeePct}</b></span><span>Vardiya<b>${line.shift}</b></span><span>Operatör<b>${line.operator || '-'}</b></span><span>Kalite<b>%${m.qualityPct}</b></span></div></article>`;
    }).join('');

    el('lineList').innerHTML = state.lines.sort((a,b)=>a.order-b.order).map((line) => `<tr><td>${line.order}</td><td>${line.name}</td><td>${line.type}</td><td>${line.group}</td><td><button data-action="up" data-id="${line.id}">↑</button><button data-action="down" data-id="${line.id}">↓</button><button data-action="edit" data-id="${line.id}">Düzenle</button><button data-action="delete" data-id="${line.id}">Sil</button></td></tr>`).join('');

    const options = state.lines.sort((a,b)=>a.order-b.order).map((l)=>`<option value="${l.id}">${l.name}</option>`).join('');
    ['productionLine', 'stopLine', 'kaizenDept'].forEach((id) => { if (el(id)) el(id).innerHTML = options; });

    const allStops = state.lines.flatMap((line) => (line.downtime.logs || []).map((log) => ({ ...log, lineName: line.name })));
    el('downtimeTable').innerHTML = allStops.sort((a,b)=>new Date(b.startAt)-new Date(a.startAt)).map((log)=>`<tr><td>${log.lineName}</td><td>${log.type}</td><td>${log.reason}</td><td>${toTrDate(log.startAt)}</td><td>${toTrDate(log.endAt)}</td><td>${log.durationMin} dk</td></tr>`).join('');
    el('downLineRanking').innerHTML = state.lines.map((l)=>({name:l.name,down:l.downtime.totalMin})).sort((a,b)=>b.down-a.down).map((x)=>`<li>${x.name}<span>${x.down} dk</span></li>`).join('');
    const reasonMap = new Map(); allStops.forEach((x)=>reasonMap.set(x.reason,(reasonMap.get(x.reason)||0)+x.durationMin));
    el('downReasonRanking').innerHTML = [...reasonMap.entries()].sort((a,b)=>b[1]-a[1]).map(([r,m])=>`<li>${r}<span>${m} dk</span></li>`).join('');
    el('stopReason').innerHTML = state.downtimeReasons.map((r)=>`<option>${r}</option>`).join('');
    el('reasonChips').innerHTML = state.downtimeReasons.map((r)=>`<button class="chip" data-reason="${r}">${r} ✕</button>`).join('');

    el('oeeCards').innerHTML = state.lines.map((line) => { const m = getLineMetrics(line); return `<article class="metric-card ${m.statusBand}"><h4>${line.name}</h4><p>Availability: %${m.availabilityPct}</p><p>Performance: %${m.performancePct}</p><p>Quality: %${m.qualityPct}</p><strong>OEE: %${m.oeePct}</strong></article>`; }).join('');
    const avg = Math.round(state.lines.reduce((sum, l) => sum + getLineMetrics(l).oeePct, 0) / Math.max(1, state.lines.length));
    el('oeePeriod').innerHTML = ['Günlük','Haftalık','Aylık'].map((p,i)=>`<li>${p}<span>%${Math.max(0, avg - (i*3-2))}</span></li>`).join('');
    el('oeeTrend').innerHTML = state.lines.map((line)=>`<div class="trend-row"><span>${line.name}</span><div class="spark">${(line.oeeHistory||[]).map((v)=>`<i style="height:${v}%"></i>`).join('')}</div></div>`).join('');

    el('kaizenRows').innerHTML = state.kaizens.slice().reverse().map((k)=>`<tr><td>${k.title}</td><td>${k.department}</td><td>${k.status}</td><td>${k.gains.time} dk</td><td>${k.gains.cost} ₺</td><td>${k.gains.quality}%</td><td>${k.gains.safety}</td></tr>`).join('');
    el('fiveSRows').innerHTML = state.fiveS.map((s)=>`<tr><td>${s.department}</td><td>${s.seiri}</td><td>${s.seiton}</td><td>${s.seiso}</td><td>${s.seiketsu}</td><td>${s.shitsuke}</td><td>${fiveSScore(s)}</td><td>${s.note||'-'}</td></tr>`).join('');
    el('fmeaRows').innerHTML = state.fmea.map((f)=>({ ...f, rpn: calculateRpn(f) })).sort((a,b)=>b.rpn-a.rpn).map((f)=>`<tr class="${f.rpn>=200?'critical':''}"><td>${f.process}</td><td>${f.failureMode}</td><td>${f.effect}</td><td>${f.cause}</td><td>${f.severity}</td><td>${f.occurrence}</td><td>${f.detection}</td><td>${f.rpn}</td><td>${f.action}</td><td>${f.owner}</td><td>${f.targetDate}</td><td>${f.status}</td></tr>`).join('');

    el('dataSource').value = state.settings.dataSource;
    el('deltaIp').value = state.settings.delta.ip;
    el('deltaPort').value = state.settings.delta.port;
    el('deltaCounter').value = state.settings.delta.counterAddress;
    el('deltaRun').value = state.settings.delta.runAddress;
    el('deltaAlarm').value = state.settings.delta.alarmAddress;
    el('barcodePrefix').value = state.settings.barcodePrefix;
    el('aiProvider').value = state.settings.ai.provider;
    el('aiModel').value = state.settings.ai.model;

    el('latestKaizens').innerHTML = state.kaizens.slice(-4).reverse().map((k)=>`<li>${k.title} <span>${k.status}</span></li>`).join('');
    el('criticalFmea').innerHTML = state.fmea.map((f)=>({ ...f, rpn: calculateRpn(f) })).sort((a,b)=>b.rpn-a.rpn).slice(0,4).map((f)=>`<li>${f.process} / ${f.failureMode}<span>RPN ${f.rpn}</span></li>`).join('');
    el('low5s').innerHTML = state.fiveS.map((s)=>({ ...s, score: fiveSScore(s) })).sort((a,b)=>a.score-b.score).slice(0,4).map((s)=>`<li>${s.department}<span>${s.score}/100</span></li>`).join('');

    const report = `GÜNLÜK ÜRETİM RAPORU\n\nToplam Hedef: ${totalTarget}\nToplam Gerçekleşen: ${totalActual}\nOrtalama OEE: %${avgOee}\nToplam Duruş: ${totalDown} dk`;
    el('reportPreview').textContent = report;
  }

  function boot() {
    document.querySelectorAll('[data-tab]').forEach((btn) => btn.addEventListener('click', () => {
      document.querySelectorAll('[data-tab]').forEach((b) => b.classList.remove('active'));
      document.querySelectorAll('.tab').forEach((tab) => tab.classList.remove('active'));
      btn.classList.add('active');
      el(`tab-${btn.dataset.tab}`).classList.add('active');
    }));

    on('addLine', 'click', () => {
      const name = el('lineName').value.trim(); if (!name) return;
      state.lines.push({ id: uid('line'), name, type: el('lineType').value, group: el('lineGroup').value || 'Genel', order: state.lines.length + 1, shift: '1. Vardiya', operator: '', status: 'idle', dailyTarget: 0, actual: 0, defect: 0, barcode: '', idealCycleSec: 1, plannedProductionMin: 480, downtime: { totalMin: 0, active: null, logs: [] }, oeeHistory: [65,68,70,69,72,71,73] });
      save(); renderAll(); el('lineName').value = '';
    });

    on('lineList', 'click', (e) => {
      const id = e.target.dataset.id; const action = e.target.dataset.action; if (!id || !action) return;
      const idx = state.lines.findIndex((l) => l.id === id); if (idx < 0) return;
      if (action === 'delete') state.lines.splice(idx, 1);
      if (action === 'up' && idx > 0) [state.lines[idx - 1], state.lines[idx]] = [state.lines[idx], state.lines[idx - 1]];
      if (action === 'down' && idx < state.lines.length - 1) [state.lines[idx + 1], state.lines[idx]] = [state.lines[idx], state.lines[idx + 1]];
      if (action === 'edit') { const n = prompt('Hat adı', state.lines[idx].name); if (n) state.lines[idx].name = n.trim(); }
      state.lines.forEach((l, i) => l.order = i + 1); save(); renderAll();
    });

    on('saveProduction', 'click', () => {
      const line = state.lines.find((l) => l.id === el('productionLine').value); if (!line) return;
      line.dailyTarget = Math.max(0, Number(el('targetInput').value) || 0);
      line.actual = Math.max(0, Number(el('actualInput').value) || 0);
      line.defect = clamp(el('defectInput').value, 0, line.actual);
      line.shift = el('shiftInput').value; line.operator = el('operatorInput').value.trim(); line.barcode = el('barcodeInput').value.trim(); line.status = line.actual > 0 ? 'running' : 'idle';
      save(); renderAll();
    });

    on('startDowntime', 'click', () => {
      const line = state.lines.find((l) => l.id === el('stopLine').value); if (!line || line.downtime.active) return;
      line.status = 'stopped'; line.downtime.active = { id: uid('stop'), reason: el('stopReason').value, type: el('stopType').value, startAt: new Date().toISOString() };
      save(); renderAll();
    });
    on('endDowntime', 'click', () => {
      const line = state.lines.find((l) => l.id === el('stopLine').value); if (!line || !line.downtime.active) return;
      const endAt = new Date().toISOString(); const durationMin = minsBetween(line.downtime.active.startAt, endAt);
      line.downtime.logs.push({ ...line.downtime.active, endAt, durationMin }); line.downtime.totalMin += durationMin; line.downtime.active = null; line.status = 'running';
      save(); renderAll();
    });
    on('addReason', 'click', () => { const reason = el('newReason').value.trim(); if (!reason) return; if (!state.downtimeReasons.includes(reason)) state.downtimeReasons.push(reason); save(); renderAll(); el('newReason').value=''; });
    on('reasonChips', 'click', (e) => { const reason = e.target.dataset.reason; if (!reason) return; state.downtimeReasons = state.downtimeReasons.filter((r) => r !== reason); save(); renderAll(); });

    on('addKaizen', 'click', () => {
      const title = el('kaizenTitle').value.trim(); if (!title) return;
      state.kaizens.push({ id: uid('kz'), title, description: el('kaizenDesc').value.trim(), department: el('kaizenDept').selectedOptions[0]?.textContent || '-', status: el('kaizenStatus').value, gains: { time: Number(el('gainTime').value)||0, cost: Number(el('gainCost').value)||0, quality: Number(el('gainQuality').value)||0, safety: Number(el('gainSafety').value)||0 }, createdAt: new Date().toISOString() });
      save(); renderAll();
    });

    on('addFiveS', 'click', () => {
      const dept = el('fiveSDept').value.trim(); if (!dept) return;
      state.fiveS.push({ id: uid('5s'), department: dept, seiri: clamp(el('seiri').value,0,100), seiton: clamp(el('seiton').value,0,100), seiso: clamp(el('seiso').value,0,100), seiketsu: clamp(el('seiketsu').value,0,100), shitsuke: clamp(el('shitsuke').value,0,100), note: el('fiveSNote').value.trim() });
      save(); renderAll();
    });

    on('addFmea', 'click', () => {
      const process = el('fProcess').value.trim(); if (!process) return;
      state.fmea.push({ id: uid('fm'), process, failureMode: el('fMode').value.trim(), effect: el('fEffect').value.trim(), cause: el('fCause').value.trim(), severity: clamp(el('fS').value,1,10), occurrence: clamp(el('fO').value,1,10), detection: clamp(el('fD').value,1,10), action: el('fAction').value.trim(), owner: el('fOwner').value.trim(), targetDate: el('fDate').value, status: el('fStatus').value });
      save(); renderAll();
    });

    on('runAnalysis', 'click', () => {
      const q = el('analysisQuestion').value.trim(); if (!q) return;
      el('analysisOutput').innerHTML = `<p><b>Soru:</b> ${q}</p><p><b>Analiz:</b> ${aiAnswer(q)}</p>`;
    });

    on('saveSettings', 'click', () => {
      state.settings.dataSource = el('dataSource').value;
      state.settings.barcodePrefix = el('barcodePrefix').value.trim();
      state.settings.delta.ip = el('deltaIp').value.trim();
      state.settings.delta.port = Number(el('deltaPort').value) || 502;
      state.settings.delta.counterAddress = el('deltaCounter').value.trim();
      state.settings.delta.runAddress = el('deltaRun').value.trim();
      state.settings.delta.alarmAddress = el('deltaAlarm').value.trim();
      state.settings.ai.provider = el('aiProvider').value;
      state.settings.ai.model = el('aiModel').value.trim();
      save(); renderAll(); alert('Ayarlar kaydedildi.');
    });
    on('testIntegration', 'click', () => {
      if (state.settings.dataSource !== 'delta') { el('integrationResult').textContent = 'Manuel/Barkod modunda test bağlantısı gerekmiyor.'; return; }
      if (!state.settings.delta.ip || !state.settings.delta.port) { el('integrationResult').textContent = 'Delta bağlantısı için IP/Port eksik.'; return; }
      el('integrationResult').textContent = `Mock bağlantı başarılı (${state.settings.delta.protocol} - ${state.settings.delta.ip}:${state.settings.delta.port}).`;
    });

    on('generateReport', 'click', renderAll);
    on('exportCsv', 'click', () => {
      const rows = state.lines.map((line) => { const m = getLineMetrics(line); return [line.name, line.type, line.dailyTarget, line.actual, line.defect, `${m.oeePct}%`, line.downtime.totalMin]; });
      const esc = (v) => `"${String(v ?? '').replaceAll('"','""')}"`;
      const csv = [['Hat','Tip','Hedef','Gerçekleşen','Fire','OEE','Duruş dk'].map(esc).join(','), ...rows.map((r) => r.map(esc).join(','))].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'uretim-ozet-raporu.csv'; a.click();
    });
    on('exportExcel', 'click', () => {
      const rows = state.fmea.map((item) => ({ ...item, rpn: calculateRpn(item) })).sort((a, b) => b.rpn - a.rpn).map((item) => `<tr><td>${item.process}</td><td>${item.failureMode}</td><td>${item.rpn}</td><td>${item.owner}</td><td>${item.status}</td></tr>`).join('');
      const html = `<table><tr><th>Proses</th><th>Hata Türü</th><th>RPN</th><th>Sorumlu</th><th>Durum</th></tr>${rows}</table>`;
      const blob = new Blob([html], { type: 'application/vnd.ms-excel' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'fmea-risk-raporu.xls'; a.click();
    });
    on('printReport', 'click', () => window.print());

    on('tvMode', 'click', () => document.body.classList.toggle('tv-mode'));
    on('resetData', 'click', () => { if (!confirm('Tüm veriler sıfırlansın mı?')) return; localStorage.removeItem(STORAGE_KEY); state = deepClone(SAMPLE_STATE); save(); renderAll(); });

    renderAll();
  }

  const safeBoot = () => {
    try {
      boot();
    } catch (error) {
      console.error('Uygulama başlatma hatası:', error);
      alert('Sistem başlatılırken hata oluştu. Lütfen sayfayı yenileyin.');
    }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', safeBoot);
  else safeBoot();
})();

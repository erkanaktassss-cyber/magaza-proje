import { IntegrationService } from './services/integrationService.js';
import { AiService } from './services/aiService.js';
import { ReportService } from './services/reportService.js';
import { getState, resetAll, setState, subscribe } from './store/state.js';
import { uid, todayLabel, minsBetween } from './utils/format.js';
import { clamp } from './utils/oee.js';
import {
  fillLineSelects,
  renderDashboard,
  renderDowntime,
  renderFiveS,
  renderFmea,
  renderHeader,
  renderKaizen,
  renderLineManagement,
  renderOee,
  renderReport,
  renderSettings
} from './components/renderers.js';

const integration = new IntegrationService(getState);
const ai = new AiService(getState);

function renderAll() {
  const state = getState();
  document.getElementById('today').textContent = todayLabel();
  renderHeader(state);
  renderDashboard(state);
  renderLineManagement(state);
  fillLineSelects(state);
  renderDowntime(state);
  renderOee(state, document.getElementById('oeeView')?.value || 'daily');
  renderKaizen(state, document.getElementById('kaizenFilter')?.value || 'all');
  renderFiveS(state);
  renderFmea(state);
  renderSettings(state);
  renderReport(ReportService.buildReport(getState(), document.getElementById('reportType')?.value || 'daily'));
}

function bindTabs() {
  document.querySelectorAll('[data-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-tab]').forEach((b) => b.classList.remove('active'));
      document.querySelectorAll('.tab').forEach((tab) => tab.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
    });
  });
}

function bindLineActions() {
  document.getElementById('addLine').addEventListener('click', () => {
    const name = document.getElementById('lineName').value.trim();
    if (!name) return;
    setState((state) => {
      state.lines.push({
        id: uid('line'),
        name,
        type: document.getElementById('lineType').value,
        group: document.getElementById('lineGroup').value || 'Genel',
        order: state.lines.length + 1,
        shift: '1. Vardiya',
        operator: '',
        status: 'idle',
        dailyTarget: 0,
        actual: 0,
        defect: 0,
        barcode: '',
        idealCycleSec: 1,
        plannedProductionMin: 480,
        downtime: { totalMin: 0, active: null, logs: [] },
        oeeHistory: [65, 68, 70, 69, 72, 71, 73]
      });
    });
    document.getElementById('lineName').value = '';
  });

  document.getElementById('lineList').addEventListener('click', (e) => {
    const id = e.target.dataset.id;
    const action = e.target.dataset.action;
    if (!id || !action) return;

    setState((state) => {
      const idx = state.lines.findIndex((l) => l.id === id);
      if (idx < 0) return;
      if (action === 'delete') {
        state.lines.splice(idx, 1);
      } else if (action === 'up' && idx > 0) {
        [state.lines[idx - 1], state.lines[idx]] = [state.lines[idx], state.lines[idx - 1]];
      } else if (action === 'down' && idx < state.lines.length - 1) {
        [state.lines[idx + 1], state.lines[idx]] = [state.lines[idx], state.lines[idx + 1]];
      } else if (action === 'edit') {
        const line = state.lines[idx];
        const nextName = prompt('Hat adı', line.name);
        const nextType = prompt('Hat tipi (dolum/paketleme/diger)', line.type);
        const nextGroup = prompt('Hat grubu', line.group);
        if (nextName?.trim()) line.name = nextName.trim();
        if (['dolum', 'paketleme', 'diger'].includes(nextType)) line.type = nextType;
        if (nextGroup?.trim()) line.group = nextGroup.trim();
      }
      state.lines.forEach((line, i) => (line.order = i + 1));
    });
  });
}

function bindProductionEntry() {
  document.getElementById('saveProduction').addEventListener('click', () => {
    const lineId = document.getElementById('productionLine').value;
    setState((state) => {
      const line = state.lines.find((l) => l.id === lineId);
      if (!line) return;
      line.dailyTarget = Math.max(0, Number(document.getElementById('targetInput').value) || 0);
      line.actual = Math.max(0, Number(document.getElementById('actualInput').value) || 0);
      line.defect = clamp(document.getElementById('defectInput').value, 0, line.actual);
      line.shift = document.getElementById('shiftInput').value;
      line.operator = document.getElementById('operatorInput').value.trim();
      line.barcode = document.getElementById('barcodeInput').value.trim();
      line.status = line.actual > 0 ? 'running' : 'idle';
    });
  });
}

function bindDowntime() {
  document.getElementById('startDowntime').addEventListener('click', () => {
    setState((state) => {
      const line = state.lines.find((l) => l.id === document.getElementById('stopLine').value);
      if (!line || line.downtime.active) return;
      line.status = 'stopped';
      line.downtime.active = {
        id: uid('stop'),
        reason: document.getElementById('stopReason').value,
        type: document.getElementById('stopType').value,
        startAt: new Date().toISOString()
      };
    });
  });

  document.getElementById('endDowntime').addEventListener('click', () => {
    setState((state) => {
      const line = state.lines.find((l) => l.id === document.getElementById('stopLine').value);
      if (!line || !line.downtime.active) return;
      const endAt = new Date().toISOString();
      const durationMin = minsBetween(line.downtime.active.startAt, endAt);
      line.downtime.logs.push({ ...line.downtime.active, endAt, durationMin });
      line.downtime.totalMin += durationMin;
      line.downtime.active = null;
      line.status = 'running';
    });
  });

  document.getElementById('addReason').addEventListener('click', () => {
    const reason = document.getElementById('newReason').value.trim();
    if (!reason) return;
    setState((state) => {
      if (!state.downtimeReasons.includes(reason)) state.downtimeReasons.push(reason);
    });
    document.getElementById('newReason').value = '';
  });

  document.getElementById('reasonChips').addEventListener('click', (e) => {
    const reason = e.target.dataset.reason;
    if (!reason) return;
    setState((state) => {
      state.downtimeReasons = state.downtimeReasons.filter((r) => r !== reason);
    });
  });
}

function bindKaizen() {
  document.getElementById('addKaizen').addEventListener('click', () => {
    const title = document.getElementById('kaizenTitle').value.trim();
    if (!title) return;
    setState((state) => {
      state.kaizens.push({
        id: uid('kz'),
        title,
        description: document.getElementById('kaizenDesc').value.trim(),
        department: document.getElementById('kaizenDept').selectedOptions[0].textContent,
        status: document.getElementById('kaizenStatus').value,
        gains: {
          time: Number(document.getElementById('gainTime').value) || 0,
          cost: Number(document.getElementById('gainCost').value) || 0,
          quality: Number(document.getElementById('gainQuality').value) || 0,
          safety: Number(document.getElementById('gainSafety').value) || 0
        },
        createdAt: new Date().toISOString()
      });
    });
  });

  document.getElementById('kaizenFilter').addEventListener('change', () => renderKaizen(getState(), document.getElementById('kaizenFilter').value));
}

function bindFiveS() {
  document.getElementById('addFiveS').addEventListener('click', () => {
    const dept = document.getElementById('fiveSDept').value.trim();
    if (!dept) return;
    setState((state) => {
      state.fiveS.push({
        id: uid('5s'),
        department: dept,
        seiri: clamp(document.getElementById('seiri').value, 0, 100),
        seiton: clamp(document.getElementById('seiton').value, 0, 100),
        seiso: clamp(document.getElementById('seiso').value, 0, 100),
        seiketsu: clamp(document.getElementById('seiketsu').value, 0, 100),
        shitsuke: clamp(document.getElementById('shitsuke').value, 0, 100),
        note: document.getElementById('fiveSNote').value.trim()
      });
    });
  });
}

function bindFmea() {
  document.getElementById('addFmea').addEventListener('click', () => {
    const process = document.getElementById('fProcess').value.trim();
    if (!process) return;
    setState((state) => {
      state.fmea.push({
        id: uid('fm'),
        process,
        failureMode: document.getElementById('fMode').value.trim(),
        effect: document.getElementById('fEffect').value.trim(),
        cause: document.getElementById('fCause').value.trim(),
        severity: clamp(document.getElementById('fS').value, 1, 10),
        occurrence: clamp(document.getElementById('fO').value, 1, 10),
        detection: clamp(document.getElementById('fD').value, 1, 10),
        action: document.getElementById('fAction').value.trim(),
        owner: document.getElementById('fOwner').value.trim(),
        targetDate: document.getElementById('fDate').value,
        status: document.getElementById('fStatus').value
      });
    });
  });
}

function bindAiPanel() {
  const qa = document.getElementById('analysisOutput');
  document.getElementById('runAnalysis').addEventListener('click', () => {
    const q = document.getElementById('analysisQuestion').value.trim();
    if (!q) return;
    qa.innerHTML = `<p><b>Soru:</b> ${q}</p><p><b>Analiz:</b> ${ai.answer(q)}</p>`;
  });
}

function bindSettings() {
  document.getElementById('saveSettings').addEventListener('click', () => {
    setState((state) => {
      state.settings.dataSource = document.getElementById('dataSource').value;
      state.settings.barcodePrefix = document.getElementById('barcodePrefix').value.trim();
      state.settings.delta.ip = document.getElementById('deltaIp').value.trim();
      state.settings.delta.port = Number(document.getElementById('deltaPort').value) || 502;
      state.settings.delta.protocol = document.getElementById('deltaProtocol').value.trim() || 'Modbus TCP';
      state.settings.delta.counterAddress = document.getElementById('deltaCounter').value.trim();
      state.settings.delta.runAddress = document.getElementById('deltaRun').value.trim();
      state.settings.delta.alarmAddress = document.getElementById('deltaAlarm').value.trim();
      state.settings.ai.provider = document.getElementById('aiProvider').value;
      state.settings.ai.model = document.getElementById('aiModel').value.trim();
    });
    alert('Ayarlar kaydedildi.');
  });

  document.getElementById('testIntegration').addEventListener('click', async () => {
    const res = await integration.testConnection();
    document.getElementById('integrationResult').textContent = res.message;
  });
}

function bindReports() {
  document.getElementById('generateReport').addEventListener('click', () => {
    const reportType = document.getElementById('reportType').value;
    renderReport(ReportService.buildReport(getState(), reportType));
  });
  document.getElementById('exportCsv').addEventListener('click', () => ReportService.exportCsv(getState(), document.getElementById('reportType').value));
  document.getElementById('exportExcel').addEventListener('click', () => ReportService.exportExcel(getState(), document.getElementById('reportType').value));
  document.getElementById('printReport').addEventListener('click', () => ReportService.print());
}

function bindGlobal() {
  document.getElementById('tvMode').addEventListener('click', () => document.body.classList.toggle('tv-mode'));
  document.getElementById('resetData').addEventListener('click', () => {
    if (!confirm('Tüm veriler sıfırlansın mı?')) return;
    resetAll();
  });

  document.getElementById('oeeView').addEventListener('change', () => renderOee(getState(), document.getElementById('oeeView').value));
  document.getElementById('reportType').addEventListener('change', () => renderReport(ReportService.buildReport(getState(), document.getElementById('reportType').value)));
}

function init() {
  bindTabs();
  bindLineActions();
  bindProductionEntry();
  bindDowntime();
  bindKaizen();
  bindFiveS();
  bindFmea();
  bindAiPanel();
  bindSettings();
  bindReports();
  bindGlobal();
  subscribe(renderAll);
  renderAll();
}

init();

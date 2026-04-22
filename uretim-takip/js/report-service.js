(function () {
  const { pct, lineOee, todayStr } = window.DataService;

  function reports(state) {
    const totalTarget = state.lines.reduce((acc, l) => acc + l.target, 0);
    const totalActual = state.lines.reduce((acc, l) => acc + l.actual, 0);
    const avgOee = Math.round(state.lines.reduce((acc, l) => acc + lineOee(l).oee, 0) / (state.lines.length || 1));

    return {
      daily: `Günlük Üretim Raporu\nTarih: ${todayStr()}\nToplam Hedef: ${totalTarget}\nToplam Gerçekleşen: ${totalActual}\nVerim: ${pct(totalActual, totalTarget)}%`,
      shift: `Vardiya Raporu\n${state.lines.map((l) => `${l.name} • ${l.shift} • Operatör: ${l.operator || "-"}`).join("\n")}`,
      oee: `OEE Raporu\n${state.lines.map((l) => `${l.name}: ${lineOee(l).oee}%`).join("\n")}\nOrtalama OEE: ${avgOee}%`,
      stop: `Duruş Raporu\n${window.AnalyticsEngine.totalDowntimeByLine(state).map((d) => `${d.name}: ${d.total} dk`).join("\n")}`,
      kaizen: `Kaizen Raporu\nToplam: ${state.kaizens.length}\nUygulanan: ${state.kaizens.filter((k) => k.status === "uygulandı").length}`,
      fmea: `FMEA Raporu\nToplam kayıt: ${state.fmea.length}\nKritik (RPN>=150): ${state.fmea.filter((f) => f.rpn >= 150).length}`
    };
  }

  function exportCsv(state) {
    const headers = ["Hat", "Tip", "Hedef", "Gerçekleşen", "Verim", "Duruş", "OEE", "Vardiya", "Operatör"];
    const rows = state.lines.map((l) => [l.name, l.group, l.target, l.actual, pct(l.actual, l.target), l.downtime.totalMin, lineOee(l).oee, l.shift, l.operator]);
    const csv = [headers, ...rows].map((r) => r.join(";")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `uretim-rapor-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  }

  function exportExcel(state) {
    const rows = state.lines.map((l) => `<tr><td>${l.name}</td><td>${l.group}</td><td>${l.target}</td><td>${l.actual}</td><td>${pct(l.actual, l.target)}%</td><td>${lineOee(l).oee}%</td></tr>`).join("");
    const table = `<table><tr><th>Hat</th><th>Tip</th><th>Hedef</th><th>Gerçekleşen</th><th>Verim</th><th>OEE</th></tr>${rows}</table>`;
    const blob = new Blob([`<html><body>${table}</body></html>`], { type: "application/vnd.ms-excel" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `uretim-rapor-${new Date().toISOString().slice(0, 10)}.xls`;
    a.click();
  }

  window.ReportService = { reports, exportCsv, exportExcel };
})();

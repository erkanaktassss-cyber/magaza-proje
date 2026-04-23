import { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { downloadCsv, oeeForLine } from '../utils/calculations';

export default function ReportsPage() {
  const { state } = useApp();
  const [type, setType] = useState('gunluk');
  const rows = useMemo(() => {
    if (type === 'oee') return [['Hat', 'Availability', 'Performance', 'Quality', 'OEE'], ...state.lines.map((l) => { const o = oeeForLine(l); return [l.name, o.availability.toFixed(1), o.performance.toFixed(1), o.quality.toFixed(1), o.oee.toFixed(1)]; })];
    if (type === 'durus') return [['Hat', 'Neden', 'Süre'], ...state.downtimes.map((d) => [state.lines.find((l) => l.id === d.lineId)?.name, d.reason, Math.round(d.durationMin || 0)])];
    if (type === 'kaizen') return [['Başlık', 'Durum', 'Alan'], ...state.kaizens.map((k) => [k.title, k.status, k.area])];
    if (type === 'fmea') return [['Proses', 'Hata', 'RPN'], ...state.fmea.map((f) => [f.process, f.failureMode, f.severity * f.occurrence * f.detection])];
    if (type === '5s') return [['Bölüm', 'Seiri', 'Seiton', 'Seiso', 'Seiketsu', 'Shitsuke'], ...state.fiveS.map((x) => [x.department, x.seiri, x.seiton, x.seiso, x.seiketsu, x.shitsuke])];
    return [['Hat', 'Hedef', 'Gerçekleşen', 'Vardiya'], ...state.lines.map((l) => [l.name, l.dailyTarget, l.actual, l.shift])];
  }, [type, state]);

  return <section className="panel glass">
    <div className="row"><h2>Raporlama Merkezi</h2><select value={type} onChange={(e) => setType(e.target.value)}><option value="gunluk">Günlük</option><option value="haftalik">Haftalık</option><option value="vardiya">Vardiya</option><option value="oee">OEE</option><option value="durus">Duruş</option><option value="kaizen">Kaizen</option><option value="fmea">FMEA</option><option value="5s">5S</option></select><button onClick={() => downloadCsv(`${type}-rapor.csv`, rows)}>CSV Export</button><button onClick={() => window.print()}>Yazdır</button></div>
    <div className="table-wrap"><table><tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody></table></div>
  </section>;
}

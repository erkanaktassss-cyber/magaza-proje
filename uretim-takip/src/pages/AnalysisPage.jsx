import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { runAnalysis } from '../services/analysisService';

export default function AnalysisPage() {
  const { state } = useApp();
  const [result, setResult] = useState([]);
  return <section className="grid analysis">
    <div className="panel glass"><h3>Veri Durumu</h3><p>Hat: {state.lines.length}</p><p>Duruş Kaydı: {state.downtimes.length}</p><p>Kaizen: {state.kaizens.length}</p><p>FMEA: {state.fmea.length}</p></div>
    <div className="panel glass core-wrap"><div className="core" /><h2>Üretim Analiz Motoru</h2><button onClick={() => setResult(runAnalysis(state))}>Analizi Çalıştır</button></div>
    <div className="panel glass"><h3>Analiz Sonuçları</h3>{result.map((r) => <div className="result" key={r}>{r}</div>)}</div>
  </section>;
}

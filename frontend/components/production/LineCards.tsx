import { productionLines } from '@/lib/production-data';

export function LineCards() {
  return (
    <div className="line-grid">
      {productionLines.map((line) => (
        <div className="line-card panel" key={line.id}>
          <div className="line-top"><div><div className="name">{line.name}</div><div className="status">{line.status}</div></div><div className="pill">OEE {line.oee}%</div></div>
          <div className="line-stats"><div><span>Hız</span><span>{line.speed}</span></div><div><span>Fire</span><span>{line.scrap}</span></div><div><span>Duruş</span><span>{line.downtime}</span></div></div>
          <div className="progress"><div style={{ width: `${line.oee}%` }} /></div>
        </div>
      ))}
    </div>
  );
}

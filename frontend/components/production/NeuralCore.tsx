export function NeuralCore() {
  const orbs = [
    { top: '95px', left: '120px' },
    { top: '70px', right: '110px', animationDelay: '.5s' },
    { bottom: '92px', left: '100px', animationDelay: '1s' },
    { bottom: '88px', right: '95px', animationDelay: '1.5s' },
    { top: '50%', left: '35px', animationDelay: '2s' },
    { top: '48%', right: '32px', animationDelay: '2.4s' }
  ];
  return (
    <div className="core-box" aria-label="Neural Production Core">
      <div className="ring" /><div className="ring2" /><div className="ring3" />
      <div className="core" />
      {orbs.map((style, index) => <div key={index} className="orb" style={style} />)}
      <div className="core-label">
        <div className="small">Neural Production Core</div>
        <div className="big">Şeffaf Zekâ Çekirdeği</div>
        <p>Merkez obje; üretim verisi, kalite sinyali, bakım tahmini ve verimlilik yorumunu temsil eden premium görsel katman olarak tasarlandı.</p>
      </div>
    </div>
  );
}

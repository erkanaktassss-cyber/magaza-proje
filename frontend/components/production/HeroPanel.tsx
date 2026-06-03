import { miniStats } from '@/lib/production-data';
import { NeuralCore } from './NeuralCore';

export function HeroPanel() {
  return (
    <div className="panel hero">
      <div className="badges">
        <div className="badge">Elite Production AI</div>
        <div className="badge">Yapay Zekâ Destekli Üretim Kontrol Merkezi</div>
      </div>
      <div className="hero-main">
        <div>
          <h1>Üretimini izleyen, yorumlayan ve seninle konuşan premium verimlilik yazılımı</h1>
          <p className="desc">Bu sistem; OEE, duruşlar, fire, hız, kalite, enerji, bakım ve vardiya performansını tek ekranda toplar. Yapay zekâ modülü ise seninle sohbet ederek üretimdeki kayıpları açıklar, aksiyon önerir ve yönetime uygun rapor üretir.</p>
          <div className="btns">
            <a className="action primary" href="/admin">Canlı Veriyi Bağla</a>
            <a className="action secondary" href="#ai-assistant">AI Simülasyonu Aç</a>
          </div>
          <div className="mini-cards">
            {miniStats.map((stat) => (
              <div className="mini-card" key={stat.label}><div className="label">{stat.label}</div><div className="value">{stat.value}</div></div>
            ))}
          </div>
        </div>
        <NeuralCore />
      </div>
    </div>
  );
}

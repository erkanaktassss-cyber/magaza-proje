'use client';

import { FormEvent, useRef, useState } from 'react';

type Message = { type: 'assistant' | 'user'; text: string };

const initialMessages: Message[] = [
  { type: 'assistant', text: 'Merhaba, ben üretim verimlilik asistanıyım. Bana hattındaki duruşlar, OEE, kalite kayıpları, köpük problemi, vardiya performansı veya bakım ihtiyacı hakkında soru sorabilirsin.' },
  { type: 'user', text: 'Dolum hattındaki verim neden hedefin altında?' },
  { type: 'assistant', text: 'Mevcut verilere göre ana kayıp 3 başlıkta: kısa duruşlar, köpük kaynaklı dolum sapmaları ve etiketleme senkron farkı. Öncelikli aksiyon olarak mikro duruş analizi ve ilk 30 dakikalık vardiya stabilizasyonu öneriyorum.' }
];

export function AIAssistant() {
  const [messages, setMessages] = useState(initialMessages);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const prompt = text.trim();
    if (!prompt || loading) return;
    setMessages((items) => [...items, { type: 'user', text: prompt }]);
    setText('');
    setLoading(true);
    const response = await fetch('/api/ai/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: prompt }) });
    const data = await response.json() as { reply: string };
    setMessages((items) => [...items, { type: 'assistant', text: data.reply }]);
    setLoading(false);
    requestAnimationFrame(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; });
  }

  return (
    <div id="ai-assistant" className="panel chat-box">
      <div className="section-title">AI Üretim Asistanı</div>
      <div className="messages" ref={ref}>
        {messages.map((message, index) => <div key={index} className={`msg ${message.type}`}>{message.text}</div>)}
        {loading && <div className="msg assistant">Canlı üretim bağlamı analiz ediliyor...</div>}
      </div>
      <form className="chat-input" onSubmit={submit}>
        <input value={text} onChange={(event) => setText(event.target.value)} placeholder="Örn: Dolum hattında köpük yüzünden hacim sapması yaşıyorum, ne önerirsin?" />
        <button type="submit">Gönder</button>
      </form>
    </div>
  );
}

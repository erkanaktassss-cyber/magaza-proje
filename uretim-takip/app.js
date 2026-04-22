const HATLAR = ["D1", "D2", "D3", "D4", "D5", "P1", "P2", "P3", "P4", "P5"];
const STORAGE_KEY = "uretim_takip_v1";

function varsayilanVeri() {
  const lines = {};
  HATLAR.forEach((hat) => {
    lines[hat] = {
      hedef: 0,
      gerceklesen: 0,
      vardiya: "1. Vardiya",
      operator: "",
      running: true,
      aktifDurus: null,
      toplamDurusDakika: 0,
      duruslar: []
    };
  });
  return { tarih: bugunStr(), lines };
}

function bugunStr() {
  return new Date().toISOString().slice(0, 10);
}

function yukle() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return varsayilanVeri();
  const parsed = JSON.parse(raw);
  if (parsed.tarih !== bugunStr()) {
    const yeni = varsayilanVeri();
    HATLAR.forEach((hat) => {
      yeni.lines[hat].hedef = Number(parsed.lines?.[hat]?.hedef || 0);
      yeni.lines[hat].vardiya = parsed.lines?.[hat]?.vardiya || "1. Vardiya";
      yeni.lines[hat].operator = parsed.lines?.[hat]?.operator || "";
    });
    return yeni;
  }
  return parsed;
}

let state = yukle();
let seciliHat = "D1";

function kaydet() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function paraYuzde(hedef, gerceklesen) {
  if (!hedef) return 0;
  return Math.round((gerceklesen / hedef) * 100);
}

function tarihSaat(iso) {
  return new Date(iso).toLocaleString("tr-TR", { hour12: false });
}

function dakikayaYuvarla(ms) {
  return Math.max(1, Math.round(ms / 60000));
}

function seciliVeri() {
  return state.lines[seciliHat];
}

function tabGecisKur() {
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach((x) => x.classList.remove("active"));
      document.querySelectorAll(".tab-panel").forEach((x) => x.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(`tab-${btn.dataset.tab}`).classList.add("active");
    });
  });
}

function hatSecimiKur() {
  const select = document.getElementById("hatSecimi");
  HATLAR.forEach((hat) => {
    const o = document.createElement("option");
    o.value = hat;
    o.textContent = hat;
    select.appendChild(o);
  });
  select.value = seciliHat;
  select.addEventListener("change", () => {
    seciliHat = select.value;
    render();
  });
}

function lineKayitlariKur() {
  document.getElementById("hedefInput").addEventListener("change", (e) => {
    seciliVeri().hedef = Math.max(0, Number(e.target.value || 0));
    kaydet();
    render();
  });

  document.getElementById("vardiyaInput").addEventListener("change", (e) => {
    seciliVeri().vardiya = e.target.value;
    kaydet();
    render();
  });

  document.getElementById("operatorInput").addEventListener("change", (e) => {
    seciliVeri().operator = e.target.value.trim();
    kaydet();
    render();
  });

  document.getElementById("adetArttirBtn").addEventListener("click", () => {
    seciliVeri().gerceklesen += 1;
    kaydet();
    render();
  });

  document.getElementById("barkodArttirBtn").addEventListener("click", () => {
    seciliVeri().gerceklesen += 1;
    kaydet();
    render();
  });

  document.getElementById("manuelAdetBtn").addEventListener("click", () => {
    const input = document.getElementById("manuelAdetInput");
    const adet = Number(input.value || 0);
    if (adet > 0) {
      seciliVeri().gerceklesen += adet;
      input.value = "";
      kaydet();
      render();
    }
  });
}

function durusKur() {
  document.getElementById("durusBaslatBtn").addEventListener("click", () => {
    const line = seciliVeri();
    if (line.aktifDurus) {
      alert("Bu hat zaten durmuş durumda.");
      return;
    }
    line.running = false;
    line.aktifDurus = {
      baslangic: new Date().toISOString(),
      sebep: document.getElementById("durusSebebiSecim").value
    };
    kaydet();
    render();
  });

  document.getElementById("durusBitirBtn").addEventListener("click", () => {
    const line = seciliVeri();
    if (!line.aktifDurus) {
      alert("Aktif duruş bulunamadı.");
      return;
    }
    const bitis = new Date().toISOString();
    const sureDakika = dakikayaYuvarla(new Date(bitis) - new Date(line.aktifDurus.baslangic));
    line.duruslar.push({
      ...line.aktifDurus,
      bitis,
      sureDakika
    });
    line.toplamDurusDakika += sureDakika;
    line.aktifDurus = null;
    line.running = true;
    kaydet();
    render();
  });
}

function ozetKartlariRender() {
  const container = document.getElementById("ozetKartlari");
  const data = Object.values(state.lines);
  const toplamHedef = data.reduce((a, b) => a + Number(b.hedef), 0);
  const toplamGerceklesen = data.reduce((a, b) => a + Number(b.gerceklesen), 0);
  const toplamDurus = data.reduce((a, b) => a + Number(b.toplamDurusDakika), 0);

  let enGeriHat = "-";
  let minOran = Infinity;
  HATLAR.forEach((hat) => {
    const l = state.lines[hat];
    if (l.hedef > 0) {
      const oran = l.gerceklesen / l.hedef;
      if (oran < minOran) {
        minOran = oran;
        enGeriHat = `${hat} (${Math.round(oran * 100)}%)`;
      }
    }
  });

  container.innerHTML = `
    <div class="summary-card"><h3>Toplam Hedef</h3><strong>${toplamHedef}</strong></div>
    <div class="summary-card"><h3>Toplam Gerçekleşen</h3><strong>${toplamGerceklesen}</strong></div>
    <div class="summary-card"><h3>Toplam Duruş</h3><strong>${toplamDurus} dk</strong></div>
    <div class="summary-card"><h3>En Geride Kalan Hat</h3><strong>${enGeriHat}</strong></div>
  `;

  const kritik = HATLAR
    .map((hat) => ({ hat, ...state.lines[hat], yuzde: paraYuzde(state.lines[hat].hedef, state.lines[hat].gerceklesen) }))
    .filter((x) => !x.running || x.yuzde < 70)
    .sort((a, b) => a.yuzde - b.yuzde)
    .slice(0, 6);

  const kritikContainer = document.getElementById("kritikHatlar");
  kritikContainer.innerHTML = "";
  if (!kritik.length) {
    kritikContainer.innerHTML = '<span class="chip">Kritik hat yok.</span>';
  } else {
    kritik.forEach((x) => {
      const chip = document.createElement("span");
      chip.className = "chip";
      chip.textContent = `${x.hat} • ${x.running ? "Çalışıyor" : "Durdu"} • ${x.yuzde}%`;
      kritikContainer.appendChild(chip);
    });
  }
}

function seciliHatPanelRender() {
  const l = seciliVeri();
  document.getElementById("hedefInput").value = l.hedef;
  document.getElementById("vardiyaInput").value = l.vardiya;
  document.getElementById("operatorInput").value = l.operator;
  document.getElementById("gerceklesenGostergesi").textContent = l.gerceklesen;
  document.getElementById("durusDurumuGostergesi").textContent = l.aktifDurus ? `Durdu (${l.aktifDurus.sebep})` : "Çalışıyor";
  document.getElementById("toplamDurusGostergesi").textContent = `${l.toplamDurusDakika} dk`;
  document.getElementById("basariYuzdesiGostergesi").textContent = `${paraYuzde(l.hedef, l.gerceklesen)}%`;

  const tbody = document.getElementById("durusTablosuBody");
  tbody.innerHTML = "";
  l.duruslar.slice().reverse().forEach((d) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${tarihSaat(d.baslangic)}</td><td>${tarihSaat(d.bitis)}</td><td>${d.sureDakika}</td><td>${d.sebep}</td>`;
    tbody.appendChild(tr);
  });

  if (l.aktifDurus) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${tarihSaat(l.aktifDurus.baslangic)}</td><td>-</td><td>Devam ediyor</td><td>${l.aktifDurus.sebep}</td>`;
    tbody.prepend(tr);
  }
}

function dashboardRender() {
  const grid = document.getElementById("dashboardGrid");
  grid.innerHTML = "";

  HATLAR.forEach((hat) => {
    const l = state.lines[hat];
    const yuzde = paraYuzde(l.hedef, l.gerceklesen);
    const card = document.createElement("article");
    let cls = "running";
    let durum = "Çalışıyor";

    if (!l.running || l.aktifDurus) {
      cls = "stopped";
      durum = "Durmuş";
    } else if (l.hedef > 0 && yuzde < 100) {
      cls = "behind";
      durum = "Hedef gerisi";
    }

    card.className = `dash-card ${cls}`;
    card.innerHTML = `
      <h3>${hat}</h3>
      <p>Hedef: <strong>${l.hedef}</strong></p>
      <p>Gerçekleşen: <strong>${l.gerceklesen}</strong></p>
      <p>Yüzde: <strong>${yuzde}%</strong></p>
      <p>Durum: <strong>${durum}</strong></p>
      <p>Vardiya: ${l.vardiya}</p>
      <p>Operatör: ${l.operator || "-"}</p>
    `;
    grid.appendChild(card);
  });
}

function raporMetniUret(tur) {
  const satirlar = [];
  const date = new Date().toLocaleString("tr-TR", { hour12: false });
  satirlar.push(`Rapor Türü: ${tur}`);
  satirlar.push(`Oluşturma: ${date}`);
  satirlar.push("-".repeat(50));

  if (tur === "duruş") {
    const map = {};
    HATLAR.forEach((hat) => {
      state.lines[hat].duruslar.forEach((d) => {
        map[d.sebep] = (map[d.sebep] || 0) + d.sureDakika;
      });
    });
    Object.entries(map).forEach(([sebep, dakika]) => {
      satirlar.push(`${sebep}: ${dakika} dk`);
    });
    if (!Object.keys(map).length) satirlar.push("Kayıt yok.");
  } else {
    HATLAR.forEach((hat) => {
      const l = state.lines[hat];
      const yuzde = paraYuzde(l.hedef, l.gerceklesen);
      satirlar.push(`${hat} | Vardiya: ${l.vardiya} | Hedef: ${l.hedef} | Gerçekleşen: ${l.gerceklesen} | %${yuzde} | Duruş: ${l.toplamDurusDakika} dk`);
    });
  }

  return satirlar.join("\n");
}

function raporKur() {
  const rapor = document.getElementById("raporCikti");
  document.getElementById("gunlukRaporBtn").addEventListener("click", () => {
    rapor.textContent = raporMetniUret("günlük");
  });
  document.getElementById("vardiyaRaporBtn").addEventListener("click", () => {
    rapor.textContent = raporMetniUret("vardiya");
  });
  document.getElementById("hatRaporBtn").addEventListener("click", () => {
    rapor.textContent = raporMetniUret("hat bazlı");
  });
  document.getElementById("durusRaporBtn").addEventListener("click", () => {
    rapor.textContent = raporMetniUret("duruş");
  });

  document.getElementById("csvDisaAktarBtn").addEventListener("click", () => {
    const rows = [["Tarih", "Hat", "Vardiya", "Operatör", "Hedef", "Gerçekleşen", "Yüzde", "Durum", "Toplam Duruş (dk)"]];
    HATLAR.forEach((hat) => {
      const l = state.lines[hat];
      const yuzde = paraYuzde(l.hedef, l.gerceklesen);
      rows.push([
        bugunStr(),
        hat,
        l.vardiya,
        l.operator || "",
        l.hedef,
        l.gerceklesen,
        yuzde,
        l.running ? "Çalışıyor" : "Durmuş",
        l.toplamDurusDakika
      ]);
    });

    const csv = rows.map((r) => r.map((c) => `"${String(c).replaceAll('"', '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `uretim-raporu-${bugunStr()}.csv`;
    a.click();
  });
}

function yardimciButonlarKur() {
  document.getElementById("veriTemizleBtn").addEventListener("click", () => {
    const onay = confirm("Tüm günlük veriler sıfırlansın mı?");
    if (!onay) return;
    state = varsayilanVeri();
    kaydet();
    render();
  });

  document.getElementById("tamEkranBtn").addEventListener("click", async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  });
}

function render() {
  ozetKartlariRender();
  seciliHatPanelRender();
  dashboardRender();
}

function init() {
  tabGecisKur();
  hatSecimiKur();
  lineKayitlariKur();
  durusKur();
  raporKur();
  yardimciButonlarKur();
  render();
}

init();

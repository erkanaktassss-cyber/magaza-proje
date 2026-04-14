const PRODUCTS = [
  {
    id: 1,
    name: 'Doğal Sıvı Sabun',
    category: 'Sıvı Sabun',
    price: 189,
    volume: '1000 ml',
    image: '🧴',
    desc: 'Bitki bazlı içeriklerle geliştirilen, cildi yormayan ve etkili hijyen sağlayan premium sıvı sabun.',
    features: ['Cilt dostu pH dengesi', 'Paraben ve ağır kimyasal içermez', 'Günlük kullanıma uygundur']
  },
  {
    id: 2,
    name: 'Konsantre Yüzey Temizleyici',
    category: 'Genel Temizlik',
    price: 229,
    volume: '750 ml',
    image: '✨',
    desc: 'Az miktarla yüksek etki sunan formülü sayesinde ev ve ofis yüzeylerinde güçlü temizlik sağlar.',
    features: ['Konsantre formül', 'Leke ve kir çözmede yüksek performans', 'Hoş ve ferah koku']
  },
  {
    id: 3,
    name: 'Cam Temizleyici',
    category: 'Mutfak Temizliği',
    price: 169,
    volume: '500 ml',
    image: '🪟',
    desc: 'İz bırakmayan özel yapısı ile cam, ayna ve parlak yüzeylerde kristal netliğinde sonuç verir.',
    features: ['İz bırakmaz', 'Hızlı kurur', 'Parlak yüzeylerle uyumlu']
  },
  {
    id: 4,
    name: 'Arap Sabunu',
    category: 'Genel Temizlik',
    price: 199,
    volume: '1000 ml',
    image: '🌿',
    desc: 'Geleneksel temizlik gücünü modern üretim kalitesiyle buluşturan doğal arap sabunu.',
    features: ['Çok amaçlı kullanım', 'Doğal bazlı formül', 'Yüksek çözünürlük']
  },
  {
    id: 5,
    name: 'Yağ Çözücü',
    category: 'Mutfak Temizliği',
    price: 209,
    volume: '750 ml',
    image: '🔥',
    desc: 'Mutfaklarda biriken ağır yağ tabakalarında hızlı etki gösteren profesyonel seviye yağ çözücü.',
    features: ['Güçlü yağ çözme', 'Kolay durulama', 'Yoğun kirlerde etkili']
  },
  {
    id: 6,
    name: 'Çok Amaçlı Temizleyici',
    category: 'Banyo ve Hijyen',
    price: 179,
    volume: '1000 ml',
    image: '🫧',
    desc: 'Banyo, lavabo, fayans ve genel alanlarda hijyen standardını yükselten etkili temizleyici.',
    features: ['Günlük hijyen desteği', 'Kalıcı ferahlık', 'Farklı yüzeylerle uyumlu']
  },
  {
    id: 7,
    name: 'Endüstriyel Zemin Temizleyici',
    category: 'Endüstriyel Temizlik',
    price: 399,
    volume: '5 L',
    image: '🏭',
    desc: 'Fabrika, depo ve üretim alanları için geliştirilen yüksek performanslı endüstriyel temizlik çözümü.',
    features: ['Ağır kirlerde üstün performans', 'Yoğun kullanıma uygun', 'Profesyonel kalite standardı']
  }
];

const CART_KEY = 'biolife_cart';

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function getProduct(id) {
  return PRODUCTS.find((p) => p.id === Number(id));
}

function addToCart(productId, qty = 1) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === Number(productId));
  if (existing) existing.qty += qty;
  else cart.push({ id: Number(productId), qty });
  saveCart(cart);
}

window.Shop = { PRODUCTS, getCart, saveCart, getProduct, addToCart };

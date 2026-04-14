const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: 'Doğal Sıvı Sabun',
    category: 'Sıvı Sabun',
    price: 189,
    volume: '1000 ml',
    image: '🧴',
    desc: 'Bitki bazlı içeriklerle geliştirilen, cildi yormayan ve etkili hijyen sağlayan premium sıvı sabun.',
    features: ['Cilt dostu pH dengesi', 'Paraben ve ağır kimyasal içermez', 'Günlük kullanıma uygundur'],
    active: true
  },
  {
    id: 2,
    name: 'Konsantre Yüzey Temizleyici',
    category: 'Genel Temizlik',
    price: 229,
    volume: '750 ml',
    image: '✨',
    desc: 'Az miktarla yüksek etki sunan formülü sayesinde ev ve ofis yüzeylerinde güçlü temizlik sağlar.',
    features: ['Konsantre formül', 'Leke ve kir çözmede yüksek performans', 'Hoş ve ferah koku'],
    active: true
  },
  {
    id: 3,
    name: 'Cam Temizleyici',
    category: 'Mutfak Temizliği',
    price: 169,
    volume: '500 ml',
    image: '🪟',
    desc: 'İz bırakmayan özel yapısı ile cam, ayna ve parlak yüzeylerde kristal netliğinde sonuç verir.',
    features: ['İz bırakmaz', 'Hızlı kurur', 'Parlak yüzeylerle uyumlu'],
    active: true
  },
  {
    id: 4,
    name: 'Arap Sabunu',
    category: 'Genel Temizlik',
    price: 199,
    volume: '1000 ml',
    image: '🌿',
    desc: 'Geleneksel temizlik gücünü modern üretim kalitesiyle buluşturan doğal arap sabunu.',
    features: ['Çok amaçlı kullanım', 'Doğal bazlı formül', 'Yüksek çözünürlük'],
    active: true
  },
  {
    id: 5,
    name: 'Yağ Çözücü',
    category: 'Mutfak Temizliği',
    price: 209,
    volume: '750 ml',
    image: '🔥',
    desc: 'Mutfaklarda biriken ağır yağ tabakalarında hızlı etki gösteren profesyonel seviye yağ çözücü.',
    features: ['Güçlü yağ çözme', 'Kolay durulama', 'Yoğun kirlerde etkili'],
    active: true
  },
  {
    id: 6,
    name: 'Çok Amaçlı Temizleyici',
    category: 'Banyo ve Hijyen',
    price: 179,
    volume: '1000 ml',
    image: '🫧',
    desc: 'Banyo, lavabo, fayans ve genel alanlarda hijyen standardını yükselten etkili temizleyici.',
    features: ['Günlük hijyen desteği', 'Kalıcı ferahlık', 'Farklı yüzeylerle uyumlu'],
    active: true
  },
  {
    id: 7,
    name: 'Endüstriyel Zemin Temizleyici',
    category: 'Endüstriyel Temizlik',
    price: 399,
    volume: '5 L',
    image: '🏭',
    desc: 'Fabrika, depo ve üretim alanları için geliştirilen yüksek performanslı endüstriyel temizlik çözümü.',
    features: ['Ağır kirlerde üstün performans', 'Yoğun kullanıma uygun', 'Profesyonel kalite standardı'],
    active: true
  }
];

const DEFAULT_CATEGORIES = ['Sıvı Sabun', 'Genel Temizlik', 'Mutfak Temizliği', 'Banyo ve Hijyen', 'Endüstriyel Temizlik'];

const DEFAULT_CONTENT = {
  homeSlogan: 'Premium Doğal Üretim',
  bannerTitle: 'Doğal Temizlik, Gerçek Hijyen',
  aboutShort: 'BIOLIFE, doğal ve etkili temizlik ürünleri alanında güvenilir bir çözüm ortağı olma hedefiyle kurulmuştur.',
  contactEmail: 'destek@biolife.com.tr',
  contactPhone: '+90 (212) 444 24 53',
  contactAddress: 'İstanbul, Türkiye'
};

const DEFAULT_SETTINGS = {
  siteName: 'BIOLIFE',
  currency: 'TRY',
  adminEmail: 'admin@biolife.com',
  adminPassword: 'Biolife123!'
};

const STORAGE_KEYS = {
  cart: 'biolife_cart',
  products: 'biolife_products',
  categories: 'biolife_categories',
  content: 'biolife_content',
  settings: 'biolife_settings',
  session: 'biolife_admin_session'
};

function parseJSON(key, fallback) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function seedData() {
  if (!localStorage.getItem(STORAGE_KEYS.products)) {
    localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(DEFAULT_PRODUCTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.categories)) {
    localStorage.setItem(STORAGE_KEYS.categories, JSON.stringify(DEFAULT_CATEGORIES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.content)) {
    localStorage.setItem(STORAGE_KEYS.content, JSON.stringify(DEFAULT_CONTENT));
  }
  if (!localStorage.getItem(STORAGE_KEYS.settings)) {
    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(DEFAULT_SETTINGS));
  }
}

function getAllProducts() {
  return parseJSON(STORAGE_KEYS.products, DEFAULT_PRODUCTS);
}

function getProducts() {
  return getAllProducts().filter((product) => product.active !== false);
}

function saveProducts(products) {
  localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(products));
}

function getProduct(id, includeInactive = false) {
  const list = includeInactive ? getAllProducts() : getProducts();
  return list.find((p) => p.id === Number(id));
}

function addProduct(product) {
  const list = getAllProducts();
  const id = list.length ? Math.max(...list.map((item) => item.id)) + 1 : 1;
  list.push({ ...product, id });
  saveProducts(list);
  return id;
}

function updateProduct(id, payload) {
  const list = getAllProducts().map((item) => (item.id === Number(id) ? { ...item, ...payload, id: item.id } : item));
  saveProducts(list);
}

function deleteProduct(id) {
  const next = getAllProducts().filter((item) => item.id !== Number(id));
  saveProducts(next);
}

function getCategories() {
  return parseJSON(STORAGE_KEYS.categories, DEFAULT_CATEGORIES);
}

function saveCategories(categories) {
  localStorage.setItem(STORAGE_KEYS.categories, JSON.stringify(categories));
}

function addCategory(name) {
  const categories = getCategories();
  if (!categories.includes(name)) {
    categories.push(name);
    saveCategories(categories);
  }
}

function updateCategory(oldName, newName) {
  const categories = getCategories().map((item) => (item === oldName ? newName : item));
  saveCategories(categories);
  const products = getAllProducts().map((item) => (item.category === oldName ? { ...item, category: newName } : item));
  saveProducts(products);
}

function getContent() {
  return parseJSON(STORAGE_KEYS.content, DEFAULT_CONTENT);
}

function saveContent(payload) {
  localStorage.setItem(STORAGE_KEYS.content, JSON.stringify({ ...getContent(), ...payload }));
}

function getSettings() {
  return parseJSON(STORAGE_KEYS.settings, DEFAULT_SETTINGS);
}

function saveSettings(payload) {
  localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify({ ...getSettings(), ...payload }));
}

function getCart() {
  return parseJSON(STORAGE_KEYS.cart, []);
}

function saveCart(cart) {
  localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart));
}

function addToCart(productId, qty = 1) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === Number(productId));
  if (existing) existing.qty += qty;
  else cart.push({ id: Number(productId), qty });
  saveCart(cart);
}

function loginAdmin(email, password) {
  const settings = getSettings();
  const ok = email === settings.adminEmail && password === settings.adminPassword;
  if (ok) {
    localStorage.setItem(STORAGE_KEYS.session, JSON.stringify({ loggedIn: true, loginAt: Date.now() }));
  }
  return ok;
}

function isAdminLoggedIn() {
  const session = parseJSON(STORAGE_KEYS.session, { loggedIn: false });
  return Boolean(session.loggedIn);
}

function logoutAdmin() {
  localStorage.removeItem(STORAGE_KEYS.session);
}

seedData();

window.Shop = {
  STORAGE_KEYS,
  getProducts,
  getAllProducts,
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  addCategory,
  updateCategory,
  getContent,
  saveContent,
  getSettings,
  saveSettings,
  getCart,
  saveCart,
  addToCart,
  loginAdmin,
  isAdminLoggedIn,
  logoutAdmin
};

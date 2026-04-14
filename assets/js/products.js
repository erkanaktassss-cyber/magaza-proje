const PRODUCTS = [
  { id: 1, name: 'Aurora Akıllı Saat', price: 3499, emoji: '⌚', desc: 'Sağlık takibi ve premium metal kasa.' },
  { id: 2, name: 'Nova Kablosuz Kulaklık', price: 2199, emoji: '🎧', desc: 'Aktif gürültü engelleme ve 30 saat pil ömrü.' },
  { id: 3, name: 'Luna Deri Çanta', price: 2899, emoji: '👜', desc: 'El işçiliği hakiki deri, zamansız tasarım.' },
  { id: 4, name: 'Vortex Sneaker', price: 2599, emoji: '👟', desc: 'Gün boyu konfor ve modern sokak stili.' },
  { id: 5, name: 'Mira Güneş Gözlüğü', price: 1599, emoji: '🕶️', desc: 'UV400 koruma ve hafif çerçeve.' },
  { id: 6, name: 'Atlas Sırt Çantası', price: 1899, emoji: '🎒', desc: 'Su geçirmez kumaş, şehir içi kullanım için ideal.' }
];

const CART_KEY = 'magazapro_cart';

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

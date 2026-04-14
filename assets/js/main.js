function money(value) {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(value);
}

function cartCount() {
  return window.Shop.getCart().reduce((sum, item) => sum + item.qty, 0);
}

function updateCartBadge() {
  const badge = document.getElementById('cart-count');
  if (badge) badge.textContent = cartCount();
}

function cardTemplate(product, base = '') {
  return `
    <article class="product-card">
      <div class="product-media">${product.emoji}</div>
      <div class="product-body">
        <h3 class="product-title">${product.name}</h3>
        <p class="product-desc">${product.desc}</p>
        <div class="price">${money(product.price)}</div>
        <div class="product-actions">
          <a class="btn btn-outline" href="${base}product.html?id=${product.id}">İncele</a>
          <button class="btn btn-primary add-btn" data-id="${product.id}">Sepete Ekle</button>
        </div>
      </div>
    </article>
  `;
}

function renderHomeFeatured() {
  const container = document.getElementById('featured-products');
  if (!container) return;
  container.innerHTML = window.Shop.PRODUCTS.slice(0, 4).map((p) => cardTemplate(p, 'pages/')).join('');
}

function renderProductsPage() {
  const container = document.getElementById('all-products');
  if (!container) return;
  container.innerHTML = window.Shop.PRODUCTS.map((p) => cardTemplate(p)).join('');
}

function renderProductDetail() {
  const container = document.getElementById('product-detail');
  if (!container) return;
  const id = new URLSearchParams(window.location.search).get('id') || '1';
  const product = window.Shop.getProduct(id);

  if (!product) {
    container.innerHTML = '<p>Ürün bulunamadı.</p>';
    return;
  }

  container.innerHTML = `
    <div class="detail-wrap">
      <div class="detail-media">${product.emoji}</div>
      <div class="detail-content">
        <p class="eyebrow">Premium Koleksiyon</p>
        <h1>${product.name}</h1>
        <p class="hero-text">${product.desc} Ürün, yüksek kalite standartlarında üretilmiştir ve günlük kullanım için idealdir.</p>
        <p class="price">${money(product.price)}</p>
        <button class="btn btn-primary add-btn" data-id="${product.id}">Sepete Ekle</button>
      </div>
    </div>
  `;
}

function renderCartPage() {
  const el = document.getElementById('cart-content');
  if (!el) return;
  const cart = window.Shop.getCart();

  if (!cart.length) {
    el.innerHTML = '<p class="cart-item">Sepetiniz boş. <a href="products.html">Ürünlere göz atın.</a></p>';
    return;
  }

  const rows = cart.map((item) => {
    const p = window.Shop.getProduct(item.id);
    if (!p) return '';
    return `
      <div class="cart-item">
        <div><strong>${p.name}</strong><br><small>${money(p.price)} x ${item.qty}</small></div>
        <div>${money(p.price * item.qty)}</div>
        <button class="btn btn-outline remove-btn" data-id="${p.id}">Kaldır</button>
      </div>
    `;
  }).join('');

  const total = cart.reduce((sum, item) => {
    const p = window.Shop.getProduct(item.id);
    return p ? sum + p.price * item.qty : sum;
  }, 0);

  el.innerHTML = `${rows}<div class="cart-summary"><h3>Toplam: ${money(total)}</h3><button id="clear-cart" class="btn btn-ghost">Sepeti Temizle</button></div>`;
}

function bindEvents() {
  document.addEventListener('click', (e) => {
    const addBtn = e.target.closest('.add-btn');
    if (addBtn) {
      window.Shop.addToCart(addBtn.dataset.id, 1);
      updateCartBadge();
      addBtn.textContent = 'Eklendi ✓';
      setTimeout(() => { addBtn.textContent = 'Sepete Ekle'; }, 900);
    }

    const removeBtn = e.target.closest('.remove-btn');
    if (removeBtn) {
      const next = window.Shop.getCart().filter((item) => item.id !== Number(removeBtn.dataset.id));
      window.Shop.saveCart(next);
      updateCartBadge();
      renderCartPage();
    }

    if (e.target.id === 'clear-cart') {
      window.Shop.saveCart([]);
      updateCartBadge();
      renderCartPage();
    }
  });

  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = document.getElementById('login-message');
      msg.textContent = 'Giriş başarılı! Yönlendiriliyorsunuz...';
      setTimeout(() => { window.location.href = '../index.html'; }, 900);
    });
  }
}

renderHomeFeatured();
renderProductsPage();
renderProductDetail();
renderCartPage();
bindEvents();
updateCartBadge();

function money(value) {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0
  }).format(value);
}

function cartCount() {
  return window.Shop.getCart().reduce((sum, item) => sum + item.qty, 0);
}

function updateCartBadge() {
  const badge = document.getElementById('cart-count');
  if (badge) badge.textContent = cartCount();
}

function productCard(product, base = '') {
  return `
    <article class="product-card">
      <div class="product-media">${product.image}</div>
      <div class="product-body">
        <span class="chip">${product.category}</span>
        <h3 class="product-title">${product.name}</h3>
        <p class="product-desc">${product.desc}</p>
        <div class="product-meta">
          <span>${product.volume}</span>
          <strong>${money(product.price)}</strong>
        </div>
        <div class="product-actions">
          <a class="btn btn-soft" href="${base}product.html?id=${product.id}">Detay</a>
          <button class="btn btn-primary add-btn" data-id="${product.id}">Sepete Ekle</button>
        </div>
      </div>
    </article>
  `;
}

function renderHomeFeatured() {
  const container = document.getElementById('featured-products');
  if (!container) return;
  container.innerHTML = window.Shop.PRODUCTS.slice(0, 6).map((p) => productCard(p, 'pages/')).join('');
}

function renderProductsPage() {
  const container = document.getElementById('all-products');
  if (!container) return;

  const activeCategory = document.querySelector('.filter-btn.active')?.dataset.category || 'Tümü';
  const data = activeCategory === 'Tümü'
    ? window.Shop.PRODUCTS
    : window.Shop.PRODUCTS.filter((p) => p.category === activeCategory);

  container.innerHTML = data.map((p) => productCard(p)).join('');
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
      <div class="detail-media">${product.image}</div>
      <div class="detail-content">
        <span class="chip">${product.category}</span>
        <h1>${product.name}</h1>
        <p class="hero-text">${product.desc}</p>
        <ul class="feature-list">
          ${product.features.map((feature) => `<li>${feature}</li>`).join('')}
        </ul>
        <div class="detail-bottom">
          <strong class="detail-price">${money(product.price)}</strong>
          <button class="btn btn-primary add-btn" data-id="${product.id}">Sepete Ekle</button>
        </div>
      </div>
    </div>
  `;
}

function renderCartPage() {
  const el = document.getElementById('cart-content');
  if (!el) return;

  const cart = window.Shop.getCart();
  if (!cart.length) {
    el.innerHTML = '<p class="empty-state">Sepetiniz şu an boş. BIOLIFE ürünlerini keşfetmek için ürünler sayfasına geçebilirsiniz.</p>';
    return;
  }

  const rows = cart.map((item) => {
    const p = window.Shop.getProduct(item.id);
    if (!p) return '';
    return `
      <div class="cart-item">
        <div>
          <strong>${p.name}</strong>
          <small>${p.volume} • ${money(p.price)} x ${item.qty}</small>
        </div>
        <strong>${money(p.price * item.qty)}</strong>
        <button class="btn btn-soft remove-btn" data-id="${p.id}">Sil</button>
      </div>
    `;
  }).join('');

  const total = cart.reduce((sum, item) => {
    const p = window.Shop.getProduct(item.id);
    return p ? sum + p.price * item.qty : sum;
  }, 0);

  el.innerHTML = `${rows}
    <div class="cart-summary">
      <h3>Genel Toplam: ${money(total)}</h3>
      <div class="hero-cta">
        <button id="clear-cart" class="btn btn-soft">Sepeti Temizle</button>
        <button class="btn btn-primary">Siparişi Tamamla</button>
      </div>
    </div>`;
}

function bindEvents() {
  document.addEventListener('click', (e) => {
    const addBtn = e.target.closest('.add-btn');
    if (addBtn) {
      window.Shop.addToCart(addBtn.dataset.id, 1);
      updateCartBadge();
      const text = addBtn.textContent;
      addBtn.textContent = 'Eklendi ✓';
      setTimeout(() => { addBtn.textContent = text; }, 900);
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

    const filterBtn = e.target.closest('.filter-btn');
    if (filterBtn) {
      document.querySelectorAll('.filter-btn').forEach((btn) => btn.classList.remove('active'));
      filterBtn.classList.add('active');
      renderProductsPage();
    }

    const navToggle = e.target.closest('#nav-toggle');
    if (navToggle) {
      document.querySelector('.main-nav')?.classList.toggle('open');
    }
  });

  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = document.getElementById('login-message');
      msg.textContent = 'Giriş başarılı. BIOLIFE hesabınıza yönlendiriliyorsunuz...';
      setTimeout(() => { window.location.href = '../index.html'; }, 900);
    });
  }

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = document.getElementById('contact-message');
      msg.textContent = 'Mesajınız alındı. En kısa sürede sizinle iletişime geçeceğiz.';
      contactForm.reset();
    });
  }
}

renderHomeFeatured();
renderProductsPage();
renderProductDetail();
renderCartPage();
bindEvents();
updateCartBadge();

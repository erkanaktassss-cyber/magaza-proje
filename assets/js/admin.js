function showFeedback(message, type = 'success') {
  const el = document.getElementById('admin-feedback') || document.getElementById('admin-login-message');
  if (!el) return;
  el.textContent = message;
  el.className = type === 'error' ? 'text-error' : 'text-success';
}

function renderStats() {
  const box = document.getElementById('admin-stats');
  if (!box) return;
  const products = window.Shop.getAllProducts();
  const categories = window.Shop.getCategories();
  const activeCount = products.filter((p) => p.active !== false).length;
  box.innerHTML = `
    <article class="stat-card"><h3>Toplam Ürün</h3><strong>${products.length}</strong></article>
    <article class="stat-card"><h3>Aktif Ürün</h3><strong>${activeCount}</strong></article>
    <article class="stat-card"><h3>Pasif Ürün</h3><strong>${products.length - activeCount}</strong></article>
    <article class="stat-card"><h3>Kategori</h3><strong>${categories.length}</strong></article>
  `;
}

function fillCategoryOptions() {
  const select = document.getElementById('product-category');
  if (!select) return;
  const categories = window.Shop.getCategories();
  select.innerHTML = categories.map((name) => `<option value="${name}">${name}</option>`).join('');
}

function renderProductsAdmin() {
  const list = document.getElementById('admin-products-list');
  if (!list) return;
  const products = window.Shop.getAllProducts();
  list.innerHTML = products.map((product) => `
    <article class="admin-list-item">
      <div>
        <strong>${product.name}</strong>
        <small>${product.category} • ${product.price} ₺ • ${product.active === false ? 'Pasif' : 'Aktif'}</small>
      </div>
      <div class="admin-row-actions">
        <button class="btn btn-soft edit-product" data-id="${product.id}">Düzenle</button>
        <button class="btn btn-soft danger delete-product" data-id="${product.id}">Sil</button>
      </div>
    </article>
  `).join('');
}

function renderCategoriesAdmin() {
  const list = document.getElementById('admin-categories-list');
  if (!list) return;
  const categories = window.Shop.getCategories();
  list.innerHTML = categories.map((name) => `
    <article class="admin-list-item">
      <strong>${name}</strong>
      <button class="btn btn-soft edit-category" data-name="${name}">Düzenle</button>
    </article>
  `).join('');
}

function resetProductForm() {
  const form = document.getElementById('product-form');
  if (!form) return;
  form.reset();
  document.getElementById('product-id').value = '';
}

function bindAdminNav() {
  const nav = document.getElementById('admin-nav');
  if (!nav) return;
  nav.addEventListener('click', (e) => {
    const btn = e.target.closest('.admin-nav-btn');
    if (!btn) return;
    const section = btn.dataset.section;
    document.querySelectorAll('.admin-nav-btn').forEach((item) => item.classList.remove('active'));
    document.querySelectorAll('.admin-section').forEach((item) => item.classList.remove('active'));
    btn.classList.add('active');
    document.querySelector(`.admin-section[data-section="${section}"]`)?.classList.add('active');
  });
}

function bindProductForm() {
  const form = document.getElementById('product-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('product-id').value;
    const payload = {
      name: document.getElementById('product-name').value.trim(),
      price: Number(document.getElementById('product-price').value),
      desc: document.getElementById('product-desc').value.trim(),
      category: document.getElementById('product-category').value,
      image: document.getElementById('product-image').value.trim(),
      volume: document.getElementById('product-volume').value.trim() || '-',
      features: document.getElementById('product-features').value.split(',').map((x) => x.trim()).filter(Boolean),
      active: document.getElementById('product-active').value === 'true'
    };

    if (id) window.Shop.updateProduct(id, payload);
    else window.Shop.addProduct(payload);

    resetProductForm();
    fillCategoryOptions();
    renderProductsAdmin();
    renderStats();
    showFeedback('Ürün başarıyla kaydedildi.');
  });

  document.getElementById('product-reset')?.addEventListener('click', resetProductForm);

  document.getElementById('admin-products-list')?.addEventListener('click', (e) => {
    const editBtn = e.target.closest('.edit-product');
    const deleteBtn = e.target.closest('.delete-product');

    if (editBtn) {
      const product = window.Shop.getProduct(editBtn.dataset.id, true);
      if (!product) return;
      document.getElementById('product-id').value = product.id;
      document.getElementById('product-name').value = product.name;
      document.getElementById('product-price').value = product.price;
      document.getElementById('product-desc').value = product.desc;
      document.getElementById('product-category').value = product.category;
      document.getElementById('product-image').value = product.image;
      document.getElementById('product-volume').value = product.volume || '';
      document.getElementById('product-features').value = (product.features || []).join(', ');
      document.getElementById('product-active').value = String(product.active !== false);
      showFeedback('Ürün düzenleme için forma yüklendi.');
    }

    if (deleteBtn) {
      window.Shop.deleteProduct(deleteBtn.dataset.id);
      renderProductsAdmin();
      renderStats();
      showFeedback('Ürün silindi.');
    }
  });
}

function bindCategoryForm() {
  const form = document.getElementById('category-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const oldName = document.getElementById('category-old').value;
    const newName = document.getElementById('category-name').value.trim();
    if (!newName) return;
    if (oldName) window.Shop.updateCategory(oldName, newName);
    else window.Shop.addCategory(newName);
    form.reset();
    document.getElementById('category-old').value = '';
    fillCategoryOptions();
    renderCategoriesAdmin();
    renderProductsAdmin();
    renderStats();
    showFeedback('Kategori kaydedildi.');
  });

  document.getElementById('admin-categories-list')?.addEventListener('click', (e) => {
    const edit = e.target.closest('.edit-category');
    if (!edit) return;
    document.getElementById('category-old').value = edit.dataset.name;
    document.getElementById('category-name').value = edit.dataset.name;
    showFeedback('Kategori düzenleme için forma yüklendi.');
  });

  document.getElementById('category-reset')?.addEventListener('click', () => {
    form.reset();
    document.getElementById('category-old').value = '';
  });
}

function bindContentForm() {
  const form = document.getElementById('content-form');
  if (!form) return;

  const content = window.Shop.getContent();
  Object.keys(content).forEach((key) => {
    const input = document.getElementById(`content-${key}`);
    if (input) input.value = content[key];
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const payload = {
      homeSlogan: document.getElementById('content-homeSlogan').value,
      bannerTitle: document.getElementById('content-bannerTitle').value,
      aboutShort: document.getElementById('content-aboutShort').value,
      contactEmail: document.getElementById('content-contactEmail').value,
      contactPhone: document.getElementById('content-contactPhone').value,
      contactAddress: document.getElementById('content-contactAddress').value
    };
    window.Shop.saveContent(payload);
    showFeedback('Site içerikleri kaydedildi.');
  });
}

function bindSettingsForm() {
  const form = document.getElementById('settings-form');
  if (!form) return;
  const settings = window.Shop.getSettings();
  document.getElementById('settings-siteName').value = settings.siteName;
  document.getElementById('settings-currency').value = settings.currency;
  document.getElementById('settings-adminEmail').value = settings.adminEmail;
  document.getElementById('settings-adminPassword').value = settings.adminPassword;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    window.Shop.saveSettings({
      siteName: document.getElementById('settings-siteName').value,
      currency: document.getElementById('settings-currency').value,
      adminEmail: document.getElementById('settings-adminEmail').value,
      adminPassword: document.getElementById('settings-adminPassword').value
    });
    showFeedback('Ayarlar güncellendi.');
  });
}

function bootAdminLogin() {
  const loginForm = document.getElementById('admin-login-form');
  if (!loginForm) return;
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('admin-email').value.trim();
    const password = document.getElementById('admin-password').value;
    if (window.Shop.loginAdmin(email, password)) {
      showFeedback('Giriş başarılı. Yönetim paneline yönlendiriliyorsunuz...');
      setTimeout(() => { window.location.href = 'admin.html'; }, 600);
    } else {
      showFeedback('Giriş başarısız. Bilgilerinizi kontrol edin.', 'error');
    }
  });
}

function bootAdminPanel() {
  if (!document.querySelector('.admin-layout')) return;
  if (!window.Shop.isAdminLoggedIn()) {
    window.location.href = 'admin-login.html';
    return;
  }

  bindAdminNav();
  fillCategoryOptions();
  renderProductsAdmin();
  renderCategoriesAdmin();
  renderStats();
  bindProductForm();
  bindCategoryForm();
  bindContentForm();
  bindSettingsForm();

  document.getElementById('admin-logout')?.addEventListener('click', () => {
    window.Shop.logoutAdmin();
    window.location.href = 'admin-login.html';
  });
}

bootAdminLogin();
bootAdminPanel();

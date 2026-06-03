const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '..', 'data');
const DATA_FILE = process.env.DATA_FILE || path.join(DATA_DIR, 'store.json');

const now = () => new Date().toISOString();

const categorySeeds = [
  { name: 'Doğal Temizlik', slug: 'dogal-temizlik', description: 'Doğal içerikli genel temizlik ürünleri' },
  { name: 'Hijyen Ürünleri', slug: 'hijyen-urunleri', description: 'Ev ve kişisel hijyen çözümleri' },
  { name: 'Endüstriyel Çözümler', slug: 'endustriyel-cozumler', description: 'Profesyonel temizlik ihtiyaçları için ürünler' }
];

const productSeeds = [
  ['Sıvı Sabun Premium', 'sivi-sabun-premium', 'Bitkisel bazlı, cilt dostu sıvı sabun.', 149.9, 120, 'https://images.unsplash.com/photo-1584305574647-acf8069a3d2b?w=800'],
  ['Yüzey Temizleyici', 'yuzey-temizleyici', 'Doğal ferahlık veren çok amaçlı yüzey temizleyici.', 179.5, 90, 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=800'],
  ['Cam Temizleyici', 'cam-temizleyici', 'İz bırakmayan doğal cam temizleme formülü.', 129, 110, 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800'],
  ['Arap Sabunu', 'arap-sabunu', 'Geleneksel formülle güçlü doğal temizlik.', 219, 70, 'https://images.unsplash.com/photo-1610555356070-d0efb6505f81?w=800'],
  ['Yağ Çözücü Pro', 'yag-cozucu-pro', 'Mutfak ve ağır kirlerde etkili yağ çözücü.', 199.9, 65, 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800'],
  ['Hijyen Dezenfektanı', 'hijyen-dezenfektani', 'Alkol bazlı hızlı hijyen çözümü.', 99.9, 200, 'https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=800']
];

const withCategoryName = (product, categories) => ({
  ...product,
  category_name: categories.find((category) => category.id === product.category_id)?.name || null
});

class JsonStore {
  constructor(filePath) {
    this.filePath = filePath;
    this.data = this.load();
  }

  load() {
    fs.mkdirSync(path.dirname(this.filePath), { recursive: true });
    if (fs.existsSync(this.filePath)) {
      return JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
    }

    const createdAt = now();
    const categories = categorySeeds.map((category, index) => ({ id: index + 1, ...category, created_at: createdAt }));
    const products = productSeeds.map(([name, slug, description, price, stock, imageUrl], index) => ({
      id: index + 1,
      category_id: categories[index % categories.length].id,
      name,
      slug,
      description,
      price,
      stock,
      image_url: imageUrl,
      is_active: true,
      created_at: createdAt,
      updated_at: createdAt
    }));

    const data = {
      users: [
        {
          id: 1,
          full_name: 'BIOLIFE Admin',
          email: 'admin@biolife.com',
          password_hash: bcrypt.hashSync('Admin1234!', 10),
          phone: '+90 555 000 00 00',
          role: 'admin',
          created_at: createdAt
        },
        {
          id: 2,
          full_name: 'Test Müşteri',
          email: 'musteri@biolife.com',
          password_hash: bcrypt.hashSync('User1234!', 10),
          phone: '+90 555 111 11 11',
          role: 'customer',
          created_at: createdAt
        }
      ],
      categories,
      products,
      reviews: [
        {
          id: 1,
          product_id: 1,
          user_id: 2,
          name: 'Test Müşteri',
          rating: 5,
          comment: 'Demo mağaza için harika bir başlangıç ürünü.',
          status: 'approved',
          created_at: createdAt
        }
      ],
      orders: [],
      order_items: [],
      contact_messages: []
    };

    this.saveData(data);
    return data;
  }

  save() {
    this.saveData(this.data);
  }

  saveData(data) {
    fs.writeFileSync(this.filePath, `${JSON.stringify(data, null, 2)}\n`);
  }

  nextId(collection) {
    return this.data[collection].reduce((max, item) => Math.max(max, Number(item.id)), 0) + 1;
  }

  publicUser(id) {
    const user = this.data.users.find((item) => item.id === Number(id));
    if (!user) return null;
    const { password_hash: passwordHash, ...safeUser } = user;
    return safeUser;
  }

  getUserById(id) {
    return this.publicUser(id);
  }

  getUserByEmail(email, role = null) {
    return this.data.users.find((user) => user.email === email && (!role || user.role === role)) || null;
  }

  createUser({ fullName, email, passwordHash, phone, role = 'customer' }) {
    if (this.data.users.some((user) => user.email === email)) throw new Error('Bu e-posta zaten kayıtlı.');
    const user = { id: this.nextId('users'), full_name: fullName, email, password_hash: passwordHash, phone, role, created_at: now() };
    this.data.users.push(user);
    this.save();
    return user;
  }

  getCategories() {
    return [...this.data.categories].sort((a, b) => a.name.localeCompare(b.name, 'tr'));
  }

  getAdminCategories() {
    return [...this.data.categories].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  createCategory({ name, slug, description }) {
    const category = { id: this.nextId('categories'), name, slug, description, created_at: now() };
    this.data.categories.push(category);
    this.save();
    return category;
  }

  deleteCategory(id) {
    const categoryId = Number(id);
    this.data.categories = this.data.categories.filter((category) => category.id !== categoryId);
    this.data.products = this.data.products.map((product) => (product.category_id === categoryId ? { ...product, category_id: null } : product));
    this.save();
  }

  getHomeProducts() {
    return this.getProducts({ activeOnly: true }).slice(0, 6);
  }

  getProducts({ categorySlug = null, activeOnly = true } = {}) {
    return this.data.products
      .filter((product) => (!activeOnly || product.is_active) && (!categorySlug || this.data.categories.find((category) => category.id === product.category_id)?.slug === categorySlug))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .map((product) => withCategoryName(product, this.data.categories));
  }

  getProductBySlug(slug) {
    const product = this.data.products.find((item) => item.slug === slug);
    return product ? withCategoryName(product, this.data.categories) : null;
  }

  getProductForCart(productId) {
    const product = this.data.products.find((item) => item.id === Number(productId) && item.is_active);
    if (!product) return null;
    const { id, name, slug, price, stock, image_url: imageUrl } = product;
    return { id, name, slug, price, stock, image_url: imageUrl };
  }

  createProduct(input) {
    const timestamp = now();
    const product = {
      id: this.nextId('products'),
      category_id: input.categoryId ? Number(input.categoryId) : null,
      name: input.name,
      slug: input.slug,
      description: input.description || '',
      price: Number(input.price),
      stock: Number(input.stock),
      image_url: input.imageUrl || '',
      is_active: Boolean(input.isActive),
      created_at: timestamp,
      updated_at: timestamp
    };
    this.data.products.push(product);
    this.save();
    return product;
  }

  updateProduct(id, input) {
    const product = this.data.products.find((item) => item.id === Number(id));
    if (!product) return null;
    Object.assign(product, {
      category_id: input.categoryId ? Number(input.categoryId) : null,
      name: input.name,
      slug: input.slug,
      description: input.description || '',
      price: Number(input.price),
      stock: Number(input.stock),
      image_url: input.imageUrl || '',
      is_active: Boolean(input.isActive),
      updated_at: now()
    });
    this.save();
    return product;
  }

  deleteProduct(id) {
    const productId = Number(id);
    this.data.products = this.data.products.filter((product) => product.id !== productId);
    this.data.reviews = this.data.reviews.filter((review) => review.product_id !== productId);
    this.save();
  }

  getApprovedReviews(productSlug = null) {
    let reviews = this.data.reviews.filter((review) => review.status === 'approved');
    if (productSlug) {
      const product = this.getProductBySlug(productSlug);
      reviews = product ? reviews.filter((review) => review.product_id === product.id) : [];
    }
    return reviews
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .map((review) => ({ ...review, product_name: this.data.products.find((product) => product.id === review.product_id)?.name || 'Silinmiş ürün' }));
  }

  getAdminReviews() {
    return this.data.reviews
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .map((review) => ({ ...review, product_name: this.data.products.find((product) => product.id === review.product_id)?.name || 'Silinmiş ürün' }));
  }

  createReview({ productId, userId, name, rating, comment, status = 'pending' }) {
    this.data.reviews.push({ id: this.nextId('reviews'), product_id: Number(productId), user_id: userId ? Number(userId) : null, name, rating: Number(rating), comment, status, created_at: now() });
    this.save();
  }

  approveReview(id) {
    const review = this.data.reviews.find((item) => item.id === Number(id));
    if (review) review.status = 'approved';
    this.save();
  }

  deleteReview(id) {
    this.data.reviews = this.data.reviews.filter((review) => review.id !== Number(id));
    this.save();
  }

  createOrder({ userId, cart, customerName, customerEmail, customerPhone, shippingAddress, total }) {
    const orderNumber = `BL-${Date.now()}`;
    const timestamp = now();
    const order = {
      id: this.nextId('orders'),
      user_id: userId ? Number(userId) : null,
      order_number: orderNumber,
      status: 'processing',
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      shipping_address: shippingAddress,
      payment_method: 'sandbox',
      payment_status: 'sandbox_paid',
      total_amount: Number(total.toFixed(2)),
      created_at: timestamp,
      updated_at: timestamp
    };
    this.data.orders.push(order);

    cart.forEach((item) => {
      this.data.order_items.push({
        id: this.nextId('order_items'),
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        unit_price: item.price,
        line_total: Number((item.price * item.quantity).toFixed(2))
      });
      const product = this.data.products.find((candidate) => candidate.id === item.id);
      if (product) {
        product.stock = Math.max(product.stock - item.quantity, 0);
        product.updated_at = timestamp;
      }
    });

    this.save();
    return order;
  }

  getOrders() {
    return [...this.data.orders].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  updateOrderStatus(id, status) {
    const order = this.data.orders.find((item) => item.id === Number(id));
    if (order) {
      order.status = status;
      order.updated_at = now();
      this.save();
    }
  }

  createContactMessage({ fullName, email, phone, message }) {
    this.data.contact_messages.push({ id: this.nextId('contact_messages'), full_name: fullName, email, phone, message, created_at: now() });
    this.save();
  }

  getContactMessages() {
    return [...this.data.contact_messages].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  getCustomers() {
    return this.data.users.filter((user) => user.role === 'customer').sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  getStats() {
    return {
      products: this.data.products.length,
      orders: this.data.orders.length,
      customers: this.data.users.filter((user) => user.role === 'customer').length,
      messages: this.data.contact_messages.length
    };
  }
}

module.exports = new JsonStore(DATA_FILE);

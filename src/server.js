const path = require('path');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const methodOverride = require('method-override');
const store = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24
    }
  })
);

app.use((req, res, next) => {
  res.locals.currentUser = req.session.userId ? store.getUserById(req.session.userId) : null;
  res.locals.cart = req.session.cart || [];
  next();
});

const auth = (req, res, next) => {
  if (!req.session.userId) return res.redirect('/login');
  return next();
};

const adminOnly = (req, res, next) => {
  if (!req.session.userId) return res.redirect('/admin/login');
  const user = store.getUserById(req.session.userId);
  if (!user || user.role !== 'admin') return res.redirect('/admin/login');
  return next();
};

const withLayoutData = () => ({ categories: store.getCategories() });
const cartTotal = (cart) => cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

app.get('/', (req, res) => {
  res.render('home', {
    products: store.getHomeProducts(),
    reviews: store.getApprovedReviews().slice(0, 4),
    ...withLayoutData()
  });
});

app.get('/products', (req, res) => {
  const { category } = req.query;
  res.render('products', {
    products: store.getProducts({ categorySlug: category || null }),
    ...withLayoutData(),
    activeCategory: category || null
  });
});

app.get('/products/:slug', (req, res) => {
  const product = store.getProductBySlug(req.params.slug);
  if (!product) return res.status(404).send('Ürün bulunamadı');
  return res.render('product-detail', {
    product,
    reviews: store.getApprovedReviews(req.params.slug),
    ...withLayoutData()
  });
});

app.post('/products/:id/reviews', (req, res) => {
  const { id } = req.params;
  const { name, rating, comment } = req.body;
  store.createReview({ productId: id, userId: req.session.userId || null, name, rating, comment });
  res.redirect('back');
});

app.get('/cart', (req, res) => {
  const cart = req.session.cart || [];
  res.render('cart', { cart, total: cartTotal(cart), ...withLayoutData() });
});

app.post('/cart/add', (req, res) => {
  const { productId, quantity } = req.body;
  const item = store.getProductForCart(productId);
  if (!item) return res.redirect('/products');

  req.session.cart = req.session.cart || [];
  const existing = req.session.cart.find((product) => product.id === item.id);
  const qty = Number(quantity || 1);
  if (existing) {
    existing.quantity = Math.min(existing.quantity + qty, item.stock);
  } else {
    req.session.cart.push({ ...item, quantity: Math.min(qty, item.stock) });
  }
  return res.redirect('/cart');
});

app.post('/cart/remove', (req, res) => {
  const { productId } = req.body;
  req.session.cart = (req.session.cart || []).filter((item) => item.id !== Number(productId));
  res.redirect('/cart');
});

app.get('/checkout', auth, (req, res) => {
  const cart = req.session.cart || [];
  if (!cart.length) return res.redirect('/cart');
  res.render('checkout', { cart, total: cartTotal(cart), ...withLayoutData() });
});

app.post('/checkout', auth, (req, res) => {
  const cart = req.session.cart || [];
  if (!cart.length) return res.redirect('/cart');

  const { customerName, customerEmail, customerPhone, shippingAddress } = req.body;
  const total = cartTotal(cart);
  const order = store.createOrder({ userId: req.session.userId, cart, customerName, customerEmail, customerPhone, shippingAddress, total });
  req.session.cart = [];
  return res.render('checkout-success', { orderNumber: order.order_number });
});

app.get('/about', (req, res) => {
  res.render('about', withLayoutData());
});

app.get('/contact', (req, res) => {
  res.render('contact', { success: req.query.success, ...withLayoutData() });
});

app.post('/contact', (req, res) => {
  const { fullName, email, phone, message } = req.body;
  store.createContactMessage({ fullName, email, phone, message });
  res.redirect('/contact?success=1');
});

app.get('/login', (req, res) => {
  res.render('login', { ...withLayoutData(), mode: 'login' });
});

app.get('/register', (req, res) => {
  res.render('login', { ...withLayoutData(), mode: 'register' });
});

app.post('/register', async (req, res) => {
  const { fullName, email, password, phone } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  try {
    const user = store.createUser({ fullName, email, passwordHash, phone });
    req.session.userId = user.id;
    return res.redirect('/');
  } catch {
    return res.redirect('/register');
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = store.getUserByEmail(email);
  if (!user) return res.redirect('/login');

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.redirect('/login');

  req.session.userId = user.id;
  return res.redirect(user.role === 'admin' ? '/admin' : '/');
});

app.post('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

app.get('/admin/login', (req, res) => {
  res.render('admin-login');
});

app.post('/admin/login', async (req, res) => {
  const { email, password } = req.body;
  const user = store.getUserByEmail(email, 'admin');
  if (!user) return res.redirect('/admin/login');

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.redirect('/admin/login');

  req.session.userId = user.id;
  return res.redirect('/admin');
});

app.get('/admin', adminOnly, (req, res) => {
  res.render('admin-dashboard', { stats: store.getStats() });
});

app.get('/admin/products', adminOnly, (req, res) => {
  res.render('admin-products', { products: store.getProducts({ activeOnly: false }), categories: store.getCategories() });
});

app.post('/admin/products', adminOnly, (req, res) => {
  const { categoryId, name, slug, description, price, stock, imageUrl, isActive } = req.body;
  store.createProduct({ categoryId, name, slug, description, price, stock, imageUrl, isActive: isActive === 'on' });
  res.redirect('/admin/products');
});

app.post('/admin/products/:id/update', adminOnly, (req, res) => {
  const { categoryId, name, slug, description, price, stock, imageUrl, isActive } = req.body;
  store.updateProduct(req.params.id, { categoryId, name, slug, description, price, stock, imageUrl, isActive: isActive === 'on' });
  res.redirect('/admin/products');
});

app.post('/admin/products/:id/delete', adminOnly, (req, res) => {
  store.deleteProduct(req.params.id);
  res.redirect('/admin/products');
});

app.get('/admin/categories', adminOnly, (req, res) => {
  res.render('admin-categories', { categories: store.getAdminCategories() });
});

app.post('/admin/categories', adminOnly, (req, res) => {
  const { name, slug, description } = req.body;
  store.createCategory({ name, slug, description });
  res.redirect('/admin/categories');
});

app.post('/admin/categories/:id/delete', adminOnly, (req, res) => {
  store.deleteCategory(req.params.id);
  res.redirect('/admin/categories');
});

app.get('/admin/orders', adminOnly, (req, res) => {
  res.render('admin-orders', { orders: store.getOrders() });
});

app.post('/admin/orders/:id/status', adminOnly, (req, res) => {
  store.updateOrderStatus(req.params.id, req.body.status);
  res.redirect('/admin/orders');
});

app.get('/admin/customers', adminOnly, (req, res) => {
  res.render('admin-customers', { customers: store.getCustomers() });
});

app.get('/admin/messages', adminOnly, (req, res) => {
  res.render('admin-messages', { messages: store.getContactMessages() });
});

app.get('/admin/reviews', adminOnly, (req, res) => {
  res.render('admin-reviews', { reviews: store.getAdminReviews() });
});

app.post('/admin/reviews/:id/approve', adminOnly, (req, res) => {
  store.approveReview(req.params.id);
  res.redirect('/admin/reviews');
});

app.post('/admin/reviews/:id/delete', adminOnly, (req, res) => {
  store.deleteReview(req.params.id);
  res.redirect('/admin/reviews');
});

app.listen(PORT, () => {
  console.log(`BIOLIFE running at http://localhost:${PORT}`);
  console.log(`Demo data file: ${process.env.DATA_FILE || path.join(__dirname, '..', 'data', 'store.json')}`);
});

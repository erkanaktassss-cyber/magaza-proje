const path = require('path');
const express = require('express');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const bcrypt = require('bcryptjs');
const methodOverride = require('method-override');
const pool = require('./db');
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
    store: new pgSession({ pool, tableName: 'session' }),
    secret: process.env.SESSION_SECRET || 'dev-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24
    }
  })
);

app.use(async (req, res, next) => {
  res.locals.currentUser = null;
  res.locals.cart = req.session.cart || [];
  if (req.session.userId) {
    const user = await pool.query('SELECT id, full_name, email, role FROM users WHERE id = $1', [req.session.userId]);
    res.locals.currentUser = user.rows[0] || null;
  }
  next();
});

const auth = (req, res, next) => {
  if (!req.session.userId) return res.redirect('/login');
  return next();
};

const adminOnly = async (req, res, next) => {
  if (!req.session.userId) return res.redirect('/admin/login');
  const user = await pool.query('SELECT role FROM users WHERE id = $1', [req.session.userId]);
  if (!user.rows[0] || user.rows[0].role !== 'admin') return res.redirect('/admin/login');
  return next();
};

const withLayoutData = async () => {
  const categories = await pool.query('SELECT id, name, slug FROM categories ORDER BY name ASC');
  return { categories: categories.rows };
};

app.get('/', async (req, res) => {
  const [products, reviews, layout] = await Promise.all([
    pool.query('SELECT * FROM products WHERE is_active = true ORDER BY created_at DESC LIMIT 6'),
    pool.query("SELECT r.*, p.name as product_name FROM reviews r JOIN products p ON p.id=r.product_id WHERE r.status='approved' ORDER BY r.created_at DESC LIMIT 4"),
    withLayoutData()
  ]);
  res.render('home', { products: products.rows, reviews: reviews.rows, ...layout });
});

app.get('/products', async (req, res) => {
  const { category } = req.query;
  let query = 'SELECT p.*, c.name AS category_name FROM products p LEFT JOIN categories c ON c.id = p.category_id WHERE p.is_active = true';
  const params = [];
  if (category) {
    params.push(category);
    query += ` AND c.slug = $${params.length}`;
  }
  query += ' ORDER BY p.created_at DESC';

  const [products, layout] = await Promise.all([pool.query(query, params), withLayoutData()]);
  res.render('products', { products: products.rows, ...layout, activeCategory: category || null });
});

app.get('/products/:slug', async (req, res) => {
  const slug = req.params.slug;
  const [product, reviews, layout] = await Promise.all([
    pool.query('SELECT p.*, c.name AS category_name FROM products p LEFT JOIN categories c ON c.id=p.category_id WHERE p.slug=$1', [slug]),
    pool.query("SELECT * FROM reviews WHERE product_id=(SELECT id FROM products WHERE slug=$1) AND status='approved' ORDER BY created_at DESC", [slug]),
    withLayoutData()
  ]);

  if (!product.rows[0]) return res.status(404).send('Ürün bulunamadı');
  return res.render('product-detail', { product: product.rows[0], reviews: reviews.rows, ...layout });
});

app.post('/products/:id/reviews', async (req, res) => {
  const { id } = req.params;
  const { name, rating, comment } = req.body;
  const userId = req.session.userId || null;
  await pool.query(
    'INSERT INTO reviews (product_id, user_id, name, rating, comment, status) VALUES ($1, $2, $3, $4, $5, $6)',
    [id, userId, name, Number(rating), comment, 'pending']
  );
  res.redirect('back');
});

app.get('/cart', async (req, res) => {
  const cart = req.session.cart || [];
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const layout = await withLayoutData();
  res.render('cart', { cart, total, ...layout });
});

app.post('/cart/add', async (req, res) => {
  const { productId, quantity } = req.body;
  const product = await pool.query('SELECT id, name, slug, price, stock, image_url FROM products WHERE id=$1 AND is_active=true', [productId]);
  const item = product.rows[0];
  if (!item) return res.redirect('/products');

  req.session.cart = req.session.cart || [];
  const existing = req.session.cart.find((p) => p.id === item.id);
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

app.get('/checkout', auth, async (req, res) => {
  const cart = req.session.cart || [];
  if (!cart.length) return res.redirect('/cart');
  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const layout = await withLayoutData();
  res.render('checkout', { cart, total, ...layout });
});

app.post('/checkout', auth, async (req, res) => {
  const cart = req.session.cart || [];
  if (!cart.length) return res.redirect('/cart');

  const { customerName, customerEmail, customerPhone, shippingAddress } = req.body;
  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const orderNumber = `BL-${Date.now()}`;
    const orderResult = await client.query(
      `INSERT INTO orders
      (user_id, order_number, customer_name, customer_email, customer_phone, shipping_address, total_amount, payment_method, payment_status, status)
      VALUES ($1,$2,$3,$4,$5,$6,$7,'sandbox','sandbox_paid','processing') RETURNING id`,
      [req.session.userId, orderNumber, customerName, customerEmail, customerPhone, shippingAddress, total]
    );

    for (const item of cart) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, line_total)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [orderResult.rows[0].id, item.id, item.name, item.quantity, item.price, item.price * item.quantity]
      );
      await client.query('UPDATE products SET stock = GREATEST(stock - $1, 0), updated_at = NOW() WHERE id = $2', [item.quantity, item.id]);
    }

    await client.query('COMMIT');
    req.session.cart = [];
    return res.render('checkout-success', { orderNumber });
  } catch (error) {
    await client.query('ROLLBACK');
    return res.status(500).send(`Sipariş oluşturulamadı: ${error.message}`);
  } finally {
    client.release();
  }
});

app.get('/about', async (req, res) => {
  const layout = await withLayoutData();
  res.render('about', layout);
});

app.get('/contact', async (req, res) => {
  const layout = await withLayoutData();
  res.render('contact', { success: req.query.success, ...layout });
});

app.post('/contact', async (req, res) => {
  const { fullName, email, phone, message } = req.body;
  await pool.query('INSERT INTO contact_messages (full_name, email, phone, message) VALUES ($1,$2,$3,$4)', [fullName, email, phone, message]);
  res.redirect('/contact?success=1');
});

app.get('/login', async (req, res) => {
  const layout = await withLayoutData();
  res.render('login', { ...layout, mode: 'login' });
});

app.get('/register', async (req, res) => {
  const layout = await withLayoutData();
  res.render('login', { ...layout, mode: 'register' });
});

app.post('/register', async (req, res) => {
  const { fullName, email, password, phone } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  try {
    const result = await pool.query(
      'INSERT INTO users (full_name, email, password_hash, phone, role) VALUES ($1,$2,$3,$4,$5) RETURNING id',
      [fullName, email, passwordHash, phone, 'customer']
    );
    req.session.userId = result.rows[0].id;
    return res.redirect('/');
  } catch {
    return res.redirect('/register');
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
  if (!user.rows[0]) return res.redirect('/login');

  const ok = await bcrypt.compare(password, user.rows[0].password_hash);
  if (!ok) return res.redirect('/login');

  req.session.userId = user.rows[0].id;
  return res.redirect(user.rows[0].role === 'admin' ? '/admin' : '/');
});

app.post('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

app.get('/admin/login', (req, res) => {
  res.render('admin-login');
});

app.post('/admin/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await pool.query("SELECT * FROM users WHERE email=$1 AND role='admin'", [email]);
  if (!user.rows[0]) return res.redirect('/admin/login');

  const ok = await bcrypt.compare(password, user.rows[0].password_hash);
  if (!ok) return res.redirect('/admin/login');

  req.session.userId = user.rows[0].id;
  return res.redirect('/admin');
});

app.get('/admin', adminOnly, async (req, res) => {
  const [products, orders, users, messages] = await Promise.all([
    pool.query('SELECT COUNT(*)::int AS count FROM products'),
    pool.query('SELECT COUNT(*)::int AS count FROM orders'),
    pool.query("SELECT COUNT(*)::int AS count FROM users WHERE role='customer'"),
    pool.query('SELECT COUNT(*)::int AS count FROM contact_messages')
  ]);

  res.render('admin-dashboard', {
    stats: {
      products: products.rows[0].count,
      orders: orders.rows[0].count,
      customers: users.rows[0].count,
      messages: messages.rows[0].count
    }
  });
});

app.get('/admin/products', adminOnly, async (req, res) => {
  const [products, categories] = await Promise.all([
    pool.query('SELECT p.*, c.name AS category_name FROM products p LEFT JOIN categories c ON c.id=p.category_id ORDER BY p.created_at DESC'),
    pool.query('SELECT * FROM categories ORDER BY name ASC')
  ]);
  res.render('admin-products', { products: products.rows, categories: categories.rows });
});

app.post('/admin/products', adminOnly, async (req, res) => {
  const { categoryId, name, slug, description, price, stock, imageUrl, isActive } = req.body;
  await pool.query(
    `INSERT INTO products (category_id, name, slug, description, price, stock, image_url, is_active)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
    [categoryId || null, name, slug, description, Number(price), Number(stock), imageUrl, isActive === 'on']
  );
  res.redirect('/admin/products');
});

app.post('/admin/products/:id/update', adminOnly, async (req, res) => {
  const { id } = req.params;
  const { categoryId, name, slug, description, price, stock, imageUrl, isActive } = req.body;
  await pool.query(
    `UPDATE products SET category_id=$1, name=$2, slug=$3, description=$4, price=$5, stock=$6, image_url=$7, is_active=$8, updated_at=NOW() WHERE id=$9`,
    [categoryId || null, name, slug, description, Number(price), Number(stock), imageUrl, isActive === 'on', id]
  );
  res.redirect('/admin/products');
});

app.post('/admin/products/:id/delete', adminOnly, async (req, res) => {
  await pool.query('DELETE FROM products WHERE id=$1', [req.params.id]);
  res.redirect('/admin/products');
});

app.get('/admin/categories', adminOnly, async (req, res) => {
  const categories = await pool.query('SELECT * FROM categories ORDER BY created_at DESC');
  res.render('admin-categories', { categories: categories.rows });
});

app.post('/admin/categories', adminOnly, async (req, res) => {
  const { name, slug, description } = req.body;
  await pool.query('INSERT INTO categories (name, slug, description) VALUES ($1,$2,$3)', [name, slug, description]);
  res.redirect('/admin/categories');
});

app.post('/admin/categories/:id/delete', adminOnly, async (req, res) => {
  await pool.query('DELETE FROM categories WHERE id=$1', [req.params.id]);
  res.redirect('/admin/categories');
});

app.get('/admin/orders', adminOnly, async (req, res) => {
  const orders = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
  res.render('admin-orders', { orders: orders.rows });
});

app.post('/admin/orders/:id/status', adminOnly, async (req, res) => {
  const { status } = req.body;
  await pool.query('UPDATE orders SET status=$1, updated_at=NOW() WHERE id=$2', [status, req.params.id]);
  res.redirect('/admin/orders');
});

app.get('/admin/customers', adminOnly, async (req, res) => {
  const customers = await pool.query("SELECT id, full_name, email, phone, created_at FROM users WHERE role='customer' ORDER BY created_at DESC");
  res.render('admin-customers', { customers: customers.rows });
});

app.get('/admin/messages', adminOnly, async (req, res) => {
  const messages = await pool.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
  res.render('admin-messages', { messages: messages.rows });
});

app.get('/admin/reviews', adminOnly, async (req, res) => {
  const reviews = await pool.query('SELECT r.*, p.name AS product_name FROM reviews r JOIN products p ON p.id=r.product_id ORDER BY r.created_at DESC');
  res.render('admin-reviews', { reviews: reviews.rows });
});

app.post('/admin/reviews/:id/approve', adminOnly, async (req, res) => {
  await pool.query("UPDATE reviews SET status='approved' WHERE id=$1", [req.params.id]);
  res.redirect('/admin/reviews');
});

app.post('/admin/reviews/:id/delete', adminOnly, async (req, res) => {
  await pool.query('DELETE FROM reviews WHERE id=$1', [req.params.id]);
  res.redirect('/admin/reviews');
});

app.listen(PORT, () => {
  console.log(`BIOLIFE running at http://localhost:${PORT}`);
});

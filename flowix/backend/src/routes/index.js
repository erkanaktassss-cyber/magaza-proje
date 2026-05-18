const express = require('express');
const db = require('../db');
const router = express.Router();

router.post('/auth/login', (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare('SELECT id,username,role FROM users WHERE username=? AND password=?').get(username, password);
  if (!user) return res.status(401).json({ message: 'Kullanıcı adı veya şifre hatalı' });
  res.json(user);
});

router.get('/dashboard', (_, res) => {
  const todaySales = db.prepare("SELECT COALESCE(SUM(total),0) total FROM sales WHERE date(created_at)=date('now','localtime')").get();
  const critical = db.prepare('SELECT * FROM products WHERE stock <= 10').all();
  res.json({ todaySales: todaySales.total, criticalStock: critical });
});

router.get('/products', (_, res) => res.json(db.prepare('SELECT p.*, c.name category FROM products p LEFT JOIN categories c ON p.category_id=c.id').all()));
router.get('/customers', (_, res) => res.json(db.prepare('SELECT * FROM customers').all()));

router.post('/sales', (req, res) => {
  const { items, paymentType = 'cash', customerId = null } = req.body;
  const total = items.reduce((s, i) => s + i.qty * i.sale_price, 0);
  const tx = db.transaction(() => {
    const sale = db.prepare('INSERT INTO sales(customer_id,total,payment_type) VALUES(?,?,?)').run(customerId, total, paymentType);
    for (const i of items) {
      db.prepare('INSERT INTO sale_items(sale_id,product_id,qty,price) VALUES(?,?,?,?)').run(sale.lastInsertRowid, i.id, i.qty, i.sale_price);
      db.prepare('UPDATE products SET stock = stock - ? WHERE id=?').run(i.qty, i.id);
    }
    return sale.lastInsertRowid;
  });
  res.json({ saleId: tx(), total });
});

module.exports = router;

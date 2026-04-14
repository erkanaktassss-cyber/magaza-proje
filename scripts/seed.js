const bcrypt = require('bcryptjs');
const pool = require('./db');

const categories = [
  ['Doğal Temizlik', 'dogal-temizlik', 'Doğal içerikli genel temizlik ürünleri'],
  ['Hijyen Ürünleri', 'hijyen-urunleri', 'Ev ve kişisel hijyen çözümleri'],
  ['Endüstriyel Çözümler', 'endustriyel-cozumler', 'Profesyonel temizlik ihtiyaçları için ürünler']
];

const products = [
  ['Sıvı Sabun Premium', 'sivi-sabun-premium', 'Bitkisel bazlı, cilt dostu sıvı sabun.', 149.9, 120, 'https://images.unsplash.com/photo-1584305574647-acf8069a3d2b?w=800'],
  ['Yüzey Temizleyici', 'yuzey-temizleyici', 'Doğal ferahlık veren çok amaçlı yüzey temizleyici.', 179.5, 90, 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=800'],
  ['Cam Temizleyici', 'cam-temizleyici', 'İz bırakmayan doğal cam temizleme formülü.', 129.0, 110, 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800'],
  ['Arap Sabunu', 'arap-sabunu', 'Geleneksel formülle güçlü doğal temizlik.', 219.0, 70, 'https://images.unsplash.com/photo-1610555356070-d0efb6505f81?w=800'],
  ['Yağ Çözücü Pro', 'yag-cozucu-pro', 'Mutfak ve ağır kirlerde etkili yağ çözücü.', 199.9, 65, 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800'],
  ['Hijyen Dezenfektanı', 'hijyen-dezenfektani', 'Alkol bazlı hızlı hijyen çözümü.', 99.9, 200, 'https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=800']
];

(async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    for (const [name, slug, description] of categories) {
      await client.query(
        `INSERT INTO categories (name, slug, description)
         VALUES ($1, $2, $3)
         ON CONFLICT (slug) DO NOTHING`,
        [name, slug, description]
      );
    }

    const categoryRows = await client.query('SELECT id FROM categories ORDER BY id ASC');
    const categoryIds = categoryRows.rows.map((r) => r.id);

    for (let i = 0; i < products.length; i += 1) {
      const [name, slug, description, price, stock, imageUrl] = products[i];
      const categoryId = categoryIds[i % categoryIds.length] || null;
      await client.query(
        `INSERT INTO products (category_id, name, slug, description, price, stock, image_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (slug) DO NOTHING`,
        [categoryId, name, slug, description, price, stock, imageUrl]
      );
    }

    const adminHash = await bcrypt.hash('Admin1234!', 10);
    const userHash = await bcrypt.hash('User1234!', 10);

    await client.query(
      `INSERT INTO users (full_name, email, password_hash, role, phone)
       VALUES ('BIOLIFE Admin', 'admin@biolife.com', $1, 'admin', '+90 555 000 00 00')
       ON CONFLICT (email) DO NOTHING`,
      [adminHash]
    );

    await client.query(
      `INSERT INTO users (full_name, email, password_hash, role, phone)
       VALUES ('Test Müşteri', 'musteri@biolife.com', $1, 'customer', '+90 555 111 11 11')
       ON CONFLICT (email) DO NOTHING`,
      [userHash]
    );

    await client.query('COMMIT');
    console.log('Seed completed.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Seed failed:', error.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
})();

import './styles.css';

const sidebarItems = [
  { label: 'Dashboard', icon: '◧', active: true },
  { label: 'Sales', icon: '🛒' },
  { label: 'Products', icon: '◫' },
  { label: 'Customers', icon: '👥' },
  { label: 'Reports', icon: '◩' },
  { label: 'Settings', icon: '⚙' },
];

const stats = [
  { title: 'Today Revenue', value: '$12,480', delta: '+14.5%' },
  { title: 'Transactions', value: '182', delta: '+8.2%' },
  { title: 'Avg. Basket', value: '$68.57', delta: '+4.1%' },
  { title: 'Refunds', value: '$340', delta: '-1.2%' },
];

const products = [
  { name: 'Signature Espresso', price: '$4.90', stock: 'In stock' },
  { name: 'Chicken Wrap', price: '$8.50', stock: 'In stock' },
  { name: 'Blueberry Muffin', price: '$3.20', stock: 'In stock' },
  { name: 'Iced Matcha Latte', price: '$6.20', stock: 'Low stock' },
  { name: 'Caesar Salad', price: '$9.10', stock: 'In stock' },
  { name: 'Almond Croissant', price: '$4.10', stock: 'In stock' },
  { name: 'Protein Bowl', price: '$11.70', stock: 'In stock' },
  { name: 'Orange Juice', price: '$4.80', stock: 'In stock' },
];

const cartItems = [
  { name: 'Iced Matcha Latte', qty: 2, price: '$12.40' },
  { name: 'Chicken Wrap', qty: 1, price: '$8.50' },
  { name: 'Blueberry Muffin', qty: 1, price: '$3.20' },
];

export default function App() {
  return (
    <div className="pos-app">
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-mark">F</div>
          <div>
            <h1>Flowix</h1>
            <p>Premium POS Suite</p>
          </div>
        </div>
        <nav className="menu">
          {sidebarItems.map((item) => (
            <button key={item.label} className={`menu-item ${item.active ? 'active' : ''}`}>
              <span className="icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="main-area">
        <header className="topbar card">
          <div>
            <h2>Sales Dashboard</h2>
            <p>Monday, May 18, 2026 • Main Store Register</p>
          </div>
          <div className="topbar-actions">
            <button className="btn ghost">🔔 Alerts</button>
            <button className="btn primary">+ New Sale</button>
          </div>
        </header>

        <section className="stats-grid">
          {stats.map((stat) => (
            <article className="card stat" key={stat.title}>
              <p>{stat.title}</p>
              <h3>{stat.value}</h3>
              <span>{stat.delta}</span>
            </article>
          ))}
        </section>

        <section className="workspace">
          <div className="sales-panel card">
            <div className="panel-head">
              <h3>Products</h3>
              <button className="btn ghost">🔎 Search</button>
            </div>
            <div className="product-grid">
              {products.map((product) => (
                <button className="product-card" key={product.name}>
                  <h4>{product.name}</h4>
                  <p>{product.stock}</p>
                  <strong>{product.price}</strong>
                </button>
              ))}
            </div>
          </div>

          <aside className="cart-panel card">
            <div className="panel-head">
              <h3>Current Cart</h3>
              <span>Table #A12</span>
            </div>
            <div className="cart-items">
              {cartItems.map((item) => (
                <div className="cart-row" key={item.name}>
                  <div>
                    <h4>{item.name}</h4>
                    <p>Qty {item.qty}</p>
                  </div>
                  <strong>{item.price}</strong>
                </div>
              ))}
            </div>
            <div className="totals">
              <div><span>Subtotal</span><strong>$24.10</strong></div>
              <div><span>Tax</span><strong>$2.05</strong></div>
              <div className="grand"><span>Total</span><strong>$26.15</strong></div>
            </div>
            <div className="cart-actions">
              <button className="btn ghost">Hold Order</button>
              <button className="btn primary">Charge Customer</button>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}

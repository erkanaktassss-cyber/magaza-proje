export default function KpiCard({ title, value, sub, tone = 'default' }) {
  return <div className={`kpi ${tone}`}><p>{title}</p><h3>{value}</h3><small>{sub}</small></div>;
}

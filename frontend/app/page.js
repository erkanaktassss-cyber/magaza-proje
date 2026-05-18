import PosDashboard from './ui/pos-dashboard'
import { getData } from '../lib/api'

export default async function Home() {
  const [dashboard, oee, lines, ai] = await Promise.all([
    getData('/dashboard'),
    getData('/oee'),
    getData('/lines'),
    getData('/ai'),
  ])

  const topProducts = [
    { name: 'Double Burger Menü', sales: 214, growth: '+12%' },
    { name: 'Tavuk Wrap', sales: 181, growth: '+8%' },
    { name: 'Iced Latte', sales: 167, growth: '+6%' },
    { name: 'Sezar Salata', sales: 152, growth: '+4%' },
  ]

  const salesTrend = [72, 82, 76, 91, 88, 103, 96, 114, 109, 121, 118, 132]

  return (
    <PosDashboard
      dashboard={dashboard}
      oee={oee}
      lines={lines}
      ai={ai}
      topProducts={topProducts}
      salesTrend={salesTrend}
    />
  )
}

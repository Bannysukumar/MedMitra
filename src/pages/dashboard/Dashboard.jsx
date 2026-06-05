import { Link } from 'react-router-dom'
import {
  Package,
  Clock,
  CheckCircle,
  IndianRupee,
  TrendingUp,
  ShoppingBag,
  ClipboardList,
} from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { useUserOrders } from '../../hooks/useFirestore'
import DashboardCard, { OrderThumbnail } from '../../components/dashboard/DashboardCard'
import StatusPill from '../../components/ui/StatusPill'
import Button from '../../components/ui/Button'
import { formatCurrency, formatDate } from '../../utils/helpers'
import { useAuth } from '../../contexts/AuthContext'

const CHART_COLORS = {
  delivered: '#22c55e',
  pending: '#f97316',
  processing: '#0066ff',
  cancelled: '#ef4444',
  returned: '#94a3b8',
}

export default function Dashboard() {
  const { displayName, user } = useAuth()
  const { data: orders, loading } = useUserOrders(user?.uid)
  const firstName = displayName.split(' ')[0]

  const chartData = [
    { name: 'Delivered', value: orders.filter((o) => o.status === 'delivered').length, key: 'delivered' },
    { name: 'Pending', value: orders.filter((o) => o.status === 'pending').length, key: 'pending' },
    { name: 'Processing', value: orders.filter((o) => o.status === 'processing').length, key: 'processing' },
    { name: 'Cancelled', value: orders.filter((o) => o.status === 'cancelled').length, key: 'cancelled' },
  ].filter((d) => d.value > 0)

  const totalSavings = orders.reduce((s, o) => s + (o.savings || 0), 0)
  const pendingCount = orders.filter((o) => o.status === 'pending' || o.status === 'processing').length
  const deliveredCount = orders.filter((o) => o.status === 'delivered').length

  const stats = [
    {
      label: 'Total Orders',
      value: loading ? '...' : String(orders.length),
      sub: orders.length ? 'All time' : 'No orders yet',
      subColor: 'text-gray-500',
      icon: Package,
      iconBg: 'bg-blue-50',
      iconColor: 'text-primary-600',
    },
    {
      label: 'Pending Orders',
      value: loading ? '...' : String(pendingCount),
      sub: 'View orders',
      subLink: '/dashboard/orders',
      icon: Clock,
      iconBg: 'bg-orange-50',
      iconColor: 'text-orange-500',
    },
    {
      label: 'Delivered Orders',
      value: loading ? '...' : String(deliveredCount),
      sub: 'View orders',
      subLink: '/dashboard/orders',
      icon: CheckCircle,
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      label: 'Total Savings',
      value: formatCurrency(totalSavings || 0),
      sub: 'All orders',
      icon: IndianRupee,
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <DashboardCard key={stat.label}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">{stat.value}</p>
                {stat.subLink ? (
                  <Link
                    to={stat.subLink}
                    className="mt-1 inline-block text-xs font-semibold text-primary-600 hover:underline"
                  >
                    {stat.sub}
                  </Link>
                ) : (
                  <p className={`mt-1 flex items-center gap-1 text-xs font-medium ${stat.subColor || 'text-gray-500'}`}>
                    {stat.subColor && <TrendingUp className="h-3 w-3" />}
                    {stat.sub}
                  </p>
                )}
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.iconBg}`}>
                <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
            </div>
          </DashboardCard>
        ))}
      </div>

      <h2 className="text-xl font-bold text-gray-900">
        Welcome back, {firstName}! 👋
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
  <Link to="/dashboard/medicines">
    <Button size="full">Browse Medicines</Button>
  </Link>

  <Link to="/dashboard/orders">
    <Button size="full">My Orders</Button>
  </Link>

  <Link to="/dashboard/wishlist">
    <Button size="full">Wishlist</Button>
  </Link>

  <Link to="/dashboard/prescriptions">
    <Button size="full">Upload Prescription</Button>
  </Link>
</div>

      <div className="grid min-w-0 gap-6 xl:grid-cols-12">
        <DashboardCard className="min-w-0 xl:col-span-3">
          <h3 className="text-base font-semibold text-gray-900">Order Summary</h3>
          <p className="mb-4 text-xs text-gray-500">Status breakdown</p>
          <div className="relative h-[208px] w-full min-w-[180px]">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={208} minWidth={0}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {chartData.map((entry) => (
                      <Cell key={entry.key} fill={CHART_COLORS[entry.key] || '#0066ff'} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-gray-400">
                {loading ? 'Loading...' : 'No orders yet'}
              </div>
            )}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-gray-900">{orders.length}</span>
              <span className="text-xs text-gray-500">Orders</span>
            </div>
          </div>
          <div className="mt-2 space-y-2">
            {chartData.map((item) => (
              <div className="flex items-center justify-between text-xs" key={item.name}>
                <span className="flex items-center gap-2 text-gray-600">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: CHART_COLORS[item.key] }}
                  />
                  {item.name}
                </span>
                <span className="font-semibold text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard className="xl:col-span-6 !p-0 overflow-hidden">
          <div className="border-b border-gray-100 px-5 py-4">
            <h3 className="text-base font-semibold text-gray-900">Recent Orders</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {orders.slice(0, 4).map((order) => {
              const item = order.items?.[0]
              if (!item) return null
              return (
                <div key={order.id} className="flex items-center gap-4 px-5 py-3.5">
                  <OrderThumbnail src={item.image} alt={item.name} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500">{order.id}</p>
                  </div>
                  <StatusPill status={order.status} />
                  <span className="hidden text-xs text-gray-500 sm:block">{formatDate(order.createdAt)}</span>
                </div>
              )
            })}
            {!loading && orders.length === 0 && (
              <p className="px-5 py-8 text-center text-sm text-gray-500">No orders yet. Place your first order!</p>
            )}
          </div>
        </DashboardCard>

        <div className="flex flex-col gap-4 xl:col-span-3">
          <div className="gradient-primary rounded-2xl p-5 text-white shadow-lg shadow-primary-600/20">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold">Upload Prescription</h3>
                <p className="mt-1 text-xs text-white/80">Get medicines delivered quickly</p>
                <Link to="/dashboard/prescriptions">
                  <Button size="sm" className="mt-4 !bg-white !text-primary-600 hover:!bg-white/90">
                    Upload Now
                  </Button>
                </Link>
              </div>
              <ClipboardList className="h-10 w-10 text-white/40" />
            </div>
          </div>

          <DashboardCard className="border border-primary-100 bg-primary-50/50">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900">Medicine Catalog</h3>
                <p className="mt-1 text-xs text-gray-600">Browse our medicine catalog</p>
                <Link
                  to="/dashboard/medicines"
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary-600 hover:underline"
                >
                  Browse Medicines →
                </Link>
              </div>
              <ShoppingBag className="h-10 w-10 text-primary-300" />
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  )
}

import {
  Users,
  UserCheck,
  UserPlus,
  Pill,
  Layers,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  IndianRupee,
  Calendar,
  FileText,
  CheckSquare,
  XSquare,
  Headphones,
  Activity,
  AlertTriangle,
} from 'lucide-react'
import { useAdminData } from '../../hooks/useFirestore'
import {
  computeAdminMetrics,
  computeDailyUserGrowth,
  computeMonthlyRevenue,
  computeOrderStats,
  computePrescriptionStats,
  computeMedicinePopularity,
  computeCategoryPerformance,
} from '../../utils/adminAnalytics'
import AdminPageHeader, {
  AdminStatCard,
  AdminChartCard,
  AdminLineChart,
  AdminAreaChart,
  AdminPieChart,
  AdminBarChart,
} from '../../components/admin/AdminComponents'
import Card from '../../components/ui/Card'
import { formatCurrency } from '../../utils/helpers'

export default function AdminDashboard() {
  const { users, orders, medicines, prescriptions, tickets, sessions, loading } = useAdminData()

  const metrics = computeAdminMetrics({ users, orders, medicines, prescriptions, tickets, sessions })
  const userGrowth = computeDailyUserGrowth(users)
  const monthlyRevenue = computeMonthlyRevenue(orders)
  const orderStats = computeOrderStats(orders)
  const rxStats = computePrescriptionStats(prescriptions)
  const medicinePop = computeMedicinePopularity(orders)
  const categoryPerf = computeCategoryPerformance(medicines, orders)

  const widgets = [
    { label: 'Total Users', value: metrics.totalUsers, icon: Users, iconBg: 'bg-blue-50', iconColor: 'text-primary-600' },
    { label: 'Active Users', value: metrics.activeUsers, icon: UserCheck, iconBg: 'bg-green-50', iconColor: 'text-green-600' },
    { label: 'New Users Today', value: metrics.newUsersToday, icon: UserPlus, iconBg: 'bg-cyan-50', iconColor: 'text-cyan-600' },
    { label: 'Total Medicines', value: metrics.totalMedicines, icon: Pill, iconBg: 'bg-purple-50', iconColor: 'text-purple-600' },
    { label: 'Categories', value: metrics.totalCategories, icon: Layers, iconBg: 'bg-indigo-50', iconColor: 'text-indigo-600' },
    { label: 'Total Orders', value: metrics.totalOrders, icon: Package, iconBg: 'bg-orange-50', iconColor: 'text-orange-500' },
    { label: 'Pending Orders', value: metrics.pendingOrders, icon: Clock, iconBg: 'bg-amber-50', iconColor: 'text-amber-600', alert: metrics.pendingOrders > 0 },
    { label: 'Delivered', value: metrics.deliveredOrders, icon: CheckCircle, iconBg: 'bg-green-50', iconColor: 'text-green-600' },
    { label: 'Cancelled', value: metrics.cancelledOrders, icon: XCircle, iconBg: 'bg-red-50', iconColor: 'text-red-600' },
    { label: 'Total Revenue', value: formatCurrency(metrics.totalRevenue), icon: IndianRupee, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
    { label: 'Monthly Revenue', value: formatCurrency(metrics.monthlyRevenue), icon: Calendar, iconBg: 'bg-teal-50', iconColor: 'text-teal-600' },
    { label: 'Prescriptions', value: metrics.prescriptionUploads, icon: FileText, iconBg: 'bg-violet-50', iconColor: 'text-violet-600' },
    { label: 'Approved Rx', value: metrics.approvedPrescriptions, icon: CheckSquare, iconBg: 'bg-green-50', iconColor: 'text-green-600' },
    { label: 'Rejected Rx', value: metrics.rejectedPrescriptions, icon: XSquare, iconBg: 'bg-red-50', iconColor: 'text-red-600' },
    { label: 'Support Tickets', value: metrics.supportTickets, icon: Headphones, iconBg: 'bg-pink-50', iconColor: 'text-pink-600' },
    { label: 'Active Sessions', value: metrics.activeSessions, icon: Activity, iconBg: 'bg-slate-50', iconColor: 'text-slate-600' },
  ]

  const activity = [
    ...orders.slice(0, 3).map((o) => ({ text: `Order ${o.id} — ${o.status}`, time: o.createdAt })),
    ...prescriptions.slice(0, 3).map((rx) => ({ text: `Rx ${rx.name} — ${rx.status}`, time: rx.uploadedAt })),
    ...tickets.slice(0, 2).map((t) => ({ text: `Ticket: ${t.subject || t.message?.slice(0, 40)}`, time: t.createdAt })),
  ].slice(0, 8)

  return (
    <div className="space-y-6">
      <AdminPageHeader subtitle={loading ? 'Loading live metrics…' : 'Real-time platform overview — updates automatically via Firebase'} />

      {(metrics.lowStockMedicines > 0 || metrics.outOfStockMedicines > 0) && (
        <Card className="flex items-center gap-3 border-orange-200 bg-orange-50 !p-4">
          <AlertTriangle className="h-5 w-5 text-orange-600" />
          <p className="text-sm font-medium text-orange-800">
            Inventory alert: {metrics.lowStockMedicines} low stock, {metrics.outOfStockMedicines} out of stock
          </p>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {widgets.map((w) => (
          <AdminStatCard key={w.label} {...w} change="Live" />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <AdminChartCard title="Daily User Growth">
          <AdminLineChart data={userGrowth} dataKey="users" xKey="date" />
        </AdminChartCard>
        <AdminChartCard title="Monthly Revenue">
          <AdminAreaChart data={monthlyRevenue} dataKey="revenue" xKey="month" />
        </AdminChartCard>
        <AdminChartCard title="Order Statistics">
          {orderStats.length ? <AdminPieChart data={orderStats} /> : <p className="text-sm text-gray-500">No orders yet</p>}
        </AdminChartCard>
        <AdminChartCard title="Prescription Statistics">
          {rxStats.length ? <AdminPieChart data={rxStats} /> : <p className="text-sm text-gray-500">No prescriptions yet</p>}
        </AdminChartCard>
        <AdminChartCard title="Medicine Popularity">
          {medicinePop.length ? <AdminBarChart data={medicinePop} dataKey="orders" xKey="name" color="#0066ff" /> : <p className="text-sm text-gray-500">No order data yet</p>}
        </AdminChartCard>
        <AdminChartCard title="Category Performance">
          {categoryPerf.length ? <AdminBarChart data={categoryPerf} dataKey="value" xKey="name" color="#22c55e" /> : <p className="text-sm text-gray-500">No category data yet</p>}
        </AdminChartCard>
      </div>

      <Card className="!p-6">
        <h3 className="mb-4 font-semibold text-gray-900">Recent Activity</h3>
        <ul className="space-y-2">
          {activity.length ? activity.map((item) => (
            <li key={item.text + item.time} className="flex justify-between rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3 text-sm">
              <span className="font-medium text-gray-800">{item.text}</span>
              <span className="text-xs text-gray-500">{item.time?.slice(0, 10)}</span>
            </li>
          )) : (
            <li className="text-sm text-gray-500">No recent activity</li>
          )}
        </ul>
      </Card>
    </div>
  )
}

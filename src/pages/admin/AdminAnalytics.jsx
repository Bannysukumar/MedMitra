import { useAdminData } from '../../hooks/useFirestore'
import {
  computeDailyUserGrowth,
  computeMonthlyRevenue,
  computeOrderStats,
  computeTopUsers,
  computePrescriptionStats,
} from '../../utils/adminAnalytics'
import AdminPageHeader, {
  AdminChartCard,
  AdminLineChart,
  AdminAreaChart,
  AdminPieChart,
  AdminBarChart,
} from '../../components/admin/AdminComponents'
import Card from '../../components/ui/Card'

export default function AdminAnalytics() {
  const { users, orders, prescriptions, loading } = useAdminData()

  const userGrowth = computeDailyUserGrowth(users)
  const monthlyRevenue = computeMonthlyRevenue(orders)
  const orderStats = computeOrderStats(orders)
  const topUsers = computeTopUsers(users, orders)
  const rxTrends = computePrescriptionStats(prescriptions)

  return (
    <div className="space-y-6">
      <AdminPageHeader
        subtitle={loading ? 'Loading analytics…' : 'Platform analytics — user growth, revenue, orders, and prescriptions'}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <AdminChartCard title="User Growth (14 days)">
          {userGrowth.length ? (
            <AdminLineChart data={userGrowth} dataKey="users" xKey="date" />
          ) : (
            <p className="text-sm text-gray-500">No user data yet</p>
          )}
        </AdminChartCard>

        <AdminChartCard title="Revenue Trend">
          {monthlyRevenue.length ? (
            <AdminAreaChart data={monthlyRevenue} dataKey="revenue" xKey="month" />
          ) : (
            <p className="text-sm text-gray-500">No revenue data yet</p>
          )}
        </AdminChartCard>

        <AdminChartCard title="Order Distribution">
          {orderStats.length ? (
            <AdminPieChart data={orderStats} />
          ) : (
            <p className="text-sm text-gray-500">No orders yet</p>
          )}
        </AdminChartCard>

        <AdminChartCard title="Top Users by Orders">
          {topUsers.length ? (
            <AdminBarChart data={topUsers} dataKey="orders" xKey="name" color="#0066ff" />
          ) : (
            <p className="text-sm text-gray-500">No order activity yet</p>
          )}
        </AdminChartCard>

        <AdminChartCard title="Prescription Trends">
          {rxTrends.length ? (
            <AdminPieChart data={rxTrends} />
          ) : (
            <p className="text-sm text-gray-500">No prescriptions yet</p>
          )}
        </AdminChartCard>

        <Card className="!p-5">
          <h3 className="mb-4 font-semibold text-gray-900">User Retention</h3>
          <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50/50 text-center">
            <p className="text-sm font-medium text-gray-600">Retention analytics coming soon</p>
            <p className="mt-2 max-w-xs text-xs text-gray-500">
              Cohort and churn metrics will be available in a future release.
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

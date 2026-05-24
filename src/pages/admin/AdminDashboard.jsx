import { Users, Package, Pill, FileText, Activity } from 'lucide-react'
import { demoOrders, medicines, demoPrescriptions } from '../../data/mockData'
import Card from '../../components/ui/Card'
import AdminPageHeader, { AdminStatCard } from '../../components/admin/AdminComponents'

const ACTIVITY = [
  { text: 'New order ORD-004 received', time: '2 min ago' },
  { text: 'Prescription rx-2 under review', time: '15 min ago' },
  { text: '12 new user signups today', time: '1 hr ago' },
  { text: 'Medicine stock alert: Amoxicillin low', time: '3 hr ago' },
]

export default function AdminDashboard() {
  const stats = [
    {
      label: 'Total Users',
      value: '50,234',
      change: '+12% this month',
      icon: Users,
      iconBg: 'bg-blue-50',
      iconColor: 'text-primary-600',
    },
    {
      label: 'Orders Today',
      value: demoOrders.length,
      change: '+5% vs yesterday',
      icon: Package,
      iconBg: 'bg-orange-50',
      iconColor: 'text-orange-500',
    },
    {
      label: 'Medicines',
      value: medicines.length,
      change: 'Active in catalog',
      icon: Pill,
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      label: 'Prescriptions',
      value: demoPrescriptions.length,
      change: 'Pending review',
      icon: FileText,
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
  ]

  return (
    <div className="space-y-6">
      <AdminPageHeader subtitle="Overview of platform metrics and recent activity" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <AdminStatCard key={s.label} {...s} />
        ))}
      </div>

      <Card className="!p-6">
        <div className="mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary-600" />
          <h3 className="font-semibold text-gray-900">Recent Activity</h3>
        </div>
        <ul className="space-y-3">
          {ACTIVITY.map((item) => (
            <li
              key={item.text}
              className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3 text-sm"
            >
              <span className="font-medium text-gray-800">{item.text}</span>
              <span className="text-xs text-gray-500">{item.time}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}

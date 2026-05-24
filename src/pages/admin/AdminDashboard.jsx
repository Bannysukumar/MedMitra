import { useState } from 'react'
import { Users, Package, Pill, FileText, Activity, Database } from 'lucide-react'
import { useAllOrders, useAllPrescriptions, useMedicines, useUsers } from '../../hooks/useFirestore'
import { seedDatabase } from '../../services/firestoreService'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import AdminPageHeader, { AdminStatCard } from '../../components/admin/AdminComponents'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
  const { data: orders } = useAllOrders()
  const { data: medicines } = useMedicines()
  const { data: prescriptions } = useAllPrescriptions()
  const { data: users } = useUsers()
  const [seeding, setSeeding] = useState(false)

  const handleSeed = async () => {
    setSeeding(true)
    try {
      const result = await seedDatabase()
      toast.success(result.message)
    } catch (err) {
      toast.error(err.message || 'Seed failed')
    } finally {
      setSeeding(false)
    }
  }

  const stats = [
    {
      label: 'Total Users',
      value: String(users.length),
      change: 'Registered accounts',
      icon: Users,
      iconBg: 'bg-blue-50',
      iconColor: 'text-primary-600',
    },
    {
      label: 'Total Orders',
      value: String(orders.length),
      change: 'All time',
      icon: Package,
      iconBg: 'bg-orange-50',
      iconColor: 'text-orange-500',
    },
    {
      label: 'Medicines',
      value: String(medicines.length),
      change: medicines.length ? 'Active in catalog' : 'Seed catalog to populate',
      icon: Pill,
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      label: 'Prescriptions',
      value: String(prescriptions.length),
      change: 'All uploads',
      icon: FileText,
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
  ]

  const activity = [
    ...orders.slice(0, 2).map((o) => ({
      text: `Order ${o.id} — ${o.status}`,
      time: o.createdAt,
    })),
    ...prescriptions.slice(0, 2).map((rx) => ({
      text: `Prescription ${rx.name} — ${rx.status}`,
      time: rx.uploadedAt,
    })),
  ].slice(0, 4)

  return (
    <div className="space-y-6">
      <AdminPageHeader
        subtitle="Overview of platform metrics and recent activity"
        action={
          medicines.length === 0 ? (
            <Button size="sm" loading={seeding} onClick={handleSeed}>
              <Database className="h-4 w-4" />
              Seed Database
            </Button>
          ) : null
        }
      />

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
          {activity.length ? (
            activity.map((item) => (
              <li
                key={item.text}
                className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3 text-sm"
              >
                <span className="font-medium text-gray-800">{item.text}</span>
                <span className="text-xs text-gray-500">{item.time}</span>
              </li>
            ))
          ) : (
            <li className="rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3 text-sm text-gray-500">
              No activity yet. Seed the database or wait for user signups.
            </li>
          )}
        </ul>
      </Card>
    </div>
  )
}

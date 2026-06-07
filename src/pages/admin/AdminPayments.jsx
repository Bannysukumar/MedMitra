import { useMemo, useState } from 'react'
import { IndianRupee, Calendar, TrendingUp, Wallet } from 'lucide-react'
import { useAllOrders, useUsers } from '../../hooks/useFirestore'
import { computePaymentReports } from '../../utils/adminAnalytics'
import AdminPageHeader, {
  AdminSearch,
  AdminStatCard,
  AdminTable,
  AdminTableRow,
  AdminTableCell,
} from '../../components/admin/AdminComponents'
import StatusPill from '../../components/ui/StatusPill'
import { formatCurrency, formatDate } from '../../utils/helpers'

export default function AdminPayments() {
  const { data: orders, loading } = useAllOrders()
  const { data: users } = useUsers()
  const [search, setSearch] = useState('')

  const reports = computePaymentReports(orders)

  const userMap = useMemo(
    () => Object.fromEntries(users.map((u) => [u.uid, u.fullName || u.email])),
    [users]
  )

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return orders
    return orders.filter((o) => {
      const userLabel = userMap[o.userId] || o.userId || ''
      return (
        o.id?.toLowerCase().includes(q) ||
        userLabel.toLowerCase().includes(q) ||
        (o.payment || '').toLowerCase().includes(q) ||
        (o.paymentStatus || '').toLowerCase().includes(q)
      )
    })
  }, [orders, search, userMap])

  const statCards = [
    { label: 'Daily Revenue', value: formatCurrency(reports.daily), icon: IndianRupee, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
    { label: 'Weekly Revenue', value: formatCurrency(reports.weekly), icon: TrendingUp, iconBg: 'bg-blue-50', iconColor: 'text-blue-600' },
    { label: 'Monthly Revenue', value: formatCurrency(reports.monthly), icon: Calendar, iconBg: 'bg-teal-50', iconColor: 'text-teal-600' },
    { label: 'Annual Revenue', value: formatCurrency(reports.annual), icon: Wallet, iconBg: 'bg-purple-50', iconColor: 'text-purple-600' },
  ]

  return (
    <div className="space-y-6">
      <AdminPageHeader subtitle="Payment history and revenue reports" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((s) => (
          <AdminStatCard key={s.label} {...s} change="Paid orders" />
        ))}
      </div>

      <AdminSearch
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by order ID, user, or payment method…"
      />

      <AdminTable columns={['Order ID', 'User', 'Amount', 'Payment Method', 'Status', 'Date']}>
        {loading && (
          <AdminTableRow>
            <AdminTableCell colSpan={6}>Loading payments…</AdminTableCell>
          </AdminTableRow>
        )}
        {!loading && filtered.length === 0 && (
          <AdminTableRow>
            <AdminTableCell colSpan={6}>No payments found.</AdminTableCell>
          </AdminTableRow>
        )}
        {filtered.map((o) => (
          <AdminTableRow key={o.id}>
            <AdminTableCell highlight>{o.id}</AdminTableCell>
            <AdminTableCell>{userMap[o.userId] || o.userId || '—'}</AdminTableCell>
            <AdminTableCell>{formatCurrency(o.total)}</AdminTableCell>
            <AdminTableCell className="capitalize">{o.payment || o.paymentMethod || '—'}</AdminTableCell>
            <AdminTableCell>
              <StatusPill status={o.paymentStatus || 'paid'} type="payment" />
            </AdminTableCell>
            <AdminTableCell>{formatDate(o.createdAt)}</AdminTableCell>
          </AdminTableRow>
        ))}
      </AdminTable>
    </div>
  )
}

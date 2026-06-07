import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { Package, Ban, RotateCcw, FileDown } from 'lucide-react'
import { useAllOrders } from '../../hooks/useFirestore'
import { updateOrderStatus, deleteOrder } from '../../services/firestoreService'
import { downloadInvoice } from '../../services/adminService'
import { useAuth } from '../../contexts/AuthContext'
import AdminPageHeader, {
  AdminSearch,
  AdminTable,
  AdminTableRow,
  AdminTableCell,
  AdminRowActions,
  AdminSelect,
  confirmDelete,
} from '../../components/admin/AdminComponents'
import StatusPill from '../../components/ui/StatusPill'
import Button from '../../components/ui/Button'
import { ORDER_STATUSES, PAYMENT_STATUSES } from '../../config/constants'
import { formatCurrency, formatDate } from '../../utils/helpers'

const ALL_STATUSES = 'all'

export default function AdminOrders() {
  const { data: orders, loading } = useAllOrders()
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState(ALL_STATUSES)
  const [busyId, setBusyId] = useState(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return orders.filter((o) => {
      const matchesStatus = statusFilter === ALL_STATUSES || o.status === statusFilter
      if (!matchesStatus) return false
      if (!q) return true
      return (
        o.id?.toLowerCase().includes(q) ||
        o.userId?.toLowerCase().includes(q) ||
        o.status?.toLowerCase().includes(q) ||
        (o.paymentStatus || '').toLowerCase().includes(q) ||
        String(o.total ?? '').includes(q)
      )
    })
  }, [orders, search, statusFilter])

  const runUpdate = async (orderId, fn) => {
    setBusyId(orderId)
    try {
      await fn()
    } catch (err) {
      toast.error(err.message || 'Update failed')
    } finally {
      setBusyId(null)
    }
  }

  const handleStatusChange = (orderId, status) =>
    runUpdate(orderId, async () => {
      await updateOrderStatus(orderId, status)
      toast.success(`Order marked ${ORDER_STATUSES[status]?.label || status}`)
    })

  const handlePaymentChange = (order, paymentStatus) =>
    runUpdate(order.id, async () => {
      await updateOrderStatus(order.id, order.status, { paymentStatus })
      toast.success(`Payment status: ${PAYMENT_STATUSES[paymentStatus]?.label || paymentStatus}`)
    })

  const handleCancel = (order) => {
    if (!window.confirm(`Cancel order ${order.id}?`)) return
    handleStatusChange(order.id, 'cancelled')
  }

  const handleRefund = (order) => {
    if (!window.confirm(`Refund order ${order.id}? This marks the order and payment as refunded.`)) return
    runUpdate(order.id, async () => {
      await updateOrderStatus(order.id, 'refunded', { paymentStatus: 'refunded' })
      toast.success('Order refunded')
    })
  }

  const handleDelete = async (order) => {
    if (!confirmDelete(order.id)) return
    setBusyId(order.id)
    try {
      await deleteOrder(order.id)
      toast.success('Order deleted')
    } catch (err) {
      toast.error(err.message || 'Delete failed')
    } finally {
      setBusyId(null)
    }
  }

  const handleInvoice = (order) => {
    try {
      downloadInvoice(order)
      toast.success('Invoice downloaded')
    } catch (err) {
      toast.error(err.message || 'Download failed')
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        subtitle={
          loading
            ? 'Loading orders…'
            : `${orders.length} orders — live updates${user?.email ? ` · ${user.email}` : ''}`
        }
      />

      <div className="flex flex-wrap items-end gap-4">
        <AdminSearch
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search order ID, user, status…"
          className="max-w-md"
        />
        <AdminSelect
          label="Filter by status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="!w-auto min-w-[180px]"
        >
          <option value={ALL_STATUSES}>All statuses</option>
          {Object.keys(ORDER_STATUSES).map((s) => (
            <option key={s} value={s}>
              {ORDER_STATUSES[s].label}
            </option>
          ))}
        </AdminSelect>
        <p className="pb-2 text-sm text-gray-500">
          Showing {filtered.length} of {orders.length}
        </p>
      </div>

      <AdminTable
        columns={['Order ID', 'Date', 'Total', 'Status', 'Payment', 'Actions']}
      >
        {loading && (
          <AdminTableRow>
            <AdminTableCell colSpan={6}>Loading orders…</AdminTableCell>
          </AdminTableRow>
        )}
        {!loading && filtered.length === 0 && (
          <AdminTableRow>
            <AdminTableCell colSpan={6}>
              {search || statusFilter !== ALL_STATUSES
                ? 'No orders match your filters.'
                : 'No orders yet.'}
            </AdminTableCell>
          </AdminTableRow>
        )}
        {filtered.map((o) => (
          <AdminTableRow key={o.id}>
            <AdminTableCell highlight>
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-gray-400" />
                {o.id}
              </div>
            </AdminTableCell>
            <AdminTableCell>{formatDate(o.createdAt)}</AdminTableCell>
            <AdminTableCell>{formatCurrency(o.total)}</AdminTableCell>
            <AdminTableCell>
              <StatusPill status={o.status} type="order" />
            </AdminTableCell>
            <AdminTableCell>
              <div className="flex flex-col gap-2">
                <StatusPill status={o.paymentStatus || 'paid'} type="payment" />
                <AdminSelect
                  value={o.paymentStatus || 'paid'}
                  onChange={(e) => handlePaymentChange(o, e.target.value)}
                  className="!w-auto min-w-[120px] py-1.5 text-xs"
                  disabled={busyId === o.id}
                >
                  {Object.keys(PAYMENT_STATUSES).map((s) => (
                    <option key={s} value={s}>
                      {PAYMENT_STATUSES[s].label}
                    </option>
                  ))}
                </AdminSelect>
              </div>
            </AdminTableCell>
            <AdminTableCell>
              <AdminRowActions onDelete={() => handleDelete(o)}>
                <AdminSelect
                  value={o.status || 'pending'}
                  onChange={(e) => handleStatusChange(o.id, e.target.value)}
                  className="!w-auto min-w-[150px] py-1.5"
                  disabled={busyId === o.id}
                >
                  {Object.keys(ORDER_STATUSES).map((s) => (
                    <option key={s} value={s}>
                      {ORDER_STATUSES[s].label}
                    </option>
                  ))}
                </AdminSelect>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCancel(o)}
                  disabled={busyId === o.id || o.status === 'cancelled'}
                >
                  <Ban className="h-3.5 w-3.5" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleRefund(o)}
                  disabled={busyId === o.id || o.status === 'refunded'}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Refund
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleInvoice(o)}
                  disabled={busyId === o.id}
                >
                  <FileDown className="h-3.5 w-3.5" />
                  Invoice
                </Button>
              </AdminRowActions>
            </AdminTableCell>
          </AdminTableRow>
        ))}
      </AdminTable>
    </div>
  )
}

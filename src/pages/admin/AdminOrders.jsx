import toast from 'react-hot-toast'
import { useAllOrders } from '../../hooks/useFirestore'
import { updateOrderStatus, deleteOrder } from '../../services/firestoreService'
import AdminPageHeader, {
  AdminTable,
  AdminTableRow,
  AdminTableCell,
  AdminRowActions,
  AdminSelect,
  confirmDelete,
} from '../../components/admin/AdminComponents'
import StatusPill from '../../components/ui/StatusPill'
import { ORDER_STATUSES } from '../../config/constants'
import { formatCurrency, formatDate } from '../../utils/helpers'

export default function AdminOrders() {
  const { data: orders, loading } = useAllOrders()

  const handleStatusChange = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status)
      toast.success('Order status updated')
    } catch (err) {
      toast.error(err.message || 'Update failed')
    }
  }

  const handleDelete = async (order) => {
    if (!confirmDelete(order.id)) return
    try {
      await deleteOrder(order.id)
      toast.success('Order deleted')
    } catch (err) {
      toast.error(err.message || 'Delete failed')
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader subtitle="Manage and track all platform orders" />

      <AdminTable columns={['Order ID', 'Date', 'Total', 'Status', 'Actions']}>
        {loading && (
          <AdminTableRow>
            <AdminTableCell colSpan={5}>Loading...</AdminTableCell>
          </AdminTableRow>
        )}
        {!loading && orders.length === 0 && (
          <AdminTableRow>
            <AdminTableCell colSpan={5}>No orders yet.</AdminTableCell>
          </AdminTableRow>
        )}
        {orders.map((o) => (
          <AdminTableRow key={o.id}>
            <AdminTableCell highlight>{o.id}</AdminTableCell>
            <AdminTableCell>{formatDate(o.createdAt)}</AdminTableCell>
            <AdminTableCell>{formatCurrency(o.total)}</AdminTableCell>
            <AdminTableCell>
              <StatusPill status={o.status} />
            </AdminTableCell>
            <AdminTableCell>
              <AdminRowActions onDelete={() => handleDelete(o)}>
                <AdminSelect
                  value={o.status}
                  onChange={(e) => handleStatusChange(o.id, e.target.value)}
                  className="!w-auto min-w-[130px] py-1.5"
                >
                  {Object.keys(ORDER_STATUSES).map((s) => (
                    <option key={s} value={s}>{ORDER_STATUSES[s].label}</option>
                  ))}
                </AdminSelect>
              </AdminRowActions>
            </AdminTableCell>
          </AdminTableRow>
        ))}
      </AdminTable>
    </div>
  )
}

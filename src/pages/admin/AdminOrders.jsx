import { demoOrders } from '../../data/mockData'
import AdminPageHeader, {
  AdminTable,
  AdminTableRow,
  AdminTableCell,
} from '../../components/admin/AdminComponents'
import StatusPill from '../../components/ui/StatusPill'
import { formatCurrency, formatDate } from '../../utils/helpers'

export default function AdminOrders() {
  return (
    <div className="space-y-6">
      <AdminPageHeader subtitle="Manage and track all platform orders" />

      <AdminTable columns={['Order ID', 'Date', 'Total', 'Status']}>
        {demoOrders.map((o) => (
          <AdminTableRow key={o.id}>
            <AdminTableCell highlight>{o.id}</AdminTableCell>
            <AdminTableCell>{formatDate(o.createdAt)}</AdminTableCell>
            <AdminTableCell>{formatCurrency(o.total)}</AdminTableCell>
            <AdminTableCell>
              <StatusPill status={o.status} />
            </AdminTableCell>
          </AdminTableRow>
        ))}
      </AdminTable>
    </div>
  )
}

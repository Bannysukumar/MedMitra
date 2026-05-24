import AdminPageHeader, {
  AdminTable,
  AdminTableRow,
  AdminTableCell,
} from '../../components/admin/AdminComponents'

const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', plan: 'premium', orders: 12, status: 'active' },
  { id: 2, name: 'Priya Sharma', email: 'priya@example.com', plan: 'free', orders: 3, status: 'active' },
  { id: 3, name: 'Rajesh Kumar', email: 'rajesh@example.com', plan: 'family', orders: 28, status: 'active' },
  { id: 4, name: 'Anita Desai', email: 'anita@example.com', plan: 'premium', orders: 15, status: 'inactive' },
]

export default function AdminUsers() {
  return (
    <div className="space-y-6">
      <AdminPageHeader subtitle="Manage platform users and membership plans" />

      <AdminTable columns={['Name', 'Email', 'Plan', 'Orders', 'Status']}>
        {users.map((u) => (
          <AdminTableRow key={u.id}>
            <AdminTableCell highlight>{u.name}</AdminTableCell>
            <AdminTableCell>{u.email}</AdminTableCell>
            <AdminTableCell className="capitalize">{u.plan}</AdminTableCell>
            <AdminTableCell>{u.orders}</AdminTableCell>
            <AdminTableCell>
              <span
                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                  u.status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {u.status}
              </span>
            </AdminTableCell>
          </AdminTableRow>
        ))}
      </AdminTable>
    </div>
  )
}

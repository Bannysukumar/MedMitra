import { Plus } from 'lucide-react'
import { medicines } from '../../data/mockData'
import AdminPageHeader, {
  AdminTable,
  AdminTableRow,
  AdminTableCell,
} from '../../components/admin/AdminComponents'
import Button from '../../components/ui/Button'
import { formatCurrency } from '../../utils/helpers'

export default function AdminMedicines() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        subtitle={`${medicines.length} products in the medicine catalog`}
        action={
          <Button size="sm">
            <Plus className="h-4 w-4" />
            Add Medicine
          </Button>
        }
      />

      <AdminTable columns={['Name', 'Category', 'Price', 'Stock', 'Rating']}>
        {medicines.map((m) => (
          <AdminTableRow key={m.id}>
            <AdminTableCell highlight>{m.name}</AdminTableCell>
            <AdminTableCell>{m.category}</AdminTableCell>
            <AdminTableCell>{formatCurrency(m.price)}</AdminTableCell>
            <AdminTableCell>
              <span
                className={
                  m.stock < 150 ? 'font-medium text-orange-600' : 'text-gray-700'
                }
              >
                {m.stock}
              </span>
            </AdminTableCell>
            <AdminTableCell>{m.rating} ★</AdminTableCell>
          </AdminTableRow>
        ))}
      </AdminTable>
    </div>
  )
}

import { useState } from 'react'
import { Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import { useMedicines } from '../../hooks/useFirestore'
import { saveMedicine, deleteMedicine } from '../../services/firestoreService'
import AdminPageHeader, {
  AdminTable,
  AdminTableRow,
  AdminTableCell,
  AdminRowActions,
  AdminSelect,
  confirmDelete,
} from '../../components/admin/AdminComponents'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input, { Textarea } from '../../components/ui/Input'
import { MEDICINE_CATEGORIES } from '../../config/constants'
import { formatCurrency } from '../../utils/helpers'

const EMPTY = {
  name: '',
  brand: '',
  category: MEDICINE_CATEGORIES[0],
  price: '',
  stock: '',
  rating: '4.5',
  image: '',
  description: '',
}

export default function AdminMedicines() {
  const { data: medicines, loading } = useMedicines()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY)
    setModalOpen(true)
  }

  const openEdit = (med) => {
    setEditing(med)
    setForm({
      name: med.name || '',
      brand: med.brand || '',
      category: med.category || MEDICINE_CATEGORIES[0],
      price: String(med.price ?? ''),
      stock: String(med.stock ?? ''),
      rating: String(med.rating ?? '4.5'),
      image: med.image || '',
      description: med.description || '',
    })
    setModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await saveMedicine(editing?.id, {
        name: form.name.trim(),
        brand: form.brand.trim(),
        category: form.category,
        price: Number(form.price),
        stock: Number(form.stock),
        rating: Number(form.rating),
        image: form.image.trim(),
        description: form.description.trim(),
        reviews: editing?.reviews ?? 0,
        genericName: editing?.genericName || form.name.trim(),
        dosage: editing?.dosage || '',
        usage: editing?.usage || '',
        sideEffects: editing?.sideEffects || '',
        symptoms: editing?.symptoms || [],
      })
      toast.success(editing ? 'Medicine updated' : 'Medicine added')
      setModalOpen(false)
    } catch (err) {
      toast.error(err.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (med) => {
    if (!confirmDelete(med.name)) return
    try {
      await deleteMedicine(med.id)
      toast.success('Medicine deleted')
    } catch (err) {
      toast.error(err.message || 'Delete failed')
    }
  }

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  return (
    <div className="space-y-6">
      <AdminPageHeader
        subtitle={loading ? 'Loading catalog...' : `${medicines.length} products in the medicine catalog`}
        action={
          <Button size="sm" onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Add Medicine
          </Button>
        }
      />

      <AdminTable columns={['Name', 'Category', 'Price', 'Stock', 'Rating', 'Actions']}>
        {loading && (
          <AdminTableRow>
            <AdminTableCell colSpan={6}>Loading...</AdminTableCell>
          </AdminTableRow>
        )}
        {!loading && medicines.length === 0 && (
          <AdminTableRow>
            <AdminTableCell colSpan={6}>No medicines yet. Add one or seed the database.</AdminTableCell>
          </AdminTableRow>
        )}
        {medicines.map((m) => (
          <AdminTableRow key={m.id}>
            <AdminTableCell highlight>{m.name}</AdminTableCell>
            <AdminTableCell>{m.category}</AdminTableCell>
            <AdminTableCell>{formatCurrency(m.price)}</AdminTableCell>
            <AdminTableCell>
              <span className={m.stock < 150 ? 'font-medium text-orange-600' : 'text-gray-700'}>
                {m.stock}
              </span>
            </AdminTableCell>
            <AdminTableCell>{m.rating} ★</AdminTableCell>
            <AdminTableCell>
              <AdminRowActions onEdit={() => openEdit(m)} onDelete={() => handleDelete(m)} />
            </AdminTableCell>
          </AdminTableRow>
        ))}
      </AdminTable>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Medicine' : 'Add Medicine'}
        size="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Name" value={form.name} onChange={set('name')} required />
            <Input label="Brand" value={form.brand} onChange={set('brand')} required />
            <AdminSelect label="Category" value={form.category} onChange={set('category')} required>
              {MEDICINE_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </AdminSelect>
            <Input label="Price (₹)" type="number" min="0" value={form.price} onChange={set('price')} required />
            <Input label="Stock" type="number" min="0" value={form.stock} onChange={set('stock')} required />
            <Input label="Rating" type="number" min="0" max="5" step="0.1" value={form.rating} onChange={set('rating')} />
          </div>
          <Input label="Image URL" value={form.image} onChange={set('image')} />
          <Textarea label="Description" rows={3} value={form.description} onChange={set('description')} />
          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={saving} className="flex-1">
              {editing ? 'Update Medicine' : 'Add Medicine'}
            </Button>
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

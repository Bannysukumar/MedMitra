import { useMemo, useRef, useState } from 'react'
import { Plus, Upload, Download, Archive, ArchiveRestore } from 'lucide-react'
import toast from 'react-hot-toast'
import { useMedicines } from '../../hooks/useFirestore'
import { useAuth } from '../../contexts/AuthContext'
import { saveMedicine, deleteMedicine } from '../../services/firestoreService'
import {
  archiveMedicine,
  bulkImportMedicines,
  parseMedicineCsv,
  downloadJson,
  logAdminAction,
} from '../../services/adminService'
import AdminPageHeader, {
  AdminTable,
  AdminTableRow,
  AdminTableCell,
  AdminRowActions,
  AdminSelect,
  AdminTabs,
  confirmDelete,
} from '../../components/admin/AdminComponents'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input, { Textarea } from '../../components/ui/Input'
import { MEDICINE_CATEGORIES } from '../../config/constants'
import { formatCurrency } from '../../utils/helpers'

const TABS = ['Active', 'Archived']
const LOW_STOCK_THRESHOLD = 10

const EMPTY = {
  name: '',
  genericName: '',
  brand: '',
  category: MEDICINE_CATEGORIES[0],
  description: '',
  usage: '',
  dosage: '',
  sideEffects: '',
  warnings: '',
  stock: '',
  price: '',
  discount: '',
  rating: '4.5',
  image: '',
}

function stockRowClass(stock) {
  const n = Number(stock)
  if (n <= 0) return 'bg-red-50/80 hover:bg-red-50'
  if (n <= LOW_STOCK_THRESHOLD) return 'bg-orange-50/80 hover:bg-orange-50'
  return ''
}

function stockLabelClass(stock) {
  const n = Number(stock)
  if (n <= 0) return 'font-semibold text-red-600'
  if (n <= LOW_STOCK_THRESHOLD) return 'font-medium text-orange-600'
  return 'text-gray-700'
}

export default function AdminMedicines() {
  const { user: adminUser, profile: adminProfile } = useAuth()
  const admin = adminUser
    ? {
        uid: adminUser.uid,
        email: adminUser.email,
        displayName: adminUser.displayName,
        fullName: adminProfile?.fullName,
      }
    : null

  const { data: medicines, loading } = useMedicines()
  const fileInputRef = useRef(null)

  const [activeTab, setActiveTab] = useState('Active')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [importing, setImporting] = useState(false)

  const visibleMedicines = useMemo(
    () =>
      medicines.filter((m) =>
        activeTab === 'Archived' ? m.archived === true : !m.archived
      ),
    [medicines, activeTab]
  )

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY)
    setModalOpen(true)
  }

  const openEdit = (med) => {
    setEditing(med)
    setForm({
      name: med.name || '',
      genericName: med.genericName || '',
      brand: med.brand || '',
      category: med.category || MEDICINE_CATEGORIES[0],
      description: med.description || '',
      usage: med.usage || '',
      dosage: med.dosage || '',
      sideEffects: med.sideEffects || '',
      warnings: med.warnings || '',
      stock: String(med.stock ?? ''),
      price: String(med.price ?? ''),
      discount: String(med.discount ?? ''),
      rating: String(med.rating ?? '4.5'),
      image: med.image || '',
    })
    setModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        name: form.name.trim(),
        genericName: form.genericName.trim() || form.name.trim(),
        brand: form.brand.trim(),
        category: form.category,
        description: form.description.trim(),
        usage: form.usage.trim(),
        dosage: form.dosage.trim(),
        sideEffects: form.sideEffects.trim(),
        warnings: form.warnings.trim(),
        stock: Number(form.stock),
        price: Number(form.price),
        discount: Number(form.discount) || 0,
        rating: Number(form.rating),
        image: form.image.trim(),
        reviews: editing?.reviews ?? 0,
        symptoms: editing?.symptoms || [],
        archived: editing?.archived ?? false,
      }
      await saveMedicine(editing?.id, payload)
      await logAdminAction(admin, {
        action: editing ? 'Medicine Updated' : 'Medicine Created',
        module: 'medicines',
        details: payload.name,
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
      await logAdminAction(admin, {
        action: 'Medicine Deleted',
        module: 'medicines',
        details: med.name,
      })
      toast.success('Medicine deleted')
    } catch (err) {
      toast.error(err.message || 'Delete failed')
    }
  }

  const handleArchiveToggle = async (med) => {
    const archived = !med.archived
    try {
      await archiveMedicine(med.id, archived, admin)
      toast.success(archived ? 'Medicine archived' : 'Medicine restored')
    } catch (err) {
      toast.error(err.message || 'Update failed')
    }
  }

  const handleImport = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImporting(true)
    try {
      const text = await file.text()
      const rows = parseMedicineCsv(text)
      if (!rows.length) {
        toast.error('No valid rows found in CSV')
        return
      }
      const count = await bulkImportMedicines(rows, admin)
      toast.success(`Imported ${count} medicine(s)`)
    } catch (err) {
      toast.error(err.message || 'Import failed')
    } finally {
      setImporting(false)
      e.target.value = ''
    }
  }

  const handleExport = () => {
    downloadJson(`medicines-${activeTab.toLowerCase()}.json`, visibleMedicines)
    toast.success('Export downloaded')
  }

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  return (
    <div className="space-y-6">
      <AdminPageHeader
        subtitle={
          loading
            ? 'Loading catalog…'
            : `${visibleMedicines.length} ${activeTab.toLowerCase()} · ${medicines.length} total in catalog`
        }
        action={
          <div className="flex flex-wrap gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={handleImport}
            />
            <Button
              type="button"
              size="sm"
              variant="outline"
              loading={importing}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4" />
              Bulk Import
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4" />
              Bulk Export
            </Button>
            <Button size="sm" onClick={openCreate}>
              <Plus className="h-4 w-4" />
              Add Medicine
            </Button>
          </div>
        }
      />

      <AdminTabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

      <AdminTable columns={['Name', 'Category', 'Price', 'Stock', 'Rating', 'Actions']}>
        {loading && (
          <AdminTableRow>
            <AdminTableCell colSpan={6}>Loading…</AdminTableCell>
          </AdminTableRow>
        )}
        {!loading && visibleMedicines.length === 0 && (
          <AdminTableRow>
            <AdminTableCell colSpan={6}>
              {activeTab === 'Active'
                ? 'No active medicines. Add one or import from CSV.'
                : 'No archived medicines.'}
            </AdminTableCell>
          </AdminTableRow>
        )}
        {visibleMedicines.map((m) => (
          <AdminTableRow key={m.id} className={stockRowClass(m.stock)}>
            <AdminTableCell highlight>{m.name}</AdminTableCell>
            <AdminTableCell>{m.category}</AdminTableCell>
            <AdminTableCell>{formatCurrency(m.price)}</AdminTableCell>
            <AdminTableCell>
              <span className={stockLabelClass(m.stock)}>
                {Number(m.stock) <= 0 ? 'Out of stock' : m.stock}
              </span>
            </AdminTableCell>
            <AdminTableCell>{m.rating} ★</AdminTableCell>
            <AdminTableCell>
              <AdminRowActions onEdit={() => openEdit(m)} onDelete={() => handleDelete(m)}>
                <Button type="button" size="sm" variant="outline" onClick={() => handleArchiveToggle(m)}>
                  {m.archived ? (
                    <>
                      <ArchiveRestore className="h-3.5 w-3.5" />
                      Restore
                    </>
                  ) : (
                    <>
                      <Archive className="h-3.5 w-3.5" />
                      Archive
                    </>
                  )}
                </Button>
              </AdminRowActions>
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
            <Input label="Generic name" value={form.genericName} onChange={set('genericName')} />
            <Input label="Brand" value={form.brand} onChange={set('brand')} required />
            <AdminSelect label="Category" value={form.category} onChange={set('category')} required>
              {MEDICINE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </AdminSelect>
            <Input
              label="Price (₹)"
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={set('price')}
              required
            />
            <Input label="Discount (%)" type="number" min="0" max="100" value={form.discount} onChange={set('discount')} />
            <Input label="Stock" type="number" min="0" value={form.stock} onChange={set('stock')} required />
            <Input
              label="Rating"
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={form.rating}
              onChange={set('rating')}
            />
          </div>
          <Input label="Image URL" value={form.image} onChange={set('image')} />
          <Textarea label="Description" rows={2} value={form.description} onChange={set('description')} />
          <Textarea label="Usage" rows={2} value={form.usage} onChange={set('usage')} />
          <Textarea label="Dosage" rows={2} value={form.dosage} onChange={set('dosage')} />
          <Textarea label="Side effects" rows={2} value={form.sideEffects} onChange={set('sideEffects')} />
          <Textarea label="Warnings" rows={2} value={form.warnings} onChange={set('warnings')} />
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

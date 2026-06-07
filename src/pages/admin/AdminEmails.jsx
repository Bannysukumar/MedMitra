import { useState } from 'react'
import toast from 'react-hot-toast'
import { Plus } from 'lucide-react'
import { useEmailTemplates } from '../../hooks/useFirestore'
import { useAuth } from '../../contexts/AuthContext'
import { saveEmailTemplate, deleteEmailTemplate } from '../../services/adminService'
import AdminPageHeader, {
  AdminRowActions,
  AdminSelect,
  confirmDelete,
} from '../../components/admin/AdminComponents'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input, { Textarea } from '../../components/ui/Input'

const EMAIL_TYPES = [
  { value: 'welcome', label: 'Welcome' },
  { value: 'order', label: 'Order' },
  { value: 'prescription', label: 'Prescription' },
  { value: 'newsletter', label: 'Newsletter' },
]

const emptyForm = () => ({ name: '', subject: '', body: '', type: 'welcome' })

export default function AdminEmails() {
  const { user, profile } = useAuth()
  const { data: templates, loading } = useEmailTemplates()
  const [modal, setModal] = useState(null)
  const [preview, setPreview] = useState(null)
  const [form, setForm] = useState(emptyForm())
  const [saving, setSaving] = useState(false)

  const admin = user
    ? { uid: user.uid, email: user.email, displayName: profile?.fullName || user.displayName, fullName: profile?.fullName }
    : null

  const openNew = () => {
    setForm(emptyForm())
    setModal({ item: null })
  }

  const openEdit = (t) => {
    setForm({ name: t.name || '', subject: t.subject || '', body: t.body || '', type: t.type || 'welcome' })
    setModal({ item: t })
  }

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await saveEmailTemplate(modal?.item?.id, form, admin)
      toast.success(modal?.item ? 'Template updated' : 'Template created')
      setModal(null)
      setForm(emptyForm())
    } catch (err) {
      toast.error(err.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (t) => {
    if (!confirmDelete(t.name)) return
    try {
      await deleteEmailTemplate(t.id, admin)
      toast.success('Template deleted')
    } catch (err) {
      toast.error(err.message || 'Delete failed')
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        subtitle="Email template CRUD — welcome, order, prescription, newsletter"
        action={
          <Button size="sm" onClick={openNew}>
            <Plus className="h-4 w-4" /> New Template
          </Button>
        }
      />

      <Card className="!p-6">
        {loading && <p className="text-sm text-gray-500">Loading templates…</p>}
        <ul className="space-y-2">
          {!loading && templates.length === 0 && (
            <li className="rounded-xl border border-dashed border-gray-200 px-4 py-8 text-center text-sm text-gray-500">
              No email templates yet.
            </li>
          )}
          {templates.map((t) => (
            <li
              key={t.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3 text-sm"
            >
              <div>
                <span className="font-medium text-gray-800">{t.name}</span>
                <span className="ml-2 text-xs capitalize text-gray-500">({t.type})</span>
              </div>
              <AdminRowActions
                onEdit={() => openEdit(t)}
                onDelete={() => handleDelete(t)}
              >
                <Button type="button" size="sm" variant="outline" onClick={() => setPreview(t)}>
                  Preview
                </Button>
              </AdminRowActions>
            </li>
          ))}
        </ul>
      </Card>

      <Modal
        open={!!modal}
        onClose={() => { setModal(null); setForm(emptyForm()) }}
        title={modal?.item ? 'Edit Email Template' : 'New Email Template'}
        size="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input label="Name" value={form.name} onChange={set('name')} required />
          <Input label="Subject" value={form.subject} onChange={set('subject')} required />
          <AdminSelect label="Type" value={form.type} onChange={set('type')}>
            {EMAIL_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </AdminSelect>
          <Textarea label="Body" rows={8} value={form.body} onChange={set('body')} required />
          <div className="flex gap-3">
            <Button type="submit" loading={saving} className="flex-1">Save</Button>
            <Button type="button" variant="outline" onClick={() => { setModal(null); setForm(emptyForm()) }}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      <Modal open={!!preview} onClose={() => setPreview(null)} title="Email Preview" size="lg">
        {preview && (
          <div className="space-y-3">
            <p className="text-sm"><strong>Subject:</strong> {preview.subject}</p>
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm whitespace-pre-wrap text-gray-800">
              {preview.body}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

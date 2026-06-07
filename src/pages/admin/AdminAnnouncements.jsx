import { useState } from 'react'
import toast from 'react-hot-toast'
import { Plus } from 'lucide-react'
import { useAnnouncements } from '../../hooks/useFirestore'
import { useAuth } from '../../contexts/AuthContext'
import { saveAnnouncement, deleteAnnouncement } from '../../services/adminService'
import { ANNOUNCEMENT_TYPES, ANNOUNCEMENT_DISPLAY } from '../../config/constants'
import AdminPageHeader, {
  AdminRowActions,
  AdminSelect,
  AdminBadge,
  confirmDelete,
} from '../../components/admin/AdminComponents'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input, { Textarea } from '../../components/ui/Input'

const emptyForm = () => ({
  title: '',
  message: '',
  type: 'information',
  display: 'banner',
  published: false,
})

export default function AdminAnnouncements() {
  const { user, profile } = useAuth()
  const { data: announcements, loading } = useAnnouncements()
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(emptyForm())
  const [saving, setSaving] = useState(false)

  const admin = user
    ? { uid: user.uid, email: user.email, displayName: profile?.fullName || user.displayName, fullName: profile?.fullName }
    : null

  const openNew = () => {
    setForm(emptyForm())
    setModal({ item: null })
  }

  const openEdit = (a) => {
    setModal({ item: a })
    setForm({
      title: a.title || '',
      message: a.message || '',
      type: a.type || 'information',
      display: a.display || 'banner',
      published: !!a.published,
    })
  }

  const set = (key) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((f) => ({ ...f, [key]: val }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await saveAnnouncement(modal?.item?.id, { ...form, createdAt: modal?.item?.createdAt || new Date().toISOString() }, admin)
      toast.success(modal?.item ? 'Announcement updated' : 'Announcement created')
      setModal(null)
      setForm(emptyForm())
    } catch (err) {
      toast.error(err.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (a) => {
    if (!confirmDelete(a.title)) return
    try {
      await deleteAnnouncement(a.id, admin)
      toast.success('Announcement deleted')
    } catch (err) {
      toast.error(err.message || 'Delete failed')
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        subtitle="Site announcements — banner, popup, or dashboard alerts"
        action={
          <Button size="sm" onClick={openNew}>
            <Plus className="h-4 w-4" /> New Announcement
          </Button>
        }
      />

      <Card className="!p-6">
        {loading && <p className="text-sm text-gray-500">Loading…</p>}
        <ul className="space-y-2">
          {!loading && announcements.length === 0 && (
            <li className="rounded-xl border border-dashed border-gray-200 px-4 py-8 text-center text-sm text-gray-500">
              No announcements yet.
            </li>
          )}
          {announcements.map((a) => (
            <li
              key={a.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3 text-sm"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium text-gray-800">{a.title}</span>
                <AdminBadge label={a.type} color={ANNOUNCEMENT_TYPES[a.type]?.color || 'gray'} />
                <AdminBadge label={ANNOUNCEMENT_DISPLAY[a.display] || a.display} color="blue" />
                {a.published ? <AdminBadge label="Published" color="green" /> : <AdminBadge label="Draft" color="gray" />}
              </div>
              <AdminRowActions onEdit={() => openEdit(a)} onDelete={() => handleDelete(a)} />
            </li>
          ))}
        </ul>
      </Card>

      <Modal
        open={!!modal}
        onClose={() => { setModal(null); setForm(emptyForm()) }}
        title={modal?.item ? 'Edit Announcement' : 'New Announcement'}
        size="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input label="Title" value={form.title} onChange={set('title')} required />
          <Textarea label="Message" rows={4} value={form.message} onChange={set('message')} required />
          <AdminSelect label="Type" value={form.type} onChange={set('type')}>
            {Object.keys(ANNOUNCEMENT_TYPES).map((k) => (
              <option key={k} value={k}>{ANNOUNCEMENT_TYPES[k].label}</option>
            ))}
          </AdminSelect>
          <AdminSelect label="Display" value={form.display} onChange={set('display')}>
            {Object.entries(ANNOUNCEMENT_DISPLAY).map(([k, label]) => (
              <option key={k} value={k}>{label}</option>
            ))}
          </AdminSelect>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <input type="checkbox" checked={form.published} onChange={set('published')} />
            Published
          </label>
          <div className="flex gap-3">
            <Button type="submit" loading={saving} className="flex-1">Save</Button>
            <Button type="button" variant="outline" onClick={() => { setModal(null); setForm(emptyForm()) }}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

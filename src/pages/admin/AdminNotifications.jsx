import { useState } from 'react'
import toast from 'react-hot-toast'
import { useUsers } from '../../hooks/useFirestore'
import { useAuth } from '../../contexts/AuthContext'
import { sendAdminNotification, broadcastNotification } from '../../services/adminService'
import AdminPageHeader, { AdminSelect } from '../../components/admin/AdminComponents'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input, { Textarea } from '../../components/ui/Input'

const NOTIFICATION_TYPES = [
  { value: 'system', label: 'System' },
  { value: 'order', label: 'Order' },
  { value: 'prescription', label: 'Prescription' },
  { value: 'promo', label: 'Promotional' },
]

export default function AdminNotifications() {
  const { user, profile } = useAuth()
  const { data: users, loading } = useUsers()
  const [form, setForm] = useState({
    title: '',
    message: '',
    type: 'system',
    target: 'all',
    userId: '',
  })
  const [sending, setSending] = useState(false)

  const admin = user
    ? { uid: user.uid, email: user.email, displayName: profile?.fullName || user.displayName, fullName: profile?.fullName }
    : null

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.message.trim()) {
      toast.error('Title and message are required')
      return
    }
    setSending(true)
    try {
      const payload = { title: form.title.trim(), message: form.message.trim(), type: form.type }
      if (form.target === 'all') {
        const ids = users.map((u) => u.uid).filter(Boolean)
        const count = await broadcastNotification(payload, ids, admin)
        toast.success(`Broadcast sent to ${count} user(s)`)
      } else {
        if (!form.userId) {
          toast.error('Select a user')
          return
        }
        const count = await sendAdminNotification({ ...payload, userIds: [form.userId] }, admin)
        toast.success(`Notification sent to ${count} user(s)`)
      }
      setForm({ title: '', message: '', type: 'system', target: 'all', userId: '' })
    } catch (err) {
      toast.error(err.message || 'Send failed')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader subtitle="Send notifications to a single user or broadcast to all users" />

      <Card className="!p-6 max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Title" value={form.title} onChange={set('title')} required />
          <Textarea label="Message" rows={4} value={form.message} onChange={set('message')} required />
          <AdminSelect label="Type" value={form.type} onChange={set('type')}>
            {NOTIFICATION_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </AdminSelect>
          <AdminSelect label="Target" value={form.target} onChange={set('target')}>
            <option value="all">All users (broadcast)</option>
            <option value="single">Single user</option>
          </AdminSelect>
          {form.target === 'single' && (
            <AdminSelect label="User" value={form.userId} onChange={set('userId')} disabled={loading}>
              <option value="">Select user…</option>
              {users.map((u) => (
                <option key={u.uid} value={u.uid}>
                  {u.fullName || u.email} ({u.email})
                </option>
              ))}
            </AdminSelect>
          )}
          <Button type="submit" loading={sending} className="w-full">
            {form.target === 'all' ? 'Broadcast Notification' : 'Send Notification'}
          </Button>
        </form>
      </Card>
    </div>
  )
}

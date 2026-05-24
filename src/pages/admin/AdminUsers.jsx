import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import AdminPageHeader, {
  AdminTable,
  AdminTableRow,
  AdminTableCell,
  AdminRowActions,
  AdminSelect,
} from '../../components/admin/AdminComponents'
import { useUsers } from '../../hooks/useFirestore'
import { getUserOrderCount, updateAdminUser } from '../../services/firestoreService'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

export default function AdminUsers() {
  const { data: users, loading } = useUsers()
  const [orderCounts, setOrderCounts] = useState({})
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ fullName: '', role: 'user', plan: 'free' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    users.forEach(async (u) => {
      const count = await getUserOrderCount(u.uid)
      setOrderCounts((prev) => ({ ...prev, [u.uid]: count }))
    })
  }, [users])

  const openEdit = (u) => {
    setEditing(u)
    setForm({
      fullName: u.fullName || '',
      role: u.role || 'user',
      plan: u.plan || 'free',
    })
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!editing) return
    setSaving(true)
    try {
      await updateAdminUser(editing.uid, {
        fullName: form.fullName.trim(),
        role: form.role,
        plan: form.plan,
      })
      toast.success('User updated')
      setEditing(null)
    } catch (err) {
      toast.error(err.message || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader subtitle="Manage platform users and membership plans" />

      <AdminTable columns={['Name', 'Email', 'Plan', 'Orders', 'Role', 'Actions']}>
        {loading && (
          <AdminTableRow>
            <AdminTableCell colSpan={6}>Loading users...</AdminTableCell>
          </AdminTableRow>
        )}
        {users.map((u) => (
          <AdminTableRow key={u.uid}>
            <AdminTableCell highlight>{u.fullName || u.email}</AdminTableCell>
            <AdminTableCell>{u.email}</AdminTableCell>
            <AdminTableCell className="capitalize">{u.plan || 'free'}</AdminTableCell>
            <AdminTableCell>{orderCounts[u.uid] ?? '—'}</AdminTableCell>
            <AdminTableCell>
              <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold capitalize text-gray-700">
                {u.role || 'user'}
              </span>
            </AdminTableCell>
            <AdminTableCell>
              <AdminRowActions onEdit={() => openEdit(u)} />
            </AdminTableCell>
          </AdminTableRow>
        ))}
      </AdminTable>

      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit User">
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Full Name"
            value={form.fullName}
            onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
          />
          <Input label="Email" value={editing?.email || ''} disabled />
          <AdminSelect
            label="Role"
            value={form.role}
            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </AdminSelect>
          <AdminSelect
            label="Plan"
            value={form.plan}
            onChange={(e) => setForm((f) => ({ ...f, plan: e.target.value }))}
          >
            <option value="free">Free</option>
            <option value="premium">Premium</option>
            <option value="family">Family</option>
          </AdminSelect>
          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={saving} className="flex-1">Save Changes</Button>
            <Button type="button" variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

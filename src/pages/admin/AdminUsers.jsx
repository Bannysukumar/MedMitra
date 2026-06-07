import { Fragment, useEffect, useMemo, useState } from 'react'
import {
  Eye,
  LogOut,
  KeyRound,
  MessageSquarePlus,
  ShieldCheck,
  ShieldOff,
  Ban,
  CheckCircle,
  Trash2,
} from 'lucide-react'
import toast from 'react-hot-toast'
import AdminPageHeader, {
  AdminTable,
  AdminTableRow,
  AdminTableCell,
  AdminRowActions,
  AdminSelect,
  AdminSearch,
  AdminBadge,
  confirmDelete,
} from '../../components/admin/AdminComponents'
import { useUsers, useUserOrders, useUserPrescriptions, useAllOrders } from '../../hooks/useFirestore'
import { useAuth } from '../../contexts/AuthContext'
import {
  updateUserAccount,
  deleteUserAccount,
  addUserNote,
  forceLogoutUser,
  resetUserPassword,
} from '../../services/adminService'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import Input, { Textarea } from '../../components/ui/Input'
import { formatDate } from '../../utils/helpers'
import { USER_ROLES } from '../../config/constants'

const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'active', label: 'Active' },
  { value: 'suspended', label: 'Suspended' },
  { value: 'blocked', label: 'Blocked' },
]

const STATUS_COLORS = {
  active: 'green',
  suspended: 'orange',
  blocked: 'red',
}

function statusLabel(status) {
  return status || 'active'
}

function UserProfilePanel({ user, admin, onEdit, onActionComplete }) {
  const userId = user?.uid || user?.id
  const { data: orders, loading: ordersLoading } = useUserOrders(userId)
  const { data: prescriptions, loading: rxLoading } = useUserPrescriptions(userId)
  const [noteText, setNoteText] = useState('')
  const [addingNote, setAddingNote] = useState(false)
  const [actionLoading, setActionLoading] = useState('')

  const health = user?.healthRecord
  const deviceInfo = user?.deviceInfo
  const loginHistory = Array.isArray(user?.loginHistory) ? user.loginHistory : []
  const adminNotes = Array.isArray(user?.adminNotes) ? user.adminNotes : []

  const runAction = async (key, fn) => {
    setActionLoading(key)
    try {
      await fn()
      toast.success('Action completed')
      onActionComplete?.()
    } catch (err) {
      toast.error(err.message || 'Action failed')
    } finally {
      setActionLoading('')
    }
  }

  const handleAddNote = async (e) => {
    e.preventDefault()
    if (!noteText.trim()) return
    setAddingNote(true)
    try {
      await addUserNote(userId, noteText.trim(), admin)
      toast.success('Note added')
      setNoteText('')
      onActionComplete?.()
    } catch (err) {
      toast.error(err.message || 'Failed to add note')
    } finally {
      setAddingNote(false)
    }
  }

  const setAccountStatus = (accountStatus, actionLabel) =>
    runAction(accountStatus, () =>
      updateUserAccount(userId, { accountStatus }, admin, actionLabel)
    )

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Email</p>
          <p className="mt-1 text-sm text-gray-900">{user.email || '—'}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Account status</p>
          <div className="mt-1">
            <AdminBadge
              label={statusLabel(user.accountStatus)}
              color={STATUS_COLORS[statusLabel(user.accountStatus)] || 'gray'}
            />
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Role / Plan</p>
          <p className="mt-1 text-sm capitalize text-gray-900">
            {user.role || 'user'} · {user.plan || 'free'}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Member since</p>
          <p className="mt-1 text-sm text-gray-900">{formatDate(user.createdAt)}</p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
        <h4 className="text-sm font-semibold text-gray-900">Orders</h4>
        {ordersLoading ? (
          <p className="mt-2 text-sm text-gray-500">Loading orders…</p>
        ) : (
          <p className="mt-2 text-sm text-gray-700">
            <span className="text-2xl font-bold text-gray-900">{orders.length}</span> total orders
          </p>
        )}
      </div>

      <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
        <h4 className="text-sm font-semibold text-gray-900">Prescriptions</h4>
        {rxLoading ? (
          <p className="mt-2 text-sm text-gray-500">Loading prescriptions…</p>
        ) : prescriptions.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">No prescriptions uploaded</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {prescriptions.map((rx) => (
              <li key={rx.id} className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <span className="font-medium text-gray-800">{rx.name || rx.id}</span>
                <span className="capitalize text-gray-500">{rx.status || 'pending'}</span>
                {rx.url && rx.url !== '#' && (
                  <a
                    href={rx.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-primary-600 hover:underline"
                  >
                    View file
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
        <h4 className="text-sm font-semibold text-gray-900">Health record summary</h4>
        {!health ? (
          <p className="mt-2 text-sm text-gray-500">No health record on file</p>
        ) : (
          <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
            {health.bloodGroup && (
              <>
                <dt className="text-gray-500">Blood group</dt>
                <dd className="font-medium text-gray-900">{health.bloodGroup}</dd>
              </>
            )}
            {health.lastCheckup && (
              <>
                <dt className="text-gray-500">Last checkup</dt>
                <dd className="font-medium text-gray-900">{formatDate(health.lastCheckup)}</dd>
              </>
            )}
            {health.allergies?.length > 0 && (
              <>
                <dt className="text-gray-500">Allergies</dt>
                <dd className="font-medium text-gray-900">{health.allergies.join(', ')}</dd>
              </>
            )}
            {health.conditions?.length > 0 && (
              <>
                <dt className="text-gray-500">Conditions</dt>
                <dd className="font-medium text-gray-900">{health.conditions.join(', ')}</dd>
              </>
            )}
            {health.medications?.length > 0 && (
              <>
                <dt className="text-gray-500">Medications</dt>
                <dd className="font-medium text-gray-900">{health.medications.join(', ')}</dd>
              </>
            )}
          </dl>
        )}
      </div>

      <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
        <h4 className="text-sm font-semibold text-gray-900">Device info</h4>
        {!deviceInfo || (typeof deviceInfo === 'object' && !Object.keys(deviceInfo).length) ? (
          <p className="mt-2 text-sm text-gray-500">No device info recorded</p>
        ) : (
          <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
            {Object.entries(deviceInfo).map(([key, value]) => (
              <Fragment key={key}>
                <dt className="capitalize text-gray-500">{key.replace(/([A-Z])/g, ' $1')}</dt>
                <dd className="font-medium text-gray-900">{String(value ?? '—')}</dd>
              </Fragment>
            ))}
          </dl>
        )}
      </div>

      <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
        <h4 className="text-sm font-semibold text-gray-900">Login history</h4>
        {loginHistory.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">No login history</p>
        ) : (
          <ul className="mt-3 max-h-40 space-y-2 overflow-y-auto text-sm">
            {loginHistory.map((entry, i) => (
              <li key={entry.id || i} className="rounded-lg bg-white px-3 py-2 text-gray-700">
                <span className="font-medium">{formatDate(entry.timestamp || entry.at || entry.date)}</span>
                {entry.ip && <span className="text-gray-500"> · {entry.ip}</span>}
                {entry.device && <span className="text-gray-500"> · {entry.device}</span>}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
        <h4 className="text-sm font-semibold text-gray-900">Admin notes</h4>
        {adminNotes.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">No admin notes yet</p>
        ) : (
          <ul className="mt-3 max-h-48 space-y-2 overflow-y-auto">
            {adminNotes.map((note) => (
              <li key={note.id} className="rounded-lg bg-white px-3 py-2 text-sm">
                <p className="text-gray-800">{note.text}</p>
                <p className="mt-1 text-xs text-gray-500">
                  {note.adminName || 'Admin'} · {formatDate(note.createdAt)}
                </p>
              </li>
            ))}
          </ul>
        )}
        <form onSubmit={handleAddNote} className="mt-4 space-y-3">
          <Textarea
            label="Add note"
            rows={2}
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Internal note about this user…"
          />
          <Button type="submit" size="sm" loading={addingNote} disabled={!noteText.trim()}>
            <MessageSquarePlus className="h-4 w-4" />
            Add Note
          </Button>
        </form>
      </div>

      <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-4">
        <Button type="button" size="sm" variant="secondary" onClick={() => onEdit(user)}>
          Edit role / plan
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          loading={actionLoading === 'active'}
          onClick={() => setAccountStatus('active', 'User Activated')}
        >
          <CheckCircle className="h-4 w-4" />
          Activate
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          loading={actionLoading === 'suspended'}
          onClick={() => setAccountStatus('suspended', 'User Suspended')}
        >
          <ShieldOff className="h-4 w-4" />
          Suspend
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          loading={actionLoading === 'blocked'}
          onClick={() => setAccountStatus('blocked', 'User Blocked')}
        >
          <Ban className="h-4 w-4" />
          Block
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          loading={actionLoading === 'unblock'}
          onClick={() => setAccountStatus('active', 'User Unblocked')}
        >
          <ShieldCheck className="h-4 w-4" />
          Unblock
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          loading={actionLoading === 'logout'}
          onClick={() => runAction('logout', () => forceLogoutUser(userId, admin))}
        >
          <LogOut className="h-4 w-4" />
          Force Logout
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          loading={actionLoading === 'reset'}
          onClick={() => runAction('reset', () => resetUserPassword(user.email, admin))}
        >
          <KeyRound className="h-4 w-4" />
          Reset Password
        </Button>
      </div>
    </div>
  )
}

export default function AdminUsers() {
  const { user: adminUser, profile: adminProfile } = useAuth()
  const admin = adminUser
    ? {
        uid: adminUser.uid,
        email: adminUser.email,
        displayName: adminUser.displayName,
        fullName: adminProfile?.fullName,
      }
    : null

  const { data: users, loading } = useUsers()
  const { data: allOrders } = useAllOrders()

  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [planFilter, setPlanFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [profileUser, setProfileUser] = useState(null)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ fullName: '', role: 'user', plan: 'free' })
  const [saving, setSaving] = useState(false)
  const [profileKey, setProfileKey] = useState(0)

  const orderCounts = useMemo(() => {
    const counts = {}
    allOrders.forEach((o) => {
      if (o.userId) counts[o.userId] = (counts[o.userId] || 0) + 1
    })
    return counts
  }, [allOrders])

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase()
    return users.filter((u) => {
      const uid = u.uid || u.id
      const matchSearch =
        !q ||
        (u.fullName || '').toLowerCase().includes(q) ||
        (u.email || '').toLowerCase().includes(q) ||
        uid?.toLowerCase().includes(q)
      const matchRole = roleFilter === 'all' || (u.role || 'user') === roleFilter
      const matchPlan = planFilter === 'all' || (u.plan || 'free') === planFilter
      const matchStatus =
        statusFilter === 'all' || statusLabel(u.accountStatus) === statusFilter
      return matchSearch && matchRole && matchPlan && matchStatus
    })
  }, [users, search, roleFilter, planFilter, statusFilter])

  useEffect(() => {
    if (profileUser) {
      const fresh = users.find((u) => (u.uid || u.id) === (profileUser.uid || profileUser.id))
      if (fresh) setProfileUser(fresh)
    }
  }, [users, profileUser])

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
    const uid = editing.uid || editing.id
    setSaving(true)
    try {
      await updateUserAccount(
        uid,
        {
          fullName: form.fullName.trim(),
          role: form.role,
          plan: form.plan,
        },
        admin,
        'User Updated'
      )
      toast.success('User updated')
      setEditing(null)
      setProfileKey((k) => k + 1)
    } catch (err) {
      toast.error(err.message || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (u) => {
    const name = u.fullName || u.email || u.uid || u.id
    if (!confirmDelete(name)) return
    const uid = u.uid || u.id
    try {
      await deleteUserAccount(uid, admin)
      toast.success('User deleted')
      if (profileUser && (profileUser.uid || profileUser.id) === uid) setProfileUser(null)
    } catch (err) {
      toast.error(err.message || 'Delete failed')
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        subtitle={
          loading
            ? 'Loading users…'
            : `${filteredUsers.length} of ${users.length} users · search and filter below`
        }
      />

      <div className="flex flex-wrap items-end gap-4">
        <AdminSearch
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, or ID…"
          className="max-w-md flex-1"
        />
        <AdminSelect
          label="Role"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="min-w-[140px]"
        >
          <option value="all">All roles</option>
          {Object.entries(USER_ROLES).map(([value, { label }]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </AdminSelect>
        <AdminSelect
          label="Plan"
          value={planFilter}
          onChange={(e) => setPlanFilter(e.target.value)}
          className="min-w-[140px]"
        >
          <option value="all">All plans</option>
          <option value="free">Free</option>
          <option value="premium">Premium</option>
          <option value="family">Family</option>
        </AdminSelect>
        <AdminSelect
          label="Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="min-w-[160px]"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </AdminSelect>
      </div>

      <AdminTable columns={['Name', 'Email', 'Role', 'Plan', 'Status', 'Orders', 'Last activity', 'Actions']}>
        {loading && (
          <AdminTableRow>
            <AdminTableCell colSpan={8}>Loading users…</AdminTableCell>
          </AdminTableRow>
        )}
        {!loading && filteredUsers.length === 0 && (
          <AdminTableRow>
            <AdminTableCell colSpan={8}>No users match your filters.</AdminTableCell>
          </AdminTableRow>
        )}
        {filteredUsers.map((u) => {
          const uid = u.uid || u.id
          const accountStatus = statusLabel(u.accountStatus)
          return (
            <AdminTableRow key={uid}>
              <AdminTableCell highlight>{u.fullName || u.email || uid}</AdminTableCell>
              <AdminTableCell>{u.email || '—'}</AdminTableCell>
              <AdminTableCell>
                <AdminBadge
                  label={USER_ROLES[u.role || 'user']?.label || u.role || 'User'}
                  color={USER_ROLES[u.role || 'user']?.color || 'gray'}
                />
              </AdminTableCell>
              <AdminTableCell className="capitalize">{u.plan || 'free'}</AdminTableCell>
              <AdminTableCell>
                <AdminBadge label={accountStatus} color={STATUS_COLORS[accountStatus] || 'gray'} />
              </AdminTableCell>
              <AdminTableCell>{orderCounts[uid] ?? 0}</AdminTableCell>
              <AdminTableCell>{formatDate(u.lastActivity || u.createdAt)}</AdminTableCell>
              <AdminTableCell>
                <AdminRowActions onEdit={() => openEdit(u)}>
                  <Button type="button" size="sm" variant="secondary" onClick={() => setProfileUser(u)}>
                    <Eye className="h-3.5 w-3.5" />
                    Profile
                  </Button>
                  <Button type="button" size="sm" variant="danger" onClick={() => handleDelete(u)}>
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </Button>
                </AdminRowActions>
              </AdminTableCell>
            </AdminTableRow>
          )
        })}
      </AdminTable>

      <Modal
        open={!!profileUser}
        onClose={() => setProfileUser(null)}
        title={profileUser ? `Profile — ${profileUser.fullName || profileUser.email}` : 'User profile'}
        size="xl"
      >
        {profileUser && (
          <UserProfilePanel
            key={`${profileUser.uid || profileUser.id}-${profileKey}`}
            user={profileUser}
            admin={admin}
            onEdit={(u) => {
              setProfileUser(null)
              openEdit(u)
            }}
            onActionComplete={() => setProfileKey((k) => k + 1)}
          />
        )}
      </Modal>

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
            {Object.entries(USER_ROLES).map(([value, { label }]) => (
              <option key={value} value={value}>{label}</option>
            ))}
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
            <Button type="submit" loading={saving} className="flex-1">
              Save Changes
            </Button>
            <Button type="button" variant="outline" onClick={() => setEditing(null)}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

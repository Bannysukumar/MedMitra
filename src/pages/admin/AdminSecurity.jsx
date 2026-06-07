import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { LogOut, ShieldAlert } from 'lucide-react'
import { writeBatch, doc } from 'firebase/firestore'
import { useSecurityLogs, useAllSessions, useUsers } from '../../hooks/useFirestore'
import { useAuth } from '../../contexts/AuthContext'
import { logAdminAction } from '../../services/adminService'
import { db } from '../../config/firebase'
import AdminPageHeader, {
  AdminTable,
  AdminTableRow,
  AdminTableCell,
  AdminStatCard,
  AdminBadge,
} from '../../components/admin/AdminComponents'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import { formatDate } from '../../utils/helpers'

export default function AdminSecurity() {
  const { user, profile } = useAuth()
  const { data: logs, loading: logsLoading } = useSecurityLogs()
  const { data: sessions, loading: sessionsLoading } = useAllSessions()
  const { data: users } = useUsers()
  const [forcing, setForcing] = useState(false)

  const admin = user
    ? { uid: user.uid, email: user.email, displayName: profile?.fullName || user.displayName, fullName: profile?.fullName }
    : null

  const loginAttempts = useMemo(
    () => logs.filter((l) => l.event?.includes('login')),
    [logs]
  )
  const failedLogins = useMemo(
    () => logs.filter((l) => l.event?.includes('failed')),
    [logs]
  )
  const activeSessions = useMemo(
    () => sessions.filter((s) => s.active !== false),
    [sessions]
  )

  const handleForceLogoutAll = async () => {
    if (!window.confirm(`Force logout all ${users.length} users? They will need to sign in again.`)) return
    setForcing(true)
    try {
      const ts = new Date().toISOString()
      const batch = writeBatch(db)
      users.forEach((u) => {
        if (u.uid) batch.update(doc(db, 'users', u.uid), { forceLogoutAt: ts })
      })
      await batch.commit()
      await logAdminAction(admin, {
        action: 'Force Logout All Users',
        module: 'security',
        details: `${users.length} users`,
      })
      toast.success(`Force logout set for ${users.length} user(s)`)
    } catch (err) {
      toast.error(err.message || 'Force logout failed')
    } finally {
      setForcing(false)
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        subtitle="Security monitoring — login attempts, sessions, and force logout"
        action={
          <Button variant="danger" size="sm" loading={forcing} onClick={handleForceLogoutAll}>
            <LogOut className="h-4 w-4" /> Force Logout All Users
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <AdminStatCard label="Login Events" value={loginAttempts.length} icon={ShieldAlert} iconBg="bg-blue-50" iconColor="text-blue-600" />
        <AdminStatCard label="Failed Logins" value={failedLogins.length} icon={ShieldAlert} iconBg="bg-red-50" iconColor="text-red-600" alert={failedLogins.length > 0} />
        <AdminStatCard label="Active Sessions" value={activeSessions.length} change="Live" />
      </div>

      <Card className="!p-6">
        <h3 className="mb-4 font-semibold text-gray-900">Recent Security Logs</h3>
        <AdminTable columns={['Event', 'Email', 'Timestamp']}>
          {logsLoading && (
            <AdminTableRow>
              <AdminTableCell colSpan={3}>Loading logs…</AdminTableCell>
            </AdminTableRow>
          )}
          {!logsLoading && logs.length === 0 && (
            <AdminTableRow>
              <AdminTableCell colSpan={3}>No security events logged.</AdminTableCell>
            </AdminTableRow>
          )}
          {logs.slice(0, 20).map((l) => (
            <AdminTableRow key={l.id}>
              <AdminTableCell highlight className="font-mono text-xs">{l.event}</AdminTableCell>
              <AdminTableCell>{l.email || l.adminId || '—'}</AdminTableCell>
              <AdminTableCell>{formatDate(l.timestamp)}</AdminTableCell>
            </AdminTableRow>
          ))}
        </AdminTable>
      </Card>

      <Card className="!p-6">
        <h3 className="mb-4 font-semibold text-gray-900">Active Sessions</h3>
        <AdminTable columns={['User', 'Device', 'Last Active', 'Status']}>
          {sessionsLoading && (
            <AdminTableRow>
              <AdminTableCell colSpan={4}>Loading sessions…</AdminTableCell>
            </AdminTableRow>
          )}
          {!sessionsLoading && sessions.length === 0 && (
            <AdminTableRow>
              <AdminTableCell colSpan={4}>No session records.</AdminTableCell>
            </AdminTableRow>
          )}
          {sessions.slice(0, 30).map((s) => (
            <AdminTableRow key={s.id}>
              <AdminTableCell highlight>{s.userId || s.uid || '—'}</AdminTableCell>
              <AdminTableCell>{s.device || s.userAgent?.slice(0, 40) || '—'}</AdminTableCell>
              <AdminTableCell>{formatDate(s.lastActive || s.createdAt)}</AdminTableCell>
              <AdminTableCell>
                <AdminBadge label={s.active !== false ? 'Active' : 'Ended'} color={s.active !== false ? 'green' : 'gray'} />
              </AdminTableCell>
            </AdminTableRow>
          ))}
        </AdminTable>
      </Card>
    </div>
  )
}

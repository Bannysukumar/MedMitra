import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { Flag, ShieldCheck, Eye } from 'lucide-react'
import { useUsers } from '../../hooks/useFirestore'
import { useAuth } from '../../contexts/AuthContext'
import { flagHealthRecord, verifyHealthRecord } from '../../services/adminService'
import AdminPageHeader, {
  AdminSearch,
  AdminTable,
  AdminTableRow,
  AdminTableCell,
  AdminBadge,
} from '../../components/admin/AdminComponents'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Card from '../../components/ui/Card'
import { formatDate } from '../../utils/helpers'

const RECORD_FIELDS = (hr) => [
  { label: 'Blood Group', value: hr.bloodGroup },
  { label: 'Height', value: hr.height ? `${hr.height} cm` : '—' },
  { label: 'Weight', value: hr.weight ? `${hr.weight} kg` : '—' },
  { label: 'Allergies', value: hr.allergies?.join(', ') || 'None' },
  { label: 'Chronic Conditions', value: hr.chronicDiseases?.join(', ') || 'None' },
  { label: 'Last Checkup', value: hr.lastCheckup ? formatDate(hr.lastCheckup) : '—' },
]

export default function AdminHealthRecords() {
  const { user, profile } = useAuth()
  const { data: users, loading } = useUsers()
  const [search, setSearch] = useState('')
  const [viewing, setViewing] = useState(null)
  const [acting, setActing] = useState(false)

  const admin = user
    ? { uid: user.uid, email: user.email, displayName: profile?.fullName || user.displayName, fullName: profile?.fullName }
    : null

  const withRecords = useMemo(
    () => users.filter((u) => u.healthRecord && Object.keys(u.healthRecord).length > 0),
    [users]
  )

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return withRecords
    return withRecords.filter(
      (u) =>
        (u.fullName || '').toLowerCase().includes(q) ||
        (u.email || '').toLowerCase().includes(q) ||
        u.uid?.toLowerCase().includes(q)
    )
  }, [withRecords, search])

  const handleFlag = async (u, flagged) => {
    setActing(true)
    try {
      await flagHealthRecord(u.uid, flagged, admin)
      toast.success(flagged ? 'Health record flagged' : 'Flag removed')
    } catch (err) {
      toast.error(err.message || 'Action failed')
    } finally {
      setActing(false)
    }
  }

  const handleVerify = async (u, verified) => {
    setActing(true)
    try {
      await verifyHealthRecord(u.uid, verified, admin)
      toast.success(verified ? 'Health record verified' : 'Verification removed')
    } catch (err) {
      toast.error(err.message || 'Action failed')
    } finally {
      setActing(false)
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader subtitle="View-only health records — flag or verify; data fields cannot be edited" />

      <AdminSearch
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name or email…"
      />

      <AdminTable columns={['User', 'Email', 'Status', 'Actions']}>
        {loading && (
          <AdminTableRow>
            <AdminTableCell colSpan={4}>Loading health records…</AdminTableCell>
          </AdminTableRow>
        )}
        {!loading && filtered.length === 0 && (
          <AdminTableRow>
            <AdminTableCell colSpan={4}>No health records on file.</AdminTableCell>
          </AdminTableRow>
        )}
        {filtered.map((u) => (
          <AdminTableRow key={u.uid}>
            <AdminTableCell highlight>{u.fullName || '—'}</AdminTableCell>
            <AdminTableCell>{u.email}</AdminTableCell>
            <AdminTableCell>
              <div className="flex flex-wrap gap-1">
                {u.healthRecordVerified && <AdminBadge label="Verified" color="green" />}
                {u.healthRecordFlagged && <AdminBadge label="Flagged" color="red" />}
                {!u.healthRecordVerified && !u.healthRecordFlagged && (
                  <AdminBadge label="Unreviewed" color="gray" />
                )}
              </div>
            </AdminTableCell>
            <AdminTableCell>
              <div className="flex flex-wrap justify-end gap-2">
                <Button type="button" size="sm" variant="secondary" onClick={() => setViewing(u)}>
                  <Eye className="h-3.5 w-3.5" /> View
                </Button>
                {u.healthRecordFlagged ? (
                  <Button type="button" size="sm" variant="outline" loading={acting} onClick={() => handleFlag(u, false)}>
                    Unflag
                  </Button>
                ) : (
                  <Button type="button" size="sm" variant="danger" loading={acting} onClick={() => handleFlag(u, true)}>
                    <Flag className="h-3.5 w-3.5" /> Flag
                  </Button>
                )}
                <Button
                  type="button"
                  size="sm"
                  loading={acting}
                  onClick={() => handleVerify(u, !u.healthRecordVerified)}
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {u.healthRecordVerified ? 'Unverify' : 'Verify'}
                </Button>
              </div>
            </AdminTableCell>
          </AdminTableRow>
        ))}
      </AdminTable>

      <Modal open={!!viewing} onClose={() => setViewing(null)} title="Health Record (View Only)" size="lg">
        {viewing && (
          <Card className="!p-0">
            <p className="mb-4 text-sm text-gray-600">
              {viewing.fullName || viewing.email} — read-only. Admins cannot modify health data.
            </p>
            <ul className="divide-y divide-gray-100">
              {RECORD_FIELDS(viewing.healthRecord).map((f) => (
                <li key={f.label} className="flex justify-between px-4 py-3 text-sm">
                  <span className="font-medium text-gray-500">{f.label}</span>
                  <span className="font-semibold text-gray-900">{f.value}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </Modal>
    </div>
  )
}

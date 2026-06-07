import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import {
  FileText,
  Eye,
  Download,
  CheckCircle,
  XCircle,
  RefreshCw,
  Upload,
  Percent,
} from 'lucide-react'
import { useAllPrescriptions } from '../../hooks/useFirestore'
import { updatePrescriptionStatus, deletePrescription } from '../../services/firestoreService'
import { requestPrescriptionReupload } from '../../services/adminService'
import { computePrescriptionAnalytics } from '../../utils/adminAnalytics'
import { useAuth } from '../../contexts/AuthContext'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import StatusPill from '../../components/ui/StatusPill'
import AdminPageHeader, {
  AdminSearch,
  AdminStatCard,
  AdminSelect,
  confirmDelete,
} from '../../components/admin/AdminComponents'
import { PRESCRIPTION_STATUSES } from '../../config/constants'
import { formatDate } from '../../utils/helpers'

export default function AdminPrescriptions() {
  const { data: prescriptions, loading } = useAllPrescriptions()
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [viewRx, setViewRx] = useState(null)
  const [busyId, setBusyId] = useState(null)

  const admin = user
    ? { uid: user.uid, email: user.email, displayName: user.displayName }
    : null

  const analytics = useMemo(
    () => computePrescriptionAnalytics(prescriptions),
    [prescriptions]
  )

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return prescriptions
    return prescriptions.filter(
      (rx) =>
        rx.name?.toLowerCase().includes(q) ||
        rx.status?.toLowerCase().includes(q) ||
        rx.userId?.toLowerCase().includes(q) ||
        rx.id?.toLowerCase().includes(q)
    )
  }, [prescriptions, search])

  const setStatus = async (id, status) => {
    setBusyId(id)
    try {
      await updatePrescriptionStatus(id, status)
      toast.success(`Prescription marked ${PRESCRIPTION_STATUSES[status]?.label || status}`)
    } catch (err) {
      toast.error(err.message || 'Update failed')
    } finally {
      setBusyId(null)
    }
  }

  const handleReupload = async (rx) => {
    if (!admin) {
      toast.error('Admin session required')
      return
    }
    setBusyId(rx.id)
    try {
      await requestPrescriptionReupload(rx.id, admin)
      toast.success('Reupload requested — patient notified')
    } catch (err) {
      toast.error(err.message || 'Request failed')
    } finally {
      setBusyId(null)
    }
  }

  const handleDelete = async (rx) => {
    if (!confirmDelete(rx.name || rx.id)) return
    setBusyId(rx.id)
    try {
      await deletePrescription(rx.id)
      toast.success('Prescription deleted')
      if (viewRx?.id === rx.id) setViewRx(null)
    } catch (err) {
      toast.error(err.message || 'Delete failed')
    } finally {
      setBusyId(null)
    }
  }

  const imageUrl = viewRx?.url && viewRx.url !== '#' ? viewRx.url : null

  return (
    <div className="space-y-6">
      <AdminPageHeader
        subtitle={
          loading
            ? 'Loading prescriptions…'
            : `${prescriptions.length} prescriptions — live updates via Firebase`
        }
        action={
          <AdminSearch
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, status, user…"
          />
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <AdminStatCard
          label="Daily Uploads"
          value={analytics.dailyUploads}
          change="Today"
          icon={Upload}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
        <AdminStatCard
          label="Approval Rate"
          value={`${analytics.approvalRate}%`}
          change="Of all prescriptions"
          icon={CheckCircle}
          iconBg="bg-green-50"
          iconColor="text-green-600"
        />
        <AdminStatCard
          label="Rejection Rate"
          value={`${analytics.rejectionRate}%`}
          change="Of all prescriptions"
          icon={Percent}
          iconBg="bg-red-50"
          iconColor="text-red-600"
        />
      </div>

      <div className="space-y-4">
        {loading && (
          <Card className="py-12 text-center text-sm text-gray-500">Loading prescriptions…</Card>
        )}
        {!loading && filtered.length === 0 && (
          <Card className="py-12 text-center text-gray-500">
            {search ? 'No prescriptions match your search.' : 'No prescriptions uploaded yet.'}
          </Card>
        )}
        {filtered.map((rx) => (
          <Card key={rx.id} className="!p-5 transition hover:shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50">
                  <FileText className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{rx.name || 'Prescription'}</p>
                  <p className="text-sm text-gray-500">Uploaded {formatDate(rx.uploadedAt)}</p>
                  {rx.userId && (
                    <p className="text-xs text-gray-400">User: {rx.userId.slice(0, 8)}…</p>
                  )}
                  {rx.reuploadRequested && (
                    <p className="mt-1 text-xs font-medium text-orange-600">Reupload requested</p>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <StatusPill status={rx.status} type="prescription" />
                {rx.url && rx.url !== '#' && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setViewRx(rx)}
                    disabled={busyId === rx.id}
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View
                  </Button>
                )}
                <AdminSelect
                  value={rx.status || 'pending'}
                  onChange={(e) => setStatus(rx.id, e.target.value)}
                  className="!w-auto min-w-[140px] py-1.5"
                  disabled={busyId === rx.id}
                >
                  {Object.keys(PRESCRIPTION_STATUSES).map((s) => (
                    <option key={s} value={s}>
                      {PRESCRIPTION_STATUSES[s].label}
                    </option>
                  ))}
                </AdminSelect>
                <Button
                  size="sm"
                  onClick={() => setStatus(rx.id, 'approved')}
                  disabled={busyId === rx.id || rx.status === 'approved'}
                >
                  <CheckCircle className="h-3.5 w-3.5" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => setStatus(rx.id, 'rejected')}
                  disabled={busyId === rx.id || rx.status === 'rejected'}
                >
                  <XCircle className="h-3.5 w-3.5" />
                  Reject
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleReupload(rx)}
                  disabled={busyId === rx.id}
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Request Reupload
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(rx)}
                  disabled={busyId === rx.id}
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        open={!!viewRx}
        onClose={() => setViewRx(null)}
        title={viewRx?.name || 'Prescription'}
        size="xl"
      >
        {viewRx && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <StatusPill status={viewRx.status} type="prescription" />
              <span className="text-sm text-gray-500">
                Uploaded {formatDate(viewRx.uploadedAt)}
              </span>
            </div>
            {imageUrl ? (
              <div className="flex justify-center overflow-auto rounded-xl border border-gray-100 bg-gray-50 p-4">
                <img
                  src={imageUrl}
                  alt={viewRx.name || 'Prescription'}
                  className="max-h-[70vh] w-auto max-w-full object-contain"
                />
              </div>
            ) : (
              <p className="text-sm text-gray-500">No preview available for this prescription.</p>
            )}
            {imageUrl && (
              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href={imageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-600 hover:bg-primary-100"
                >
                  <Eye className="h-4 w-4" />
                  Open in new tab
                </a>
                <a
                  href={imageUrl}
                  download={viewRx.name || 'prescription'}
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  <Download className="h-4 w-4" />
                  Download
                </a>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

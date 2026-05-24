import toast from 'react-hot-toast'
import { useAllPrescriptions } from '../../hooks/useFirestore'
import { updatePrescriptionStatus, deletePrescription } from '../../services/firestoreService'
import Card from '../../components/ui/Card'
import AdminPageHeader, { AdminSelect, confirmDelete } from '../../components/admin/AdminComponents'
import StatusPill from '../../components/ui/StatusPill'
import Button from '../../components/ui/Button'
import { PRESCRIPTION_STATUSES } from '../../config/constants'
import { formatDate } from '../../utils/helpers'
import { FileText, ExternalLink } from 'lucide-react'

export default function AdminPrescriptions() {
  const { data: prescriptions, loading } = useAllPrescriptions()

  const setStatus = async (id, status) => {
    try {
      await updatePrescriptionStatus(id, status)
      toast.success(`Prescription ${PRESCRIPTION_STATUSES[status]?.label || status}`)
    } catch (err) {
      toast.error(err.message || 'Update failed')
    }
  }

  const handleDelete = async (rx) => {
    if (!confirmDelete(rx.name)) return
    try {
      await deletePrescription(rx.id)
      toast.success('Prescription deleted')
    } catch (err) {
      toast.error(err.message || 'Delete failed')
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader subtitle="Review and approve patient prescriptions" />

      <div className="space-y-4">
        {loading && <p className="text-sm text-gray-500">Loading prescriptions...</p>}
        {!loading && prescriptions.length === 0 && (
          <Card className="py-12 text-center text-gray-500">No prescriptions uploaded yet.</Card>
        )}
        {prescriptions.map((rx) => (
          <Card key={rx.id} className="!p-5 transition hover:shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50">
                  <FileText className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{rx.name}</p>
                  <p className="text-sm text-gray-500">Uploaded {formatDate(rx.uploadedAt)}</p>
                  {rx.userId && (
                    <p className="text-xs text-gray-400">User: {rx.userId.slice(0, 8)}…</p>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <StatusPill status={rx.status} type="prescription" />
                {rx.url && rx.url !== '#' && (
                  <a
                    href={rx.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View
                  </a>
                )}
                <AdminSelect
                  value={rx.status}
                  onChange={(e) => setStatus(rx.id, e.target.value)}
                  className="!w-auto min-w-[140px]"
                >
                  {Object.keys(PRESCRIPTION_STATUSES).map((s) => (
                    <option key={s} value={s}>{PRESCRIPTION_STATUSES[s].label}</option>
                  ))}
                </AdminSelect>
                <Button size="sm" onClick={() => setStatus(rx.id, 'approved')}>Approve</Button>
                <Button size="sm" variant="danger" onClick={() => setStatus(rx.id, 'rejected')}>
                  Reject
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(rx)}>
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

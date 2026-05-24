import { demoPrescriptions } from '../../data/mockData'
import Card from '../../components/ui/Card'
import AdminPageHeader from '../../components/admin/AdminComponents'
import StatusPill from '../../components/ui/StatusPill'
import Button from '../../components/ui/Button'
import { formatDate } from '../../utils/helpers'
import { FileText } from 'lucide-react'

export default function AdminPrescriptions() {
  return (
    <div className="space-y-6">
      <AdminPageHeader subtitle="Review and approve patient prescriptions" />

      <div className="space-y-4">
        {demoPrescriptions.map((rx) => (
          <Card key={rx.id} className="!p-5 transition hover:shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50">
                  <FileText className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{rx.name}</p>
                  <p className="text-sm text-gray-500">Uploaded {formatDate(rx.uploadedAt)}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <StatusPill status={rx.status} type="prescription" />
                {rx.status === 'under_review' && (
                  <>
                    <Button size="sm">Approve</Button>
                    <Button size="sm" variant="danger">
                      Reject
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

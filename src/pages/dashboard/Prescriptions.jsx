import { useState } from 'react'
import { Upload, FileText, Eye } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useUserPrescriptions } from '../../hooks/useFirestore'
import { uploadPrescription } from '../../services/firestoreService'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import { formatDate } from '../../utils/helpers'
import toast from 'react-hot-toast'

export default function Prescriptions() {
  const { user } = useAuth()
  const { data: list, loading } = useUserPrescriptions(user?.uid)
  const [showUpload, setShowUpload] = useState(false)
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !user) return
    setUploading(true)
    try {
      await uploadPrescription(user.uid, file)
      setShowUpload(false)
      toast.success('Prescription uploaded')
    } catch {
      toast.error('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <Button onClick={() => setShowUpload(true)}>
          <Upload className="h-4 w-4" />
          Upload New
        </Button>
      </div>

      <Card className="overflow-hidden !p-0">
        {loading && <p className="px-5 py-8 text-center text-sm text-gray-500">Loading prescriptions...</p>}
        <div className="divide-y divide-gray-100">
          {list.map((rx) => (
            <div key={rx.id} className="flex items-center gap-4 px-5 py-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">
                <FileText className="h-6 w-6 text-red-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-gray-900">{rx.name}</p>
                <p className="text-xs text-gray-500">Uploaded {formatDate(rx.uploadedAt)}</p>
              </div>
              {rx.url ? (
                <a
                  href={rx.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-primary-600 px-3 py-1.5 text-sm font-semibold text-primary-600 hover:bg-primary-50"
                >
                  <Eye className="h-4 w-4" />
                  View
                </a>
              ) : null}
            </div>
          ))}
        </div>
        {!loading && list.length === 0 && (
          <p className="px-5 py-8 text-center text-sm text-gray-500">No prescriptions yet. Upload your first prescription.</p>
        )}
      </Card>

      <Modal open={showUpload} onClose={() => setShowUpload(false)} title="Upload Prescription">
        <p className="mb-4 text-sm text-gray-600">Accepted formats: PDF, JPG, PNG (max 10MB)</p>
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 p-12 hover:border-primary-500">
          <Upload className="h-10 w-10 text-gray-400" />
          <span className="mt-2 text-sm font-medium text-gray-700">Click to upload</span>
          <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleUpload} />
        </label>
      </Modal>
    </div>
  )
}

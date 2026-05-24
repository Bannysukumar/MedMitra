import { useState } from 'react'
import { Upload, FileText, Eye } from 'lucide-react'
import { demoPrescriptions } from '../../data/mockData'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import { formatDate } from '../../utils/helpers'
import toast from 'react-hot-toast'

export default function Prescriptions() {
  const [showUpload, setShowUpload] = useState(false)
  const [list, setList] = useState(demoPrescriptions)

  const handleUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setList([
      {
        id: `rx-${Date.now()}`,
        name: file.name,
        uploadedAt: new Date().toISOString().split('T')[0],
        status: 'uploaded',
        url: '#',
      },
      ...list,
    ])
    setShowUpload(false)
    toast.success('Prescription uploaded')
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
              <Button size="sm" variant="outline">
                <Eye className="h-4 w-4" />
                View
              </Button>
            </div>
          ))}
        </div>
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

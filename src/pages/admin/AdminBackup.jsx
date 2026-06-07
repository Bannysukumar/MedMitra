import { useState } from 'react'
import toast from 'react-hot-toast'
import { Database, Download } from 'lucide-react'
import { useAdminData, usePlatformSettings } from '../../hooks/useFirestore'
import { exportBackupPayload } from '../../utils/adminAnalytics'
import { downloadJson } from '../../services/adminService'
import AdminPageHeader from '../../components/admin/AdminComponents'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'

const BACKUP_INCLUDES = [
  'All user profiles',
  'Medicine catalog',
  'Orders and payment records',
  'Prescriptions',
  'Health records (sanitized)',
  'Platform settings',
]

export default function AdminBackup() {
  const { users, medicines, orders, prescriptions, loading } = useAdminData()
  const { data: settings } = usePlatformSettings()
  const [exporting, setExporting] = useState(false)

  const handleBackup = async () => {
    setExporting(true)
    try {
      const payload = exportBackupPayload({ users, medicines, orders, prescriptions, settings })
      const filename = `medmitra-backup-${new Date().toISOString().slice(0, 10)}.json`
      downloadJson(filename, payload)
      toast.success('Backup downloaded')
    } catch (err) {
      toast.error(err.message || 'Backup failed')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader subtitle="Export a full JSON snapshot of platform data for disaster recovery" />

      <Card className="!p-6 max-w-lg">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50">
          <Database className="h-6 w-6 text-primary-600" />
        </div>
        <h3 className="font-semibold text-gray-900">Create Backup</h3>
        <p className="mt-2 text-sm text-gray-600">
          {loading
            ? 'Loading live data from Firebase…'
            : `Ready to export ${users.length} users, ${medicines.length} medicines, ${orders.length} orders.`}
        </p>
        <Button className="mt-6 w-full" loading={exporting || loading} onClick={handleBackup}>
          <Download className="h-4 w-4" /> Create Backup
        </Button>
      </Card>

      <Card className="!p-6">
        <h3 className="mb-4 font-semibold text-gray-900">Backup includes</h3>
        <ul className="space-y-2">
          {BACKUP_INCLUDES.map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
              {item}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}

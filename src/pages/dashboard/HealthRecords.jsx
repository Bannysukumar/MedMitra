import { ChevronRight, Droplet, Ruler, Weight, AlertCircle, Heart, Calendar, Plus } from 'lucide-react'
import { demoHealthRecord } from '../../data/mockData'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { formatDate } from '../../utils/helpers'

const RECORDS = (data) => [
  { label: 'Blood Group', value: data.bloodGroup, icon: Droplet, color: 'text-red-500 bg-red-50' },
  { label: 'Height', value: `${data.height} cm`, icon: Ruler, color: 'text-blue-500 bg-blue-50' },
  { label: 'Weight', value: `${data.weight} kg`, icon: Weight, color: 'text-green-500 bg-green-50' },
  { label: 'Allergies', value: data.allergies.join(', '), icon: AlertCircle, color: 'text-orange-500 bg-orange-50' },
  { label: 'Chronic Conditions', value: data.chronicDiseases.join(', '), icon: Heart, color: 'text-purple-500 bg-purple-50' },
  { label: 'Last Checkup', value: formatDate(data.lastCheckup), icon: Calendar, color: 'text-primary-600 bg-primary-50' },
]

export default function HealthRecords() {
  const records = RECORDS(demoHealthRecord)

  return (
    <div className="space-y-5">
      <Card className="overflow-hidden !p-0">
        <div className="divide-y divide-gray-100">
          {records.map((record) => (
            <div
              key={record.label}
              className="flex items-center gap-4 px-5 py-4 transition hover:bg-gray-50/80"
            >
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${record.color}`}>
                <record.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{record.label}</p>
                <p className="mt-0.5 text-sm font-semibold text-gray-900">{record.value}</p>
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-gray-300" />
            </div>
          ))}
        </div>
      </Card>

      <Button variant="primary" className="w-full sm:w-auto">
        <Plus className="h-4 w-4" />
        Add New Record
      </Button>
    </div>
  )
}

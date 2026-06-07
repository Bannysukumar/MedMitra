import Card from '../../components/ui/Card'

export default function DoctorPlaceholder({ title, description }) {
  return (
    <Card className="!p-10 text-center">
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      <p className="mt-2 text-gray-500">{description}</p>
    </Card>
  )
}

import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../../config/firebase'
import DoctorProfileView from '../../components/doctor/DoctorProfileView'
import Card from '../../components/ui/Card'
import { useRouteContext } from '../../utils/routeContext'

export default function DoctorDetail() {
  const { isDashboard, doctorsPath } = useRouteContext()
  const { doctorId } = useParams()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!doctorId) return undefined
    const unsub = onSnapshot(
      doc(db, 'doctors', doctorId),
      (snap) => {
        setProfile(snap.exists() ? { id: snap.id, ...snap.data() } : null)
        setLoading(false)
      },
      () => setLoading(false)
    )
    return () => unsub?.()
  }, [doctorId])

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12">
        <Card className="!p-12 text-center text-gray-500">Loading doctor profile…</Card>
      </div>
    )
  }

  if (!profile || profile.isPublic === false) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 text-center">
        <p className="text-gray-600">Doctor profile not found.</p>
        <Link to={doctorsPath} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Back to doctors
        </Link>
      </div>
    )
  }

  return (
    <div className={isDashboard ? '' : 'mx-auto max-w-6xl px-4 py-8 sm:px-6'}>
      <Link
        to={doctorsPath}
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        All Doctors
      </Link>
      <DoctorProfileView
        profile={profile}
        showBreadcrumb={false}
        showEditButton={false}
        breadcrumbBase={doctorsPath}
      />
    </div>
  )
}

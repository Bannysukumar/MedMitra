import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '../../contexts/AuthContext'
import { useDoctorProfile } from '../../hooks/useDoctorData'
import { seedDoctorProfile } from '../../services/doctorService'
import DoctorProfileView from '../../components/doctor/DoctorProfileView'
import Card from '../../components/ui/Card'

export default function DoctorInformation() {
  const { user, displayName } = useAuth()
  const { data: profile, loading } = useDoctorProfile(user?.uid)
  const [seeding, setSeeding] = useState(false)

  useEffect(() => {
    if (!user?.uid || loading || profile?.personal?.fullName) return
    seedDoctorProfile(user.uid, { fullName: displayName }).catch(() => {})
  }, [user?.uid, loading, profile?.personal?.fullName, displayName])

  const handleEdit = () => {
    toast('Profile editing coming soon', { icon: '✏️' })
  }

  const handleSeed = async () => {
    setSeeding(true)
    try {
      const result = await seedDoctorProfile(user.uid, { fullName: displayName })
      toast.success(result.message)
    } catch (err) {
      toast.error(err.message || 'Failed to load profile')
    } finally {
      setSeeding(false)
    }
  }

  if (loading) {
    return <Card className="!p-8 text-center text-gray-500">Loading doctor profile…</Card>
  }

  if (!profile?.personal?.fullName) {
    return (
      <Card className="flex flex-wrap items-center justify-between gap-4 !p-6">
        <p className="text-gray-600">Your doctor profile is not set up yet.</p>
        <button
          type="button"
          onClick={handleSeed}
          disabled={seeding}
          className="rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
        >
          {seeding ? 'Loading…' : 'Load Profile'}
        </button>
      </Card>
    )
  }

  return (
    <DoctorProfileView
      profile={profile}
      showBreadcrumb
      showEditButton
      onEdit={handleEdit}
      breadcrumbBase="/doctor"
    />
  )
}

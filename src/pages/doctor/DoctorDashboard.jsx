import { useEffect, useState } from 'react'
import {
  Users,
  Calendar,
  FileText,
  Star,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Video,
  FilePlus2,
  UserPlus,
  Upload,
  MessageCircle,
  FolderOpen,
} from 'lucide-react'
import { LineChart, Line, ResponsiveContainer } from 'recharts'
import toast from 'react-hot-toast'
import { useAuth } from '../../contexts/AuthContext'
import {
  useDoctorProfile,
  useDoctorAppointments,
  useDoctorPatients,
  useDoctorStats,
} from '../../hooks/useDoctorData'
import { seedDoctorDashboard } from '../../services/doctorService'
import { APPOINTMENT_STATUSES, DOCTOR_QUICK_ACTIONS } from '../../config/doctorConstants'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { cn } from '../../utils/helpers'

const QUICK_ICONS = {
  FilePlus2,
  UserPlus,
  Upload,
  Video,
  MessageCircle,
  FolderOpen,
}

function PatientAvatar({ name, src }) {
  if (src) return <img src={src} alt={name} className="h-10 w-10 rounded-full object-cover" />
  const colors = ['bg-rose-200', 'bg-amber-200', 'bg-sky-200', 'bg-emerald-200', 'bg-violet-200']
  const idx = (name?.charCodeAt(0) || 0) % colors.length
  return (
    <div className={cn('flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-gray-700', colors[idx])}>
      {name?.charAt(0)}
    </div>
  )
}

function MiniSparkline({ data, color = '#0066ff' }) {
  const chartData = (data || [0, 0, 0, 0, 0, 0, 0]).map((v, i) => ({ i, v }))
  return (
    <div className="h-10 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line type="monotone" dataKey="v" stroke={color} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

function CalendarWidget() {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const monthName = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = now.getDate()

  const cells = []
  for (let i = 0; i < firstDay; i += 1) cells.push(null)
  for (let d = 1; d <= daysInMonth; d += 1) cells.push(d)

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <button type="button" className="rounded-lg p-1 text-gray-400 hover:bg-gray-100">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-sm font-semibold text-gray-900">{monthName}</span>
        <button type="button" className="rounded-lg p-1 text-gray-400 hover:bg-gray-100">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-gray-400">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((day, i) => (
          <span
            key={i}
            className={cn(
              'flex h-8 items-center justify-center rounded-lg text-xs',
              day === today
                ? 'bg-primary-600 font-bold text-white'
                : day
                  ? 'text-gray-700 hover:bg-gray-100'
                  : ''
            )}
          >
            {day || ''}
          </span>
        ))}
      </div>
    </div>
  )
}

function StarRating({ rating = 4.8 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            'h-4 w-4',
            i <= Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'fill-amber-200 text-amber-200'
          )}
        />
      ))}
    </div>
  )
}

export default function DoctorDashboard() {
  const { user, displayName } = useAuth()
  const { data: profile } = useDoctorProfile(user?.uid)
  const { data: appointments, loading: apptLoading } = useDoctorAppointments(user?.uid)
  const { data: patients, loading: patientsLoading } = useDoctorPatients(user?.uid)
  const { data: stats, loading: statsLoading } = useDoctorStats(user?.uid)
  const [seeding, setSeeding] = useState(false)

  useEffect(() => {
    if (!user?.uid || apptLoading || appointments.length > 0) return
    seedDoctorDashboard(user.uid, { fullName: displayName }).catch(() => {})
  }, [user?.uid, apptLoading, appointments.length, displayName])

  const handleSeed = async () => {
    setSeeding(true)
    try {
      const result = await seedDoctorDashboard(user.uid, { fullName: displayName })
      toast.success(result.message)
    } catch (err) {
      toast.error(err.message || 'Setup failed')
    } finally {
      setSeeding(false)
    }
  }

  const nextAppt = appointments.find((a) => a.status === 'confirmed' || a.status === 'upcoming') || appointments[0]

  const statCards = [
    {
      label: 'Total Patients',
      value: stats?.totalPatients?.toLocaleString() ?? '—',
      sub: stats?.patientsGrowth ? (
        <span className="flex items-center gap-1 text-xs font-semibold text-green-600">
          <TrendingUp className="h-3 w-3" />
          {stats.patientsGrowth}% from last month
        </span>
      ) : null,
      icon: Users,
      iconBg: 'bg-blue-50',
      iconColor: 'text-primary-600',
    },
    {
      label: "Today's Appointments",
      value: stats?.todayAppointments ?? appointments.length ?? '—',
      sub: <span className="text-xs font-medium text-primary-600">{stats?.upcomingToday ?? 0} upcoming</span>,
      icon: Calendar,
      iconBg: 'bg-blue-50',
      iconColor: 'text-primary-600',
    },
    {
      label: 'Pending Prescriptions',
      value: stats?.pendingPrescriptions ?? '—',
      sub: <span className="text-xs font-medium text-orange-600">To be reviewed</span>,
      icon: FileText,
      iconBg: 'bg-orange-50',
      iconColor: 'text-orange-500',
    },
    {
      label: 'Patient Reviews',
      value: profile?.rating ?? stats?.rating ?? '4.8',
      sub: (
        <div className="mt-1 space-y-1">
          <StarRating rating={profile?.rating ?? 4.8} />
          <p className="text-xs text-gray-500">
            Based on {profile?.reviewCount ?? 320} reviews
          </p>
        </div>
      ),
      icon: Star,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-500',
    },
  ]

  const loading = apptLoading || patientsLoading || statsLoading

  return (
    <div className="space-y-6">
      {loading && appointments.length === 0 && (
        <Card className="!p-4 text-center text-sm text-gray-500">Loading doctor dashboard…</Card>
      )}

      {!loading && appointments.length === 0 && (
        <Card className="flex flex-wrap items-center justify-between gap-3 !p-4">
          <p className="text-sm text-gray-600">Set up your doctor dashboard to get started.</p>
          <Button size="sm" loading={seeding} onClick={handleSeed}>
            Initialize Dashboard
          </Button>
        </Card>
      )}

      {/* Top metrics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((s) => (
          <Card key={s.label} className="!p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{s.label}</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">{s.value}</p>
                <div className="mt-1">{s.sub}</div>
              </div>
              <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl', s.iconBg)}>
                <s.icon className={cn('h-5 w-5', s.iconColor)} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Middle row */}
      <div className="grid gap-4 lg:grid-cols-12">
        {/* Today's Appointments */}
        <Card className="lg:col-span-5 !p-0 shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <h3 className="font-semibold text-gray-900">Today&apos;s Appointments</h3>
            <button type="button" className="text-sm font-semibold text-primary-600 hover:underline">
              View all
            </button>
          </div>
          <ul className="divide-y divide-gray-50">
            {appointments.map((appt) => {
              const status = APPOINTMENT_STATUSES[appt.status] || APPOINTMENT_STATUSES.upcoming
              return (
                <li key={appt.id} className="flex items-center gap-4 px-5 py-4">
                  <span className="w-20 shrink-0 text-sm font-semibold text-gray-900">{appt.time}</span>
                  <PatientAvatar name={appt.patientName} src={appt.avatar} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-gray-900">{appt.patientName}</p>
                    <p className="text-xs text-gray-500">
                      {appt.age} Y, {appt.gender}
                    </p>
                  </div>
                  <span className={cn('shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold', status.color)}>
                    {status.label}
                  </span>
                </li>
              )
            })}
            {!appointments.length && (
              <li className="px-5 py-8 text-center text-sm text-gray-500">No appointments today</li>
            )}
          </ul>
          <div className="border-t border-gray-100 p-4">
            <Button className="w-full">
              <Calendar className="h-4 w-4" />
              View Full Schedule
            </Button>
          </div>
        </Card>

        {/* Recent Patients */}
        <Card className="lg:col-span-4 !p-0 shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <h3 className="font-semibold text-gray-900">Recent Patients</h3>
            <button type="button" className="text-sm font-semibold text-primary-600 hover:underline">
              View all
            </button>
          </div>
          <ul className="divide-y divide-gray-50">
            {patients.map((p) => (
              <li key={p.id} className="flex items-center gap-4 px-5 py-4">
                <PatientAvatar name={p.name} src={p.avatar} />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-900">{p.name}</p>
                  <p className="text-sm text-gray-500">{p.reason}</p>
                </div>
                <span className="shrink-0 text-xs text-gray-400">{p.lastVisit}</span>
              </li>
            ))}
            {!patients.length && (
              <li className="px-5 py-8 text-center text-sm text-gray-500">No recent patients</li>
            )}
          </ul>
        </Card>

        {/* Calendar + Next Appointment */}
        <div className="space-y-4 lg:col-span-3">
          <Card className="!p-5 shadow-sm">
            <CalendarWidget />
          </Card>
          {nextAppt && (
            <Card className="!p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Next Appointment</p>
              <p className="mt-2 text-sm font-bold text-gray-900">
                {nextAppt.time}
                {nextAppt.endTime ? ` – ${nextAppt.endTime}` : ''}
              </p>
              <p className="mt-1 font-semibold text-gray-800">{nextAppt.patientName}</p>
              <Button className="mt-4 w-full">
                <Video className="h-4 w-4" />
                Start Consultation
              </Button>
            </Card>
          )}
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid gap-4 lg:grid-cols-12">
        {/* Quick Actions */}
        <Card className="lg:col-span-7 !p-5 shadow-sm">
          <h3 className="mb-4 font-semibold text-gray-900">Quick Actions</h3>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {DOCTOR_QUICK_ACTIONS.map((action) => {
              const Icon = QUICK_ICONS[action.icon] || FilePlus2
              return (
                <button
                  key={action.label}
                  type="button"
                  className="flex flex-col items-center gap-2 rounded-2xl border border-gray-100 bg-white p-4 transition hover:border-primary-200 hover:shadow-md"
                >
                  <div className={cn('flex h-12 w-12 items-center justify-center rounded-2xl', action.color)}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-center text-[11px] font-semibold leading-tight text-gray-700">
                    {action.label}
                  </span>
                </button>
              )
            })}
          </div>
        </Card>

        {/* Summary */}
        <Card className="lg:col-span-5 !p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Summary</h3>
            <select className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-600">
              <option>This Week</option>
              <option>This Month</option>
            </select>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: 'Appointments', value: stats?.weeklyAppointments ?? 96, trend: stats?.appointmentTrend, color: '#0066ff' },
              { label: 'New Patients', value: stats?.weeklyNewPatients ?? 32, trend: stats?.patientsTrend, color: '#0066ff' },
              { label: 'Prescriptions', value: stats?.weeklyPrescriptions ?? 58, trend: stats?.prescriptionsTrend, color: '#a855f7' },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-gray-100 bg-gray-50/50 p-3">
                <p className="text-xs font-medium text-gray-500">{item.label}</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{item.value}</p>
                <MiniSparkline data={item.trend} color={item.color} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

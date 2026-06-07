import { Search, Bell, MessageSquare, ChevronDown, Menu } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useDoctorProfile } from '../../hooks/useDoctorData'
import { cn } from '../../utils/helpers'

function DoctorAvatar({ name, src, size = 'md' }) {
  const sizes = { md: 'h-10 w-10 text-sm', sm: 'h-9 w-9 text-xs' }
  if (src) {
    return <img src={src} alt={name} className={cn('rounded-full object-cover', sizes[size])} />
  }
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-gradient-to-br from-slate-600 to-slate-800 font-bold text-white',
        sizes[size]
      )}
    >
      {name?.replace('Dr. ', '').charAt(0) || 'D'}
    </div>
  )
}

export default function DoctorHeader({ onMenuClick }) {
  const { user, displayName } = useAuth()
  const { data: doctorProfile } = useDoctorProfile(user?.uid)

  const name = doctorProfile?.fullName || displayName || 'Doctor'
  const specialty = doctorProfile?.specialty || 'Physician'

  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center gap-4 border-b border-gray-100 bg-white px-4 sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="relative mx-auto hidden w-full max-w-xl flex-1 md:block">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          placeholder="Search patients, appointments, prescriptions..."
          className="w-full rounded-xl border border-gray-200 bg-gray-50/80 py-2.5 pl-11 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        />
      </div>

      <div className="ml-auto flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          className="relative rounded-xl p-2.5 text-gray-500 hover:bg-gray-50"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
            5
          </span>
        </button>

        <button
          type="button"
          className="relative rounded-xl p-2.5 text-gray-500 hover:bg-gray-50"
          aria-label="Messages"
        >
          <MessageSquare className="h-5 w-5" />
          <span className="absolute right-1 top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
            3
          </span>
        </button>

        <div className="flex items-center gap-2.5 rounded-xl border border-gray-100 bg-white py-1 pl-1 pr-2 sm:pr-3">
          <DoctorAvatar name={name} src={doctorProfile?.avatar} />
          <div className="hidden sm:block">
            <p className="text-sm font-semibold leading-tight text-gray-900">{name}</p>
            <p className="text-xs text-gray-500">{specialty}</p>
          </div>
          <ChevronDown className="hidden h-4 w-4 text-gray-400 sm:block" />
        </div>
      </div>
    </header>
  )
}

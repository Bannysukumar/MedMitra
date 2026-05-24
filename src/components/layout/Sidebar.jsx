import { NavLink, Link } from 'react-router-dom'
import {
  Heart,
  LayoutDashboard,
  Package,
  Pill,
  FileText,
  HeartPulse,
  MapPin,
  Bell,
  Settings,
  Headphones,
  LogOut,
  X,
} from 'lucide-react'
import { SIDEBAR_LINKS } from '../../config/constants'
import { useAuth } from '../../contexts/AuthContext'
import { cn } from '../../utils/helpers'

const iconMap = {
  LayoutDashboard,
  Package,
  Pill,
  FileText,
  HeartPulse,
  Heart,
  MapPin,
  Bell,
  Settings,
  Headphones,
}

export default function Sidebar({ open, onClose }) {
  const { logout } = useAuth()

  const handleLogout = async () => {
    onClose?.()
    await logout()
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 z-50 flex h-screen w-[260px] flex-col bg-sidebar text-white transition-transform duration-300 lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex h-[72px] items-center justify-between px-6">
          <Link to="/dashboard" className="flex items-center gap-2.5" onClick={onClose}>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600">
              <Heart className="h-4 w-4 text-white" fill="white" />
            </div>
            <span className="text-xl font-bold tracking-tight">MedMitra</span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-4 py-2">
          {SIDEBAR_LINKS.map((link) => {
            const Icon = iconMap[link.icon] || LayoutDashboard
            return (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/dashboard'}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition',
                    isActive
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25'
                      : 'text-gray-400 hover:bg-sidebar-hover hover:text-white'
                  )
                }
              >
                <Icon className="h-[18px] w-[18px] shrink-0" />
                {link.label}
              </NavLink>
            )
          })}

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-400 transition hover:bg-sidebar-hover hover:text-white"
          >
            <LogOut className="h-[18px] w-[18px] shrink-0" />
            Logout
          </button>
        </nav>
      </aside>
    </>
  )
}

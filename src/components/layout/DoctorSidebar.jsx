import { NavLink, Link } from 'react-router-dom'
import {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  ClipboardList,
  MessageSquare,
  BarChart3,
  Wallet,
  Settings,
  LogOut,
  X,
  Crown,
  UserCircle,
  HelpCircle,
} from 'lucide-react'
import { DOCTOR_NAV_LINKS } from '../../config/doctorConstants'
import { useAuth } from '../../contexts/AuthContext'
import Logo from '../ui/Logo'
import Button from '../ui/Button'
import { cn } from '../../utils/helpers'

const iconMap = {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  ClipboardList,
  MessageSquare,
  BarChart3,
  Wallet,
  Settings,
  UserCircle,
  HelpCircle,
}

export default function DoctorSidebar({ open, onClose }) {
  const { logout } = useAuth()

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={onClose} aria-hidden />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 z-50 flex h-screen w-[260px] flex-col bg-sidebar text-white transition-transform duration-300 lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex h-[72px] items-center justify-between border-b border-white/10 px-5">
          <div>
            <Logo to="/doctor" size="sm" onClick={onClose} imgClassName="brightness-0 invert" />
            <p className="mt-0.5 text-[11px] font-medium text-gray-400">Doctor Portal</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
          {DOCTOR_NAV_LINKS.map((link) => {
            const Icon = iconMap[link.icon] || LayoutDashboard
            return (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/doctor'}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition',
                    isActive
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                      : 'text-gray-400 hover:bg-sidebar-hover hover:text-white'
                  )
                }
              >
                <span className="flex items-center gap-3">
                  <Icon className="h-[18px] w-[18px] shrink-0" />
                  {link.label}
                </span>
                {link.badge ? (
                  <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary-500 px-1.5 text-[10px] font-bold text-white">
                    {link.badge}
                  </span>
                ) : null}
              </NavLink>
            )
          })}
        </nav>

        <div className="space-y-3 border-t border-white/10 p-4">
          <div className="rounded-2xl bg-gradient-to-br from-primary-600/30 to-primary-800/20 p-4 ring-1 ring-white/10">
            <div className="mb-2 flex items-center gap-2">
              <Crown className="h-4 w-4 text-amber-400" />
              <span className="text-sm font-bold text-white">Go Premium</span>
            </div>
            <p className="mb-3 text-xs leading-relaxed text-gray-400">
              Unlock advanced features and grow your practice.
            </p>
            <Button size="sm" className="w-full !bg-primary-600 hover:!bg-primary-700">
              Upgrade Now
            </Button>
          </div>

          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-400 transition hover:bg-sidebar-hover hover:text-white"
          >
            <LogOut className="h-[18px] w-[18px] shrink-0" />
            Logout
          </button>

          <Link
            to="/"
            onClick={onClose}
            className="block text-center text-xs text-gray-500 hover:text-gray-300"
          >
            Back to MedMitra
          </Link>
        </div>
      </aside>
    </>
  )
}

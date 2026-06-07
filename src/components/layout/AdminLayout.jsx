import { useState } from 'react'
import { NavLink, Link, Outlet, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Pill,
  FileText,
  Package,
  FileEdit,
  LogOut,
  ArrowLeft,
  Menu,
  X,
  Shield,
  BarChart3,
  Sparkles,
  CreditCard,
  HeartPulse,
  Headphones,
  Bell,
  Mail,
  Megaphone,
  ScrollText,
  Database,
  Settings,
} from 'lucide-react'
import { ADMIN_NAV_SECTIONS } from '../../config/constants'
import { useAuth } from '../../contexts/AuthContext'
import Logo from '../ui/Logo'
import { cn } from '../../utils/helpers'

const iconMap = {
  LayoutDashboard,
  Users,
  Pill,
  FileText,
  Package,
  FileEdit,
  BarChart3,
  Sparkles,
  CreditCard,
  HeartPulse,
  Headphones,
  Bell,
  Mail,
  Megaphone,
  Shield,
  ScrollText,
  Database,
  Settings,
}

const PAGE_TITLES = Object.fromEntries(
  ADMIN_NAV_SECTIONS.flatMap((s) => s.links.map((l) => [l.path, l.label]))
)

export default function AdminLayout() {
  const { logout } = useAuth()
  const { pathname } = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const title = PAGE_TITLES[pathname] || 'Admin Control Panel'

  return (
    <div className="admin-layout relative min-h-dvh w-full overflow-x-hidden bg-[#f8fafc]">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 z-50 flex h-screen w-[280px] flex-col bg-sidebar text-white transition-transform duration-300 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex h-[72px] items-center justify-between border-b border-white/10 px-6">
          <Logo to="/admin" size="md" onClick={() => setSidebarOpen(false)} />
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1.5 text-gray-400 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mx-4 mt-4 flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-primary-200">
          <Shield className="h-3.5 w-3.5" />
          Platform Admin — Full Control
        </div>

        <nav className="flex-1 space-y-4 overflow-y-auto px-3 py-4">
          {ADMIN_NAV_SECTIONS.map((section) => (
            <div key={section.title}>
              <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                {section.title}
              </p>
              <div className="space-y-0.5">
                {section.links.map((link) => {
                  const Icon = iconMap[link.icon] || LayoutDashboard
                  return (
                    <NavLink
                      key={link.path}
                      to={link.path}
                      end={link.path === '/admin'}
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
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
              </div>
            </div>
          ))}
        </nav>

        <div className="space-y-0.5 border-t border-white/10 p-4">
          <Link
            to="/"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-400 transition hover:bg-sidebar-hover hover:text-white"
          >
            <ArrowLeft className="h-[18px] w-[18px] shrink-0" />
            Back to Site
          </Link>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-400 transition hover:bg-sidebar-hover hover:text-white"
          >
            <LogOut className="h-[18px] w-[18px] shrink-0" />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex min-h-dvh w-full min-w-0 flex-col lg:pl-[280px]">
        <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-gray-100 bg-white px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-900 sm:text-xl">{title}</h1>
              <p className="hidden text-xs text-gray-500 sm:block">Single admin authority — no super admin tier</p>
            </div>
          </div>
          <span className="hidden rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700 sm:inline-flex">
            MedMitra Admin
          </span>
        </header>

        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

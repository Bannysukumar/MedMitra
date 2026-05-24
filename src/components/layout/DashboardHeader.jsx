import { Link, useLocation } from 'react-router-dom'
import { Menu, Search, ShoppingCart, Bell } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useCartStore } from '../../stores/useStore'
import { demoNotifications } from '../../data/mockData'

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/dashboard/orders': 'My Orders',
  '/dashboard/medicines': 'Medicines',
  '/dashboard/prescriptions': 'Prescriptions',
  '/dashboard/health-records': 'Health Records',
  '/dashboard/wishlist': 'Wishlist',
  '/dashboard/addresses': 'Addresses',
  '/dashboard/notifications': 'Notifications',
  '/dashboard/profile': 'Profile Settings',
  '/dashboard/support': 'Support',
  '/dashboard/cart': 'Cart',
  '/dashboard/checkout': 'Checkout',
}

export default function DashboardHeader({ onMenuClick }) {
  const { displayName, plan } = useAuth()
  const location = useLocation()
  const itemCount = useCartStore((s) => s.getItemCount())
  const unreadCount = demoNotifications.filter((n) => !n.read).length

  const title = PAGE_TITLES[location.pathname] || 'Dashboard'
  const isPremium = plan === 'premium' || plan === 'family'

  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-gray-100 bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-bold text-gray-900 sm:text-xl">{title}</h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          to="/dashboard/medicines"
          className="rounded-xl p-2.5 text-gray-500 hover:bg-gray-50 hover:text-primary-600"
          title="Search medicines"
        >
          <Search className="h-5 w-5" />
        </Link>

        <Link
          to="/dashboard/cart"
          className="relative rounded-xl p-2.5 text-gray-500 hover:bg-gray-50 hover:text-primary-600"
        >
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary-600 px-1 text-[10px] font-bold text-white">
              {itemCount}
            </span>
          )}
        </Link>

        <Link
          to="/dashboard/notifications"
          className="relative rounded-xl p-2.5 text-gray-500 hover:bg-gray-50 hover:text-primary-600"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
          )}
        </Link>

        <div className="ml-1 flex items-center gap-2.5 rounded-xl border border-gray-100 bg-gray-50/80 py-1.5 pl-1.5 pr-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-sm font-bold text-white">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold leading-tight text-gray-900">{displayName}</p>
            {isPremium ? (
              <span className="inline-block rounded-md bg-primary-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-700">
                Premium Member
              </span>
            ) : (
              <p className="text-[11px] capitalize text-gray-500">{plan} plan</p>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Heart, Menu, X, ShoppingCart, Phone } from 'lucide-react'
import { NAV_LINKS } from '../../config/constants'
import { useAuth } from '../../contexts/AuthContext'
import { useCartStore } from '../../stores/useStore'
import Button from '../ui/Button'
import { cn } from '../../utils/helpers'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { isAuthenticated } = useAuth()
  const itemCount = useCartStore((s) => s.getItemCount())

  return (
    <header className="sticky top-0 z-50">
      <div className="hidden bg-sidebar text-xs text-gray-400 sm:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
          <span className="flex items-center gap-1.5">
            <Phone className="h-3 w-3 text-primary-400" />
            24/7 Support: +91 1800-123-4567
          </span>
          <span>Free delivery on orders above ₹499</span>
        </div>
      </div>

      <div className="border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 shadow-lg shadow-primary-600/30">
              <Heart className="h-5 w-5 text-white" fill="white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              Med<span className="text-primary-600">Mitra</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-0.5 xl:flex">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                className={({ isActive }) =>
                  cn(
                    'rounded-lg px-3.5 py-2 text-sm font-medium transition-all',
                    isActive
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-primary-600'
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            {isAuthenticated && (
              <Link
                to="/dashboard/cart"
                className="relative rounded-xl p-2.5 text-gray-500 transition hover:bg-gray-50 hover:text-primary-600"
              >
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white">
                    {itemCount}
                  </span>
                )}
              </Link>
            )}
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button size="sm">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="font-semibold">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="shadow-lg shadow-primary-600/25">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            className="rounded-xl p-2.5 text-gray-600 hover:bg-gray-100 xl:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {open && (
          <div className="border-t border-gray-100 bg-white px-4 py-5 xl:hidden">
            <nav className="grid grid-cols-2 gap-1">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'rounded-xl px-4 py-3 text-sm font-medium',
                      isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50'
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-gray-100 pt-4">
              {isAuthenticated ? (
                <Link to="/dashboard" onClick={() => setOpen(false)} className="col-span-2">
                  <Button size="full">Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)}>
                    <Button variant="outline" size="full">
                      Login
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={() => setOpen(false)}>
                    <Button size="full">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

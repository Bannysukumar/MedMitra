import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Globe, Share2, Link as LinkIcon, MessageCircle } from 'lucide-react'
import { NAV_LINKS } from '../../config/constants'
import Logo from '../ui/Logo'

const FOOTER_LINKS = {
  Company: NAV_LINKS.filter((l) => ['/', '/about', '/team', '/blog'].includes(l.path)),
  Services: NAV_LINKS.filter((l) => ['/features', '/medicines', '/pricing'].includes(l.path)),
  Support: NAV_LINKS.filter((l) => ['/faq', '/contact'].includes(l.path)),
}

export default function Footer() {
  return (
    <footer className="bg-sidebar text-gray-400">
      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-10 sm:flex-row sm:px-6 lg:px-8">
          <div>
            <h3 className="text-lg font-bold text-white">Stay healthy, stay informed</h3>
            <p className="mt-1 text-sm">Get health tips and exclusive offers in your inbox.</p>
          </div>
          <form
            className="flex w-full max-w-md gap-2"
            onSubmit={(e) => {
              e.preventDefault()
            }}
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-primary-500 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo to="/" size="md" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed">
              India&apos;s trusted digital healthcare platform. Order medicines, manage prescriptions,
              and track your health — all in one place.
            </p>
            <div className="mt-6 flex gap-3">
              {[Globe, Share2, LinkIcon, MessageCircle].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-gray-400 transition hover:bg-primary-600 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-white">{title}</h4>
              <ul className="mt-4 space-y-2.5">
                {links.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="text-sm transition hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="font-semibold text-white">Contact</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-primary-400" />
                support@medmitra.com
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-primary-400" />
                +91 1800-123-4567
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary-400" />
                Andheri West, Mumbai, Maharashtra 400058
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm sm:flex-row">
          <p>© {new Date().getFullYear()} MedMitra Healthcare Pvt. Ltd. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/admin/login" className="hover:text-white">
              Admin
            </Link>
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

import { Link, Outlet, useLocation } from 'react-router-dom'
import {
  Heart,
  Shield,
  Truck,
  Clock,
  CheckCircle2,
  Lock,
  ClipboardList,
  Pill,
  Sparkles,
} from 'lucide-react'

const AUTH_PANELS = {
  '/login': {
    title: 'Welcome Back!',
    subtitle: 'Login to your account and manage your health journey with ease.',
    benefits: [
      'Order medicines with fast delivery',
      'Upload & track prescriptions online',
      'Secure health records storage',
      '24/7 customer support',
    ],
    illustration: 'login',
  },
  '/signup': {
    title: 'Create Account',
    subtitle: 'Join us and start your health journey today with MedMitra.',
    benefits: [
      'Free account with instant access',
      'Smart medicine recommendations',
      'Order tracking & notifications',
      'Family health management',
    ],
    illustration: 'signup',
  },
  '/forgot-password': {
    title: 'Forgot Password?',
    subtitle: "Don't worry! Enter your email and we'll send you a reset link.",
    benefits: [
      'Secure password recovery',
      'Link expires in 24 hours',
      'Check your spam folder',
    ],
    illustration: 'forgot',
  },
}

function AuthIllustration({ type }) {
  if (type === 'signup') {
    return (
      <div className="relative mx-auto w-full max-w-md">
        <div className="overflow-hidden rounded-3xl bg-white/70 p-3 shadow-xl backdrop-blur-sm ring-1 ring-white/80">
          <img
            src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&h=500&fit=crop"
            alt="Healthcare professional"
            className="h-64 w-full rounded-2xl object-cover object-top"
          />
        </div>
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary-600 px-5 py-2 text-sm font-semibold text-white shadow-lg">
          Your Health Partner
        </div>
      </div>
    )
  }

  if (type === 'forgot') {
    return (
      <div className="relative mx-auto flex h-72 w-72 items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-primary-200/50" />
        <div className="relative z-10 flex h-40 w-40 items-center justify-center rounded-[2rem] bg-gradient-to-br from-primary-500 to-primary-700 shadow-2xl shadow-primary-600/40">
          <Lock className="h-20 w-20 text-white" strokeWidth={1.5} />
        </div>
        <div className="absolute -right-2 top-8 rounded-2xl bg-white p-3 shadow-lg">
          <Shield className="h-8 w-8 text-green-500" />
        </div>
      </div>
    )
  }

  return (
    <div className="relative mx-auto h-72 w-full max-w-md">
      <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-200/60" />
      <div className="relative flex h-full items-center justify-center gap-5 pt-4">
        <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-white shadow-xl ring-1 ring-primary-100">
          <Shield className="h-14 w-14 text-primary-600" />
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-lg">
            <ClipboardList className="h-9 w-9 text-emerald-500" />
          </div>
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-lg">
            <Pill className="h-9 w-9 text-orange-500" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AuthLayout() {
  const { pathname } = useLocation()
  const panel = AUTH_PANELS[pathname] || AUTH_PANELS['/login']

  return (
    <div className="auth-page flex min-h-screen bg-[#eef5ff]">
      <div className="relative hidden overflow-hidden lg:flex lg:w-[46%] xl:w-[44%]">
        <div className="absolute inset-0 auth-panel-bg" />
        <div className="pointer-events-none absolute -left-20 top-20 h-72 w-72 rounded-full bg-primary-300/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 right-0 h-80 w-80 rounded-full bg-cyan-300/25 blur-3xl" />

        <div className="relative flex w-full flex-col justify-between p-10 xl:p-14">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-600 shadow-lg shadow-primary-600/30">
              <Heart className="h-5 w-5 text-white" fill="white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              Med<span className="text-primary-600">Mitra</span>
            </span>
          </Link>

          <div className="space-y-8 py-6">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-600/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-700">
                <Sparkles className="h-3.5 w-3.5" />
                Healthcare Platform
              </span>
              <h1 className="mt-4 text-3xl font-bold leading-tight text-gray-900 xl:text-[2.5rem]">
                {panel.title}
              </h1>
              <p className="mt-3 max-w-md text-base font-medium leading-relaxed text-gray-700">
                {panel.subtitle}
              </p>
            </div>

            <AuthIllustration type={panel.illustration} />

            <ul className="space-y-3.5">
              {panel.benefits.map((text) => (
                <li key={text} className="flex items-center gap-3 text-sm font-medium text-gray-800">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-600/10">
                    <CheckCircle2 className="h-4 w-4 text-primary-600" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap items-center gap-5 border-t border-primary-200/60 pt-6 text-sm font-medium text-gray-600">
            <span className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-primary-600" /> Fast Delivery
            </span>
            <span className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary-600" /> Secure
            </span>
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary-600" /> 24/7 Support
            </span>
          </div>
        </div>
      </div>

      <div className="auth-form-bg flex w-full flex-col lg:w-[54%] xl:w-[56%]">
        <div className="flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4 lg:hidden">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600">
              <Heart className="h-4 w-4 text-white" fill="white" />
            </div>
            <span className="text-lg font-bold text-gray-900">
              Med<span className="text-primary-600">Mitra</span>
            </span>
          </Link>
        </div>

        <div className="flex flex-1 flex-col justify-center px-5 py-10 sm:px-10 lg:px-16 xl:px-20">
          <Outlet />
        </div>

        <p className="hidden pb-6 text-center text-xs text-gray-400 lg:block">
          © {new Date().getFullYear()} MedMitra · Secure & encrypted
        </p>
      </div>
    </div>
  )
}

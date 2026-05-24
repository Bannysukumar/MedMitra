import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Shield, Mail, Lock, Heart } from 'lucide-react'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import toast from 'react-hot-toast'

const DEMO_ADMIN = {
  uid: 'admin-demo',
  email: 'admin@medmitra.com',
  displayName: 'Admin User',
  role: 'admin',
  plan: 'premium',
  emailVerified: true,
}

export default function AdminLogin() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit } = useForm({
    defaultValues: { email: 'admin@medmitra.com', password: 'admin123' },
  })

  const onSubmit = async () => {
    setLoading(true)
    localStorage.setItem('medmitra-admin', 'true')
    localStorage.setItem('medmitra-demo-user', JSON.stringify(DEMO_ADMIN))
    toast.success('Admin login successful (demo)')
    setLoading(false)
    navigate('/admin')
    window.location.reload()
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#eef5ff] px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600">
            <Heart className="h-5 w-5 text-white" fill="white" />
          </div>
          <span className="text-xl font-bold text-gray-900">
            Med<span className="text-primary-600">Mitra</span>
          </span>
        </Link>

        <div className="rounded-2xl border border-gray-100 bg-white p-7 shadow-xl shadow-primary-600/[0.08] sm:p-8">
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50">
              <Shield className="h-7 w-7 text-primary-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
            <p className="mt-1 text-sm text-gray-500">MedMitra Administration Panel</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              icon={Mail}
              placeholder="admin@medmitra.com"
              {...register('email')}
            />
            <Input
              label="Password"
              type="password"
              icon={Lock}
              placeholder="Enter your password"
              {...register('password')}
            />
            <Button type="submit" size="full" loading={loading} className="!py-3.5">
              Sign In as Admin
            </Button>
          </form>

          <p className="mt-5 text-center text-xs text-gray-400">
            Demo: any credentials work. Sets admin in localStorage.
          </p>
        </div>

        <Link
          to="/"
          className="mt-6 block text-center text-sm font-medium text-primary-600 hover:underline"
        >
          ← Back to website
        </Link>
      </div>
    </div>
  )
}

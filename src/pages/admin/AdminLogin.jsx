import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Shield, Mail, Lock } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import Logo from '../../components/ui/Logo'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import toast from 'react-hot-toast'

export default function AdminLogin() {
  const navigate = useNavigate()
  const { adminLogin } = useAuth()
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit } = useForm({
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await adminLogin(data)
      navigate('/admin')
    } catch (err) {
      toast.error(err.message || 'Admin login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#eef5ff] px-4 py-10">
      <div className="w-full max-w-md">
        <Logo to="/" size="lg" className="mb-8 flex justify-center" />

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
              {...register('email', { required: true })}
            />
            <Input
              label="Password"
              type="password"
              icon={Lock}
              placeholder="Enter your password"
              {...register('password', { required: true })}
            />
            <Button type="submit" size="full" loading={loading} className="!py-3.5">
              Sign In as Admin
            </Button>
          </form>

          <p className="mt-5 text-center text-xs text-gray-400">
            Requires a Firebase account with role set to &quot;admin&quot; in Firestore.
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

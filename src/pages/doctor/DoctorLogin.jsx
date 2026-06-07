import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Stethoscope } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../../contexts/AuthContext'
import AuthCard from '../../components/auth/AuthCard'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Logo from '../../components/ui/Logo'

export default function DoctorLogin() {
  const { doctorLogin } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await doctorLogin(form)
      navigate('/doctor')
    } catch (err) {
      toast.error(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[#f4f7fb] p-4">
      <div className="mb-8 text-center">
        <Logo to="/" size="lg" className="mx-auto" />
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-700">
          <Stethoscope className="h-4 w-4" />
          Doctor Portal
        </div>
      </div>

      <AuthCard title="Doctor Sign In" subtitle="Access your practice dashboard">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
          <Input
            label="Password"
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          />
          <Button type="submit" loading={loading} className="w-full">
            Sign In to Dashboard
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          <Link to="/login" className="font-semibold text-primary-600 hover:underline">
            Patient login
          </Link>
          {' · '}
          <Link to="/admin/login" className="font-semibold text-primary-600 hover:underline">
            Admin login
          </Link>
        </p>
      </AuthCard>
    </div>
  )
}

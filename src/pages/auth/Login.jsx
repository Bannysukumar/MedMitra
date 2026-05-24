import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import AuthCard from '../../components/auth/AuthCard'
import { AuthDivider, AuthSocialButtons } from '../../components/auth/AuthSocial'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

export default function Login() {
  const { login, socialLogin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { email: '', password: '', remember: true } })

  const from = location.state?.from?.pathname || '/dashboard'

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await login(data)
      navigate(from, { replace: true })
    } finally {
      setLoading(false)
    }
  }

  const handleSocial = async (provider) => {
    setLoading(true)
    try {
      await socialLogin(provider)
      navigate(from, { replace: true })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthCard
      className="mx-auto max-w-md"
      title="Login"
      subtitle="Enter your credentials to access your account"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Email Address"
          type="email"
          icon={Mail}
          placeholder="name@example.com"
          error={errors.email?.message}
          {...register('email', { required: 'Email is required' })}
        />
        <Input
          label="Password"
          type={showPass ? 'text' : 'password'}
          icon={Lock}
          placeholder="Enter your password"
          error={errors.password?.message}
          rightElement={
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              aria-label={showPass ? 'Hide password' : 'Show password'}
            >
              {showPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          }
          {...register('password', { required: 'Password is required' })}
        />

        <div className="flex items-center justify-between pt-0.5">
          <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-gray-600">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 accent-primary-600 focus:ring-primary-500/20"
              {...register('remember')}
            />
            Remember me
          </label>
          <Link
            to="/forgot-password"
            className="text-sm font-semibold text-primary-600 transition hover:text-primary-700 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <Button
          type="submit"
          size="full"
          loading={loading}
          className="!py-3.5 text-base shadow-lg shadow-primary-600/25"
        >
          Login
        </Button>
      </form>

      <AuthDivider />
      <AuthSocialButtons
        disabled={loading}
        onGoogle={() => handleSocial('google')}
        onFacebook={() => handleSocial('facebook')}
      />

      <p className="mt-8 text-center text-sm text-gray-600">
        Don&apos;t have an account?{' '}
        <Link to="/signup" className="font-semibold text-primary-600 hover:underline">
          Sign Up
        </Link>
      </p>
    </AuthCard>
  )
}

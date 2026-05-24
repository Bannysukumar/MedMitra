import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import AuthCard from '../../components/auth/AuthCard'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await signup(data)
      navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthCard
      className="mx-auto max-w-md"
      title="Sign Up"
      subtitle="Create your MedMitra account in minutes"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full Name"
          icon={User}
          placeholder="John Doe"
          error={errors.fullName?.message}
          {...register('fullName', { required: 'Name is required' })}
        />
        <Input
          label="Email Address"
          type="email"
          icon={Mail}
          placeholder="name@example.com"
          error={errors.email?.message}
          {...register('email', { required: 'Email is required' })}
        />
        <Input
          label="Phone Number"
          icon={Phone}
          placeholder="+91 98765 43210"
          error={errors.phone?.message}
          {...register('phone', { required: 'Phone is required' })}
        />
        <Input
          label="Password"
          type={showPass ? 'text' : 'password'}
          icon={Lock}
          placeholder="Create a strong password"
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
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 6, message: 'At least 6 characters' },
          })}
        />
        <Input
          label="Confirm Password"
          type="password"
          icon={Lock}
          placeholder="Re-enter your password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Please confirm password',
            validate: (v) => v === watch('password') || 'Passwords do not match',
          })}
        />

        <label className="flex cursor-pointer items-start gap-2.5 pt-1 text-sm text-gray-600">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-primary-600 focus:ring-primary-500/20"
            {...register('terms', { required: true })}
          />
          <span>
            I agree to the{' '}
            <span className="font-semibold text-primary-600">Terms & Conditions</span>
          </span>
        </label>

        <Button
          type="submit"
          size="full"
          loading={loading}
          className="!py-3.5 text-base shadow-lg shadow-primary-600/25"
        >
          Create Account
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-primary-600 hover:underline">
          Login
        </Link>
      </p>
    </AuthCard>
  )
}

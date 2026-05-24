import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import AuthCard from '../../components/auth/AuthCard'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

export default function ForgotPassword() {
  const { resetPassword } = useAuth()
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async ({ email }) => {
    setLoading(true)
    try {
      await resetPassword(email)
      setSent(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <Link
        to="/login"
        className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-primary-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to login
      </Link>

      <AuthCard
        title="Reset Password"
        subtitle="Enter your email and we'll send you instructions to reset your password"
      >
        {sent ? (
          <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
              <div>
                <p className="font-semibold text-green-900">Check your inbox</p>
                <p className="mt-1 text-sm text-green-800">
                  We&apos;ve sent password reset instructions to your email. The link expires in 24
                  hours.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              icon={Mail}
              placeholder="name@example.com"
              error={errors.email?.message}
              {...register('email', { required: 'Email is required' })}
            />
            <Button
              type="submit"
              size="full"
              loading={loading}
              className="!py-3.5 text-base shadow-lg shadow-primary-600/25"
            >
              Send Reset Link
            </Button>
          </form>
        )}
      </AuthCard>
    </div>
  )
}

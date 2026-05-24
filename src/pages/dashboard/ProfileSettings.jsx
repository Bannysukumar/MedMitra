import { useForm } from 'react-hook-form'
import { User, Mail, Phone, Camera, Calendar } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

export default function ProfileSettings() {
  const { displayName, user, profile, updateUserProfile } = useAuth()

  const { register, handleSubmit } = useForm({
    defaultValues: {
      fullName: displayName,
      email: user?.email || '',
      phone: profile?.phone || '',
      dob: profile?.dob || '',
    },
  })

  const onSubmit = async (data) => {
    await updateUserProfile({
      fullName: data.fullName,
      phone: data.phone,
      dob: data.dob,
    })
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <p className="text-gray-600">Manage your personal information and account preferences.</p>

      <Card className="overflow-hidden !p-0">
        <div className="border-b border-gray-100 bg-gradient-to-r from-primary-50/80 to-white px-6 py-8 sm:px-8">
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-3xl font-bold text-white shadow-lg shadow-primary-600/25">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <button
                type="button"
                className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-primary-600 text-white shadow-md transition hover:bg-primary-700"
                aria-label="Change photo"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <button
              type="button"
              className="mt-4 text-sm font-semibold text-primary-600 transition hover:text-primary-700 hover:underline"
            >
              Change Photo
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-6 sm:p-8">
          <Input
            label="Full Name"
            icon={User}
            placeholder="Your full name"
            {...register('fullName')}
          />
          <Input
            label="Email Address"
            type="email"
            icon={Mail}
            placeholder="name@example.com"
            {...register('email')}
          />
          <Input
            label="Phone Number"
            icon={Phone}
            placeholder="+91 98765 43210"
            {...register('phone')}
          />
          <Input label="Date of Birth" type="date" icon={Calendar} {...register('dob')} />
          <Button type="submit" size="full" className="!mt-2 !py-3.5 shadow-lg shadow-primary-600/20">
            Save Changes
          </Button>
        </form>
      </Card>
    </div>
  )
}

import { useForm } from 'react-hook-form'
import { MessageCircle, Mail, Phone, Clock, Headphones } from 'lucide-react'
import Card from '../../components/ui/Card'
import Input, { Textarea } from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import toast from 'react-hot-toast'

const CONTACT_OPTIONS = [
  {
    icon: Phone,
    title: 'Call Us',
    desc: '+91 1800-123-4567',
    iconBg: 'bg-blue-50',
    iconColor: 'text-primary-600',
  },
  {
    icon: Mail,
    title: 'Email',
    desc: 'support@medmitra.com',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  {
    icon: Clock,
    title: 'Hours',
    desc: '24/7 Premium support',
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-600',
  },
]

export default function Support() {
  const { register, handleSubmit, reset } = useForm()

  const onSubmit = () => {
    toast.success('Support ticket submitted. We will respond within 24 hours.')
    reset()
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-gray-600">
          We&apos;re here to help with your healthcare needs. Reach out anytime.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {CONTACT_OPTIONS.map(({ icon: Icon, title, desc, iconBg, iconColor }) => (
          <Card key={title} className="!p-5 transition hover:shadow-md">
            <div className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl ${iconBg}`}>
              <Icon className={`h-5 w-5 ${iconColor}`} />
            </div>
            <p className="font-semibold text-gray-900">{title}</p>
            <p className="mt-0.5 text-sm text-gray-600">{desc}</p>
          </Card>
        ))}
      </div>

      <Card className="max-w-2xl !p-6 sm:!p-8">
        <div className="mb-6 flex items-start gap-3 border-b border-gray-100 pb-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50">
            <Headphones className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Submit a Ticket</h2>
            <p className="mt-0.5 text-sm text-gray-500">
              Describe your issue and we&apos;ll get back to you within 24 hours.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Subject"
            placeholder="Brief summary of your issue"
            {...register('subject', { required: true })}
          />
          <Textarea
            label="Message"
            placeholder="Tell us more about what you need help with..."
            rows={5}
            {...register('message', { required: true })}
          />
          <Button type="submit" className="!px-6 !py-3">
            <MessageCircle className="h-4 w-4" />
            Submit Ticket
          </Button>
        </form>
      </Card>
    </div>
  )
}

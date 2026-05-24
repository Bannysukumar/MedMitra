import { useForm } from 'react-hook-form'
import { Mail, Phone, MapPin, Send, Clock, MessageSquare } from 'lucide-react'
import PageHero from '../../components/marketing/PageHero'
import CTASection from '../../components/marketing/CTASection'
import Button from '../../components/ui/Button'
import toast from 'react-hot-toast'

const CONTACT_INFO = [
  { icon: Mail, title: 'Email Us', value: 'support@medmitra.com', desc: 'We reply within 24 hours' },
  { icon: Phone, title: 'Call Us', value: '+91 1800-123-4567', desc: 'Mon–Sat, 9am–6pm IST' },
  { icon: MapPin, title: 'Visit Us', value: 'Mumbai, Maharashtra, India', desc: 'Headquarters & support center' },
  { icon: Clock, title: 'Business Hours', value: '9:00 AM – 6:00 PM', desc: 'Sunday support via email' },
]

const inputClass =
  'w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30'

export default function Contact() {
  const { register, handleSubmit, reset } = useForm()

  const onSubmit = () => {
    toast.success('Message sent! We will respond within 24 hours.')
    reset()
  }

  return (
    <div>
      <PageHero
        variant="light"
        badge="Contact"
        title="We'd love to"
        highlight="hear from you"
        subtitle="Questions about orders, prescriptions, or your account? Our team is here to help."
        centered
      />

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-5 lg:gap-12">
            <div className="space-y-4 lg:col-span-2">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Get in touch</h2>
                <p className="mt-2 font-medium text-gray-700">
                  Reach out through any channel — we&apos;re committed to exceptional support.
                </p>
              </div>
              {CONTACT_INFO.map(({ icon: Icon, title, value, desc }) => (
                <div
                  key={title}
                  className="flex gap-4 rounded-2xl bg-sidebar p-5 shadow-lg transition hover:shadow-xl"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-600/20">
                    <Icon className="h-6 w-6 text-primary-400" />
                  </div>
                  <div>
                    <p className="font-bold text-white">{title}</p>
                    <p className="mt-0.5 font-semibold text-primary-300">{value}</p>
                    <p className="mt-1 text-sm text-gray-400">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl bg-sidebar p-6 shadow-xl sm:p-8 lg:col-span-3">
              <div className="mb-6 flex items-center gap-3 border-b border-white/10 pb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600/20">
                  <MessageSquare className="h-6 w-6 text-primary-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Send a message</h2>
                  <p className="text-sm text-gray-400">Fill out the form and we&apos;ll get back to you soon.</p>
                </div>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-200">Full Name</label>
                    <input className={inputClass} placeholder="John Doe" {...register('name', { required: true })} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-200">Email Address</label>
                    <input type="email" className={inputClass} placeholder="you@example.com" {...register('email', { required: true })} />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-200">Subject</label>
                  <input className={inputClass} placeholder="How can we help?" {...register('subject', { required: true })} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-200">Message</label>
                  <textarea className={`${inputClass} resize-none`} rows={6} placeholder="Tell us more about your inquiry..." {...register('message', { required: true })} />
                </div>
                <Button type="submit" size="lg">
                  <Send className="h-4 w-4" />
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 mesh-bg sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Find us on the map</h2>
            <p className="mt-2 font-medium text-gray-700">MedMitra HQ — Bandra Kurla Complex, Mumbai</p>
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white card-shadow-lg">
            <div className="flex aspect-[21/9] min-h-[280px] items-center justify-center bg-gradient-to-br from-primary-50 via-white to-blue-50">
              <div className="text-center">
                <MapPin className="mx-auto h-12 w-12 text-primary-600" />
                <p className="mt-4 text-lg font-bold text-gray-900">Interactive map coming soon</p>
                <p className="mt-1 text-sm font-medium text-gray-600">456 Corporate Park, BKC, Mumbai 400051</p>
              </div>
            </div>
            <div className="absolute bottom-4 left-4 rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-lg">
              <p className="text-xs font-bold uppercase tracking-wider text-primary-600">Head Office</p>
              <p className="mt-0.5 text-sm font-semibold text-gray-900">Mumbai, India</p>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        title="Start your healthcare journey"
        subtitle="Join MedMitra for medicines, prescriptions, and health records in one premium platform."
        primaryLabel="Create Free Account"
      />
    </div>
  )
}

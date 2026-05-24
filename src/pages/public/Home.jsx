import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  Upload,
  Activity,
  Truck,
  Shield,
  Sparkles,
  Star,
  ChevronDown,
  ArrowRight,
  UserPlus,
  Package,
  MapPin,
} from 'lucide-react'
import { stats, testimonials, faqs } from '../../data/mockData'
import Button from '../../components/ui/Button'
import StatGrid from '../../components/marketing/StatGrid'
import SectionHeader from '../../components/marketing/SectionHeader'
import CTASection from '../../components/marketing/CTASection'
import { cn } from '../../utils/helpers'

const FEATURES = [
  { icon: Search, title: 'Medicine Search', desc: 'Smart search by name, category, brand, or symptoms', color: 'bg-blue-50 text-blue-600' },
  { icon: Upload, title: 'Prescription Upload', desc: 'Upload PDF or images — verified by licensed pharmacists', color: 'bg-green-50 text-green-600' },
  { icon: Activity, title: 'Health Records', desc: 'Secure digital storage for all your health data', color: 'bg-purple-50 text-purple-600' },
  { icon: Truck, title: 'Order Tracking', desc: 'Real-time delivery tracking from pharmacy to doorstep', color: 'bg-orange-50 text-orange-600' },
  { icon: Sparkles, title: 'Smart Recommendations', desc: 'AI-powered medicine suggestions based on symptoms', color: 'bg-cyan-50 text-cyan-700' },
  { icon: Shield, title: 'Secure Storage', desc: 'Bank-grade encryption for your medical data', color: 'bg-red-50 text-red-600' },
]

const STEPS = [
  { icon: UserPlus, title: 'Create Account', desc: 'Sign up free in under 2 minutes' },
  { icon: Search, title: 'Search Medicines', desc: 'Find by name, category, or symptom' },
  { icon: Upload, title: 'Upload Prescription', desc: 'Our pharmacists verify your Rx' },
  { icon: Package, title: 'Place Order', desc: 'Add to cart and checkout securely' },
  { icon: MapPin, title: 'Track Delivery', desc: 'Medicines delivered in 24–48 hours' },
]

export default function Home() {
  const [openFaq, setOpenFaq] = useState(0)

  return (
    <div>
      <section className="relative overflow-hidden hero-light pb-16 pt-12 sm:pb-20 sm:pt-16 lg:pb-24">
        <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-primary-200/40 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="animate-fade-in">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white px-4 py-1.5 text-sm font-semibold text-primary-700 shadow-sm">
                <Sparkles className="h-4 w-4 text-primary-600" />
                Trusted by {stats.users} users across India
              </span>
              <h1 className="mt-6 text-4xl font-bold leading-[1.12] tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                Your Complete{' '}
                <span className="text-primary-600">Healthcare</span> Platform
              </h1>
              <p className="mt-6 max-w-lg text-lg font-medium leading-relaxed text-gray-700">
                Search medicines, upload prescriptions, manage health records, and get
                doorstep delivery — all from one premium platform.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/signup">
                  <Button size="lg" className="shadow-lg shadow-primary-600/25">
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/medicines">
                  <Button size="lg" variant="outline">
                    <Search className="h-4 w-4" />
                    Search Medicines
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="lg" variant="secondary">
                    <Upload className="h-4 w-4" />
                    Upload Prescription
                  </Button>
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-6 text-sm font-medium text-gray-700">
                <span className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary-600" /> Licensed Pharmacy
                </span>
                <span className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-primary-600" /> Free Delivery ₹499+
                </span>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="relative rounded-3xl bg-white p-2 shadow-2xl ring-1 ring-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop"
                  alt="Healthcare professional"
                  className="rounded-2xl"
                />
              </div>
              <div className="absolute -bottom-5 -left-5 rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-xl">
                <p className="text-2xl font-bold text-primary-600">{stats.medicines}</p>
                <p className="text-sm font-semibold text-gray-800">Medicines Available</p>
              </div>
              <div className="absolute -right-3 top-6 rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                    <Truck className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Order Delivered</p>
                    <p className="text-xs font-medium text-gray-600">2 hours ago</p>
                  </div>
                </div>
              </div>
              <div className="absolute left-8 top-8 rounded-xl border border-gray-100 bg-white px-3 py-2 shadow-lg">
                <p className="text-xs font-semibold text-gray-900">Dr. Sarah Ahmed</p>
                <p className="text-[11px] font-medium text-primary-600">Cardiologist</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <StatGrid
        overlap
        stats={[
          { label: 'Registered Users', value: stats.users },
          { label: 'Medicines Available', value: stats.medicines },
          { label: 'Orders Delivered', value: stats.orders },
          { label: 'Prescriptions Processed', value: stats.prescriptions },
        ]}
      />

      <section className="py-20 mesh-bg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Features"
            title="Everything you need for better healthcare"
            subtitle="A complete suite of tools designed to simplify your health journey"
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, desc, color }) => (
              <div
                key={title}
                className="group rounded-2xl border border-gray-100 bg-white p-6 card-shadow transition hover:-translate-y-1 hover:card-shadow-lg"
              >
                <div className={cn('flex h-14 w-14 items-center justify-center rounded-2xl', color)}>
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-gray-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-700">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="How It Works"
            title="Get started in 5 simple steps"
            subtitle="From signup to doorstep delivery — healthcare made effortless"
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {STEPS.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className="relative text-center">
                {i < STEPS.length - 1 && (
                  <div className="absolute left-[60%] top-8 hidden h-0.5 w-[80%] bg-primary-100 lg:block" />
                )}
                <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-lg shadow-primary-600/30">
                  <Icon className="h-7 w-7" />
                  <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary-800 text-xs font-bold text-white">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mt-4 font-bold text-gray-900">{title}</h3>
                <p className="mt-1 text-sm font-medium text-gray-700">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 mesh-bg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Testimonials"
            title="Loved by patients across India"
            subtitle="Real stories from people who trust MedMitra"
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.id} className="rounded-2xl border border-gray-100 bg-white p-6 card-shadow">
                <div className="flex gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="mt-4 leading-relaxed text-gray-800">&ldquo;{t.text}&rdquo;</p>
                <div className="mt-6 flex items-center gap-3 border-t border-gray-100 pt-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-800">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{t.name}</p>
                    <p className="text-sm font-medium text-gray-600">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <SectionHeader
            eyebrow="FAQ"
            title="Frequently asked questions"
            subtitle="Quick answers to common questions"
          />
          <div className="mt-10 space-y-3">
            {faqs.slice(0, 4).map((faq, i) => (
              <div key={faq.question} className="overflow-hidden rounded-2xl border border-gray-100 bg-white card-shadow">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                  className="flex w-full items-center justify-between px-6 py-4 text-left font-semibold text-gray-900"
                >
                  {faq.question}
                  <ChevronDown className={cn('h-5 w-5 shrink-0 text-gray-500 transition', openFaq === i && 'rotate-180')} />
                </button>
                {openFaq === i && (
                  <div className="border-t border-gray-100 px-6 py-4 text-sm leading-relaxed text-gray-700">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              to="/faq"
              className="inline-flex items-center gap-2 font-semibold text-primary-600 hover:underline"
            >
              View all FAQs <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <CTASection secondaryLabel="Browse Medicines" secondaryTo="/medicines" />
    </div>
  )
}

import { Link } from 'react-router-dom'
import {
  Pill,
  FileText,
  Activity,
  Truck,
  Shield,
  Bell,
  CreditCard,
  Smartphone,
  Sparkles,
  Search,
  Upload,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react'
import PageHero from '../../components/marketing/PageHero'
import SectionHeader from '../../components/marketing/SectionHeader'
import CTASection from '../../components/marketing/CTASection'
import StatGrid from '../../components/marketing/StatGrid'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { stats } from '../../data/mockData'
import { cn } from '../../utils/helpers'

const BENTO_FEATURES = [
  {
    icon: Pill,
    title: 'Smart Medicine Search',
    desc: 'Find medicines by name, brand, category, or symptoms with instant suggestions.',
    color: 'bg-blue-50 text-blue-600',
    span: 'lg:col-span-2 lg:row-span-2',
    large: true,
  },
  {
    icon: FileText,
    title: 'Digital Prescriptions',
    desc: 'Upload, verify, and reorder from your prescription history.',
    color: 'bg-emerald-50 text-emerald-600',
    span: '',
    large: false,
  },
  {
    icon: Activity,
    title: 'Health Records',
    desc: 'Secure vault for vitals, allergies, and medication history.',
    color: 'bg-violet-50 text-violet-600',
    span: '',
    large: false,
  },
  {
    icon: Truck,
    title: 'Express Delivery',
    desc: 'Track every order from pharmacy to doorstep in real time.',
    color: 'bg-orange-50 text-orange-600',
    span: 'lg:col-span-2',
    large: false,
  },
  {
    icon: Shield,
    title: 'Verified Pharmacy',
    desc: '100% genuine medicines from licensed suppliers nationwide.',
    color: 'bg-rose-50 text-rose-600',
    span: '',
    large: false,
  },
  {
    icon: Sparkles,
    title: 'AI Recommendations',
    desc: 'Intelligent suggestions based on symptoms and health profile.',
    color: 'bg-cyan-50 text-cyan-600',
    span: '',
    large: false,
  },
]

const DETAILED_FEATURES = [
  {
    icon: Search,
    title: 'Advanced Search',
    desc: 'Filter by category, price, rating, and availability. Symptom-based discovery helps you find the right medicine faster.',
    highlights: ['Symptom search', 'Category filters', 'Smart autocomplete'],
  },
  {
    icon: Upload,
    title: 'Prescription Management',
    desc: 'Upload PDF or images — our licensed pharmacists verify within hours so you can order with confidence.',
    highlights: ['PDF & image support', 'Pharmacist verified', 'One-click reorder'],
  },
  {
    icon: Bell,
    title: 'Medication Reminders',
    desc: 'Never miss a dose. Set schedules, get push notifications, and share reminders with family caregivers.',
    highlights: ['Custom schedules', 'Family sharing', 'Refill alerts'],
  },
  {
    icon: CreditCard,
    title: 'Flexible Payments',
    desc: 'Pay your way with UPI, cards, net banking, or cash on delivery. Transparent pricing with no hidden fees.',
    highlights: ['UPI & cards', 'COD available', 'Secure checkout'],
  },
  {
    icon: Smartphone,
    title: 'Mobile-First Experience',
    desc: 'Full-featured on any device. Responsive design, fast load times, and offline-friendly order history.',
    highlights: ['Responsive UI', 'Fast performance', 'PWA ready'],
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    desc: 'Bank-grade encryption, HIPAA-inspired data practices, and regular security audits protect your health data.',
    highlights: ['End-to-end encryption', 'SOC 2 practices', 'Privacy controls'],
  },
]

export default function Features() {
  return (
    <div>
      <PageHero
        badge="Platform Features"
        title="Everything you need for"
        highlight="modern healthcare"
        subtitle="From medicine search to prescription management — one premium platform built for patients, caregivers, and families."
        centered
      >
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/signup">
            <Button size="lg" className="!bg-white !text-primary-600 hover:!bg-gray-100 shadow-xl">
              Start Free Today
            </Button>
          </Link>
          <Link to="/medicines">
            <Button size="lg" variant="outline" className="!border-white/50 !text-white hover:!bg-white/10">
              Browse Medicines
            </Button>
          </Link>
        </div>
      </PageHero>

      <StatGrid
        stats={[
          { label: 'Active Users', value: stats.users },
          { label: 'Medicines Listed', value: stats.medicines },
          { label: 'Orders Delivered', value: stats.orders },
          { label: 'Prescriptions Verified', value: stats.prescriptions },
        ]}
      />

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Core Platform"
            title="A bento grid of powerful capabilities"
            subtitle="Each feature is designed to simplify your healthcare journey — beautifully integrated, securely delivered."
          />
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
            {BENTO_FEATURES.map(({ icon: Icon, title, desc, color, span, large }) => (
              <Card
                key={title}
                hover
                className={cn(
                  'group flex flex-col justify-between border border-gray-100',
                  span,
                  large && 'min-h-[280px] lg:min-h-0'
                )}
              >
                <div>
                  <div
                    className={cn(
                      'flex items-center justify-center rounded-2xl',
                      color,
                      large ? 'h-16 w-16' : 'h-12 w-12'
                    )}
                  >
                    <Icon className={large ? 'h-8 w-8' : 'h-6 w-6'} />
                  </div>
                  <h3 className={cn('mt-5 font-bold text-gray-900', large ? 'text-2xl' : 'text-lg')}>
                    {title}
                  </h3>
                  <p className={cn('mt-2 text-gray-600', large ? 'text-base leading-relaxed' : 'text-sm')}>
                    {desc}
                  </p>
                </div>
                {large && (
                  <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-primary-600 opacity-0 transition group-hover:opacity-100">
                    Learn more <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 mesh-bg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Deep Dive"
            title="Built for real-world healthcare needs"
            subtitle="Explore how each capability works together to deliver a seamless experience."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {DETAILED_FEATURES.map(({ icon: Icon, title, desc, highlights }) => (
              <Card key={title} hover className="border border-gray-100">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50">
                  <Icon className="h-7 w-7 text-primary-600" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-gray-900">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">{desc}</p>
                <ul className="mt-5 space-y-2 border-t border-gray-100 pt-5">
                  {highlights.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-primary-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white card-shadow">
            <div className="grid lg:grid-cols-2">
              <div className="p-10 lg:p-14">
                <span className="inline-block rounded-full bg-primary-50 px-4 py-1 text-xs font-bold uppercase tracking-widest text-primary-600">
                  Why MedMitra
                </span>
                <h2 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">
                  One platform. Complete care.
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-gray-600">
                  Stop juggling multiple apps. MedMitra unifies medicine ordering, prescriptions,
                  health records, and delivery tracking in a single premium experience.
                </p>
                <Link to="/about" className="mt-8 inline-block">
                  <Button variant="outline">
                    About MedMitra
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="relative min-h-[280px] bg-gradient-to-br from-primary-600 to-primary-800 p-10 lg:min-h-0">
                <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                <div className="relative space-y-6">
                  {['Licensed pharmacy network', '24–48hr metro delivery', '24/7 support team'].map(
                    (item) => (
                      <div key={item} className="flex items-center gap-3 rounded-2xl bg-white/10 px-5 py-4 backdrop-blur-sm">
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-cyan-200" />
                        <span className="font-medium text-white">{item}</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        title="Experience premium healthcare today"
        subtitle="Join thousands who trust MedMitra for medicines, prescriptions, and health records."
        primaryLabel="Create Free Account"
        secondaryLabel="View Pricing"
        secondaryTo="/pricing"
      />
    </div>
  )
}

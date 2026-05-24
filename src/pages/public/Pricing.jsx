import { Link } from 'react-router-dom'
import { Check, X, CreditCard } from 'lucide-react'
import { usePricing } from '../../hooks/useFirestore'
import PageHero from '../../components/marketing/PageHero'
import SectionHeader from '../../components/marketing/SectionHeader'
import CTASection from '../../components/marketing/CTASection'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { formatCurrency, cn } from '../../utils/helpers'

const COMPARISON_ROWS = [
  { feature: 'Medicine search', free: true, premium: true, family: true },
  { feature: 'Order tracking', free: true, premium: true, family: true },
  { feature: 'Health records', free: 'Limited', premium: true, family: true },
  { feature: 'Prescription management', free: false, premium: true, family: true },
  { feature: 'Priority delivery', free: false, premium: true, family: true },
  { feature: 'Order discount', free: '—', premium: '10%', family: '15%' },
  { feature: 'Family members', free: '1', premium: '1', family: 'Up to 5' },
  { feature: 'Dedicated health advisor', free: false, premium: false, family: true },
  { feature: 'Support', free: 'Email', premium: '24/7', family: '24/7 Priority' },
]

function CellValue({ value }) {
  if (value === true) return <Check className="mx-auto h-5 w-5 text-primary-600" />
  if (value === false) return <X className="mx-auto h-5 w-5 text-gray-300" />
  return <span className="text-sm font-medium text-gray-700">{value}</span>
}

export default function Pricing() {
  const { data: pricingPlans, loading } = usePricing()

  return (
    <div>
      <PageHero
        badge="Pricing"
        title="Simple, transparent"
        highlight="healthcare pricing"
        subtitle="Choose the plan that fits your needs. No hidden fees, cancel anytime."
        centered
      />

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <p className="text-center text-gray-500">Loading plans...</p>
          ) : pricingPlans.length === 0 ? (
            <div className="rounded-2xl border border-gray-100 bg-white py-16 text-center card-shadow">
              <CreditCard className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-4 font-medium text-gray-700">Pricing plans will appear here once configured.</p>
            </div>
          ) : (
          <div className="grid gap-8 lg:grid-cols-3 lg:items-stretch">
            {pricingPlans.map((plan) => (
              <Card
                key={plan.id}
                hover
                className={cn(
                  'relative flex flex-col border',
                  plan.popular
                    ? 'border-primary-600 ring-2 ring-primary-600/20 scale-[1.02] shadow-xl'
                    : 'border-gray-100'
                )}
              >
                {plan.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-primary-600 px-5 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg">
                    Most Popular
                  </span>
                )}
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                  <div className="mt-6">
                    <span className="text-5xl font-bold tracking-tight text-primary-600">
                      {plan.price === 0 ? 'Free' : formatCurrency(plan.price)}
                    </span>
                    {plan.price > 0 && (
                      <span className="ml-1 text-gray-500">/{plan.period}</span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    {plan.price === 0 ? 'Perfect to get started' : 'Billed monthly'}
                  </p>
                </div>
                <ul className="mt-8 flex-1 space-y-3 border-t border-gray-100 pt-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-gray-600">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary-600" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/signup" className="mt-8 block">
                  <Button size="full" variant={plan.popular ? 'primary' : 'outline'}>
                    {plan.price === 0 ? 'Get Started Free' : 'Choose Plan'}
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
          )}
        </div>
      </section>

      <section className="py-20 mesh-bg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Compare Plans"
            title="Feature comparison at a glance"
            subtitle="See exactly what you get with each plan."
          />
          <div className="mt-12 overflow-hidden rounded-2xl border border-gray-100 bg-white card-shadow">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/80">
                    <th className="px-6 py-4 text-sm font-bold text-gray-900">Feature</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">Free</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-primary-600">Premium</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">Family</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_ROWS.map((row, i) => (
                    <tr
                      key={row.feature}
                      className={cn(
                        'border-b border-gray-50 transition hover:bg-primary-50/30',
                        i === COMPARISON_ROWS.length - 1 && 'border-0'
                      )}
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.feature}</td>
                      <td className="px-6 py-4 text-center">
                        <CellValue value={row.free} />
                      </td>
                      <td className="bg-primary-50/40 px-6 py-4 text-center">
                        <CellValue value={row.premium} />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <CellValue value={row.family} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm text-gray-500">
            All plans include access to our licensed pharmacy network. Premium and Family plans
            include a 14-day money-back guarantee.
          </p>
        </div>
      </section>

      <CTASection
        title="Start your health journey today"
        subtitle="Create a free account in under two minutes. Upgrade anytime when you're ready."
        primaryLabel="Sign Up Free"
        secondaryLabel="Talk to Sales"
        secondaryTo="/contact"
      />
    </div>
  )
}

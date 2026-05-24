import { Link } from 'react-router-dom'
import Button from '../ui/Button'

export default function CTASection({
  title = 'Ready to take control of your health?',
  subtitle = 'Join thousands of users who trust MedMitra for their healthcare needs.',
  primaryLabel = 'Get Started Free',
  primaryTo = '/signup',
  secondaryLabel,
  secondaryTo,
}) {
  return (
    <section className="relative overflow-hidden gradient-hero hero-pattern py-20">
      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">{title}</h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">{subtitle}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link to={primaryTo}>
            <Button size="lg" className="!bg-white !text-primary-600 hover:!bg-gray-100 shadow-xl">
              {primaryLabel}
            </Button>
          </Link>
          {secondaryLabel && secondaryTo && (
            <Link to={secondaryTo}>
              <Button size="lg" variant="outline" className="!border-white/40 !text-white hover:!bg-white/10">
                {secondaryLabel}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}

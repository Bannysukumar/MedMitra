import { Heart, Target, Eye, Users, Award, Globe, CheckCircle } from 'lucide-react'
import { stats } from '../../data/mockData'
import PageHero from '../../components/marketing/PageHero'
import SectionHeader from '../../components/marketing/SectionHeader'
import StatGrid from '../../components/marketing/StatGrid'
import CTASection from '../../components/marketing/CTASection'

const VALUES = [
  { icon: Heart, title: 'Patient First', desc: 'Every decision puts your health at the center.' },
  { icon: Award, title: 'Quality Assured', desc: '100% genuine medicines from licensed suppliers.' },
  { icon: Globe, title: 'Accessibility', desc: 'Healthcare affordable and reachable for every Indian.' },
  { icon: Users, title: 'Community', desc: 'Health-conscious community across the nation.' },
]

const WHY = [
  'Licensed pharmacy network across 500+ cities',
  'Digital prescription verification by pharmacists',
  'Secure, encrypted health record storage',
  'Same-day delivery in metro cities',
  '24/7 customer support and health advisors',
  'Transparent pricing with no hidden charges',
]

export default function About() {
  return (
    <div>
      <PageHero
        badge="About Us"
        title="Transforming Healthcare"
        highlight="for Every Indian"
        subtitle="Making quality healthcare accessible, affordable, and convenient for everyone."
        centered
      />

      <StatGrid
        stats={[
          { label: 'Happy Users', value: stats.users },
          { label: 'Medicines', value: stats.medicines },
          { label: 'Cities Served', value: '500+' },
          { label: 'Team Members', value: '200+' },
        ]}
      />

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <SectionHeader
                eyebrow="Our Story"
                title="From vision to India's trusted health platform"
                centered={false}
              />
              <p className="mt-6 leading-relaxed text-gray-600">
                MedMitra was founded in 2020 when our founders saw how hard it was for families to access
                essential medicines. Today we serve {stats.users} users with licensed pharmacies and
                cutting-edge technology.
              </p>
              <p className="mt-4 leading-relaxed text-gray-600">
                From prescription verification to health record management, we combine technology with
                compassionate care.
              </p>
            </div>
            <img
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=700&h=500&fit=crop"
              alt="Medical team"
              className="rounded-3xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      <section className="py-20 mesh-bg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { icon: Target, title: 'Our Mission', desc: 'Democratize access to quality healthcare for every citizen.' },
              { icon: Eye, title: 'Our Vision', desc: "India's most trusted digital healthcare ecosystem." },
              { icon: Heart, title: 'Our Promise', desc: 'Genuine medicines and compassionate service every time.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-2xl border border-gray-100 bg-white p-8 card-shadow">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50">
                  <Icon className="h-7 w-7 text-primary-600" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-gray-900">{title}</h3>
                <p className="mt-3 leading-relaxed text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Core Values" title="What drives us every day" />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-lg shadow-primary-600/30">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mt-4 font-bold text-gray-900">{title}</h3>
                <p className="mt-2 text-sm text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 mesh-bg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-12 lg:grid-cols-2">
            <SectionHeader eyebrow="Why MedMitra" title="Why millions choose us" centered={false} />
            <ul className="space-y-4">
              {WHY.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <CTASection title="Join the MedMitra family today" />
    </div>
  )
}

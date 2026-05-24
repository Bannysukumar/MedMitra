import { Link as LinkIcon, Share2, Mail, Users } from 'lucide-react'
import { useTeam } from '../../hooks/useFirestore'
import PageHero from '../../components/marketing/PageHero'
import SectionHeader from '../../components/marketing/SectionHeader'
import CTASection from '../../components/marketing/CTASection'
import Card from '../../components/ui/Card'
import ProductImage from '../../components/ui/ProductImage'
import { cn } from '../../utils/helpers'

export default function Team() {
  const { data: teamMembers, loading } = useTeam()

  return (
    <div>
      <PageHero
        badge="Our Team"
        title="Meet the people behind"
        highlight="MedMitra"
        subtitle="Healthcare experts, technologists, and operators united by one mission — making quality care accessible for every Indian."
        centered
      />

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Leadership"
            title="Passionate experts, proven track records"
            subtitle="Our team blends clinical excellence with world-class technology and operations."
          />
          {loading ? (
            <p className="mt-14 text-center text-gray-500">Loading team...</p>
          ) : teamMembers.length === 0 ? (
            <div className="mt-14 rounded-2xl border border-gray-100 bg-white py-16 text-center card-shadow">
              <Users className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-4 font-medium text-gray-700">Team profiles will appear here once added.</p>
            </div>
          ) : (
            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {teamMembers.map((member) => (
                <Card
                  key={member.id}
                  padding={false}
                  className="group overflow-hidden border border-gray-100"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <ProductImage
                      src={member.image}
                      alt={member.name}
                      className="h-full w-full transition duration-500 group-hover:scale-110"
                      iconClassName="h-10 w-10"
                    />
                    <div
                      className={cn(
                        'absolute inset-0 flex flex-col items-center justify-center gap-4',
                        'bg-gradient-to-t from-primary-900/95 via-primary-800/80 to-primary-600/40',
                        'opacity-0 transition duration-300 group-hover:opacity-100'
                      )}
                    >
                      <p className="max-w-[200px] px-4 text-center text-sm leading-relaxed text-white/90">
                        {member.bio}
                      </p>
                      <div className="flex gap-3">
                        {member.linkedin && (
                          <a
                            href={member.linkedin}
                            aria-label={`${member.name} on LinkedIn`}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition hover:bg-white hover:text-primary-600"
                          >
                            <LinkIcon className="h-5 w-5" />
                          </a>
                        )}
                        {member.twitter && (
                          <a
                            href={member.twitter}
                            aria-label={`${member.name} on Twitter`}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition hover:bg-white hover:text-primary-600"
                          >
                            <Share2 className="h-5 w-5" />
                          </a>
                        )}
                        <a
                          href="mailto:hello@medmitra.com"
                          aria-label={`Email ${member.name}`}
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition hover:bg-white hover:text-primary-600"
                        >
                          <Mail className="h-5 w-5" />
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
                    <p className="mt-1 text-sm font-semibold text-primary-600">{member.role}</p>
                    <p className="mt-3 text-sm leading-relaxed text-gray-600 line-clamp-2 lg:hidden">
                      {member.bio}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 mesh-bg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-gray-100 bg-white p-10 text-center card-shadow sm:p-14">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Join our mission</h2>
            <p className="mx-auto mt-4 max-w-xl text-gray-600">
              We&apos;re always looking for passionate people who want to transform healthcare in India.
              Reach out if you&apos;d like to be part of the journey.
            </p>
            <a
              href="mailto:careers@medmitra.com"
              className="mt-6 inline-block text-sm font-semibold text-primary-600 hover:text-primary-700"
            >
              careers@medmitra.com
            </a>
          </div>
        </div>
      </section>

      <CTASection
        title="Trusted by patients nationwide"
        subtitle="Experience healthcare built by a team that puts your wellbeing first."
        primaryLabel="Get Started"
        secondaryLabel="Contact Us"
        secondaryTo="/contact"
      />
    </div>
  )
}

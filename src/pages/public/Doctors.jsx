import { Link } from 'react-router-dom'
import { Star, BadgeCheck, ChevronRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { subscribePublicDoctors } from '../../services/doctorService'
import PageHero from '../../components/marketing/PageHero'
import Card from '../../components/ui/Card'
import { formatCurrency } from '../../utils/helpers'
import { useRouteContext } from '../../utils/routeContext'

export default function Doctors() {
  const { isDashboard, doctorDetailPath } = useRouteContext()
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = subscribePublicDoctors(
      (items) => {
        setDoctors(items)
        setLoading(false)
      },
      () => setLoading(false)
    )
    return () => unsub?.()
  }, [])

  return (
    <div>
      {isDashboard ? (
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Our Doctors</h1>
          <p className="mt-1 text-sm text-gray-500">
            Meet our verified healthcare professionals. View qualifications, experience, and book
            consultations.
          </p>
        </div>
      ) : (
        <PageHero
          title="Our Doctors"
          subtitle="Meet our verified healthcare professionals. View qualifications, experience, and book consultations."
        />
      )}

      <section className={isDashboard ? '' : 'mx-auto max-w-6xl px-4 py-12 sm:px-6'}>
        {loading && <p className="text-center text-gray-500">Loading doctors…</p>}
        {!loading && doctors.length === 0 && (
          <Card className="!p-12 text-center text-gray-500">No doctor profiles available yet.</Card>
        )}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {doctors.map((doc) => (
            <Link key={doc.id} to={doctorDetailPath(doc.id)}>
              <Card className="group h-full !p-6 transition hover:border-primary-200 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-500 to-slate-700 text-xl font-bold text-white">
                    {doc.fullName?.replace('Dr. ', '').charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="truncate font-bold text-gray-900 group-hover:text-primary-600">
                        {doc.fullName}
                      </h3>
                      {doc.verified && <BadgeCheck className="h-4 w-4 shrink-0 text-primary-600" />}
                    </div>
                    <p className="text-sm font-medium text-primary-600">{doc.specialty}</p>
                    <p className="mt-1 text-xs text-gray-500">{doc.qualifications}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                      <span className="inline-flex items-center gap-1 font-semibold text-amber-600">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        {doc.rating}
                      </span>
                      <span className="text-gray-500">{doc.experienceYears} yrs exp.</span>
                      {doc.consultationFee && (
                        <span className="font-semibold text-gray-700">
                          {formatCurrency(doc.consultationFee)}
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 shrink-0 text-gray-300 group-hover:text-primary-600" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

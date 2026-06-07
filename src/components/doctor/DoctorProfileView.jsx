import { useState } from 'react'
import {
  BadgeCheck,
  Star,
  Users,
  ThumbsUp,
  Mail,
  Phone,
  Stethoscope,
  IndianRupee,
  Clock,
  Download,
  FileText,
  CheckCircle2,
  ChevronRight,
  Home,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { DOCTOR_INFO_TABS, PROFILE_COMPLETION_SECTIONS } from '../../config/doctorConstants'
import { cn, formatCurrency } from '../../utils/helpers'

function InfoField({ label, value }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-gray-900">{value || '—'}</p>
    </div>
  )
}

function DoctorPhoto({ name, src, size = 'lg' }) {
  const sizes = { lg: 'h-28 w-28 text-3xl', md: 'h-16 w-16 text-xl' }
  if (src) {
    return <img src={src} alt={name} className={cn('rounded-full object-cover ring-4 ring-white shadow-lg', sizes[size])} />
  }
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-gradient-to-br from-slate-500 to-slate-700 font-bold text-white ring-4 ring-white shadow-lg',
        sizes[size]
      )}
    >
      {name?.replace('Dr. ', '').charAt(0) || 'D'}
    </div>
  )
}

export default function DoctorProfileView({
  profile,
  showBreadcrumb = true,
  showEditButton = false,
  onEdit,
  breadcrumbBase = '/doctor',
}) {
  const [tab, setTab] = useState('Personal Information')
  const p = profile || {}

  const personal = p.personal || {}
  const hospital = p.hospital || {}

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          {showBreadcrumb && (
            <nav className="mb-1 flex items-center gap-1 text-sm text-gray-500">
              <Link to={breadcrumbBase} className="flex items-center gap-1 hover:text-primary-600">
                <Home className="h-3.5 w-3.5" />
                Home
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="font-medium text-gray-900">Doctor Information</span>
            </nav>
          )}
          <h1 className="text-2xl font-bold text-gray-900">Doctor Information</h1>
        </div>
        {showEditButton && onEdit && (
          <Button onClick={onEdit}>Edit Profile</Button>
        )}
      </div>

      <div className="grid gap-6 xl:grid-cols-12">
        {/* Main column */}
        <div className="space-y-6 xl:col-span-8">
          {/* Profile header card */}
          <Card className="!p-6 shadow-sm">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <DoctorPhoto name={p.fullName} src={p.avatar} />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-bold text-gray-900">{p.fullName}</h2>
                    {p.verified && (
                      <BadgeCheck className="h-5 w-5 text-primary-600" aria-label="Verified" />
                    )}
                  </div>
                  <p className="text-sm font-medium text-primary-600">{p.specialty}</p>
                  <p className="text-sm text-gray-600">{p.qualifications}</p>
                  <p className="text-sm text-gray-500">{p.experienceYears} Years of Experience</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {p.rating} Rating
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-primary-700">
                      <Users className="h-3.5 w-3.5" />
                      {p.totalPatients?.toLocaleString()} Patients
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                      <ThumbsUp className="h-3.5 w-3.5" />
                      {p.satisfaction}% Satisfaction
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-1 lg:min-w-[240px]">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="h-4 w-4 shrink-0 text-gray-400" />
                  {p.email}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="h-4 w-4 shrink-0 text-gray-400" />
                  {p.phone}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Stethoscope className="h-4 w-4 shrink-0 text-gray-400" />
                  {p.specialization}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <IndianRupee className="h-4 w-4 shrink-0 text-gray-400" />
                  {typeof p.consultationFee === 'number' ? formatCurrency(p.consultationFee) : p.consultationFee}
                </div>
                <div className="flex items-start gap-2 sm:col-span-2 lg:col-span-1">
                  <span className="mt-0.5 inline-flex rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                    {p.availability || 'Available'}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="h-3.5 w-3.5" />
                    {p.availabilityHours}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Tabs */}
          <Card className="!p-0 shadow-sm">
            <div className="flex gap-1 overflow-x-auto border-b border-gray-100 px-4 pt-4">
              {DOCTOR_INFO_TABS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={cn(
                    'shrink-0 rounded-t-xl px-4 py-2.5 text-sm font-semibold transition',
                    tab === t
                      ? 'border-b-2 border-primary-600 text-primary-600'
                      : 'text-gray-500 hover:text-gray-800'
                  )}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="p-6">
              {tab === 'Personal Information' && (
                <div className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <InfoField label="Full Name" value={personal.fullName} />
                    <InfoField label="Phone" value={personal.phone} />
                    <InfoField label="Date of Birth" value={personal.dateOfBirth} />
                    <InfoField label="Email" value={personal.email} />
                    <InfoField label="Gender" value={personal.gender} />
                    <InfoField label="Address" value={personal.address} />
                    <InfoField label="Nationality" value={personal.nationality} />
                    <InfoField label="Consultation Fee" value={personal.consultationFee} />
                    <InfoField label="Languages Known" value={personal.languages} />
                    <InfoField label="OPD Timings" value={personal.opdTimings} />
                    <InfoField label="Registration Number" value={personal.registrationNumber} />
                    <InfoField label="Emergency Contact" value={personal.emergencyContact} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-400">About Me</p>
                    <p className="mt-2 text-sm leading-relaxed text-gray-700">{p.aboutMe}</p>
                  </div>
                </div>
              )}

              {tab === 'Education' && (
                <ul className="space-y-4">
                  {(p.education || []).map((edu, i) => (
                    <li key={i} className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                      <p className="font-semibold text-gray-900">{edu.degree}</p>
                      <p className="text-sm text-gray-600">{edu.institution}</p>
                      <p className="text-xs text-gray-400">{edu.year}</p>
                    </li>
                  ))}
                </ul>
              )}

              {tab === 'Experience' && (
                <ul className="space-y-4">
                  {(p.experience || []).map((exp, i) => (
                    <li key={i} className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                      <p className="font-semibold text-gray-900">{exp.role}</p>
                      <p className="text-sm text-gray-600">{exp.hospital}</p>
                      <p className="text-xs text-gray-400">{exp.years}</p>
                    </li>
                  ))}
                </ul>
              )}

              {tab === 'Certificates' && (
                <ul className="space-y-3">
                  {(p.certificates || []).map((cert, i) => (
                    <li key={i} className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3">
                      <div>
                        <p className="font-semibold text-gray-900">{cert.name}</p>
                        <p className="text-xs text-gray-500">{cert.issuer} · {cert.year}</p>
                      </div>
                      <FileText className="h-5 w-5 text-primary-600" />
                    </li>
                  ))}
                </ul>
              )}

              {tab === 'Hospital & Clinic' && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <InfoField label="Hospital Name" value={hospital.name} />
                  <InfoField label="Department" value={hospital.department} />
                  <InfoField label="Designation" value={hospital.designation} />
                  <InfoField label="Phone" value={hospital.phone} />
                  <div className="sm:col-span-2">
                    <InfoField label="Address" value={hospital.address} />
                  </div>
                  {hospital.website && (
                    <div className="sm:col-span-2">
                      <p className="text-xs font-medium text-gray-400">Website</p>
                      <a href={`https://${hospital.website.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="mt-1 text-sm font-semibold text-primary-600 hover:underline">
                        {hospital.website}
                      </a>
                    </div>
                  )}
                </div>
              )}

              {tab === 'Bank Details' && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <InfoField label="Account Name" value={p.bank?.accountName} />
                  <InfoField label="Bank Name" value={p.bank?.bankName} />
                  <InfoField label="Account Number" value={p.bank?.accountNumber} />
                  <InfoField label="IFSC Code" value={p.bank?.ifsc} />
                  <InfoField label="PAN" value={p.bank?.pan} />
                </div>
              )}
            </div>
          </Card>

          {/* Hospital card below tabs */}
          <Card className="!p-6 shadow-sm">
            <h3 className="mb-4 font-semibold text-gray-900">Clinic / Hospital Details</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoField label="Hospital Name" value={hospital.name} />
              <InfoField label="Department" value={hospital.department} />
              <InfoField label="Designation" value={hospital.designation} />
              <InfoField label="Phone" value={hospital.phone} />
              <InfoField label="Address" value={hospital.address} />
              {hospital.website && (
                <div>
                  <p className="text-xs font-medium text-gray-400">Website</p>
                  <a href={`https://${hospital.website.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="mt-1 text-sm font-semibold text-primary-600 hover:underline">
                    {hospital.website}
                  </a>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right sidebar widgets */}
        <div className="space-y-6 xl:col-span-4">
          <Card className="!p-5 shadow-sm">
            <h3 className="mb-3 font-semibold text-gray-900">Profile Completion</h3>
            <div className="mb-4">
              <div className="mb-1 flex justify-between text-sm">
                <span className="font-medium text-gray-600">Progress</span>
                <span className="font-bold text-primary-600">{p.profileCompletion ?? 0}%</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-primary-600 transition-all"
                  style={{ width: `${p.profileCompletion ?? 0}%` }}
                />
              </div>
            </div>
            <ul className="space-y-2">
              {PROFILE_COMPLETION_SECTIONS.map((section, i) => {
                const keys = ['personal', 'education', 'experience', 'certificates', 'hospital', 'bank']
                const done = p.profileSections?.[keys[i]] !== false
                return (
                  <li key={section} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className={cn('h-4 w-4 shrink-0', done ? 'text-green-500' : 'text-gray-300')} />
                    <span className={done ? 'text-gray-700' : 'text-gray-400'}>{section}</span>
                  </li>
                )
              })}
            </ul>
          </Card>

          <Card className="!p-5 shadow-sm">
            <h3 className="mb-4 font-semibold text-gray-900">Documents</h3>
            <ul className="space-y-3">
              {(p.documents || []).map((doc, i) => (
                <li key={i} className="flex items-center justify-between rounded-xl border border-gray-100 px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium text-gray-800">{doc.name}</span>
                  </div>
                  <button type="button" className="rounded-lg p-1.5 text-primary-600 hover:bg-primary-50" aria-label={`Download ${doc.name}`}>
                    <Download className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
            <button type="button" className="mt-4 w-full text-center text-sm font-semibold text-primary-600 hover:underline">
              View All Documents
            </button>
          </Card>
        </div>
      </div>
    </div>
  )
}

import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  MapPin,
  Map,
  Plus,
  Star,
  Siren,
  Phone,
  Hospital,
  Pill,
  Stethoscope,
  Loader2,
} from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import NearbyMap from '../../components/nearby/NearbyMap'
import {
  fetchNearbyFacilities,
  reverseGeocodeArea,
  getDirectionsUrl,
  haversineKm,
  NEARBY_MAX_DISTANCE_KM,
} from '../../services/medicalFacilityService'
import { EMERGENCY_CONTACT } from '../../data/medicalFacilitiesSeed'
import { useRouteContext } from '../../utils/routeContext'
import { cn } from '../../utils/helpers'

const PUBLIC_PAGE_TABS = [
  { label: 'Home', path: '/nearby', end: true },
  { label: 'Find Medicine', path: '/medicines' },
  { label: 'Health Tips', path: '/blog' },
  { label: 'User Profile', path: '/dashboard/profile', auth: true },
]

const FILTERS = [
  { id: 'all', label: 'All', icon: MapPin },
  { id: 'pharmacy', label: 'Pharmacies', icon: Pill },
  { id: 'hospital', label: 'Hospitals', icon: Hospital },
  { id: 'clinic', label: 'Clinics', icon: Stethoscope },
]

const TYPE_ICONS = {
  pharmacy: Pill,
  hospital: Hospital,
  clinic: Stethoscope,
}

function FacilityIcon({ type }) {
  const Icon = TYPE_ICONS[type] || Plus
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
      <Icon className="h-4 w-4" />
    </div>
  )
}

export default function NearbyMedical() {
  const { pathname } = useLocation()
  const { isDashboard, medicinesPath, doctorsPath, profilePath } = useRouteContext()
  const [facilities, setFacilities] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetchError, setFetchError] = useState('')
  const [locationInfo, setLocationInfo] = useState(null)
  const [filter, setFilter] = useState('all')
  const [userLocation, setUserLocation] = useState(null)
  const [locating, setLocating] = useState(false)
  const [locationError, setLocationError] = useState('')
  const watchIdRef = useRef(null)
  const lastFetchRef = useRef(null)

  const clearLocationWatch = () => {
    if (watchIdRef.current != null) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }
  }

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Location is not supported on this device.')
      return
    }

    clearLocationWatch()
    setLocating(true)
    setLocationError('')

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        })
        setLocating(false)
      },
      (err) => {
        setLocating(false)
        clearLocationWatch()
        if (err.code === err.PERMISSION_DENIED) {
          setLocationError('Location access denied. Enable it in browser settings and try again.')
        } else if (err.code === err.TIMEOUT) {
          setLocationError('Location request timed out. Please try again.')
        } else {
          setLocationError('Unable to detect your location. Please try again.')
        }
      },
      { enableHighAccuracy: true, timeout: 30000, maximumAge: 0 }
    )
  }

  useEffect(() => {
    requestLocation()
    return () => clearLocationWatch()
  }, [])

  useEffect(() => {
    if (!userLocation) {
      setFacilities([])
      setLocationInfo(null)
      lastFetchRef.current = null
      return undefined
    }

    const shouldRefetch =
      !lastFetchRef.current ||
      haversineKm(
        lastFetchRef.current.lat,
        lastFetchRef.current.lng,
        userLocation.lat,
        userLocation.lng
      ) >= 0.3

    if (!shouldRefetch) return undefined

    lastFetchRef.current = { lat: userLocation.lat, lng: userLocation.lng }
    let cancelled = false

    async function loadNearby() {
      setLoading(true)
      setFetchError('')
      try {
        const [items, area] = await Promise.all([
          fetchNearbyFacilities(userLocation.lat, userLocation.lng),
          reverseGeocodeArea(userLocation.lat, userLocation.lng),
        ])
        if (cancelled) return
        setFacilities(items)
        setLocationInfo(area)
      } catch {
        if (!cancelled) {
          setFacilities([])
          setFetchError('Unable to load nearby facilities. Please try again.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadNearby()
    return () => {
      cancelled = true
    }
  }, [userLocation])

  const sortedFacilities = useMemo(() => {
    let list = facilities
    if (filter !== 'all') list = list.filter((f) => f.type === filter)

    return [...list]
      .map((f) => ({
        ...f,
        distanceKm:
          userLocation && f.lat && f.lng
            ? haversineKm(userLocation.lat, userLocation.lng, f.lat, f.lng)
            : null,
      }))
      .sort((a, b) => {
        if (a.distanceKm != null && b.distanceKm != null) return a.distanceKm - b.distanceKm
        return (b.rating || 0) - (a.rating || 0)
      })
  }, [facilities, filter, userLocation])

  return (
    <div className={cn(!isDashboard && 'min-h-screen bg-[#eef5fc] pb-12')}>
      <div className={cn('mx-auto max-w-2xl', isDashboard ? 'py-2' : 'px-4 py-6 sm:px-6')}>
        {!isDashboard && (
          <nav className="mb-6 flex gap-1 overflow-x-auto rounded-2xl bg-white p-1.5 shadow-sm">
            {PUBLIC_PAGE_TABS.map((tab) => {
              const path = tab.label === 'User Profile' ? profilePath : tab.path
              const active = tab.end
                ? pathname === tab.path
                : pathname.startsWith(tab.path)

              return (
                <Link
                  key={tab.label}
                  to={path}
                  className={cn(
                    'shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold transition',
                    active
                      ? 'bg-[#dceeff] text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-primary-600'
                  )}
                >
                  {tab.label}
                </Link>
              )
            })}
          </nav>
        )}

        {/* Main card */}
        <Card className="!overflow-hidden !p-0 shadow-md">
          <div className="border-b border-gray-100 px-5 py-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-red-500" />
              <h1 className="text-lg font-bold text-gray-900">Nearest Medical Stores</h1>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Find nearby pharmacies, hospitals, and clinics
            </p>
          </div>

          <div className="space-y-3 px-5 pt-4">
            {locating && !userLocation && (
              <div className="flex items-center justify-center gap-2 rounded-xl bg-primary-50 py-3 text-sm text-primary-700">
                <Loader2 className="h-4 w-4 animate-spin" />
                Detecting your location…
              </div>
            )}

            {locationError && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                <p className="text-sm text-amber-800">{locationError}</p>
                <button
                  type="button"
                  onClick={requestLocation}
                  className="mt-2 text-sm font-semibold text-primary-600 hover:underline"
                >
                  Try again
                </button>
              </div>
            )}

            {!userLocation && !locating && !locationError && (
              <div className="flex items-center justify-between gap-3 rounded-xl bg-primary-50 px-4 py-3">
                <div className="flex items-center gap-2 text-sm text-primary-700">
                  <Map className="h-4 w-4 shrink-0" />
                  Enable location to sort facilities by distance
                </div>
                <button
                  type="button"
                  onClick={requestLocation}
                  className="shrink-0 rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-700"
                >
                  Use my location
                </button>
              </div>
            )}

            {fetchError && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {fetchError}
              </div>
            )}

            {userLocation && (
              <div className="rounded-xl border border-primary-100 bg-primary-50/70 px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900">Your exact location</p>
                    <p className="mt-0.5 text-sm text-primary-700">
                      {locationInfo?.label || 'Resolving address…'}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
                      {userLocation.accuracy
                        ? ` · accurate to ±${Math.round(userLocation.accuracy)} m`
                        : ''}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={requestLocation}
                    className="shrink-0 rounded-lg border border-primary-200 bg-white px-3 py-1.5 text-xs font-semibold text-primary-600 hover:bg-primary-50"
                  >
                    Refresh
                  </button>
                </div>
              </div>
            )}

            {userLocation && !loading && (
              <p className="text-xs font-medium text-primary-600">
                Showing {sortedFacilities.length} facilities within {NEARBY_MAX_DISTANCE_KM} km
                {locationInfo?.shortLabel ? ` near ${locationInfo.shortLabel}` : ' of you'}
              </p>
            )}

            <NearbyMap userLocation={userLocation} facilities={sortedFacilities} />
          </div>

          {/* Filter chips */}
          <div className="flex flex-wrap gap-2 px-5 py-4">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition',
                  filter === f.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                <f.icon className="h-3.5 w-3.5" />
                {f.label}
              </button>
            ))}
          </div>

          {/* Facility list */}
          <div className="divide-y divide-gray-100">
            {loading && (
              <div className="flex items-center justify-center gap-2 py-12 text-gray-500">
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading nearby facilities…
              </div>
            )}
            {!loading && userLocation && sortedFacilities.length === 0 && !fetchError && (
              <p className="py-12 text-center text-sm text-gray-500">
                No pharmacies, hospitals, or clinics found within {NEARBY_MAX_DISTANCE_KM} km of your
                location.
              </p>
            )}
            {!loading && !userLocation && !locating && (
              <p className="py-12 text-center text-sm text-gray-500">
                Allow location access to find medical facilities near you.
              </p>
            )}
            {sortedFacilities.map((facility) => (
              <div key={facility.id} className="flex items-center gap-3 px-5 py-4">
                <FacilityIcon type={facility.type} />
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-gray-900">{facility.name}</p>
                  <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                    {facility.distanceKm != null && (
                      <span className="font-medium text-primary-600">
                        {facility.distanceKm.toFixed(1)} km away
                      </span>
                    )}
                    {facility.distanceKm != null && facility.status && (
                      <span className="text-gray-300">·</span>
                    )}
                    {facility.status && (
                      <span className="capitalize text-green-600">{facility.status}</span>
                    )}
                    {(facility.distanceKm != null || facility.status) && facility.rating != null && (
                      <span className="text-gray-300">·</span>
                    )}
                    {facility.rating != null && (
                      <span className="inline-flex items-center gap-0.5">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        {facility.rating}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-xs text-gray-400">{facility.address}</p>
                </div>
                <a
                  href={getDirectionsUrl(facility)}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 text-sm font-semibold text-primary-600 hover:underline"
                >
                  Directions
                </a>
              </div>
            ))}
          </div>
        </Card>

        {/* Emergency section */}
        <Card className="mt-6 !p-5 shadow-md">
          <div className="mb-3 flex items-center gap-2">
            <Siren className="h-5 w-5 text-red-500" />
            <h2 className="font-bold text-red-600">{EMERGENCY_CONTACT.label}</h2>
          </div>
          <a
            href={`tel:${EMERGENCY_CONTACT.phone.replace(/\s/g, '')}`}
            className="mb-4 flex items-center gap-2 text-gray-700 hover:text-primary-600"
          >
            <Phone className="h-4 w-4 text-gray-400" />
            <span className="font-semibold">{EMERGENCY_CONTACT.phone}</span>
          </a>
          <a href={`tel:108`}>
            <Button
              variant="danger"
              size="full"
              className="!rounded-2xl !bg-[#e57373] !py-3.5 hover:!bg-[#d66565]"
            >
              <Phone className="h-4 w-4" />
              Call Now
            </Button>
          </a>
        </Card>

        {/* Quick links */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Link
            to={medicinesPath}
            className="flex items-center gap-2 rounded-2xl bg-white p-4 shadow-sm transition hover:shadow-md"
          >
            <Pill className="h-5 w-5 text-primary-600" />
            <span className="text-sm font-semibold text-gray-800">Order Medicines</span>
          </Link>
          <Link
            to={doctorsPath}
            className="flex items-center gap-2 rounded-2xl bg-white p-4 shadow-sm transition hover:shadow-md"
          >
            <Stethoscope className="h-5 w-5 text-primary-600" />
            <span className="text-sm font-semibold text-gray-800">Find Doctors</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

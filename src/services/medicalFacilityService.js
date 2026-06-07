import { collection, doc, getDocs, onSnapshot, setDoc, writeBatch } from 'firebase/firestore'
import { db } from '../config/firebase'
import { MEDICAL_FACILITIES_SEED } from '../data/medicalFacilitiesSeed'

const mapDocs = (snap) => snap.docs.map((d) => ({ id: d.id, ...d.data() }))

export function subscribeMedicalFacilities(callback, onError) {
  return onSnapshot(
    collection(db, 'medicalFacilities'),
    (snap) => {
      const items = mapDocs(snap).sort((a, b) => (a.name || '').localeCompare(b.name || ''))
      callback(items)
    },
    (err) => onError?.(err)
  )
}

export async function seedMedicalFacilities() {
  const snap = await getDocs(collection(db, 'medicalFacilities'))
  if (!snap.empty) return { seeded: false, message: 'Medical facilities already exist' }

  const batch = writeBatch(db)
  MEDICAL_FACILITIES_SEED.forEach((facility) => {
    batch.set(doc(db, 'medicalFacilities', facility.id), facility)
  })
  await batch.commit()
  return { seeded: true, message: 'Medical facilities seeded' }
}

export function getDirectionsUrl(facility) {
  if (facility.lat && facility.lng) {
    return `https://www.google.com/maps/dir/?api=1&destination=${facility.lat},${facility.lng}`
  }
  if (facility.address) {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(facility.address)}`
  }
  return 'https://www.google.com/maps'
}

export function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export const NEARBY_SEARCH_RADIUS_KM = 15
export const NEARBY_MAX_DISTANCE_KM = 15

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter'

const OSM_TYPE_MAP = {
  pharmacy: 'pharmacy',
  chemist: 'pharmacy',
  hospital: 'hospital',
  clinic: 'clinic',
  doctors: 'clinic',
}

function osmCoords(element) {
  if (element.type === 'node') return { lat: element.lat, lng: element.lon }
  if (element.center) return { lat: element.center.lat, lng: element.center.lon }
  return null
}

function osmFacilityType(tags = {}) {
  const key = tags.amenity || tags.healthcare || tags.shop
  return OSM_TYPE_MAP[key] || (tags.amenity === 'hospital' ? 'hospital' : 'clinic')
}

function osmAddress(tags = {}) {
  const parts = [
    tags['addr:housenumber'],
    tags['addr:street'],
    tags['addr:suburb'],
    tags['addr:city'] || tags['addr:town'] || tags['addr:village'],
    tags['addr:state'],
  ].filter(Boolean)
  return parts.join(', ') || tags['addr:full'] || ''
}

function mapOsmElement(element) {
  const coords = osmCoords(element)
  if (!coords?.lat || !coords?.lng) return null
  const tags = element.tags || {}
  const name = tags.name || tags['name:en'] || tags.operator
  if (!name) return null

  return {
    id: `osm-${element.type}-${element.id}`,
    name,
    type: osmFacilityType(tags),
    address: osmAddress(tags),
    lat: coords.lat,
    lng: coords.lng,
    status: 'open',
    phone: tags.phone || tags['contact:phone'] || '',
    hours: tags.opening_hours || '',
    source: 'osm',
  }
}

function dedupeFacilities(facilities) {
  const kept = []
  for (const facility of facilities) {
    if (!facility.lat || !facility.lng) continue
    const duplicate = kept.find(
      (item) =>
        item.name.toLowerCase() === facility.name.toLowerCase() &&
        haversineKm(item.lat, item.lng, facility.lat, facility.lng) < 0.15
    )
    if (!duplicate) kept.push(facility)
  }
  return kept
}

function withinRadius(facilities, lat, lng, maxKm) {
  return facilities.filter((f) => {
    if (!f.lat || !f.lng) return false
    return haversineKm(lat, lng, f.lat, f.lng) <= maxKm
  })
}

async function queryOverpass(lat, lng, radiusMeters) {
  const query = `
    [out:json][timeout:25];
    (
      nwr["amenity"="pharmacy"](around:${radiusMeters},${lat},${lng});
      nwr["amenity"="hospital"](around:${radiusMeters},${lat},${lng});
      nwr["amenity"="clinic"](around:${radiusMeters},${lat},${lng});
      nwr["amenity"="doctors"](around:${radiusMeters},${lat},${lng});
      nwr["healthcare"="pharmacy"](around:${radiusMeters},${lat},${lng});
      nwr["healthcare"="hospital"](around:${radiusMeters},${lat},${lng});
      nwr["healthcare"="clinic"](around:${radiusMeters},${lat},${lng});
      nwr["shop"="chemist"](around:${radiusMeters},${lat},${lng});
    );
    out center 50;
  `

  const response = await fetch(OVERPASS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `data=${encodeURIComponent(query)}`,
  })

  if (!response.ok) throw new Error('Overpass request failed')

  const data = await response.json()
  return (data.elements || []).map(mapOsmElement).filter(Boolean)
}

async function queryPhoton(lat, lng, keyword, type) {
  const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(keyword)}&lat=${lat}&lon=${lng}&limit=20`
  const response = await fetch(url)
  if (!response.ok) throw new Error('Photon request failed')

  const data = await response.json()
  return (data.features || [])
    .map((feature) => {
      const props = feature.properties || {}
      const [lng, latCoord] = feature.geometry?.coordinates || []
      if (!latCoord || !lng) return null
      const name = props.name
      if (!name) return null

      return {
        id: `photon-${props.osm_id || `${latCoord}-${lng}`}`,
        name,
        type,
        address: [props.street, props.city, props.state, props.country].filter(Boolean).join(', '),
        lat: latCoord,
        lng,
        status: 'open',
        source: 'photon',
      }
    })
    .filter(Boolean)
}

export async function fetchNearbyFacilities(lat, lng, maxKm = NEARBY_MAX_DISTANCE_KM) {
  const radiusMeters = Math.round(maxKm * 1000)
  let facilities = []

  try {
    facilities = await queryOverpass(lat, lng, radiusMeters)
  } catch {
    const photonResults = await Promise.all([
      queryPhoton(lat, lng, 'pharmacy', 'pharmacy'),
      queryPhoton(lat, lng, 'hospital', 'hospital'),
      queryPhoton(lat, lng, 'clinic', 'clinic'),
    ])
    facilities = photonResults.flat()
  }

  const snap = await getDocs(collection(db, 'medicalFacilities'))
  const curated = withinRadius(mapDocs(snap), lat, lng, maxKm)

  return dedupeFacilities(withinRadius([...facilities, ...curated], lat, lng, maxKm))
}

function isInTelanganaBounds(lat, lng) {
  return lat >= 15.8 && lat <= 19.95 && lng >= 77.2 && lng <= 81.85
}

function normalizeIndianState(state, iso, lat, lng) {
  if (iso === 'IN-TG') return 'Telangana'
  if (iso === 'IN-AP') return 'Andhra Pradesh'
  if (isInTelanganaBounds(lat, lng) && state && /andhra/i.test(state)) return 'Telangana'
  return state || null
}

function uniqueParts(parts) {
  const seen = new Set()
  return parts.filter((part) => {
    const key = part.trim().toLowerCase()
    if (!key || seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export async function reverseGeocodeArea(lat, lng) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1&zoom=18`
    const response = await fetch(url, {
      headers: {
        'Accept-Language': 'en',
        'User-Agent': 'MedMitra/1.0 (nearby medical facilities)',
      },
    })
    if (!response.ok) return null

    const data = await response.json()
    const address = data.address || {}
    const state = normalizeIndianState(address.state, address['ISO3166-2'], lat, lng)
    const locality =
      address.neighbourhood ||
      address.suburb ||
      address.locality ||
      address.residential ||
      address.quarter
    const city =
      address.city ||
      address.town ||
      address.village ||
      address.municipality ||
      address.hamlet
    const district = address.state_district || address.county

    const label = uniqueParts([locality, city || district, state]).join(', ')
    const shortLabel = uniqueParts([locality || city || district, state]).join(', ')

    return {
      label: label || data.display_name?.split(',').slice(0, 3).join(', ').trim() || null,
      shortLabel: shortLabel || label,
      state,
      locality,
      city: city || district,
      coordinates: { lat, lng },
    }
  } catch {
    return null
  }
}

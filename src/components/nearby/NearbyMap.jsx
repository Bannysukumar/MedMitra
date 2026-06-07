import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const userIcon = L.divIcon({
  className: 'nearby-user-marker',
  html: `
    <div style="position:relative;width:22px;height:22px">
      <div style="position:absolute;inset:0;border-radius:50%;background:rgba(37,99,235,.25);animation:nearby-pulse 2s infinite"></div>
      <div style="position:absolute;top:4px;left:4px;width:14px;height:14px;border-radius:50%;background:#2563eb;border:3px solid #fff;box-shadow:0 0 0 2px #2563eb"></div>
    </div>
  `,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
})

const TYPE_COLORS = {
  pharmacy: '#16a34a',
  hospital: '#dc2626',
  clinic: '#7c3aed',
}

function facilityIcon(type) {
  const color = TYPE_COLORS[type] || '#2563eb'
  return L.divIcon({
    className: '',
    html: `<div style="width:12px;height:12px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.35)"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  })
}

function zoomForAccuracy(accuracy) {
  if (!accuracy || accuracy > 500) return 15
  if (accuracy > 200) return 16
  if (accuracy > 80) return 17
  return 18
}

export default function NearbyMap({ userLocation, facilities }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const markersRef = useRef([])
  const accuracyCircleRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    mapRef.current = L.map(containerRef.current, {
      zoomControl: true,
      attributionControl: true,
    }).setView([20.5937, 78.9629], 5)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 19,
    }).addTo(mapRef.current)

    if (!document.getElementById('nearby-map-pulse-style')) {
      const style = document.createElement('style')
      style.id = 'nearby-map-pulse-style'
      style.textContent = `
        @keyframes nearby-pulse {
          0% { transform: scale(0.85); opacity: 0.9; }
          70% { transform: scale(1.8); opacity: 0; }
          100% { transform: scale(1.8); opacity: 0; }
        }
      `
      document.head.appendChild(style)
    }

    return () => {
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    markersRef.current.forEach((m) => map.removeLayer(m))
    markersRef.current = []

    if (accuracyCircleRef.current) {
      map.removeLayer(accuracyCircleRef.current)
      accuracyCircleRef.current = null
    }

    if (userLocation) {
      const userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
        .addTo(map)
        .bindPopup('<strong>You are here</strong>')
      markersRef.current.push(userMarker)

      if (userLocation.accuracy) {
        accuracyCircleRef.current = L.circle([userLocation.lat, userLocation.lng], {
          radius: Math.max(userLocation.accuracy, 25),
          color: '#2563eb',
          fillColor: '#2563eb',
          fillOpacity: 0.12,
          weight: 2,
          dashArray: '4 4',
        }).addTo(map)
      }

      map.setView(
        [userLocation.lat, userLocation.lng],
        zoomForAccuracy(userLocation.accuracy),
        { animate: true }
      )
    }

    facilities.forEach((facility) => {
      if (!facility.lat || !facility.lng) return
      const marker = L.marker([facility.lat, facility.lng], {
        icon: facilityIcon(facility.type),
      })
        .addTo(map)
        .bindPopup(
          `<strong>${facility.name}</strong><br/>${facility.address || ''}${
            facility.distanceKm != null ? `<br/>${facility.distanceKm.toFixed(1)} km away` : ''
          }`
        )
      markersRef.current.push(marker)
    })

    setTimeout(() => map.invalidateSize(), 100)
  }, [userLocation, facilities])

  return (
    <div
      ref={containerRef}
      className="h-56 w-full rounded-2xl border border-primary-100 sm:h-72"
      aria-label="Map showing your location and nearby medical facilities"
    />
  )
}

import { useLocation } from 'react-router-dom'

export function useRouteContext() {
  const { pathname } = useLocation()
  const isDashboard = pathname.startsWith('/dashboard')

  return {
    isDashboard,
    nearbyPath: isDashboard ? '/dashboard/nearby' : '/nearby',
    doctorsPath: isDashboard ? '/dashboard/doctors' : '/doctors',
    doctorDetailPath: (id) =>
      isDashboard ? `/dashboard/doctors/${id}` : `/doctors/${id}`,
    medicinesPath: isDashboard ? '/dashboard/medicines' : '/medicines',
    profilePath: isDashboard ? '/dashboard/profile' : '/login',
  }
}

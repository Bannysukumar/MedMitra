import { useState, useEffect } from 'react'
import {
  subscribeMedicines,
  subscribeUserOrders,
  subscribeAllOrders,
  subscribeUserPrescriptions,
  subscribeAllPrescriptions,
  subscribeUsers,
  subscribeBlogPosts,
  subscribeFaqs,
  subscribeTeam,
  subscribeTestimonials,
  subscribePricing,
  subscribeUserAddresses,
  subscribeUserNotifications,
  getSiteStats,
} from '../services/firestoreService'
import {
  subscribeSupportTickets,
  subscribeAuditLogs,
  subscribeAnnouncements,
  subscribeEmailTemplates,
  subscribeSecurityLogs,
  subscribePlatformSettings,
  subscribeAllSessions,
} from '../services/adminService'

export function useFirestoreSubscription(subscribeFn, deps = [], { skip = false } = {}) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(!skip)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (skip) {
      setData([])
      setLoading(false)
      setError(null)
      return
    }

    setLoading(true)
    setError(null)

    const unsub = subscribeFn(
      (items) => {
        setData(items)
        setLoading(false)
      },
      (err) => {
        console.error('Firestore error:', err)
        setError(err)
        setLoading(false)
      }
    )

    return () => unsub?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skip, ...deps])

  return { data, loading, error }
}

export function useFirestoreDoc(subscribeFn, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    const unsub = subscribeFn(
      (doc) => {
        setData(doc)
        setLoading(false)
      },
      (err) => {
        setError(err)
        setLoading(false)
      }
    )
    return () => unsub?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { data, loading, error }
}

export function useMedicines() {
  return useFirestoreSubscription((onData, onError) => subscribeMedicines(onData, onError), [])
}

export function useUserOrders(userId) {
  return useFirestoreSubscription(
    (onData, onError) => subscribeUserOrders(userId, onData, onError),
    [userId],
    { skip: !userId }
  )
}

export function useAllOrders() {
  return useFirestoreSubscription((onData, onError) => subscribeAllOrders(onData, onError), [])
}

export function useUserPrescriptions(userId) {
  return useFirestoreSubscription(
    (onData, onError) => subscribeUserPrescriptions(userId, onData, onError),
    [userId],
    { skip: !userId }
  )
}

export function useAllPrescriptions() {
  return useFirestoreSubscription((onData, onError) => subscribeAllPrescriptions(onData, onError), [])
}

export function useUsers() {
  return useFirestoreSubscription((onData, onError) => subscribeUsers(onData, onError), [])
}

export function useBlogPosts() {
  return useFirestoreSubscription((onData, onError) => subscribeBlogPosts(onData, onError), [])
}

export function useFaqs() {
  return useFirestoreSubscription((onData, onError) => subscribeFaqs(onData, onError), [])
}

export function useTeam() {
  return useFirestoreSubscription((onData, onError) => subscribeTeam(onData, onError), [])
}

export function useTestimonials() {
  return useFirestoreSubscription((onData, onError) => subscribeTestimonials(onData, onError), [])
}

export function usePricing() {
  return useFirestoreSubscription((onData, onError) => subscribePricing(onData, onError), [])
}

export function useUserAddresses(userId) {
  return useFirestoreSubscription(
    (onData, onError) => subscribeUserAddresses(userId, onData, onError),
    [userId],
    { skip: !userId }
  )
}

export function useUserNotifications(userId) {
  return useFirestoreSubscription(
    (onData, onError) => subscribeUserNotifications(userId, onData, onError),
    [userId],
    { skip: !userId }
  )
}

export function useSupportTickets() {
  return useFirestoreSubscription((onData, onError) => subscribeSupportTickets(onData, onError), [])
}

export function useAuditLogs() {
  return useFirestoreSubscription((onData, onError) => subscribeAuditLogs(onData, onError), [])
}

export function useAnnouncements() {
  return useFirestoreSubscription((onData, onError) => subscribeAnnouncements(onData, onError), [])
}

export function useEmailTemplates() {
  return useFirestoreSubscription((onData, onError) => subscribeEmailTemplates(onData, onError), [])
}

export function useSecurityLogs() {
  return useFirestoreSubscription((onData, onError) => subscribeSecurityLogs(onData, onError), [])
}

export function usePlatformSettings() {
  return useFirestoreDoc((onData, onError) => subscribePlatformSettings(onData, onError), [])
}

export function useAllSessions() {
  return useFirestoreSubscription((onData, onError) => subscribeAllSessions(onData, onError), [])
}

export function useSiteStats() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getSiteStats()
      .then((data) => {
        setStats(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Site stats error:', err)
        setError(err)
        setLoading(false)
      })
  }, [])

  return { stats, loading, error }
}

export function useAdminData() {
  const users = useUsers()
  const orders = useAllOrders()
  const medicines = useMedicines()
  const prescriptions = useAllPrescriptions()
  const tickets = useSupportTickets()
  const sessions = useAllSessions()

  const loading =
    users.loading ||
    orders.loading ||
    medicines.loading ||
    prescriptions.loading ||
    tickets.loading ||
    sessions.loading

  return {
    users: users.data,
    orders: orders.data,
    medicines: medicines.data,
    prescriptions: prescriptions.data,
    tickets: tickets.data,
    sessions: sessions.data,
    loading,
  }
}

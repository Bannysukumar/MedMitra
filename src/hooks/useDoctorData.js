import { useState, useEffect } from 'react'
import {
  subscribeDoctorProfile,
  subscribeDoctorAppointments,
  subscribeDoctorPatients,
  subscribeDoctorStats,
} from '../services/doctorService'

function useDoctorSubscription(subscribeFn, doctorId) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(!!doctorId)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!doctorId) {
      setData(null)
      setLoading(false)
      return undefined
    }

    setLoading(true)
    const unsub = subscribeFn(
      doctorId,
      (result) => {
        setData(result)
        setLoading(false)
      },
      (err) => {
        setError(err)
        setLoading(false)
      }
    )
    return () => unsub?.()
  }, [doctorId])

  return { data, loading, error }
}

export function useDoctorProfile(doctorId) {
  return useDoctorSubscription(subscribeDoctorProfile, doctorId)
}

export function useDoctorAppointments(doctorId) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(!!doctorId)

  useEffect(() => {
    if (!doctorId) {
      setData([])
      setLoading(false)
      return undefined
    }
    setLoading(true)
    const unsub = subscribeDoctorAppointments(
      doctorId,
      (items) => {
        setData(items)
        setLoading(false)
      },
      () => setLoading(false)
    )
    return () => unsub?.()
  }, [doctorId])

  return { data, loading }
}

export function useDoctorPatients(doctorId) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(!!doctorId)

  useEffect(() => {
    if (!doctorId) {
      setData([])
      setLoading(false)
      return undefined
    }
    setLoading(true)
    const unsub = subscribeDoctorPatients(
      doctorId,
      (items) => {
        setData(items)
        setLoading(false)
      },
      () => setLoading(false)
    )
    return () => unsub?.()
  }, [doctorId])

  return { data, loading }
}

export function useDoctorStats(doctorId) {
  return useDoctorSubscription(subscribeDoctorStats, doctorId)
}

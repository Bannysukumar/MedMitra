import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  setDoc,
  writeBatch,
} from 'firebase/firestore'
import { db } from '../config/firebase'
import { DEFAULT_DOCTOR_PROFILE } from '../data/doctorProfileSeed'

const mapDocs = (snap) => snap.docs.map((d) => ({ id: d.id, ...d.data() }))

export function subscribePublicDoctors(callback, onError) {
  return onSnapshot(
    collection(db, 'doctors'),
    (snap) => {
      const items = mapDocs(snap)
        .filter((d) => d.isPublic !== false)
        .sort((a, b) => (a.fullName || '').localeCompare(b.fullName || ''))
      callback(items)
    },
    (err) => onError?.(err)
  )
}

export function subscribeDoctorProfile(doctorId, callback, onError) {
  if (!doctorId) return () => {}
  return onSnapshot(
    doc(db, 'doctors', doctorId),
    (snap) => callback(snap.exists() ? { id: snap.id, ...snap.data() } : null),
    (err) => onError?.(err)
  )
}

export function subscribeDoctorAppointments(doctorId, callback, onError) {
  if (!doctorId) return () => {}
  return onSnapshot(
    query(collection(db, 'doctorAppointments'), where('doctorId', '==', doctorId)),
    (snap) => {
      const items = mapDocs(snap).sort((a, b) => (a.time || '').localeCompare(b.time || ''))
      callback(items)
    },
    (err) => onError?.(err)
  )
}

export function subscribeDoctorPatients(doctorId, callback, onError) {
  if (!doctorId) return () => {}
  return onSnapshot(
    query(collection(db, 'doctorPatients'), where('doctorId', '==', doctorId)),
    (snap) => {
      const items = mapDocs(snap).sort((a, b) => (b.lastVisit || '').localeCompare(a.lastVisit || ''))
      callback(items)
    },
    (err) => onError?.(err)
  )
}

export function subscribeDoctorStats(doctorId, callback, onError) {
  if (!doctorId) return () => {}
  return onSnapshot(
    doc(db, 'doctorStats', doctorId),
    (snap) => callback(snap.exists() ? snap.data() : null),
    (err) => onError?.(err)
  )
}

export async function seedDoctorDashboard(doctorId, profile = {}) {
  const apptSnap = await getDocs(
    query(collection(db, 'doctorAppointments'), where('doctorId', '==', doctorId))
  )
  if (!apptSnap.empty) return { seeded: false, message: 'Doctor dashboard already has data' }

  const batch = writeBatch(db)
  const today = new Date().toISOString().slice(0, 10)

  batch.set(doc(db, 'doctors', doctorId), {
    ...DEFAULT_DOCTOR_PROFILE,
    fullName: profile.fullName || DEFAULT_DOCTOR_PROFILE.fullName,
    specialty: profile.specialty || DEFAULT_DOCTOR_PROFILE.specialty,
    avatar: profile.avatar || '',
    isPremium: false,
    updatedAt: new Date().toISOString(),
  }, { merge: true })

  batch.set(doc(db, 'doctorStats', doctorId), {
    totalPatients: 1248,
    patientsGrowth: 12,
    todayAppointments: 24,
    upcomingToday: 8,
    pendingPrescriptions: 6,
    weeklyAppointments: 96,
    weeklyNewPatients: 32,
    weeklyPrescriptions: 58,
    appointmentTrend: [12, 18, 14, 22, 19, 25, 24],
    patientsTrend: [4, 6, 5, 8, 7, 9, 8],
    prescriptionsTrend: [6, 9, 7, 11, 10, 12, 11],
    updatedAt: new Date().toISOString(),
  })

  const appointments = [
    { time: '09:00 AM', patientName: 'Rahul Sharma', age: 28, gender: 'Male', status: 'confirmed', avatar: '' },
    { time: '09:30 AM', patientName: 'Anita Desai', age: 34, gender: 'Female', status: 'in_progress', avatar: '' },
    { time: '10:00 AM', patientName: 'Vikram Singh', age: 45, gender: 'Male', status: 'waiting', avatar: '' },
    { time: '10:30 AM', patientName: 'Sneha Patel', age: 29, gender: 'Female', status: 'upcoming', avatar: '' },
    { time: '11:00 AM', patientName: 'Amit Kumar', age: 52, gender: 'Male', status: 'upcoming', avatar: '' },
  ]

  appointments.forEach((a, i) => {
    batch.set(doc(db, 'doctorAppointments', `appt-${doctorId}-${i + 1}`), {
      ...a,
      doctorId,
      date: today,
      endTime: i === 0 ? '09:20 AM' : undefined,
    })
  })

  const patients = [
    { name: 'Priya Mehta', reason: 'Fever, Headache', lastVisit: '2024-05-05', avatar: '' },
    { name: 'Sanjay Gupta', reason: 'Migraine', lastVisit: '2024-05-04', avatar: '' },
    { name: 'Neha Reddy', reason: 'Skin Rash', lastVisit: '2024-05-03', avatar: '' },
    { name: 'Karan Joshi', reason: 'Back Pain', lastVisit: '2024-05-02', avatar: '' },
  ]

  patients.forEach((p, i) => {
    batch.set(doc(db, 'doctorPatients', `patient-${doctorId}-${i + 1}`), {
      ...p,
      doctorId,
    })
  })

  await batch.commit()
  return { seeded: true, message: 'Doctor dashboard initialized' }
}

export async function seedDoctorProfile(doctorId, overrides = {}) {
  const ref = doc(db, 'doctors', doctorId)
  const snap = await getDoc(ref)
  if (snap.exists() && snap.data()?.personal?.fullName) {
    return { seeded: false, message: 'Doctor profile already complete' }
  }

  await setDoc(ref, {
    ...DEFAULT_DOCTOR_PROFILE,
    ...overrides,
    updatedAt: new Date().toISOString(),
  }, { merge: true })

  return { seeded: true, message: 'Doctor profile initialized' }
}

export async function saveDoctorProfile(doctorId, data) {
  await setDoc(doc(db, 'doctors', doctorId), { ...data, updatedAt: new Date().toISOString() }, { merge: true })
}

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  writeBatch,
  deleteField,
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../config/firebase'
import {
  medicines,
  blogPosts,
  faqs,
  teamMembers,
  testimonials,
  pricingPlans,
  stats,
} from '../data/seedData'

/** Legacy demo IDs from old signup seeding — used only for cleanup. */
const LEGACY_DEMO_ORDER_IDS = new Set(['ORD-001', 'ORD-002', 'ORD-003', 'ORD-004'])
const LEGACY_DEMO_RX_IDS = new Set(['rx-1', 'rx-2'])
const LEGACY_DEMO_RX_NAMES = new Set(['Prescription_May2024.pdf', 'Prescription_April2024.jpg'])
const LEGACY_DEMO_ADDRESS_IDS = new Set(['addr-1', 'addr-2'])
const LEGACY_DEMO_NOTIFICATION_IDS = new Set(['n1', 'n2', 'n3'])
const LEGACY_DEMO_HEALTH = { bloodGroup: 'O+', lastCheckup: '2024-04-20' }

function isLegacyDemoOrder(docId, data) {
  const orderRef = data?.id || docId
  return LEGACY_DEMO_ORDER_IDS.has(docId) || LEGACY_DEMO_ORDER_IDS.has(orderRef)
}

function isLegacyDemoPrescription(docId, data) {
  return (
    LEGACY_DEMO_RX_IDS.has(docId) ||
    LEGACY_DEMO_RX_NAMES.has(data?.name) ||
    data?.url === '#'
  )
}

function isLegacyDemoAddress(docId, data) {
  return (
    LEGACY_DEMO_ADDRESS_IDS.has(docId) ||
    data?.address?.includes('123 Health Street') ||
    data?.address?.includes('456 Corporate Park')
  )
}

function isLegacyDemoNotification(docId, data) {
  return (
    LEGACY_DEMO_NOTIFICATION_IDS.has(docId) ||
    data?.message?.includes('ORD-001') ||
    data?.title === 'New Medicine Available'
  )
}

function isLegacyDemoHealthRecord(hr) {
  return (
    hr &&
    hr.bloodGroup === LEGACY_DEMO_HEALTH.bloodGroup &&
    hr.lastCheckup === LEGACY_DEMO_HEALTH.lastCheckup &&
    Array.isArray(hr.allergies) &&
    hr.allergies.includes('Penicillin')
  )
}

async function commitBatchDeletes(refs) {
  if (!refs.length) return 0
  const batch = writeBatch(db)
  refs.forEach((ref) => batch.delete(ref))
  await batch.commit()
  return refs.length
}

const mapDocs = (snap) => snap.docs.map((d) => ({ id: d.id, ...d.data() }))

function listenCollection(ref, callback, onError) {
  return onSnapshot(
    ref,
    (snap) => callback(mapDocs(snap)),
    (err) => onError?.(err)
  )
}

export function subscribeMedicines(callback, onError) {
  return onSnapshot(
    collection(db, 'medicines'),
    (snap) => {
      const items = mapDocs(snap).sort((a, b) => (a.name || '').localeCompare(b.name || ''))
      callback(items)
    },
    (err) => onError?.(err)
  )
}

export function subscribeUserOrders(userId, callback, onError) {
  if (!userId) return () => {}
  return onSnapshot(
    query(collection(db, 'orders'), where('userId', '==', userId)),
    (snap) => {
      const items = mapDocs(snap).sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
      callback(items)
    },
    (err) => onError?.(err)
  )
}

export function subscribeAllOrders(callback, onError) {
  return onSnapshot(
    collection(db, 'orders'),
    (snap) => {
      const items = mapDocs(snap).sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
      callback(items)
    },
    (err) => onError?.(err)
  )
}

export function subscribeUserPrescriptions(userId, callback, onError) {
  if (!userId) return () => {}
  return onSnapshot(
    query(collection(db, 'prescriptions'), where('userId', '==', userId)),
    (snap) => {
      const items = mapDocs(snap).sort((a, b) => (b.uploadedAt || '').localeCompare(a.uploadedAt || ''))
      callback(items)
    },
    (err) => onError?.(err)
  )
}

export function subscribeAllPrescriptions(callback, onError) {
  return onSnapshot(
    collection(db, 'prescriptions'),
    (snap) => {
      const items = mapDocs(snap).sort((a, b) => (b.uploadedAt || '').localeCompare(a.uploadedAt || ''))
      callback(items)
    },
    (err) => onError?.(err)
  )
}

export function subscribeUsers(callback, onError) {
  return onSnapshot(
    collection(db, 'users'),
    (snap) => {
      const items = mapDocs(snap).sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
      callback(items)
    },
    (err) => onError?.(err)
  )
}

export function subscribeBlogPosts(callback, onError) {
  return onSnapshot(
    collection(db, 'blog'),
    (snap) => {
      const items = mapDocs(snap).sort((a, b) => (b.date || '').localeCompare(a.date || ''))
      callback(items)
    },
    (err) => onError?.(err)
  )
}

export function subscribeFaqs(callback, onError) {
  return listenCollection(collection(db, 'faqs'), callback, onError)
}

export function subscribeTeam(callback, onError) {
  return listenCollection(collection(db, 'team'), callback, onError)
}

export function subscribeTestimonials(callback, onError) {
  return listenCollection(collection(db, 'testimonials'), callback, onError)
}

export function subscribePricing(callback, onError) {
  return listenCollection(collection(db, 'pricing'), callback, onError)
}

export async function getSiteStats() {
  const snap = await getDoc(doc(db, 'siteStats', 'main'))
  return snap.exists() ? snap.data() : null
}

export function subscribeUserAddresses(userId, callback, onError) {
  if (!userId) return () => {}
  return listenCollection(collection(db, `users/${userId}/addresses`), callback, onError)
}

export function subscribeUserNotifications(userId, callback, onError) {
  if (!userId) return () => {}
  return onSnapshot(
    collection(db, `users/${userId}/notifications`),
    (snap) => {
      const items = mapDocs(snap).sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
      callback(items)
    },
    (err) => onError?.(err)
  )
}

export async function submitSupportTicket(data) {
  await addDoc(collection(db, 'supportTickets'), {
    ...data,
    status: 'open',
    createdAt: new Date().toISOString(),
  })
}

export async function createOrder(userId, orderData) {
  const docRef = await addDoc(collection(db, 'orders'), {
    ...orderData,
    userId,
    status: 'pending',
    createdAt: new Date().toISOString(),
  })
  await addDoc(collection(db, `users/${userId}/notifications`), {
    title: 'Order Placed',
    message: `Your order ${orderData.id} has been placed successfully.`,
    type: 'order',
    read: false,
    createdAt: new Date().toISOString(),
  })
  return docRef.id
}

export async function updateOrderStatus(orderId, status) {
  await updateDoc(doc(db, 'orders', orderId), { status })
}

export async function updatePrescriptionStatus(rxId, status) {
  await updateDoc(doc(db, 'prescriptions', rxId), { status })
}

export async function uploadPrescription(userId, file) {
  const path = `prescriptions/${userId}/${Date.now()}_${file.name}`
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, file)
  const url = await getDownloadURL(storageRef)
  const docRef = await addDoc(collection(db, 'prescriptions'), {
    userId,
    name: file.name,
    url,
    status: 'uploaded',
    uploadedAt: new Date().toISOString(),
  })
  return docRef.id
}

export async function addAddress(userId, address) {
  const docRef = await addDoc(collection(db, `users/${userId}/addresses`), address)
  return docRef.id
}

export async function deleteAddress(userId, addressId) {
  await deleteDoc(doc(db, `users/${userId}/addresses`, addressId))
}

export async function updateUserProfile(userId, data) {
  await setDoc(doc(db, 'users', userId), data, { merge: true })
}

export async function markNotificationRead(userId, notifId) {
  await updateDoc(doc(db, `users/${userId}/notifications`, notifId), { read: true })
}

export async function markAllNotificationsRead(userId, notifications) {
  const batch = writeBatch(db)
  notifications.filter((n) => !n.read).forEach((n) => {
    batch.update(doc(db, `users/${userId}/notifications`, n.id), { read: true })
  })
  await batch.commit()
}

export async function getUserOrderCount(userId) {
  const snap = await getDocs(query(collection(db, 'orders'), where('userId', '==', userId)))
  return snap.size
}

export async function seedDatabase() {
  const medSnap = await getDocs(collection(db, 'medicines'))
  if (!medSnap.empty) return { seeded: false, message: 'Database already has data' }

  const batch = writeBatch(db)

  medicines.forEach((med) => {
    batch.set(doc(db, 'medicines', med.id), med)
  })

  blogPosts.forEach((post) => {
    batch.set(doc(db, 'blog', String(post.id)), post)
  })

  faqs.forEach((faq, i) => {
    batch.set(doc(db, 'faqs', `faq-${i + 1}`), faq)
  })

  teamMembers.forEach((member) => {
    batch.set(doc(db, 'team', String(member.id)), member)
  })

  testimonials.forEach((t) => {
    batch.set(doc(db, 'testimonials', String(t.id)), t)
  })

  pricingPlans.forEach((plan) => {
    batch.set(doc(db, 'pricing', plan.id), plan)
  })

  batch.set(doc(db, 'siteStats', 'main'), stats)

  await batch.commit()
  return { seeded: true, message: 'Catalog and content seeded successfully' }
}

/** Remove auto-seeded demo records from a user account (legacy signup behavior). */
export async function clearDemoUserData(userId) {
  if (!userId) return { removed: 0 }

  let removed = 0

  const ordersSnap = await getDocs(query(collection(db, 'orders'), where('userId', '==', userId)))
  const orderRefs = ordersSnap.docs
    .filter((d) => isLegacyDemoOrder(d.id, d.data()))
    .map((d) => d.ref)
  removed += await commitBatchDeletes(orderRefs)

  const rxSnap = await getDocs(query(collection(db, 'prescriptions'), where('userId', '==', userId)))
  const rxRefs = rxSnap.docs
    .filter((d) => isLegacyDemoPrescription(d.id, d.data()))
    .map((d) => d.ref)
  removed += await commitBatchDeletes(rxRefs)

  const addrSnap = await getDocs(collection(db, `users/${userId}/addresses`))
  const addrRefs = addrSnap.docs
    .filter((d) => isLegacyDemoAddress(d.id, d.data()))
    .map((d) => d.ref)
  removed += await commitBatchDeletes(addrRefs)

  const notifSnap = await getDocs(collection(db, `users/${userId}/notifications`))
  const notifRefs = notifSnap.docs
    .filter((d) => isLegacyDemoNotification(d.id, d.data()))
    .map((d) => d.ref)
  removed += await commitBatchDeletes(notifRefs)

  const userRef = doc(db, 'users', userId)
  const userSnap = await getDoc(userRef)
  if (userSnap.exists() && isLegacyDemoHealthRecord(userSnap.data().healthRecord)) {
    await updateDoc(userRef, { healthRecord: deleteField() })
    removed += 1
  }

  return { removed }
}

// ——— Admin CRUD ———

export async function saveMedicine(id, data) {
  const docId = id || `med-${Date.now()}`
  await setDoc(doc(db, 'medicines', docId), { ...data, id: docId }, { merge: true })
  return docId
}

export async function deleteMedicine(id) {
  await deleteDoc(doc(db, 'medicines', id))
}

export async function deleteOrder(orderId) {
  await deleteDoc(doc(db, 'orders', orderId))
}

export async function deletePrescription(rxId) {
  await deleteDoc(doc(db, 'prescriptions', rxId))
}

export async function updateAdminUser(uid, data) {
  await setDoc(doc(db, 'users', uid), data, { merge: true })
}

export async function saveBlogPost(id, data) {
  const docId = id != null ? String(id) : String(Date.now())
  await setDoc(doc(db, 'blog', docId), { ...data, id: data.id ?? docId }, { merge: true })
  return docId
}

export async function deleteBlogPost(id) {
  await deleteDoc(doc(db, 'blog', String(id)))
}

export async function saveFaq(id, data) {
  const docId = id || `faq-${Date.now()}`
  await setDoc(doc(db, 'faqs', docId), data, { merge: true })
  return docId
}

export async function deleteFaq(id) {
  await deleteDoc(doc(db, 'faqs', id))
}

export async function saveTeamMember(id, data) {
  const docId = id != null ? String(id) : String(Date.now())
  await setDoc(doc(db, 'team', docId), { ...data, id: data.id ?? docId }, { merge: true })
  return docId
}

export async function deleteTeamMember(id) {
  await deleteDoc(doc(db, 'team', String(id)))
}

export async function saveTestimonial(id, data) {
  const docId = id != null ? String(id) : String(Date.now())
  await setDoc(doc(db, 'testimonials', docId), { ...data, id: data.id ?? docId }, { merge: true })
  return docId
}

export async function deleteTestimonial(id) {
  await deleteDoc(doc(db, 'testimonials', String(id)))
}

export async function savePricingPlan(id, data) {
  const docId = id || `plan-${Date.now()}`
  await setDoc(doc(db, 'pricing', docId), { ...data, id: docId }, { merge: true })
  return docId
}

export async function deletePricingPlan(id) {
  await deleteDoc(doc(db, 'pricing', id))
}

export async function saveSiteStats(data) {
  await setDoc(doc(db, 'siteStats', 'main'), data, { merge: true })
}

import {
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  onSnapshot,
  writeBatch,
} from 'firebase/firestore'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth, db } from '../config/firebase'

const mapDocs = (snap) => snap.docs.map((d) => ({ id: d.id, ...d.data() }))

export function subscribeCollection(name, callback, onError, sortFn) {
  return onSnapshot(
    collection(db, name),
    (snap) => {
      const items = mapDocs(snap)
      callback(sortFn ? items.sort(sortFn) : items)
    },
    (err) => onError?.(err)
  )
}

export function subscribeSupportTickets(callback, onError) {
  return subscribeCollection(
    'supportTickets',
    callback,
    onError,
    (a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')
  )
}

export function subscribeAuditLogs(callback, onError) {
  return subscribeCollection(
    'auditLogs',
    callback,
    onError,
    (a, b) => (b.timestamp || '').localeCompare(a.timestamp || '')
  )
}

export function subscribeAnnouncements(callback, onError) {
  return subscribeCollection(
    'announcements',
    callback,
    onError,
    (a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')
  )
}

export function subscribeEmailTemplates(callback, onError) {
  return subscribeCollection('emailTemplates', callback, onError)
}

export function subscribeSecurityLogs(callback, onError) {
  return subscribeCollection(
    'securityLogs',
    callback,
    onError,
    (a, b) => (b.timestamp || '').localeCompare(a.timestamp || '')
  )
}

export function subscribePlatformSettings(callback, onError) {
  return onSnapshot(
    doc(db, 'platformSettings', 'main'),
    (snap) => callback(snap.exists() ? snap.data() : null),
    (err) => onError?.(err)
  )
}

export function subscribeAllSessions(callback, onError) {
  return onSnapshot(
    collection(db, 'sessions'),
    (snap) => callback(mapDocs(snap)),
    (err) => onError?.(err)
  )
}

export async function logAdminAction(admin, { action, module, details = '' }) {
  if (!admin?.uid) return
  await addDoc(collection(db, 'auditLogs'), {
    adminId: admin.uid,
    adminName: admin.displayName || admin.fullName || admin.email || 'Admin',
    action,
    module,
    details,
    timestamp: new Date().toISOString(),
    ipAddress: 'client',
  })
}

export async function logSecurityEvent(event, details = {}) {
  await addDoc(collection(db, 'securityLogs'), {
    event,
    ...details,
    timestamp: new Date().toISOString(),
  })
}

export async function updateUserAccount(uid, data, admin, actionLabel) {
  await setDoc(doc(db, 'users', uid), data, { merge: true })

  if (data.role === 'doctor') {
    const userSnap = await getDoc(doc(db, 'users', uid))
    const userData = userSnap.data() || {}
    await setDoc(
      doc(db, 'doctors', uid),
      {
        fullName: data.fullName || userData.fullName || 'Doctor',
        specialty: userData.specialty || 'Physician',
        email: userData.email || '',
        isPublic: true,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    )
  }

  if (admin) {
    await logAdminAction(admin, { action: actionLabel, module: 'users', details: uid })
  }
}

export async function deleteUserAccount(uid, admin) {
  await deleteDoc(doc(db, 'users', uid))
  if (admin) {
    await logAdminAction(admin, { action: 'User Deleted', module: 'users', details: uid })
  }
}

export async function addUserNote(uid, note, admin) {
  const userRef = doc(db, 'users', uid)
  const snap = await getDoc(userRef)
  const existing = snap.data()?.adminNotes || []
  const entry = {
    id: `note-${Date.now()}`,
    text: note,
    createdAt: new Date().toISOString(),
    adminName: admin?.displayName || admin?.email || 'Admin',
  }
  await updateDoc(userRef, { adminNotes: [entry, ...existing] })
  await logAdminAction(admin, { action: 'Note Added', module: 'users', details: note })
}

export async function forceLogoutUser(uid, admin) {
  await updateDoc(doc(db, 'users', uid), { forceLogoutAt: new Date().toISOString() })
  await logAdminAction(admin, { action: 'Force Logout', module: 'security', details: uid })
}

export async function resetUserPassword(email, admin) {
  await sendPasswordResetEmail(auth, email)
  await logAdminAction(admin, { action: 'Password Reset Sent', module: 'security', details: email })
}

export async function revokeUserSessions(uid, admin) {
  const batch = writeBatch(db)
  const snap = await getDoc(doc(db, 'users', uid))
  if (snap.exists()) {
    batch.update(doc(db, 'users', uid), { sessionsRevokedAt: new Date().toISOString() })
  }
  await batch.commit()
  await logAdminAction(admin, { action: 'Sessions Revoked', module: 'security', details: uid })
}

export async function archiveMedicine(id, archived = true, admin) {
  await updateDoc(doc(db, 'medicines', id), { archived, updatedAt: new Date().toISOString() })
  await logAdminAction(admin, {
    action: archived ? 'Medicine Archived' : 'Medicine Restored',
    module: 'medicines',
    details: id,
  })
}

export async function bulkImportMedicines(rows, admin) {
  const batch = writeBatch(db)
  rows.forEach((row, i) => {
    const id = row.id || `med-${Date.now()}-${i}`
    batch.set(doc(db, 'medicines', id), { ...row, id, archived: false }, { merge: true })
  })
  await batch.commit()
  await logAdminAction(admin, {
    action: 'Bulk Import Medicines',
    module: 'medicines',
    details: `${rows.length} items`,
  })
  return rows.length
}

export async function requestPrescriptionReupload(rxId, admin) {
  await updateDoc(doc(db, 'prescriptions', rxId), {
    status: 'rejected',
    reuploadRequested: true,
    reviewedAt: new Date().toISOString(),
  })
  await logAdminAction(admin, { action: 'Reupload Requested', module: 'prescriptions', details: rxId })
}

export async function updateSupportTicket(id, data, admin) {
  await updateDoc(doc(db, 'supportTickets', id), { ...data, updatedAt: new Date().toISOString() })
  await logAdminAction(admin, { action: 'Ticket Updated', module: 'support', details: id })
}

export async function saveAnnouncement(id, data, admin) {
  const docId = id || `ann-${Date.now()}`
  await setDoc(doc(db, 'announcements', docId), { ...data, id: docId, updatedAt: new Date().toISOString() }, { merge: true })
  await logAdminAction(admin, { action: id ? 'Announcement Updated' : 'Announcement Created', module: 'announcements', details: data.title })
  return docId
}

export async function deleteAnnouncement(id, admin) {
  await deleteDoc(doc(db, 'announcements', id))
  await logAdminAction(admin, { action: 'Announcement Deleted', module: 'announcements', details: id })
}

export async function saveEmailTemplate(id, data, admin) {
  const docId = id || `email-${Date.now()}`
  await setDoc(doc(db, 'emailTemplates', docId), { ...data, id: docId, updatedAt: new Date().toISOString() }, { merge: true })
  await logAdminAction(admin, { action: id ? 'Email Template Updated' : 'Email Template Created', module: 'emails', details: data.name })
  return docId
}

export async function deleteEmailTemplate(id, admin) {
  await deleteDoc(doc(db, 'emailTemplates', id))
  await logAdminAction(admin, { action: 'Email Template Deleted', module: 'emails', details: id })
}

export async function savePlatformSettings(data, admin) {
  await setDoc(doc(db, 'platformSettings', 'main'), { ...data, updatedAt: new Date().toISOString() }, { merge: true })
  await logAdminAction(admin, { action: 'Settings Updated', module: 'settings', details: 'platformSettings' })
}

export async function sendAdminNotification({ userIds, title, message, type = 'system' }, admin) {
  const targets = userIds?.length ? userIds : []
  if (!targets.length) return 0
  const batch = writeBatch(db)
  targets.forEach((uid) => {
    const ref = doc(collection(db, `users/${uid}/notifications`))
    batch.set(ref, {
      title,
      message,
      type,
      read: false,
      createdAt: new Date().toISOString(),
      fromAdmin: true,
    })
  })
  await batch.commit()
  await logAdminAction(admin, {
    action: 'Notification Sent',
    module: 'notifications',
    details: `${targets.length} user(s): ${title}`,
  })
  return targets.length
}

export async function broadcastNotification({ title, message, type = 'system' }, allUserIds, admin) {
  return sendAdminNotification({ userIds: allUserIds, title, message, type }, admin)
}

export async function flagHealthRecord(uid, flagged, admin, note = '') {
  await setDoc(
    doc(db, 'users', uid),
    {
      healthRecordFlagged: flagged,
      healthRecordFlagNote: note || '',
      ...(flagged ? { healthRecordVerified: false } : {}),
    },
    { merge: true }
  )
  await logAdminAction(admin, {
    action: flagged ? 'Health Record Flagged' : 'Health Record Unflagged',
    module: 'health-records',
    details: uid,
  })
}

export async function verifyHealthRecord(uid, verified, admin) {
  await setDoc(doc(db, 'users', uid), { healthRecordVerified: verified }, { merge: true })
  await logAdminAction(admin, {
    action: verified ? 'Health Record Verified' : 'Health Record Unverified',
    module: 'health-records',
    details: uid,
  })
}

export async function recordAdminLogin(admin, success = true) {
  await logSecurityEvent(success ? 'admin_login_success' : 'admin_login_failed', {
    adminId: admin?.uid,
    email: admin?.email,
  })
}

export function parseMedicineCsv(text) {
  const lines = text.trim().split(/\r?\n/).filter(Boolean)
  if (lines.length < 2) return []
  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase())
  return lines.slice(1).map((line) => {
    const values = line.split(',').map((v) => v.trim())
    const row = {}
    headers.forEach((h, i) => {
      row[h] = values[i]
    })
    return {
      name: row.name || '',
      genericName: row.genericname || row['generic name'] || row.name || '',
      brand: row.brand || row['brand name'] || '',
      category: row.category || 'Pain Relief',
      description: row.description || '',
      usage: row.usage || '',
      dosage: row.dosage || '',
      sideEffects: row.sideeffects || row['side effects'] || '',
      warnings: row.warnings || '',
      stock: Number(row.stock) || 0,
      price: Number(row.price) || 0,
      discount: Number(row.discount) || 0,
      rating: Number(row.rating) || 4.5,
      image: row.image || '',
    }
  }).filter((r) => r.name)
}

export function downloadJson(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function downloadInvoice(order) {
  const html = `<!DOCTYPE html><html><head><title>Invoice ${order.id}</title></head><body style="font-family:sans-serif;padding:40px">
<h1>MedMitra Invoice</h1>
<p><strong>Order:</strong> ${order.id}</p>
<p><strong>Date:</strong> ${order.createdAt || ''}</p>
<p><strong>Status:</strong> ${order.status}</p>
<p><strong>Payment:</strong> ${order.paymentStatus || 'paid'} (${order.payment || '—'})</p>
<hr/>
${(order.items || []).map((i) => `<p>${i.name} × ${i.qty || 1} — ₹${i.price || 0}</p>`).join('')}
<hr/>
<p><strong>Total: ₹${order.total || 0}</strong></p>
</body></html>`
  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `invoice-${order.id}.html`
  a.click()
  URL.revokeObjectURL(url)
}

const admin = require('firebase-admin')
const path = require('path')
const fs = require('fs')

const keyPath = path.join(__dirname, '..', '..', 'medmitra-46913-firebase-adminsdk-fbsvc-711f4a8ae5.json')
const serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf8'))

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })
const db = admin.firestore()

const DEMO_ORDER_IDS = new Set(['ORD-001', 'ORD-002', 'ORD-003', 'ORD-004'])
const DEMO_RX_IDS = new Set(['rx-1', 'rx-2'])
const DEMO_RX_NAMES = new Set(['Prescription_May2024.pdf', 'Prescription_April2024.jpg'])
const DEMO_ADDR_IDS = new Set(['addr-1', 'addr-2'])
const DEMO_NOTIF_IDS = new Set(['n1', 'n2', 'n3'])

function isDemoOrder(docId, data) {
  const ref = data?.id || docId
  return DEMO_ORDER_IDS.has(docId) || DEMO_ORDER_IDS.has(ref)
}

function isDemoRx(docId, data) {
  return DEMO_RX_IDS.has(docId) || DEMO_RX_NAMES.has(data?.name) || data?.url === '#'
}

function isDemoAddr(docId, data) {
  return (
    DEMO_ADDR_IDS.has(docId) ||
    data?.address?.includes('123 Health Street') ||
    data?.address?.includes('456 Corporate Park')
  )
}

function isDemoNotif(docId, data) {
  return (
    DEMO_NOTIF_IDS.has(docId) ||
    data?.message?.includes('ORD-001') ||
    data?.title === 'New Medicine Available'
  )
}

function isDemoHealth(hr) {
  return (
    hr &&
    hr.bloodGroup === 'O+' &&
    hr.lastCheckup === '2024-04-20' &&
    Array.isArray(hr.allergies) &&
    hr.allergies.includes('Penicillin')
  )
}

async function clearUserDemoData(userId) {
  let removed = 0

  const orders = await db.collection('orders').where('userId', '==', userId).get()
  for (const doc of orders.docs) {
    if (isDemoOrder(doc.id, doc.data())) {
      await doc.ref.delete()
      removed += 1
    }
  }

  const rx = await db.collection('prescriptions').where('userId', '==', userId).get()
  for (const doc of rx.docs) {
    if (isDemoRx(doc.id, doc.data())) {
      await doc.ref.delete()
      removed += 1
    }
  }

  const addrs = await db.collection(`users/${userId}/addresses`).get()
  for (const doc of addrs.docs) {
    if (isDemoAddr(doc.id, doc.data())) {
      await doc.ref.delete()
      removed += 1
    }
  }

  const notifs = await db.collection(`users/${userId}/notifications`).get()
  for (const doc of notifs.docs) {
    if (isDemoNotif(doc.id, doc.data())) {
      await doc.ref.delete()
      removed += 1
    }
  }

  const userRef = db.collection('users').doc(userId)
  const userSnap = await userRef.get()
  if (userSnap.exists && isDemoHealth(userSnap.data().healthRecord)) {
    await userRef.update({ healthRecord: admin.firestore.FieldValue.delete() })
    removed += 1
  }

  return removed
}

async function main() {
  const usersSnap = await db.collection('users').get()
  let total = 0

  for (const userDoc of usersSnap.docs) {
    const count = await clearUserDemoData(userDoc.id)
    if (count > 0) {
      console.log(`User ${userDoc.id}: removed ${count} demo records`)
      total += count
    }
  }

  console.log(`Done. Removed ${total} demo records across all users.`)
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Cleanup failed:', err)
    process.exit(1)
  })

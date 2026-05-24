import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import {
  medicines,
  blogPosts,
  faqs,
  teamMembers,
  testimonials,
  pricingPlans,
  stats,
} from '../src/data/mockData.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const keyPath = join(__dirname, '..', '..', 'medmitra-46913-firebase-adminsdk-fbsvc-711f4a8ae5.json')
const serviceAccount = JSON.parse(readFileSync(keyPath, 'utf8'))

initializeApp({ credential: cert(serviceAccount) })
const db = getFirestore()

async function seed() {
  const medSnap = await db.collection('medicines').limit(1).get()
  if (!medSnap.empty) {
    console.log('Database already seeded — skipping.')
    return
  }

  const batch = db.batch()

  medicines.forEach((med) => {
    batch.set(db.collection('medicines').doc(med.id), med)
  })
  blogPosts.forEach((post) => {
    batch.set(db.collection('blog').doc(String(post.id)), post)
  })
  faqs.forEach((faq, i) => {
    batch.set(db.collection('faqs').doc(`faq-${i + 1}`), faq)
  })
  teamMembers.forEach((member) => {
    batch.set(db.collection('team').doc(String(member.id)), member)
  })
  testimonials.forEach((t) => {
    batch.set(db.collection('testimonials').doc(String(t.id)), t)
  })
  pricingPlans.forEach((plan) => {
    batch.set(db.collection('pricing').doc(plan.id), plan)
  })
  batch.set(db.collection('siteStats').doc('main'), stats)

  await batch.commit()
  console.log('Firestore seeded successfully.')
}

seed().catch((err) => {
  console.error('Seed failed:', err.message)
  process.exit(1)
})

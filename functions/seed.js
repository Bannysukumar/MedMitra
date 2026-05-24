const admin = require('firebase-admin')
const path = require('path')
const fs = require('fs')

const keyPath = path.join(__dirname, '..', '..', 'medmitra-46913-firebase-adminsdk-fbsvc-711f4a8ae5.json')
const serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf8'))

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })
const db = admin.firestore()

async function seed() {
  const {
    medicines,
    blogPosts,
    faqs,
    teamMembers,
    testimonials,
    pricingPlans,
    stats,
  } = await import('../src/data/seedData.js')

  const medSnap = await db.collection('medicines').limit(1).get()
  if (!medSnap.empty) {
    console.log('Database already seeded — skipping.')
    return
  }

  const batch = db.batch()

  medicines.forEach((med) => batch.set(db.collection('medicines').doc(med.id), med))
  blogPosts.forEach((post) => batch.set(db.collection('blog').doc(String(post.id)), post))
  faqs.forEach((faq, i) => batch.set(db.collection('faqs').doc(`faq-${i + 1}`), faq))
  teamMembers.forEach((m) => batch.set(db.collection('team').doc(String(m.id)), m))
  testimonials.forEach((t) => batch.set(db.collection('testimonials').doc(String(t.id)), t))
  pricingPlans.forEach((plan) => batch.set(db.collection('pricing').doc(plan.id), plan))
  batch.set(db.collection('siteStats').doc('main'), stats)

  await batch.commit()
  console.log(`Seeded ${medicines.length} medicines and site content.`)
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Seed failed:', err.message)
    process.exit(1)
  })

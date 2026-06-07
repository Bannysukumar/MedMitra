const admin = require('firebase-admin')
const path = require('path')
const fs = require('fs')

const keyPath = path.join(__dirname, '..', '..', 'medmitra-46913-firebase-adminsdk-fbsvc-711f4a8ae5.json')
const serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf8'))

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })

const EMAIL = 'doctor@medmitra.com'
const PASSWORD = 'DocMitra2026!'
const FULL_NAME = 'Dr. Arjun Sharma'

async function createDoctor() {
  let user

  try {
    user = await admin.auth().getUserByEmail(EMAIL)
    await admin.auth().updateUser(user.uid, {
      password: PASSWORD,
      displayName: FULL_NAME,
      emailVerified: true,
    })
    console.log('Updated existing doctor user.')
  } catch (err) {
    if (err.code !== 'auth/user-not-found') throw err
    user = await admin.auth().createUser({
      email: EMAIL,
      password: PASSWORD,
      displayName: FULL_NAME,
      emailVerified: true,
    })
    console.log('Created doctor user.')
  }

  await admin.firestore().doc(`users/${user.uid}`).set({
    uid: user.uid,
    fullName: FULL_NAME,
    email: EMAIL,
    role: 'doctor',
    specialty: 'Cardiologist',
    plan: 'premium',
    accountStatus: 'active',
    createdAt: new Date().toISOString(),
  }, { merge: true })

  await admin.firestore().doc(`doctors/${user.uid}`).set({
    fullName: FULL_NAME,
    specialty: 'Cardiologist',
    rating: 4.8,
    reviewCount: 320,
    isPremium: false,
    updatedAt: new Date().toISOString(),
  }, { merge: true })

  console.log('\n--- Doctor Portal Credentials ---')
  console.log('Email:', EMAIL)
  console.log('Password:', PASSWORD)
  console.log('Login URL: https://medmitra-46913.web.app/doctor/login')
  console.log('UID:', user.uid)
}

createDoctor().catch(console.error)

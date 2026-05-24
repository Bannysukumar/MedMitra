const admin = require('firebase-admin')
const crypto = require('crypto')
const path = require('path')
const fs = require('fs')

const keyPath = path.join(__dirname, '..', '..', 'medmitra-46913-firebase-adminsdk-fbsvc-711f4a8ae5.json')
const serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf8'))

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })

const ADMIN_EMAIL = 'admin@medmitra.com'
const ADMIN_NAME = 'MedMitra Admin'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || crypto.randomBytes(12).toString('base64url')

async function createAdmin() {
  let user

  try {
    user = await admin.auth().getUserByEmail(ADMIN_EMAIL)
    await admin.auth().updateUser(user.uid, {
      password: ADMIN_PASSWORD,
      displayName: ADMIN_NAME,
      emailVerified: true,
    })
    console.log('Updated existing admin user.')
  } catch (err) {
    if (err.code !== 'auth/user-not-found') throw err
    user = await admin.auth().createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      displayName: ADMIN_NAME,
      emailVerified: true,
    })
    console.log('Created new admin user.')
  }

  await admin.firestore().collection('users').doc(user.uid).set(
    {
      uid: user.uid,
      fullName: ADMIN_NAME,
      email: ADMIN_EMAIL,
      role: 'admin',
      plan: 'premium',
      createdAt: new Date().toISOString(),
    },
    { merge: true }
  )

  console.log(JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD, uid: user.uid }, null, 2))
}

createAdmin()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Failed:', err.message)
    process.exit(1)
  })

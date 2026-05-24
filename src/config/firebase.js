import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getFunctions } from 'firebase/functions'
import { getAnalytics, isSupported } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyCOZ-bRqxwvNZJM4eBZvGgdEaeyDw3eO9A',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'medmitra-46913.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'medmitra-46913',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'medmitra-46913.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '445709776752',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:445709776752:web:3ff7e0a2ce818214df01b5',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-515MX6JG4S',
}

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId)

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)
const functions = getFunctions(app)

let analytics = null
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) analytics = getAnalytics(app)
  })
}

export { app, auth, db, storage, functions, analytics }
export const googleProvider = new GoogleAuthProvider()
export const facebookProvider = new FacebookAuthProvider()

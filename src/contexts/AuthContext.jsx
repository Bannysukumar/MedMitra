import { createContext, useContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db, googleProvider, facebookProvider, isFirebaseConfigured } from '../config/firebase'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

const DEMO_USER = {
  uid: 'demo-user',
  email: 'demo@medmitra.com',
  displayName: 'John Doe',
  role: 'user',
  plan: 'premium',
  photoURL: null,
  phone: '+91 98765 43210',
  emailVerified: true,
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      const stored = localStorage.getItem('medmitra-demo-user')
      if (stored) {
        const parsed = JSON.parse(stored)
        setUser(parsed)
        setProfile(parsed)
      }
      setLoading(false)
      return
    }

    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
        const profileDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
        if (profileDoc.exists()) setProfile(profileDoc.data())
        else setProfile({ role: 'user', plan: 'free' })
      } else {
        setUser(null)
        setProfile(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  const signup = async ({ fullName, email, phone, password }) => {
    if (!isFirebaseConfigured) {
      const demo = { ...DEMO_USER, displayName: fullName, email, phone }
      localStorage.setItem('medmitra-demo-user', JSON.stringify(demo))
      setUser(demo)
      setProfile(demo)
      toast.success('Account created (demo mode)')
      return demo
    }

    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(cred.user, { displayName: fullName })
    await sendEmailVerification(cred.user)
    await setDoc(doc(db, 'users', cred.user.uid), {
      uid: cred.user.uid,
      fullName,
      email,
      phone,
      role: 'user',
      plan: 'free',
      createdAt: new Date().toISOString(),
    })
    toast.success('Account created! Please verify your email.')
    return cred.user
  }

  const login = async ({ email, password, remember }) => {
    if (!isFirebaseConfigured) {
      const demo = { ...DEMO_USER, email }
      if (remember) localStorage.setItem('medmitra-demo-user', JSON.stringify(demo))
      setUser(demo)
      setProfile(demo)
      toast.success('Welcome back!')
      return demo
    }
    const cred = await signInWithEmailAndPassword(auth, email, password)
    toast.success('Welcome back!')
    return cred.user
  }

  const socialLogin = async (provider) => {
    if (!isFirebaseConfigured) {
      const demo = DEMO_USER
      localStorage.setItem('medmitra-demo-user', JSON.stringify(demo))
      setUser(demo)
      setProfile(demo)
      toast.success('Signed in with social (demo)')
      return demo
    }
    const prov = provider === 'google' ? googleProvider : facebookProvider
    const cred = await signInWithPopup(auth, prov)
    const exists = await getDoc(doc(db, 'users', cred.user.uid))
    if (!exists.exists()) {
      await setDoc(doc(db, 'users', cred.user.uid), {
        uid: cred.user.uid,
        fullName: cred.user.displayName,
        email: cred.user.email,
        role: 'user',
        plan: 'free',
        createdAt: new Date().toISOString(),
      })
    }
    toast.success('Welcome!')
    return cred.user
  }

  const logout = async () => {
    if (!isFirebaseConfigured) {
      localStorage.removeItem('medmitra-demo-user')
      setUser(null)
      setProfile(null)
      toast.success('Logged out')
      return
    }
    await signOut(auth)
    toast.success('Logged out')
  }

  const resetPassword = async (email) => {
    if (!isFirebaseConfigured) {
      toast.success('Reset link sent (demo mode)')
      return
    }
    await sendPasswordResetEmail(auth, email)
    toast.success('Password reset email sent!')
  }

  const isAdmin = profile?.role === 'admin'
  const displayName = user?.displayName || profile?.fullName || 'User'
  const plan = profile?.plan || 'free'

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signup,
        login,
        socialLogin,
        logout,
        resetPassword,
        isAdmin,
        displayName,
        plan,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

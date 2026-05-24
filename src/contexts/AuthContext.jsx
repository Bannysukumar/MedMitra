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
import { auth, db, googleProvider, facebookProvider } from '../config/firebase'
import { clearDemoUserData } from '../services/firestoreService'
import { useCartStore, useWishlistStore } from '../stores/useStore'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadProfile = async (firebaseUser) => {
    const profileDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
    if (profileDoc.exists()) return profileDoc.data()
    return { role: 'user', plan: 'free' }
  }

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
        try {
          await clearDemoUserData(firebaseUser.uid)
        } catch (err) {
          console.error('Demo data cleanup failed:', err)
        }
        const data = await loadProfile(firebaseUser)
        setProfile(data)
      } else {
        setUser(null)
        setProfile(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  const signup = async ({ fullName, email, phone, password }) => {
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

  const login = async ({ email, password }) => {
    const cred = await signInWithEmailAndPassword(auth, email, password)
    toast.success('Welcome back!')
    return cred.user
  }

  const adminLogin = async ({ email, password }) => {
    const cred = await signInWithEmailAndPassword(auth, email, password)
    const profileDoc = await getDoc(doc(db, 'users', cred.user.uid))
    if (profileDoc.data()?.role !== 'admin') {
      await signOut(auth)
      throw new Error('Admin access only. Set role to "admin" in Firestore users collection.')
    }
    toast.success('Welcome, Admin!')
    return cred.user
  }

  const socialLogin = async (provider) => {
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
    useCartStore.getState().clearCart()
    useWishlistStore.setState({ items: [] })
    await signOut(auth)
    toast.success('Logged out')
  }

  const resetPassword = async (email) => {
    await sendPasswordResetEmail(auth, email)
    toast.success('Password reset email sent!')
  }

  const updateUserProfile = async (data) => {
    if (!user) return
    await setDoc(doc(db, 'users', user.uid), data, { merge: true })
    if (data.fullName) await updateProfile(user, { displayName: data.fullName })
    setProfile((prev) => ({ ...prev, ...data }))
    toast.success('Profile updated successfully')
  }

  const refreshProfile = async () => {
    if (!user) return
    const data = await loadProfile(user)
    setProfile(data)
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
        adminLogin,
        socialLogin,
        logout,
        resetPassword,
        updateUserProfile,
        refreshProfile,
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

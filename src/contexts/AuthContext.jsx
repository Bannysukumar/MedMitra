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
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore'
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
        if (data.accountStatus === 'blocked' || data.accountStatus === 'suspended') {
          await signOut(auth)
          toast.error(
            data.accountStatus === 'blocked'
              ? 'Your account has been blocked. Contact support.'
              : 'Your account is suspended. Contact support.'
          )
          setUser(null)
          setProfile(null)
          setLoading(false)
          return
        }
        setProfile(data)
        await setDoc(
          doc(db, 'users', firebaseUser.uid),
          { lastActivity: new Date().toISOString(), lastLoginAt: new Date().toISOString() },
          { merge: true }
        )
      } else {
        setUser(null)
        setProfile(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  useEffect(() => {
    if (!user?.uid) return undefined
    const unsub = onSnapshot(doc(db, 'users', user.uid), (snap) => {
      if (!snap.exists()) return
      const data = snap.data()
      setProfile((prev) => ({ ...prev, ...data }))
      if (data.accountStatus === 'blocked' || data.accountStatus === 'suspended') {
        signOut(auth)
        toast.error('Your account access has been revoked.')
      }
      if (data.forceLogoutAt && data.lastLoginAt && data.forceLogoutAt > data.lastLoginAt) {
        signOut(auth)
        toast.error('You have been logged out by an administrator.')
      }
    })
    return unsub
  }, [user?.uid])

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

  const doctorLogin = async ({ email, password }) => {
    const cred = await signInWithEmailAndPassword(auth, email, password)
    const profileDoc = await getDoc(doc(db, 'users', cred.user.uid))
    const role = profileDoc.data()?.role
    if (role !== 'doctor' && role !== 'admin') {
      await signOut(auth)
      throw new Error('Doctor access only. Set role to "doctor" in Firestore users collection.')
    }
    toast.success('Welcome, Doctor!')
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
  const isDoctor = profile?.role === 'doctor' || profile?.role === 'admin'
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
        doctorLogin,
        socialLogin,
        logout,
        resetPassword,
        updateUserProfile,
        refreshProfile,
        isAdmin,
        isDoctor,
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

import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Skeleton from '../components/ui/Skeleton'

export default function AdminRoute({ children }) {
  const { isAdmin, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#f8fafc] p-8">
        <div className="w-full max-w-md space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}

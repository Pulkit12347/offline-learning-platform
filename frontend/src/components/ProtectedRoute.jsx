import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function FullPageMessage({ children }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 text-slate-600">
      {children}
    </div>
  )
}

function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, isAdmin, initializing } = useAuth()
  const location = useLocation()

  if (initializing) {
    return <FullPageMessage>Loading…</FullPageMessage>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requireAdmin && !isAdmin) {
    return (
      <FullPageMessage>
        You don’t have access to this page.
      </FullPageMessage>
    )
  }

  return children
}

export default ProtectedRoute

/**
 * @file ProtectedRoute.jsx
 * @description Route guard component that protects authenticated pages.
 *              Redirects unauthenticated users to /login.
 *              Shows a full-page loading spinner while auth state is being determined.
 *              Renders the app shell (Sidebar + Header) around authenticated content.
 */
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import Sidebar from './Sidebar'
import Header from './Header'

export default function ProtectedRoute() {
  const { user, isLoading } = useAuth()

  // Wait for token validation before deciding what to render
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <LoadingSpinner size="lg" message="Verifying session..." />
      </div>
    )
  }

  // Not authenticated — redirect to login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Authenticated — render full app shell
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

/**
 * @file Header.jsx
 * @description Top application header bar.
 *              Displays the current page context, logged-in user email, and logout button.
 */
import { useAuth } from '@/context/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'
import { LogOut, User } from 'lucide-react'

// Map route paths to human-readable page titles
const pageTitles = {
  '/dashboard': 'Dashboard',
  '/bulk-run': 'Bulk Payroll Run',
  '/single-employee': 'Single Employee',
  '/template': 'Download Template',
}

export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Resolve page title — fallback for dynamic routes like /results/:id
  const pageTitle =
    pageTitles[location.pathname] ||
    (location.pathname.startsWith('/results') ? 'Payroll Results' : 'MoTek Payroll Engine')

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
      <div>
        <h1 className="text-base font-semibold text-gray-900">{pageTitle}</h1>
        <p className="text-xs text-gray-400">Payroll Modeling Sandbox — Simulation Only</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Logged-in user */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
            <User className="h-4 w-4 text-blue-600" />
          </div>
          <span className="text-sm text-gray-600 hidden sm:block">{user?.email}</span>
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 transition-colors px-2 py-1 rounded-md hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:block">Logout</span>
        </button>
      </div>
    </header>
  )
}

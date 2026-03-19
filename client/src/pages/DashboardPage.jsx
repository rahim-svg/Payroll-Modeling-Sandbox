/**
 * @file DashboardPage.jsx
 * @description Landing page after login. Quick access to all key actions.
 */
import { useNavigate } from 'react-router-dom'
import { Users, UserPlus, Download, ArrowRight } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

const actions = [
  {
    title: 'Bulk Payroll Run',
    description: 'Upload a census file and run payroll simulation for multiple employees.',
    icon: Users,
    to: '/bulk-run',
    color: 'blue',
  },
  {
    title: 'Single Employee',
    description: 'Run a payroll simulation for a single employee or new hire.',
    icon: UserPlus,
    to: '/single-employee',
    color: 'purple',
  },
  {
    title: 'Download Template',
    description: 'Get the census Excel template with all required columns.',
    icon: Download,
    to: '/template',
    color: 'green',
  },
]

const colorMap = {
  blue: 'bg-blue-50 text-blue-600',
  purple: 'bg-purple-50 text-purple-600',
  green: 'bg-green-50 text-green-600',
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}</h2>
        <p className="text-gray-500 mt-1">What would you like to do today?</p>
      </div>

      {/* Warning banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-sm text-amber-800">
          ⚠️ <strong>Sandbox Mode:</strong> All runs are simulations only. No data is persisted. Rollfi integration is mocked.
        </p>
      </div>

      {/* Action cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {actions.map(({ title, description, icon: Icon, to, color }) => (
          <button
            key={to}
            onClick={() => navigate(to)}
            className="bg-white rounded-xl border border-gray-200 p-6 text-left hover:shadow-md hover:border-blue-200 transition-all group"
          >
            <div className={`inline-flex p-3 rounded-xl ${colorMap[color]} mb-4`}>
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-500 mb-4">{description}</p>
            <div className="flex items-center text-sm font-medium text-blue-600 group-hover:gap-2 transition-all">
              Get started <ArrowRight className="h-4 w-4 ml-1" />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

/**
 * @file DashboardPage.jsx
 * @description Main dashboard — entry point after login.
 *              Shows quick action cards to start a bulk run or single employee simulation.
 */
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Users, UserPlus, Download, ArrowRight, Info } from 'lucide-react'

const quickActions = [
  {
    title: 'Bulk Payroll Run',
    description: 'Upload a payroll census file and run Normal vs Hybrid payroll modeling for multiple employees.',
    icon: Users,
    color: 'blue',
    to: '/bulk-run',
    cta: 'Start Bulk Run',
  },
  {
    title: 'Single Employee',
    description: 'Model payroll for a single employee or new hire using manual entry or a single record upload.',
    icon: UserPlus,
    color: 'indigo',
    to: '/single-employee',
    cta: 'Single Employee Run',
  },
  {
    title: 'Download Template',
    description: 'Download the approved payroll census Excel template with all required columns pre-built.',
    icon: Download,
    color: 'green',
    to: '/template',
    cta: 'Get Template',
  },
]

const colorMap = {
  blue: { bg: 'bg-blue-50', icon: 'bg-blue-100 text-blue-600', btn: 'bg-blue-600 hover:bg-blue-700' },
  indigo: { bg: 'bg-indigo-50', icon: 'bg-indigo-100 text-indigo-600', btn: 'bg-indigo-600 hover:bg-indigo-700' },
  green: { bg: 'bg-green-50', icon: 'bg-green-100 text-green-600', btn: 'bg-green-600 hover:bg-green-700' },
}

export default function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name || user?.email?.split('@')[0]}
        </h2>
        <p className="text-gray-500 mt-1">Select an action below to begin payroll modeling.</p>
      </div>

      {/* Info Banner */}
      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-amber-800">Sandbox Environment</p>
          <p className="text-sm text-amber-700 mt-0.5">
            All runs are temporary simulations. No data is persisted. Each run is independent with no YTD tracking or payroll history.
          </p>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickActions.map(({ title, description, icon: Icon, color, to, cta }) => {
          const colors = colorMap[color]
          return (
            <div key={to} className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-4 hover:shadow-md transition-shadow">
              <div className={`h-12 w-12 rounded-xl ${colors.icon} flex items-center justify-center`}>
                <Icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-500 mt-1">{description}</p>
              </div>
              <button
                onClick={() => navigate(to)}
                className={`flex items-center justify-center gap-2 w-full py-2.5 text-white text-sm font-medium rounded-lg ${colors.btn} transition-colors`}
              >
                {cta}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )
        })}
      </div>

      {/* Workflow Summary */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">How It Works</h3>
        <ol className="space-y-3">
          {[
            'Upload your payroll census Excel file',
            'System validates and parses all employee records',
            'Python solver calculates WIMPER and SIMERP per employee using VCAMP as the savings target',
            'Both Normal and Hybrid scenarios are submitted to Rollfi for payroll calculation',
            'System retrieves payroll journal and paycheck data from Rollfi',
            'Before vs After comparison is generated with tax savings analysis',
            'Export full results to Excel for reporting',
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0 h-6 w-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">
                {i + 1}
              </span>
              <span className="text-sm text-gray-600">{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

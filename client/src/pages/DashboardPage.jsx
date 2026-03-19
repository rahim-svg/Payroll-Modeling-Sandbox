/**
 * @file DashboardPage.jsx
 * @description Main dashboard page.
 *              Entry point after login. Shows quick-start actions and workflow overview.
 */
import { useNavigate } from 'react-router-dom'
import { Users, UserPlus, Download, ArrowRight, Info } from 'lucide-react'

const actions = [
  {
    to: '/bulk-run',
    icon: Users,
    title: 'Bulk Payroll Run',
    description: 'Upload a census file to run payroll simulation for multiple employees at once.',
    color: 'blue',
    badge: 'Recommended',
  },
  {
    to: '/single-employee',
    icon: UserPlus,
    title: 'Single Employee',
    description: 'Run a payroll simulation for one employee or a new hire using a manual form.',
    color: 'green',
    badge: null,
  },
  {
    to: '/template',
    icon: Download,
    title: 'Download Template',
    description: 'Download the approved census Excel template with all required columns pre-built.',
    color: 'purple',
    badge: null,
  },
]

const colorMap = {
  blue: { card: 'border-blue-200 hover:border-blue-400', icon: 'bg-blue-100 text-blue-600', badge: 'bg-blue-100 text-blue-700' },
  green: { card: 'border-green-200 hover:border-green-400', icon: 'bg-green-100 text-green-600', badge: '' },
  purple: { card: 'border-purple-200 hover:border-purple-400', icon: 'bg-purple-100 text-purple-600', badge: '' },
}

export default function DashboardPage() {
  const navigate = useNavigate()

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Welcome to MoTek Payroll Engine</h2>
        <p className="text-gray-500 mt-1">
          Run payroll simulations to compare Normal vs Hybrid payroll strategies using WIMPER, VCAMP, and SIMERP.
        </p>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 border border-blue-200">
        <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-semibold mb-1">How it works</p>
          <ol className="space-y-0.5 text-blue-700 list-decimal list-inside">
            <li>Upload your payroll census file (or enter a single employee manually)</li>
            <li>The system validates your data and runs the Python solver for WIMPER/SIMERP</li>
            <li>Both Normal and Hybrid scenarios are submitted to Rollfi for calculation</li>
            <li>View side-by-side comparison and export results to Excel</li>
          </ol>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map(({ to, icon: Icon, title, description, color, badge }) => (
          <button
            key={to}
            onClick={() => navigate(to)}
            className={`text-left p-5 rounded-xl border-2 bg-white transition-all hover:shadow-md ${colorMap[color].card}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${colorMap[color].icon}`}>
                <Icon className="h-5 w-5" />
              </div>
              {badge && (
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colorMap[color].badge}`}>
                  {badge}
                </span>
              )}
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
            <div className="flex items-center gap-1 mt-3 text-sm font-medium text-gray-700">
              Get started <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </button>
        ))}
      </div>

      {/* Scope reminder */}
      <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
        <p className="text-xs text-gray-500 font-medium mb-1">In Scope for This Tool</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
          {[
            'Census upload & validation',
            'WIMPER / Section 125 solver',
            'SIMERP / Section 105 solver',
            'VCAMP target optimization',
            'Normal vs Hybrid comparison',
            'Rollfi payroll simulation',
            'Payroll register view',
            'Employee paycheck view',
            'Excel export',
          ].map((item) => (
            <p key={item} className="text-xs text-gray-500 flex items-center gap-1">
              <span className="text-green-500">✓</span> {item}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}

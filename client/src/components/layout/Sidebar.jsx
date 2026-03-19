/**
 * @file Sidebar.jsx
 * @description Main navigation sidebar for the app shell.
 *              Highlights the active route and shows all top-level navigation items.
 */
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Download,
  FileSpreadsheet,
} from 'lucide-react'
import { cn } from '@/utils/cn'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/bulk-run', icon: Users, label: 'Bulk Payroll Run' },
  { to: '/single-employee', icon: UserPlus, label: 'Single Employee' },
  { to: '/template', icon: Download, label: 'Download Template' },
]

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
      {/* Brand / Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center">
            <FileSpreadsheet className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm leading-none">MoTek</p>
            <p className="text-xs text-gray-400 mt-0.5">Payroll Engine</p>
          </div>
        </div>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )
            }
          >
            <Icon className="h-4 w-4 flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="px-3 py-2 rounded-lg bg-amber-50 border border-amber-200">
          <p className="text-xs font-medium text-amber-700">Sandbox Mode</p>
          <p className="text-xs text-amber-600 mt-0.5">Not for production payroll</p>
        </div>
      </div>
    </aside>
  )
}

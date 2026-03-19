/**
 * @file Sidebar.jsx
 * @description Main navigation sidebar with active route highlighting.
 */
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, UserPlus, Download, FileSpreadsheet } from 'lucide-react'
import { cn } from '@/utils/cn'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/bulk-run', icon: Users, label: 'Bulk Payroll Run' },
  { to: '/single-employee', icon: UserPlus, label: 'Single Employee' },
  { to: '/template', icon: Download, label: 'Download Template' },
]

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <FileSpreadsheet className="h-8 w-8 text-blue-600" />
          <div>
            <p className="font-bold text-gray-900 text-sm">MoTek</p>
            <p className="text-xs text-gray-500">Payroll Engine</p>
          </div>
        </div>
      </div>

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
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <p className="text-xs text-gray-400 text-center">v1.0.0 — Sandbox Mode</p>
      </div>
    </aside>
  )
}

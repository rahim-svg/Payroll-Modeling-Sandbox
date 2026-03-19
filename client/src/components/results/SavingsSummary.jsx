/**
 * @file SavingsSummary.jsx
 * @description Aggregate savings summary cards shown at the top of results.
 */
import { formatCurrency } from '@/utils/formatters'
import { TrendingDown, Users, DollarSign, CheckCircle } from 'lucide-react'

export default function SavingsSummary({ summary }) {
  if (!summary) return null

  const cards = [
    { label: 'Total Employees', value: summary.totalEmployees, icon: Users, color: 'blue' },
    { label: 'Successfully Solved', value: `${summary.solvedCount} / ${summary.totalEmployees}`, icon: CheckCircle, color: 'green' },
    { label: 'Employee Tax Savings', value: formatCurrency(summary.totalEmployeeTaxSavings), icon: TrendingDown, color: 'green' },
    { label: 'Employer Tax Savings', value: formatCurrency(summary.totalEmployerTaxSavings), icon: DollarSign, color: 'purple' },
    { label: 'Total Combined Savings', value: formatCurrency(summary.totalSavings), icon: DollarSign, color: 'emerald' },
  ]

  const colorMap = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    emerald: 'bg-emerald-50 text-emerald-600',
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {cards.map(({ label, value, icon: Icon, color }) => (
        <div key={label} className="bg-white rounded-xl border border-gray-200 p-4">
          <div className={`inline-flex p-2 rounded-lg ${colorMap[color]} mb-3`}>
            <Icon className="h-5 w-5" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-xs text-gray-500 mt-1">{label}</p>
        </div>
      ))}
    </div>
  )
}

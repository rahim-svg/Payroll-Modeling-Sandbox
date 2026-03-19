/**
 * @file SavingsSummary.jsx
 * @description Summary cards showing high-level payroll tax savings metrics.
 *              Displays total employer savings, employee savings, and run statistics.
 */
import { TrendingDown, Users, DollarSign, CheckCircle } from 'lucide-react'
import { formatCurrency } from '@/utils/formatters'

function MetricCard({ icon: Icon, label, value, color = 'blue', subtitle }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    amber: 'bg-amber-50 text-amber-600',
  }
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${colors[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
    </div>
  )
}

export default function SavingsSummary({ summary = {} }) {
  const {
    totalEmployees = 0,
    totalTaxSavings = 0,
    employerTaxSavings = 0,
    employeeTaxSavings = 0,
    solvedCount = 0,
  } = summary

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        icon={Users}
        label="Employees Processed"
        value={totalEmployees}
        subtitle={`${solvedCount} successfully solved`}
        color="blue"
      />
      <MetricCard
        icon={DollarSign}
        label="Total Tax Savings"
        value={formatCurrency(totalTaxSavings)}
        subtitle="Normal vs Hybrid comparison"
        color="green"
      />
      <MetricCard
        icon={TrendingDown}
        label="Employer Savings"
        value={formatCurrency(employerTaxSavings)}
        subtitle="Employer payroll tax reduction"
        color="purple"
      />
      <MetricCard
        icon={CheckCircle}
        label="Employee Savings"
        value={formatCurrency(employeeTaxSavings)}
        subtitle="Employee take-home improvement"
        color="amber"
      />
    </div>
  )
}

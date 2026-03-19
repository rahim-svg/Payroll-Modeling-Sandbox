/**
 * @file ResultsPage.jsx
 * @description Payroll results page.
 *              Shows before vs after comparison, payroll register, employee paychecks,
 *              and savings summary. Allows Excel export.
 */
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { runService } from '@/services/run.service'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import ComparisonTable from '@/components/results/ComparisonTable'
import PayrollRegister from '@/components/results/PayrollRegister'
import SavingsSummary from '@/components/results/SavingsSummary'
import EmployeePaycheck from '@/components/results/EmployeePaycheck'
import ExportButton from '@/components/shared/ExportButton'
import { useState } from 'react'

const TABS = [
  { key: 'comparison', label: 'Before vs After' },
  { key: 'register', label: 'Payroll Register' },
  { key: 'paychecks', label: 'Employee Paychecks' },
  { key: 'savings', label: 'Savings Summary' },
]

export default function ResultsPage() {
  const { runId } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('comparison')

  const { data, isLoading, error } = useQuery({
    queryKey: ['run-results', runId],
    queryFn: () => runService.getResults(runId),
    enabled: !!runId,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" message="Loading results..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-center">
          <p className="text-red-600 font-medium">Failed to load results</p>
          <p className="text-sm text-red-500 mt-1">{error.message}</p>
          <button onClick={() => navigate('/dashboard')} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm">
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const results = data?.results

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payroll Run Results</h2>
          <p className="text-gray-500 mt-1">Run ID: {runId} — {results?.employeeCount} employee(s) processed</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate('/bulk-run')} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            New Run
          </button>
          <ExportButton runId={runId} />
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-1">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === key
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'comparison' && <ComparisonTable data={results?.comparison} />}
        {activeTab === 'register' && <PayrollRegister data={results?.register} />}
        {activeTab === 'paychecks' && <EmployeePaycheck data={results?.paychecks} />}
        {activeTab === 'savings' && <SavingsSummary data={results?.savings} />}
      </div>
    </div>
  )
}

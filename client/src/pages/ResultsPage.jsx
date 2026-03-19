/**
 * @file ResultsPage.jsx
 * @description Payroll simulation results page.
 *              Polls run status until complete, then displays:
 *              - Summary savings cards
 *              - Before vs After comparison table
 *              - Payroll register (Normal + Hybrid tabs)
 *              - Individual employee paychecks
 *              - Export to Excel button
 */
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useRunStatus } from '@/hooks/useRunStatus'
import { runService } from '@/services/run.service'
import SavingsSummary from '@/components/results/SavingsSummary'
import ComparisonTable from '@/components/results/ComparisonTable'
import PayrollRegister from '@/components/results/PayrollRegister'
import EmployeePaycheck from '@/components/results/EmployeePaycheck'
import ExportButton from '@/components/shared/ExportButton'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import StatusBadge from '@/components/shared/StatusBadge'
import { ArrowLeft } from 'lucide-react'

export default function ResultsPage() {
  const { runId } = useParams()
  const navigate = useNavigate()
  const { status, progress, message } = useRunStatus(runId)
  const [results, setResults] = useState(null)
  const [activeEmployee, setActiveEmployee] = useState(0)
  const [activeTab, setActiveTab] = useState('comparison')
  const [loadingResults, setLoadingResults] = useState(false)

  // Fetch full results once the run is completed
  useEffect(() => {
    if (status === 'completed') {
      const fetchResults = async () => {
        try {
          setLoadingResults(true)
          const data = await runService.getResults(runId)
          setResults(data)
        } catch (err) {
          console.error('Failed to fetch results:', err)
        } finally {
          setLoadingResults(false)
        }
      }
      fetchResults()
    }
  }, [status, runId])

  const tabs = [
    { id: 'comparison', label: 'Before vs After' },
    { id: 'register', label: 'Payroll Register' },
    { id: 'paychecks', label: 'Paychecks' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Simulation Results</h2>
            <p className="text-xs text-gray-400">Run ID: {runId}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge
            status={status === 'completed' ? 'success' : status === 'failed' ? 'error' : 'running'}
            label={status || 'running'}
          />
          {status === 'completed' && <ExportButton runId={runId} />}
        </div>
      </div>

      {/* Run in progress */}
      {status !== 'completed' && status !== 'failed' && (
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="flex flex-col items-center gap-4">
            <LoadingSpinner size="lg" message={message || 'Running payroll simulation...'} />
            {/* Progress bar */}
            <div className="w-full max-w-sm">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm text-gray-600">Validating → Solving WIMPER/SIMERP → Submitting to Rollfi → Generating results</p>
              <p className="text-xs text-gray-400">This may take a few moments depending on the number of employees</p>
            </div>
          </div>
        </div>
      )}

      {/* Failed state */}
      {status === 'failed' && (
        <div className="bg-red-50 rounded-xl border border-red-200 p-6 text-center">
          <p className="text-red-700 font-semibold">Simulation Failed</p>
          <p className="text-sm text-red-500 mt-1">Please check your census file and try again.</p>
          <button
            onClick={() => navigate('/bulk-run')}
            className="mt-4 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Results */}
      {status === 'completed' && (
        <>
          {loadingResults ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" message="Loading results..." />
            </div>
          ) : results ? (
            <div className="space-y-6">
              {/* Summary cards */}
              <SavingsSummary summary={results.summary} />

              {/* Tabs */}
              <div className="bg-white rounded-xl border border-gray-200">
                <div className="flex border-b border-gray-200 px-4">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${
                        activeTab === tab.id
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="p-4">
                  {activeTab === 'comparison' && (
                    <ComparisonTable results={results.comparison || []} />
                  )}
                  {activeTab === 'register' && (
                    <PayrollRegister
                      normal={results.register?.normal || []}
                      hybrid={results.register?.hybrid || []}
                    />
                  )}
                  {activeTab === 'paychecks' && (
                    <div className="space-y-4">
                      {/* Employee selector */}
                      {results.paychecks && results.paychecks.length > 1 && (
                        <div className="flex flex-wrap gap-2">
                          {results.paychecks.map((emp, i) => (
                            <button
                              key={emp.employeeId}
                              onClick={() => setActiveEmployee(i)}
                              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                                activeEmployee === i
                                  ? 'bg-blue-600 text-white border-blue-600'
                                  : 'bg-white text-gray-600 border-gray-300 hover:border-blue-300'
                              }`}
                            >
                              {emp.employeeName}
                            </button>
                          ))}
                        </div>
                      )}
                      {results.paychecks && (
                        <EmployeePaycheck employee={results.paychecks[activeEmployee]} />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </>
      )}
    </div>
  )
}

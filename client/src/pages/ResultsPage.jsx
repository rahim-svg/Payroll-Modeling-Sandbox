/**
 * @file ResultsPage.jsx
 * @description Shows payroll simulation results.
 *              Polls run status until complete, then displays comparison data.
 */
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useRunStatus } from '@/hooks/useRunStatus'
import { runService } from '@/services/run.service'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import StatusBadge from '@/components/shared/StatusBadge'
import SavingsSummary from '@/components/results/SavingsSummary'
import ComparisonTable from '@/components/results/ComparisonTable'
import ExportButton from '@/components/shared/ExportButton'

const STATUS_MESSAGES = {
  solving: 'Running Python solver — calculating WIMPER & SIMERP...',
  submitting: 'Submitting payroll scenarios to Rollfi...',
  processing: 'Generating comparison results...',
  complete: 'Run complete!',
  failed: 'Run failed.',
}

export default function ResultsPage() {
  const { runId } = useParams()
  const { status, error: statusError } = useRunStatus(runId)
  const [results, setResults] = useState(null)
  const [fetchError, setFetchError] = useState(null)

  // Fetch results once run is complete
  useEffect(() => {
    if (status !== 'complete') return
    const fetchResults = async () => {
      try {
        const { data } = await runService.getResults(runId)
        setResults(data.results)
      } catch (err) {
        setFetchError(err.response?.data?.message || 'Failed to load results')
      }
    }
    fetchResults()
  }, [status, runId])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Simulation Results</h2>
          <p className="text-sm text-gray-500 mt-1">Run ID: {runId}</p>
        </div>
        <div className="flex items-center gap-3">
          {status && <StatusBadge status={status} />}
          {status === 'complete' && <ExportButton runId={runId} />}
        </div>
      </div>

      {/* Status / Loading */}
      {status && status !== 'complete' && status !== 'failed' && (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <LoadingSpinner size="lg" message={STATUS_MESSAGES[status] || 'Processing...'} />
        </div>
      )}

      {/* Error states */}
      {(statusError || fetchError) && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-700">{statusError || fetchError}</p>
        </div>
      )}

      {/* Results */}
      {results && (
        <>
          <SavingsSummary summary={results.summary} />

          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Payroll Register — Before vs After</h3>
              <p className="text-sm text-gray-500 mt-0.5">Normal payroll compared to hybrid strategy payroll</p>
            </div>
            <div className="p-6">
              <ComparisonTable employees={results.employees} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

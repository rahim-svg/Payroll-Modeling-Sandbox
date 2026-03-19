/**
 * @file BulkRunPage.jsx
 * @description Bulk payroll run page. Handles census upload and kicks off simulation.
 */
import { useState } from 'react'
import CensusUploader from '@/components/upload/CensusUploader'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { usePayrollRun } from '@/hooks/usePayrollRun'
import { Play } from 'lucide-react'

export default function BulkRunPage() {
  const [file, setFile] = useState(null)
  const { startBulkRun, isLoading, error, validationErrors } = usePayrollRun()

  const handleRun = async () => {
    if (!file) return
    await startBulkRun(file)
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Bulk Payroll Run</h2>
        <p className="text-gray-500 mt-1">Upload your census file to start a payroll simulation.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        <CensusUploader onFileSelect={setFile} errors={validationErrors} />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <button
          onClick={handleRun}
          disabled={!file || isLoading}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <><LoadingSpinner size="sm" /> Processing...</>
          ) : (
            <><Play className="h-4 w-4" /> Run Payroll Simulation</>
          )}
        </button>
      </div>

      <div className="bg-blue-50 rounded-xl border border-blue-100 p-4">
        <p className="text-sm text-blue-800">
          💡 Don't have the template? <a href="/template" className="font-medium underline">Download the census template</a> first.
        </p>
      </div>
    </div>
  )
}

/**
 * @file BulkRunPage.jsx
 * @description Bulk payroll run page.
 *              User uploads a census Excel file, system validates it,
 *              runs the Python solver, submits to Rollfi, and navigates to results.
 */
import { useState } from 'react'
import CensusUploader from '@/components/upload/CensusUploader'
import ValidationErrors from '@/components/upload/ValidationErrors'
import { usePayrollRun } from '@/hooks/usePayrollRun'
import { AlertCircle } from 'lucide-react'

export default function BulkRunPage() {
  const { isLoading, validationErrors, error, uploadAndRun } = usePayrollRun()
  const [dismissed, setDismissed] = useState(false)

  const handleUpload = (file) => {
    setDismissed(false)
    uploadAndRun(file)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Bulk Payroll Run</h2>
        <p className="text-sm text-gray-500 mt-1">
          Upload your payroll census Excel file. The system will validate, solve, and simulate payroll for all employees.
        </p>
      </div>

      {/* Upload steps */}
      <div className="grid grid-cols-4 gap-2">
        {['Upload Census', 'Validate Data', 'Run Solver', 'View Results'].map((step, i) => (
          <div key={step} className="text-center">
            <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 text-sm font-bold flex items-center justify-center mx-auto mb-1">
              {i + 1}
            </div>
            <p className="text-xs text-gray-500">{step}</p>
          </div>
        ))}
      </div>

      {/* Upload component */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Upload Census File</h3>
        <CensusUploader onUpload={handleUpload} isLoading={isLoading} />
      </div>

      {/* Validation errors */}
      {!dismissed && validationErrors.length > 0 && (
        <ValidationErrors errors={validationErrors} onDismiss={() => setDismissed(true)} />
      )}

      {/* General error */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Processing state */}
      {isLoading && (
        <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
          <p className="text-sm text-blue-700 font-medium">Processing your census file...</p>
          <p className="text-xs text-blue-500 mt-1">Validating data → Running Python solver → Submitting to Rollfi</p>
        </div>
      )}

      {/* Template reminder */}
      <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
        <p className="text-xs text-gray-600">
          <span className="font-semibold">Need the template?</span>{' '}
          <a href="/template" className="text-blue-600 hover:underline">Download the census template</a>{' '}
          to ensure your file has all required columns.
        </p>
      </div>
    </div>
  )
}

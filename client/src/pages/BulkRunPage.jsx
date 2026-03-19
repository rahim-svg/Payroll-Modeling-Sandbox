/**
 * @file BulkRunPage.jsx
 * @description Bulk payroll run page.
 *              Handles census file upload, validation display, run initiation,
 *              and progress tracking before redirecting to results.
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CensusUploader from '@/components/upload/CensusUploader'
import ValidationErrors from '@/components/upload/ValidationErrors'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { runService } from '@/services/run.service'

const STEPS = ['upload', 'validating', 'solving', 'submitting', 'complete']

export default function BulkRunPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState('upload')
  const [validationErrors, setValidationErrors] = useState([])
  const [statusMessage, setStatusMessage] = useState('')
  const [error, setError] = useState('')

  const handleFileUpload = async (file) => {
    try {
      setError('')
      setValidationErrors([])
      setStep('validating')
      setStatusMessage('Validating census file...')

      const result = await runService.startBulkRun(file, (status) => {
        setStep(status.step)
        setStatusMessage(status.message)
      })

      // Navigate to results page with the run ID
      navigate(`/results/${result.runId}`)
    } catch (err) {
      if (err.response?.data?.validationErrors) {
        // Field-level validation errors — show them
        setValidationErrors(err.response.data.validationErrors)
        setStep('upload')
      } else {
        setError(err.response?.data?.message || 'Run failed. Please try again.')
        setStep('upload')
      }
    }
  }

  const isRunning = ['validating', 'solving', 'submitting'].includes(step)

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Bulk Payroll Run</h2>
        <p className="text-gray-500 mt-1">Upload your payroll census file to model Normal vs Hybrid payroll scenarios.</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2">
        {[
          { key: 'upload', label: 'Upload' },
          { key: 'validating', label: 'Validate' },
          { key: 'solving', label: 'Solve' },
          { key: 'submitting', label: 'Rollfi' },
          { key: 'complete', label: 'Results' },
        ].map(({ key, label }, i) => {
          const stepIndex = STEPS.indexOf(step)
          const thisIndex = STEPS.indexOf(key)
          const isDone = stepIndex > thisIndex
          const isActive = stepIndex === thisIndex
          return (
            <div key={key} className="flex items-center gap-2 flex-1">
              <div className={`flex items-center gap-2 flex-1 ${
                i < 4 ? 'after:flex-1 after:h-px after:bg-gray-200' : ''
              }`}>
                <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  isDone ? 'bg-green-500 text-white' :
                  isActive ? 'bg-blue-600 text-white' :
                  'bg-gray-100 text-gray-400'
                }`}>
                  {i + 1}
                </div>
                <span className={`text-xs font-medium ${
                  isActive ? 'text-blue-700' : isDone ? 'text-green-700' : 'text-gray-400'
                }`}>{label}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Upload Area */}
      {step === 'upload' && (
        <CensusUploader onUpload={handleFileUpload} />
      )}

      {/* Running State */}
      {isRunning && (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 flex flex-col items-center gap-4">
          <LoadingSpinner size="lg" />
          <p className="text-sm font-medium text-gray-700">{statusMessage}</p>
          <p className="text-xs text-gray-400">This may take a moment for large census files</p>
        </div>
      )}

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <ValidationErrors errors={validationErrors} />
      )}

      {/* General Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  )
}

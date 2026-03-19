/**
 * @file ValidationErrors.jsx
 * @description Displays field-level census validation errors returned from the backend.
 *              Groups errors by row for easy correction.
 */
import { AlertCircle, X } from 'lucide-react'
import { useState } from 'react'

export default function ValidationErrors({ errors }) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed || !errors?.length) return null

  return (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <h3 className="font-semibold text-red-800">Validation Errors ({errors.length})</h3>
        </div>
        <button onClick={() => setDismissed(true)} className="text-red-400 hover:text-red-600">
          <X className="h-4 w-4" />
        </button>
      </div>

      <p className="text-sm text-red-700 mb-4">Please fix the following errors in your census file and re-upload:</p>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {errors.map((err, i) => (
          <div key={i} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-red-100">
            <span className="text-xs font-bold text-red-500 bg-red-100 px-2 py-0.5 rounded shrink-0">
              Row {err.row}
            </span>
            <div>
              <span className="text-xs font-medium text-red-700">{err.field}: </span>
              <span className="text-xs text-red-600">{err.message}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * @file ValidationErrors.jsx
 * @description Displays field-level validation errors returned from the backend
 *              after a census file upload fails validation.
 *              Shows a list of actionable error messages so the user knows what to fix.
 */
import { AlertCircle, X } from 'lucide-react'

export default function ValidationErrors({ errors = [], onDismiss }) {
  if (!errors.length) return null

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-800 mb-2">
              Validation failed — please fix the following issues:
            </p>
            <ul className="space-y-1">
              {errors.map((error, index) => (
                <li key={index} className="text-sm text-red-700 flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-red-500 flex-shrink-0" />
                  {typeof error === 'string' ? error : `Row ${error.row}: ${error.field} — ${error.message}`}
                </li>
              ))}
            </ul>
          </div>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-red-400 hover:text-red-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}

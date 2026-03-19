/**
 * @file TemplatePage.jsx
 * @description Template download page.
 *              Allows users to download the pre-built payroll census Excel template.
 *              Describes all required columns and their expected formats.
 */
import { useState } from 'react'
import { Download, FileSpreadsheet, CheckCircle } from 'lucide-react'
import { exportService } from '@/services/export.service'

const requiredColumns = [
  { name: 'employee_id', description: 'Unique employee identifier', example: 'EMP-001' },
  { name: 'first_name', description: 'Employee first name', example: 'John' },
  { name: 'last_name', description: 'Employee last name', example: 'Doe' },
  { name: 'pay_schedule', description: 'weekly / biweekly / semimonthly / monthly', example: 'biweekly' },
  { name: 'gross_wages', description: 'Gross wages for the pay period', example: '5000.00' },
  { name: 'vcamp', description: 'VCAMP savings target (payroll tax target)', example: '500.00' },
  { name: 'medical', description: 'Medical benefit deduction', example: '250.00' },
  { name: 'dental', description: 'Dental benefit deduction', example: '25.00' },
  { name: 'vision', description: 'Vision benefit deduction', example: '10.00' },
  { name: 'debit_card', description: 'Debit card benefit deduction', example: '50.00' },
  { name: 'ancillary', description: 'Ancillary benefit deduction', example: '0.00' },
]

export default function TemplatePage() {
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloaded, setDownloaded] = useState(false)
  const [error, setError] = useState(null)

  const handleDownload = async () => {
    try {
      setIsDownloading(true)
      setError(null)
      await exportService.downloadTemplate()
      setDownloaded(true)
      setTimeout(() => setDownloaded(false), 3000)
    } catch (err) {
      setError('Failed to download template. Please try again.')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Payroll Census Template</h2>
        <p className="text-sm text-gray-500 mt-1">
          Download the approved Excel template with all required columns. Fill it in and upload on the Bulk Run page.
        </p>
      </div>

      {/* Download card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-xl bg-green-100 flex items-center justify-center">
            <FileSpreadsheet className="h-8 w-8 text-green-600" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900">motek-payroll-census-template.xlsx</p>
            <p className="text-sm text-gray-400 mt-0.5">
              Excel template · {requiredColumns.length} required columns · Pre-formatted
            </p>
          </div>
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {downloaded ? (
              <><CheckCircle className="h-4 w-4" /> Downloaded!</>
            ) : (
              <><Download className="h-4 w-4" /> {isDownloading ? 'Downloading...' : 'Download'}</>
            )}
          </button>
        </div>
        {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
      </div>

      {/* Column reference */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Required Columns Reference</h3>
          <p className="text-xs text-gray-400 mt-0.5">All columns must be present. Empty values will cause validation errors.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-medium text-gray-600">Column Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Description</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Example Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {requiredColumns.map((col) => (
                <tr key={col.name} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <code className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">{col.name}</code>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{col.description}</td>
                  <td className="px-4 py-3 text-gray-400 font-mono text-xs">{col.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tips */}
      <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
        <p className="text-sm font-semibold text-blue-800 mb-2">Tips for filling the template</p>
        <ul className="space-y-1">
          {[
            'Do not rename or remove any column headers',
            'Monetary values should be numbers only — no $ signs or commas',
            'pay_schedule must be exactly: weekly, biweekly, semimonthly, or monthly',
            'Leave benefit columns as 0.00 if not applicable — do not leave blank',
            'Each row represents one employee for one pay period',
          ].map((tip) => (
            <li key={tip} className="text-sm text-blue-700 flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0" />
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/**
 * @file TemplatePage.jsx
 * @description Template download page.
 *              Lists all required columns and lets user download the census Excel template.
 */
import { useState } from 'react'
import { Download, CheckCircle, Info } from 'lucide-react'
import { exportService } from '@/services/export.service'

const requiredColumns = [
  { field: 'employee_id', description: 'Unique employee identifier' },
  { field: 'first_name', description: 'Employee first name' },
  { field: 'last_name', description: 'Employee last name' },
  { field: 'ssn_last4', description: 'Last 4 digits of SSN' },
  { field: 'pay_frequency', description: 'weekly | biweekly | semimonthly | monthly' },
  { field: 'gross_wages', description: 'Gross wages per pay period' },
  { field: 'filing_status', description: 'single | married | head_of_household' },
  { field: 'federal_allowances', description: 'Number of federal allowances' },
  { field: 'state', description: 'Two-letter state code (e.g. TX, CA)' },
  { field: 'medical_ee', description: 'Employee medical premium' },
  { field: 'medical_er', description: 'Employer medical contribution' },
  { field: 'dental_ee', description: 'Employee dental premium' },
  { field: 'dental_er', description: 'Employer dental contribution' },
  { field: 'vision_ee', description: 'Employee vision premium' },
  { field: 'vision_er', description: 'Employer vision contribution' },
  { field: 'debit_card', description: 'Debit card benefit amount' },
  { field: 'ancillary', description: 'Ancillary benefit amount' },
  { field: 'vcamp_target', description: 'Target payroll tax savings (VCAMP)' },
]

export default function TemplatePage() {
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloaded, setDownloaded] = useState(false)

  const handleDownload = async () => {
    try {
      setIsDownloading(true)
      await exportService.downloadTemplate()
      setDownloaded(true)
      setTimeout(() => setDownloaded(false), 3000)
    } catch (err) {
      console.error('Template download failed:', err)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Census Template</h2>
        <p className="text-gray-500 mt-1">Download the approved payroll census Excel template.</p>
      </div>

      {/* Download Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">Payroll Census Template</h3>
          <p className="text-sm text-gray-500 mt-1">Excel file with all required columns, data validation, and sample row</p>
        </div>
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          {downloaded ? (
            <><CheckCircle className="h-4 w-4" /> Downloaded!</>
          ) : (
            <><Download className="h-4 w-4" /> {isDownloading ? 'Preparing...' : 'Download Template'}</>
          )}
        </button>
      </div>

      {/* Info */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-sm text-blue-700">
          Do not modify column headers. All fields marked as required must be filled for every employee row.
          Upload the completed file on the Bulk Payroll Run page.
        </p>
      </div>

      {/* Column Reference */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Required Column Reference</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-gray-500">Column Field</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {requiredColumns.map(({ field, description }) => (
                <tr key={field} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-mono text-blue-700 text-xs">{field}</td>
                  <td className="px-6 py-3 text-gray-600">{description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

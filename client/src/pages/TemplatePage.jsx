/**
 * @file TemplatePage.jsx
 * @description Template download page with column descriptions.
 */
import { Download, FileSpreadsheet } from 'lucide-react'
import { censusService } from '@/services/census.service'
import { useState } from 'react'

const columns = [
  { name: 'EmployeeID', description: 'Unique employee identifier', example: 'EMP001', required: true },
  { name: 'FirstName', description: 'Employee first name', example: 'John', required: true },
  { name: 'LastName', description: 'Employee last name', example: 'Doe', required: true },
  { name: 'GrossPay', description: 'Gross pay for the period ($)', example: '5000', required: true },
  { name: 'PaySchedule', description: 'weekly / biweekly / semimonthly / monthly', example: 'biweekly', required: true },
  { name: 'FilingStatus', description: 'Tax filing status', example: 'single', required: true },
  { name: 'State', description: '2-letter state code', example: 'TX', required: true },
  { name: 'VCAMP', description: 'Target payroll tax savings per period ($)', example: '200', required: true },
  { name: 'Medical', description: 'Medical benefit deduction ($)', example: '150', required: false },
  { name: 'Dental', description: 'Dental benefit deduction ($)', example: '25', required: false },
  { name: 'Vision', description: 'Vision benefit deduction ($)', example: '10', required: false },
  { name: 'DebitCard', description: 'Debit card benefit ($)', example: '50', required: false },
  { name: 'Ancillary', description: 'Ancillary benefits ($)', example: '30', required: false },
]

export default function TemplatePage() {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    try {
      setIsDownloading(true)
      await censusService.downloadTemplate()
    } catch (err) {
      console.error('Download failed:', err)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Census Template</h2>
        <p className="text-gray-500 mt-1">Download the template, fill in your employee data, and upload it for a bulk run.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-green-50 rounded-xl">
            <FileSpreadsheet className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">payroll_census_template.xlsx</p>
            <p className="text-sm text-gray-500">Excel template with all required columns and a sample row</p>
          </div>
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="ml-auto flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            <Download className="h-4 w-4" />
            {isDownloading ? 'Downloading...' : 'Download Template'}
          </button>
        </div>

        {/* Column reference table */}
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 px-3 font-medium text-gray-600">Column</th>
              <th className="text-left py-2 px-3 font-medium text-gray-600">Description</th>
              <th className="text-left py-2 px-3 font-medium text-gray-600">Example</th>
              <th className="text-center py-2 px-3 font-medium text-gray-600">Required</th>
            </tr>
          </thead>
          <tbody>
            {columns.map((col) => (
              <tr key={col.name} className="border-b border-gray-100">
                <td className="py-2 px-3 font-mono text-blue-700 font-medium">{col.name}</td>
                <td className="py-2 px-3 text-gray-600">{col.description}</td>
                <td className="py-2 px-3 text-gray-500 font-mono">{col.example}</td>
                <td className="py-2 px-3 text-center">
                  {col.required
                    ? <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Required</span>
                    : <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Optional</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

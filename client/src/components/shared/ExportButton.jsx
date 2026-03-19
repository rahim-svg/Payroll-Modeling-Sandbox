/**
 * @file ExportButton.jsx
 * @description Reusable export-to-Excel button.
 *              Calls the export service to trigger an Excel file download for a given run.
 */
import { Download } from 'lucide-react'
import { useState } from 'react'
import { exportService } from '@/services/export.service'

export default function ExportButton({ runId, disabled = false }) {
  const [isExporting, setIsExporting] = useState(false)
  const [error, setError] = useState(null)

  const handleExport = async () => {
    try {
      setIsExporting(true)
      setError(null)
      await exportService.downloadExcel(runId)
    } catch (err) {
      setError('Export failed. Please try again.')
      console.error('Export error:', err)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        onClick={handleExport}
        disabled={disabled || isExporting}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Download className="h-4 w-4" />
        {isExporting ? 'Exporting...' : 'Export to Excel'}
      </button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}

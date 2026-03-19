/**
 * @file ExportButton.jsx
 * @description Triggers Excel export download for a completed run.
 */
import { Download } from 'lucide-react'
import { useState } from 'react'
import { exportService } from '@/services/export.service'

export default function ExportButton({ runId, disabled = false }) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    try {
      setIsExporting(true)
      await exportService.downloadExcel(runId)
    } catch (err) {
      console.error('Export failed:', err)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={disabled || isExporting}
      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      <Download className="h-4 w-4" />
      {isExporting ? 'Exporting...' : 'Export to Excel'}
    </button>
  )
}

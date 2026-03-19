/**
 * @file export.service.js
 * @description Export API calls.
 *              Handles Excel report download and census template download.
 *              Uses blob response type to trigger browser file download.
 */
import axios from 'axios'

export const exportService = {
  // Download Excel results report for a run
  downloadExcel: async (runId) => {
    const response = await axios.get(`/api/export/excel/${runId}`, {
      responseType: 'blob',
    })
    triggerDownload(response.data, `payroll-results-${runId}.xlsx`)
  },

  // Download blank census template
  downloadTemplate: async () => {
    const response = await axios.get('/api/export/template', {
      responseType: 'blob',
    })
    triggerDownload(response.data, 'payroll-census-template.xlsx')
  },
}

// Helper: trigger browser file download from blob
function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * @file export.service.js
 * @description Export API calls — triggers Excel file download.
 */
import axios from 'axios'

export const exportService = {
  downloadExcel: async (runId) => {
    const response = await axios.get(`/api/export/${runId}`, { responseType: 'blob' })
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `payroll_results_${runId}.xlsx`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  },
}

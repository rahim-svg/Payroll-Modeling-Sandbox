/**
 * @file export.service.js
 * @description Export API service.
 *              Handles Excel file download by triggering a blob download
 *              from the backend export endpoint.
 */
import axios from 'axios'

export const exportService = {
  /**
   * Download the Excel modeling summary for a completed run
   * Triggers a browser file download
   * @param {string} runId
   */
  downloadExcel: async (runId) => {
    const response = await axios.get(`/api/export/${runId}/excel`, {
      responseType: 'blob',
    })

    // Create a temporary anchor tag to trigger the download
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `motek-payroll-results-${runId}.xlsx`)
    document.body.appendChild(link)
    link.click()

    // Clean up the temporary URL and element
    link.parentNode.removeChild(link)
    window.URL.revokeObjectURL(url)
  },

  /**
   * Download the blank census template
   * Triggers a browser file download
   */
  downloadTemplate: async () => {
    const response = await axios.get('/api/export/template', {
      responseType: 'blob',
    })
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'motek-payroll-census-template.xlsx')
    document.body.appendChild(link)
    link.click()
    link.parentNode.removeChild(link)
    window.URL.revokeObjectURL(url)
  },
}

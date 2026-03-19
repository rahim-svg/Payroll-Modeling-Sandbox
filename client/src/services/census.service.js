/**
 * @file census.service.js
 * @description Census file upload and template download API calls.
 */
import axios from 'axios'

export const censusService = {
  // Upload census Excel file — send as FormData
  upload: (file) => {
    const formData = new FormData()
    formData.append('census', file)
    return axios.post('/api/census/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  // Download the census template
  downloadTemplate: async () => {
    const response = await axios.get('/api/census/template', { responseType: 'blob' })
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'payroll_census_template.xlsx')
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  },
}

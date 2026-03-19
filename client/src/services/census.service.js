/**
 * @file census.service.js
 * @description Census file upload and validation API service.
 *              Handles multipart form data upload to the backend.
 */
import axios from 'axios'

export const censusService = {
  /**
   * Upload a census Excel file for validation and parsing
   * @param {File} file - The Excel file to upload
   * @returns {Promise<{runId: string, employees: array, errors: array}>}
   */
  uploadCensus: async (file) => {
    const formData = new FormData()
    formData.append('census', file)
    const { data } = await axios.post('/api/census/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  /**
   * Submit a single employee record for simulation
   * @param {object} employeeData
   * @returns {Promise<{runId: string}>}
   */
  submitSingleEmployee: async (employeeData) => {
    const { data } = await axios.post('/api/census/single', employeeData)
    return data
  },
}

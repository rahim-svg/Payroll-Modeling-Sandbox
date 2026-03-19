/**
 * @file run.service.js
 * @description Payroll run API calls.
 *              Handles bulk census upload, single employee run, and result retrieval.
 */
import axios from 'axios'

export const runService = {
  // Start a bulk payroll run with a census file
  startBulkRun: async (file, onStatusUpdate) => {
    const formData = new FormData()
    formData.append('census', file)

    // Notify UI that run has started
    onStatusUpdate?.({ step: 'validating', message: 'Validating census file...' })

    const { data } = await axios.post('/api/run/bulk', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    return data
  },

  // Start a single employee payroll run
  startSingleRun: async (employeeData) => {
    const { data } = await axios.post('/api/run/single', employeeData)
    return data
  },

  // Fetch results for a completed run
  getResults: async (runId) => {
    const { data } = await axios.get(`/api/run/results/${runId}`)
    return data
  },
}

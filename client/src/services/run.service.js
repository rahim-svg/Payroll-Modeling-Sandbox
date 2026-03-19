/**
 * @file run.service.js
 * @description Payroll run execution and status API service.
 *              Handles run initiation, status polling, and result retrieval.
 */
import axios from 'axios'

export const runService = {
  /**
   * Start a payroll simulation run for a validated census
   * @param {string} runId
   * @returns {Promise<{runId: string, status: string}>}
   */
  startRun: async (runId) => {
    const { data } = await axios.post(`/api/run/${runId}/start`)
    return data
  },

  /**
   * Get the current status of a run
   * @param {string} runId
   * @returns {Promise<{status: string, progress: number, message: string}>}
   */
  getStatus: async (runId) => {
    const { data } = await axios.get(`/api/run/${runId}/status`)
    return data
  },

  /**
   * Get the full results of a completed run
   * @param {string} runId
   * @returns {Promise<{summary, comparison, register, paychecks}>}
   */
  getResults: async (runId) => {
    const { data } = await axios.get(`/api/run/${runId}/results`)
    return data
  },
}

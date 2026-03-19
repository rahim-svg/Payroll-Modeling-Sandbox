/**
 * @file run.service.js
 * @description Payroll run API calls — bulk, single, status polling, results.
 */
import axios from 'axios'

export const runService = {
  startBulkRun: (employees) => axios.post('/api/run/bulk', { employees }),
  startSingleRun: (employee) => axios.post('/api/run/single', { employee }),
  getStatus: (runId) => axios.get(`/api/run/${runId}/status`),
  getResults: (runId) => axios.get(`/api/run/${runId}/results`),
}

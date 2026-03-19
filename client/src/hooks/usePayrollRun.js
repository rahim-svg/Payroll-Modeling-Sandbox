/**
 * @file usePayrollRun.js
 * @description Custom hook that orchestrates the full payroll simulation flow.
 *              Handles: upload → validate → start run → poll status → fetch results.
 *              Exposes loading, error, and result states to consuming components.
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { censusService } from '@/services/census.service'
import { runService } from '@/services/run.service'

export function usePayrollRun() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState([])
  const [runId, setRunId] = useState(null)
  const [error, setError] = useState(null)

  /**
   * Upload census file, validate, then start the run
   * @param {File} file
   */
  const uploadAndRun = async (file) => {
    try {
      setIsLoading(true)
      setError(null)
      setValidationErrors([])

      // Step 1: Upload and validate census file
      const uploadResult = await censusService.uploadCensus(file)

      // If validation errors returned, stop and show them
      if (uploadResult.errors && uploadResult.errors.length > 0) {
        setValidationErrors(uploadResult.errors)
        return
      }

      const newRunId = uploadResult.runId
      setRunId(newRunId)

      // Step 2: Start the simulation run
      await runService.startRun(newRunId)

      // Step 3: Navigate to results page where status polling happens
      navigate(`/results/${newRunId}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Submit a single employee record and start the run
   * @param {object} employeeData
   */
  const submitSingleEmployee = async (employeeData) => {
    try {
      setIsLoading(true)
      setError(null)

      const uploadResult = await censusService.submitSingleEmployee(employeeData)
      const newRunId = uploadResult.runId
      setRunId(newRunId)

      await runService.startRun(newRunId)
      navigate(`/results/${newRunId}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    validationErrors,
    runId,
    error,
    uploadAndRun,
    submitSingleEmployee,
  }
}

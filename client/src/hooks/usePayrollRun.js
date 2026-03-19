/**
 * @file usePayrollRun.js
 * @description Manages the full payroll run lifecycle:
 *              upload → validate → start run → poll status → fetch results.
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { censusService } from '@/services/census.service'
import { runService } from '@/services/run.service'

export function usePayrollRun() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [validationErrors, setValidationErrors] = useState([])
  const navigate = useNavigate()

  const startBulkRun = async (file) => {
    try {
      setIsLoading(true)
      setError(null)
      setValidationErrors([])

      // Step 1: Upload and validate census
      const uploadRes = await censusService.upload(file)
      const { employees } = uploadRes.data

      // Step 2: Start the payroll run
      const runRes = await runService.startBulkRun(employees)
      const { runId } = runRes.data

      // Navigate to results page — useRunStatus will poll from there
      navigate(`/results/${runId}`)
    } catch (err) {
      if (err.response?.data?.errors) {
        setValidationErrors(err.response.data.errors)
      } else {
        setError(err.response?.data?.message || 'Something went wrong')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const startSingleRun = async (employeeData) => {
    try {
      setIsLoading(true)
      setError(null)

      const runRes = await runService.startSingleRun(employeeData)
      const { runId } = runRes.data

      navigate(`/results/${runId}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return { startBulkRun, startSingleRun, isLoading, error, validationErrors }
}

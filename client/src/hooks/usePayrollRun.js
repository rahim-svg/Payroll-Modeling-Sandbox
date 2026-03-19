/**
 * @file usePayrollRun.js
 * @description Custom hook for managing a payroll run lifecycle.
 *              Tracks run state, error state, and result data.
 */
import { useState } from 'react'
import { runService } from '@/services/run.service'
import { useNavigate } from 'react-router-dom'

export function usePayrollRun() {
  const navigate = useNavigate()
  const [isRunning, setIsRunning] = useState(false)
  const [step, setStep] = useState('idle')
  const [error, setError] = useState(null)
  const [validationErrors, setValidationErrors] = useState([])

  const runBulk = async (file) => {
    try {
      setError(null)
      setValidationErrors([])
      setIsRunning(true)

      const result = await runService.startBulkRun(file, ({ step: s, message }) => {
        setStep(s)
      })

      navigate(`/results/${result.runId}`)
    } catch (err) {
      if (err.response?.data?.validationErrors) {
        setValidationErrors(err.response.data.validationErrors)
      } else {
        setError(err.response?.data?.message || 'Run failed')
      }
      setStep('idle')
    } finally {
      setIsRunning(false)
    }
  }

  const runSingle = async (employeeData) => {
    try {
      setError(null)
      setIsRunning(true)
      const result = await runService.startSingleRun(employeeData)
      navigate(`/results/${result.runId}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Run failed')
    } finally {
      setIsRunning(false)
    }
  }

  return { isRunning, step, error, validationErrors, runBulk, runSingle }
}

/**
 * @file useRunStatus.js
 * @description Custom hook for polling a payroll run's status.
 *              Polls the backend every 2 seconds until the run is complete or failed.
 *              Automatically stops polling when run reaches a terminal state.
 */
import { useState, useEffect, useRef } from 'react'
import { runService } from '@/services/run.service'

const TERMINAL_STATES = ['completed', 'failed', 'error']
const POLL_INTERVAL_MS = 2000

export function useRunStatus(runId) {
  const [status, setStatus] = useState(null)
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState('')
  const [error, setError] = useState(null)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (!runId) return

    const poll = async () => {
      try {
        const result = await runService.getStatus(runId)
        setStatus(result.status)
        setProgress(result.progress || 0)
        setMessage(result.message || '')

        // Stop polling when run reaches a terminal state
        if (TERMINAL_STATES.includes(result.status)) {
          clearInterval(intervalRef.current)
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch run status')
        clearInterval(intervalRef.current)
      }
    }

    // Poll immediately then on interval
    poll()
    intervalRef.current = setInterval(poll, POLL_INTERVAL_MS)

    return () => clearInterval(intervalRef.current)
  }, [runId])

  return { status, progress, message, error }
}

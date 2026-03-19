/**
 * @file useRunStatus.js
 * @description Polls run status every 2 seconds until complete or failed.
 */
import { useState, useEffect, useRef } from 'react'
import { runService } from '@/services/run.service'

export function useRunStatus(runId) {
  const [status, setStatus] = useState(null)
  const [error, setError] = useState(null)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (!runId) return

    const poll = async () => {
      try {
        const { data } = await runService.getStatus(runId)
        setStatus(data.status)

        // Stop polling when run is done
        if (data.status === 'complete' || data.status === 'failed') {
          clearInterval(intervalRef.current)
        }
      } catch (err) {
        setError(err.message)
        clearInterval(intervalRef.current)
      }
    }

    poll() // Immediate first poll
    intervalRef.current = setInterval(poll, 2000) // Then every 2s

    return () => clearInterval(intervalRef.current)
  }, [runId])

  return { status, error }
}

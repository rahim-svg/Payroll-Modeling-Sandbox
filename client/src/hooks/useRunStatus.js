/**
 * @file useRunStatus.js
 * @description Custom hook to fetch and watch the status of a payroll run.
 *              Uses React Query for caching and automatic refetching.
 */
import { useQuery } from '@tanstack/react-query'
import { runService } from '@/services/run.service'

export function useRunStatus(runId) {
  return useQuery({
    queryKey: ['run-results', runId],
    queryFn: () => runService.getResults(runId),
    enabled: !!runId,
    staleTime: 0, // Always fresh for results
  })
}

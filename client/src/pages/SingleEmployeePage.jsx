/**
 * @file SingleEmployeePage.jsx
 * @description Single employee payroll simulation page.
 *              User manually enters one employee's payroll data.
 *              Useful for new hire simulations or spot checks.
 */
import SingleEmployeeForm from '@/components/upload/SingleEmployeeForm'
import { usePayrollRun } from '@/hooks/usePayrollRun'
import { AlertCircle } from 'lucide-react'

export default function SingleEmployeePage() {
  const { isLoading, error, submitSingleEmployee } = usePayrollRun()

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Single Employee Simulation</h2>
        <p className="text-sm text-gray-500 mt-1">
          Enter one employee’s payroll data manually to run a Normal vs Hybrid payroll comparison.
        </p>
      </div>

      {/* Form card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <SingleEmployeeForm onSubmit={submitSingleEmployee} isLoading={isLoading} />
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </div>
  )
}

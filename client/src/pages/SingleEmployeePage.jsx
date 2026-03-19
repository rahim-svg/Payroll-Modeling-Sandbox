/**
 * @file SingleEmployeePage.jsx
 * @description Single employee payroll simulation — manual data entry form.
 */
import { useForm } from 'react-hook-form'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { usePayrollRun } from '@/hooks/usePayrollRun'
import { Play } from 'lucide-react'

export default function SingleEmployeePage() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const { startSingleRun, isLoading, error } = usePayrollRun()

  const onSubmit = async (data) => {
    const employee = {
      employeeId: data.employeeId,
      firstName: data.firstName,
      lastName: data.lastName,
      grossPay: parseFloat(data.grossPay),
      paySchedule: data.paySchedule,
      filingStatus: data.filingStatus,
      state: data.state,
      vcamp: parseFloat(data.vcamp),
      benefits: {
        medical: parseFloat(data.medical) || 0,
        dental: parseFloat(data.dental) || 0,
        vision: parseFloat(data.vision) || 0,
        debitCard: parseFloat(data.debitCard) || 0,
        ancillary: parseFloat(data.ancillary) || 0,
      },
    }
    await startSingleRun(employee)
  }

  const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1'
  const errorClass = 'text-xs text-red-600 mt-1'

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Single Employee Run</h2>
        <p className="text-gray-500 mt-1">Enter employee data to run a payroll simulation.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        {/* Basic Info */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">Employee Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Employee ID</label>
              <input {...register('employeeId', { required: 'Required' })} className={inputClass} placeholder="EMP001" />
              {errors.employeeId && <p className={errorClass}>{errors.employeeId.message}</p>}
            </div>
            <div>
              <label className={labelClass}>First Name</label>
              <input {...register('firstName', { required: 'Required' })} className={inputClass} placeholder="John" />
            </div>
            <div>
              <label className={labelClass}>Last Name</label>
              <input {...register('lastName', { required: 'Required' })} className={inputClass} placeholder="Doe" />
            </div>
            <div>
              <label className={labelClass}>Gross Pay ($)</label>
              <input {...register('grossPay', { required: 'Required' })} type="number" step="0.01" className={inputClass} placeholder="5000" />
              {errors.grossPay && <p className={errorClass}>{errors.grossPay.message}</p>}
            </div>
            <div>
              <label className={labelClass}>Pay Schedule</label>
              <select {...register('paySchedule', { required: 'Required' })} className={inputClass}>
                <option value="">Select...</option>
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-Weekly</option>
                <option value="semimonthly">Semi-Monthly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Filing Status</label>
              <select {...register('filingStatus', { required: 'Required' })} className={inputClass}>
                <option value="">Select...</option>
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="head_of_household">Head of Household</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>State</label>
              <input {...register('state', { required: 'Required' })} className={inputClass} placeholder="TX" maxLength={2} />
            </div>
            <div>
              <label className={labelClass}>VCAMP Target ($)</label>
              <input {...register('vcamp', { required: 'Required' })} type="number" step="0.01" className={inputClass} placeholder="200" />
              {errors.vcamp && <p className={errorClass}>{errors.vcamp.message}</p>}
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">Benefits (per period)</h3>
          <div className="grid grid-cols-3 gap-4">
            {['medical', 'dental', 'vision', 'debitCard', 'ancillary'].map((field) => (
              <div key={field}>
                <label className={labelClass}>{field.charAt(0).toUpperCase() + field.slice(1)} ($)</label>
                <input {...register(field)} type="number" step="0.01" className={inputClass} placeholder="0" />
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {isLoading ? <><LoadingSpinner size="sm" /> Running...</> : <><Play className="h-4 w-4" /> Run Simulation</>}
        </button>
      </form>
    </div>
  )
}

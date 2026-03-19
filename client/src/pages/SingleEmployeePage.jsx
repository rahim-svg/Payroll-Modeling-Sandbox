/**
 * @file SingleEmployeePage.jsx
 * @description Single employee / new hire payroll modeling page.
 *              Accepts manual form input for one employee record and runs the full simulation.
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { runService } from '@/services/run.service'
import LoadingSpinner from '@/components/shared/LoadingSpinner'

const PAY_FREQUENCIES = ['weekly', 'biweekly', 'semimonthly', 'monthly']
const FILING_STATUSES = ['single', 'married', 'head_of_household']

export default function SingleEmployeePage() {
  const navigate = useNavigate()
  const [isRunning, setIsRunning] = useState(false)
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    try {
      setError('')
      setIsRunning(true)
      const result = await runService.startSingleRun(data)
      navigate(`/results/${result.runId}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Run failed. Please check your inputs and try again.')
    } finally {
      setIsRunning(false)
    }
  }

  const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1'
  const errorClass = 'text-xs text-red-500 mt-1'

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Single Employee Run</h2>
        <p className="text-gray-500 mt-1">Model payroll for one employee or new hire.</p>
      </div>

      {isRunning ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-16 flex flex-col items-center gap-4">
          <LoadingSpinner size="lg" />
          <p className="text-sm font-medium text-gray-700">Running payroll simulation...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Info */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Employee Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>First Name</label>
                <input {...register('first_name', { required: 'Required' })} className={inputClass} placeholder="John" />
                {errors.first_name && <p className={errorClass}>{errors.first_name.message}</p>}
              </div>
              <div>
                <label className={labelClass}>Last Name</label>
                <input {...register('last_name', { required: 'Required' })} className={inputClass} placeholder="Smith" />
                {errors.last_name && <p className={errorClass}>{errors.last_name.message}</p>}
              </div>
              <div>
                <label className={labelClass}>Employee ID</label>
                <input {...register('employee_id', { required: 'Required' })} className={inputClass} placeholder="EMP001" />
                {errors.employee_id && <p className={errorClass}>{errors.employee_id.message}</p>}
              </div>
              <div>
                <label className={labelClass}>SSN Last 4</label>
                <input {...register('ssn_last4', { required: 'Required', pattern: { value: /^\d{4}$/, message: 'Must be 4 digits' } })} className={inputClass} placeholder="1234" maxLength={4} />
                {errors.ssn_last4 && <p className={errorClass}>{errors.ssn_last4.message}</p>}
              </div>
            </div>
          </div>

          {/* Payroll Info */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Payroll Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Pay Frequency</label>
                <select {...register('pay_frequency', { required: 'Required' })} className={inputClass}>
                  <option value="">Select frequency</option>
                  {PAY_FREQUENCIES.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
                {errors.pay_frequency && <p className={errorClass}>{errors.pay_frequency.message}</p>}
              </div>
              <div>
                <label className={labelClass}>Gross Wages (per period)</label>
                <input type="number" step="0.01" {...register('gross_wages', { required: 'Required', min: { value: 0, message: 'Must be positive' } })} className={inputClass} placeholder="3500.00" />
                {errors.gross_wages && <p className={errorClass}>{errors.gross_wages.message}</p>}
              </div>
              <div>
                <label className={labelClass}>Filing Status</label>
                <select {...register('filing_status', { required: 'Required' })} className={inputClass}>
                  <option value="">Select status</option>
                  {FILING_STATUSES.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
                {errors.filing_status && <p className={errorClass}>{errors.filing_status.message}</p>}
              </div>
              <div>
                <label className={labelClass}>State</label>
                <input {...register('state', { required: 'Required', maxLength: { value: 2, message: 'Use 2-letter code' } })} className={inputClass} placeholder="TX" maxLength={2} />
                {errors.state && <p className={errorClass}>{errors.state.message}</p>}
              </div>
              <div>
                <label className={labelClass}>Federal Allowances</label>
                <input type="number" {...register('federal_allowances', { required: 'Required', min: 0 })} className={inputClass} placeholder="0" />
              </div>
              <div>
                <label className={labelClass}>VCAMP Target ($)</label>
                <input type="number" step="0.01" {...register('vcamp_target', { required: 'Required', min: { value: 0, message: 'Must be positive' } })} className={inputClass} placeholder="200.00" />
                {errors.vcamp_target && <p className={errorClass}>{errors.vcamp_target.message}</p>}
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Benefits</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { field: 'medical_ee', label: 'Medical (EE)' },
                { field: 'medical_er', label: 'Medical (ER)' },
                { field: 'dental_ee', label: 'Dental (EE)' },
                { field: 'dental_er', label: 'Dental (ER)' },
                { field: 'vision_ee', label: 'Vision (EE)' },
                { field: 'vision_er', label: 'Vision (ER)' },
                { field: 'debit_card', label: 'Debit Card' },
                { field: 'ancillary', label: 'Ancillary' },
              ].map(({ field, label }) => (
                <div key={field}>
                  <label className={labelClass}>{label}</label>
                  <input type="number" step="0.01" {...register(field, { min: 0 })} className={inputClass} placeholder="0.00" defaultValue={0} />
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex justify-end">
            <button type="submit" className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
              Run Payroll Simulation
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

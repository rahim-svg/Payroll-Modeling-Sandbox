/**
 * @file SingleEmployeeForm.jsx
 * @description Form for manually entering a single employee's payroll data.
 *              Used in the Single Employee workflow as an alternative to file upload.
 *              Validates all required fields before submission.
 */
import { useForm } from 'react-hook-form'

const inputClass =
  'w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
const labelClass = 'block text-xs font-medium text-gray-700 mb-1'
const errorClass = 'text-xs text-red-600 mt-0.5'

export default function SingleEmployeeForm({ onSubmit, isLoading = false }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Personal Info */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Employee Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>First Name *</label>
            <input
              {...register('firstName', { required: 'First name is required' })}
              className={inputClass}
              placeholder="John"
            />
            {errors.firstName && <p className={errorClass}>{errors.firstName.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Last Name *</label>
            <input
              {...register('lastName', { required: 'Last name is required' })}
              className={inputClass}
              placeholder="Doe"
            />
            {errors.lastName && <p className={errorClass}>{errors.lastName.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Employee ID *</label>
            <input
              {...register('employeeId', { required: 'Employee ID is required' })}
              className={inputClass}
              placeholder="EMP-001"
            />
            {errors.employeeId && <p className={errorClass}>{errors.employeeId.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Pay Schedule *</label>
            <select {...register('paySchedule', { required: 'Pay schedule is required' })} className={inputClass}>
              <option value="">Select...</option>
              <option value="weekly">Weekly</option>
              <option value="biweekly">Bi-Weekly</option>
              <option value="semimonthly">Semi-Monthly</option>
              <option value="monthly">Monthly</option>
            </select>
            {errors.paySchedule && <p className={errorClass}>{errors.paySchedule.message}</p>}
          </div>
        </div>
      </div>

      {/* Payroll Data */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Payroll Data</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Gross Wages *</label>
            <input
              type="number"
              step="0.01"
              {...register('grossWages', { required: 'Gross wages required', min: { value: 0, message: 'Must be positive' } })}
              className={inputClass}
              placeholder="5000.00"
            />
            {errors.grossWages && <p className={errorClass}>{errors.grossWages.message}</p>}
          </div>
          <div>
            <label className={labelClass}>VCAMP Target ($) *</label>
            <input
              type="number"
              step="0.01"
              {...register('vcamp', { required: 'VCAMP target required', min: { value: 0, message: 'Must be positive' } })}
              className={inputClass}
              placeholder="500.00"
            />
            {errors.vcamp && <p className={errorClass}>{errors.vcamp.message}</p>}
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Benefits Deductions</h3>
        <div className="grid grid-cols-3 gap-4">
          {['medical', 'dental', 'vision', 'debitCard', 'ancillary'].map((field) => (
            <div key={field}>
              <label className={labelClass}>
                {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')} ($)
              </label>
              <input
                type="number"
                step="0.01"
                defaultValue={0}
                {...register(field, { min: { value: 0, message: 'Must be 0 or more' } })}
                className={inputClass}
                placeholder="0.00"
              />
              {errors[field] && <p className={errorClass}>{errors[field].message}</p>}
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2.5 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Running Simulation...' : 'Run Payroll Simulation'}
      </button>
    </form>
  )
}

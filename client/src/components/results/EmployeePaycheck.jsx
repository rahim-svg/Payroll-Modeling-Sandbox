/**
 * @file EmployeePaycheck.jsx
 * @description Renders individual employee paycheck details.
 *              Shows a pay stub style view with all deductions and net pay.
 *              Displays both Normal and Hybrid paychecks side by side.
 */
import { formatCurrency } from '@/utils/formatters'

function PayStub({ title, data, accentColor = 'blue' }) {
  const accent = accentColor === 'blue' ? 'bg-blue-600' : 'bg-green-600'
  const textAccent = accentColor === 'blue' ? 'text-blue-600' : 'text-green-600'
  const bgAccent = accentColor === 'blue' ? 'bg-blue-50' : 'bg-green-50'

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className={`${accent} px-4 py-3`}>
        <p className="text-white font-semibold text-sm">{title}</p>
        <p className="text-white/80 text-xs">{data?.payPeriod || 'Current Pay Period'}</p>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        {/* Employee Info */}
        <div className="pb-3 border-b border-gray-100">
          <p className="font-semibold text-gray-900">{data?.employeeName}</p>
          <p className="text-xs text-gray-400">{data?.employeeId}</p>
        </div>

        {/* Earnings */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Earnings</p>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Gross Pay</span>
            <span className="font-medium">{formatCurrency(data?.grossPay)}</span>
          </div>
        </div>

        {/* Deductions */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Deductions</p>
          <div className="space-y-1.5">
            {[
              { label: 'Federal Income Tax', value: data?.federalTax },
              { label: 'State Income Tax', value: data?.stateTax },
              { label: 'Social Security', value: data?.socialSecurity },
              { label: 'Medicare', value: data?.medicare },
              { label: 'Medical', value: data?.medical },
              { label: 'Dental', value: data?.dental },
              { label: 'Vision', value: data?.vision },
              { label: 'WIMPER (Sec. 125)', value: data?.wimper },
              { label: 'SIMERP (Sec. 105)', value: data?.simerp },
            ]
              .filter((item) => item.value)
              .map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-gray-500">{label}</span>
                  <span className="text-red-600">-{formatCurrency(value)}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Net Pay */}
        <div className={`${bgAccent} rounded-lg p-3 flex justify-between items-center`}>
          <span className={`font-bold text-sm ${textAccent}`}>Net Pay</span>
          <span className={`font-bold text-lg ${textAccent}`}>{formatCurrency(data?.netPay)}</span>
        </div>
      </div>
    </div>
  )
}

export default function EmployeePaycheck({ employee }) {
  if (!employee) return null

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-900">
        {employee.employeeName}
        <span className="text-sm font-normal text-gray-400 ml-2">{employee.employeeId}</span>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PayStub title="Scenario A — Normal Payroll" data={employee.normal} accentColor="blue" />
        <PayStub title="Scenario B — Hybrid Payroll" data={employee.hybrid} accentColor="green" />
      </div>
    </div>
  )
}

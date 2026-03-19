/**
 * @file EmployeePaycheck.jsx
 * @description Employee paycheck view showing Normal vs Hybrid pay stub side by side.
 *              Data sourced from Rollfi paycheck output.
 */
import { formatCurrency } from '@/utils/formatters'
import { useState } from 'react'

export default function EmployeePaycheck({ data }) {
  const [selectedEmployee, setSelectedEmployee] = useState(0)

  if (!data?.paychecks?.length) {
    return <EmptyState message="No paycheck data available" />
  }

  const paycheck = data.paychecks[selectedEmployee]

  return (
    <div className="space-y-4">
      {/* Employee Selector */}
      {data.paychecks.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {data.paychecks.map((p, i) => (
            <button
              key={p.employeeId}
              onClick={() => setSelectedEmployee(i)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                selectedEmployee === i ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      )}

      {/* Side by Side Paychecks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PayStub title="Normal Payroll" subtitle="Scenario A" data={paycheck?.normal} color="orange" />
        <PayStub title="Hybrid Payroll" subtitle="Scenario B" data={paycheck?.hybrid} color="blue" />
      </div>
    </div>
  )
}

function PayStub({ title, subtitle, data, color }) {
  const headerColors = { orange: 'bg-orange-600', blue: 'bg-blue-600' }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className={`${headerColors[color]} px-6 py-4 text-white`}>
        <p className="font-bold">{title}</p>
        <p className="text-xs opacity-75">{subtitle}</p>
      </div>
      <div className="p-6 space-y-4">
        <Section title="Earnings">
          <LineItem label="Gross Pay" value={formatCurrency(data?.grossPay)} bold />
        </Section>
        <Section title="Deductions">
          <LineItem label="Federal Tax" value={formatCurrency(data?.federalTax)} />
          <LineItem label="State Tax" value={formatCurrency(data?.stateTax)} />
          <LineItem label="Social Security" value={formatCurrency(data?.socialSecurity)} />
          <LineItem label="Medicare" value={formatCurrency(data?.medicare)} />
          <LineItem label="Medical" value={formatCurrency(data?.medical)} />
          <LineItem label="Dental" value={formatCurrency(data?.dental)} />
          <LineItem label="Vision" value={formatCurrency(data?.vision)} />
          {data?.wimper > 0 && <LineItem label="WIMPER (Sec. 125)" value={formatCurrency(data?.wimper)} highlight />
          }
          {data?.simerp > 0 && <LineItem label="SIMERP (Sec. 105)" value={formatCurrency(data?.simerp)} highlight />
          }
        </Section>
        <div className="border-t-2 border-gray-200 pt-3">
          <LineItem label="Net Pay" value={formatCurrency(data?.netPay)} bold large />
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{title}</p>
      <div className="space-y-1.5">{children}</div>
    </div>
  )
}

function LineItem({ label, value, bold, large, highlight }) {
  return (
    <div className={`flex justify-between items-center ${
      highlight ? 'bg-blue-50 px-2 py-1 rounded' : ''
    }`}>
      <span className={`text-sm ${
        bold ? 'font-semibold text-gray-900' : highlight ? 'text-blue-700 font-medium' : 'text-gray-600'
      }`}>{label}</span>
      <span className={`${
        large ? 'text-lg font-bold text-gray-900' : bold ? 'font-semibold text-gray-900' : highlight ? 'text-blue-700 font-medium' : 'text-gray-700'
      } text-sm`}>{value}</span>
    </div>
  )
}

function EmptyState({ message }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
      <p className="text-gray-500">{message}</p>
    </div>
  )
}

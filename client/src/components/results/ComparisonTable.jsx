/**
 * @file ComparisonTable.jsx
 * @description Shows before vs after payroll comparison per employee.
 */
import { formatCurrency } from '@/utils/formatters'
import StatusBadge from '@/components/shared/StatusBadge'

export default function ComparisonTable({ employees }) {
  if (!employees || employees.length === 0) {
    return <p className="text-gray-500 text-sm">No employee data available.</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-medium text-gray-600">Employee ID</th>
            <th className="text-right py-3 px-4 font-medium text-gray-600">Normal Net Pay</th>
            <th className="text-right py-3 px-4 font-medium text-gray-600">Hybrid Net Pay</th>
            <th className="text-right py-3 px-4 font-medium text-gray-600">WIMPER</th>
            <th className="text-right py-3 px-4 font-medium text-gray-600">SIMERP</th>
            <th className="text-right py-3 px-4 font-medium text-gray-600">Tax Savings</th>
            <th className="text-center py-3 px-4 font-medium text-gray-600">Solve Status</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.employeeId} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-4 font-medium text-gray-900">{emp.employeeId}</td>
              <td className="py-3 px-4 text-right text-gray-700">{formatCurrency(emp.normal.netPay)}</td>
              <td className="py-3 px-4 text-right text-green-700 font-medium">{formatCurrency(emp.hybrid.netPay)}</td>
              <td className="py-3 px-4 text-right text-blue-700">{formatCurrency(emp.hybrid.wimper)}</td>
              <td className="py-3 px-4 text-right text-blue-700">{formatCurrency(emp.hybrid.simerp)}</td>
              <td className="py-3 px-4 text-right text-green-700 font-semibold">{formatCurrency(emp.savings.totalSavings)}</td>
              <td className="py-3 px-4 text-center">
                <StatusBadge status={emp.solveStatus} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/**
 * @file ComparisonTable.jsx
 * @description Before vs After payroll comparison table.
 *              Shows Normal Payroll vs Hybrid Payroll side by side per employee.
 */
import { formatCurrency, formatSavings } from '@/utils/formatters'
import StatusBadge from '@/components/shared/StatusBadge'

export default function ComparisonTable({ data }) {
  if (!data?.employees?.length) {
    return <EmptyState message="No comparison data available" />
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Employee</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">Gross Wages</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500 bg-orange-50">Normal Net Pay</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500 bg-blue-50">Hybrid Net Pay</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">EE Savings</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">ER Savings</th>
                <th className="px-4 py-3 text-center font-medium text-gray-500">Solve Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.employees.map((emp) => (
                <tr key={emp.employeeId} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{emp.name}</div>
                    <div className="text-xs text-gray-500">{emp.employeeId}</div>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-700">{formatCurrency(emp.grossWages)}</td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900 bg-orange-50">{formatCurrency(emp.normalNetPay)}</td>
                  <td className="px-4 py-3 text-right font-medium text-blue-700 bg-blue-50">{formatCurrency(emp.hybridNetPay)}</td>
                  <td className="px-4 py-3 text-right font-medium text-green-600">{formatSavings(emp.employeeSavings)}</td>
                  <td className="px-4 py-3 text-right font-medium text-green-600">{formatSavings(emp.employerSavings)}</td>
                  <td className="px-4 py-3 text-center">
                    <StatusBadge
                      status={emp.solveStatus === 'converged' ? 'success' : emp.solveStatus === 'partial' ? 'warning' : 'error'}
                      label={emp.solveStatus}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 border-t-2 border-gray-200">
              <tr>
                <td className="px-4 py-3 font-bold text-gray-900" colSpan={2}>Totals</td>
                <td className="px-4 py-3 text-right font-bold text-gray-900 bg-orange-50">{formatCurrency(data.totals?.normalNetPay)}</td>
                <td className="px-4 py-3 text-right font-bold text-blue-700 bg-blue-50">{formatCurrency(data.totals?.hybridNetPay)}</td>
                <td className="px-4 py-3 text-right font-bold text-green-600">{formatSavings(data.totals?.employeeSavings)}</td>
                <td className="px-4 py-3 text-right font-bold text-green-600">{formatSavings(data.totals?.employerSavings)}</td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
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

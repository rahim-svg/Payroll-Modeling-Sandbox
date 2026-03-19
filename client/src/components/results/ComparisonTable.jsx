/**
 * @file ComparisonTable.jsx
 * @description Side-by-side comparison table showing Normal Payroll vs Hybrid Payroll.
 *              Displays per-employee rows with before/after values and savings calculations.
 *              This is the primary output view after a successful payroll simulation run.
 */
import { formatCurrency, formatSavings } from '@/utils/formatters'
import StatusBadge from '@/components/shared/StatusBadge'

export default function ComparisonTable({ results = [] }) {
  if (!results.length) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-sm">No results to display.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left px-4 py-3 font-medium text-gray-600">Employee</th>
            <th className="text-right px-4 py-3 font-medium text-gray-600">Gross Wages</th>
            <th className="text-right px-4 py-3 font-medium text-blue-600 bg-blue-50">Normal Net Pay</th>
            <th className="text-right px-4 py-3 font-medium text-green-600 bg-green-50">Hybrid Net Pay</th>
            <th className="text-right px-4 py-3 font-medium text-gray-600">WIMPER</th>
            <th className="text-right px-4 py-3 font-medium text-gray-600">SIMERP</th>
            <th className="text-right px-4 py-3 font-medium text-gray-600">Tax Savings</th>
            <th className="text-center px-4 py-3 font-medium text-gray-600">Solve Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {results.map((row, index) => (
            <tr key={row.employeeId || index} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3">
                <div>
                  <p className="font-medium text-gray-900">{row.employeeName}</p>
                  <p className="text-xs text-gray-400">{row.employeeId}</p>
                </div>
              </td>
              <td className="px-4 py-3 text-right text-gray-700">{formatCurrency(row.grossWages)}</td>
              <td className="px-4 py-3 text-right text-blue-700 bg-blue-50">{formatCurrency(row.normalNetPay)}</td>
              <td className="px-4 py-3 text-right text-green-700 bg-green-50 font-medium">{formatCurrency(row.hybridNetPay)}</td>
              <td className="px-4 py-3 text-right text-gray-700">{formatCurrency(row.wimper)}</td>
              <td className="px-4 py-3 text-right text-gray-700">{formatCurrency(row.simerp)}</td>
              <td className="px-4 py-3 text-right font-semibold text-green-700">{formatSavings(row.taxSavings)}</td>
              <td className="px-4 py-3 text-center">
                <StatusBadge
                  status={row.solveStatus === 'solved' ? 'success' : row.solveStatus === 'partial' ? 'warning' : 'error'}
                  label={row.solveStatus}
                />
              </td>
            </tr>
          ))}
        </tbody>

        {/* Summary totals row */}
        <tfoot>
          <tr className="bg-gray-50 border-t-2 border-gray-300 font-semibold">
            <td className="px-4 py-3 text-gray-900">Totals</td>
            <td className="px-4 py-3 text-right text-gray-900">
              {formatCurrency(results.reduce((s, r) => s + (r.grossWages || 0), 0))}
            </td>
            <td className="px-4 py-3 text-right text-blue-700 bg-blue-50">
              {formatCurrency(results.reduce((s, r) => s + (r.normalNetPay || 0), 0))}
            </td>
            <td className="px-4 py-3 text-right text-green-700 bg-green-50">
              {formatCurrency(results.reduce((s, r) => s + (r.hybridNetPay || 0), 0))}
            </td>
            <td className="px-4 py-3 text-right text-gray-900">
              {formatCurrency(results.reduce((s, r) => s + (r.wimper || 0), 0))}
            </td>
            <td className="px-4 py-3 text-right text-gray-900">
              {formatCurrency(results.reduce((s, r) => s + (r.simerp || 0), 0))}
            </td>
            <td className="px-4 py-3 text-right text-green-700">
              {formatSavings(results.reduce((s, r) => s + (r.taxSavings || 0), 0))}
            </td>
            <td />
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

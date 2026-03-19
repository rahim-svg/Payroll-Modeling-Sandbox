/**
 * @file PayrollRegister.jsx
 * @description Payroll register / journal view.
 *              Shows detailed payroll line items per employee from Rollfi output.
 */
import { formatCurrency } from '@/utils/formatters'

export default function PayrollRegister({ data }) {
  if (!data?.entries?.length) {
    return <EmptyState message="No payroll register data available" />
  }

  return (
    <div className="space-y-6">
      {data.entries.map((entry) => (
        <div key={entry.employeeId} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">{entry.name}</p>
              <p className="text-xs text-gray-500">{entry.employeeId} — {entry.payFrequency}</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-3 text-left font-medium text-gray-500">Line Item</th>
                  <th className="px-6 py-3 text-right font-medium text-orange-600">Normal</th>
                  <th className="px-6 py-3 text-right font-medium text-blue-600">Hybrid</th>
                  <th className="px-6 py-3 text-right font-medium text-gray-500">Difference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {entry.lineItems.map((item) => (
                  <tr key={item.label} className="hover:bg-gray-50">
                    <td className="px-6 py-2.5 text-gray-700">{item.label}</td>
                    <td className="px-6 py-2.5 text-right text-gray-700">{formatCurrency(item.normal)}</td>
                    <td className="px-6 py-2.5 text-right text-blue-700">{formatCurrency(item.hybrid)}</td>
                    <td className={`px-6 py-2.5 text-right font-medium ${
                      item.diff > 0 ? 'text-green-600' : item.diff < 0 ? 'text-red-500' : 'text-gray-400'
                    }`}>
                      {item.diff !== 0 ? (item.diff > 0 ? '+' : '') + formatCurrency(item.diff) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
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

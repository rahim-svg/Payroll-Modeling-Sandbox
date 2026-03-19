/**
 * @file SavingsSummary.jsx
 * @description Payroll tax savings summary.
 *              Shows aggregate savings by benefit type and per employee.
 *              Includes a recharts bar chart for visual comparison.
 */
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '@/utils/formatters'

export default function SavingsSummary({ data }) {
  if (!data) {
    return <EmptyState message="No savings data available" />
  }

  return (
    <div className="space-y-6">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Total Employee Savings" value={formatCurrency(data.totalEmployeeSavings)} color="green" />
        <StatCard label="Total Employer Savings" value={formatCurrency(data.totalEmployerSavings)} color="blue" />
        <StatCard label="Combined Savings" value={formatCurrency(data.totalCombinedSavings)} color="indigo" />
      </div>

      {/* Chart */}
      {data.chartData?.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-6">Savings by Employee</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="employeeSavings" name="EE Savings" fill="#22c55e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="employerSavings" name="ER Savings" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* WIMPER / SIMERP Breakdown */}
      {data.solverResults?.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Solver Results</h3>
            <p className="text-xs text-gray-500 mt-1">WIMPER (Sec. 125) and SIMERP (Sec. 105) values per employee</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">Employee</th>
                  <th className="px-6 py-3 text-right font-medium text-gray-500">VCAMP Target</th>
                  <th className="px-6 py-3 text-right font-medium text-gray-500">WIMPER</th>
                  <th className="px-6 py-3 text-right font-medium text-gray-500">SIMERP</th>
                  <th className="px-6 py-3 text-right font-medium text-gray-500">Iterations</th>
                  <th className="px-6 py-3 text-center font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.solverResults.map((r) => (
                  <tr key={r.employeeId} className="hover:bg-gray-50">
                    <td className="px-6 py-3">
                      <p className="font-medium text-gray-900">{r.name}</p>
                      <p className="text-xs text-gray-500">{r.employeeId}</p>
                    </td>
                    <td className="px-6 py-3 text-right">{formatCurrency(r.vcampTarget)}</td>
                    <td className="px-6 py-3 text-right font-medium text-blue-700">{formatCurrency(r.wimper)}</td>
                    <td className="px-6 py-3 text-right font-medium text-indigo-700">{formatCurrency(r.simerp)}</td>
                    <td className="px-6 py-3 text-right text-gray-500">{r.iterations}</td>
                    <td className="px-6 py-3 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        r.status === 'converged' ? 'bg-green-100 text-green-800' :
                        r.status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>{r.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, color }) {
  const colors = {
    green: 'bg-green-50 border-green-200 text-green-700',
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700',
  }
  return (
    <div className={`rounded-2xl border p-5 ${colors[color]}`}>
      <p className="text-sm font-medium opacity-75">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
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

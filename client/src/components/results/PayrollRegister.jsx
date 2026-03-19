/**
 * @file PayrollRegister.jsx
 * @description Renders the full payroll journal / register view.
 *              Displays all payroll line items retrieved from Rollfi for both scenarios.
 *              Tabs allow switching between Normal and Hybrid payroll register views.
 */
import { useState } from 'react'
import { formatCurrency } from '@/utils/formatters'
import { cn } from '@/utils/cn'

export default function PayrollRegister({ normal = [], hybrid = [] }) {
  const [activeTab, setActiveTab] = useState('normal')
  const data = activeTab === 'normal' ? normal : hybrid

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {['normal', 'hybrid'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px',
              activeTab === tab
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            )}
          >
            {tab === 'normal' ? 'Normal Payroll' : 'Hybrid Payroll'}
          </button>
        ))}
      </div>

      {/* Register Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 font-medium text-gray-600">Employee</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Gross Pay</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Federal Tax</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">State Tax</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">FICA (EE)</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">FICA (ER)</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Benefits</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Net Pay</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-400 text-sm">
                  No payroll register data available.
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{row.employeeName}</p>
                    <p className="text-xs text-gray-400">{row.employeeId}</p>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-700">{formatCurrency(row.grossPay)}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{formatCurrency(row.federalTax)}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{formatCurrency(row.stateTax)}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{formatCurrency(row.ficaEmployee)}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{formatCurrency(row.ficaEmployer)}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{formatCurrency(row.benefits)}</td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-900">{formatCurrency(row.netPay)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/**
 * @file StatusBadge.jsx
 * @description Color-coded status badge for run states and solve results.
 */
import { cn } from '@/utils/cn'

const variants = {
  success: 'bg-green-100 text-green-800',
  error: 'bg-red-100 text-red-800',
  warning: 'bg-yellow-100 text-yellow-800',
  pending: 'bg-gray-100 text-gray-800',
  running: 'bg-blue-100 text-blue-800',
}

export default function StatusBadge({ status, label }) {
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', variants[status] || variants.pending)}>
      {label || status}
    </span>
  )
}

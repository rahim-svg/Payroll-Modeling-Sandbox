/**
 * @file LoadingSpinner.jsx
 * @description Reusable animated loading spinner with optional message.
 */
import { cn } from '@/utils/cn'

const sizes = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' }

export default function LoadingSpinner({ size = 'md', message = '' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={cn('animate-spin rounded-full border-2 border-gray-200 border-t-blue-600', sizes[size])} />
      {message && <p className="text-sm text-gray-500">{message}</p>}
    </div>
  )
}

/**
 * @file LoadingSpinner.jsx
 * @description Reusable animated loading spinner.
 *              Supports sm / md / lg sizes and an optional text message.
 */
import { cn } from '@/utils/cn'

const sizeClasses = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-4',
}

export default function LoadingSpinner({ size = 'md', message = '' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={cn(
          'animate-spin rounded-full border-gray-200 border-t-blue-600',
          sizeClasses[size]
        )}
      />
      {message && (
        <p className="text-sm text-gray-500 animate-pulse">{message}</p>
      )}
    </div>
  )
}

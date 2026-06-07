import { X } from 'lucide-react'
import { cn } from '../../utils/helpers'

export default function Modal({ open, onClose, title, children, size = 'md', variant = 'light' }) {
  if (!open) return null

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  const isDark = variant === 'dark'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        className={cn(
          'relative w-full rounded-2xl p-6 shadow-2xl animate-fade-in',
          isDark ? 'bg-sidebar text-white' : 'bg-white dark:bg-gray-900',
          sizes[size]
        )}
      >
        <div className={cn('mb-5 flex items-center justify-between', !title && 'justify-end')}>
          {title && (
            <h2 className={cn('text-xl font-semibold', isDark ? 'text-white' : 'text-gray-900')}>
              {title}
            </h2>
          )}
          <button
            type="button"
            onClick={onClose}
            className={cn(
              'rounded-lg p-1 transition',
              isDark
                ? 'text-gray-400 hover:bg-white/10 hover:text-white'
                : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
            )}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

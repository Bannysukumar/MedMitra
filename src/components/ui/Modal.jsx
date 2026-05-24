import { X } from 'lucide-react'
import { cn } from '../../utils/helpers'

export default function Modal({ open, onClose, title, children, size = 'md' }) {
  if (!open) return null

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        className={cn(
          'relative w-full rounded-2xl bg-white p-6 shadow-xl animate-fade-in dark:bg-gray-900',
          sizes[size]
        )}
      >
        <div className="mb-4 flex items-center justify-between">
          {title && <h2 className="text-xl font-semibold">{title}</h2>}
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

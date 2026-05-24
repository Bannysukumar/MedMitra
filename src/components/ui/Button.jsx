import { cn } from '../../utils/helpers'

const variants = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm',
  secondary: 'bg-primary-50 text-primary-600 hover:bg-primary-100',
  outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50',
  ghost: 'text-gray-600 hover:bg-gray-100',
  danger: 'bg-red-500 text-white hover:bg-red-600',
  dark: 'bg-sidebar text-white hover:bg-sidebar-hover',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
  full: 'w-full px-5 py-3 text-sm',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  loading,
  disabled,
  ...props
}) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
      )}
      {children}
    </button>
  )
}

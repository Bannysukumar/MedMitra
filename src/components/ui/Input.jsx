import { cn } from '../../utils/helpers'

const inputStyles = cn(
  'form-input border-gray-200 bg-white py-3.5 text-gray-900 placeholder:text-gray-400',
  'shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]',
  'focus:border-primary-500 focus:bg-white focus:ring-primary-500/20'
)

export default function Input({
  label,
  error,
  icon: Icon,
  rightElement,
  className,
  containerClassName,
  variant = 'default',
  ...props
}) {
  const onDark = variant === 'onDark'

  return (
    <div className={cn('space-y-2', containerClassName)}>
      {label && (
        <label
          className={cn(
            'block text-sm font-medium',
            onDark ? 'text-gray-400' : 'font-semibold text-gray-700'
          )}
        >
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400" />
        )}
        <input
          className={cn(
            'w-full rounded-xl border px-4 text-[15px] leading-normal transition focus:outline-none focus:ring-2',
            inputStyles,
            onDark && 'border-gray-200 bg-white text-gray-900 shadow-none',
            Icon && 'pl-11',
            rightElement && 'pr-11',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
            className
          )}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div>
        )}
      </div>
      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
    </div>
  )
}

export function Textarea({ label, error, className, containerClassName, ...props }) {
  return (
    <div className={cn('space-y-2', containerClassName)}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700">{label}</label>
      )}
      <textarea
        className={cn(
          'form-input form-textarea w-full resize-y rounded-xl border px-4 py-3 text-[15px] leading-relaxed transition focus:outline-none focus:ring-2',
          inputStyles,
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
    </div>
  )
}

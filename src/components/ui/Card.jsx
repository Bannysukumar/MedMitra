import { cn } from '../../utils/helpers'

export default function Card({ children, className, padding = true, hover = false }) {
  return (
    <div
      className={cn(
        'rounded-2xl bg-white card-shadow',
        padding && 'p-5',
        hover && 'transition hover:shadow-md',
        className
      )}
    >
      {children}
    </div>
  )
}

export function CardHeader({ title, subtitle, action }) {
  return (
    <div className="mb-4 flex items-start justify-between">
      <div>
        {title && <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>}
        {subtitle && <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

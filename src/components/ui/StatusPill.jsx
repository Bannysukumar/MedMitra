import { cn } from '../../utils/helpers'
import { ORDER_STATUSES, PRESCRIPTION_STATUSES } from '../../config/constants'

const colors = {
  green: 'bg-green-100 text-green-700',
  orange: 'bg-orange-100 text-orange-700',
  red: 'bg-red-100 text-red-700',
  blue: 'bg-blue-100 text-blue-700',
  purple: 'bg-purple-100 text-purple-700',
  gray: 'bg-gray-100 text-gray-700',
}

export default function StatusPill({ status, type = 'order', className }) {
  const map = type === 'prescription' ? PRESCRIPTION_STATUSES : ORDER_STATUSES
  const config = map[status] || { label: status, color: 'gray' }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize',
        colors[config.color],
        className
      )}
    >
      {config.label}
    </span>
  )
}

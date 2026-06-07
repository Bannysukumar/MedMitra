import { cn } from '../../utils/helpers'
import {
  ORDER_STATUSES,
  PRESCRIPTION_STATUSES,
  PAYMENT_STATUSES,
  USER_ACCOUNT_STATUSES,
  TICKET_STATUSES,
  TICKET_PRIORITIES,
} from '../../config/constants'

const colors = {
  green: 'bg-green-100 text-green-700',
  orange: 'bg-orange-100 text-orange-700',
  red: 'bg-red-100 text-red-700',
  blue: 'bg-blue-100 text-blue-700',
  purple: 'bg-purple-100 text-purple-700',
  gray: 'bg-gray-100 text-gray-700',
}

const maps = {
  order: ORDER_STATUSES,
  prescription: PRESCRIPTION_STATUSES,
  payment: PAYMENT_STATUSES,
  user: USER_ACCOUNT_STATUSES,
  ticket: TICKET_STATUSES,
  priority: TICKET_PRIORITIES,
}

export default function StatusPill({ status, type = 'order', className }) {
  const map = maps[type] || ORDER_STATUSES
  const config = map[status] || { label: status?.replace(/_/g, ' ') || '—', color: 'gray' }

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

import { cn } from '../../utils/helpers'
import Card from '../ui/Card'

export default function AdminPageHeader({ subtitle, action }) {
  if (!subtitle && !action) return null

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      {subtitle && <p className="text-gray-600">{subtitle}</p>}
      {action}
    </div>
  )
}

export function AdminStatCard({ label, value, change, icon: Icon, iconBg, iconColor }) {
  return (
    <Card className="!p-5 transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
          {change && <p className="mt-1 text-xs font-medium text-green-600">{change}</p>}
        </div>
        {Icon && (
          <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl', iconBg || 'bg-primary-50')}>
            <Icon className={cn('h-5 w-5', iconColor || 'text-primary-600')} />
          </div>
        )}
      </div>
    </Card>
  )
}

export function AdminTable({ columns, children }) {
  return (
    <Card className="overflow-hidden !p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-100 bg-gray-50/80">
            <tr className="text-left">
              {columns.map((col) => (
                <th key={col} className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 bg-white">{children}</tbody>
        </table>
      </div>
    </Card>
  )
}

export function AdminTableRow({ children, className }) {
  return (
    <tr className={cn('text-gray-700 transition hover:bg-gray-50/80', className)}>{children}</tr>
  )
}

export function AdminTableCell({ children, className, highlight }) {
  return (
    <td className={cn('px-5 py-3.5', highlight ? 'font-semibold text-gray-900' : '', className)}>
      {children}
    </td>
  )
}

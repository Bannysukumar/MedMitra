import { Pencil, Trash2 } from 'lucide-react'
import { cn } from '../../utils/helpers'
import Card from '../ui/Card'
import Button from '../ui/Button'

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

export function AdminTableCell({ children, className, highlight, colSpan }) {
  return (
    <td colSpan={colSpan} className={cn('px-5 py-3.5', highlight ? 'font-semibold text-gray-900' : '', className)}>
      {children}
    </td>
  )
}

export function AdminRowActions({ onEdit, onDelete, children }) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {children}
      {onEdit && (
        <Button type="button" size="sm" variant="secondary" onClick={onEdit}>
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </Button>
      )}
      {onDelete && (
        <Button type="button" size="sm" variant="danger" onClick={onDelete}>
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </Button>
      )}
    </div>
  )
}

export function AdminSelect({ label, className, children, ...props }) {
  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-semibold text-gray-700">{label}</label>}
      <select
        className={cn(
          'w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20',
          className
        )}
        {...props}
      >
        {children}
      </select>
    </div>
  )
}

export function confirmDelete(name) {
  return window.confirm(`Delete "${name}"? This action cannot be undone.`)
}

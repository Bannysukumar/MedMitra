import { Pencil, Trash2 } from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { cn, formatCurrency } from '../../utils/helpers'
import Card from '../ui/Card'
import Button from '../ui/Button'

const CHART_COLORS = ['#0066ff', '#22c55e', '#f97316', '#a855f7', '#ef4444', '#06b6d4', '#eab308', '#64748b']

export default function AdminPageHeader({ subtitle, action }) {
  if (!subtitle && !action) return null

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      {subtitle && <p className="text-gray-600">{subtitle}</p>}
      {action}
    </div>
  )
}

export function AdminSearch({ value, onChange, placeholder = 'Search...', className }) {
  return (
    <input
      type="search"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={cn(
        'w-full max-w-sm rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20',
        className
      )}
    />
  )
}

export function AdminTabs({ tabs, active, onChange }) {
  return (
    <div className="flex flex-wrap gap-2 border-b border-gray-100 pb-4">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onChange(tab)}
          className={cn(
            'rounded-xl px-4 py-2 text-sm font-semibold transition',
            active === tab
              ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}

export function AdminBadge({ label, color = 'gray' }) {
  const colors = {
    green: 'bg-green-100 text-green-700',
    orange: 'bg-orange-100 text-orange-700',
    red: 'bg-red-100 text-red-700',
    blue: 'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700',
    gray: 'bg-gray-100 text-gray-700',
  }
  return (
    <span className={cn('inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize', colors[color] || colors.gray)}>
      {label}
    </span>
  )
}

export function AdminStatCard({ label, value, change, icon: Icon, iconBg, iconColor, alert }) {
  return (
    <Card className={cn('!p-5 transition hover:shadow-md', alert && 'ring-2 ring-orange-200')}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
          {change && <p className="mt-1 text-xs font-medium text-gray-500">{change}</p>}
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

export function AdminChartCard({ title, children, className }) {
  return (
    <Card className={cn('!p-5', className)}>
      {title && <h3 className="mb-4 font-semibold text-gray-900">{title}</h3>}
      <div className="h-64">{children}</div>
    </Card>
  )
}

export function AdminLineChart({ data, dataKey = 'value', xKey = 'date', color = CHART_COLORS[0] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function AdminBarChart({ data, dataKey = 'value', xKey = 'name', color = CHART_COLORS[0] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey={xKey} tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Bar dataKey={dataKey} fill={color} radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function AdminAreaChart({ data, dataKey = 'revenue', xKey = 'month', color = CHART_COLORS[0] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${v}`} />
        <Tooltip formatter={(v) => formatCurrency(v)} />
        <Area type="monotone" dataKey={dataKey} stroke={color} fill={`${color}33`} strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function AdminPieChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
          {data.map((_, i) => (
            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
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

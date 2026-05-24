import { useState } from 'react'
import { Pill } from 'lucide-react'
import { cn } from '../../utils/helpers'

export default function DashboardCard({ children, className, padding = true }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-gray-100 bg-white card-shadow',
        padding && 'p-5',
        className
      )}
    >
      {children}
    </div>
  )
}

export function OrderThumbnail({ src, alt }) {
  const [failed, setFailed] = useState(false)

  if (failed || !src) {
    return (
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary-50 ring-1 ring-gray-100">
        <Pill className="h-5 w-5 text-primary-600" />
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className="h-11 w-11 shrink-0 rounded-lg object-cover ring-1 ring-gray-100"
    />
  )
}

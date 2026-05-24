import { useState } from 'react'
import { Pill } from 'lucide-react'
import { cn } from '../../utils/helpers'

export default function ProductImage({ src, alt, className, iconClassName }) {
  const [failed, setFailed] = useState(false)

  if (failed || !src) {
    return (
      <div className={cn('flex items-center justify-center bg-primary-50 ring-1 ring-gray-100', className)}>
        <Pill className={cn('h-5 w-5 text-primary-600', iconClassName)} />
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className={cn('object-cover', className)}
    />
  )
}

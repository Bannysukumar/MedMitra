import ProductImage from '../ui/ProductImage'
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
  return (
    <ProductImage
      src={src}
      alt={alt}
      className="h-11 w-11 shrink-0 rounded-lg"
    />
  )
}

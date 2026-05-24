import { cn } from '../../utils/helpers'

export default function Skeleton({ className }) {
  return (
    <div className={cn('animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800', className)} />
  )
}

export function MedicineCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white p-4 card-shadow">
      <Skeleton className="mb-3 h-40 w-full" />
      <Skeleton className="mb-2 h-4 w-3/4" />
      <Skeleton className="mb-3 h-3 w-1/2" />
      <Skeleton className="h-10 w-full" />
    </div>
  )
}

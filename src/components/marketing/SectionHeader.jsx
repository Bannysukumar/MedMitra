import { cn } from '../../utils/helpers'

export default function SectionHeader({ eyebrow, title, subtitle, centered = true, className }) {
  return (
    <div className={cn(centered && 'text-center', className)}>
      {eyebrow && (
        <span className="inline-block rounded-full bg-primary-50 px-4 py-1 text-xs font-bold uppercase tracking-widest text-primary-600">
          {eyebrow}
        </span>
      )}
      <h2 className={cn('font-bold text-gray-900', eyebrow ? 'mt-3' : '', 'text-3xl sm:text-4xl')}>
        {title}
      </h2>
      {subtitle && (
        <p className={cn('mt-4 text-lg text-gray-700', centered && 'mx-auto max-w-2xl')}>
          {subtitle}
        </p>
      )}
    </div>
  )
}

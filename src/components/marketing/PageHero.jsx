import { cn } from '../../utils/helpers'

export default function PageHero({
  badge,
  title,
  highlight,
  subtitle,
  children,
  variant = 'gradient',
  size = 'lg',
  centered = false,
  className,
}) {
  const isGradient = variant === 'gradient'

  return (
    <section
      className={cn(
        'relative overflow-hidden',
        isGradient ? 'gradient-hero hero-pattern text-white' : 'mesh-bg border-b border-gray-100',
        size === 'lg' ? 'py-20 sm:py-28' : 'py-14 sm:py-20',
        className
      )}
    >
      {isGradient && (
        <>
          <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />
        </>
      )}

      <div
        className={cn(
          'relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8',
          centered && 'text-center'
        )}
      >
        {badge && (
          <span
            className={cn(
              'inline-flex items-center rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider',
              isGradient ? 'bg-white/15 text-white backdrop-blur-sm' : 'bg-primary-100 text-primary-700'
            )}
          >
            {badge}
          </span>
        )}
        <h1
          className={cn(
            'mt-4 font-bold leading-tight tracking-tight',
            size === 'lg' ? 'text-4xl sm:text-5xl lg:text-6xl' : 'text-3xl sm:text-4xl',
            isGradient ? 'text-white' : 'text-gray-900',
            centered && 'mx-auto max-w-4xl'
          )}
        >
          {title}{' '}
          {highlight && (
            <span className={isGradient ? 'text-white' : 'text-primary-600'}>{highlight}</span>
          )}
        </h1>
        {subtitle && (
          <p
            className={cn(
              'mt-5 max-w-2xl text-lg leading-relaxed',
              isGradient ? 'text-white/95' : 'text-gray-700',
              centered && 'mx-auto'
            )}
          >
            {subtitle}
          </p>
        )}
        {children && <div className={cn('mt-8', centered && 'flex flex-col items-center')}>{children}</div>}
      </div>
    </section>
  )
}

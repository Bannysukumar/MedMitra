import { cn } from '../../utils/helpers'

export default function AuthCard({ title, subtitle, children, className }) {
  return (
    <div className={cn('w-full', className)}>
      <div className="rounded-2xl border border-gray-100/80 bg-white p-6 shadow-[0_8px_40px_rgba(0,102,255,0.08)] sm:p-8">
        <div className="mb-6 border-b border-gray-100 pb-6">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h2>
          {subtitle && (
            <p className="mt-1.5 text-sm leading-relaxed text-gray-500">{subtitle}</p>
          )}
        </div>
        {children}
      </div>
    </div>
  )
}

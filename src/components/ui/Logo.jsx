import { useState } from 'react'
import { Link } from 'react-router-dom'
import logoSrc from '../../assets/logo.png'
import { cn } from '../../utils/helpers'

const SIZES = {
  sm: 'h-8',
  md: 'h-10',
  lg: 'h-12',
  xl: 'h-14',
}

function LogoMark({ size, className, imgClassName }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <span
        className={cn(
          'inline-flex items-center font-bold tracking-tight text-primary-600',
          SIZES[size],
          className
        )}
      >
        MedMitra
      </span>
    )
  }

  return (
    <img
      src={logoSrc}
      alt="MedMitra"
      onError={() => setFailed(true)}
      className={cn('w-auto object-contain', SIZES[size], imgClassName)}
    />
  )
}

export default function Logo({ to = '/', size = 'md', className, imgClassName, onClick }) {
  const mark = <LogoMark size={size} className={className} imgClassName={imgClassName} />

  if (!to) {
    return <span className={cn('inline-flex shrink-0', className)}>{mark}</span>
  }

  return (
    <Link to={to} onClick={onClick} className={cn('inline-flex shrink-0 items-center', className)}>
      {mark}
    </Link>
  )
}

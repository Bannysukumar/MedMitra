export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function formatCurrency(amount, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount ?? 0)
}

export function formatDate(date) {
  if (!date) return '—'
  const d = date?.toDate ? date.toDate() : new Date(date)
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function calculateBMI(weight, heightCm) {
  if (!weight || !heightCm) return null
  const heightM = heightCm / 100
  return (weight / (heightM * heightM)).toFixed(1)
}

export function formatStatValue(stats, key) {
  return stats?.[key] ?? '—'
}

export function generateOrderId() {
  return `ORD-${Date.now().toString(36).toUpperCase()}`
}

export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
}

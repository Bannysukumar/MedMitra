const todayKey = () => new Date().toISOString().slice(0, 10)
const monthKey = () => new Date().toISOString().slice(0, 7)

function parseDate(value) {
  if (!value) return null
  const d = value?.toDate ? value.toDate() : new Date(value)
  return Number.isNaN(d.getTime()) ? null : d
}

function isToday(value) {
  const d = parseDate(value)
  return d ? d.toISOString().slice(0, 10) === todayKey() : false
}

function isThisMonth(value) {
  const d = parseDate(value)
  return d ? d.toISOString().slice(0, 7) === monthKey() : false
}

function orderRevenue(order) {
  if (order.paymentStatus === 'refunded') return 0
  return Number(order.total) || 0
}

function isActiveUser(user) {
  if (user.accountStatus === 'suspended' || user.accountStatus === 'blocked') return false
  const last = parseDate(user.lastActivity || user.createdAt)
  if (!last) return true
  const days = (Date.now() - last.getTime()) / (1000 * 60 * 60 * 24)
  return days <= 30
}

export function computeAdminMetrics({
  users = [],
  orders = [],
  medicines = [],
  prescriptions = [],
  tickets = [],
  sessions = [],
} = {}) {
  const activeMedicines = medicines.filter((m) => !m.archived)
  const categories = new Set(activeMedicines.map((m) => m.category).filter(Boolean))

  const delivered = orders.filter((o) => o.status === 'delivered')
  const pendingOrders = orders.filter((o) =>
    ['pending', 'confirmed', 'packed', 'processing'].includes(o.status)
  )
  const cancelledOrders = orders.filter((o) => o.status === 'cancelled')
  const approvedRx = prescriptions.filter((o) => o.status === 'approved')
  const rejectedRx = prescriptions.filter((o) => o.status === 'rejected')
  const paidOrders = orders.filter((o) => (o.paymentStatus || 'paid') === 'paid')

  const totalRevenue = paidOrders.reduce((s, o) => s + orderRevenue(o), 0)
  const monthlyRevenue = paidOrders
    .filter((o) => isThisMonth(o.createdAt))
    .reduce((s, o) => s + orderRevenue(o), 0)

  return {
    totalUsers: users.length,
    activeUsers: users.filter(isActiveUser).length,
    newUsersToday: users.filter((u) => isToday(u.createdAt)).length,
    totalMedicines: activeMedicines.length,
    archivedMedicines: medicines.filter((m) => m.archived).length,
    totalCategories: categories.size,
    totalOrders: orders.length,
    pendingOrders: pendingOrders.length,
    deliveredOrders: delivered.length,
    cancelledOrders: cancelledOrders.length,
    totalRevenue,
    monthlyRevenue,
    prescriptionUploads: prescriptions.length,
    approvedPrescriptions: approvedRx.length,
    rejectedPrescriptions: rejectedRx.length,
    supportTickets: tickets.length,
    openTickets: tickets.filter((t) => t.status === 'open' || t.status === 'pending').length,
    activeSessions: sessions.filter((s) => s.active !== false).length,
    lowStockMedicines: activeMedicines.filter((m) => Number(m.stock) > 0 && Number(m.stock) <= 10).length,
    outOfStockMedicines: activeMedicines.filter((m) => Number(m.stock) <= 0).length,
  }
}

export function computeDailyUserGrowth(users, days = 14) {
  const map = {}
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    map[key] = 0
  }
  users.forEach((u) => {
    const key = parseDate(u.createdAt)?.toISOString().slice(0, 10)
    if (key && map[key] != null) map[key] += 1
  })
  return Object.entries(map).map(([date, count]) => ({
    date: date.slice(5),
    users: count,
  }))
}

export function computeMonthlyRevenue(orders, months = 6) {
  const result = []
  for (let i = months - 1; i >= 0; i -= 1) {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    const key = d.toISOString().slice(0, 7)
    const label = d.toLocaleDateString('en-IN', { month: 'short' })
    const revenue = orders
      .filter((o) => (o.createdAt || '').startsWith(key) && (o.paymentStatus || 'paid') === 'paid')
      .reduce((s, o) => s + orderRevenue(o), 0)
    result.push({ month: label, revenue })
  }
  return result
}

export function computeOrderStats(orders) {
  const counts = {}
  orders.forEach((o) => {
    const status = o.status || 'pending'
    counts[status] = (counts[status] || 0) + 1
  })
  return Object.entries(counts).map(([name, value]) => ({ name, value }))
}

export function computePrescriptionStats(prescriptions) {
  const counts = {}
  prescriptions.forEach((rx) => {
    const status = rx.status || 'pending'
    counts[status] = (counts[status] || 0) + 1
  })
  return Object.entries(counts).map(([name, value]) => ({ name, value }))
}

export function computeMedicinePopularity(orders, limit = 8) {
  const map = {}
  orders.forEach((order) => {
    ;(order.items || []).forEach((item) => {
      const name = item.name || item.id
      if (!name) return
      map[name] = (map[name] || 0) + (item.qty || 1)
    })
  })
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, orders]) => ({ name: name.length > 18 ? `${name.slice(0, 18)}…` : name, orders }))
}

export function computeCategoryPerformance(medicines, orders) {
  const medCategory = Object.fromEntries(medicines.map((m) => [m.id, m.category]))
  const map = {}
  orders.forEach((order) => {
    ;(order.items || []).forEach((item) => {
      const cat = medCategory[item.id] || item.category || 'Other'
      map[cat] = (map[cat] || 0) + (item.qty || 1)
    })
  })
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, value]) => ({ name, value }))
}

export function computePrescriptionAnalytics(prescriptions) {
  const total = prescriptions.length || 1
  const approved = prescriptions.filter((r) => r.status === 'approved').length
  const rejected = prescriptions.filter((r) => r.status === 'rejected').length
  const todayUploads = prescriptions.filter((r) => isToday(r.uploadedAt)).length
  return {
    dailyUploads: todayUploads,
    approvalRate: Math.round((approved / total) * 100),
    rejectionRate: Math.round((rejected / total) * 100),
  }
}

export function computeTopUsers(users, orders, limit = 5) {
  const map = {}
  orders.forEach((o) => {
    if (!o.userId) return
    map[o.userId] = (map[o.userId] || 0) + 1
  })
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([uid, orderCount]) => {
      const user = users.find((u) => u.uid === uid)
      return { name: user?.fullName || user?.email || uid.slice(0, 8), orders: orderCount }
    })
}

export function computePaymentReports(orders) {
  const now = new Date()
  const dayKey = todayKey()
  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() - 7)
  const yearStart = `${now.getFullYear()}-01-01`

  const paid = orders.filter((o) => (o.paymentStatus || 'paid') === 'paid')

  return {
    daily: paid.filter((o) => (o.createdAt || '').startsWith(dayKey)).reduce((s, o) => s + orderRevenue(o), 0),
    weekly: paid
      .filter((o) => parseDate(o.createdAt) >= weekStart)
      .reduce((s, o) => s + orderRevenue(o), 0),
    monthly: paid.filter((o) => isThisMonth(o.createdAt)).reduce((s, o) => s + orderRevenue(o), 0),
    annual: paid.filter((o) => (o.createdAt || '') >= yearStart).reduce((s, o) => s + orderRevenue(o), 0),
  }
}

export function computeAiInsights({ medicines = [], orders = [], users = [], prescriptions = [] } = {}) {
  const lowStock = medicines.filter((m) => !m.archived && Number(m.stock) <= 10 && Number(m.stock) > 0)
  const trending = computeMedicinePopularity(orders, 5)
  const cancelRate = orders.length
    ? Math.round((orders.filter((o) => o.status === 'cancelled').length / orders.length) * 100)
    : 0
  const rxPending = prescriptions.filter((r) => ['uploaded', 'pending', 'under_review'].includes(r.status)).length

  return {
    trendingMedicines: trending,
    inventorySuggestions: lowStock.slice(0, 5).map((m) => ({
      name: m.name,
      stock: m.stock,
      suggestion: `Restock ${m.name} — only ${m.stock} units left`,
    })),
    orderTrend: orders.length > 10 ? `${orders.filter((o) => isThisMonth(o.createdAt)).length} orders this month` : 'Collecting order data…',
    userBehavior: `${users.filter(isActiveUser).length} active users in the last 30 days`,
    prescriptionPattern: rxPending ? `${rxPending} prescriptions awaiting review` : 'Prescription queue clear',
    searchAnalytics: trending.length ? `Top seller: ${trending[0].name}` : 'No search trends yet',
    cancelRate,
  }
}

export function exportBackupPayload({ users, medicines, orders, prescriptions, settings }) {
  return {
    exportedAt: new Date().toISOString(),
    users,
    medicines,
    orders,
    prescriptions,
    settings,
    healthRecords: users
      .filter((u) => u.healthRecord)
      .map((u) => ({ uid: u.uid, email: u.email, healthRecord: u.healthRecord })),
  }
}

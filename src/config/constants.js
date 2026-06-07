export const ORDER_STATUSES = {
  pending: { label: 'Pending', color: 'orange' },
  confirmed: { label: 'Confirmed', color: 'blue' },
  packed: { label: 'Packed', color: 'blue' },
  processing: { label: 'Processing', color: 'blue' },
  shipped: { label: 'Shipped', color: 'purple' },
  out_for_delivery: { label: 'Out for Delivery', color: 'purple' },
  delivered: { label: 'Delivered', color: 'green' },
  cancelled: { label: 'Cancelled', color: 'red' },
  refunded: { label: 'Refunded', color: 'gray' },
  returned: { label: 'Returned', color: 'gray' },
}

export const PRESCRIPTION_STATUSES = {
  pending: { label: 'Pending', color: 'orange' },
  uploaded: { label: 'Uploaded', color: 'blue' },
  under_review: { label: 'Under Review', color: 'orange' },
  approved: { label: 'Approved', color: 'green' },
  rejected: { label: 'Rejected', color: 'red' },
}

export const PAYMENT_STATUSES = {
  paid: { label: 'Paid', color: 'green' },
  pending: { label: 'Pending', color: 'orange' },
  failed: { label: 'Failed', color: 'red' },
  refunded: { label: 'Refunded', color: 'gray' },
}

export const USER_ROLES = {
  user: { label: 'User', color: 'gray' },
  doctor: { label: 'Doctor', color: 'blue' },
  admin: { label: 'Admin', color: 'purple' },
}

export const USER_ACCOUNT_STATUSES = {
  active: { label: 'Active', color: 'green' },
  suspended: { label: 'Suspended', color: 'orange' },
  blocked: { label: 'Blocked', color: 'red' },
}

export const TICKET_STATUSES = {
  open: { label: 'Open', color: 'blue' },
  pending: { label: 'Pending', color: 'orange' },
  resolved: { label: 'Resolved', color: 'green' },
  closed: { label: 'Closed', color: 'gray' },
}

export const TICKET_PRIORITIES = {
  low: { label: 'Low', color: 'gray' },
  medium: { label: 'Medium', color: 'blue' },
  high: { label: 'High', color: 'orange' },
  critical: { label: 'Critical', color: 'red' },
}

export const ANNOUNCEMENT_TYPES = {
  information: { label: 'Information', color: 'blue' },
  warning: { label: 'Warning', color: 'orange' },
  maintenance: { label: 'Maintenance', color: 'purple' },
  emergency: { label: 'Emergency', color: 'red' },
}

export const ANNOUNCEMENT_DISPLAY = {
  banner: 'Banner',
  popup: 'Popup',
  dashboard: 'Dashboard Alert',
}

export const FAQ_CATEGORIES = ['orders', 'medicines', 'prescriptions', 'payments', 'account', 'general']

export const MEDICINE_CATEGORIES = [
  'Pain Relief',
  'Diabetes Care',
  'Vitamins',
  'Skin Care',
  'Heart Care',
  "Women's Care",
  "Children's Care",
  'Ayurvedic',
  'Surgical Supplies',
  'Antibiotics',
  'Cold Relief',
]

export const SYMPTOM_MAP = {
  fever: ['Paracetamol', 'Dolo 650', 'Crocin'],
  headache: ['Paracetamol', 'Combiflam', 'Disprin'],
  cold: ['Vicks Action 500', 'Sinarest', 'Benadryl'],
  cough: ['Benadryl', 'Ascoril', 'Corex'],
  pain: ['Ibuprofen', 'Combiflam', 'Volini'],
  allergy: ['Cetirizine', 'Allegra', 'Avil'],
}

export const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Features', path: '/features' },
  { label: 'Medicines', path: '/medicines' },
  { label: 'Pricing', path: '/pricing' },
  { label: 'Team', path: '/team' },
  { label: 'Blog', path: '/blog' },
  { label: 'FAQ', path: '/faq' },
  { label: 'Contact', path: '/contact' },
]

export const SIDEBAR_LINKS = [
  { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'My Orders', path: '/dashboard/orders', icon: 'Package' },
  { label: 'Medicines', path: '/dashboard/medicines', icon: 'Pill' },
  { label: 'Find Nearby', path: '/dashboard/nearby', icon: 'Navigation' },
  { label: 'Doctors', path: '/dashboard/doctors', icon: 'Stethoscope' },
  { label: 'Prescriptions', path: '/dashboard/prescriptions', icon: 'FileText' },
  { label: 'Health Records', path: '/dashboard/health-records', icon: 'HeartPulse' },
  { label: 'Wishlist', path: '/dashboard/wishlist', icon: 'Heart' },
  { label: 'Addresses', path: '/dashboard/addresses', icon: 'MapPin' },
  { label: 'Notifications', path: '/dashboard/notifications', icon: 'Bell' },
  { label: 'Profile Settings', path: '/dashboard/profile', icon: 'Settings' },
  { label: 'Support', path: '/dashboard/support', icon: 'Headphones' },
]

export const ADMIN_NAV_SECTIONS = [
  {
    title: 'Overview',
    links: [
      { label: 'Dashboard', path: '/admin', icon: 'LayoutDashboard' },
      { label: 'Analytics', path: '/admin/analytics', icon: 'BarChart3' },
      { label: 'AI Tools', path: '/admin/ai', icon: 'Sparkles' },
    ],
  },
  {
    title: 'Operations',
    links: [
      { label: 'Users', path: '/admin/users', icon: 'Users' },
      { label: 'Medicines', path: '/admin/medicines', icon: 'Pill' },
      { label: 'Prescriptions', path: '/admin/prescriptions', icon: 'FileText' },
      { label: 'Orders', path: '/admin/orders', icon: 'Package' },
      { label: 'Payments', path: '/admin/payments', icon: 'CreditCard' },
      { label: 'Health Records', path: '/admin/health-records', icon: 'HeartPulse' },
      { label: 'Support', path: '/admin/support', icon: 'Headphones' },
    ],
  },
  {
    title: 'Communication',
    links: [
      { label: 'Content', path: '/admin/content', icon: 'FileEdit' },
      { label: 'Notifications', path: '/admin/notifications', icon: 'Bell' },
      { label: 'Emails', path: '/admin/emails', icon: 'Mail' },
      { label: 'Announcements', path: '/admin/announcements', icon: 'Megaphone' },
    ],
  },
  {
    title: 'Platform',
    links: [
      { label: 'Security', path: '/admin/security', icon: 'Shield' },
      { label: 'Audit Log', path: '/admin/audit-log', icon: 'ScrollText' },
      { label: 'Backup', path: '/admin/backup', icon: 'Database' },
      { label: 'Settings', path: '/admin/settings', icon: 'Settings' },
    ],
  },
]

/** @deprecated use ADMIN_NAV_SECTIONS */
export const ADMIN_LINKS = ADMIN_NAV_SECTIONS.flatMap((s) => s.links)

export const FUTURE_MODULES = [
  'Doctor Consultation Module',
  'Video Consultation',
  'Pharmacy Vendor Panel',
  'Delivery Partner Panel',
  'Medicine Subscription Plans',
  'AI Symptom Checker',
  'Multilingual Support',
  'Android App',
  'iOS App',
  'WhatsApp Integration',
  'SMS Gateway',
  'Telemedicine System',
]

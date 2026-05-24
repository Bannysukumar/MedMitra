export const ORDER_STATUSES = {
  pending: { label: 'Pending', color: 'orange' },
  processing: { label: 'Processing', color: 'blue' },
  shipped: { label: 'Shipped', color: 'purple' },
  delivered: { label: 'Delivered', color: 'green' },
  cancelled: { label: 'Cancelled', color: 'red' },
  returned: { label: 'Returned', color: 'gray' },
}

export const PRESCRIPTION_STATUSES = {
  uploaded: { label: 'Uploaded', color: 'blue' },
  under_review: { label: 'Under Review', color: 'orange' },
  approved: { label: 'Approved', color: 'green' },
  rejected: { label: 'Rejected', color: 'red' },
}

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
  { label: 'Prescriptions', path: '/dashboard/prescriptions', icon: 'FileText' },
  { label: 'Health Records', path: '/dashboard/health-records', icon: 'HeartPulse' },
  { label: 'Wishlist', path: '/dashboard/wishlist', icon: 'Heart' },
  { label: 'Addresses', path: '/dashboard/addresses', icon: 'MapPin' },
  { label: 'Notifications', path: '/dashboard/notifications', icon: 'Bell' },
  { label: 'Profile Settings', path: '/dashboard/profile', icon: 'Settings' },
  { label: 'Support', path: '/dashboard/support', icon: 'Headphones' },
]

export const ADMIN_LINKS = [
  { label: 'Dashboard', path: '/admin', icon: 'LayoutDashboard' },
  { label: 'Users', path: '/admin/users', icon: 'Users' },
  { label: 'Medicines', path: '/admin/medicines', icon: 'Pill' },
  { label: 'Prescriptions', path: '/admin/prescriptions', icon: 'FileText' },
  { label: 'Orders', path: '/admin/orders', icon: 'Package' },
  { label: 'Content', path: '/admin/content', icon: 'FileEdit' },
]

export const DOCTOR_NAV_LINKS = [
  { label: 'Dashboard', path: '/doctor', icon: 'LayoutDashboard' },
  { label: 'Appointments', path: '/doctor/appointments', icon: 'Calendar' },
  { label: 'Patients', path: '/doctor/patients', icon: 'Users' },
  { label: 'Prescriptions', path: '/doctor/prescriptions', icon: 'FileText' },
  { label: 'Reports', path: '/doctor/reports', icon: 'ClipboardList' },
  { label: 'Messages', path: '/doctor/messages', icon: 'MessageSquare', badge: 3 },
  { label: 'Analytics', path: '/doctor/analytics', icon: 'BarChart3' },
  { label: 'Earnings', path: '/doctor/earnings', icon: 'Wallet' },
  { label: 'Doctor Information', path: '/doctor/information', icon: 'UserCircle' },
  { label: 'Settings', path: '/doctor/settings', icon: 'Settings' },
  { label: 'Help & Support', path: '/doctor/help', icon: 'HelpCircle' },
]

export const DOCTOR_INFO_TABS = [
  'Personal Information',
  'Education',
  'Experience',
  'Certificates',
  'Hospital & Clinic',
  'Bank Details',
]

export const PROFILE_COMPLETION_SECTIONS = [
  'Personal Information',
  'Education Details',
  'Experience Details',
  'Certificates Uploaded',
  'Hospital Information',
  'Bank Details Added',
]

export const APPOINTMENT_STATUSES = {
  confirmed: { label: 'Confirmed', color: 'bg-green-100 text-green-700' },
  in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
  waiting: { label: 'Waiting', color: 'bg-orange-100 text-orange-700' },
  upcoming: { label: 'Upcoming', color: 'bg-gray-100 text-gray-600' },
}

export const DOCTOR_QUICK_ACTIONS = [
  { label: 'New Prescription', icon: 'FilePlus2', color: 'bg-blue-50 text-primary-600' },
  { label: 'Add Patient', icon: 'UserPlus', color: 'bg-blue-50 text-primary-600' },
  { label: 'Upload Report', icon: 'Upload', color: 'bg-green-50 text-green-600' },
  { label: 'Video Consultation', icon: 'Video', color: 'bg-purple-50 text-purple-600' },
  { label: 'Patient Messages', icon: 'MessageCircle', color: 'bg-purple-50 text-purple-600' },
  { label: 'Medical Records', icon: 'FolderOpen', color: 'bg-blue-50 text-primary-600' },
]

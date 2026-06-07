import { Routes, Route, Navigate } from 'react-router-dom'
import PublicLayout from './components/layout/PublicLayout'
import AuthLayout from './components/layout/AuthLayout'
import DashboardLayout from './components/layout/DashboardLayout'
import AdminLayout from './components/layout/AdminLayout'
import ProtectedRoute from './routes/ProtectedRoute'
import AdminRoute from './routes/AdminRoute'

import Home from './pages/public/Home'
import About from './pages/public/About'
import Features from './pages/public/Features'
import Medicines from './pages/public/Medicines'
import MedicineDetail from './pages/public/MedicineDetail'
import Pricing from './pages/public/Pricing'
import Team from './pages/public/Team'
import Blog from './pages/public/Blog'
import BlogDetail from './pages/public/BlogDetail'
import FAQ from './pages/public/FAQ'
import Contact from './pages/public/Contact'
import Doctors from './pages/public/Doctors'
import DoctorDetail from './pages/public/DoctorDetail'
import NearbyMedical from './pages/public/NearbyMedical'

import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import ForgotPassword from './pages/auth/ForgotPassword'

import Dashboard from './pages/dashboard/Dashboard'
import MyOrders from './pages/dashboard/MyOrders'
import DashboardMedicines from './pages/dashboard/DashboardMedicines'
import Prescriptions from './pages/dashboard/Prescriptions'
import HealthRecords from './pages/dashboard/HealthRecords'
import Wishlist from './pages/dashboard/Wishlist'
import Addresses from './pages/dashboard/Addresses'
import Notifications from './pages/dashboard/Notifications'
import ProfileSettings from './pages/dashboard/ProfileSettings'
import Support from './pages/dashboard/Support'
import Cart from './pages/dashboard/Cart'
import Checkout from './pages/dashboard/Checkout'
import OrderSuccess from './pages/dashboard/OrderSuccess'

import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminMedicines from './pages/admin/AdminMedicines'
import AdminPrescriptions from './pages/admin/AdminPrescriptions'
import AdminOrders from './pages/admin/AdminOrders'
import AdminContent from './pages/admin/AdminContent'
import AdminAnalytics from './pages/admin/AdminAnalytics'
import AdminPayments from './pages/admin/AdminPayments'
import AdminHealthRecords from './pages/admin/AdminHealthRecords'
import AdminSupport from './pages/admin/AdminSupport'
import AdminNotifications from './pages/admin/AdminNotifications'
import AdminEmails from './pages/admin/AdminEmails'
import AdminAnnouncements from './pages/admin/AdminAnnouncements'
import AdminSecurity from './pages/admin/AdminSecurity'
import AdminAuditLog from './pages/admin/AdminAuditLog'
import AdminBackup from './pages/admin/AdminBackup'
import AdminSettings from './pages/admin/AdminSettings'
import AdminAI from './pages/admin/AdminAI'

import DoctorLogin from './pages/doctor/DoctorLogin'
import DoctorDashboard from './pages/doctor/DoctorDashboard'
import DoctorInformation from './pages/doctor/DoctorInformation'
import DoctorPlaceholder from './pages/doctor/DoctorPlaceholder'
import DoctorRoute from './routes/DoctorRoute'
import DoctorLayout from './components/layout/DoctorLayout'

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="features" element={<Features />} />
        <Route path="medicines" element={<Medicines />} />
        <Route path="medicines/:id" element={<MedicineDetail />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="team" element={<Team />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:slug" element={<BlogDetail />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="contact" element={<Contact />} />
        <Route path="doctors" element={<Doctors />} />
        <Route path="doctors/:doctorId" element={<DoctorDetail />} />
        <Route path="nearby" element={<NearbyMedical />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
      </Route>

      <Route
        path="dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="orders" element={<MyOrders />} />
        <Route path="medicines" element={<DashboardMedicines />} />
        <Route path="prescriptions" element={<Prescriptions />} />
        <Route path="health-records" element={<HealthRecords />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="addresses" element={<Addresses />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="profile" element={<ProfileSettings />} />
        <Route path="support" element={<Support />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="order-success" element={<OrderSuccess />} />
        <Route path="nearby" element={<NearbyMedical />} />
        <Route path="doctors" element={<Doctors />} />
        <Route path="doctors/:doctorId" element={<DoctorDetail />} />
      </Route>

      <Route path="admin/login" element={<AdminLogin />} />

      <Route
        path="admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="ai" element={<AdminAI />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="medicines" element={<AdminMedicines />} />
        <Route path="prescriptions" element={<AdminPrescriptions />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="health-records" element={<AdminHealthRecords />} />
        <Route path="support" element={<AdminSupport />} />
        <Route path="content" element={<AdminContent />} />
        <Route path="notifications" element={<AdminNotifications />} />
        <Route path="emails" element={<AdminEmails />} />
        <Route path="announcements" element={<AdminAnnouncements />} />
        <Route path="security" element={<AdminSecurity />} />
        <Route path="audit-log" element={<AdminAuditLog />} />
        <Route path="backup" element={<AdminBackup />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      <Route path="doctor/login" element={<DoctorLogin />} />

      <Route
        path="doctor"
        element={
          <DoctorRoute>
            <DoctorLayout />
          </DoctorRoute>
        }
      >
        <Route index element={<DoctorDashboard />} />
        <Route path="appointments" element={<DoctorPlaceholder title="Appointments" description="Manage your full appointment schedule." />} />
        <Route path="patients" element={<DoctorPlaceholder title="Patients" description="View and manage your patient records." />} />
        <Route path="prescriptions" element={<DoctorPlaceholder title="Prescriptions" description="Create and review patient prescriptions." />} />
        <Route path="reports" element={<DoctorPlaceholder title="Reports" description="Upload and review medical reports." />} />
        <Route path="messages" element={<DoctorPlaceholder title="Messages" description="Patient messaging center." />} />
        <Route path="analytics" element={<DoctorPlaceholder title="Analytics" description="Practice performance insights." />} />
        <Route path="earnings" element={<DoctorPlaceholder title="Earnings" description="Track your consultation earnings." />} />
        <Route path="information" element={<DoctorInformation />} />
        <Route path="settings" element={<DoctorPlaceholder title="Settings" description="Doctor profile and practice settings." />} />
        <Route path="help" element={<DoctorPlaceholder title="Help & Support" description="Get help with the doctor portal." />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

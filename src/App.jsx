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
        <Route path="users" element={<AdminUsers />} />
        <Route path="medicines" element={<AdminMedicines />} />
        <Route path="prescriptions" element={<AdminPrescriptions />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="content" element={<AdminContent />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

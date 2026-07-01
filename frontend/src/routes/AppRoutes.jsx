import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute from '../components/common/ProtectedRoute';

import Home from '../pages/public/Home';
import About from '../pages/public/About';
import Packages from '../pages/public/Packages';
import PackageDetail from '../pages/public/PackageDetail';
import Hotels from '../pages/public/Hotels';
import HotelDetail from '../pages/public/HotelDetail';
import CharDham from '../pages/public/CharDham';
import Contact from '../pages/public/Contact';
import Gallery from '../pages/public/Gallery';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import VerifyOtp from '../pages/auth/VerifyOtp';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';

import UserDashboard from '../pages/user/Dashboard';
import MyBookings from '../pages/user/MyBookings';
import BookingDetail from '../pages/user/BookingDetail';
import Profile from '../pages/user/Profile';

import AdminDashboard from '../pages/admin/Dashboard';
import AdminUsers from '../pages/admin/Users';
import AdminUserDetail from '../pages/admin/UserDetail';
import AdminPackages from '../pages/admin/Packages';
import AdminHotels from '../pages/admin/Hotels';
import AdminBookings from '../pages/admin/Bookings';
import AdminBookingDetail from '../pages/admin/BookingDetail';
import AdminContacts from '../pages/admin/Contacts';
import AdminAnalytics from '../pages/admin/Analytics';

const AppRoutes = () => {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/about" element={<MainLayout><About /></MainLayout>} />
        <Route path="/packages" element={<MainLayout><Packages /></MainLayout>} />
        <Route path="/packages/:slug" element={<MainLayout><PackageDetail /></MainLayout>} />
        <Route path="/hotels" element={<MainLayout><Hotels /></MainLayout>} />
        <Route path="/hotels/:id" element={<MainLayout><HotelDetail /></MainLayout>} />
        <Route path="/char-dham" element={<MainLayout><CharDham /></MainLayout>} />
        <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
        <Route path="/gallery" element={<MainLayout><Gallery /></MainLayout>} />

        <Route path="/login" element={
          <AuthLayout title="Welcome Back" subtitle="Login to manage your bookings"><Login /></AuthLayout>
        } />
        <Route path="/register" element={
          <AuthLayout title="Create Account" subtitle="Begin your spiritual journey"><Register /></AuthLayout>
        } />
        <Route path="/verify-otp" element={
          <AuthLayout title="Verify Email" subtitle="Enter the OTP sent to your email"><VerifyOtp /></AuthLayout>
        } />
        <Route path="/forgot-password" element={
          <AuthLayout title="Reset Password" subtitle="We'll send you an OTP"><ForgotPassword /></AuthLayout>
        } />
        <Route path="/reset-password" element={
          <AuthLayout title="New Password" subtitle="Enter OTP and new password"><ResetPassword /></AuthLayout>
        } />

        <Route path="/dashboard" element={
          <ProtectedRoute><DashboardLayout><UserDashboard /></DashboardLayout></ProtectedRoute>
        } />
        <Route path="/dashboard/bookings" element={
          <ProtectedRoute><DashboardLayout><MyBookings /></DashboardLayout></ProtectedRoute>
        } />
        <Route path="/dashboard/bookings/:id" element={
          <ProtectedRoute><DashboardLayout><BookingDetail /></DashboardLayout></ProtectedRoute>
        } />
        <Route path="/dashboard/profile" element={
          <ProtectedRoute><DashboardLayout><Profile /></DashboardLayout></ProtectedRoute>
        } />

        <Route path="/admin/dashboard" element={
          <ProtectedRoute adminOnly><DashboardLayout><AdminDashboard /></DashboardLayout></ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute adminOnly><DashboardLayout><AdminUsers /></DashboardLayout></ProtectedRoute>
        } />
        <Route path="/admin/users/:id" element={
          <ProtectedRoute adminOnly><DashboardLayout><AdminUserDetail /></DashboardLayout></ProtectedRoute>
        } />
        <Route path="/admin/packages" element={
          <ProtectedRoute adminOnly><DashboardLayout><AdminPackages /></DashboardLayout></ProtectedRoute>
        } />
        <Route path="/admin/hotels" element={
          <ProtectedRoute adminOnly><DashboardLayout><AdminHotels /></DashboardLayout></ProtectedRoute>
        } />
        <Route path="/admin/bookings" element={
          <ProtectedRoute adminOnly><DashboardLayout><AdminBookings /></DashboardLayout></ProtectedRoute>
        } />
        <Route path="/admin/bookings/:id" element={
          <ProtectedRoute adminOnly><DashboardLayout><AdminBookingDetail /></DashboardLayout></ProtectedRoute>
        } />
        <Route path="/admin/contacts" element={
          <ProtectedRoute adminOnly><DashboardLayout><AdminContacts /></DashboardLayout></ProtectedRoute>
        } />
        <Route path="/admin/analytics" element={
          <ProtectedRoute adminOnly><DashboardLayout><AdminAnalytics /></DashboardLayout></ProtectedRoute>
        } />

        <Route path="*" element={
          <MainLayout>
            <div className="container section" style={{ textAlign: 'center', padding: '6rem 0' }}>
              <h1 style={{ fontSize: '4rem', color: 'var(--color-primary)' }}>404</h1>
              <p style={{ color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>Page not found</p>
            </div>
          </MainLayout>
        } />
      </Routes>
    </AnimatePresence>
  );
};

export default AppRoutes;

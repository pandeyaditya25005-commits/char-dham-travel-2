import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAuth from '../hooks/useAuth';

const userNavItems = [
  { path: '/dashboard', label: 'Overview', icon: '📊' },
  { path: '/dashboard/bookings', label: 'My Bookings', icon: '📋' },
  { path: '/dashboard/profile', label: 'Profile', icon: '👤' },
];

const adminNavItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/admin/users', label: 'Users', icon: '👥' },
  { path: '/admin/packages', label: 'Packages', icon: '🎒' },
  { path: '/admin/hotels', label: 'Hotels', icon: '🏨' },
  { path: '/admin/bookings', label: 'Bookings', icon: '📋' },
  { path: '/admin/contacts', label: 'Contacts', icon: '✉️' },
  { path: '/admin/analytics', label: 'Analytics', icon: '📈' },
];

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAdmin, user, logout } = useAuth();
  const location = useLocation();

  const navItems = isAdmin ? adminNavItems : userNavItems;
  const isActive = (path) => location.pathname === path;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        style={{
          width: 280,
          background: '#0f172a',
          color: '#cbd5e1',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 100,
          overflowY: 'auto',
        }}
      >
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #1e293b' }}>
          <Link to="/" style={{
            fontSize: '1.25rem',
            fontWeight: 800,
            color: 'white',
            textDecoration: 'none',
          }}>
            <span style={{ color: '#3b82f6' }}>Char</span>Dham
          </Link>
        </div>

        <nav style={{ flex: 1, padding: '1rem 0' }}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1.5rem',
                color: isActive(item.path) ? '#3b82f6' : '#94a3b8',
                fontWeight: isActive(item.path) ? 600 : 400,
                background: isActive(item.path) ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                borderRight: isActive(item.path) ? '3px solid #3b82f6' : '3px solid transparent',
                fontSize: '0.9rem',
                transition: 'all 0.15s',
              }}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #1e293b' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '0.75rem',
          }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 700,
              fontSize: '0.875rem',
            }}>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <div style={{ color: 'white', fontSize: '0.875rem', fontWeight: 600 }}>
                {user?.name || 'User'}
              </div>
              <div style={{ color: '#64748b', fontSize: '0.75rem' }}>
                {isAdmin ? 'Administrator' : 'Traveler'}
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: 'var(--radius-md)',
              color: '#ef4444',
              fontSize: '0.875rem',
              fontWeight: 500,
              textAlign: 'center',
            }}
          >
            Logout
          </button>
        </div>
      </motion.aside>

      <div style={{ marginLeft: 280, flex: 1, minHeight: '100vh', background: 'var(--color-bg-secondary)' }}>
        <header style={{
          height: 64,
          background: 'var(--color-bg)',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2rem',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ padding: '0.5rem', color: 'var(--color-text)' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <Link to="/" style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
            View Site →
          </Link>
        </header>

        <main style={{ padding: '2rem' }}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            {children}
          </motion.div>
        </main>
      </div>

      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 99,
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardLayout;

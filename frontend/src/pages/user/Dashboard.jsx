import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuth from '../../hooks/useAuth';
import { getMyBookings } from '../../services/bookingService';
import Loader from '../../components/common/Loader';
import { formatCurrency, formatDateShort, getStatusColor } from '../../utils/formatters';

const UserDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getMyBookings({ limit: 100 }),
      getMyBookings({ limit: 5 }),
    ]).then(([all, recentData]) => {
      const bookings = all.bookings || [];
      setStats({
        total: all.total,
        pending: bookings.filter(b => b.status === 'pending').length,
        confirmed: bookings.filter(b => b.status === 'confirmed').length,
        completed: bookings.filter(b => b.status === 'completed').length,
        spent: bookings.reduce((s, b) => s + b.totalAmount, 0),
      });
      setRecent(recentData.bookings || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  const cards = [
    { label: 'Total Bookings', value: stats?.total || 0, icon: '📋', color: '#3b82f6' },
    { label: 'Active', value: stats?.confirmed || 0, icon: '✅', color: '#10b981' },
    { label: 'Completed', value: stats?.completed || 0, icon: '🎉', color: '#8b5cf6' },
    { label: 'Total Spent', value: formatCurrency(stats?.spent || 0), icon: '💰', color: '#f59e0b' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: 4 }}>Welcome, {user?.name?.split(' ')[0]}!</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 28, fontSize: '0.9rem' }}>Here's your travel overview</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        {cards.map((c, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} style={{ background: 'var(--color-bg)', borderRadius: 12, padding: '1.25rem', border: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
              <span style={{ fontSize: '1.5rem' }}>{c.icon}</span>
              <span style={{ color: c.color, fontWeight: 700, fontSize: '1.25rem' }}>{typeof c.value === 'number' ? c.value : c.value}</span>
            </div>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>{c.label}</p>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, alignItems: 'start' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: '1.15rem' }}>Recent Bookings</h2>
            <Link to="/dashboard/bookings" style={{ color: 'var(--color-primary)', fontSize: '0.85rem', fontWeight: 600 }}>View All →</Link>
          </div>
          {recent.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)', background: 'var(--color-bg)', borderRadius: 12, border: '1px solid var(--color-border)' }}>
              <p style={{ marginBottom: 12 }}>No bookings yet</p>
              <Link to="/packages" className="btn btn-primary btn-sm">Browse Packages</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {recent.map(b => (
                <Link key={b._id} to={`/dashboard/bookings/${b._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', background: 'var(--color-bg)', borderRadius: 10, border: '1px solid var(--color-border)', transition: 'box-shadow 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = ''}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{b.bookingId}</div>
                      <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', marginTop: 2 }}>{b.type === 'package' ? 'Tour Package' : 'Hotel'} • {formatDateShort(b.travelDate)}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ color: 'var(--color-text-secondary)', fontWeight: 600, fontSize: '0.9rem' }}>{formatCurrency(b.totalAmount)}</span>
                      <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', color: 'white', background: getStatusColor(b.status) }}>{b.status}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 style={{ fontSize: '1.15rem', marginBottom: 16 }}>Quick Actions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { to: '/packages', label: 'Book a Tour Package', icon: '🎒', color: '#3b82f6' },
              { to: '/hotels', label: 'Book a Hotel', icon: '🏨', color: '#10b981' },
              { to: '/dashboard/profile', label: 'Update Profile', icon: '👤', color: '#f59e0b' },
            ].map((a, i) => (
              <Link key={i} to={a.to} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '1rem 1.25rem', background: 'var(--color-bg)', borderRadius: 10, border: '1px solid var(--color-border)', textDecoration: 'none', color: 'inherit', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = a.color; e.currentTarget.style.transform = 'translateX(4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.transform = ''; }}>
                <span style={{ fontSize: '1.25rem' }}>{a.icon}</span>
                <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{a.label}</span>
                <span style={{ marginLeft: 'auto', color: 'var(--color-text-muted)' }}>→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UserDashboard;

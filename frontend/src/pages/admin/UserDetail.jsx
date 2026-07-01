import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getUserById } from '../../services/adminService';
import Loader from '../../components/common/Loader';
import { formatDate, formatCurrency, getStatusColor } from '../../utils/formatters';

const UserDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserById(id)
      .then((data) => setData(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  if (!data) return <p>User not found</p>;

  const { user, adminProfile, bookingStats, recentBookings } = data;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Link to="/admin/users" style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', display: 'inline-block', marginBottom: 16 }}>← Back to Users</Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28, padding: '1.5rem', background: 'var(--color-bg)', borderRadius: 12, border: '1px solid var(--color-border)' }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.5rem', fontWeight: 700 }}>{user.name?.charAt(0)?.toUpperCase()}</div>
        <div>
          <h1 style={{ fontSize: '1.25rem' }}>{user.name}</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>{user.email} • {user.phone || 'No phone'}</p>
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <span style={{ padding: '2px 10px', borderRadius: 12, fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', background: user.role === 'admin' ? '#dbeafe' : '#f3f4f6', color: user.role === 'admin' ? '#1d4ed8' : '#6b7280' }}>{user.role}</span>
            <span style={{ padding: '2px 10px', borderRadius: 12, fontSize: '0.7rem', fontWeight: 600, background: user.isVerified ? '#ecfdf5' : '#fef2f2', color: user.isVerified ? '#059669' : '#dc2626' }}>{user.isVerified ? 'Verified' : 'Unverified'}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Total Bookings', value: bookingStats.totalBookings, icon: '📋' },
          { label: 'Confirmed', value: bookingStats.confirmedBookings, icon: '✅' },
          { label: 'Completed', value: bookingStats.completedBookings, icon: '🎉' },
          { label: 'Total Spent', value: formatCurrency(bookingStats.totalSpent), icon: '💰' },
        ].map((s, i) => (
          <div key={i} style={{ padding: '1rem', background: 'var(--color-bg)', borderRadius: 10, border: '1px solid var(--color-border)' }}>
            <div style={{ fontSize: '1.25rem', marginBottom: 4 }}>{s.icon}</div>
            <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary)' }}>{s.value}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {recentBookings.length > 0 && (
        <div style={{ background: 'var(--color-bg)', borderRadius: 12, border: '1px solid var(--color-border)', padding: '1.25rem' }}>
          <h3 style={{ fontSize: '0.95rem', marginBottom: 12 }}>Recent Bookings</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {recentBookings.map(b => (
              <Link key={b._id} to={`/admin/bookings/${b._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: 8, background: 'var(--color-bg-secondary)', fontSize: '0.85rem' }}>
                  <div>
                    <span style={{ fontWeight: 600 }}>{b.bookingId}</span>
                    <span style={{ color: 'var(--color-text-muted)', marginLeft: 8, fontSize: '0.8rem' }}>{b.type === 'package' ? 'Tour' : 'Hotel'} • {formatDate(b.travelDate)}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{formatCurrency(b.totalAmount)}</span>
                    <span style={{ padding: '2px 8px', borderRadius: 12, fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', color: 'white', background: getStatusColor(b.status) }}>{b.status}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default UserDetail;

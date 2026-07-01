import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getDashboardStats } from '../../services/adminService';
import Loader from '../../components/common/Loader';
import { formatCurrency, formatDateShort, getStatusColor } from '../../utils/formatters';

const SimpleBar = ({ data, color = '#3b82f6', height = 160 }) => {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'end', gap: 4, height, paddingTop: 8 }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>{d.value}</span>
          <motion.div initial={{ height: 0 }} animate={{ height: `${(d.value / max) * 100}%` }} transition={{ duration: 0.5, delay: i * 0.02 }} style={{ width: '100%', maxWidth: 40, borderRadius: '4px 4px 0 0', background: color }} />
          <span style={{ fontSize: '0.6rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap', transform: 'rotate(-45deg)', marginTop: 4 }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
};

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then((data) => setData(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (!data) return <p>Failed to load dashboard</p>;

  const { stats, statusDistribution, recentBookings, recentContacts } = data;
  const statusData = (statusDistribution || []).map(s => ({ label: s.status, value: s.count, color: getStatusColor(s.status) }));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: '1.5rem' }}>Admin Dashboard</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>Platform overview and analytics</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 28 }}>
        {[
          { label: 'Total Users', value: stats.users.total, icon: '👥', color: '#3b82f6' },
          { label: 'Total Bookings', value: stats.bookings.total, icon: '📋', color: '#10b981' },
          { label: 'Pending', value: stats.bookings.pending, icon: '⏳', color: '#f59e0b' },
          { label: 'Revenue', value: formatCurrency(stats.revenue.total), icon: '💰', color: '#8b5cf6' },
          { label: 'Active Packages', value: stats.inventory.packages, icon: '🎒', color: '#ec4899' },
          { label: 'Active Hotels', value: stats.inventory.hotels, icon: '🏨', color: '#14b8a6' },
          { label: 'Unread Contacts', value: stats.contacts.unread, icon: '✉️', color: '#f97316' },
        ].map((c, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} style={{ background: 'var(--color-bg)', borderRadius: 10, padding: '1rem', border: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: '1.25rem' }}>{c.icon}</span>
              <span style={{ color: c.color, fontWeight: 700, fontSize: '1.15rem' }}>{typeof c.value === 'number' ? c.value.toLocaleString() : c.value}</span>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{c.label}</p>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <div style={{ background: 'var(--color-bg)', borderRadius: 12, border: '1px solid var(--color-border)', padding: '1.25rem' }}>
          <h3 style={{ fontSize: '0.95rem', marginBottom: 16 }}>Booking Status Distribution</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(statusDistribution || []).map(s => (
              <div key={s.status}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: 4 }}>
                  <span style={{ textTransform: 'capitalize' }}>{s.status}</span>
                  <span style={{ fontWeight: 600 }}>{s.count}</span>
                </div>
                <div style={{ height: 6, background: 'var(--color-bg-tertiary)', borderRadius: 3, overflow: 'hidden' }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(s.count / Math.max(...statusDistribution.map(x => x.count), 1)) * 100}%` }} transition={{ duration: 0.8 }} style={{ height: '100%', borderRadius: 3, background: getStatusColor(s.status) }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: 'var(--color-bg)', borderRadius: 12, border: '1px solid var(--color-border)', padding: '1.25rem' }}>
          <h3 style={{ fontSize: '0.95rem', marginBottom: 16 }}>Revenue Overview</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { label: 'Total', value: formatCurrency(stats.revenue.total), color: '#3b82f6' },
              { label: 'This Month', value: formatCurrency(stats.revenue.thisMonth), color: '#10b981' },
              { label: 'Today', value: formatCurrency(stats.revenue.today), color: '#f59e0b' },
              { label: 'Bookings Today', value: stats.bookings.today, color: '#8b5cf6' },
            ].map((r, i) => (
              <div key={i} style={{ padding: '0.75rem', borderRadius: 8, background: 'var(--color-bg-secondary)' }}>
                <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{r.label}</p>
                <p style={{ fontWeight: 700, fontSize: '1rem', color: r.color }}>{r.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={{ background: 'var(--color-bg)', borderRadius: 12, border: '1px solid var(--color-border)', padding: '1.25rem' }}>
          <h3 style={{ fontSize: '0.95rem', marginBottom: 12 }}>Recent Bookings</h3>
          {(recentBookings || []).length === 0 ? <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>No recent bookings</p> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {recentBookings.slice(0, 5).map(b => (
                <div key={b._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderRadius: 8, background: 'var(--color-bg-secondary)', fontSize: '0.8rem' }}>
                  <div>
                    <span style={{ fontWeight: 600 }}>{b.bookingId}</span>
                    <span style={{ color: 'var(--color-text-muted)', marginLeft: 8 }}>{b.userId?.name || 'Unknown'}</span>
                  </div>
                  <span style={{ padding: '2px 8px', borderRadius: 12, fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', color: 'white', background: getStatusColor(b.status) }}>{b.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ background: 'var(--color-bg)', borderRadius: 12, border: '1px solid var(--color-border)', padding: '1.25rem' }}>
          <h3 style={{ fontSize: '0.95rem', marginBottom: 12 }}>Unread Contacts</h3>
          {(recentContacts || []).length === 0 ? <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>No unread messages</p> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {recentContacts.slice(0, 5).map(c => (
                <div key={c._id} style={{ padding: '8px 12px', borderRadius: 8, background: 'var(--color-bg-secondary)', fontSize: '0.8rem' }}>
                  <div style={{ fontWeight: 600 }}>{c.name}</div>
                  <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>{c.subject}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;

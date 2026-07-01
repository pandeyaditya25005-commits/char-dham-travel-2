import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getRevenueAnalytics, getReportTrends } from '../../services/adminService';
import Loader from '../../components/common/Loader';
import { formatCurrency } from '../../utils/formatters';

const MiniBar = ({ data, color = '#3b82f6', height = 120 }) => {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'end', gap: 3, height, paddingTop: 4 }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontSize: '0.55rem', color: 'var(--color-text-muted)', fontWeight: 600, marginBottom: 2 }}>{d.value}</span>
          <motion.div initial={{ height: 0 }} animate={{ height: `${Math.max((d.value / max) * 100, 4)}%` }} transition={{ duration: 0.6, delay: i * 0.01 }} style={{ width: '100%', borderRadius: '3px 3px 0 0', background: color }} />
          <span style={{ fontSize: '0.5rem', color: 'var(--color-text-muted)', marginTop: 2, whiteSpace: 'nowrap', transform: 'rotate(-45deg)' }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
};

const Analytics = () => {
  const [revenue, setRevenue] = useState(null);
  const [trends, setTrends] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('revenue');

  useEffect(() => {
    Promise.all([
      getRevenueAnalytics(),
      getReportTrends(),
    ]).then(([rev, tr]) => {
      setRevenue(rev.analytics);
      setTrends(tr.trends);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  const monthly = revenue?.monthlyRevenue || [];
  const revData = monthly.map(m => ({ label: m.label?.split(' ')[0] || '', value: m.revenue }));
  const bookingTrend = trends?.bookingTrends?.map(m => ({ label: m.label?.split(' ')[0] || '', value: m.count })) || [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: 4 }}>Analytics & Reports</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24, fontSize: '0.9rem' }}>Revenue insights and performance trends</p>

      {/* Revenue Summary */}
      {revenue?.summary && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 24 }}>
          {[
            { label: 'Total Revenue', value: formatCurrency(revenue.summary.totalRevenue), icon: '💰', color: '#3b82f6' },
            { label: 'Total Bookings', value: revenue.summary.totalBookings, icon: '📋', color: '#10b981' },
            { label: 'Avg. Order Value', value: formatCurrency(revenue.summary.averageOrderValue), icon: '📊', color: '#f59e0b' },
            { label: 'Period', value: revenue.summary.period, icon: '📅', color: '#8b5cf6' },
          ].map((s, i) => (
            <div key={i} style={{ padding: '1rem', background: 'var(--color-bg)', borderRadius: 10, border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: '1.25rem', marginBottom: 4 }}>{s.icon}</div>
              <p style={{ fontSize: '1.1rem', fontWeight: 700, color: s.color }}>{s.value}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        {['revenue', 'bookings', 'packages', 'hotels'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: '8px 20px', borderRadius: 8, fontSize: '0.85rem', fontWeight: 600, textTransform: 'capitalize', background: tab === t ? 'var(--color-primary)' : 'var(--color-bg-tertiary)', color: tab === t ? 'white' : 'var(--color-text-secondary)' }}>{t}</button>
        ))}
      </div>

      {/* Revenue Chart */}
      {tab === 'revenue' && (
        <div style={{ background: 'var(--color-bg)', borderRadius: 12, border: '1px solid var(--color-border)', padding: '1.5rem', marginBottom: 20 }}>
          <h3 style={{ fontSize: '0.95rem', marginBottom: 4 }}>Monthly Revenue Trend</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', marginBottom: 20 }}>Last {monthly.length} months</p>
          {revData.length > 0 ? <MiniBar data={revData} color="#3b82f6" height={160} /> : <p style={{ color: 'var(--color-text-muted)' }}>No revenue data</p>}
        </div>
      )}

      {/* Booking Trends */}
      {tab === 'bookings' && (
        <div style={{ background: 'var(--color-bg)', borderRadius: 12, border: '1px solid var(--color-border)', padding: '1.5rem', marginBottom: 20 }}>
          <h3 style={{ fontSize: '0.95rem', marginBottom: 4 }}>Booking Trends</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', marginBottom: 20 }}>Monthly booking volume</p>
          {bookingTrend.length > 0 ? <MiniBar data={bookingTrend} color="#10b981" height={160} /> : <p style={{ color: 'var(--color-text-muted)' }}>No booking trend data</p>}
        </div>
      )}

      {/* Revenue by Package */}
      {tab === 'packages' && (
        <div style={{ background: 'var(--color-bg)', borderRadius: 12, border: '1px solid var(--color-border)', padding: '1.5rem', marginBottom: 20 }}>
          <h3 style={{ fontSize: '0.95rem', marginBottom: 12 }}>Revenue by Package</h3>
          {(revenue?.revenueByPackage || []).length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)' }}>No package revenue data</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {revenue.revenueByPackage.map((p, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: 8, background: 'var(--color-bg-secondary)', fontSize: '0.85rem' }}>
                  <div>
                    <span style={{ fontWeight: 600 }}>{p.packageTitle || 'Unknown'}</span>
                    <span style={{ color: 'var(--color-text-muted)', marginLeft: 8 }}>{p.bookings} booking(s) • {p.persons} person(s)</span>
                  </div>
                  <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{formatCurrency(p.revenue)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Revenue by Hotel */}
      {tab === 'hotels' && (
        <div style={{ background: 'var(--color-bg)', borderRadius: 12, border: '1px solid var(--color-border)', padding: '1.5rem', marginBottom: 20 }}>
          <h3 style={{ fontSize: '0.95rem', marginBottom: 12 }}>Revenue by Hotel</h3>
          {(revenue?.revenueByHotel || []).length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)' }}>No hotel revenue data</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {revenue.revenueByHotel.map((h, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: 8, background: 'var(--color-bg-secondary)', fontSize: '0.85rem' }}>
                  <div>
                    <span style={{ fontWeight: 600 }}>{h.hotelName || 'Unknown'}</span>
                    <span style={{ color: 'var(--color-text-muted)', marginLeft: 8 }}>📍 {h.hotelLocation || ''} • {h.bookings} booking(s)</span>
                  </div>
                  <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{formatCurrency(h.revenue)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Popular Packages */}
      {tab === 'revenue' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div style={{ background: 'var(--color-bg)', borderRadius: 12, border: '1px solid var(--color-border)', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '0.95rem', marginBottom: 12 }}>Popular Packages</h3>
            {(trends?.popularPackages || []).length === 0 ? (
              <p style={{ color: 'var(--color-text-muted)' }}>No data</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {trends.popularPackages.map((p, i) => (
                  <div key={p._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: 8, background: 'var(--color-bg-secondary)', fontSize: '0.85rem' }}>
                    <div>
                      <span style={{ fontWeight: 600 }}>{p.title}</span>
                      <span style={{ color: 'var(--color-text-muted)', marginLeft: 8 }}>{p.difficulty}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{formatCurrency(p.price)}</span>
                      <span style={{ padding: '2px 8px', borderRadius: 12, fontSize: '0.65rem', fontWeight: 600, background: '#dbeafe', color: '#1d4ed8' }}>{p.totalBookings} booked</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ background: 'var(--color-bg)', borderRadius: 12, border: '1px solid var(--color-border)', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '0.95rem', marginBottom: 12 }}>Status Distribution</h3>
            {(revenue?.statusDistribution || []).length === 0 ? (
              <p style={{ color: 'var(--color-text-muted)' }}>No data</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {revenue.statusDistribution.map(s => (
                  <div key={s.status}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: 4 }}>
                      <span style={{ textTransform: 'capitalize' }}>{s.status}</span>
                      <span style={{ fontWeight: 600 }}>{s.count} • {formatCurrency(s.totalAmount)}</span>
                    </div>
                    <div style={{ height: 6, background: 'var(--color-bg-tertiary)', borderRadius: 3, overflow: 'hidden' }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${(s.count / Math.max(...revenue.statusDistribution.map(x => x.count), 1)) * 100}%` }} transition={{ duration: 0.8 }} style={{ height: '100%', borderRadius: 3, background: s.status === 'confirmed' ? '#10b981' : s.status === 'pending' ? '#f59e0b' : s.status === 'cancelled' ? '#ef4444' : '#3b82f6' }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Analytics;

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getMyBookings, cancelBooking } from '../../services/bookingService';
import Loader from '../../components/common/Loader';
import { formatCurrency, formatDateShort, getStatusColor } from '../../utils/formatters';

const statusList = ['all', 'pending', 'confirmed', 'cancelled', 'completed'];

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [cancelling, setCancelling] = useState(null);
  const limit = 10;

  const fetch = () => {
    setLoading(true);
    const params = { page, limit };
    if (filter !== 'all') params.status = filter;
    getMyBookings(params)
      .then((data) => { setBookings(data.bookings); setTotal(data.total); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, [page, filter]);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    setCancelling(id);
    try {
      await cancelBooking(id);
      fetch();
    } catch (err) { alert(err.message); }
    finally { setCancelling(null); }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: 4 }}>My Bookings</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24, fontSize: '0.9rem' }}>Manage your tour and hotel bookings</p>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
        {statusList.map(s => (
          <button key={s} onClick={() => { setFilter(s); setPage(1); }} style={{
            padding: '6px 16px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600,
            background: filter === s ? 'var(--color-primary)' : 'var(--color-bg-tertiary)',
            color: filter === s ? 'white' : 'var(--color-text-secondary)',
            textTransform: 'capitalize', transition: 'all 0.2s',
          }}>{s}</button>
        ))}
      </div>

      {loading ? <Loader /> : bookings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-muted)' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>📋</div>
          <p>No bookings found</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {bookings.map(b => (
            <motion.div key={b._id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'var(--color-bg)', borderRadius: 12, border: '1px solid var(--color-border)', padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{b.bookingId}</span>
                    <span style={{ padding: '2px 10px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', color: 'white', background: getStatusColor(b.status) }}>{b.status}</span>
                  </div>
                  <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
                    {b.type === 'package' ? '🎒 Tour Package' : '🏨 Hotel'} • {formatDateShort(b.travelDate)} - {formatDateShort(b.endDate)} • {b.numberOfPersons} person(s)
                  </div>
                  {b.packageId && <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 2 }}>{b.packageId.title}</div>}
                  {b.hotelId && <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 2 }}>{b.hotelId.name}</div>}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '1.05rem' }}>{formatCurrency(b.totalAmount)}</div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <Link to={`/dashboard/bookings/${b._id}`} className="btn btn-sm btn-outline" style={{ fontSize: '0.75rem', padding: '4px 12px' }}>View</Link>
                    {b.status === 'pending' && (
                      <button onClick={() => handleCancel(b._id)} disabled={cancelling === b._id} className="btn btn-sm btn-danger" style={{ fontSize: '0.75rem', padding: '4px 12px', opacity: cancelling === b._id ? 0.6 : 1 }}>
                        {cancelling === b._id ? '...' : 'Cancel'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 24 }}>
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-bg)', fontWeight: 600, opacity: page <= 1 ? 0.5 : 1 }}>←</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)} style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid var(--color-border)', background: p === page ? 'var(--color-primary)' : 'var(--color-bg)', color: p === page ? 'white' : 'inherit', fontWeight: 600 }}>{p}</button>
          ))}
          <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-bg)', fontWeight: 600, opacity: page >= totalPages ? 0.5 : 1 }}>→</button>
        </div>
      )}
    </motion.div>
  );
};

export default MyBookings;

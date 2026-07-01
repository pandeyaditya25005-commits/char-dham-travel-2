import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getAdminBookings, approveBooking, rejectBooking, updateBookingStatus } from '../../services/adminService';
import Loader from '../../components/common/Loader';
import { formatCurrency, formatDateShort, getStatusColor } from '../../utils/formatters';

const statusList = ['all', 'pending', 'confirmed', 'cancelled', 'completed'];

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('');
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  const fetch = () => {
    setLoading(true);
    const params = { page, limit: 15 };
    if (filter !== 'all') params.status = filter;
    if (typeFilter) params.type = typeFilter;
    if (search) params.search = search;
    getAdminBookings(params)
      .then((data) => { setBookings(data.bookings); setTotal(data.total); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, [page, filter, typeFilter]);

  const doAction = async (id, action) => {
    setActionLoading(id);
    try {
      if (action === 'approve') await approveBooking(id);
      else if (action === 'reject') await rejectBooking(id);
      else if (action === 'complete') await updateBookingStatus(id, 'completed');
      fetch();
    } catch (err) { alert(err.message); }
    finally { setActionLoading(null); }
  };

  const totalPages = Math.ceil(total / 15);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: '1.5rem' }}>Bookings</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>{total} total bookings</p>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16, alignItems: 'center' }}>
        <input placeholder="Search by ID, email, phone..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && fetch()} style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-bg)', flex: 1, minWidth: 200, maxWidth: 280, fontSize: '0.85rem' }} />
        <button onClick={fetch} className="btn btn-primary btn-sm">Search</button>
        <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-bg)', fontSize: '0.85rem' }}>
          <option value="">All Types</option>
          <option value="package">Package</option>
          <option value="hotel">Hotel</option>
        </select>
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
        {statusList.map(s => (
          <button key={s} onClick={() => { setFilter(s); setPage(1); }} style={{ padding: '5px 14px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600, textTransform: 'capitalize', background: filter === s ? 'var(--color-primary)' : 'var(--color-bg-tertiary)', color: filter === s ? 'white' : 'var(--color-text-secondary)' }}>{s}</button>
        ))}
      </div>

      {loading ? <Loader /> : (
        <div style={{ background: 'var(--color-bg)', borderRadius: 12, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
              <thead>
                <tr style={{ background: 'var(--color-bg-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  <th style={{ padding: '10px 14px', textAlign: 'left', color: 'var(--color-text-muted)' }}>Booking ID</th>
                  <th style={{ padding: '10px 14px', textAlign: 'left', color: 'var(--color-text-muted)' }}>Customer</th>
                  <th style={{ padding: '10px 14px', textAlign: 'left', color: 'var(--color-text-muted)' }}>Type</th>
                  <th style={{ padding: '10px 14px', textAlign: 'left', color: 'var(--color-text-muted)' }}>Date</th>
                  <th style={{ padding: '10px 14px', textAlign: 'left', color: 'var(--color-text-muted)' }}>Amount</th>
                  <th style={{ padding: '10px 14px', textAlign: 'left', color: 'var(--color-text-muted)' }}>Status</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center', color: 'var(--color-text-muted)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b, i) => (
                  <motion.tr key={b._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} style={{ borderBottom: '1px solid var(--color-border)', fontSize: '0.85rem' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600 }}>
                      <Link to={`/admin/bookings/${b._id}`} style={{ color: 'var(--color-primary)' }}>{b.bookingId}</Link>
                    </td>
                    <td style={{ padding: '10px 14px', color: 'var(--color-text-secondary)' }}>{b.userId?.name || b.contactEmail}</td>
                    <td style={{ padding: '10px 14px', textTransform: 'capitalize' }}>{b.type}</td>
                    <td style={{ padding: '10px 14px', color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>{formatDateShort(b.travelDate)}</td>
                    <td style={{ padding: '10px 14px', fontWeight: 600 }}>{formatCurrency(b.totalAmount)}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <span style={{ padding: '2px 8px', borderRadius: 12, fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', color: 'white', background: getStatusColor(b.status) }}>{b.status}</span>
                    </td>
                    <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                        <Link to={`/admin/bookings/${b._id}`} className="btn btn-sm btn-outline" style={{ fontSize: '0.65rem', padding: '3px 8px' }}>View</Link>
                        {b.status === 'pending' && (
                          <>
                            <button onClick={() => doAction(b._id, 'approve')} disabled={actionLoading === b._id} className="btn btn-sm" style={{ fontSize: '0.65rem', padding: '3px 8px', borderRadius: 6, background: '#ecfdf5', color: '#059669', fontWeight: 600 }}>Approve</button>
                            <button onClick={() => doAction(b._id, 'reject')} disabled={actionLoading === b._id} className="btn btn-sm" style={{ fontSize: '0.65rem', padding: '3px 8px', borderRadius: 6, background: '#fef2f2', color: '#dc2626', fontWeight: 600 }}>Reject</button>
                          </>
                        )}
                        {b.status === 'confirmed' && (
                          <button onClick={() => doAction(b._id, 'complete')} disabled={actionLoading === b._id} className="btn btn-sm" style={{ fontSize: '0.65rem', padding: '3px 8px', borderRadius: 6, background: '#f3e8ff', color: '#9333ea', fontWeight: 600 }}>Complete</button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 20 }}>
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-bg)', fontWeight: 600, opacity: page <= 1 ? 0.5 : 1, fontSize: '0.85rem' }}>←</button>
          <span style={{ padding: '8px 12px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{page} / {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-bg)', fontWeight: 600, opacity: page >= totalPages ? 0.5 : 1, fontSize: '0.85rem' }}>→</button>
        </div>
      )}
    </motion.div>
  );
};

export default AdminBookings;

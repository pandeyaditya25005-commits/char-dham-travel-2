import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getAdminBookingById, approveBooking, rejectBooking, updateBookingStatus } from '../../services/adminService';
import Loader from '../../components/common/Loader';
import { formatCurrency, formatDate, getStatusColor } from '../../utils/formatters';

const AdminBookingDetail = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminBookingById(id)
      .then((data) => setBooking(data.booking))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const doAction = async (action) => {
    try {
      if (action === 'approve') await approveBooking(id);
      else if (action === 'reject') await rejectBooking(id);
      else if (action === 'complete') await updateBookingStatus(id, 'completed');
      const data = await getAdminBookingById(id);
      setBooking(data.booking);
    } catch (err) { alert(err.message); }
  };

  if (loading) return <Loader />;
  if (!booking) return <p>Booking not found</p>;

  const info = [
    { label: 'Booking ID', value: booking.bookingId },
    { label: 'Type', value: booking.type === 'package' ? 'Tour Package' : 'Hotel Booking' },
    { label: 'Travel Date', value: formatDate(booking.travelDate) },
    { label: 'End Date', value: formatDate(booking.endDate) },
    { label: 'Persons', value: booking.numberOfPersons },
    { label: 'Rooms', value: booking.numberOfRooms || '-' },
    { label: 'Total Amount', value: formatCurrency(booking.totalAmount) },
    { label: 'Status', value: booking.status, badge: true },
    { label: 'Created', value: formatDate(booking.createdAt) },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Link to="/admin/bookings" style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', display: 'inline-block', marginBottom: 16 }}>← Back to Bookings</Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: '1.3rem' }}>{booking.bookingId}</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>Booking Management</p>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {booking.status === 'pending' && (
            <>
              <button onClick={() => doAction('approve')} className="btn btn-sm" style={{ background: '#10b981', color: 'white', fontWeight: 600, borderRadius: 8 }}>✓ Approve</button>
              <button onClick={() => doAction('reject')} className="btn btn-sm btn-danger">✗ Reject</button>
            </>
          )}
          {booking.status === 'confirmed' && (
            <button onClick={() => doAction('complete')} className="btn btn-sm" style={{ background: '#8b5cf6', color: 'white', fontWeight: 600, borderRadius: 8 }}>✓ Mark Complete</button>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div>
          <h3 style={{ fontSize: '0.95rem', marginBottom: 12 }}>Booking Details</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {info.map((item, i) => (
              <div key={i} style={{ padding: '10px 14px', background: 'var(--color-bg)', borderRadius: 8, border: '1px solid var(--color-border)' }}>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 }}>{item.label}</p>
                {item.badge ? (
                  <span style={{ padding: '2px 10px', borderRadius: 12, fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'white', background: getStatusColor(item.value) }}>{item.value}</span>
                ) : (
                  <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.value}</p>
                )}
              </div>
            ))}
          </div>

          {booking.specialRequests && (
            <div style={{ marginTop: 12, padding: '10px 14px', background: 'var(--color-bg)', borderRadius: 8, border: '1px solid var(--color-border)' }}>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Special Requests</p>
              <p style={{ fontSize: '0.85rem' }}>{booking.specialRequests}</p>
            </div>
          )}
        </div>

        <div>
          <h3 style={{ fontSize: '0.95rem', marginBottom: 12 }}>Customer Info</h3>
          <div style={{ padding: '1rem', background: 'var(--color-bg)', borderRadius: 8, border: '1px solid var(--color-border)' }}>
            {booking.userId ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>{booking.userId.name?.charAt(0)}</div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{booking.userId.name}</div>
                    <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>{booking.userId.email}</div>
                  </div>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>📞 {booking.userId.phone || 'N/A'}</div>
                <Link to={`/admin/users/${booking.userId._id}`} style={{ display: 'inline-block', marginTop: 8, fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 600 }}>View User Profile →</Link>
              </>
            ) : (
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                <p>Contact: {booking.contactEmail}</p>
                <p>Phone: {booking.contactPhone}</p>
              </div>
            )}
          </div>

          {booking.packageId && (
            <div style={{ marginTop: 12, padding: '1rem', background: 'var(--color-bg)', borderRadius: 8, border: '1px solid var(--color-border)' }}>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Package</p>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{booking.packageId.title}</div>
            </div>
          )}

          {booking.hotelId && (
            <div style={{ marginTop: 12, padding: '1rem', background: 'var(--color-bg)', borderRadius: 8, border: '1px solid var(--color-border)' }}>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Hotel</p>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{booking.hotelId.name}</div>
              {booking.roomId && <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem', textTransform: 'capitalize' }}>Room: {booking.roomId.type}</div>}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AdminBookingDetail;

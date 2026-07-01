import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getBookingById, cancelBooking, downloadInvoice } from '../../services/bookingService';
import Loader from '../../components/common/Loader';
import { formatCurrency, formatDate, getStatusColor } from '../../utils/formatters';

const BookingDetail = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const iframeRef = useRef(null);

  useEffect(() => {
    getBookingById(id)
      .then((data) => setBooking(data.booking))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const downloadInvoice = async () => {
    setDownloading(true);
    try {
      const data = await downloadInvoice(id);
      const blob = new Blob([data], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${booking.bookingId}.html`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) { alert('Failed to download invoice'); }
    finally { setDownloading(false); }
  };

  const handleCancel = async () => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await cancelBooking(id);
      const data = await getBookingById(id);
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
    { label: 'Total Amount', value: formatCurrency(booking.totalAmount) },
    { label: 'Status', value: booking.status, badge: true },
    { label: 'Contact Email', value: booking.contactEmail },
    { label: 'Contact Phone', value: booking.contactPhone },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Link to="/dashboard/bookings" style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', display: 'inline-block', marginBottom: 16 }}>← Back to Bookings</Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: '1.3rem' }}>{booking.bookingId}</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>Booking Details</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={downloadInvoice} disabled={downloading} className="btn btn-primary btn-sm">{downloading ? 'Downloading...' : '📄 Download Invoice'}</button>
          {booking.status === 'pending' && <button onClick={handleCancel} className="btn btn-danger btn-sm">Cancel Booking</button>}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 12, marginBottom: 24 }}>
        {info.map((item, i) => (
          <div key={i} style={{ padding: '1rem 1.25rem', background: 'var(--color-bg)', borderRadius: 10, border: '1px solid var(--color-border)' }}>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>{item.label}</p>
            {item.badge ? (
              <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', color: 'white', background: getStatusColor(item.value), display: 'inline-block' }}>{item.value}</span>
            ) : (
              <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>{item.value}</p>
            )}
          </div>
        ))}
      </div>

      {booking.specialRequests && (
        <div style={{ padding: '1rem 1.25rem', background: 'var(--color-bg)', borderRadius: 10, border: '1px solid var(--color-border)' }}>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>Special Requests</p>
          <p style={{ fontSize: '0.9rem' }}>{booking.specialRequests}</p>
        </div>
      )}
    </motion.div>
  );
};

export default BookingDetail;

import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getHotelById, getHotelRooms } from '../../services/hotelService';
import Loader from '../../components/common/Loader';
import useAuth from '../../hooks/useAuth';
import { formatCurrency } from '../../utils/formatters';

const HotelDetail = () => {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getHotelById(id),
      getHotelRooms(id),
    ])
      .then(([hotelData, roomsData]) => {
        setHotel(hotelData.hotel);
        setRooms(roomsData.rooms);
      })
      .catch((err) => setError(err.message || 'Hotel not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBook = () => {
    if (!isAuthenticated) { navigate('/login', { state: { from: { pathname: `/hotels/${id}` } } }); return; }
    navigate('/dashboard');
  };

  if (loading) return <Loader />;
  if (error) return (
    <div className="container section" style={{ textAlign: 'center', padding: '6rem 0' }}>
      <h2 style={{ color: 'var(--color-danger)' }}>{error}</h2>
      <Link to="/hotels" style={{ color: 'var(--color-primary)', marginTop: 16, display: 'inline-block' }}>← Back to Hotels</Link>
    </div>
  );
  if (!hotel) return null;

  const stars = '★'.repeat(hotel.starRating) + '☆'.repeat(5 - hotel.starRating);

  return (
    <>
      <section style={{ background: 'linear-gradient(135deg, #0f172a, #1e3a5f)', padding: '8rem 0 3rem' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link to="/hotels" style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: 12, display: 'inline-block' }}>← Back to Hotels</Link>
            <h1 style={{ color: 'white', fontSize: 'clamp(2rem, 4vw, 2.8rem)', marginBottom: 8 }}>{hotel.name}</h1>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{hotel.location}</p>
            <div style={{ color: '#f59e0b', fontSize: '1.1rem', marginTop: 8 }}>{stars}</div>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 40, alignItems: 'start' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, marginBottom: 32, fontSize: '0.95rem' }}>{hotel.description}</p>

              {hotel.amenities?.length > 0 && (
                <div style={{ marginBottom: 32 }}>
                  <h3 style={{ marginBottom: 12 }}>Amenities</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {hotel.amenities.map((a, i) => (
                      <span key={i} className="card" style={{ padding: '6px 14px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{a}</span>
                    ))}
                  </div>
                </div>
              )}

              {rooms.length > 0 && (
                <div>
                  <h3 style={{ marginBottom: 16 }}>Available Rooms</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {rooms.map((room) => (
                      <div key={room._id} className="card" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                        <div>
                          <h4 style={{ fontSize: '1rem', textTransform: 'capitalize', marginBottom: 4 }}>{room.type} Room</h4>
                          <div style={{ display: 'flex', gap: 16, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                            <span>👤 Up to {room.capacity} guests</span>
                            <span>🛏️ {room.availableRooms}/{room.totalRooms} available</span>
                          </div>
                          {room.amenities?.length > 0 && (
                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                              {room.amenities.map((a, i) => (
                                <span key={i} style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', background: 'var(--color-bg)', padding: '2px 8px', borderRadius: 4 }}>{a}</span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '1.3rem', color: 'var(--color-primary)', fontWeight: 700 }}>{formatCurrency(room.price)}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>per night</div>
                          <button onClick={handleBook} disabled={room.availableRooms < 1} style={{ marginTop: 8, padding: '8px 20px', borderRadius: 6, background: room.availableRooms < 1 ? 'var(--color-border)' : 'var(--color-primary)', color: 'white', fontWeight: 600, fontSize: '0.85rem', border: 'none', cursor: room.availableRooms < 1 ? 'not-allowed' : 'pointer' }}>
                            {room.availableRooms < 1 ? 'Sold Out' : 'Book'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.15 } }} style={{ position: 'sticky', top: 100 }}>
              <div className="card" style={{ padding: '1.5rem' }}>
                <h3 style={{ marginBottom: 16 }}>About This Hotel</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                  <span>📍 Location: {hotel.location}</span>
                  <span>⭐ Rating: {stars}</span>
                  <span>🛏️ Rooms: {rooms.reduce((sum, r) => sum + r.totalRooms, 0)} total</span>
                  <span>💰 From: {rooms.length > 0 ? formatCurrency(Math.min(...rooms.map(r => r.price))) : 'N/A'}/night</span>
                </div>
                <button onClick={handleBook} style={{ width: '100%', padding: '14px', borderRadius: 8, background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: 'white', fontWeight: 700, fontSize: '1rem', marginTop: 20 }}>
                  {isAuthenticated ? 'Book a Room' : 'Sign In to Book'}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HotelDetail;

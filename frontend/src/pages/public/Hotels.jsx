import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAllHotels, getHotelRooms } from '../../services/hotelService';
import Loader from '../../components/common/Loader';
import { formatCurrency } from '../../utils/formatters';

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const Hotels = () => {
  const [hotels, setHotels] = useState([]);
  const [rooms, setRooms] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [location, setLocation] = useState('');

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (location) params.location = location;
    getAllHotels(params)
      .then((data) => {
        setHotels(data.hotels);
        data.hotels.forEach(h => {
          getHotelRooms(h._id)
            .then((r) => setRooms(prev => ({ ...prev, [h._id]: r.rooms })))
            .catch(() => {});
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [location]);

  return (
    <>
      <section style={{ background: 'linear-gradient(135deg, #0f172a, #1e3a5f)', padding: '8rem 0 3rem' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 style={{ color: 'white', fontSize: 'clamp(2rem, 4vw, 2.8rem)', marginBottom: 8 }}>Hotels & Accommodation</h1>
            <p style={{ color: '#94a3b8', fontSize: '1rem', maxWidth: 500 }}>Comfortable stays near each Dham for a restful pilgrimage</p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ marginBottom: 32 }}>
            <input placeholder="Search by location (e.g., Rishikesh, Kedarnath...)" value={location} onChange={(e) => setLocation(e.target.value)} style={{ padding: '12px 20px', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-bg)', width: '100%', maxWidth: 400 }} />
          </div>

          {loading ? <Loader /> : hotels.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>🏨</div>
              <h3>No Hotels Found</h3>
              <p style={{ color: 'var(--color-text-secondary)', marginTop: 8 }}>Try a different location</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
              {hotels.map((hotel, i) => (
                <motion.div key={hotel._id} variants={fadeUp} initial="initial" animate="animate" transition={{ delay: i * 0.05 }}>
                  <div className="card" style={{ overflow: 'hidden' }}>
                    <div style={{ height: 180, background: `linear-gradient(135deg, #1e3a5f, #0f172a)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '3rem' }}>🏨</span>
                    </div>
                    <div style={{ padding: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <h3 style={{ fontSize: '1.15rem' }}>{hotel.name}</h3>
                        <div style={{ color: '#f59e0b', fontSize: '0.85rem' }}>{'★'.repeat(hotel.starRating)}{'☆'.repeat(5 - hotel.starRating)}</div>
                      </div>
                      <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginBottom: 4 }}>📍 {hotel.location}</p>
                      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', marginBottom: 12, lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {hotel.description}
                      </p>
                      {hotel.amenities?.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                          {hotel.amenities.slice(0, 4).map((a, i) => <span key={i} style={{ padding: '3px 10px', borderRadius: 20, background: 'var(--color-bg-tertiary)', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{a}</span>)}
                        </div>
                      )}
                      <button onClick={() => setSelectedHotel(selectedHotel === hotel._id ? null : hotel._id)} style={{ width: '100%', padding: '10px', borderRadius: 8, background: selectedHotel === hotel._id ? 'var(--color-bg-tertiary)' : 'var(--color-primary)', color: selectedHotel === hotel._id ? 'var(--color-text)' : 'white', fontWeight: 600, fontSize: '0.85rem' }}>
                        {selectedHotel === hotel._id ? 'Hide Rooms' : 'View Rooms'}
                      </button>

                      {selectedHotel === hotel._id && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ marginTop: 12, overflow: 'hidden' }}>
                          <h4 style={{ fontSize: '0.9rem', marginBottom: 8 }}>Available Rooms</h4>
                          {(rooms[hotel._id] || []).length === 0 ? (
                            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>No room data available</p>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                              {(rooms[hotel._id] || []).filter(r => r.isActive).map(room => (
                                <div key={room._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-bg)' }}>
                                  <div>
                                    <div style={{ fontWeight: 600, fontSize: '0.85rem', textTransform: 'capitalize' }}>{room.type}</div>
                                    <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>Capacity: {room.capacity} guests | Available: {room.availableRooms}/{room.totalRooms}</div>
                                  </div>
                                  <div style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '0.95rem' }}>{formatCurrency(room.price)}<span style={{ fontWeight: 400, fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>/night</span></div>
                                </div>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Hotels;

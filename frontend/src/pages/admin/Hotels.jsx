import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllHotels } from '../../services/hotelService';
import { createHotel, updateHotel, deleteHotel, getHotelRoomsAdmin, createRoom, deleteRoom } from '../../services/adminService';
import Loader from '../../components/common/Loader';
import { formatCurrency } from '../../utils/formatters';

const initHotel = { name: '', location: '', description: '', starRating: 3, amenities: '' };
const initRoom = { type: 'double', price: 0, capacity: 2, totalRooms: 5, amenities: '' };

const Hotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHotelForm, setShowHotelForm] = useState(false);
  const [hotelForm, setHotelForm] = useState(initHotel);
  const [editingHotel, setEditingHotel] = useState(null);
  const [saving, setSaving] = useState(false);

  const [expandedHotel, setExpandedHotel] = useState(null);
  const [rooms, setRooms] = useState({});
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [roomForm, setRoomForm] = useState(initRoom);

  const fetch = () => {
    setLoading(true);
    getAllHotels({ limit: 100 })
      .then((data) => setHotels(data.hotels))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const loadRooms = async (hotelId) => {
    if (rooms[hotelId]) return;
    try {
      const data = await getHotelRoomsAdmin(hotelId);
      setRooms(prev => ({ ...prev, [hotelId]: data.rooms }));
    } catch {}
  };

  const toggleHotel = (id) => {
    if (expandedHotel === id) { setExpandedHotel(null); return; }
    setExpandedHotel(id);
    loadRooms(id);
  };

  const submitHotel = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...hotelForm, amenities: hotelForm.amenities.split(',').map(s => s.trim()).filter(Boolean) };
      if (editingHotel) { await updateHotel(editingHotel, payload); }
      else { await createHotel(payload); }
      setShowHotelForm(false);
      setEditingHotel(null);
      setHotelForm(initHotel);
      fetch();
    } catch (err) { alert(err.message); }
    finally { setSaving(false); }
  };

  const submitRoom = async (e) => {
    e.preventDefault();
    if (!expandedHotel) return;
    try {
      await createRoom(expandedHotel, roomForm);
      setShowRoomForm(false);
      setRoomForm(initRoom);
      const data = await getHotelRoomsAdmin(expandedHotel);
      setRooms(prev => ({ ...prev, [expandedHotel]: data.rooms }));
    } catch (err) { alert(err.message); }
  };

  const inp = { width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-bg)', fontSize: '0.85rem', outline: 'none' };
  const inpSm = { ...inp, width: 'auto', minWidth: 80, flex: 1 };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: '1.5rem' }}>Hotels</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>{hotels.length} hotels</p>
        </div>
        <button onClick={() => { setHotelForm(initHotel); setEditingHotel(null); setShowHotelForm(true); }} className="btn btn-primary btn-sm">+ New Hotel</button>
      </div>

      <AnimatePresence>
        {showHotelForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden', marginBottom: 20 }}>
            <form onSubmit={submitHotel} style={{ background: 'var(--color-bg)', borderRadius: 12, border: '1px solid var(--color-border)', padding: '1.5rem' }}>
              <h3 style={{ marginBottom: 16 }}>{editingHotel ? 'Edit Hotel' : 'New Hotel'}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <input placeholder="Hotel Name" value={hotelForm.name} onChange={(e) => setHotelForm(p => ({...p, name: e.target.value}))} required style={inp} />
                <input placeholder="Location" value={hotelForm.location} onChange={(e) => setHotelForm(p => ({...p, location: e.target.value}))} required style={inp} />
                <select value={hotelForm.starRating} onChange={(e) => setHotelForm(p => ({...p, starRating: Number(e.target.value)}))} style={inp}>
                  {[1,2,3,4,5].map(n => <option key={n} value={n}>{'★'.repeat(n)}</option>)}
                </select>
                <input placeholder="Amenities (comma separated)" value={hotelForm.amenities} onChange={(e) => setHotelForm(p => ({...p, amenities: e.target.value}))} style={inp} />
                <textarea placeholder="Description" value={hotelForm.description} onChange={(e) => setHotelForm(p => ({...p, description: e.target.value}))} required rows={3} style={{ ...inp, gridColumn: '1/-1' }} />
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button type="submit" disabled={saving} className="btn btn-primary btn-sm">{saving ? 'Saving...' : editingHotel ? 'Update' : 'Create'}</button>
                <button type="button" onClick={() => setShowHotelForm(false)} className="btn btn-sm" style={{ border: '1px solid var(--color-border)', borderRadius: 8 }}>Cancel</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? <Loader /> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {hotels.map((h, i) => (
            <motion.div key={h._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}>
              <div style={{ background: 'var(--color-bg)', borderRadius: 12, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', cursor: 'pointer' }} onClick={() => toggleHotel(h._id)}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{h.name}</div>
                    <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>📍 {h.location} • {'★'.repeat(h.starRating)}{'☆'.repeat(5 - h.starRating)}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ padding: '2px 8px', borderRadius: 12, fontSize: '0.65rem', fontWeight: 600, background: h.isActive ? '#ecfdf5' : '#fef2f2', color: h.isActive ? '#059669' : '#dc2626' }}>{h.isActive ? 'Active' : 'Inactive'}</span>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{expandedHotel === h._id ? '▼' : '▶'}</span>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedHotel === h._id && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ borderTop: '1px solid var(--color-border)', overflow: 'hidden' }}>
                      <div style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                          <h4 style={{ fontSize: '0.9rem' }}>Rooms</h4>
                          <button onClick={() => setShowRoomForm(true)} className="btn btn-sm btn-primary" style={{ fontSize: '0.7rem', padding: '4px 10px' }}>+ Add Room</button>
                        </div>
                        {(rooms[h._id] || []).length === 0 ? (
                          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>No rooms added yet</p>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {(rooms[h._id] || []).map(r => (
                              <div key={r._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderRadius: 8, background: 'var(--color-bg-secondary)', fontSize: '0.85rem' }}>
                                <div>
                                  <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{r.type}</span>
                                  <span style={{ color: 'var(--color-text-muted)', marginLeft: 8 }}>Cap: {r.capacity} • Avail: {r.availableRooms}/{r.totalRooms}</span>
                                </div>
                                <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{formatCurrency(r.price)}<span style={{ fontWeight: 400, fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>/night</span></span>
                              </div>
                            ))}
                          </div>
                        )}

                        {showRoomForm && (
                          <form onSubmit={submitRoom} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12, padding: '1rem', borderRadius: 8, background: 'var(--color-bg-secondary)' }}>
                            <select value={roomForm.type} onChange={(e) => setRoomForm(p => ({...p, type: e.target.value}))} style={inpSm}>
                              {['single','double','deluxe','suite'].map(t => <option key={t} value={t} style={{textTransform:'capitalize'}}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
                            </select>
                            <input type="number" placeholder="Price" value={roomForm.price} onChange={(e) => setRoomForm(p => ({...p, price: Number(e.target.value)}))} required style={inpSm} />
                            <input type="number" placeholder="Capacity" value={roomForm.capacity} onChange={(e) => setRoomForm(p => ({...p, capacity: Number(e.target.value)}))} required style={inpSm} />
                            <input type="number" placeholder="Total Rooms" value={roomForm.totalRooms} onChange={(e) => setRoomForm(p => ({...p, totalRooms: Number(e.target.value)}))} required style={inpSm} />
                            <button type="submit" className="btn btn-primary btn-sm">Add</button>
                            <button type="button" onClick={() => setShowRoomForm(false)} className="btn btn-sm" style={{ border: '1px solid var(--color-border)', borderRadius: 6 }}>Cancel</button>
                          </form>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Hotels;

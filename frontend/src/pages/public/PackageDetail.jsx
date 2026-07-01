import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getPackageBySlug } from '../../services/packageService';
import Loader from '../../components/common/Loader';
import useAuth from '../../hooks/useAuth';
import { formatCurrency, formatDate } from '../../utils/formatters';

const PackageDetail = () => {
  const { slug } = useParams();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getPackageBySlug(slug)
      .then((data) => setPkg(data.package))
      .catch((err) => setError(err.message || 'Package not found'))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleBook = () => {
    if (!isAuthenticated) { navigate('/login', { state: { from: { pathname: `/packages/${slug}` } } }); return; }
    navigate('/dashboard');
  };

  if (loading) return <Loader />;
  if (error) return (
    <div className="container section" style={{ textAlign: 'center', padding: '6rem 0' }}>
      <h2 style={{ color: 'var(--color-danger)' }}>{error}</h2>
      <Link to="/packages" style={{ color: 'var(--color-primary)', marginTop: 16, display: 'inline-block' }}>← Back to Packages</Link>
    </div>
  );
  if (!pkg) return null;

  return (
    <>
      <section style={{ background: 'linear-gradient(135deg, #0f172a, #1e3a5f)', padding: '8rem 0 3rem' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link to="/packages" style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: 12, display: 'inline-block' }}>← Back to Packages</Link>
            <h1 style={{ color: 'white', fontSize: 'clamp(2rem, 4vw, 2.8rem)', marginBottom: 8 }}>{pkg.title}</h1>
            <div style={{ display: 'flex', gap: 20, color: '#94a3b8', fontSize: '0.9rem', flexWrap: 'wrap', marginTop: 12 }}>
              <span>📅 {pkg.duration} days</span>
              <span>👥 Max {pkg.maxGroupSize} people</span>
              <span>📊 {pkg.difficulty}</span>
              {pkg.totalBookings > 0 && <span>🛒 {pkg.totalBookings} booked</span>}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 40, alignItems: 'start' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div style={{ fontSize: '1.6rem', color: 'var(--color-primary)', fontWeight: 700, marginBottom: 24 }}>{formatCurrency(pkg.price)} <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 400 }}>per person</span></div>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, marginBottom: 32, fontSize: '0.95rem' }}>{pkg.description}</p>

              {pkg.includes?.length > 0 && (
                <div style={{ marginBottom: 32 }}>
                  <h3 style={{ marginBottom: 12 }}>✅ Includes</h3>
                  <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {pkg.includes.map((item, i) => (
                      <li key={i} style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', paddingLeft: 20, position: 'relative' }}>
                        <span style={{ position: 'absolute', left: 0, color: 'var(--color-success)' }}>✓</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {pkg.excludes?.length > 0 && (
                <div style={{ marginBottom: 32 }}>
                  <h3 style={{ marginBottom: 12 }}>❌ Excludes</h3>
                  <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {pkg.excludes.map((item, i) => (
                      <li key={i} style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', paddingLeft: 20, position: 'relative' }}>
                        <span style={{ position: 'absolute', left: 0, color: 'var(--color-danger)' }}>✗</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {pkg.itinerary?.length > 0 && (
                <div>
                  <h3 style={{ marginBottom: 16 }}>📋 Itinerary</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {pkg.itinerary.map((day) => (
                      <div key={day.day} className="card" style={{ padding: '1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                          <span style={{ background: 'var(--color-primary)', color: 'white', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, flexShrink: 0 }}>{day.day}</span>
                          <h4 style={{ fontSize: '1rem' }}>{day.title}</h4>
                        </div>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, marginLeft: 44 }}>{day.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.15 } }} style={{ position: 'sticky', top: 100 }}>
              <div className="card" style={{ padding: '1.5rem' }}>
                <h3 style={{ marginBottom: 16 }}>Book This Package</h3>
                <div style={{ fontSize: '2rem', color: 'var(--color-primary)', fontWeight: 700, marginBottom: 8 }}>{formatCurrency(pkg.price)}</div>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: 20 }}>per person • {pkg.duration} days</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20, fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                  <span>🕒 Duration: {pkg.duration} days</span>
                  <span>👥 Max group size: {pkg.maxGroupSize}</span>
                  <span>📊 Difficulty: {pkg.difficulty}</span>
                </div>
                <button onClick={handleBook} style={{ width: '100%', padding: '14px', borderRadius: 8, background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: 'white', fontWeight: 700, fontSize: '1rem' }}>
                  {isAuthenticated ? 'Book Now' : 'Sign In to Book'}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PackageDetail;

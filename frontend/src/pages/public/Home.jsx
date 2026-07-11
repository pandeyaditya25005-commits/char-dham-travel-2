import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getAllPackages } from '../../services/packageService';
import { formatCurrency } from '../../utils/formatters';

const stagger = { animate: { transition: { staggerChildren: 0.1 } } };
const fadeUp = { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const scaleIn = { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1, transition: { duration: 0.5 } } };

const destinations = [
  { name: 'Yamunotri', desc: 'Westernmost Dham — source of the Yamuna River', icon: '🏔️', color: '#10b981' },
  { name: 'Gangotri', desc: 'Origin of the holy River Ganga', icon: '🌊', color: '#3b82f6' },
  { name: 'Kedarnath', desc: 'Northernmost Dham — abode of Lord Shiva', icon: '🕉️', color: '#f59e0b' },
  { name: 'Badrinath', desc: 'Easternmost Dham — seat of Lord Vishnu', icon: '🛕', color: '#ef4444' },
];

const testimonials = [
  { name: 'Rajesh Sharma', loc: 'Delhi', text: 'An incredible spiritual journey. The arrangements were flawless and the guides were knowledgeable.', rating: 5 },
  { name: 'Priya Patel', loc: 'Mumbai', text: 'Well-organized pilgrimage. Every detail was taken care of. Will definitely book again.', rating: 5 },
  { name: 'Amit Kumar', loc: 'Bangalore', text: 'The best travel experience of my life. The Char Dham yatra was truly transformative.', rating: 5 },
];

const stats = [
  { label: 'Happy Travelers', value: 5000, suffix: '+' },
  { label: 'Tours Completed', value: 200, suffix: '+' },
  { label: 'Years Experience', value: 12, suffix: '+' },
  { label: 'Destinations', value: 4, suffix: '' },
];

const Home = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllPackages({ limit: 3, sort: '-totalBookings' })
      .then((data) => {
  setPackages(data?.packages || []);
})
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* Hero */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.1 }}>
          <div style={{ position: 'absolute', top: '20%', left: '10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, #3b82f6, transparent)', filter: 'blur(60px)' }} />
          <div style={{ position: 'absolute', bottom: '30%', right: '15%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, #f59e0b, transparent)', filter: 'blur(80px)' }} />
        </div>
        <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: '80px' }}>
          <div style={{ maxWidth: 700 }}>
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <span style={{ display: 'inline-block', padding: '6px 16px', borderRadius: 20, background: 'rgba(59,130,246,0.15)', color: '#93c5fd', fontSize: '0.85rem', fontWeight: 600, marginBottom: 24 }}>
                🌄 Spiritual Journey of a Lifetime
              </span>
              <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)', fontWeight: 800, color: 'white', lineHeight: 1.15, marginBottom: 20 }}>
                Discover the Divine{' '}
                <span style={{ background: 'linear-gradient(135deg, #60a5fa, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Char Dham
                </span>
              </h1>
              <p style={{ fontSize: '1.1rem', color: '#94a3b8', lineHeight: 1.7, marginBottom: 36, maxWidth: 560 }}>
                Embark on a sacred pilgrimage to the four revered abodes nestled in the Himalayas. Experience spirituality, breathtaking landscapes, and divine tranquility.
              </p>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <Link to="/packages" style={{ padding: '14px 32px', borderRadius: 12, background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: 'white', fontWeight: 700, fontSize: '1rem' }}>
                  Explore Packages
                </Link>
                <Link to="/char-dham" style={{ padding: '14px 32px', borderRadius: 12, border: '2px solid rgba(255,255,255,0.2)', color: 'white', fontWeight: 600, fontSize: '1rem' }}>
                  Learn More →
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: '#0f172a', borderTop: '1px solid #1e293b', borderBottom: '1px solid #1e293b' }}>
        <div className="container" style={{ padding: '3rem 0' }}>
          <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={{ once: true }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 24, textAlign: 'center' }}>
            {stats.map((s) => (
              <motion.div key={s.label} variants={fadeUp}>
                <Counter value={s.value} suffix={s.suffix} />
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: 4 }}>{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Destinations */}
      <section className="section" style={{ background: 'var(--color-bg)' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: 2 }}>Sacred Destinations</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', marginTop: 8 }}>The Four Abodes</h2>
            <p style={{ color: 'var(--color-text-secondary)', maxWidth: 540, margin: '12px auto 0' }}>
              Each Dham holds immense spiritual significance and offers a unique divine experience
            </p>
          </motion.div>
          <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={{ once: true }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
            {destinations.map((d, i) => (
              <motion.div key={d.name} variants={scaleIn} whileHover={{ y: -8, transition: { duration: 0.3 } }} style={{ background: 'var(--color-bg-secondary)', borderRadius: 16, padding: '2rem', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>{d.icon}</div>
                <div style={{ width: 48, height: 4, background: d.color, borderRadius: 2, margin: '0 auto 12px' }} />
                <h3 style={{ marginBottom: 8 }}>{d.name}</h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>{d.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section" style={{ background: 'var(--color-bg-secondary)' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: 2 }}>Why Choose Us</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', marginTop: 8 }}>Travel with Confidence</h2>
          </motion.div>
          <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={{ once: true }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {[
              { icon: '🛡️', title: 'Verified Services', desc: 'All our hotels and transport partners are thoroughly vetted for quality and safety.' },
              { icon: '🙏', title: 'Spiritual Guides', desc: 'Experienced pilgrimage guides who understand the religious and cultural significance.' },
              { icon: '🚌', title: 'Comfortable Travel', desc: 'Well-maintained vehicles with experienced drivers familiar with the mountainous terrain.' },
              { icon: '🏨', title: 'Premium Stays', desc: 'Carefully selected accommodations near each Dham for comfort and convenience.' },
              { icon: '🍽️', title: 'Healthy Meals', desc: 'Vegetarian meals prepared with hygiene, catering to dietary requirements.' },
              { icon: '📞', title: '24/7 Support', desc: 'Round-the-clock customer support throughout your pilgrimage journey.' },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeUp} whileHover={{ y: -5 }} style={{ background: 'var(--color-bg)', borderRadius: 12, padding: '1.75rem', border: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: '2rem', marginBottom: 12 }}>{item.icon}</div>
                <h4 style={{ marginBottom: 8 }}>{item.title}</h4>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Popular Packages */}
      {!loading && packages.length > 0 && (
        <section className="section">
          <div className="container">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
              <div>
                <span style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: 2 }}>Popular Packages</span>
                <h2 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', marginTop: 4 }}>Most Booked Tours</h2>
              </div>
              <Link to="/packages" style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.9rem' }}>
                View All →
              </Link>
            </motion.div>
            <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={{ once: true }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
              {packages.map((pkg) => (
                <motion.div key={pkg._id} variants={fadeUp} whileHover={{ y: -8 }}>
                  <Link to={`/packages/${pkg.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                    <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid var(--color-border)', background: 'var(--color-bg)' }}>
                      <div style={{ height: 200, background: `linear-gradient(135deg, #1e3a5f, #0f172a)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '3rem' }}>
                        🏔️
                      </div>
                      <div style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
                          <h3 style={{ fontSize: '1.1rem' }}>{pkg.title}</h3>
                          <span style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '1.1rem' }}>{formatCurrency(pkg.price)}</span>
                        </div>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginBottom: 12, lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{pkg.description}</p>
                        <div style={{ display: 'flex', gap: 16, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                          <span>📅 {pkg.duration} days</span>
                          <span>👥 Max {pkg.maxGroupSize}</span>
                          <span>📊 {pkg.difficulty}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="section" style={{ background: 'var(--color-bg-secondary)' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: 2 }}>Testimonials</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', marginTop: 8 }}>What Travelers Say</h2>
          </motion.div>
          <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={{ once: true }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {testimonials.map((t, i) => (
              <motion.div key={i} variants={fadeUp} style={{ background: 'var(--color-bg)', borderRadius: 16, padding: '2rem', border: '1px solid var(--color-border)' }}>
                <div style={{ color: '#f59e0b', fontSize: '1rem', marginBottom: 12 }}>
                  {'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}
                </div>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.7, fontStyle: 'italic', marginBottom: 16 }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>{t.name.charAt(0)}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{t.name}</div>
                    <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{t.loc}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg, #1e3a5f, #0f172a)', padding: '5rem 0', textAlign: 'center' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', color: 'white', marginBottom: 16 }}>Ready for a Divine Journey?</h2>
            <p style={{ color: '#94a3b8', maxWidth: 500, margin: '0 auto 32px', fontSize: '1rem' }}>
              Book your Char Dham Yatra today and experience the spiritual essence of the Himalayas.
            </p>
            <Link to="/register" style={{ padding: '16px 40px', borderRadius: 12, background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: 'white', fontWeight: 700, fontSize: '1.05rem', display: 'inline-block' }}>
              Get Started Now
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
};

const Counter = ({ value, suffix }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (count < value) {
      const t = setTimeout(() => setCount(c => Math.min(c + Math.ceil(value / 40), value)), 30);
      return () => clearTimeout(t);
    }
  }, [count, value]);
  return <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#3b82f6' }}>{count}{suffix}</div>;
};

export default Home;

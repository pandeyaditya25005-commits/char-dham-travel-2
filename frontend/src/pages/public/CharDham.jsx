import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const dhams = [
  {
    id: 'yamunotri',
    name: 'Yamunotri',
    subtitle: 'Source of the River Yamuna',
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #065f46, #10b981)',
    icon: '🏔️',
    deity: 'Goddess Yamuna',
    altitude: '3,293 m (10,804 ft)',
    significance: 'The westernmost Dham, Yamunotri is the source of the Yamuna River. The temple is dedicated to Goddess Yamuna and is the first stop of the Char Dham Yatra.',
    history: 'The original temple was built by Maharaja Pratap Shah of Tehri Garhwal in the 19th century. It was destroyed by an earthquake in 1803 and later rebuilt.',
    highlights: ['Surya Kund hot springs', 'Divya Shila rock pillar', 'Yamuna River origin at Champasar Glacier', 'Bandarpunch Mountain views'],
    bestTime: 'May to October',
    templeTimings: '6:00 AM - 8:00 PM',
    darshan: 'Special aarti at 6:30 PM',
  },
  {
    id: 'gangotri',
    name: 'Gangotri',
    subtitle: 'Origin of the Holy Ganges',
    color: '#3b82f6',
    gradient: 'linear-gradient(135deg, #1e3a5f, #3b82f6)',
    icon: '🌊',
    deity: 'Goddess Ganga',
    altitude: '3,100 m (10,170 ft)',
    significance: 'Gangotri is where the Ganges descended to earth from Lord Shiva\'s locks. The temple marks the spot where King Bhagirath meditated.',
    history: 'The current temple was built by Gorkha commander Amar Singh Thapa in the 18th century. It stands on the banks of the Bhagirathi River.',
    highlights: ['Submerged Shivling at Bhagirathi origin', 'Gaumukh Glacier trek (18 km)', 'Pandava Gufa caves', 'Bhagirathi Shila'],
    bestTime: 'May to October',
    templeTimings: '6:00 AM - 8:00 PM',
    darshan: 'Morning aarti at 6:00 AM',
  },
  {
    id: 'kedarnath',
    name: 'Kedarnath',
    subtitle: 'Abode of Lord Shiva',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #92400e, #f59e0b)',
    icon: '🕉️',
    deity: 'Lord Shiva',
    altitude: '3,583 m (11,755 ft)',
    significance: 'Kedarnath is one of the 12 Jyotirlingas of Lord Shiva. It is the highest among the Char Dham temples and holds immense spiritual significance.',
    history: 'Believed to have been built by the Pandavas. The current structure was built by Adi Shankaracharya in the 8th century.',
    highlights: ['Jyotirlinga darshan', 'Adi Shankaracharya Samadhi', 'Kedarnath Wildlife Sanctuary', 'Vasuki Tal trek'],
    bestTime: 'May to October',
    templeTimings: '6:00 AM - 7:00 PM',
    darshan: 'Shivling abhishekam available',
  },
  {
    id: 'badrinath',
    name: 'Badrinath',
    subtitle: 'Seat of Lord Vishnu',
    color: '#ef4444',
    gradient: 'linear-gradient(135deg, #991b1b, #ef4444)',
    icon: '🛕',
    deity: 'Lord Vishnu (as Badrinarayan)',
    altitude: '3,300 m (10,827 ft)',
    significance: 'Badrinath is the most prominent among the Char Dhams. Dedicated to Lord Vishnu, it is part of the Char Dham and also one of the 108 Divya Desams.',
    history: 'The temple has been mentioned in ancient scriptures. Adi Shankaracharya established the temple and the current structure dates back to the 16th century.',
    highlights: ['Tapt Kund hot springs', 'Brahma Kapal ghat', 'Mata Murti temple', 'Char Dham Museum'],
    bestTime: 'May to October',
    templeTimings: '6:00 AM - 8:00 PM',
    darshan: 'Special darshan from 6:00 AM to 7:00 AM',
  },
];

const CharDham = () => {
  const [active, setActive] = useState(dhams[0].id);

  return (
    <>
      <section style={{ background: 'linear-gradient(135deg, #0f172a, #1e3a5f)', padding: '8rem 0 3rem', textAlign: 'center' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span style={{ color: '#93c5fd', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: 2 }}>Sacred Pilgrimage</span>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'white', margin: '12px 0 16px' }}>
              The <span style={{ background: 'linear-gradient(135deg, #60a5fa, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Char Dham</span> Yatra
            </h1>
            <p style={{ color: '#94a3b8', maxWidth: 600, margin: '0 auto', lineHeight: 1.7 }}>
              The journey to four sacred abodes in the Himalayas — a pilgrimage that purifies the soul and grants moksha.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Dham Selector */}
      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="container">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 40 }}>
            {dhams.map((d) => (
              <button key={d.id} onClick={() => setActive(d.id)} style={{
                padding: '12px 24px',
                borderRadius: 12,
                fontWeight: 700,
                fontSize: '0.95rem',
                background: active === d.id ? d.gradient : 'var(--color-bg-secondary)',
                color: active === d.id ? 'white' : 'var(--color-text)',
                border: active === d.id ? 'none' : '1px solid var(--color-border)',
                transition: 'all 0.3s',
              }}>
                {d.icon} {d.name}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {dhams.filter(d => d.id === active).map((d) => (
              <motion.div key={d.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}>
                  {/* Hero Card */}
                  <div style={{ background: d.gradient, borderRadius: 20, padding: '2.5rem', color: 'white' }}>
                    <div style={{ fontSize: '4rem', marginBottom: 12 }}>{d.icon}</div>
                    <h2 style={{ fontSize: '2rem', marginBottom: 4 }}>{d.name}</h2>
                    <p style={{ opacity: 0.9, marginBottom: 20 }}>{d.subtitle}</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: '0.85rem' }}>
                      <div><strong>Deity:</strong> {d.deity}</div>
                      <div><strong>Altitude:</strong> {d.altitude}</div>
                      <div><strong>Best Time:</strong> {d.bestTime}</div>
                      <div><strong>Timings:</strong> {d.templeTimings}</div>
                    </div>
                  </div>

                  {/* Details */}
                  <div>
                    <h3 style={{ marginBottom: 12 }}>Significance</h3>
                    <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, marginBottom: 20 }}>{d.significance}</p>
                    <h3 style={{ marginBottom: 12 }}>History</h3>
                    <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, marginBottom: 20 }}>{d.history}</p>
                  </div>
                </div>

                {/* Highlights */}
                <div style={{ marginTop: 32 }}>
                  <h3 style={{ marginBottom: 16 }}>Highlights</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                    {d.highlights.map((h, i) => (
                      <div key={i} style={{ padding: '1rem', borderRadius: 12, background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ color: d.color }}>✦</span>
                        <span style={{ fontSize: '0.9rem' }}>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Darshan Info */}
                <div style={{ marginTop: 24, padding: '1.5rem', borderRadius: 12, background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', display: 'flex', flexWrap: 'wrap', gap: 24 }}>
                  <div><strong>🕐 Temple Timings:</strong> {d.templeTimings}</div>
                  <div><strong>🙏 Darshan:</strong> {d.darshan}</div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="section">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 32 }}>
            <h2 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)' }}>Quick Comparison</h2>
          </motion.div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
              <thead>
                <tr style={{ background: 'var(--color-bg-tertiary)' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>Dham</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>Deity</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>Altitude</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>Best Time</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>Days Required</th>
                </tr>
              </thead>
              <tbody>
                {dhams.map((d) => (
                  <tr key={d.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>{d.icon} {d.name}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--color-text-secondary)' }}>{d.deity}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--color-text-secondary)' }}>{d.altitude}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--color-text-secondary)' }}>{d.bestTime}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--color-text-secondary)' }}>1-2 days</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg, #1e3a5f, #0f172a)', padding: '4rem 0', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ color: 'white', fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', marginBottom: 12 }}>Begin Your Spiritual Journey</h2>
          <p style={{ color: '#94a3b8', marginBottom: 28, maxWidth: 500, margin: '0 auto 28px' }}>
            Book a Char Dham Yatra package and experience divine bliss.
          </p>
          <Link to="/packages" style={{ padding: '16px 40px', borderRadius: 12, background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: 'white', fontWeight: 700, fontSize: '1.05rem', display: 'inline-block' }}>
            View Packages
          </Link>
        </div>
      </section>
    </>
  );
};

export default CharDham;

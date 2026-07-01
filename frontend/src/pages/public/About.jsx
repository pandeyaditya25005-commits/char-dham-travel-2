import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const fadeUp = { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { animate: { transition: { staggerChildren: 0.1 } } };

const team = [
  { name: 'Arun Singh', role: 'Founder & CEO', desc: '15 years in pilgrimage tourism' },
  { name: 'Neha Verma', role: 'Operations Head', desc: 'Ensures seamless travel experiences' },
  { name: 'Ravi Joshi', role: 'Lead Guide', desc: 'Expert in Himalayan treks & spirituality' },
  { name: 'Priya Rawat', role: 'Customer Relations', desc: 'Dedicated to traveler satisfaction' },
];

const milestones = [
  { year: '2012', event: 'Founded with a vision to serve pilgrims' },
  { year: '2014', event: 'First 100 travelers completed Char Dham' },
  { year: '2017', event: 'Expanded to hotel booking services' },
  { year: '2020', event: 'Digital transformation & online booking' },
  { year: '2024', event: 'Served 5000+ satisfied pilgrims' },
];

const About = () => (
  <>
    {/* Hero */}
    <section style={{ background: 'linear-gradient(135deg, #0f172a, #1e3a5f)', padding: '8rem 0 4rem', textAlign: 'center' }}>
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <span style={{ color: '#93c5fd', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: 2 }}>About Us</span>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'white', marginTop: 12, marginBottom: 16 }}>
            Our Mission is to Make Pilgrimage <span style={{ color: '#60a5fa' }}>Accessible to All</span>
          </h1>
          <p style={{ color: '#94a3b8', maxWidth: 600, margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.7 }}>
            We are a team of passionate travel enthusiasts dedicated to providing authentic, comfortable, and spiritually enriching Char Dham Yatra experiences.
          </p>
        </motion.div>
      </div>
    </section>

    {/* Mission */}
    <section className="section">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 48, alignItems: 'center' }}>
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', marginBottom: 16 }}>Our Story</h2>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, marginBottom: 16 }}>
              Founded in 2012, Char Dham Travel began with a simple belief — that everyone deserves to experience the divine presence of the Himalayas without worrying about logistics.
            </p>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, marginBottom: 16 }}>
              What started as a small operation guiding groups to Kedarnath has grown into a full-service pilgrimage platform covering all four Dhams with curated packages, comfortable hotels, and expert guides.
            </p>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
              Today, we are proud to have served over 5,000 travelers from across India and the world, providing them with safe, comfortable, and spiritually fulfilling journeys.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div style={{ background: 'linear-gradient(135deg, #1e3a5f, #0f172a)', borderRadius: 20, padding: '3rem 2rem', textAlign: 'center', color: 'white' }}>
              <div style={{ fontSize: '4rem', marginBottom: 16 }}>🛕</div>
              <h3 style={{ marginBottom: 8 }}>Our Mission</h3>
              <p style={{ color: '#94a3b8', lineHeight: 1.7 }}>"To make the sacred Char Dham Yatra accessible, comfortable, and spiritually enriching for every pilgrim."</p>
              <div style={{ marginTop: 20, color: '#60a5fa', fontStyle: 'italic' }}>— Arun Singh, Founder</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Timeline */}
    <section className="section" style={{ background: 'var(--color-bg-secondary)' }}>
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 48 }}>
          <span style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: 2 }}>Our Journey</span>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', marginTop: 8 }}>Milestones</h2>
        </motion.div>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          {milestones.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} style={{ display: 'flex', gap: 20, marginBottom: 24 }}>
              <div style={{ textAlign: 'center', minWidth: 60 }}>
                <div style={{ fontWeight: 800, color: 'var(--color-primary)', fontSize: '1.1rem' }}>{m.year}</div>
                {i < milestones.length - 1 && <div style={{ width: 2, height: 40, background: 'var(--color-border)', margin: '4px auto' }} />}
              </div>
              <div style={{ padding: '1rem 1.5rem', background: 'var(--color-bg)', borderRadius: 12, border: '1px solid var(--color-border)', flex: 1 }}>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>{m.event}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Team */}
    <section className="section">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 48 }}>
          <span style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: 2 }}>Our Team</span>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', marginTop: 8 }}>Meet the People Behind the Journey</h2>
        </motion.div>
        <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={{ once: true }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
          {team.map((m, i) => (
            <motion.div key={i} variants={fadeUp} style={{ textAlign: 'center', padding: '2rem 1.5rem', background: 'var(--color-bg-secondary)', borderRadius: 16, border: '1px solid var(--color-border)' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '2rem', fontWeight: 700, margin: '0 auto 16px' }}>
                {m.name.charAt(0)}
              </div>
              <h4 style={{ marginBottom: 4 }}>{m.name}</h4>
              <div style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.85rem', marginBottom: 8 }}>{m.role}</div>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>{m.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* CTA */}
    <section style={{ background: 'linear-gradient(135deg, #1e3a5f, #0f172a)', padding: '4rem 0', textAlign: 'center' }}>
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', color: 'white', marginBottom: 12 }}>Want to Know More?</h2>
          <p style={{ color: '#94a3b8', marginBottom: 28, maxWidth: 450, margin: '0 auto 28px' }}>
            Get in touch with us for any questions about our tours and services.
          </p>
          <Link to="/contact" style={{ padding: '14px 36px', borderRadius: 12, background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: 'white', fontWeight: 700, display: 'inline-block' }}>
            Contact Us
          </Link>
        </motion.div>
      </div>
    </section>
  </>
);

export default About;

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const categories = ['All', 'Yamunotri', 'Gangotri', 'Kedarnath', 'Badrinath', 'Scenery'];

const images = [
  { src: '🏔️', label: 'Yamunotri Temple', category: 'Yamunotri', desc: 'The sacred temple of Goddess Yamuna' },
  { src: '🌊', label: 'Gangotri Temple', category: 'Gangotri', desc: 'Origin of the holy Ganges' },
  { src: '🕉️', label: 'Kedarnath Temple', category: 'Kedarnath', desc: 'One of the 12 Jyotirlingas' },
  { src: '🛕', label: 'Badrinath Temple', category: 'Badrinath', desc: 'Seat of Lord Vishnu' },
  { src: '🏞️', label: 'Himalayan Views', category: 'Scenery', desc: 'Majestic Himalayan landscapes' },
  { src: '🌅', label: 'Sunset at Himalayas', category: 'Scenery', desc: 'Golden hour in the mountains' },
  { src: '🙏', label: 'Evening Aarti', category: 'Kedarnath', desc: 'Divine evening ceremony' },
  { src: '🏔️', label: 'Surya Kund', category: 'Yamunotri', desc: 'Hot springs at Yamunotri' },
  { src: '🏔️', label: 'Gaumukh Glacier', category: 'Gangotri', desc: 'Source of Bhagirathi River' },
  { src: '🏔️', label: 'Vasuki Tal', category: 'Kedarnath', desc: 'High altitude lake trek' },
  { src: '🏔️', label: 'Tapt Kund', category: 'Badrinath', desc: 'Natural hot spring' },
  { src: '🏞️', label: 'Mountain Trails', category: 'Scenery', desc: 'Trekking paths in Uttarakhand' },
];

const Gallery = () => {
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);

  const filtered = filter === 'All' ? images : images.filter(i => i.category === filter);

  return (
    <>
      <section style={{ background: 'linear-gradient(135deg, #0f172a, #1e3a5f)', padding: '8rem 0 3rem', textAlign: 'center' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 style={{ color: 'white', fontSize: 'clamp(2rem, 4vw, 2.8rem)', marginBottom: 8 }}>Gallery</h1>
            <p style={{ color: '#94a3b8', maxWidth: 500, margin: '0 auto' }}>Visual journey through the Char Dham pilgrimage</p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Filters */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 32 }}>
            {categories.map((cat) => (
              <button key={cat} onClick={() => setFilter(cat)} style={{
                padding: '8px 20px',
                borderRadius: 20,
                fontWeight: 600,
                fontSize: '0.85rem',
                background: filter === cat ? 'var(--color-primary)' : 'var(--color-bg-tertiary)',
                color: filter === cat ? 'white' : 'var(--color-text-secondary)',
                transition: 'all 0.2s',
              }}>
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <motion.div layout style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16 }}>
            <AnimatePresence mode="popLayout">
              {filtered.map((img, i) => (
                <motion.div
                  key={img.label}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                  onClick={() => setSelected(img)}
                  style={{ cursor: 'pointer' }}
                >
                  <div style={{
                    borderRadius: 12,
                    overflow: 'hidden',
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-bg-secondary)',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
                  >
                    <div style={{ height: 180, background: `linear-gradient(135deg, #1e3a5f, #0f172a)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>
                      {img.src}
                    </div>
                    <div style={{ padding: '1rem' }}>
                      <h4 style={{ fontSize: '0.95rem', marginBottom: 4 }}>{img.label}</h4>
                      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{img.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <p style={{ color: 'var(--color-text-muted)' }}>No images in this category</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            style={{
              position: 'fixed', inset: 0, zIndex: 2000,
              background: 'rgba(0,0,0,0.85)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '2rem', cursor: 'pointer',
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'var(--color-bg)',
                borderRadius: 20,
                maxWidth: 500,
                width: '100%',
                overflow: 'hidden',
                cursor: 'default',
              }}
            >
              <div style={{ height: 280, background: 'linear-gradient(135deg, #1e3a5f, #0f172a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '6rem' }}>
                {selected.src}
              </div>
              <div style={{ padding: '2rem' }}>
                <h2 style={{ marginBottom: 8 }}>{selected.label}</h2>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: 12 }}>{selected.desc}</p>
                <span style={{ padding: '4px 12px', borderRadius: 20, background: 'var(--color-bg-tertiary)', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{selected.category}</span>
              </div>
              <button
                onClick={() => setSelected(null)}
                style={{
                  position: 'absolute', top: 16, right: 16,
                  width: 40, height: 40, borderRadius: '50%',
                  background: 'rgba(0,0,0,0.3)', color: 'white',
                  fontSize: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Gallery;

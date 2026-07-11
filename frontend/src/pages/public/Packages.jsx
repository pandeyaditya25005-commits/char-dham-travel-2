import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllPackages } from '../../services/packageService';
import Loader from '../../components/common/Loader';
import { formatCurrency } from '../../utils/formatters';

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const Packages = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  const search = searchParams.get('search') || '';
  const difficulty = searchParams.get('difficulty') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  const fetchPackages = () => {
    setLoading(true);
    const params = { page, limit: 9 };
    if (search) params.search = search;
    if (difficulty) params.difficulty = difficulty;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;

    getAllPackages(params)
      .then((data) => {
    setPackages(data?.packages || []);
    setTotal(data?.total || 0);
})
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPackages(); }, [page, difficulty, minPrice, maxPrice]);
  useEffect(() => { setPage(1); }, [difficulty, minPrice, maxPrice]);

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete('page');
    setSearchParams(params);
  };

  const totalPages = Math.ceil(total / 9);

  return (
    <>
      <section style={{ background: 'linear-gradient(135deg, #0f172a, #1e3a5f)', padding: '8rem 0 3rem' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 style={{ color: 'white', fontSize: 'clamp(2rem, 4vw, 2.8rem)', marginBottom: 8 }}>Tour Packages</h1>
            <p style={{ color: '#94a3b8', fontSize: '1rem', maxWidth: 500 }}>Choose from our carefully crafted pilgrimage packages</p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Filters */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 32, alignItems: 'center' }}>
            <input
              placeholder="Search packages..."
              defaultValue={search}
              onKeyDown={(e) => { if (e.key === 'Enter') updateFilter('search', e.target.value); }}
              style={{ padding: '10px 16px', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-bg)', flex: 1, minWidth: 200, maxWidth: 320 }}
            />
            <select value={difficulty} onChange={(e) => updateFilter('difficulty', e.target.value)} style={{ padding: '10px 16px', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-bg)' }}>
              <option value="">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="moderate">Moderate</option>
              <option value="challenging">Challenging</option>
            </select>
            <input type="number" placeholder="Min Price" value={minPrice} onChange={(e) => updateFilter('minPrice', e.target.value)} style={{ padding: '10px 16px', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-bg)', width: 120 }} />
            <input type="number" placeholder="Max Price" value={maxPrice} onChange={(e) => updateFilter('maxPrice', e.target.value)} style={{ padding: '10px 16px', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-bg)', width: 120 }} />
            {(search || difficulty || minPrice || maxPrice) && (
              <button onClick={() => setSearchParams({})} style={{ padding: '10px 16px', color: 'var(--color-danger)', fontWeight: 500, fontSize: '0.85rem' }}>
                Clear Filters
              </button>
            )}
          </div>

          {loading ? <Loader /> : packages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔍</div>
              <h3>No Packages Found</h3>
              <p style={{ color: 'var(--color-text-secondary)', marginTop: 8 }}>Try adjusting your search or filters</p>
            </div>
          ) : (
            <>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: 16 }}>Showing {packages.length} of {total} packages</p>
              <AnimatePresence mode="wait">
                <motion.div key={page + difficulty + minPrice + maxPrice} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
                  {packages.map((pkg, i) => (
                    <motion.div key={pkg._id} variants={fadeUp} initial="initial" animate="animate" transition={{ delay: i * 0.05 }}>
                      <Link to={`/packages/${pkg.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                        <div className="card" style={{ overflow: 'hidden', height: '100%' }}>
                          <div style={{ height: 180, background: `linear-gradient(135deg, #1e3a5f, #0f172a)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: '2.5rem' }}>🏔️</span>
                          </div>
                          <div style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
                              <h3 style={{ fontSize: '1.1rem' }}>{pkg.title}</h3>
                              <span style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '1.1rem', whiteSpace: 'nowrap' }}>{formatCurrency(pkg.price)}</span>
                            </div>
                            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginBottom: 12, lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                              {pkg.description}
                            </p>
                            <div style={{ display: 'flex', gap: 16, fontSize: '0.8rem', color: 'var(--color-text-muted)', flexWrap: 'wrap' }}>
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
              </AnimatePresence>

              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 40 }}>
                  <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} style={{ padding: '10px 20px', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-bg)', fontWeight: 600, opacity: page <= 1 ? 0.5 : 1 }}>← Prev</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setPage(p)} style={{ padding: '10px 18px', borderRadius: 8, border: '1px solid var(--color-border)', background: p === page ? 'var(--color-primary)' : 'var(--color-bg)', color: p === page ? 'white' : 'inherit', fontWeight: 600 }}>{p}</button>
                  ))}
                  <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} style={{ padding: '10px 20px', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-bg)', fontWeight: 600, opacity: page >= totalPages ? 0.5 : 1 }}>Next →</button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default Packages;

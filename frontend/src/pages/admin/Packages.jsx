import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllPackages } from '../../services/packageService';
import { createPackage, updatePackage, deletePackage } from '../../services/adminService';
import Loader from '../../components/common/Loader';
import { formatCurrency } from '../../utils/formatters';

const initForm = { title: '', slug: '', description: '', duration: 1, price: 0, maxGroupSize: 20, difficulty: 'moderate', includes: '', excludes: '' };

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initForm);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetch = () => {
    setLoading(true);
    getAllPackages({ limit: 100 })
      .then((data) => setPackages(data.packages))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const openCreate = () => { setForm(initForm); setEditing(null); setShowForm(true); };

  const openEdit = (pkg) => {
    setForm({ title: pkg.title, slug: pkg.slug, description: pkg.description, duration: pkg.duration, price: pkg.price, maxGroupSize: pkg.maxGroupSize, difficulty: pkg.difficulty, includes: (pkg.includes || []).join(', '), excludes: (pkg.excludes || []).join(', ') });
    setEditing(pkg._id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, includes: form.includes.split(',').map(s => s.trim()).filter(Boolean), excludes: form.excludes.split(',').map(s => s.trim()).filter(Boolean) };
      if (editing) { await updatePackage(editing, payload); }
      else { await createPackage(payload); }
      setShowForm(false);
      fetch();
    } catch (err) { alert(err.message); }
    finally { setSaving(false); }
  };

  const toggleActive = async (id, current) => {
    if (current) { await deletePackage(id); }
    else { await updatePackage(id, { isActive: true }); }
    fetch();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: '1.5rem' }}>Tour Packages</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>{packages.length} packages</p>
        </div>
        <button onClick={openCreate} className="btn btn-primary btn-sm">+ New Package</button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden', marginBottom: 20 }}>
            <form onSubmit={handleSubmit} style={{ background: 'var(--color-bg)', borderRadius: 12, border: '1px solid var(--color-border)', padding: '1.5rem' }}>
              <h3 style={{ marginBottom: 16 }}>{editing ? 'Edit Package' : 'New Package'}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <input placeholder="Title" value={form.title} onChange={(e) => setForm(p => ({...p, title: e.target.value}))} required style={inp} />
                <input placeholder="Slug (e.g., kedarnath-yatra)" value={form.slug} onChange={(e) => setForm(p => ({...p, slug: e.target.value}))} required style={inp} />
                <textarea placeholder="Description" value={form.description} onChange={(e) => setForm(p => ({...p, description: e.target.value}))} required rows={3} style={{ ...inp, gridColumn: '1/-1' }} />
                <input type="number" placeholder="Duration (days)" value={form.duration} onChange={(e) => setForm(p => ({...p, duration: Number(e.target.value)}))} required style={inp} />
                <input type="number" placeholder="Price (₹)" value={form.price} onChange={(e) => setForm(p => ({...p, price: Number(e.target.value)}))} required style={inp} />
                <input type="number" placeholder="Max Group Size" value={form.maxGroupSize} onChange={(e) => setForm(p => ({...p, maxGroupSize: Number(e.target.value)}))} style={inp} />
                <select value={form.difficulty} onChange={(e) => setForm(p => ({...p, difficulty: e.target.value}))} style={inp}>
                  <option value="easy">Easy</option>
                  <option value="moderate">Moderate</option>
                  <option value="challenging">Challenging</option>
                </select>
                <input placeholder="Includes (comma separated)" value={form.includes} onChange={(e) => setForm(p => ({...p, includes: e.target.value}))} style={inp} />
                <input placeholder="Excludes (comma separated)" value={form.excludes} onChange={(e) => setForm(p => ({...p, excludes: e.target.value}))} style={inp} />
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                <button type="submit" disabled={saving} className="btn btn-primary btn-sm" style={{ opacity: saving ? 0.7 : 1 }}>{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn btn-sm" style={{ border: '1px solid var(--color-border)', borderRadius: 8 }}>Cancel</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? <Loader /> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {packages.map((pkg, i) => (
            <motion.div key={pkg._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }} style={{ background: 'var(--color-bg)', borderRadius: 12, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
              <div style={{ height: 120, background: 'linear-gradient(135deg, #1e3a5f, #0f172a)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '2rem' }}>🏔️</div>
              <div style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 6 }}>
                  <h3 style={{ fontSize: '0.95rem' }}>{pkg.title}</h3>
                  <span style={{ padding: '2px 8px', borderRadius: 12, fontSize: '0.65rem', fontWeight: 600, background: pkg.isActive ? '#ecfdf5' : '#fef2f2', color: pkg.isActive ? '#059669' : '#dc2626' }}>{pkg.isActive ? 'Active' : 'Inactive'}</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: 8 }}>{pkg.duration} days • {pkg.difficulty} • Max {pkg.maxGroupSize}</p>
                <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 8 }}>{formatCurrency(pkg.price)}</p>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => openEdit(pkg)} className="btn btn-sm btn-outline" style={{ fontSize: '0.7rem', padding: '4px 10px' }}>Edit</button>
                  <button onClick={() => toggleActive(pkg._id, pkg.isActive)} className="btn btn-sm" style={{ fontSize: '0.7rem', padding: '4px 10px', borderRadius: 6, background: pkg.isActive ? '#fef2f2' : '#ecfdf5', color: pkg.isActive ? '#dc2626' : '#059669', fontWeight: 600 }}>{pkg.isActive ? 'Deactivate' : 'Activate'}</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

const inp = { width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-bg)', fontSize: '0.85rem', outline: 'none' };

export default Packages;

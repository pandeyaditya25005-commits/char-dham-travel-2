import { useState } from 'react';
import { motion } from 'framer-motion';
import useAuth from '../../hooks/useAuth';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      setMessage({ type: 'error', text: 'Name and phone are required' });
      return;
    }
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      await updateProfile(form);
      setMessage({ type: 'success', text: 'Profile updated successfully' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Update failed' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: 600 }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: 4 }}>Profile Settings</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 28, fontSize: '0.9rem' }}>Manage your account information</p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32, padding: '1.5rem', background: 'var(--color-bg)', borderRadius: 12, border: '1px solid var(--color-border)' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.75rem', fontWeight: 700 }}>
          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <div>
          <h3 style={{ fontSize: '1.1rem' }}>{user?.name}</h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>{user?.email} • {user?.role === 'admin' ? 'Administrator' : 'Traveler'}</p>
          <p style={{ color: user?.isVerified ? 'var(--color-success)' : 'var(--color-warning)', fontSize: '0.8rem', fontWeight: 500 }}>{user?.isVerified ? '✓ Verified' : '⚠ Not verified'}</p>
        </div>
      </div>

      {message.text && (
        <div style={{ padding: '12px 16px', borderRadius: 8, marginBottom: 16, fontSize: '0.85rem', background: message.type === 'success' ? '#ecfdf5' : '#fef2f2', color: message.type === 'success' ? 'var(--color-success)' : 'var(--color-danger)', border: `1px solid ${message.type === 'success' ? '#a7f3d0' : '#fecaca'}` }}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ background: 'var(--color-bg)', borderRadius: 12, border: '1px solid var(--color-border)', padding: '1.5rem' }}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>Full Name</label>
          <input value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-bg)', fontSize: '0.9rem', outline: 'none' }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>Email</label>
          <input value={user?.email || ''} disabled style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-bg-tertiary)', fontSize: '0.9rem', outline: 'none', color: 'var(--color-text-muted)' }} />
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 4 }}>Email cannot be changed</p>
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>Phone</label>
          <input value={form.phone} onChange={(e) => setForm(p => ({ ...p, phone: e.target.value }))} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-bg)', fontSize: '0.9rem', outline: 'none' }} />
        </div>
        <button type="submit" disabled={saving} className="btn btn-primary" style={{ opacity: saving ? 0.7 : 1 }}>{saving ? 'Saving...' : 'Save Changes'}</button>
      </form>
    </motion.div>
  );
};

export default Profile;

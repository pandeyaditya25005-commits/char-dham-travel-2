import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuth from '../../hooks/useAuth';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Valid email is required';
    if (!form.phone.trim() || !/^\+?[1-9]\d{9,14}$/.test(form.phone)) errs.phone = 'Valid phone number is required (10-15 digits)';
    if (form.password.length < 8) errs.password = 'Password must be at least 8 characters';
    else if (!/(?=.*[a-z])/.test(form.password)) errs.password = 'Password needs a lowercase letter';
    else if (!/(?=.*[A-Z])/.test(form.password)) errs.password = 'Password needs an uppercase letter';
    else if (!/(?=.*\d)/.test(form.password)) errs.password = 'Password needs a number';
    return errs;
  };

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      await register(form);
      navigate('/verify-otp', { state: { email: form.email } });
    } catch (err) {
      setErrors({ submit: err.message || 'Registration failed' });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (field) => ({
    width: '100%', padding: '12px 16px', borderRadius: 8,
    border: `1px solid ${errors[field] ? 'var(--color-danger)' : 'var(--color-border)'}`,
    background: 'var(--color-bg)', fontSize: '0.95rem', outline: 'none',
    transition: 'border-color 0.2s',
  });

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      {errors.submit && (
        <div style={{ padding: '12px 16px', borderRadius: 8, background: '#fef2f2', color: 'var(--color-danger)', fontSize: '0.85rem', border: '1px solid #fecaca', marginBottom: 16 }}>
          {errors.submit}
        </div>
      )}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6, color: 'var(--color-text)' }}>Full Name</label>
          <input name="name" placeholder="Your full name" value={form.name} onChange={handleChange} style={inputStyle('name')} onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'} onBlur={(e) => e.target.style.borderColor = errors.name ? 'var(--color-danger)' : 'var(--color-border)'} />
          {errors.name && <p style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: 4 }}>{errors.name}</p>}
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6, color: 'var(--color-text)' }}>Email</label>
          <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} style={inputStyle('email')} onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'} onBlur={(e) => e.target.style.borderColor = errors.email ? 'var(--color-danger)' : 'var(--color-border)'} />
          {errors.email && <p style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: 4 }}>{errors.email}</p>}
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6, color: 'var(--color-text)' }}>Phone Number</label>
          <input name="phone" placeholder="+91 99999 99999" value={form.phone} onChange={handleChange} style={inputStyle('phone')} onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'} onBlur={(e) => e.target.style.borderColor = errors.phone ? 'var(--color-danger)' : 'var(--color-border)'} />
          {errors.phone && <p style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: 4 }}>{errors.phone}</p>}
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6, color: 'var(--color-text)' }}>Password</label>
          <input name="password" type="password" placeholder="Min 8 chars, upper + lower + number" value={form.password} onChange={handleChange} style={inputStyle('password')} onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'} onBlur={(e) => e.target.style.borderColor = errors.password ? 'var(--color-danger)' : 'var(--color-border)'} />
          {errors.password && <p style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: 4 }}>{errors.password}</p>}
        </div>
        <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', borderRadius: 8, background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: 'white', fontWeight: 700, fontSize: '1rem', marginTop: 4, opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Sign in</Link>
      </p>
    </motion.div>
  );
};

export default Register;

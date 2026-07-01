import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { forgotPassword } from '../../services/authService';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email');
      return;
    }
    setLoading(true);
    try {
      await forgotPassword(email);
      setSubmitted(true);
      setTimeout(() => navigate('/reset-password', { state: { email }, replace: true }), 1500);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      {submitted && (
        <div style={{ padding: '12px 16px', borderRadius: 8, background: '#f0fdf4', color: 'var(--color-success)', fontSize: '0.85rem', border: '1px solid #bbf7d0', marginBottom: 16 }}>
          If this email is registered, you will receive an OTP shortly. Redirecting...
        </div>
      )}
      {error && (
        <div style={{ padding: '12px 16px', borderRadius: 8, background: '#fef2f2', color: 'var(--color-danger)', fontSize: '0.85rem', border: '1px solid #fecaca', marginBottom: 16 }}>
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6, color: 'var(--color-text)' }}>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%', padding: '12px 16px', borderRadius: 8,
              border: '1px solid var(--color-border)', background: 'var(--color-bg)',
              fontSize: '0.95rem', outline: 'none',
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
          />
        </div>
        <button
          type="submit"
          disabled={loading || submitted}
          style={{
            width: '100%', padding: '14px', borderRadius: 8,
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            color: 'white', fontWeight: 700, fontSize: '1rem',
            opacity: loading || submitted ? 0.7 : 1,
          }}
        >
          {loading ? 'Sending...' : submitted ? 'OTP Sent' : 'Send OTP'}
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
        Remember your password?{' '}
        <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Sign in</Link>
      </p>
    </motion.div>
  );
};

export default ForgotPassword;

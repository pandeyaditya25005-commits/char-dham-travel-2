import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuth from '../../hooks/useAuth';

const VerifyOtp = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [sent, setSent] = useState(false);
  const { verifyOtp, resendOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email) navigate('/register', { replace: true });
  }, [email, navigate]);

  useEffect(() => {
    if (inputRefs.current[0]) inputRefs.current[0].focus();
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError('');
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      const newOtp = pasted.split('');
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length !== 6) { setError('Please enter the full 6-digit OTP'); return; }
    setLoading(true);
    try {
      await verifyOtp(email, code);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setSent(false);
    try {
      await resendOtp(email);
      setSent(true);
    } catch (err) {
      setError(err.message || 'Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      {error && (
        <div style={{ padding: '12px 16px', borderRadius: 8, background: '#fef2f2', color: 'var(--color-danger)', fontSize: '0.85rem', border: '1px solid #fecaca', marginBottom: 16 }}>
          {error}
        </div>
      )}
      {sent && (
        <div style={{ padding: '12px 16px', borderRadius: 8, background: '#f0fdf4', color: 'var(--color-success)', fontSize: '0.85rem', border: '1px solid #bbf7d0', marginBottom: 16 }}>
          OTP resent successfully
        </div>
      )}
      <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: 20, textAlign: 'center' }}>
        A 6-digit OTP has been sent to <strong>{email}</strong>
      </p>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 24 }}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => inputRefs.current[i] = el}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={i === 0 ? handlePaste : undefined}
              style={{
                width: 48, height: 56, textAlign: 'center', fontSize: '1.3rem', fontWeight: 700,
                borderRadius: 8, border: `2px solid ${error ? 'var(--color-danger)' : 'var(--color-border)'}`,
                background: 'var(--color-bg)', outline: 'none',
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
              onBlur={(e) => e.target.style.borderColor = error ? 'var(--color-danger)' : 'var(--color-border)'}
            />
          ))}
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%', padding: '14px', borderRadius: 8,
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            color: 'white', fontWeight: 700, fontSize: '1rem',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
      </form>
      <div style={{ textAlign: 'center', marginTop: 20 }}>
        <button
          onClick={handleResend}
          disabled={resending}
          style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem', opacity: resending ? 0.7 : 1 }}
        >
          {resending ? 'Resending...' : 'Resend OTP'}
        </button>
      </div>
      <p style={{ textAlign: 'center', marginTop: 16, fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
        <Link to="/register" style={{ color: 'var(--color-text-muted)' }}>Use a different email</Link>
      </p>
    </motion.div>
  );
};

export default VerifyOtp;

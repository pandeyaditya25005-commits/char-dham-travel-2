import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)',
      padding: '2rem 1rem',
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          width: '100%',
          maxWidth: 440,
          background: 'var(--color-bg)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          padding: '2.5rem',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            color: 'var(--color-text)',
            textDecoration: 'none',
          }}>
            <span style={{ color: 'var(--color-primary)' }}>Char</span>Dham
          </Link>
          {title && (
            <h1 style={{ fontSize: '1.5rem', marginTop: '1.5rem', marginBottom: '0.25rem' }}>
              {title}
            </h1>
          )}
          {subtitle && (
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
              {subtitle}
            </p>
          )}
        </div>
        {children}
      </motion.div>
    </div>
  );
};

export default AuthLayout;

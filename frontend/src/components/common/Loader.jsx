import { motion } from 'framer-motion';

const Loader = ({ size = 40, text = 'Loading...' }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
      padding: '3rem',
    }}>
      <motion.div
        style={{
          width: size,
          height: size,
          border: '4px solid var(--color-border)',
          borderTopColor: 'var(--color-primary)',
          borderRadius: '50%',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      />
      <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
        {text}
      </p>
    </div>
  );
};

export default Loader;

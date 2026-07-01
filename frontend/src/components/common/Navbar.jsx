import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAuth from '../../hooks/useAuth';
import { NAV_LINKS } from '../../utils/constants';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      height: 'var(--header-height)',
      background: scrolled ? 'var(--color-bg)' : 'transparent',
      borderBottom: scrolled ? '1px solid var(--color-border)' : '1px solid transparent',
      transition: 'all var(--transition-base)',
    }}>
      <div className="container" style={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Link to="/" style={{
          fontSize: '1.5rem',
          fontWeight: 800,
          color: scrolled ? 'var(--color-text)' : 'white',
          textDecoration: 'none',
          letterSpacing: '-0.5px',
        }}>
          <span style={{ color: 'var(--color-primary)' }}>Char</span>Dham
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ display: 'none', gap: '0.25rem', '@media (min-width: 768px)': { display: 'flex' } }}>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  color: scrolled ? 'var(--color-text-secondary)' : 'rgba(255,255,255,0.9)',
                  fontWeight: 500,
                  fontSize: '0.9rem',
                  transition: 'all var(--transition-fast)',
                  background: isActive(link.path) ? 'var(--color-primary-light)' : 'transparent',
                  ...(isActive(link.path) && { color: 'var(--color-primary)' }),
                }}
                onMouseEnter={(e) => {
                  if (!isActive(link.path)) {
                    e.target.style.color = scrolled ? 'var(--color-primary)' : 'white';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(link.path)) {
                    e.target.style.color = scrolled ? 'var(--color-text-secondary)' : 'rgba(255,255,255,0.9)';
                  }
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div style={{ display: 'none', alignItems: 'center', gap: '0.75rem', marginLeft: '1rem', '@media (min-width: 768px)': { display: 'flex' } }}>
            {isAuthenticated ? (
              <>
                <Link
                  to={isAdmin ? '/admin/dashboard' : '/dashboard'}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--color-primary)',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                  }}
                >
                  {isAdmin ? 'Admin' : 'Dashboard'}
                </Link>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.25rem 1rem',
                  borderRadius: 'var(--radius-full)',
                  background: scrolled ? 'var(--color-bg-tertiary)' : 'rgba(255,255,255,0.15)',
                }}>
                  <span style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: 'var(--color-primary)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}>
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                  <span style={{
                    color: scrolled ? 'var(--color-text)' : 'white',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                  }}>
                    {user?.name?.split(' ')[0]}
                  </span>
                </div>
                <button
                  onClick={logout}
                  style={{
                    padding: '0.5rem 1rem',
                    color: scrolled ? 'var(--color-text-secondary)' : 'rgba(255,255,255,0.8)',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" style={{
                  padding: '0.5rem 1.25rem',
                  color: scrolled ? 'var(--color-text)' : 'white',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                }}>
                  Login
                </Link>
                <Link to="/register" style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--color-primary)',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                }}>
                  Register
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            style={{
              display: 'flex',
              padding: '0.5rem',
              color: scrolled ? 'var(--color-text)' : 'white',
              '@media (min-width: 768px)': { display: 'none' },
            }}
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {isOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              background: 'var(--color-bg)',
              borderBottom: '1px solid var(--color-border)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <div className="container" style={{ padding: '1rem 0' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      color: isActive(link.path) ? 'var(--color-primary)' : 'var(--color-text)',
                      fontWeight: isActive(link.path) ? 600 : 400,
                      background: isActive(link.path) ? 'var(--color-primary-light)' : 'transparent',
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <hr style={{ margin: '1rem 0', border: 'none', borderTop: '1px solid var(--color-border)' }} />

              {isAuthenticated ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ padding: '0.5rem 1rem', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                    Signed in as <strong>{user?.email}</strong>
                  </div>
                  <Link to={isAdmin ? '/admin/dashboard' : '/dashboard'} style={{
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--color-primary)',
                    color: 'white',
                    fontWeight: 600,
                    textAlign: 'center',
                  }}>
                    {isAdmin ? 'Admin Dashboard' : 'My Dashboard'}
                  </Link>
                  <button onClick={logout} style={{
                    padding: '0.75rem 1rem',
                    color: 'var(--color-danger)',
                    fontWeight: 500,
                    textAlign: 'center',
                  }}>
                    Logout
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <Link to="/login" style={{
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-primary)',
                    fontWeight: 600,
                    textAlign: 'center',
                    border: '2px solid var(--color-primary)',
                  }}>
                    Login
                  </Link>
                  <Link to="/register" style={{
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--color-primary)',
                    color: 'white',
                    fontWeight: 600,
                    textAlign: 'center',
                  }}>
                    Register
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

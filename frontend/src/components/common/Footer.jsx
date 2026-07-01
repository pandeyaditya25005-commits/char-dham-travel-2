import { Link } from 'react-router-dom';
import { DESTINATIONS, NAV_LINKS } from '../../utils/constants';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      background: '#0f172a',
      color: '#cbd5e1',
      paddingTop: '4rem',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2rem',
          paddingBottom: '3rem',
        }}>
          <div>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              color: 'white',
              marginBottom: '1rem',
            }}>
              <span style={{ color: '#3b82f6' }}>Char</span>Dham
            </h3>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.8, marginBottom: '1rem' }}>
              Experience the divine journey to the four sacred abodes nestled in the majestic Himalayas. 
              We offer curated pilgrimage tours with comfort and devotion.
            </p>
          </div>

          <div>
            <h4 style={{ color: 'white', marginBottom: '1rem', fontSize: '1rem' }}>
              Quick Links
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {NAV_LINKS.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    style={{
                      color: '#94a3b8',
                      fontSize: '0.875rem',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => { e.target.style.color = '#3b82f6'; }}
                    onMouseLeave={(e) => { e.target.style.color = '#94a3b8'; }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={{ color: 'white', marginBottom: '1rem', fontSize: '1rem' }}>
              Char Dham
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {DESTINATIONS.map((d) => (
                <li key={d.name}>
                  <Link
                    to={`/packages?search=${d.name}`}
                    style={{
                      color: '#94a3b8',
                      fontSize: '0.875rem',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => { e.target.style.color = '#3b82f6'; }}
                    onMouseLeave={(e) => { e.target.style.color = '#94a3b8'; }}
                  >
                    {d.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={{ color: 'white', marginBottom: '1rem', fontSize: '1rem' }}>
              Contact
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                📍 Rishikesh, Uttarakhand, India
              </li>
              <li>
                <a href="tel:+919999999999" style={{ color: '#94a3b8', fontSize: '0.875rem' }}
                   onMouseEnter={(e) => { e.target.style.color = '#3b82f6'; }}
                   onMouseLeave={(e) => { e.target.style.color = '#94a3b8'; }}>
                  📞 +91 99999 99999
                </a>
              </li>
              <li>
                <a href="mailto:info@chardhamtravel.com" style={{ color: '#94a3b8', fontSize: '0.875rem' }}
                   onMouseEnter={(e) => { e.target.style.color = '#3b82f6'; }}
                   onMouseLeave={(e) => { e.target.style.color = '#94a3b8'; }}>
                  ✉️ info@chardhamtravel.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid #1e293b',
          padding: '1.5rem 0',
          textAlign: 'center',
          fontSize: '0.8rem',
          color: '#64748b',
        }}>
          &copy; {currentYear} Char Dham Travel. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

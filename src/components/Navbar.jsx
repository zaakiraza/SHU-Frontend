import { Link } from 'react-router-dom';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ theme, toggleTheme }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <header style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--bg-secondary)', position: 'sticky', top: 0, zIndex: 50 }}>
      <div className="container flex-between" style={{ height: '72px' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-pink))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '20px' }}>
            C
          </div>
          <span style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '-0.5px' }} className="gradient-text">CAMPUS KONNECT</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="desktop-nav">
          <ul style={{ display: 'flex', gap: '32px', listStyle: 'none', alignItems: 'center', fontWeight: '500' }}>
            <li><Link to="/reviews">Reviews</Link></li>
            <li><Link to="/events">Events</Link></li>
            <li><Link to="/internships">Internships</Link></li>
            <li>
              <button onClick={toggleTheme} className="flex-center" style={{ color: 'var(--text-primary)', padding: '8px' }}>
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </li>
            <li>
              {user.role === 'guest' ? (
                <Link to="/login" className="btn btn-primary">Sign In</Link>
              ) : (
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <Link to="/dashboard" className="btn" style={{ background: 'rgba(159, 122, 234, 0.2)', color: 'var(--accent-purple)' }}>Dashboard</Link>
                  <button onClick={logout} className="btn btn-primary" style={{ background: 'var(--accent-pink)' }}>Log Out</button>
                </div>
              )}
            </li>
          </ul>
        </nav>

        {/* Mobile Toggle & Theme */}
        <div className="mobile-nav-toggle">
           <button onClick={toggleTheme} className="flex-center" style={{ color: 'var(--text-primary)', padding: '8px' }}>
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
           <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} style={{ color: 'var(--text-primary)' }}>
             {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
           </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div style={{ padding: '20px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '16px', listStyle: 'none', fontWeight: '500' }}>
            <li><Link to="/reviews" onClick={() => setIsMobileMenuOpen(false)}>Reviews</Link></li>
            <li><Link to="/events" onClick={() => setIsMobileMenuOpen(false)}>Events</Link></li>
            <li><Link to="/internships" onClick={() => setIsMobileMenuOpen(false)}>Internships</Link></li>
            <li>
              {user.role === 'guest' ? (
                <Link to="/login" className="btn btn-primary" style={{ width: '100%', textAlign: 'center' }} onClick={() => setIsMobileMenuOpen(false)}>Sign In</Link>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <Link to="/dashboard" className="btn" style={{ width: '100%', textAlign: 'center', background: 'rgba(159, 122, 234, 0.2)', color: 'var(--accent-purple)' }} onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
                  <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="btn btn-primary" style={{ width: '100%', background: 'var(--accent-pink)' }}>Log Out</button>
                </div>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;

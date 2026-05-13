const Footer = () => {
  return (
    <footer style={{ background: 'var(--bg-secondary)', padding: '40px 0', borderTop: '1px solid var(--border-color)', marginTop: 'auto' }}>
      <div className="container">
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '40px' }}>
          <div style={{ maxWidth: '300px' }}>
            <h3 className="gradient-text" style={{ fontSize: '24px', fontWeight: '800' }}>CAMPUS KONNECT</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '12px' }}>
              The digital layer for students. Connect, collaborate, and grow within your verified university ecosystem.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '60px', flexWrap: 'wrap' }}>
            <div>
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>Platform</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-secondary)' }}>
                <li>Reviews</li>
                <li>Events</li>
                <li>Internships</li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>Resources</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-secondary)' }}>
                <li>Help Center</li>
                <li>Guidelines</li>
                <li>Mental Health</li>
                <li>Contact Admin</li>
              </ul>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '40px', paddingTop: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <p>&copy; {new Date().getFullYear()} CAMPUS KONNECT. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

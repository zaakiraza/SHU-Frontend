import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Link as LinkIcon, Building } from 'lucide-react';
import { BASE_URL } from '../config';

const UniversityProfile = () => {
  const { id } = useParams();
  const [university, setUniversity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUniversity = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/universities/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch university details.');
        }

        const data = await response.json();
        setUniversity(data.university || data.data || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUniversity();
    }
  }, [id]);

  if (loading) {
    return <div className="container" style={{ padding: '80px 0', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading University Profile...</div>;
  }

  if (error) {
    return (
      <div className="container" style={{ padding: '80px 0' }}>
        <div style={{ background: 'rgba(255, 0, 0, 0.1)', color: '#ff4d4f', padding: '24px', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(255, 0, 0, 0.2)' }}>
          <h2 style={{ marginBottom: '8px' }}>Error</h2>
          <p>{error}</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: '16px', display: 'inline-block' }}>Return Home</Link>
        </div>
      </div>
    );
  }

  if (!university) return null;

  return (
    <div className="container" style={{ padding: '40px 0' }}>
      <div className="glass-card" style={{ padding: '40px', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative background element */}
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'var(--accent-purple)', filter: 'blur(80px)', opacity: '0.2', zIndex: 0 }}></div>
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px', flexWrap: 'wrap' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '24px', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-purple)' }}>
              <Building size={48} />
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: '36px', marginBottom: '8px' }}>{university.name || 'University Name'}</h1>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', color: 'var(--text-secondary)' }}>
                {university.domain && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <LinkIcon size={16} /> @{university.domain}
                  </span>
                )}
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={16} /> {university.location || 'Location not specified'}
                </span>
              </div>
            </div>
            <button className="btn btn-primary">Join University</button>
          </div>

          <div style={{ marginTop: '40px', paddingTop: '40px', borderTop: '1px solid var(--border-color)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
            <div>
              <h3 style={{ marginBottom: '16px', color: 'var(--text-secondary)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>About</h3>
              <p style={{ color: 'var(--text-primary)', lineHeight: '1.6' }}>
                {university.description || 'Welcome to the official portal for this university. Connect with societies, join events, and explore campus life.'}
              </p>
            </div>
            <div>
              <h3 style={{ marginBottom: '16px', color: 'var(--text-secondary)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Statistics</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                  <span>Registered Students</span>
                  <span style={{ fontWeight: 'bold', color: 'var(--accent-pink)' }}>{university.studentCount || 0}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                  <span>Active Societies</span>
                  <span style={{ fontWeight: 'bold', color: 'var(--accent-blue)' }}>{university.societyCount || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversityProfile;

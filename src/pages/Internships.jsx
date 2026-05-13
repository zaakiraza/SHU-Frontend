import { Briefcase, Clock, Users } from 'lucide-react';
import { useState, useEffect } from 'react';

const Internships = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInternships = async () => {
      setLoading(true);
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
        const res = await fetch(`${baseUrl}/api/announcements?type=internship&page=1&limit=20`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` }
        });
        const json = await res.json();
        const list = json.data?.announcements || json.data || [];
        setInternships(Array.isArray(list) ? list : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInternships();
  }, []);

  return (
    <div className="container">
      <div style={{ padding: '40px 0' }}>
        <h1 style={{ fontSize: '36px' }}>Campus <span className="gradient-text">Internships</span></h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', fontSize: '18px' }}>
          Find the best internship opportunities tailored for your university students.
        </p>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>Loading internships...</div>
        ) : error ? (
          <div style={{ background: 'rgba(255,0,0,0.1)', color: '#ff4d4f', padding: '20px', borderRadius: '8px', border: '1px solid rgba(255,0,0,0.2)' }}>{error}</div>
        ) : internships.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>No internship opportunities posted yet. Check back soon!</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {internships.map(internship => (
              <div key={internship._id} className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold', color: 'var(--accent-purple)', flexShrink: 0 }}>
                    {(internship.society?.name || 'I').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '18px', marginBottom: '4px' }}>{internship.title}</h3>
                    <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{internship.society?.name || 'University'}</span>
                  </div>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.5', marginBottom: '20px', flex: 1 }}>{internship.content}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={14} /> Posted {new Date(internship.createdAt).toLocaleDateString()}
                  </div>
                  {internship.createdBy?.name && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Users size={14} /> By {internship.createdBy.name}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Internships;

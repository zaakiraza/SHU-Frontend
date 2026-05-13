import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Users, Calendar, Mail, ExternalLink, ArrowLeft } from 'lucide-react';

const SocietyProfile = () => {
  const { id } = useParams();
  const [society, setSociety] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSociety = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
        const response = await fetch(`${baseUrl}/api/societies/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch society details.');
        }

        const data = await response.json();
        setSociety(data.society || data.data || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchSociety();
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Loading Society Profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ padding: '80px 0' }}>
        <div style={{ background: 'rgba(255,0,0,0.1)', color: '#ff4d4f', padding: '24px', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(255,0,0,0.2)' }}>
          <h2 style={{ marginBottom: '8px' }}>Error</h2>
          <p>{error}</p>
          <Link to="/dashboard" className="btn btn-primary" style={{ marginTop: '16px', display: 'inline-block' }}>
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!society) return null;

  return (
    <div className="container" style={{ padding: '40px 0' }}>

      <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '14px' }}>
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      {/* Header Card */}
      <div className="glass-card" style={{ padding: '40px', position: 'relative', overflow: 'hidden', marginBottom: '24px' }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', background: 'var(--accent-pink)', filter: 'blur(80px)', opacity: 0.15, zIndex: 0 }} />

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'flex-start', gap: '24px', flexWrap: 'wrap' }}>
          <div style={{ width: '90px', height: '90px', borderRadius: '20px', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-purple)', flexShrink: 0 }}>
            <Users size={42} />
          </div>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent-pink)', fontWeight: 'bold' }}>Society</span>
            <h1 style={{ fontSize: '32px', margin: '4px 0 8px' }}>{society.name || 'Society Name'}</h1>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', color: 'var(--text-secondary)', fontSize: '14px' }}>
              {society.university?.name && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  🏫 {society.university.name}
                </span>
              )}
              {society.chairperson?.email && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mail size={14} /> {society.chairperson.email}
                </span>
              )}
              {society.createdAt && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={14} /> Founded {new Date(society.createdAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
          <span style={{
            padding: '6px 18px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold',
            background: society.status === 'active' ? 'rgba(72, 187, 120, 0.2)' : 'rgba(245, 101, 101, 0.2)',
            color: society.status === 'active' ? '#48BB78' : '#F56565'
          }}>
            {society.status || 'Active'}
          </span>
        </div>
      </div>

      {/* Details Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>

        {/* About */}
        <div className="glass-card">
          <h3 style={{ marginBottom: '16px' }}>About</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7' }}>
            {society.description || 'No description provided for this society.'}
          </p>
        </div>

        {/* Stats */}
        <div className="glass-card">
          <h3 style={{ marginBottom: '16px' }}>Stats</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { label: 'Total Members', value: society.memberCount ?? society.members?.length ?? 0, color: 'var(--accent-purple)' },
              { label: 'Events Posted', value: society.eventCount ?? 0, color: 'var(--accent-blue)' },
              { label: 'Announcements', value: society.announcementCount ?? 0, color: 'var(--accent-pink)' },
            ].map(stat => (
              <div key={stat.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{stat.label}</span>
                <span style={{ fontWeight: 'bold', color: stat.color }}>{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chairperson */}
        <div className="glass-card">
          <h3 style={{ marginBottom: '16px' }}>Chairperson</h3>
          {society.chairperson ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-purple)', fontWeight: 'bold', fontSize: '20px' }}>
                {(society.chairperson.name || 'C')[0].toUpperCase()}
              </div>
              <div>
                <p style={{ fontWeight: '600', marginBottom: '4px' }}>{society.chairperson.name || 'N/A'}</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{society.chairperson.email || 'N/A'}</p>
              </div>
            </div>
          ) : (
            <p style={{ color: 'var(--text-secondary)' }}>No chairperson assigned.</p>
          )}
        </div>

        {/* Members */}
        {society.members && society.members.length > 0 && (
          <div className="glass-card" style={{ gridColumn: '1 / -1' }}>
            <h3 style={{ marginBottom: '20px' }}>Members ({society.members.length})</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
              {society.members.map((member, i) => (
                <div key={member._id || member.id || i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', background: 'var(--bg-tertiary)', borderRadius: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-purple)', fontWeight: 'bold', fontSize: '15px' }}>
                    {(member.name || 'M')[0].toUpperCase()}
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: '500' }}>{member.name || 'Member'}</p>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{member.email || ''}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocietyProfile;

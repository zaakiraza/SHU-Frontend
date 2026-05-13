import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { Megaphone, Globe, Lock, Trash2 } from 'lucide-react';

const inputStyle = { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'Inter' };

const SocietyDashboard = () => {
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('event');
  const [society, setSociety] = useState('');
  const [visibility, setVisibility] = useState('all');
  const [targetSociety, setTargetSociety] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Track posted announcements for this session (to show delete option)
  const [postedAnnouncements, setPostedAnnouncements] = useState([]);

  const handlePostAnnouncement = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/api/announcements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({
          title,
          content,
          type,
          society,
          visibility,
          targetSociety: targetSociety || null
        })
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || 'Failed to create announcement.');

      setSuccess(`Announcement "${title}" posted successfully!`);
      setTitle('');
      setContent('');
      setType('event');
      setSociety('');
      setVisibility('all');
      setTargetSociety('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAnnouncement = async (announcementId) => {
    if (!window.confirm('Delete this announcement?')) return;
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/api/announcements/${announcementId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });
      if (!response.ok) throw new Error('Failed to delete.');
      setPostedAnnouncements(prev => prev.filter(a => a.id !== announcementId));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="container" style={{ padding: '40px 0' }}>
      <h1 style={{ fontSize: '36px', marginBottom: '8px' }}>Society <span className="gradient-text">Admin</span></h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Manage events and announcements for your society at {user.university}.</p>
      
      <div className="glass-card" style={{ maxWidth: '700px' }}>
        <h3 style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Megaphone size={20} className="gradient-text" /> Post Announcement
        </h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '14px' }}>
          Create events, internships, or general notices. Set visibility to control who can see this announcement.
        </p>

        {error && (
          <div style={{ background: 'rgba(255, 0, 0, 0.1)', color: '#ff4d4f', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', border: '1px solid rgba(255, 0, 0, 0.2)' }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ background: 'rgba(72, 187, 120, 0.1)', color: '#48bb78', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', border: '1px solid rgba(72, 187, 120, 0.2)' }}>
            {success}
          </div>
        )}

        <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} onSubmit={handlePostAnnouncement}>
          <input
            type="text"
            placeholder="Announcement Title *"
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={inputStyle}
            required
          />

          <textarea
            placeholder="Content / Description *"
            rows={4}
            value={content}
            onChange={e => setContent(e.target.value)}
            style={{ ...inputStyle, resize: 'vertical' }}
            required
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>Type</label>
              <select value={type} onChange={e => setType(e.target.value)} style={inputStyle}>
                <option value="event">Event</option>
                <option value="internship">Internship</option>
                <option value="general">General Notice</option>
                <option value="industrial_visit">Industrial Visit</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>Visibility</label>
              <select value={visibility} onChange={e => setVisibility(e.target.value)} style={inputStyle}>
                <option value="all">
                  🌐 All Universities
                </option>
                <option value="university">
                  🏫 My University Only
                </option>
                <option value="society">
                  👥 Target Society
                </option>
              </select>
            </div>
          </div>

          <input
            type="text"
            placeholder="Society ID (your society) *"
            value={society}
            onChange={e => setSociety(e.target.value)}
            style={inputStyle}
            required
          />

          {visibility === 'society' && (
            <input
              type="text"
              placeholder="Target Society ID (optional)"
              value={targetSociety}
              onChange={e => setTargetSociety(e.target.value)}
              style={inputStyle}
            />
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', background: 'var(--bg-tertiary)', fontSize: '14px', color: 'var(--text-secondary)' }}>
            {visibility === 'all' ? <Globe size={18} color="var(--accent-purple)" /> : <Lock size={18} color="var(--accent-pink)" />}
            <span>
              {visibility === 'all' && 'This announcement will be visible to students across all universities.'}
              {visibility === 'university' && 'This announcement will be visible to students at your university only.'}
              {visibility === 'society' && 'This announcement will be visible to the specified target society only.'}
            </span>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Posting...' : 'Post Announcement'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SocietyDashboard;


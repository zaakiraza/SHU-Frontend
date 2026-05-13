import { useAuth } from '../context/AuthContext';
import { MessageSquare, ThumbsUp } from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container" style={{ padding: '40px 0' }}>
      <h1 style={{ fontSize: '36px', marginBottom: '8px' }}>Student <span className="gradient-text">Portal</span></h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Welcome back! You are authenticated via {user.university}.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {/* Submit Feedback */}
        <div className="glass-card">
          <h3 style={{ marginBottom: '16px' }}>University Feedback</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Submit private feedback to {user.university} admins.</p>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <textarea placeholder="Describe your grievance or feedback..." rows={4} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', resize: 'vertical' }} />
            <button className="btn btn-secondary" onClick={(e) => e.preventDefault()}>Submit Ticket</button>
          </form>
        </div>

        {/* Personalized Feed Preview */}
        <div className="glass-card">
          <h3 style={{ marginBottom: '16px' }}>Your Activity Feed</h3>
          <div style={{ padding: '16px', background: 'var(--bg-tertiary)', borderRadius: '8px', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', color: 'var(--accent-purple)', fontWeight: 'bold' }}>{user.university} Admin</span>
            <p style={{ marginTop: '4px', fontSize: '14px' }}>Library hours have been extended for finals week!</p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px', color: 'var(--text-secondary)', fontSize: '12px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}><ThumbsUp size={14}/> 42</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}><MessageSquare size={14}/> 12</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

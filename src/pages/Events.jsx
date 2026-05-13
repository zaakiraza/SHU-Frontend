import { Calendar as CalendarIcon, Users } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { BASE_URL } from '../config';

const Events = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/api/announcements?type=event&page=1&limit=20`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` }
        });
        const json = await res.json();
        const list = json.data?.announcements || json.data || [];
        setEvents(Array.isArray(list) ? list : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="container">
      <div style={{ padding: '40px 0' }}>
        <h1 style={{ fontSize: '36px' }}>Campus <span className="gradient-text">Events</span></h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', fontSize: '18px' }}>
          Never miss out on campus life. Aggregated events from all verified societies.
        </p>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>Loading events...</div>
        ) : error ? (
          <div style={{ background: 'rgba(255,0,0,0.1)', color: '#ff4d4f', padding: '20px', borderRadius: '8px', border: '1px solid rgba(255,0,0,0.2)' }}>{error}</div>
        ) : events.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>No events posted yet. Check back soon!</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {events.map(event => (
              <div key={event._id} className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent-purple)', fontWeight: 'bold' }}>
                      {event.society?.name || 'Campus'}
                    </span>
                    <span style={{ background: event.visibility === 'all' ? 'var(--accent-purple)' : 'var(--accent-pink)', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' }}>
                      {event.visibility === 'all' ? 'Global' : 'University Only'}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>{event.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.5', marginBottom: '16px' }}>{event.content}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-secondary)', fontSize: '14px', marginTop: 'auto' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CalendarIcon size={16} /> {new Date(event.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                  {event.createdBy?.name && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Users size={16} /> Posted by {event.createdBy.name}
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

export default Events;

import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [universityId, setUniversityId] = useState('');
  const [registerType, setRegisterType] = useState('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [universities, setUniversities] = useState([]);
  const navigate = useNavigate();

  // Fetch approved universities for student dropdown
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
        const res = await fetch(`${baseUrl}/api/universities?page=1&limit=100`);
        const json = await res.json();
        const list = json.data?.universities || json.data || [];
        setUniversities(Array.isArray(list) ? list : []);
      } catch {
        // silently fall back to empty list
      }
    };
    fetchUniversities();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (registerType === 'student' && !universityId) {
      setError('Please select your university.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      
      const response = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          registerType === 'student'
            ? { name, email, password, role: 'student', universityId }
            : { name, email, password, role: 'uniAdmin' }
        ),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed. Please try again.');
      }
      
      // Backend wraps response in data.data: { userId }
      const payload = data.data || {};
      navigate('/verify-otp', { state: { userId: payload.userId || payload._id } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container flex-center" style={{ minHeight: '80vh', padding: '40px 0' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '450px', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-pink))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '24px', margin: '0 auto 16px' }}>
            C
          </div>
          <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>Create Account</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Join CAMPUS KONNECT today.</p>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', background: 'var(--bg-tertiary)', padding: '4px', borderRadius: '8px' }}>
          <button 
            style={{ flex: 1, padding: '8px', borderRadius: '6px', border: 'none', background: registerType === 'student' ? 'var(--bg-primary)' : 'transparent', color: registerType === 'student' ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: registerType === 'student' ? 'bold' : 'normal', cursor: 'pointer', transition: 'all 0.2s' }}
            onClick={(e) => { e.preventDefault(); setRegisterType('student'); setError(''); }}
          >
            Student
          </button>
          <button 
            style={{ flex: 1, padding: '8px', borderRadius: '6px', border: 'none', background: registerType === 'uniAdmin' ? 'var(--bg-primary)' : 'transparent', color: registerType === 'uniAdmin' ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: registerType === 'uniAdmin' ? 'bold' : 'normal', cursor: 'pointer', transition: 'all 0.2s' }}
            onClick={(e) => { e.preventDefault(); setRegisterType('uniAdmin'); setError(''); }}
          >
            University Admin
          </button>
        </div>

        {error && (
          <div style={{ background: 'rgba(255, 0, 0, 0.1)', color: '#ff4d4f', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', border: '1px solid rgba(255, 0, 0, 0.2)' }}>
            {error}
          </div>
        )}

        <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} onSubmit={handleRegister}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--text-primary)' }}>Full Name</label>
            <input 
              type="text" 
              placeholder="John Doe" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ width: '100%', padding: '14px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: 'Inter', outline: 'none' }} 
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--text-primary)' }}>University Email (.edu)</label>
            <input 
              type="email" 
              placeholder="student@university.edu" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '14px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: 'Inter', outline: 'none' }} 
            />
          </div>
          {registerType === 'student' && (
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--text-primary)' }}>Select University</label>
              <select 
                value={universityId}
                onChange={(e) => setUniversityId(e.target.value)}
                required
                style={{ width: '100%', padding: '14px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: 'Inter', outline: 'none', appearance: 'none' }}
              >
                <option value="" disabled>-- Choose your University --</option>
                {universities.length === 0 && (
                  <option value="" disabled>Loading universities...</option>
                )}
                {universities.map(uni => (
                  <option key={uni._id || uni.id} value={uni._id || uni.id}>{uni.name}</option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--text-primary)' }}>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '14px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: 'Inter', outline: 'none' }} 
            />
          </div>
          
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', padding: '14px', fontSize: '16px', marginTop: '8px', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent-purple)', fontWeight: 'bold' }}>Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

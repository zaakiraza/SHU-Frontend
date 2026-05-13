import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Use environment variable for base URL or fallback
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

      const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'Login failed. Please check your credentials.');
      }

      // Backend wraps response in data.data: { token, user }
      const payload = data.data || {};
      if (payload.token) {
        localStorage.setItem('token', payload.token);
      }

      login(payload.user || { email, role: 'student' });

      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container flex-center" style={{ minHeight: '60vh', padding: '40px 0' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-pink))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '24px', margin: '0 auto 16px' }}>
            C
          </div>
          <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Sign in with your university credentials.</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(255, 0, 0, 0.1)', color: '#ff4d4f', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', border: '1px solid rgba(255, 0, 0, 0.2)' }}>
            {error}
          </div>
        )}

        <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} onSubmit={handleLogin}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--text-primary)' }}>University Email</label>
            <input
              type="email"
              placeholder="student@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '14px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: 'Inter', outline: 'none' }}
            />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontWeight: '500', color: 'var(--text-primary)' }}>Password</label>
              <a href="#" style={{ color: 'var(--accent-pink)', fontSize: '14px' }}>Forgot Password?</a>
            </div>
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
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-secondary)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--accent-purple)', fontWeight: 'bold' }}>Create Account</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

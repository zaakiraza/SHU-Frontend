import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId;

  const handleVerify = async (e) => {
    e.preventDefault();
    
    if (!userId) {
      setError('Missing User ID. Please register again.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      
      const response = await fetch(`${baseUrl}/api/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, otp }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'OTP Verification failed. Please try again.');
      }

      // If successful, navigate to login
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async (e) => {
    e.preventDefault();
    if (!userId) {
      setError('Missing User ID. Please register again.');
      return;
    }

    setResendLoading(true);
    setError('');
    setMessage('');

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      
      const response = await fetch(`${baseUrl}/api/auth/resend-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'Failed to resend OTP. Please try again.');
      }

      setMessage('A new OTP has been sent to your email.');
    } catch (err) {
      setError(err.message);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="container flex-center" style={{ minHeight: '60vh', padding: '40px 0' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-blue))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '24px', margin: '0 auto 16px' }}>
            ✓
          </div>
          <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>Verify Email</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Enter the 6-digit OTP sent to your email.</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(255, 0, 0, 0.1)', color: '#ff4d4f', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', border: '1px solid rgba(255, 0, 0, 0.2)' }}>
            {error}
          </div>
        )}

        {message && (
          <div style={{ background: 'rgba(72, 187, 120, 0.1)', color: '#48bb78', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', border: '1px solid rgba(72, 187, 120, 0.2)' }}>
            {message}
          </div>
        )}

        <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} onSubmit={handleVerify}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--text-primary)', textAlign: 'center' }}>One-Time Password</label>
            <input 
              type="text" 
              placeholder="123456" 
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              maxLength={6}
              style={{ width: '100%', padding: '14px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: 'Inter', outline: 'none', textAlign: 'center', fontSize: '24px', letterSpacing: '8px' }} 
            />
          </div>
          
          <button type="submit" className="btn btn-primary" disabled={loading || resendLoading} style={{ width: '100%', padding: '14px', fontSize: '16px', marginTop: '8px', opacity: (loading || resendLoading) ? 0.7 : 1 }}>
            {loading ? 'Verifying...' : 'Verify Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-secondary)' }}>
          Didn't receive the code?{' '}
          <button 
            onClick={handleResend} 
            disabled={resendLoading || loading}
            style={{ background: 'none', border: 'none', color: 'var(--accent-purple)', fontWeight: 'bold', cursor: (resendLoading || loading) ? 'not-allowed' : 'pointer', fontSize: '16px', opacity: (resendLoading || loading) ? 0.7 : 1 }}
          >
            {resendLoading ? 'Sending...' : 'Resend OTP'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;

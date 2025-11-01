import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>🔐 Welcome Back</h2>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px', fontSize: '14px' }}>
          Sign in to continue to SlotSwapper
        </p>
        
        {error && (
          <div className="alert alert-error" style={{ animation: 'slideUp 0.3s ease-out' }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label style={{ fontWeight: '600', marginBottom: '8px', display: 'block' }}>
              📧 Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              style={{ padding: '12px 15px' }}
            />
          </div>

          <div className="form-group">
            <label style={{ fontWeight: '600', marginBottom: '8px', display: 'block' }}>
              🔒 Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              style={{ padding: '12px 15px' }}
            />
            <div style={{ textAlign: 'right', marginTop: '8px' }}>
              <Link 
                to="/forgot-password" 
                style={{ 
                  fontSize: '13px', 
                  color: '#667eea', 
                  textDecoration: 'none',
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#764ba2';
                  e.currentTarget.style.textDecoration = 'underline';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#667eea';
                  e.currentTarget.style.textDecoration = 'none';
                }}
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '20px' }}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner" style={{ width: '20px', height: '20px', marginRight: '10px', display: 'inline-block', borderTopColor: 'white' }}></span>
                Logging in...
              </>
            ) : (
              '🚀 Login'
            )}
          </button>
        </form>

        <div className="auth-link">
          Don't have an account? <Link to="/signup">Create one now</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;


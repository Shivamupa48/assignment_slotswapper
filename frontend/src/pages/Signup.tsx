import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Only register, don't auto-login
      await signup(name, email, password);
      // Show success message and redirect to login
      setError('');
      setSuccess('✅ Account created successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>✨ Join SlotSwapper</h2>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px', fontSize: '14px' }}>
          Create your account and start swapping time slots
        </p>
        
        {error && (
          <div className="alert alert-error" style={{ animation: 'slideUp 0.3s ease-out' }}>
            ⚠️ {error}
          </div>
        )}
        {success && (
          <div className="alert alert-success" style={{ animation: 'slideUp 0.3s ease-out' }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label style={{ fontWeight: '600', marginBottom: '8px', display: 'block' }}>
              👤 Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="John Doe"
              style={{ padding: '12px 15px' }}
            />
          </div>

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
              minLength={6}
              placeholder="Minimum 6 characters"
              style={{ padding: '12px 15px' }}
            />
            <small style={{ color: '#999', fontSize: '12px', marginTop: '5px', display: 'block' }}>
              Must be at least 6 characters long
            </small>
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
                Creating account...
              </>
            ) : (
              '🎉 Create Account'
            )}
          </button>
        </form>

        <div className="auth-link">
          Already have an account? <Link to="/login">Sign in here</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;


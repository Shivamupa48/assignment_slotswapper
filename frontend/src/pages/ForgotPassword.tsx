import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await authService.resetPassword(email, newPassword);
      setSuccess('✅ Password reset successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>🔑 Reset Password</h2>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px', fontSize: '14px' }}>
          Enter your email and new password to reset
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
              📧 Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
              style={{ padding: '12px 15px' }}
            />
          </div>

          <div className="form-group">
            <label style={{ fontWeight: '600', marginBottom: '8px', display: 'block' }}>
              🔒 New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              placeholder="Enter new password (min 6 characters)"
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
                Resetting...
              </>
            ) : (
              '🔄 Reset Password'
            )}
          </button>
        </form>

        <div className="auth-link" style={{ marginTop: '20px' }}>
          <Link to="/login">← Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

const EditProfile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const { user: updatedUser } = await authService.updateProfile(name, email);
      
      // Update auth context
      updateUser(updatedUser);
      
      setSuccess('✅ Profile updated successfully!');
      
      // Redirect after 1.5 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ marginBottom: '10px', fontSize: '32px', fontWeight: '700', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          ✏️ Edit Profile
        </h2>
        <p style={{ color: '#666', fontSize: '16px' }}>
          Update your profile information
        </p>
      </div>

      <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
        {error && (
          <div className="alert alert-error">{error}</div>
        )}
        {success && (
          <div className="alert alert-success">{success}</div>
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
              placeholder="Your name"
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
              placeholder="your@email.com"
              style={{ padding: '12px 15px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ flex: 1 }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner" style={{ width: '20px', height: '20px', marginRight: '10px', display: 'inline-block', borderTopColor: 'white' }}></span>
                  Updating...
                </>
              ) : (
                '💾 Save Changes'
              )}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/dashboard')}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;


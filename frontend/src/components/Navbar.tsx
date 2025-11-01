import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setShowProfileMenu(false);
  };

  const handleEditProfile = () => {
    navigate('/edit-profile');
    setShowProfileMenu(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/dashboard">
          <h1>📅 SlotSwapper</h1>
        </Link>
        <nav>
          <Link to="/dashboard">My Calendar</Link>
          <Link to="/marketplace">Marketplace</Link>
          <Link to="/notifications">Notifications</Link>
          <span style={{ margin: '0 15px', color: '#ccc' }}>|</span>
          
          {/* Profile Dropdown */}
          <div className="profile-dropdown" ref={menuRef}>
            <button 
              className="profile-button"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <span className="profile-icon">👤</span>
              <span className="profile-name">{user?.name}</span>
              <span className="dropdown-arrow">{showProfileMenu ? '▲' : '▼'}</span>
            </button>
            
            {showProfileMenu && (
              <div className="profile-menu">
                <div className="profile-menu-header">
                  <div className="profile-avatar">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="profile-menu-name">{user?.name}</div>
                  <div className="profile-menu-email">{user?.email}</div>
                </div>
                <div className="profile-menu-divider"></div>
                <button 
                  className="profile-menu-item"
                  onClick={handleEditProfile}
                >
                  <span className="profile-menu-item-icon">✏️</span>
                  <span>Edit Profile</span>
                </button>
                <button 
                  className="profile-menu-item profile-menu-item-danger"
                  onClick={handleLogout}
                >
                  <span className="profile-menu-item-icon">🚪</span>
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </nav>
  );
};

export default Navbar;


import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const AccountSettingsPage = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  
  if (!user) return <div className="page-container">Please log in.</div>;

  const handleSave = (e) => {
    e.preventDefault();
    // Assuming a PUT /api/users/profile endpoint exists
    alert("Profile settings saved (Simulated)");
  };

  return (
    <div className="page-container">
      <h1 className="mb-2">Account Settings</h1>
      <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>Manage your profile and preferences.</p>

      <div className="bento-grid">
        <div className="card" style={{ gridColumn: 'span 8' }}>
          <h3 className="mb-6">Profile Information</h3>
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
              />
            </div>
            <div className="form-group mb-6">
              <label>Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                disabled
                style={{ opacity: 0.7, cursor: 'not-allowed' }}
              />
            </div>
            <button type="submit" className="btn-primary">Save Changes</button>
          </form>
        </div>

        <div className="card" style={{ gridColumn: 'span 4' }}>
          <h3 className="mb-4">Danger Zone</h3>
          <p className="mb-4" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Permanently delete your account and all associated datasets and summaries.
          </p>
          <button className="btn-secondary" style={{ color: 'var(--error)', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountSettingsPage;

import React, { useState } from 'react';

const ProfilePage = ({ user, userRole, profileData, onBack }) => {
  const [activeCategory, setActiveCategory] = useState('overview');

  const profile = profileData || {
    name: user.name || 'User',
    email: user.email,
    industry: userRole === 'Company' ? 'Technology' : 'Supply Chain & Logistics',
    years_of_experience: userRole === 'Company' ? '15+ Years' : '28 Years',
    bio: userRole === 'Company' 
      ? "We are a forward-thinking organization dedicated to innovation and excellence. We value the deep experience that senior professionals bring to our projects and are committed to creating meaningful consulting opportunities."
      : "Highly experienced professional with over 25 years in the industry. Currently focused on sharing expertise and mentoring the next generation of leaders while maintaining a balanced retirement lifestyle.",
    skills: userRole === 'Company' 
      ? ['Project Management', 'Consulting', 'Leadership', 'Risk Management']
      : ['Strategic Planning', 'Process Optimization', 'Team Leadership', 'Six Sigma Black Belt', 'Global Logistics'],
    location: 'Mumbai, India',
    ex_company: 'Logistics Pioneers Inc.',
    ex_designation: 'Staff Logistics Manager',
    age: 50,
    dob: '1974-01-01'
  };

  const initials = profile.name ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';

  const categories = userRole === 'Company' ? [
    { id: 'overview', label: 'Company Overview', icon: '🏢' },
    { id: 'professional', label: 'Hiring Preferences', icon: '🔍' },
    { id: 'financial', label: 'Spending & Contracts', icon: '💳' },
    { id: 'resume', label: 'Documents & Portfolio', icon: '📎' },
    { id: 'settings', label: 'Settings & Security', icon: '⚙️' },
  ] : [
    { id: 'overview', label: 'Overview', icon: '👤' },
    { id: 'professional', label: 'Expertise & Experience', icon: '💼' },
    { id: 'resume', label: 'Resume & Documents', icon: '📄' },
    { id: 'financial', label: 'Earnings & Goals', icon: '💰' },
    { id: 'settings', label: 'Settings & Security', icon: '⚙️' },
  ];

  const renderContent = () => {
    switch (activeCategory) {
      case 'overview':
        return (
          <div className="profile-section-content animate-fade-in">
            <h3>{userRole === 'Company' ? 'Company Overview' : 'Account Overview'}</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>{userRole === 'Company' ? 'Legal Name' : 'Full Name'}</label>
                <div className="value">{profile.name}</div>
              </div>
              <div className="info-item">
                <label>{userRole === 'Company' ? 'Business Email' : 'Email Address'}</label>
                <div className="value">{user.email}</div>
              </div>
              {userRole === 'Professional' && (
                <>
                  <div className="info-item">
                    <label>Age & DOB</label>
                    <div className="value">{profile.age} Yrs ({profile.dob})</div>
                  </div>
                  <div className="info-item">
                    <label>Current Location</label>
                    <div className="value">{profile.location}</div>
                  </div>
                </>
              )}
              <div className="info-item">
                <label>Account Status</label>
                <div className="value">
                  <span className="badge badge-success">{userRole === 'Company' ? 'Verified Business' : 'Verified Expert'}</span>
                </div>
              </div>
            </div>

            <div className="profile-bio mt-6">
              <label>{userRole === 'Company' ? 'About Our Company' : 'Professional Bio'}</label>
              <p>{profile.bio}</p>
            </div>
          </div>
        );
      case 'professional':
        return (
          <div className="profile-section-content animate-fade-in">
            <h3>{userRole === 'Company' ? 'Hiring Preferences' : 'Professional Expertise'}</h3>
            <div className="category-group">
              <h4 className="category-title">{userRole === 'Company' ? 'Preferred Industries' : 'Domain Experience'}</h4>
              <div className="info-grid">
                <div className="info-item">
                  <label>Industry / Domain</label>
                  <div className="value">{profile.industry}</div>
                </div>
                <div className="info-item">
                  <label>{userRole === 'Company' ? 'Min. Experience Required' : 'Years of Experience'}</label>
                  <div className="value">{profile.years_of_experience}</div>
                </div>
              </div>
            </div>

            <div className="category-group mt-6">
              <h4 className="category-title">{userRole === 'Company' ? 'Top Skills We Hire' : 'Skills & Certifications'}</h4>
              <div className="flex gap-2 flex-wrap mt-2">
                {profile.skills.map(skill => (
                  <span key={skill} className="job-tag" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>{skill}</span>
                ))}
              </div>
            </div>
          </div>
        );
      case 'financial':
        return (
          <div className="profile-section-content animate-fade-in">
            <h3>{userRole === 'Company' ? 'Spending & Contracts' : 'Retirement & Earnings'}</h3>
            <div className="stats-row">
              <div className="stat-card mini">
                <span className="stat-value">{userRole === 'Company' ? '$45,000' : '$12,450'}</span>
                <span className="stat-label">{userRole === 'Company' ? 'Total Spent' : 'Total Earned'}</span>
              </div>
              <div className="stat-card mini">
                <span className="stat-value">{userRole === 'Company' ? '8' : '4'}</span>
                <span className="stat-label">{userRole === 'Company' ? 'Active Contracts' : 'Projects Completed'}</span>
              </div>
            </div>

            {userRole === 'Professional' && (
              <div className="retirement-goal-card mt-8">
                <div className="flex justify-between items-center mb-4">
                  <h4>Retirement Milestone</h4>
                  <span className="text-primary font-bold">85% Achieved</span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: '85%' }}></div>
                </div>
                <p className="mt-4 small">You are on track to your goal of $50k annual supplementary income.</p>
              </div>
            )}
          </div>
        );
      case 'resume':
        return (
          <div className="profile-section-content animate-fade-in">
            <h3>{userRole === 'Company' ? 'Documents & Portfolio' : 'Resume & Professional Documents'}</h3>
            <div className="resume-section">
              <div className="upload-zone mt-4">
                <div className="flex flex-column items-center p-8 bg-slate rounded-lg border-dashed">
                  <span style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</span>
                  <h4>{userRole === 'Company' ? 'Upload Portfolio / Brochure' : 'Update Your Resume'}</h4>
                  <p className="small text-secondary mb-4">PDF, DOCX (Max 10MB)</p>
                  <button className="btn btn-outline">Select File</button>
                </div>
              </div>

              <div className="document-list mt-8">
                <h4 className="mb-4">Uploaded Documents</h4>
                <div className="doc-item flex justify-between items-center p-4 border rounded">
                  <div className="flex items-center gap-3">
                    <span style={{ fontSize: '1.5rem' }}>📄</span>
                    <div>
                      <div className="font-bold">{userRole === 'Company' ? 'Registration_Certificate.pdf' : 'Main_Resume_2024.pdf'}</div>
                      <div className="small text-secondary">Uploaded on April 12, 2024</div>
                    </div>
                  </div>
                  <span className="badge badge-success">Verified</span>
                </div>
                {userRole === 'Professional' && (
                  <div className="doc-item flex justify-between items-center p-4 border rounded mt-3">
                    <div className="flex items-center gap-3">
                      <span style={{ fontSize: '1.5rem' }}>📄</span>
                      <div>
                        <div className="font-bold">Retirement_Letter.pdf</div>
                        <div className="small text-secondary">Uploaded on April 12, 2024</div>
                      </div>
                    </div>
                    <span className="badge badge-success">Verified</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="profile-section-content animate-fade-in">
            <h3>Settings & Security</h3>
            <div className="settings-list">
              <div className="settings-item">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold">Email Notifications</div>
                    <div className="text-secondary small">Receive updates about new job matches</div>
                  </div>
                  <input type="checkbox" defaultChecked />
                </div>
              </div>
              <div className="settings-item">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold">Two-Factor Authentication</div>
                    <div className="text-secondary small">Add an extra layer of security to your account</div>
                  </div>
                  <button className="btn btn-outline btn-sm">Enable</button>
                </div>
              </div>
              <div className="settings-item">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold">Visible to Employers</div>
                    <div className="text-secondary small">Your profile will appear in searches</div>
                  </div>
                  <input type="checkbox" defaultChecked />
                </div>
              </div>
            </div>
            <button className="btn btn-danger-outline mt-8" style={{ color: 'var(--error-color)', borderColor: 'var(--error-color)' }}>Delete Account</button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="profile-page-container">
      <div className="container">
        {/* Profile Header */}
        <div className="profile-header-card">
          <div className="profile-cover"></div>
          <div className="profile-header-content">
            <div className="profile-avatar-wrapper">
              <div className="profile-avatar-large">
                {user.avatar ? <img src={user.avatar} alt={user.name} /> : initials}
              </div>
              <div className="verified-badge-large">✓</div>
            </div>
            <div className="profile-title-area">
              <div className="flex items-center gap-3">
                <h1 style={{ margin: 0, fontSize: '2rem' }}>{profile.name}</h1>
                {profileData ? (
                  <span className="badge-pulsing">Resume Powered</span>
                ) : (
                  <span className="expert-badge-v2">Verified Expert</span>
                )}
              </div>
              <p className="profile-subtitle">{profile.ex_designation} | {profile.years_of_experience} Exp</p>
              <div className="flex gap-4 mt-2">
                <span className="profile-meta">📍 {profile.location}</span>
                <span className="profile-meta">📧 {user.email}</span>
              </div>
            </div>
            <div className="profile-actions">
              <button className="btn btn-primary">Edit Profile</button>
              <button className="btn btn-outline" onClick={onBack}>Back to Home</button>
            </div>
          </div>
        </div>

        {/* Profile Main Grid */}
        <div className="profile-main-grid mt-8">
          {/* Sidebar Menu */}
          <aside className="profile-sidebar">
            <div className="profile-menu-card">
              {categories.map(cat => (
                <div 
                  key={cat.id} 
                  className={`profile-menu-item ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  <span className="menu-icon">{cat.icon}</span>
                  <span className="menu-label">{cat.label}</span>
                  {activeCategory === cat.id && <span className="active-indicator"></span>}
                </div>
              ))}
            </div>

            {/* Completion Card */}
            <div className="profile-completion-card mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold">Profile Strength</span>
                <span className="text-success font-bold">92%</span>
              </div>
              <div className="progress-bar-bg-sm">
                <div className="progress-bar-fill-success" style={{ width: '92%' }}></div>
              </div>
              <p className="mt-2 text-secondary" style={{ fontSize: '0.75rem' }}>Your profile is looking great! Add a video intro to reach 100%.</p>
            </div>
          </aside>

          {/* Content Area */}
          <main className="profile-content-area">
            <div className="profile-content-card">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>

      <style jsx="true">{`
        .profile-page-container {
          padding-bottom: 5rem;
          background-color: var(--bg-color);
        }

        .profile-header-card {
          background-color: white;
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-lg);
          margin-top: -2rem;
          position: relative;
          z-index: 5;
        }

        .profile-cover {
          height: 160px;
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
          opacity: 0.9;
        }

        .profile-header-content {
          padding: 0 3rem 2rem 3rem;
          display: flex;
          align-items: flex-end;
          gap: 2rem;
          margin-top: -4rem;
        }

        .profile-avatar-wrapper {
          position: relative;
        }

        .profile-avatar-large {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          border: 6px solid white;
          background-color: #cbd5e1;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          font-weight: bold;
          color: white;
          overflow: hidden;
          box-shadow: var(--shadow-md);
        }

        .profile-avatar-large img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .verified-badge-large {
          position: absolute;
          bottom: 10px;
          right: 10px;
          background-color: var(--success-color);
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid white;
          font-weight: bold;
          box-shadow: var(--shadow-sm);
        }

        .profile-title-area {
          flex: 1;
          padding-bottom: 0.5rem;
        }

        .expert-badge-v2 {
          background-color: #e0f2fe;
          color: #0369a1;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: bold;
          text-transform: uppercase;
        }

        .badge-pulsing {
          background-color: #f0fdf4;
          color: #16a34a;
          border: 1px solid #bbf7d0;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: bold;
          text-transform: uppercase;
          animation: pulse-green 2s infinite;
        }

        @keyframes pulse-green {
          0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); }
          100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
        }

        .profile-subtitle {
          font-size: 1.1rem;
          color: var(--text-secondary);
          margin-top: 0.25rem;
        }

        .profile-meta {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .profile-actions {
          display: flex;
          gap: 1rem;
          padding-bottom: 1rem;
        }

        .profile-main-grid {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 2rem;
        }

        .profile-menu-card {
          background-color: white;
          border-radius: var(--radius-lg);
          padding: 1rem;
          box-shadow: var(--shadow-md);
        }

        .profile-menu-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: var(--transition);
          position: relative;
          color: var(--text-secondary);
        }

        .profile-menu-item:hover {
          background-color: #f1f5f9;
          color: var(--primary-color);
        }

        .profile-menu-item.active {
          background-color: #f0f7ff;
          color: var(--primary-color);
          font-weight: 600;
        }

        .active-indicator {
          position: absolute;
          right: 12px;
          width: 6px;
          height: 6px;
          background-color: var(--primary-color);
          border-radius: 50%;
        }

        .profile-content-card {
          background-color: white;
          border-radius: var(--radius-lg);
          padding: 2.5rem;
          box-shadow: var(--shadow-md);
          min-height: 500px;
        }

        .profile-section-content h3 {
          font-size: 1.75rem;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border-color);
        }

        .category-title {
          font-size: 1rem;
          color: var(--primary-color);
          margin-bottom: 1.25rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .info-item label {
          display: block;
          font-size: 0.8rem;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.5rem;
        }

        .info-item .value {
          font-size: 1.1rem;
          font-weight: 500;
          color: var(--text-primary);
        }

        .stats-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .stat-card.mini {
          border: 1px solid var(--border-color);
          box-shadow: none;
          padding: 1.25rem;
        }

        .stat-card.mini .stat-value {
          font-size: 1.5rem;
        }

        .retirement-goal-card {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          padding: 2rem;
          border-radius: var(--radius-lg);
          border-left: 5px solid var(--secondary-color);
        }

        .progress-bar-bg {
          height: 12px;
          background-color: #e2e8f0;
          border-radius: 6px;
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
          border-radius: 6px;
        }

        .progress-bar-bg-sm {
          height: 8px;
          background-color: #f1f5f9;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-bar-fill-success {
          height: 100%;
          background-color: var(--success-color);
          border-radius: 4px;
        }

        .settings-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .settings-item {
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--border-color);
        }

        .doc-item {
          background-color: #f8fafc;
          border-color: #e2e8f0;
          transition: var(--transition);
        }

        .doc-item:hover {
          border-color: var(--primary-color);
        }

        .upload-zone {
          border: 2px dashed #e2e8f0;
          border-radius: var(--radius-lg);
          background-color: #f8fafc;
          transition: var(--transition);
        }

        .upload-zone:hover {
          border-color: var(--primary-color);
          background-color: #f0f7ff;
        }

        .bg-slate { background-color: #f8fafc; }
        .flex-column { flex-direction: column; }
        .p-8 { padding: 2rem; }
        .rounded-lg { border-radius: var(--radius-lg); }
        .border-dashed { border-style: dashed; }

        .animate-fade-in {
          animation: fadeInContent 0.3s ease-out;
        }

        @keyframes fadeInContent {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .mt-6 { margin-top: 1.5rem; }
        .mt-8 { margin-top: 2rem; }
        .font-bold { font-weight: 700; }
        .small { font-size: 0.85rem; }
        .text-success { color: var(--success-color); }
      `}</style>
    </div>
  );
};

export default ProfilePage;

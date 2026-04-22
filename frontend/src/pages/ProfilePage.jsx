import React, { useState } from 'react';
import { INDUSTRIES, UNIVERSITIES, AFFILIATED_COLLEGES, SENIOR_DESIGNATIONS, MAJOR_COMPANIES, DEGREES, INDIAN_CITIES } from '../utils/constants';

const ProfilePage = ({ user, userRole, profileData, onBack, onUpdateProfile, onDeleteAccount }) => {
  const [activeCategory, setActiveCategory] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isMobileVerified, setIsMobileVerified] = useState(false);
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const [isChangingAvatar, setIsChangingAvatar] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [isAnalyzingFace, setIsAnalyzingFace] = useState(false);
  const [faceVerified, setFaceVerified] = useState(false);
  const videoRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const resumeInputRef = React.useRef(null);
  const avatarInputRef = React.useRef(null);
  const [uploadedResumeFile, setUploadedResumeFile] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const startEditing = () => {
    setTempProfile({
      ...profile,
      industry: Array.isArray(profile.industry) ? profile.industry : (profile.industry ? profile.industry.split(', ') : []),
      gender: profile.gender || '',
      dob: profile.dob || '',
      location: profile.location || '',
      work_cities: Array.isArray(profile.work_cities) ? profile.work_cities : (profile.work_cities ? profile.work_cities.split(', ') : []),
      mobile: profile.mobile || '+91 ',
      qualifications: profile.qualifications || [],
      work_history: profile.work_history || [],
      cover_image: profile.cover_image || null
    });
    setOtpSent(false);
    setOtpCode('');
    setIsMobileVerified(!!profile.mobile && profile.mobile.length > 4);
    setIsEditing(true);
  };

  const generateAiBio = () => {
    if (!tempProfile.years_of_experience || tempProfile.work_history.length === 0) {
      alert("Please fill in your experience and work history first so the AI can read it!");
      return;
    }

    setIsGeneratingBio(true);

    // Simulate "Reading Resume" - using the data filled in the form
    setTimeout(() => {
      const industry = tempProfile.industry.length > 0 ? tempProfile.industry[0] : "professional field";
      const experience = tempProfile.years_of_experience;
      const topRole = tempProfile.work_history[0]?.role || "Expert";
      const topCompany = tempProfile.work_history[0]?.company || "top-tier organizations";
      const degree = tempProfile.qualifications[0]?.degree || "";

      const templates = [
        `Dynamic ${topRole} with ${experience} of extensive expertise in ${industry}. Successfully transitioned from a distinguished career at ${topCompany} to providing strategic advisory services. ${degree ? `A ${degree} holder, I` : 'I'} specialize in driving operational excellence and leading multi-disciplinary teams through complex transformations.`,
        `Seasoned ${industry} professional with over ${experience} years of hands-on experience, most recently as ${topRole} at ${topCompany}. Passionate about leveraging my deep industry knowledge to mentor next-generation talent and help organizations navigate modern challenges. Recognized for strategic foresight and a results-driven approach.`,
        `Accomplished ${topRole} with a proven track record of over ${experience} in the ${industry} sector. Following a successful tenure at ${topCompany}, I now focus on strategic consulting and organizational growth. Committed to excellence, integrity, and sustainable business development.`
      ];

      const randomBio = templates[Math.floor(Math.random() * templates.length)];
      setTempProfile(prev => ({ ...prev, bio: randomBio }));
      setIsGeneratingBio(false);
    }, 2000);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateProfile({ ...profile, avatar: reader.result });
        setIsChangingAvatar(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateProfile({ ...profile, cover_image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      setCameraActive(true);
      setFaceVerified(false);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access denied", err);
      alert("Camera access denied. Please allow camera permissions.");
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
    setCameraActive(false);
  };

  const captureSelfie = () => {
    setIsAnalyzingFace(true);
    // Simulate AI Face Detection (80% visibility check)
    setTimeout(() => {
      if (videoRef.current && canvasRef.current) {
        const context = canvasRef.current.getContext('2d');
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const imageData = canvasRef.current.toDataURL('image/png');

        setFaceVerified(true);
        setIsAnalyzingFace(false);

        setTimeout(() => {
          onUpdateProfile({ ...profile, avatar: imageData });
          stopCamera();
          setIsChangingAvatar(false);
        }, 1500);
      }
    }, 2000);
  };

  const syncProfileWithResume = () => {
    if (!uploadedResumeFile) return;
    setIsSyncing(true);

    setTimeout(() => {
      const extractedData = {
        ...profile,
        name: "Tushar Bhatt",
        industry: ["Logistics", "Supply Chain", "Operations"],
        years_of_experience: "22 Years",
        ex_company: "Logistics Pioneers Inc.",
        ex_designation: "Director of Global Operations",
        bio: "Accomplished Director of Global Operations with over 22 years of expertise in large-scale logistics and supply chain management. Proven track record in optimizing international freight networks and leading diverse teams across three continents. Specialist in Six Sigma methodologies and digital transformation.",
        skills: ["Global Logistics", "Six Sigma Black Belt", "Team Leadership", "Digital Transformation", "Strategic Planning"],
        work_history: [
          { role: "Director of Global Operations", company: "Logistics Pioneers Inc.", duration: "2018 - Present" },
          { role: "Senior Logistics Manager", company: "Metro Freight Hub", duration: "2010 - 2018" }
        ],
        qualifications: [
          { degree: "MBA in Operations", institute: "IIT Delhi", university: "IIT", startYear: "2008", endYear: "2010" },
          { degree: "B.Tech", institute: "Mumbai University", university: "MU", startYear: "2004", endYear: "2008" }
        ]
      };

      onUpdateProfile(extractedData);
      setIsSyncing(false);
      alert("AI Scan Complete! Profile has been updated based on your resume.");
    }, 3000);
  };

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
    mobile: '+91 98765 43210',
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
    { id: 'resume', label: 'Documents & Portfolio', icon: '📎' }
  ] : [
    { id: 'overview', label: 'Overview', icon: '👤' },
    { id: 'professional', label: 'Expertise & Experience', icon: '💼' },
    { id: 'resume', label: 'Resume & Documents', icon: '📄' },
    { id: 'financial', label: 'Earnings & Goals', icon: '💰' }
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
                <div className="value flex items-center gap-2">
                  {user.email}
                  <span className="text-success" style={{ fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <span style={{ fontSize: '1rem' }}>✓</span> Verified
                  </span>
                </div>
              </div>
              {userRole === 'Professional' && (
                <>
                  <div className="info-item">
                    <label>Mobile Number</label>
                    <div className="value flex items-center gap-2">
                      {profile.mobile || '+91 00000 00000'}
                      {(profile.mobile && profile.mobile.length > 5) && (
                        <span className="text-success" style={{ fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
                          <span style={{ fontSize: '1rem' }}>✓</span> Verified
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="info-item">
                    <label>Gender</label>
                    <div className="value">{profile.gender || 'Not Specified'}</div>
                  </div>
                  <div className="info-item">
                    <label>Date of Birth</label>
                    <div className="value">{profile.dob}</div>
                  </div>
                  <div className="info-item">
                    <label>Current Location</label>
                    <div className="value">{profile.location}</div>
                  </div>
                  <div className="info-item">
                    <label>Total Experience</label>
                    <div className="value">{profile.years_of_experience}</div>
                  </div>
                  <div className="info-item full-width mt-2">
                    <label>Industry Focus</label>
                    <div className="flex gap-2 flex-wrap mt-1">
                      {Array.isArray(profile.industry) && profile.industry.length > 0 ? (
                        profile.industry.map(ind => (
                          <span key={ind} className="job-tag" style={{ background: 'var(--primary-color)', color: 'white', border: 'none' }}>{ind}</span>
                        ))
                      ) : (
                        <span className="text-secondary small">Not Specified</span>
                      )}
                    </div>
                  </div>
                  <div className="info-item full-width mt-2">
                    <label>Cities Able to Work</label>
                    <div className="flex gap-2 flex-wrap mt-1">
                      {Array.isArray(profile.work_cities) && profile.work_cities.length > 0 ? (
                        profile.work_cities.map(city => (
                          <span key={city} className="job-tag" style={{ borderColor: 'var(--primary-color)' }}>{city}</span>
                        ))
                      ) : (
                        <span className="text-secondary small">Not Specified</span>
                      )}
                    </div>
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

            {userRole === 'Professional' && (
              <>
                <div className="category-group mt-8">
                  <h4 className="category-title">Professional Experience History</h4>
                  <div className="experience-list">
                    {(profile.work_history || []).map((work, idx) => (
                      <div key={idx} className="experience-item p-4 border rounded-lg bg-slate mb-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-bold text-primary" style={{ fontSize: '1.1rem' }}>{work.role}</div>
                            <div className="text-secondary">{work.company}</div>
                          </div>
                          <span className="badge badge-outline">{work.duration}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="category-group mt-8">
                  <h4 className="category-title">Education & Qualifications</h4>
                  <div className="education-list grid grid-cols-2 gap-4">
                    {(profile.qualifications || []).map((qual, idx) => (
                      <div key={idx} className="qualification-card p-4 border rounded-lg bg-slate">
                        <p className="font-bold text-primary" style={{ marginBottom: '0.25rem' }}>
                          {qual.degree} {qual.startYear && qual.endYear && `(${qual.startYear} - ${qual.endYear})`}
                        </p>
                        <p className="small text-secondary" style={{ marginBottom: '0.1rem' }}>{qual.institute}</p>
                        {qual.university && <p className="tiny-label" style={{ color: 'var(--text-secondary)' }}>{qual.university}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="profile-bio mt-8">
              <label>{userRole === 'Company' ? 'About Our Company' : 'Professional Bio'}</label>
              <p>{profile.bio}</p>
            </div>
          </div>
        );
      case 'professional':
        return (
          <div className="profile-section-content animate-fade-in">
            <div className="category-group mt-8">
              <h4 className="category-title">Professional Experience History</h4>
              <div className="experience-list">
                {(profile.work_history || []).map((work, idx) => (
                  <div key={idx} className="experience-item p-4 border rounded-lg bg-slate mb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold text-primary" style={{ fontSize: '1.1rem' }}>{work.role}</div>
                        <div className="text-secondary">{work.company}</div>
                      </div>
                      <span className="badge badge-outline">{work.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="category-group mt-8">
              <h4 className="category-title">Education & Qualifications</h4>
              <div className="education-list grid grid-cols-2 gap-4">
                {(profile.qualifications || []).map((qual, idx) => (
                  <div key={idx} className="qualification-card p-4 border rounded-lg bg-slate">
                    <p className="font-bold text-primary" style={{ marginBottom: '0.25rem' }}>
                      {qual.degree} {qual.startYear && qual.endYear && `(${qual.startYear} - ${qual.endYear})`}
                    </p>
                    <p className="small text-secondary" style={{ marginBottom: '0.1rem' }}>{qual.institute}</p>
                    {qual.university && <p className="tiny-label" style={{ color: 'var(--text-secondary)' }}>{qual.university}</p>}
                  </div>
                ))}
              </div>
            </div>

            <div className="category-group mt-8">
              <h4 className="category-title">{userRole === 'Company' ? 'Top Skills We Hire' : 'Technical Skills & Expertise'}</h4>
              <div className="flex gap-2 flex-wrap mt-2">
                {profile.skills.map(skill => (
                  <span key={skill} className="job-tag" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>{skill}</span>
                ))}
              </div>
            </div>

            <div className="category-group mt-8">
              <h4 className="category-title">Preferred Work Locations</h4>
              <div className="flex gap-2 flex-wrap mt-2">
                {profile.work_cities && profile.work_cities.length > 0 ? (
                  profile.work_cities.map(city => (
                    <span key={city} className="job-tag" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', borderColor: 'var(--primary)' }}>{city}</span>
                  ))
                ) : (
                  <span className="text-secondary small">No locations specified</span>
                )}
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
                  <input
                    type="file"
                    ref={resumeInputRef}
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setUploadedResumeFile(file);
                        alert('Document uploaded successfully: ' + file.name);
                      }
                    }}
                  />
                  <button className="btn btn-outline" onClick={() => resumeInputRef.current.click()}>Select File</button>
                </div>
              </div>

              <div className="document-list mt-8">
                <h4 className="mb-4">Uploaded Documents</h4>
                <div className="doc-item flex justify-between items-center p-4 border rounded hover:border-primary transition-all">
                  <div className="flex items-center gap-3">
                    <span style={{ fontSize: '1.5rem' }}>📄</span>
                    <div>
                      <div className="font-bold">{uploadedResumeFile ? uploadedResumeFile.name : (userRole === 'Company' ? 'Registration_Certificate.pdf' : 'Main_Resume_2024.pdf')}</div>
                      <div className="small text-secondary">{uploadedResumeFile ? 'Just uploaded' : 'Uploaded on April 12, 2024'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {uploadedResumeFile && (
                      <>
                        <button 
                          className="btn btn-xs btn-outline" 
                          onClick={() => window.open(URL.createObjectURL(uploadedResumeFile), '_blank')}
                        >
                          View
                        </button>
                        <button 
                          className={`btn btn-xs ${isSyncing ? 'btn-disabled' : 'btn-primary'}`} 
                          onClick={syncProfileWithResume}
                          disabled={isSyncing}
                          style={{ position: 'relative', overflow: 'hidden' }}
                        >
                          {isSyncing ? (
                            <span className="flex items-center gap-1">
                              <span className="ai-loader-xs"></span> Scanning...
                            </span>
                          ) : (
                            <span>✨ Sync Profile</span>
                          )}
                        </button>
                      </>
                    )}
                    <span className="badge badge-success">Verified</span>
                  </div>
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
      default:
        return null;
    }
  };

  return (
    <div className="profile-page-container">
      <div className="container">
        {/* Profile Header */}
        <div className="profile-header-card">
          <div
            className="profile-cover-wrapper"
            onClick={() => document.getElementById('cover-upload').click()}
          >
            {profile.cover_image ? (
              <img src={profile.cover_image} className="cover-img" alt="Banner" />
            ) : (
              <div className="profile-cover-default"></div>
            )}
            <div className="cover-edit-overlay">
              <span className="text-2xl">✎</span>
            </div>
            {profile.cover_image && (
              <button
                className="cover-delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateProfile({ ...profile, cover_image: null });
                }}
                title="Remove Banner"
              >
                ✕
              </button>
            )}
            <input
              type="file"
              id="cover-upload"
              hidden
              accept="image/*"
              onChange={handleCoverUpload}
            />
          </div>
          <div className="profile-header-content">
            <div className="profile-avatar-wrapper group">
              <div className="profile-avatar-large">
                {profile.avatar ? <img src={profile.avatar} alt={user.name} /> : initials}
              </div>
              <div
                className="avatar-edit-overlay"
                onClick={() => setIsChangingAvatar(true)}
              >
                <span className="text-xl">✎</span>
              </div>
              <div className="verified-badge-large">✓</div>
            </div>
            <div className="profile-title-area">
              <div className="flex items-center gap-3">
                <h1 style={{ margin: 0, fontSize: '2rem' }}>{profile.name}</h1>
                {!profileData && <span className="expert-badge-v2">Verified Expert</span>}
              </div>
              <p className="profile-subtitle">{profile.ex_designation} | {profile.years_of_experience} Exp</p>
              <div className="flex gap-4 mt-2">
                <span className="profile-meta">📍 {profile.location}</span>
                <span className="profile-meta">📧 {user.email}</span>
              </div>
            </div>
            <div className="profile-actions">
              <button className="btn btn-primary" onClick={startEditing}>Edit Profile</button>
              <button className="btn btn-outline" onClick={onBack}>Back to Home</button>
            </div>
            {profileData && <span className="badge-pulsing">Resume Powered ✨</span>}
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

        {/* Edit Profile Modal */}
        {isEditing && tempProfile && (
          <div className="modal-overlay">
            <div className="edit-modal animate-slide-up" style={{ maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
              <div className="sticky-header">
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-color)', margin: 0 }}>Edit Professional Profile</h2>
                <button className="close-btn" onClick={() => setIsEditing(false)}>✕</button>
              </div>

              <div className="edit-sections-container">
                {/* 1. Basic Information */}
                <div className="edit-section mb-8">
                  <h4 className="section-subtitle">Basic Information</h4>
                  <div className="edit-form-grid">
                    <div className="form-group">
                      <label>Full Name</label>
                      <input type="text" value={tempProfile.name} onChange={e => setTempProfile({ ...tempProfile, name: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>Mobile Number</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={tempProfile.mobile}
                          onChange={e => {
                            let val = e.target.value;
                            if (!val.startsWith('+91 ')) val = '+91 ';
                            const digits = val.slice(4).replace(/\D/g, '');
                            if (digits.length <= 10) {
                              setTempProfile({ ...tempProfile, mobile: '+91 ' + digits });
                              setIsMobileVerified(false); // Reset verification if number changes
                            }
                          }}
                          className={isMobileVerified ? 'border-success' : ''}
                        />
                        {!isMobileVerified && (
                          <button
                            className="btn btn-outline btn-xs"
                            style={{ minWidth: '80px' }}
                            onClick={() => {
                              if (tempProfile.mobile.length === 14) {
                                setOtpSent(true);
                                alert('OTP sent to ' + tempProfile.mobile + ' (Mock: 1234)');
                              } else {
                                alert('Please enter a valid 10-digit number');
                              }
                            }}
                          >
                            {otpSent ? 'Resend' : 'Get OTP'}
                          </button>
                        )}
                      </div>
                      {otpSent && !isMobileVerified && (
                        <div className="flex gap-2 mt-2 animate-fade-in">
                          <input
                            type="text"
                            placeholder="Enter OTP"
                            value={otpCode}
                            onChange={e => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                            style={{ maxWidth: '100px' }}
                          />
                          <button
                            className="btn btn-primary btn-xs"
                            onClick={() => {
                              if (otpCode === '1234') {
                                setIsMobileVerified(true);
                                setOtpSent(false);
                                alert('Mobile verified successfully!');
                              } else {
                                alert('Invalid OTP. Use 1234');
                              }
                            }}
                          >
                            Verify
                          </button>
                        </div>
                      )}
                      {isMobileVerified && <div className="text-success tiny-label mt-1">✓ Verified</div>}
                    </div>
                    <div className="form-group full-width">
                      <label>Industry Focus (Select multiple)</label>
                      <div className="multi-select-container">
                        {tempProfile.industry && tempProfile.industry.length > 0 ? (
                          tempProfile.industry.map(ind => (
                            <span key={ind} className="job-tag flex items-center gap-2" style={{ background: 'var(--primary-color)', color: 'white', border: 'none', padding: '0.4rem 0.8rem' }}>
                              {ind}
                              <button
                                className="text-xs hover:text-white"
                                style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer' }}
                                onClick={() => setTempProfile({
                                  ...tempProfile,
                                  industry: tempProfile.industry.filter(i => i !== ind)
                                })}
                              >✕</button>
                            </span>
                          ))
                        ) : (
                          <span className="text-secondary small" style={{ padding: '0.5rem' }}>No industries selected</span>
                        )}
                      </div>
                      <div style={{ position: 'relative' }}>
                        <select
                          className="form-control"
                          onChange={e => {
                            if (e.target.value && !tempProfile.industry.includes(e.target.value)) {
                              setTempProfile({
                                ...tempProfile,
                                industry: [...tempProfile.industry, e.target.value]
                              });
                            }
                            e.target.value = '';
                          }}
                        >
                          <option value="">+ Add Industry</option>
                          {INDUSTRIES.map(i => (
                            <option key={i} value={i} disabled={tempProfile.industry.includes(i)}>
                              {i}
                            </option>
                          ))}
                        </select>
                        <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--primary-color)' }}>▼</span>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Gender</label>
                      <div style={{ position: 'relative' }}>
                        <select className="form-control" value={tempProfile.gender} onChange={e => setTempProfile({ ...tempProfile, gender: e.target.value })}>
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                          <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                        <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--primary-color)' }}>▼</span>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Date of Birth</label>
                      <input type="date" className="form-control" value={tempProfile.dob} onChange={e => setTempProfile({ ...tempProfile, dob: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>Current Location</label>
                      <input type="text" list="city-list" className="form-control" value={tempProfile.location} onChange={e => setTempProfile({ ...tempProfile, location: e.target.value })} />
                      <datalist id="city-list">
                        {INDIAN_CITIES.map(c => <option key={c} value={c} />)}
                      </datalist>
                    </div>
                    <div className="form-group">
                      <label>Total Experience</label>
                      <input type="text" value={tempProfile.years_of_experience} onChange={e => setTempProfile({ ...tempProfile, years_of_experience: e.target.value })} />
                    </div>

                    <div className="form-group full-width">
                      <label>Cities Able to Work (Select multiple)</label>
                      <div className="multi-select-container">
                        {tempProfile.work_cities && tempProfile.work_cities.length > 0 ? (
                          tempProfile.work_cities.map(city => (
                            <span key={city} className="job-tag flex items-center gap-2" style={{ background: 'var(--primary-color)', color: 'white', border: 'none', padding: '0.4rem 0.8rem' }}>
                              {city}
                              <button
                                className="text-xs hover:text-white"
                                style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer' }}
                                onClick={() => setTempProfile({
                                  ...tempProfile,
                                  work_cities: tempProfile.work_cities.filter(c => c !== city)
                                })}
                              >✕</button>
                            </span>
                          ))
                        ) : (
                          <span className="text-secondary small" style={{ padding: '0.5rem' }}>No cities selected</span>
                        )}
                      </div>
                      <div style={{ position: 'relative' }}>
                        <select
                          className="form-control"
                          onChange={e => {
                            if (e.target.value && !tempProfile.work_cities.includes(e.target.value)) {
                              setTempProfile({
                                ...tempProfile,
                                work_cities: [...tempProfile.work_cities, e.target.value]
                              });
                            }
                            e.target.value = '';
                          }}
                        >
                          <option value="">+ Add City</option>
                          {INDIAN_CITIES.map(c => (
                            <option key={c} value={c} disabled={tempProfile.work_cities.includes(c)}>
                              {c}
                            </option>
                          ))}
                        </select>
                        <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--primary-color)' }}>▼</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Education & Qualifications */}
                <div className="edit-section mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="section-subtitle">Education & Qualifications</h4>
                    <button className="btn btn-sm btn-outline" onClick={() => setTempProfile({
                      ...tempProfile,
                      qualifications: [
                        ...tempProfile.qualifications,
                        { degree: '', university: '', institute: '', startYear: '', endYear: '', custom_degree: '', custom_university: '', custom_institute: '' }
                      ]
                    })}>+ Add Education</button>
                  </div>
                  {tempProfile.qualifications.map((q, idx) => (
                    <div key={idx} className="list-edit-item bg-slate rounded-lg mb-4 p-4">
                      {/* Education Details Row */}
                      <div className="grid grid-cols-3 gap-3 items-end mb-3">
                        <div className="form-group">
                          <label className="tiny-label">1. Degree</label>
                          <input type="text" list="degree-list" value={q.degree} onChange={e => {
                            const newQuals = [...tempProfile.qualifications];
                            newQuals[idx].degree = e.target.value;
                            if (e.target.value !== 'Not Listed / Other') newQuals[idx].custom_degree = '';
                            setTempProfile({ ...tempProfile, qualifications: newQuals });
                          }} placeholder="e.g. B.Tech" />
                        </div>
                        <div className="form-group">
                          <label className="tiny-label">2. University</label>
                          <input type="text" list="university-list" value={q.university || ''} onChange={e => {
                            const newQuals = [...tempProfile.qualifications];
                            newQuals[idx].university = e.target.value;
                            if (e.target.value !== 'Not Listed / Other') newQuals[idx].custom_university = '';
                            newQuals[idx].institute = '';
                            setTempProfile({ ...tempProfile, qualifications: newQuals });
                          }} />
                        </div>
                        <div className="form-group">
                          <div className="flex justify-between items-center">
                            <label className="tiny-label">3. College</label>
                            <button className="btn btn-danger-outline btn-xs" style={{ background: 'none', border: 'none', padding: 0 }} onClick={() => {
                              setTempProfile({ ...tempProfile, qualifications: tempProfile.qualifications.filter((_, i) => i !== idx) });
                            }}>✕</button>
                          </div>
                          <input type="text" list={`college-list-modal-${idx}`} value={q.institute} onChange={e => {
                            const newQuals = [...tempProfile.qualifications];
                            newQuals[idx].institute = e.target.value;
                            if (e.target.value !== 'Not Listed / Other') newQuals[idx].custom_institute = '';
                            setTempProfile({ ...tempProfile, qualifications: newQuals });
                          }} />
                          <datalist id={`college-list-modal-${idx}`}>
                            {(AFFILIATED_COLLEGES[q.university] || []).map(c => <option key={c} value={c} />)}
                          </datalist>
                        </div>
                      </div>

                      {/* Years Row */}
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="form-group">
                          <label className="tiny-label">Start Year</label>
                          <input type="text" placeholder="YYYY" value={q.startYear || ''} onChange={e => {
                            const newQuals = [...tempProfile.qualifications];
                            newQuals[idx].startYear = e.target.value.replace(/\D/g, '').slice(0, 4);
                            setTempProfile({ ...tempProfile, qualifications: newQuals });
                          }} />
                        </div>
                        <div className="form-group">
                          <label className="tiny-label">Completion Year</label>
                          <input type="text" placeholder="YYYY" value={q.endYear || ''} onChange={e => {
                            const newQuals = [...tempProfile.qualifications];
                            newQuals[idx].endYear = e.target.value.replace(/\D/g, '').slice(0, 4);
                            setTempProfile({ ...tempProfile, qualifications: newQuals });
                          }} />
                        </div>
                      </div>

                      {/* Custom Fields for "Other" selections */}
                      {(q.degree === 'Not Listed / Other' || q.university === 'Not Listed / Other' || q.institute === 'Not Listed / Other') && (
                        <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-dashed">
                          {q.degree === 'Not Listed / Other' && (
                            <input type="text" className="text-xs" value={q.custom_degree || ''} placeholder="Degree Name" onChange={e => {
                              const newQuals = [...tempProfile.qualifications];
                              newQuals[idx].custom_degree = e.target.value;
                              setTempProfile({ ...tempProfile, qualifications: newQuals });
                            }} />
                          )}
                          {q.university === 'Not Listed / Other' && (
                            <input type="text" className="text-xs" value={q.custom_university || ''} placeholder="University Name" onChange={e => {
                              const newQuals = [...tempProfile.qualifications];
                              newQuals[idx].custom_university = e.target.value;
                              setTempProfile({ ...tempProfile, qualifications: newQuals });
                            }} />
                          )}
                          {q.institute === 'Not Listed / Other' && (
                            <input type="text" className="text-xs" value={q.custom_institute || ''} placeholder="College Name" onChange={e => {
                              const newQuals = [...tempProfile.qualifications];
                              newQuals[idx].custom_institute = e.target.value;
                              setTempProfile({ ...tempProfile, qualifications: newQuals });
                            }} />
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* 3. Work Experience History */}
                <div className="edit-section mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="section-subtitle">Work Experience History</h4>
                    <button className="btn btn-sm btn-outline" onClick={() => setTempProfile({
                      ...tempProfile,
                      work_history: [
                        ...tempProfile.work_history,
                        { role: '', company: '', duration: '', custom_role: '', custom_company: '' }
                      ]
                    })}>+ Add Experience</button>
                  </div>
                  {tempProfile.work_history.map((w, idx) => (
                    <div key={idx} className="list-edit-item p-4 bg-slate rounded-lg mb-4">
                      <div className="flex gap-4 mb-3">
                        <div className="form-group flex-1">
                          <label className="tiny-label">Role / Designation</label>
                          <input type="text" list="designation-list" value={w.role} onChange={e => {
                            const newWork = [...tempProfile.work_history];
                            newWork[idx].role = e.target.value;
                            if (e.target.value !== 'Not Listed / Other') newWork[idx].custom_role = '';
                            setTempProfile({ ...tempProfile, work_history: newWork });
                          }} />
                        </div>
                        <div className="form-group flex-1">
                          <label className="tiny-label">Company</label>
                          <input type="text" list="company-list" value={w.company} onChange={e => {
                            const newWork = [...tempProfile.work_history];
                            newWork[idx].company = e.target.value;
                            if (e.target.value !== 'Not Listed / Other') newWork[idx].custom_company = '';
                            setTempProfile({ ...tempProfile, work_history: newWork });
                          }} />
                        </div>
                      </div>

                      {/* Manual Option for Company and Designation */}
                      {(w.company === 'Not Listed / Other' || w.role === 'Not Listed / Other') && (
                        <div className="grid grid-cols-2 gap-3 mb-3 p-2 bg-white rounded border border-dashed border-primary">
                          {w.company === 'Not Listed / Other' && (
                            <input type="text" className="text-xs" value={w.custom_company || ''} placeholder="Actual Company Name" onChange={e => {
                              const newWork = [...tempProfile.work_history];
                              newWork[idx].custom_company = e.target.value;
                              setTempProfile({ ...tempProfile, work_history: newWork });
                            }} />
                          )}
                          {w.role === 'Not Listed / Other' && (
                            <input type="text" className="text-xs" value={w.custom_role || ''} placeholder="Actual Designation Name" onChange={e => {
                              const newWork = [...tempProfile.work_history];
                              newWork[idx].custom_role = e.target.value;
                              setTempProfile({ ...tempProfile, work_history: newWork });
                            }} />
                          )}
                        </div>
                      )}

                      <div className="flex justify-between items-end">
                        <div className="form-group flex-1">
                          <label className="tiny-label">Duration (Years)</label>
                          <input type="text" value={w.duration} onChange={e => {
                            const newWork = [...tempProfile.work_history];
                            newWork[idx].duration = e.target.value;
                            setTempProfile({ ...tempProfile, work_history: newWork });
                          }} placeholder="2015 - 2024" />
                        </div>
                        <button className="btn btn-danger-outline btn-sm ms-4 mb-1" onClick={() => {
                          setTempProfile({ ...tempProfile, work_history: tempProfile.work_history.filter((_, i) => i !== idx) });
                        }}>Remove Experience</button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 4. Professional Bio */}
                <div className="edit-section mb-8">
                  <h4 className="section-subtitle">Professional Bio</h4>
                  <div className="flex justify-between items-center mb-1">
                    <label className="mb-0 small">Add a brief summary of your career...</label>
                    <button
                      className={`btn btn-xs ${isGeneratingBio ? 'btn-disabled' : 'btn-outline'}`}
                      style={{ borderColor: 'var(--secondary-color)', color: 'var(--secondary-color)', display: 'flex', gap: '4px', alignItems: 'center' }}
                      onClick={generateAiBio}
                      disabled={isGeneratingBio}
                    >
                      {isGeneratingBio ? (
                        <>
                          <span className="ai-loader"></span> Generating...
                        </>
                      ) : (
                        <>✨ Generate AI Bio</>
                      )}
                    </button>
                  </div>
                  <textarea
                    rows="6"
                    value={tempProfile.bio}
                    onChange={e => setTempProfile({ ...tempProfile, bio: e.target.value })}
                    placeholder="Tell us about your professional journey..."
                    className={`form-control ${isGeneratingBio ? 'ai-glow' : ''}`}
                    style={{ background: '#f8fafc' }}
                  ></textarea>
                  <p className="tiny-label mt-1" style={{ color: '#94a3b8', fontStyle: 'italic' }}>AI will read your experience and qualifications to write this.</p>
                </div>
              </div>

              <div className="sticky-footer">
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    const finalQuals = tempProfile.qualifications.map(q => ({
                      degree: q.degree === 'Not Listed / Other' ? q.custom_degree : q.degree,
                      university: q.university === 'Not Listed / Other' ? q.custom_university : q.university,
                      institute: q.institute === 'Not Listed / Other' ? q.custom_institute : q.institute,
                      startYear: q.startYear,
                      endYear: q.endYear
                    }));

                    const finalWork = tempProfile.work_history.map(w => ({
                      ...w,
                      role: w.role === 'Not Listed / Other' ? w.custom_role : w.role,
                      company: w.company === 'Not Listed / Other' ? w.custom_company : w.company
                    }));

                    onUpdateProfile({ ...tempProfile, qualifications: finalQuals, work_history: finalWork });
                    setIsEditing(false);
                  }}
                >
                  Save Profile
                </button>
                <button
                  className="btn btn-outline"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Avatar Upload Modal */}
        {isChangingAvatar && (
          <div className="modal-overlay">
            <div className="edit-modal animate-slide-up" style={{ maxWidth: '450px' }}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="section-subtitle mb-0">Update Profile Photo</h3>
                <button className="close-btn" onClick={() => { setIsChangingAvatar(false); stopCamera(); }}>✕</button>
              </div>

              {!cameraActive ? (
                <>
                  <div className="avatar-options-grid">
                    <div className="avatar-option-card" onClick={() => avatarInputRef.current.click()}>
                      <div className="option-icon">📁</div>
                      <div className="option-label">Upload from Device</div>
                      <input
                        type="file"
                        hidden
                        ref={avatarInputRef}
                        accept="image/*"
                        onChange={handleFileUpload}
                      />
                    </div>
                    <div className="avatar-option-card" onClick={startCamera}>
                      <div className="option-icon">📸</div>
                      <div className="option-label">Take a Selfie</div>
                    </div>
                  </div>
                  {profile.avatar && (
                    <button
                      className="btn btn-outline w-full mt-6"
                      style={{ color: 'var(--error-color)', borderColor: '#fee2e2', background: '#fef2f2' }}
                      onClick={() => {
                        onUpdateProfile({ ...profile, avatar: null });
                        setIsChangingAvatar(false);
                      }}
                    >
                      Delete Current Photo
                    </button>
                  )}
                </>
              ) : (
                <div className="camera-view-container">
                  <div className={`camera-wrapper ${isAnalyzingFace ? 'analyzing' : ''}`}>
                    <video ref={videoRef} autoPlay playsInline className="video-feed" />
                    <div className="face-guide-overlay">
                      <div className="face-oval"></div>
                    </div>
                    {isAnalyzingFace && (
                      <div className="analysis-overlay">
                        <div className="scanner-line"></div>
                        <p className="text-white font-bold" style={{ textAlign: 'center', padding: '0 20px' }}>Verifying Face Alignment (80%+ visibility required)...</p>
                      </div>
                    )}
                    {faceVerified && (
                      <div className="success-overlay animate-fade-in">
                        <div className="check-icon">✓</div>
                        <p className="text-white font-bold">Face Verified!</p>
                      </div>
                    )}
                  </div>
                  <canvas ref={canvasRef} style={{ display: 'none' }} />
                  {!isAnalyzingFace && !faceVerified && (
                    <div className="camera-controls mt-4" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <button className="btn btn-primary w-full" style={{ height: '45px' }} onClick={captureSelfie}>Capture Photo</button>
                      <button className="btn btn-outline w-full" style={{ height: '45px' }} onClick={stopCamera}>Cancel</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx="true">{`
        .profile-page-container {
          padding-bottom: 5rem;
          background-color: var(--bg-color);
        }

        .profile-header-card {
          background-color: var(--surface-color);
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-lg);
          margin-top: -2rem;
          position: relative;
          z-index: 5;
        }

        .profile-cover-wrapper {
          width: 100%;
          aspect-ratio: 4 / 1;
          position: relative;
          cursor: pointer;
          overflow: hidden;
          background-color: var(--border-color);
          z-index: 1;
        }

        .profile-cover-default {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
          opacity: 0.9;
        }

        .cover-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .cover-edit-overlay {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          background: rgba(0,0,0,0.4);
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: all 0.3s ease;
          backdrop-filter: blur(4px);
          z-index: 10;
        }

        .profile-cover-wrapper:hover .cover-edit-overlay {
          opacity: 1;
        }

        .cover-delete-btn {
          position: absolute;
          top: 1.5rem;
          right: 4.5rem;
          background: rgba(239, 68, 68, 0.8);
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          opacity: 0;
          transition: all 0.3s ease;
          z-index: 10;
        }

        .profile-cover-wrapper:hover .cover-delete-btn {
          opacity: 1;
        }

        .profile-header-content {
          padding: 0 3rem 2rem 3rem;
          display: flex;
          align-items: flex-end;
          gap: 2rem;
          margin-top: -5rem;
          position: relative;
          z-index: 5;
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
          padding: 1rem 1.5rem;
          background: var(--glass-bg);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-radius: 16px;
          margin-left: -0.5rem;
          margin-bottom: 0.5rem;
          box-shadow: 0 8px 32px var(--glass-shadow);
          border: 1px solid var(--glass-border);
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .profile-title-area h1 {
          color: var(--text-primary);
          font-weight: 800;
          letter-spacing: -0.02em;
          text-shadow: 0 0 20px rgba(255,255,255,0.5);
        }

        .expert-badge-v2 {
          background-color: var(--primary-color);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: bold;
          text-transform: uppercase;
        }

        .badge-pulsing {
          position: absolute;
          top: 1.5rem;
          right: 2rem;
          background-color: var(--bg-hover-color);
          color: var(--text-secondary);
          border: 1px solid #bbf7d0;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: bold;
          text-transform: uppercase;
          animation: pulse-green 2s infinite;
          z-index: 10;
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
          background-color: var(--surface-color);
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
          background-color: var(--bg-hover-color);
          color: var(--primary-color);
        }

        .profile-menu-item.active {
          background-color: var(--bg-active-color);
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
          background-color: var(--surface-color);
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
          background: var(--bg-card-alt);
          padding: 2rem;
          border-radius: var(--radius-lg);
          border-left: 5px solid var(--secondary-color);
        }

        .progress-bar-bg {
          height: 12px;
          background-color: var(--border-color);
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
          background-color: var(--border-color);
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
          background-color: var(--bg-alt-color);
          border-color: var(--border-color);
          transition: var(--transition);
        }

        .doc-item:hover {
          border-color: var(--primary-color);
        }

        .upload-zone {
          border: 2px dashed var(--border-color);
          border-radius: var(--radius-lg);
          background-color: var(--bg-alt-color);
          transition: var(--transition);
        }

        .upload-zone:hover {
          border-color: var(--primary-color);
          background-color: var(--bg-active-color);
        }

        .bg-slate { background-color: var(--bg-alt-color); }
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

        /* Mobile Responsive Adjustments */
        @media (max-width: 768px) {
          .profile-main-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          
          .profile-cover-wrapper {
            aspect-ratio: 2 / 1;
          }
          
          .profile-header-content {
            flex-direction: column;
            align-items: center;
            text-align: center;
            padding: 0 1.5rem 2.5rem 1.5rem;
            margin-top: -3.5rem;
            gap: 1.25rem;
          }
          
          .profile-avatar-large {
            width: 100px;
            height: 100px;
            border-width: 4px;
          }
          
          .profile-title-area {
            margin-left: 0;
            width: 100%;
            padding: 1.25rem;
          }
          
          .profile-actions {
            justify-content: center;
            width: 100%;
            flex-wrap: wrap;
          }
          
          .stats-row {
            grid-template-columns: 1fr;
          }
          
          .info-grid {
            grid-template-columns: 1fr;
          }
          
          .badge-pulsing {
            top: 0.5rem;
            right: 0.5rem;
            left: auto;
            transform: scale(0.85);
          }
          
          .profile-content-card {
            padding: 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .profile-actions .btn {
            width: 100%;
          }
          
          .profile-header-card {
            margin-top: 0;
          }
          
          .profile-section-content h3 {
            font-size: 1.25rem;
          }
          
          .retirement-goal-card {
            padding: 1rem;
          }
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(4px);
        }
        .edit-modal {
          background: var(--surface-color);
          width: 90%;
          max-width: 600px;
          border-radius: 20px;
          padding: 2.5rem;
          box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
        }
        .edit-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }
        .full-width { grid-column: span 2; }
        .disabled-input { background: var(--bg-alt-color); color: var(--text-secondary); cursor: not-allowed; }
        .close-btn { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-secondary); }
        .close-btn:hover { color: var(--text-primary); }

        .section-subtitle {
          font-size: 0.9rem;
          color: var(--primary-color);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 700;
          margin-bottom: 1.25rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .form-group label {
          display: block;
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--primary-color);
          margin-bottom: 0.5rem;
        }

        .section-subtitle::before {
          content: '';
          display: block;
          width: 4px;
          height: 16px;
          background: var(--primary-color);
          border-radius: 2px;
        }

        .tiny-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--primary-color);
          text-transform: uppercase;
          margin-bottom: 0.35rem;
          display: block;
          opacity: 0.8;
        }

        .edit-modal input, .edit-modal textarea, .edit-modal select, .form-control {
          width: 100%;
          padding: 0.85rem 1rem;
          border: 1px solid var(--border-color);
          border-radius: 12px;
          font-family: inherit;
          font-size: 1rem;
          background-color: var(--bg-alt-color);
          transition: all 0.2s ease;
          appearance: none;
        }

        .edit-modal input:focus, .edit-modal textarea:focus, .edit-modal select:focus {
          outline: none;
          border-color: var(--primary-color);
          background-color: var(--surface-color);
          box-shadow: 0 0 0 4px rgba(13, 71, 161, 0.08);
        }

        .multi-select-container {
          width: 100%;
          min-height: 54px;
          padding: 0.6rem;
          border: 1px solid var(--border-color);
          border-radius: 12px;
          background-color: var(--surface-color);
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .sticky-header {
          position: sticky;
          top: -2.5rem;
          background: var(--surface-color);
          padding: 1.5rem 2.5rem;
          margin: -2.5rem -2.5rem 2rem -2.5rem;
          border-bottom: 1px solid var(--border-color);
          z-index: 100;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top-left-radius: 20px;
          border-top-right-radius: 20px;
        }

        .sticky-footer {
          position: sticky;
          bottom: -2.5rem;
          background: var(--surface-color);
          padding: 1.5rem 2.5rem;
          margin: 3rem -2.5rem -2.5rem -2.5rem;
          border-top: 1px solid var(--border-color);
          z-index: 100;
          display: flex;
          gap: 1.25rem;
          border-bottom-left-radius: 20px;
          border-bottom-right-radius: 20px;
          box-shadow: 0 -10px 20px rgba(0,0,0,0.02);
        }

        .sticky-footer button {
          flex: 1;
          height: 54px;
          border-radius: 14px;
          font-size: 1rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .btn-disabled { opacity: 0.6; cursor: not-allowed; }
        
        .ai-loader {
          width: 12px;
          height: 12px;
          border: 2px solid rgba(0,0,0,0.1);
          border-top-color: var(--secondary-color);
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        .ai-glow {
          box-shadow: 0 0 15px rgba(245, 124, 0, 0.2);
          border-color: var(--secondary-color) !important;
          background-color: #fff9f0;
          transition: all 0.3s ease;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
        .profile-avatar-wrapper {
          position: relative;
          cursor: pointer;
        }
        .avatar-edit-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.4);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 5;
        }
        .profile-avatar-wrapper:hover .avatar-edit-overlay {
          opacity: 1;
        }
        
        .avatar-options-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          padding: 1rem 0;
        }
        .avatar-option-card {
          border: 2px solid #e2e8f0;
          border-radius: var(--radius-lg);
          padding: 2rem 1rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .avatar-option-card:hover {
          border-color: var(--primary-color);
          background: var(--bg-hover-color);
          transform: translateY(-4px);
        }
        .option-icon { font-size: 2.5rem; margin-bottom: 0.5rem; }
        .option-label { font-weight: 700; font-size: 0.9rem; color: #1e293b; }

        .camera-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 1;
          background: #000;
          border-radius: 20px;
          overflow: hidden;
          border: 4px solid #e2e8f0;
        }
        .camera-wrapper.analyzing { border-color: var(--secondary-color); }
        .video-feed { width: 100%; height: 100%; object-fit: cover; }
        
        .face-guide-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }
        .face-oval {
          width: 70%;
          height: 80%;
          border: 2px dashed rgba(255,255,255,0.6);
          border-radius: 50%;
        }

        .analysis-overlay, .success-overlay {
          position: absolute;
          inset: 0;
          .parsing-loader {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          @media (max-width: 768px) {
            .onboarding-container {
              padding: 1rem;
            }
            .onboarding-card {
              padding: 1.5rem;
              border-radius: 16px;
            }
            .onboarding-options {
              grid-template-columns: 1fr;
              gap: 1rem;
              margin-top: 2rem;
            }
            .option-card {
              padding: 1.5rem;
            }
            .sticky-header {
              flex-direction: column;
              text-align: center;
              padding: 1rem;
            }
          }
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 10;
        }
        .success-overlay { background: rgba(34, 197, 94, 0.7); }
        .check-icon { font-size: 4rem; color: white; margin-bottom: 1rem; }

        .scanner-line {
          width: 100%;
          height: 4px;
          background: var(--secondary-color);
          box-shadow: 0 0 15px var(--secondary-color);
          position: absolute;
          top: 0;
          animation: scan 2s linear infinite;
        }
        @keyframes scan {
          0% { top: 10%; }
          50% { top: 90%; }
          100% { top: 10%; }
        }

        .ai-loader-xs {
          width: 10px;
          height: 10px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;

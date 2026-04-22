import { useState, useRef, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './index.css';
import ChatBot from './chatbot/ChatBot';
import AuthPage from './AuthPage';
import AuthSuccess from './pages/AuthSuccess';
import ProfilePage from './pages/ProfilePage';
import { INDUSTRIES, UNIVERSITIES, AFFILIATED_COLLEGES, SENIOR_DESIGNATIONS, MAJOR_COMPANIES, DEGREES } from './utils/constants';

// ─── Onboarding Component ──────────────────────────────────────────────────
function OnboardingScreen({ user, onComplete, onSkip }) {
  const [isParsing, setIsParsing] = useState(false);
  const [parsingProgress, setParsingProgress] = useState(0);
  const [isReviewing, setIsReviewing] = useState(false);
  const [isManual, setIsManual] = useState(false);
  const [editData, setEditData] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isMobileVerified, setIsMobileVerified] = useState(false);
  const fileInputRef = useRef(null);

  const handleResumeClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      startParsing();
    }
  };

  const startParsing = () => {
    setIsParsing(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setParsingProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsParsing(false);
          setIsReviewing(true);
          setEditData({
            name: user.name || 'Your Name',
            gender: 'Male',
            dob: '1969-01-01',
            mobile: '+91 98765 43210',
            industry: 'Supply Chain & Logistics',
            years_of_experience: '28+ Years',
            expertise: 'Global Logistics, SAP S/4HANA, Lean Six Sigma',
            skills: 'Operations, Strategic Planning, Crisis Management',
            bio: 'A visionary supply chain leader with over 3 decades of experience in navigating complex global logistics networks for Fortune 500 companies.',
            location: 'Mumbai, India',
            qualifications: [
              { degree: 'MBA / PGDM', university: 'Indian Institute of Management (IIM)', institute: 'IIM Bangalore', custom_degree: '', custom_university: '', custom_institute: '' },
              { degree: 'B.Tech / B.E.', university: 'Indian Institute of Technology (IIT)', institute: 'IIT Delhi', custom_degree: '', custom_university: '', custom_institute: '' }
            ],
            work_history: [
              { company: 'Google (Alphabet)', role: 'Senior Vice President (SVP)', duration: '2010 - 2024', custom_company: '', custom_role: '' },
              { company: 'Microsoft', role: 'Director of Operations', duration: '2000 - 2010', custom_company: '', custom_role: '' }
            ]
          });
        }, 800);
      }
    }, 150);
  };

  const startManual = () => {
    setEditData({
      name: user.name || '',
      gender: 'Male',
      dob: '',
      mobile: '+91 ',
      industry: '',
      years_of_experience: '',
      expertise: '',
      skills: '',
      bio: '',
      location: '',
      qualifications: [{ degree: '', university: '', institute: '', custom_degree: '', custom_university: '', custom_institute: '' }],
      work_history: [{ company: '', role: '', duration: '', custom_company: '', custom_role: '' }]
    });
    setIsMobileVerified(false);
    setOtpSent(false);
    setOtpCode('');
    setIsManual(true);
    setIsReviewing(true);
  };

  if (isReviewing) {
    return (
      <div className="onboarding-container animate-fade-in">
        <div className="onboarding-card" style={{ textAlign: 'left', maxWidth: '700px' }}>
          <div className="flex justify-between items-center mb-4">
            <h2 style={{ margin: 0 }}>{isManual ? 'Create Your Profile' : 'Confirm Your Details'}</h2>
            {!isManual && <span className="badge badge-success">Extraction Complete ⚡</span>}
          </div>
          <p className="text-secondary mb-8">
            {isManual
              ? 'Please fill in your professional details to set up your expert profile.'
              : "We've pre-filled your profile using your resume. **Does this look correct?**"}
          </p>

          <div className="review-grid">
            <div className="form-group">
              <label className="small font-bold text-primary">Full Name</label>
              <input type="text" className="form-control" value={editData.name} onChange={e => setEditData({ ...editData, name: e.target.value })} placeholder="e.g. John Doe" />
            </div>

            <div className="flex gap-4">
              <div className="form-group flex-1">
                <label className="small font-bold text-primary">Gender</label>
                <select className="form-control" value={editData.gender} onChange={e => setEditData({ ...editData, gender: e.target.value })}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
              <div className="form-group flex-1">
                <label className="small font-bold text-primary">Mobile No.</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className={`form-control ${isMobileVerified ? 'border-success' : ''}`}
                    value={editData.mobile}
                    onChange={e => {
                      let val = e.target.value;
                      if (!val.startsWith('+91 ')) val = '+91 ';
                      const digits = val.slice(4).replace(/\D/g, '');
                      if (digits.length <= 10) {
                        setEditData({ ...editData, mobile: '+91 ' + digits });
                        setIsMobileVerified(false);
                      }
                    }}
                  />
                  {!isMobileVerified && (
                    <button
                      className="btn btn-outline btn-xs"
                      style={{ minWidth: '80px' }}
                      onClick={() => {
                        if (editData.mobile.length === 14) {
                          setOtpSent(true);
                          alert('OTP sent to ' + editData.mobile + ' (Mock: 1234)');
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
                      className="form-control"
                      style={{ maxWidth: '100px' }}
                      value={otpCode}
                      onChange={e => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
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
            </div>

            <div className="flex gap-4">
              <div className="form-group flex-1">
                <label className="small font-bold text-primary">Date of Birth</label>
                <input type="date" className="form-control" value={editData.dob} onChange={e => setEditData({ ...editData, dob: e.target.value })} />
              </div>
              <div className="form-group flex-1">
                <label className="small font-bold text-primary">Years of Experience</label>
                <input type="text" className="form-control" value={editData.years_of_experience} onChange={e => setEditData({ ...editData, years_of_experience: e.target.value })} />
              </div>
            </div>

            <div className="section-divider mt-8 mb-4">Education & Qualifications</div>
            {editData.qualifications.map((q, idx) => (
              <div key={idx} className="qualification-row mb-6 bg-slate p-4 rounded-lg">
                {/* Education Details Row */}
                <div className="grid grid-cols-3 gap-4 mb-3 items-end">
                  <div className="form-group">
                    <label className="tiny-label font-bold">1. Degree</label>
                    <input type="text" className="form-control" list="degree-list" value={q.degree} onChange={e => {
                      const newQuals = [...editData.qualifications];
                      newQuals[idx].degree = e.target.value;
                      if (e.target.value !== 'Not Listed / Other') newQuals[idx].custom_degree = '';
                      setEditData({ ...editData, qualifications: newQuals });
                    }} placeholder="e.g. B.Tech" />
                  </div>
                  <div className="form-group">
                    <label className="tiny-label font-bold">2. University / Board</label>
                    <input type="text" className="form-control" list="university-list" value={q.university || ''} onChange={e => {
                      const newQuals = [...editData.qualifications];
                      newQuals[idx].university = e.target.value;
                      if (e.target.value !== 'Not Listed / Other') newQuals[idx].custom_university = '';
                      // Reset institute if university changes
                      newQuals[idx].institute = '';
                      setEditData({ ...editData, qualifications: newQuals });
                    }} placeholder="e.g. AKTU / IPU" />
                  </div>
                  <div className="form-group">
                    <div className="flex justify-between items-center">
                      <label className="tiny-label font-bold">3. Affiliated College</label>
                      {editData.qualifications.length > 1 && (
                        <button className="btn btn-danger-outline btn-xs" style={{ padding: '2px 6px', fontSize: '0.6rem' }} onClick={() => {
                          setEditData({ ...editData, qualifications: editData.qualifications.filter((_, i) => i !== idx) });
                        }}>✕</button>
                      )}
                    </div>
                    <input type="text" className="form-control" list={`college-list-${idx}`} value={q.institute} onChange={e => {
                      const newQuals = [...editData.qualifications];
                      newQuals[idx].institute = e.target.value;
                      if (e.target.value !== 'Not Listed / Other') newQuals[idx].custom_institute = '';
                      setEditData({ ...editData, qualifications: newQuals });
                    }} placeholder="Select college..." />
                    <datalist id={`college-list-${idx}`}>
                      {(AFFILIATED_COLLEGES[q.university] || []).map(c => <option key={c} value={c} />)}
                    </datalist>
                  </div>
                </div>

                {/* Years Row */}
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="form-group">
                    <label className="tiny-label font-bold">Start Year</label>
                    <input type="text" className="form-control" placeholder="YYYY" value={q.startYear || ''} onChange={e => {
                      const newQuals = [...editData.qualifications];
                      newQuals[idx].startYear = e.target.value.replace(/\D/g, '').slice(0, 4);
                      setEditData({ ...editData, qualifications: newQuals });
                    }} />
                  </div>
                  <div className="form-group">
                    <label className="tiny-label font-bold">Completion Year</label>
                    <input type="text" className="form-control" placeholder="YYYY" value={q.endYear || ''} onChange={e => {
                      const newQuals = [...editData.qualifications];
                      newQuals[idx].endYear = e.target.value.replace(/\D/g, '').slice(0, 4);
                      setEditData({ ...editData, qualifications: newQuals });
                    }} />
                  </div>
                </div>

                {/* Conditional Custom Inputs for All 3 */}
                {(q.degree === 'Not Listed / Other' || q.university === 'Not Listed / Other' || q.institute === 'Not Listed / Other') && (
                  <div className="bg-white p-3 rounded border border-dashed border-primary mt-2">
                    <p className="tiny-label text-primary font-bold mb-2">Custom Education Details</p>
                    <div className="grid grid-cols-3 gap-3">
                      {q.degree === 'Not Listed / Other' && (
                        <input type="text" className="form-control text-xs" value={q.custom_degree || ''} onChange={e => {
                          const newQuals = [...editData.qualifications];
                          newQuals[idx].custom_degree = e.target.value;
                          setEditData({ ...editData, qualifications: newQuals });
                        }} placeholder="Actual Degree Name" />
                      )}
                      {q.university === 'Not Listed / Other' && (
                        <input type="text" className="form-control text-xs" value={q.custom_university || ''} onChange={e => {
                          const newQuals = [...editData.qualifications];
                          newQuals[idx].custom_university = e.target.value;
                          setEditData({ ...editData, qualifications: newQuals });
                        }} placeholder="Actual University Name" />
                      )}
                      {q.institute === 'Not Listed / Other' && (
                        <input type="text" className="form-control text-xs" value={q.custom_institute || ''} onChange={e => {
                          const newQuals = [...editData.qualifications];
                          newQuals[idx].custom_institute = e.target.value;
                          setEditData({ ...editData, qualifications: newQuals });
                        }} placeholder="Actual College Name" />
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <button
              className="btn btn-outline btn-sm mb-6"
              onClick={() => setEditData({
                ...editData,
                qualifications: [
                  ...editData.qualifications,
                  { degree: '', university: '', institute: '', startYear: '', endYear: '', custom_degree: '', custom_university: '', custom_institute: '' }
                ]
              })}
            >
              + Add Education
            </button>

            <div className="section-divider mt-4 mb-4">Work Experience History</div>
            {editData.work_history.map((w, idx) => (
              <div key={idx} className="work-entry-row mb-6">
                <div className="flex gap-4 mb-2">
                  <div className="form-group flex-1">
                    <label className="small font-bold">Company</label>
                    <input type="text" className="form-control" list="company-list" value={w.company} onChange={e => {
                      const newWork = [...editData.work_history];
                      newWork[idx].company = e.target.value;
                      setEditData({ ...editData, work_history: newWork });
                    }} placeholder="Select or type company..." />
                    <datalist id="company-list">
                      {MAJOR_COMPANIES.map(c => <option key={c} value={c} />)}
                    </datalist>
                  </div>
                  <div className="form-group flex-1">
                    <label className="small font-bold">Designation</label>
                    <input type="text" className="form-control" list="designation-list" value={w.role} onChange={e => {
                      const newWork = [...editData.work_history];
                      newWork[idx].role = e.target.value;
                      setEditData({ ...editData, work_history: newWork });
                    }} placeholder="Select or type role..." />
                    <datalist id="designation-list">
                      {SENIOR_DESIGNATIONS.map(d => <option key={d} value={d} />)}
                    </datalist>
                  </div>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="form-group flex-1">
                    <label className="small font-bold">Duration (e.g. 2010 - 2024)</label>
                    <input type="text" className="form-control" value={w.duration} onChange={e => {
                      const newWork = [...editData.work_history];
                      newWork[idx].duration = e.target.value;
                      setEditData({ ...editData, work_history: newWork });
                    }} />
                  </div>
                  {editData.work_history.length > 1 && (
                    <button className="btn btn-danger-outline btn-sm mt-4" onClick={() => {
                      setEditData({ ...editData, work_history: editData.work_history.filter((_, i) => i !== idx) });
                    }}>Remove</button>
                  )}
                </div>
                {/* Manual Option for Company and Designation */}
                {(w.company === 'Not Listed / Other' || w.role === 'Not Listed / Other') && (
                  <div className="bg-white p-3 rounded border border-dashed border-primary mt-2">
                    <p className="tiny-label text-primary font-bold mb-2">Custom Work Details</p>
                    <div className="grid grid-cols-2 gap-3">
                      {w.company === 'Not Listed / Other' && (
                        <input type="text" className="form-control text-xs" value={w.custom_company || ''} onChange={e => {
                          const newWork = [...editData.work_history];
                          newWork[idx].custom_company = e.target.value;
                          setEditData({ ...editData, work_history: newWork });
                        }} placeholder="Actual Company Name" />
                      )}
                      {w.role === 'Not Listed / Other' && (
                        <input type="text" className="form-control text-xs" value={w.custom_role || ''} onChange={e => {
                          const newWork = [...editData.work_history];
                          newWork[idx].custom_role = e.target.value;
                          setEditData({ ...editData, work_history: newWork });
                        }} placeholder="Actual Designation Name" />
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <button
              className="btn btn-outline btn-sm mb-8"
              onClick={() => setEditData({
                ...editData,
                work_history: [
                  ...editData.work_history,
                  { company: '', role: '', duration: '', custom_company: '', custom_role: '' }
                ]
              })}
            >
              + Add Work History
            </button>

            <div className="flex gap-4">
              <div className="form-group flex-1">
                <label className="small font-bold text-primary">Industry Focus</label>
                <input type="text" className="form-control" list="industry-list" value={editData.industry} onChange={e => setEditData({ ...editData, industry: e.target.value })} placeholder="Select or type industry..." />
              </div>
              <div className="form-group flex-1">
                <label className="small font-bold text-primary">Location</label>
                <input type="text" className="form-control" value={editData.location} onChange={e => setEditData({ ...editData, location: e.target.value })} />
              </div>
            </div>

            <div className="form-group">
              <label className="small font-bold text-primary">Target Designation / Expertise</label>
              <input type="text" className="form-control" list="designation-list" value={editData.ex_designation} onChange={e => setEditData({ ...editData, ex_designation: e.target.value })} placeholder="e.g. Senior Logistics Advisor" />
            </div>

            <div className="form-group">
              <label className="small font-bold text-primary">Professional Summary</label>
              <textarea className="form-control" rows="4" value={editData.bio} onChange={e => setEditData({ ...editData, bio: e.target.value })} placeholder="A brief summary of your career..." />
            </div>

            <div className="form-group">
              <label className="small font-bold text-primary">Key Skills (comma separated)</label>
              <input type="text" className="form-control" value={typeof editData.skills === 'string' ? editData.skills : editData.skills.join(', ')} onChange={e => setEditData({ ...editData, skills: e.target.value })} placeholder="e.g. Leadership, Strategy, Operations" />
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button
              className="btn btn-primary flex-1 py-4"
              onClick={() => {
                const skillsArray = typeof editData.skills === 'string'
                  ? editData.skills.split(',').map(s => s.trim()).filter(s => s !== '')
                  : editData.skills;

                // Clean up Not Listed values with their custom values
                const finalQuals = editData.qualifications.map(q => ({
                  degree: q.degree === 'Not Listed / Other' ? q.custom_degree : q.degree,
                  university: q.university === 'Not Listed / Other' ? q.custom_university : q.university,
                  institute: q.institute === 'Not Listed / Other' ? q.custom_institute : q.institute,
                  startYear: q.startYear,
                  endYear: q.endYear
                }));

                const finalWork = editData.work_history.map(w => ({
                  ...w,
                  company: w.company === 'Not Listed / Other' ? w.custom_company : w.company,
                  role: w.role === 'Not Listed / Other' ? w.custom_role : w.role
                }));

                onComplete({ ...editData, skills: skillsArray, qualifications: finalQuals, work_history: finalWork });
              }}
              style={{ fontSize: '1.1rem' }}
            >
              Correct & Continue to My Profile
            </button>
            <button className="btn btn-outline" onClick={onSkip}>Skip & Set Up Later</button>
          </div>
        </div>
        <style jsx="true">{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
          :root {
            --primary-color: #2563eb;
            --bg-color: var(--bg-color);
            --text-color: var(--text-primary);
          }
          [data-theme='dark'] {
            --primary-color: #60a5fa;
            --bg-color: #0f172a;
            --text-color: #f8fafc;
          }
          .onboarding-card h2 { color: var(--primary-color); }
          .form-group { margin-bottom: 1.5rem; }
          .form-group label { display: block; margin-bottom: 0.5rem; }
          .form-control {
            width: 100%;
            padding: 0.85rem;
            border: 1px solid #cbd5e1;
            border-radius: 12px;
            font-family: inherit;
            font-size: 1rem;
            transition: all 0.2s;
            background: #f8fafc;
          }
          .form-control:focus {
            outline: none;
            border-color: var(--primary-color);
            background: white;
            box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
          }
          .review-grid {
            display: grid;
            gap: 0.5rem;
          }
          .text-primary { color: var(--primary-color); }
          .mb-8 { margin-bottom: 2rem; }
          .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="onboarding-container animate-fade-in">
      <div className="onboarding-card">
        <div className="onboarding-header">
          <div className="step-badge">Welcome, {(user.name || 'User').split(' ')[0]}!</div>
          <h2>Let's build your expert profile</h2>
          <div className="onboarding-options">
            <div className="option-card upload" onClick={!isParsing ? handleResumeClick : undefined}>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
              />
              <div className="option-icon">📄</div>
              <h3>Auto-Fill with Resume</h3>
              <p>Upload your resume and we'll build your profile in seconds.</p>
              {isParsing ? (
                <div className="parsing-status mt-4">
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: `${parsingProgress}%` }}></div>
                  </div>
                  <span className="small mt-2 d-block">Analyzing resume... {parsingProgress}%</span>
                  <p className="small text-secondary mt-2">Extracting career milestones and skills...</p>
                </div>
              ) : (
                <>
                  <p>We'll use AI to extract your career milestones and skills.</p>
                  <button className="btn btn-primary mt-4">Select PDF/DOCX</button>
                </>
              )}
            </div>

            <div className="option-card manual" onClick={!isParsing ? startManual : undefined}>
              <div className="option-icon">✍️</div>
              <h3>Fill Manually</h3>
              <p>Type in your details step-by-step to customize your profile.</p>
              <button className="btn btn-outline mt-4">Start Manually</button>
            </div>
          </div>
        </div>
      </div>
      <style jsx="true">{`
        .onboarding-container {
          min-height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background-color: var(--bg-color);
        }
        .onboarding-card {
          background: var(--surface-color);
          padding: 3rem;
          border-radius: 24px;
          box-shadow: var(--shadow-lg);
          max-width: 900px;
          width: 100%;
          text-align: center;
          color: var(--text-primary);
        }
        .step-badge {
          background: var(--primary-color);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: 700;
          display: inline-block;
          margin-bottom: 1rem;
        }
        .onboarding-options {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-top: 3rem;
        }
        .option-card {
          padding: 2.5rem;
          border: 2px solid var(--border-color);
          background: var(--surface-color);
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          color: var(--text-primary);
        }
        .option-card:hover {
          border-color: #2563eb;
          transform: translateY(-5px);
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05);
        }
        .option-icon {
          font-size: 3rem;
          margin-bottom: 1.5rem;
        }
        .parsing-loader {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #2563eb;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        @media (max-width: 768px) {
          .onboarding-container { padding: 1rem; }
          .onboarding-card { padding: 1.5rem; border-radius: 16px; }
          .onboarding-options { grid-template-columns: 1fr; gap: 1rem; margin-top: 2rem; }
          .option-card { padding: 1.5rem; }
        }
      `}</style>
    </div>
  );
}



function SettingsPage({ user, userRole, onBack, theme, toggleTheme, onDeleteAccount }) {
  const [settings, setSettings] = useState({
    profileVisible: true,
    emailAlerts: true,
    smsAlerts: false,
    jobRecommendations: true,
    newsletter: false,
    twoFactor: false
  });

  const [show2FAModal, setShow2FAModal] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Account Deletion Flow States
  const [deleteStep, setDeleteStep] = useState(null); // 'confirm', 'password', 'warning', 'deleting'
  const [deletePassword, setDeletePassword] = useState('');
  const [isDeletingLoading, setIsDeletingLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const toggleSetting = (key) => {
    if (key === 'twoFactor' && !settings.twoFactor) {
      setShow2FAModal(true);
      return;
    }
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleVerify2FA = () => {
    if (twoFactorCode.length === 6) {
      setIsVerifying(true);
      setTimeout(() => {
        setIsVerifying(false);
        setSettings(prev => ({ ...prev, twoFactor: true }));
        setShow2FAModal(false);
        setTwoFactorCode('');
        alert("Two-Factor Authentication enabled successfully!");
      }, 1500);
    } else {
      alert("Please enter a valid 6-digit code.");
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: '800px' }}>
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="btn btn-outline btn-sm">← Back</button>
        <h1 style={{ margin: 0, fontSize: '1.75rem' }}>Account Settings</h1>
      </div>

      <div className="settings-grid" style={{ display: 'grid', gap: '2rem' }}>
        {/* Account Section */}
        <section className="settings-section card">
          <h3 style={{ fontSize: '1.1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
            👤 Account & Appearance
          </h3>
          <div className="setting-row flex justify-between items-center mb-6">
            <div>
              <div className="font-bold">Theme Mode</div>
              <div className="tiny-label">Switch between Light and Dark interface</div>
            </div>
            <div className="flex items-center gap-2">
              <span style={{ fontSize: '0.8rem' }}>{theme === 'light' ? '☀️ Light' : '🌙 Dark'}</span>
              <label className="switch">
                <input type="checkbox" checked={theme === 'dark'} onChange={toggleTheme} />
                <span className="slider"></span>
              </label>
            </div>
          </div>
          <div className="setting-row flex justify-between items-center mb-4">
            <div>
              <div className="font-bold">Public Profile</div>
              <div className="tiny-label">Allow companies to find you in search results</div>
            </div>
            <label className="switch">
              <input type="checkbox" checked={settings.profileVisible} onChange={() => toggleSetting('profileVisible')} />
              <span className="slider"></span>
            </label>
          </div>
          <div className="setting-row flex justify-between items-center">
            <div>
              <div className="font-bold">Open to Work</div>
              <div className="tiny-label">Show active status for new consulting projects</div>
            </div>
            <label className="switch">
              <input type="checkbox" checked={settings.jobRecommendations} onChange={() => toggleSetting('jobRecommendations')} />
              <span className="slider"></span>
            </label>
          </div>
        </section>

        {/* Notifications */}
        <section className="settings-section card">
          <h3 style={{ fontSize: '1.1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
            🔔 Notification Preferences
          </h3>
          <div className="setting-row flex justify-between items-center mb-6">
            <div>
              <div className="font-bold">Email Notifications</div>
              <div className="tiny-label">Receive updates about your account and applications</div>
            </div>
            <label className="switch">
              <input type="checkbox" checked={settings.emailAlerts} onChange={() => toggleSetting('emailAlerts')} />
              <span className="slider"></span>
            </label>
          </div>
          <div className="setting-row flex justify-between items-center mb-6">
            <div>
              <div className="font-bold">Job Alerts</div>
              <div className="tiny-label">Daily summary of jobs matching your expertise</div>
            </div>
            <label className="switch">
              <input type="checkbox" checked={settings.jobRecommendations} onChange={() => toggleSetting('jobRecommendations')} />
              <span className="slider"></span>
            </label>
          </div>
          <div className="setting-row flex justify-between items-center">
            <div>
              <div className="font-bold">SMS Notifications</div>
              <div className="tiny-label">Urgent project invites via text message</div>
            </div>
            <label className="switch">
              <input type="checkbox" checked={settings.smsAlerts} onChange={() => toggleSetting('smsAlerts')} />
              <span className="slider"></span>
            </label>
          </div>
        </section>

        {/* Security Section */}
        <section className="settings-section card">
          <h3 style={{ fontSize: '1.1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
            🔒 Security & Privacy
          </h3>
          <div className="setting-row flex justify-between items-center mb-6">
            <div>
              <div className="font-bold">Two-Factor Authentication</div>
              <div className="tiny-label">Secure your account with a Google/Authy code</div>
            </div>
            <div className="flex items-center gap-3">
              {settings.twoFactor && <span style={{ fontSize: '0.75rem', color: 'var(--success-color)', fontWeight: 'bold' }}>Active</span>}
              <label className="switch">
                <input type="checkbox" checked={settings.twoFactor} onChange={() => toggleSetting('twoFactor')} />
                <span className="slider"></span>
              </label>
            </div>
          </div>
          {!settings.twoFactor && (
            <div
              style={{ backgroundColor: '#fff7ed', border: '1px solid #ffedd5', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}
              onClick={() => setShow2FAModal(true)}
              className="cursor-pointer"
            >
              <div className="font-bold text-secondary" style={{ color: '#9a3412', fontSize: '0.85rem' }}>🛡️ Two-Factor Authentication is currently OFF</div>
              <p style={{ fontSize: '0.75rem', margin: 0, color: '#c2410c' }}>We highly recommend setting this up to protect your professional data.</p>
              <button className="btn btn-sm btn-outline mt-3" style={{ color: '#c2410c', borderColor: '#c2410c' }}>Setup 2FA Now</button>
            </div>
          )}
          <div className="flex gap-4">
            <button className="btn btn-outline" style={{ flex: 1 }}>Change Password</button>
            <button className="btn btn-outline" style={{ flex: 1, color: 'var(--error-color)', borderColor: 'var(--error-color)' }} onClick={() => setDeleteStep('confirm')}>Delete Account Permanently</button>
          </div>
        </section>

        <section className="card" style={{ backgroundColor: '#f8fafc', border: '1px dashed var(--border-color)' }}>
          <div className="flex items-center gap-4">
            <div style={{ fontSize: '1.5rem' }}>📧</div>
            <div>
              <div className="font-bold">Login Email</div>
              <div className="text-secondary">{user.email}</div>
            </div>
            <div style={{ marginLeft: 'auto' }} className="badge badge-success">Google Linked</div>
          </div>
        </section>
      </div>

      {/* Deletion Modal */}
      {deleteStep && (
        <div className="modal-overlay" style={{ zIndex: 2000 }}>
          <div className="edit-modal animate-slide-up" style={{ maxWidth: '400px', textAlign: 'center', padding: '2rem' }}>
            {deleteStep === 'confirm' && (
              <div className="delete-step-confirm">
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚠️</div>
                <h3 style={{ color: 'var(--error-color)', marginBottom: '0.75rem' }}>Delete Account?</h3>
                <p className="tiny-label text-secondary mb-6">
                  Permanently delete your account? This action removes all profile data and history.
                </p>
                <div className="flex gap-3">
                  <button className="btn btn-outline flex-1 btn-sm" onClick={() => setDeleteStep(null)}>Cancel</button>
                  <button className="btn btn-danger flex-1 btn-sm" onClick={() => setDeleteStep('password')}>Continue</button>
                </div>
              </div>
            )}

            {deleteStep === 'password' && (
              <div className="delete-step-password">
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔒</div>
                <h3>Verify Identity</h3>
                <p className="tiny-label text-secondary mb-4">Enter password to confirm account deletion.</p>
                <div className="form-group" style={{ textAlign: 'left' }}>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter your password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && setDeleteStep('warning')}
                  />
                  {deleteError && <p className="text-error small mt-2">{deleteError}</p>}
                </div>
                <div className="flex gap-3 mt-6">
                  <button className="btn btn-outline flex-1 btn-sm" onClick={() => setDeleteStep('confirm')}>Back</button>
                  <button
                    className="btn btn-primary flex-1 btn-sm"
                    onClick={() => {
                      if (deletePassword.length > 0) {
                        setDeleteStep('warning');
                        setDeleteError('');
                      } else {
                        setDeleteError('Password is required');
                      }
                    }}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            )}

            {deleteStep === 'warning' && (
              <div className="delete-step-warning">
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🚫</div>
                <h3 style={{ color: 'var(--error-color)', marginBottom: '0.75rem' }}>Final Warning!</h3>
                <p className="tiny-label text-secondary mb-4" style={{ fontWeight: 600 }}>
                  This is permanent. All data will be wiped immediately.
                </p>
                <div className="warning-box mb-6" style={{ background: '#fff1f2', border: '1px solid #fecdd3', padding: '0.75rem', borderRadius: '12px', textAlign: 'left' }}>
                  <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.75rem', color: '#be123c' }}>
                    <li>Profile removed from searches</li>
                    <li>Active jobs/apps cancelled</li>
                  </ul>
                </div>
                <div className="flex gap-3">
                  <button className="btn btn-outline flex-1 btn-sm" onClick={() => setDeleteStep('password')}>Back</button>
                  <button
                    className="btn btn-danger flex-1 btn-sm"
                    onClick={async () => {
                      setIsDeletingLoading(true);
                      try {
                        await onDeleteAccount(deletePassword);
                      } catch (err) {
                        setDeleteError(err.message || 'Deletion failed');
                        setDeleteStep('password');
                      } finally {
                        setIsDeletingLoading(false);
                      }
                    }}
                    disabled={isDeletingLoading}
                  >
                    {isDeletingLoading ? 'Wiping...' : 'Delete Permanently'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2FA Setup Modal */}
      {show2FAModal && (
        <div className="modal-overlay flex items-center justify-center" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, padding: '1rem' }}>
          <div className="modal-content card" style={{ maxWidth: '450px', width: '100%', padding: '2.5rem', animation: 'fadeIn 0.3s ease-out' }}>
            <h2 style={{ fontSize: '1.5rem', textAlign: 'center', marginBottom: '1.5rem' }}>Setup 2FA</h2>

            <div className="step-box mb-6" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.85rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                1. Scan this QR code with your <strong>Authenticator App</strong> (Google Authenticator, Authy, etc.)
              </div>
              <div style={{ width: '180px', height: '180px', margin: '0 auto', border: '2px solid var(--border-color)', padding: '10px', borderRadius: ' var(--radius-md)' }}>
                <img src="/Users/tusharbhatt/work/retirepro/frontend/src/assets/2fa_qr.png" alt="2FA QR Code" style={{ width: '100%', height: '100%' }} />
              </div>
            </div>

            <div className="step-box mb-6">
              <div style={{ fontSize: '0.85rem', marginBottom: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                2. Enter the 6-digit code shown in the app
              </div>
              <div className="flex justify-center">
                <input
                  type="text"
                  maxLength="6"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  placeholder="000 000"
                  style={{
                    width: '160px',
                    fontSize: '1.5rem',
                    textAlign: 'center',
                    letterSpacing: '5px',
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-md)',
                    border: '2px solid var(--primary-color)'
                  }}
                />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                className="btn btn-primary"
                onClick={handleVerify2FA}
                disabled={isVerifying || twoFactorCode.length < 6}
                style={{ width: '100%', padding: '1rem' }}
              >
                {isVerifying ? 'Verifying...' : 'Enable 2FA'}
              </button>
              <button className="btn btn-outline" onClick={() => setShow2FAModal(false)} style={{ width: '100%' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .switch {
          position: relative;
          display: inline-block;
          width: 44px;
          height: 24px;
        }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: var(--border-color);
          transition: .3s;
          border-radius: 24px;
        }
        .slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .3s;
          border-radius: 50%;
        }
        input:checked + .slider { background-color: var(--primary-color); }
        input:checked + .slider:before { transform: translateX(20px); }
        .setting-row {
          padding-bottom: 0.5rem;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function AppliedJobs({ onBack }) {
  const applications = [
    {
      id: 1,
      project: "Supply Chain Strategy Advisor",
      company: "Global Logistics Partners",
      appliedDate: "Oct 12, 2023",
      status: "Pending",
      statusColor: "#ff9800",
      pay: "$150/hr",
      location: "Remote"
    },
    {
      id: 2,
      project: "Interim HR Director",
      company: "Vantage Corp",
      appliedDate: "Oct 10, 2023",
      status: "Interview Scheduled",
      statusColor: "#0d47a1",
      pay: "$200/hr",
      location: "New York"
    },
    {
      id: 3,
      project: "Senior Engineering Consultant",
      company: "TechScale Innovations",
      appliedDate: "Oct 05, 2023",
      status: "Under Review",
      statusColor: "#64748b",
      pay: "$180/hr",
      location: "Bangalore"
    }
  ];

  return (
    <div className="container page-fade-in" style={{ padding: '4rem 0' }}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <button className="btn btn-link" onClick={onBack} style={{ padding: 0, marginBottom: '0.5rem', color: 'var(--primary-color)' }}>← Back to Dashboard</button>
          <h1 className="font-display" style={{ margin: 0, color: 'var(--text-primary)' }}>My Applications</h1>
        </div>
        <div className="card-premium" style={{ border: '1px solid var(--border-color)', padding: '1rem 2rem', textAlign: 'center' }}>
          <div className="stat-value" style={{ fontSize: '1.5rem', display: 'block' }}>{applications.length}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Applied</div>
        </div>
      </div>

      <div className="card-premium">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1.5rem' }}>Project / Company</th>
              <th style={{ padding: '1.5rem' }}>Applied Date</th>
              <th style={{ padding: '1.5rem' }}>Pay Rate</th>
              <th style={{ padding: '1.5rem' }}>Status</th>
              <th style={{ padding: '1.5rem' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1.5rem' }}>
                  <div style={{ fontWeight: 600 }}>{app.project}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{app.company} • {app.location}</div>
                </td>
                <td style={{ padding: '1.5rem', color: 'var(--text-secondary)' }}>{app.appliedDate}</td>
                <td style={{ padding: '1.5rem', fontWeight: 500 }}>{app.pay}</td>
                <td style={{ padding: '1.5rem' }}>
                  <span style={{
                    padding: '0.4rem 0.8rem',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    backgroundColor: `${app.statusColor}15`,
                    color: app.statusColor,
                    border: `1px solid ${app.statusColor}30`
                  }}>
                    {app.status}
                  </span>
                </td>
                <td style={{ padding: '1.5rem' }}>
                  <button className="btn btn-outline btn-sm">View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProfessionalHome({ onNavigateToApplications }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All Industries');
  const [sortBy, setSortBy] = useState('Newest First');

  const jobs = [
    {
      id: 1,
      title: "Strategic Supply Chain Advisor",
      company: "Metro Logistics Global",
      pay: "$180/hr",
      location: "Remote / New York",
      type: "Consulting",
      posted: "2 days ago",
      tags: ["Logistics", "Strategy", "Operations"],
      isPremium: true
    },
    {
      id: 2,
      title: "Interim Chief HR Director",
      company: "Vantage Corp International",
      pay: "$220/hr",
      location: "Hybrid / London",
      type: "Interim Leadership",
      posted: "5 hours ago",
      tags: ["HR", "Change Management", "M&A"],
      isPremium: true
    },
    {
      id: 3,
      title: "Senior Engineering Mentor",
      company: "TechScale Innovations",
      pay: "$150/hr",
      location: "On-site / Bangalore",
      type: "Mentorship",
      posted: "1 day ago",
      tags: ["Engineering", "Leadership", "L&D"],
      isPremium: false
    }
  ];

  const sortedJobs = [...jobs].sort((a, b) => {
    if (sortBy === 'Highest Pay') {
      const payA = parseInt(a.pay.replace(/\D/g, '')) || 0;
      const payB = parseInt(b.pay.replace(/\D/g, '')) || 0;
      return payB - payA;
    }
    return b.id - a.id;
  });

  return (
    <div className="professional-dashboard page-fade-in" style={{ backgroundColor: 'transparent', minHeight: '100vh', padding: '2rem 0 5rem 0' }}>
      <main className="container" style={{ maxWidth: '1000px' }}>

        {/* 1. Hero Section Card */}
        <section className="section-spacer">
          <div className="card-premium" style={{ background: 'linear-gradient(135deg, #0d47a1 0%, #1a237e 100%)', padding: '3rem', border: 'none' }}>
            <div className="flex justify-between items-center">
              <div>
                <div className="expert-badge" style={{ marginBottom: '1.25rem', backgroundColor: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.2)' }}>🏅 Distinguished Expert & Mentor</div>
                <h1 className="font-display" style={{ color: 'white', fontSize: '3rem', marginBottom: '0.5rem', lineHeight: 1.1 }}>Welcome back, Senior Expert</h1>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', margin: 0 }}>Your 25+ years of institutional wisdom is our greatest asset.</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Consulting Impact</div>
                <div style={{ color: 'white', fontSize: '2.75rem', fontWeight: 700 }}>$12,450.00</div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Stats Row */}
        <section className="section-spacer">
          <div className="grid grid-cols-3 gap-6">
            <div className="card-premium" style={{ padding: '1.75rem', cursor: 'pointer' }} onClick={onNavigateToApplications}>
              <div className="flex justify-between items-start">
                <div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>Pending Applications</div>
                  <div className="stat-value" style={{ fontSize: '2.25rem' }}>12</div>
                </div>
                <div style={{ fontSize: '1.5rem', opacity: 0.8 }}>📩</div>
              </div>
              <div style={{ marginTop: '1.25rem', fontSize: '0.8rem', color: 'var(--primary-color)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                Manage Applications <span>→</span>
              </div>
            </div>
            <div className="card-premium" style={{ padding: '1.75rem' }}>
              <div className="flex justify-between items-start">
                <div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>Active Projects</div>
                  <div className="stat-value" style={{ fontSize: '2.25rem' }}>3</div>
                </div>
                <div style={{ fontSize: '1.5rem', opacity: 0.8 }}>💼</div>
              </div>
              <div style={{ marginTop: '1.25rem', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Currently in progress</div>
            </div>
            <div className="card-premium" style={{ padding: '1.75rem' }}>
              <div className="flex justify-between items-start">
                <div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>Expert Status</div>
                  <div className="stat-value" style={{ fontSize: '2.25rem', color: 'var(--success-color)' }}>Verified</div>
                </div>
                <div style={{ fontSize: '1.5rem', opacity: 0.8 }}>✅</div>
              </div>
              <div style={{ marginTop: '1.25rem', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Badges Active</div>
            </div>
          </div>
        </section>

        {/* 3. Search & Filter Bar Card */}
        <section className="section-spacer">
          <div className="card-premium" style={{ padding: '1.5rem' }}>
            <div className="flex gap-4">
              <div className="flex-1" style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>🔍</span>
                <input
                  type="text"
                  placeholder="Search by role, expertise, or company..."
                  className="form-input"
                  style={{ paddingLeft: '2.75rem', border: '1px solid var(--border-color)', background: 'var(--surface-color)', color: 'var(--text-primary)', height: '3.5rem', fontSize: '1rem' }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div style={{ width: '240px' }}>
                <select
                  className="form-input"
                  style={{ border: '1px solid var(--border-color)', background: 'var(--surface-color)', color: 'var(--text-primary)', height: '3.5rem', fontSize: '1rem' }}
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                >
                  <option>All Industries</option>
                  <option>Logistics</option>
                  <option>Human Resources</option>
                  <option>Technology</option>
                  <option>Finance</option>
                </select>
              </div>
              <button className="btn btn-primary" style={{ padding: '0 2.5rem', height: '3.5rem', fontSize: '1rem' }}>Find Jobs</button>
            </div>
          </div>
        </section>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: '40px', alignItems: 'start' }}>
          {/* 4. Main Job Feed */}
          <div style={{ gridColumn: 'span 2' }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display" style={{ fontSize: '2rem', margin: 0, color: 'var(--text-primary)' }}>Opportunities for Your Legacy</h2>
              <div className="flex items-center gap-4">
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{jobs.length} roles</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{ border: 'none', background: 'transparent', color: 'var(--primary-color)', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', outline: 'none' }}
                  >
                    <option>Newest First</option>
                    <option>Highest Pay</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="job-list-premium flex flex-col gap-10">
              {sortedJobs.map((job) => (
                <div key={job.id} className="card-premium" style={{ padding: '2rem' }}>
                  <div className="job-card-header">
                    <div className="flex gap-5">
                      <div className="company-logo-placeholder" style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'var(--border-color)', color: 'var(--text-primary)' }}>🏢</div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-display" style={{ margin: 0, fontSize: '1.5rem' }}>{job.title}</h3>
                          {job.isPremium && <span className="legacy-badge">Verified Expert</span>}
                        </div>
                        <p style={{ margin: 0, fontWeight: 600, color: 'var(--primary-color)', fontSize: '1rem' }}>{job.company}</p>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.75rem', color: 'var(--text-primary)', lineHeight: 1, fontWeight: 700 }}>{job.pay}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>per hour</div>
                    </div>
                  </div>

                  <div className="job-meta" style={{ margin: '1.5rem 0' }}>
                    <div className="job-meta-item" style={{ fontSize: '0.9rem' }}>📍 {job.location}</div>
                    <div className="job-meta-item" style={{ fontSize: '0.9rem' }}>💼 {job.type}</div>
                    <div className="job-meta-item" style={{ fontSize: '0.9rem' }}>🕒 {job.posted}</div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      {job.tags.map(tag => <span key={tag} className="job-tag-premium" style={{ padding: '0.4rem 1rem' }}>{tag}</span>)}
                    </div>
                    <div className="flex gap-4">
                      <button className="btn btn-outline" style={{ border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.75rem 1.5rem' }}>View Details</button>
                      <button className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>Apply Now</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Profile Strength & Recommendations Sidebar */}
          <div className="flex flex-col gap-6" style={{ position: 'sticky', top: '2rem' }}>
            <div className="card-premium" style={{ padding: '1rem', border: '1px solid var(--border-color)' }}>
              <div className="flex items-center gap-2 mb-3">
                <div style={{ fontSize: '1rem' }}>📊</div>
                <h3 className="font-display" style={{ fontSize: '0.95rem', margin: 0 }}>Profile Strength</h3>
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <div className="flex justify-between items-end mb-1">
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Status</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-color)' }}>85%</span>
                </div>
                <div style={{ width: '100%', height: '5px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '85%', height: '100%', background: 'linear-gradient(to right, var(--primary-color), #4f46e5)', borderRadius: '4px' }}></div>
                </div>
              </div>
              
              <button className="btn btn-primary" style={{ width: '100%', padding: '0.6rem', fontSize: '0.8rem' }}>Complete</button>
            </div>

            <div className="card-premium" style={{ padding: '1rem' }}>
              <h3 className="font-display" style={{ fontSize: '0.95rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem' }}>Recommended</h3>
              <div className="flex flex-col gap-4">
                {[
                  { title: "M&A Advisor", pay: "$250", icon: "💎" },
                  { title: "L&D Design", pay: "$140", icon: "🎓" }
                ].map((rec, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <div style={{ fontSize: '1rem', padding: '0.3rem', background: 'var(--bg-color)', borderRadius: '6px' }}>{rec.icon}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-primary)', marginBottom: '1px', lineHeight: 1.2 }}>{rec.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}><span style={{ color: 'var(--primary-color)', fontWeight: 600 }}>{rec.pay}</span></div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn btn-outline" style={{ width: '100%', marginTop: '1.25rem', padding: '0.5rem', fontSize: '0.75rem' }}>View More</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const LOCATION_DATA = {
  'India': ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata', 'Pune', 'Jaipur', 'Lucknow'],
  'USA': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'],
  'UK': ['London', 'Birmingham', 'Manchester', 'Glasgow', 'Liverpool', 'Leeds', 'Sheffield', 'Edinburgh', 'Bristol', 'Leicester'],
  'Australia': ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast', 'Canberra', 'Newcastle', 'Central Coast', 'Wollongong'],
  'Germany': ['Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt', 'Stuttgart', 'Düsseldorf', 'Dortmund', 'Essen', 'Leipzig']
};

const API_BASE = import.meta.env.VITE_API_URL;

function ProfessionalSignup() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Identity
    fullName: '', dob: '', phone: '', email: '', idType: 'Aadhaar', idNumber: '', selfie: null,
    // Step 2: Employment
    exCompany: '', empId: '', exDesignation: '', department: '', duration: '', exitType: 'Retirement', resume: null,
    // Step 3: Expertise
    industry: '', skills: '', expYears: '', achievements: '',
    // Step 4: Presence
    linkedin: '', publications: '', consultingExp: 'No',
    // Step 5: Location & Availability
    city: 'Mumbai', country: 'India', workMode: 'Remote', availability: 'Consulting',
    // Step 6: Video
    videoUrl: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  // Verification Logic States
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [digilockerVerified, setDigilockerVerified] = useState(false);
  const [isScanningResume, setIsScanningResume] = useState(false);
  const [resumeName, setResumeName] = useState('');

  // Camera Refs and State
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [tempSelfie, setTempSelfie] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const analysisTimeoutRef = useRef(null);

  // Video Recording Refs and State
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(s);
      setIsCameraActive(true);
      setTempSelfie(null);
      setZoomLevel(1);

      if (step === 1) {
        setIsAnalyzing(true);
        analysisTimeoutRef.current = setTimeout(() => {
          setIsAnalyzing(false);
          setZoomLevel(1.8);
          setCountdown(3);
          const timer = setInterval(() => {
            setCountdown(prev => {
              if (prev === 1) {
                clearInterval(timer);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        }, 2500);
      }
    } catch (err) {
      console.error("Camera Error:", err);
      alert("Could not access camera. Please check your browser permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
    setCountdown(null);
    setZoomLevel(1);
    setIsAnalyzing(false);
    if (analysisTimeoutRef.current) clearTimeout(analysisTimeoutRef.current);
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
  };

  const startRecording = () => {
    if (!stream) return;
    recordedChunksRef.current = [];
    const options = { mimeType: 'video/webm;codecs=vp9,opus' };
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      options.mimeType = 'video/webm';
    }

    try {
      const recorder = new MediaRecorder(stream, options);
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };
      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedVideoUrl(url);
        setFormData({ ...formData, videoUrl: url });
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordingTime(0);

      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Recording error:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(recordingTimerRef.current);
      stopCamera();
    }
  };

  // --- Advanced Verification Simulations ---

  const handleSendOtp = () => {
    if (!formData.phone) return alert("Please enter a mobile number");
    setOtpSent(true);
    // In real app, this would call a backend service like Twilio
    alert("OTP sent to " + formData.phone + " (Mock code: 1234)");
  };

  const handleVerifyOtp = () => {
    if (otpInput === '1234') {
      setOtpVerified(true);
      alert("Mobile number verified successfully!");
    } else {
      alert("Invalid OTP. Try 1234");
    }
  };

  const handleDigilocker = () => {
    setDigilockerVerified(true);
    // Simulate pulling data from DigiLocker
    setFormData({
      ...formData,
      fullName: "Tushar Bhatt (Verified)",
      dob: "1985-05-15",
      idNumber: "XXXX-XXXX-1234",
      idType: "Aadhaar Card"
    });
    alert("Data pulled successfully from DigiLocker!");
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeName(file.name);
      setIsScanningResume(true);

      // Simulate "AI" Scanning
      setTimeout(() => {
        setIsScanningResume(false);
        setFormData({ ...formData, resume: file });
        alert("Resume analyzed successfully! Experience signals detected.");
      }, 3000);
    }
  };

  // Improved stream attachment for Safari compatibility
  useEffect(() => {
    const video = videoRef.current;
    if (stream && video) {
      video.srcObject = stream;
      video.onloadedmetadata = () => {
        video.play().catch(e => console.error("Play error:", e));
      };
      // Fallback in case metadata is already loaded
      video.play().catch(e => console.error("Immediate play error:", e));
    }
  }, [stream, isCameraActive]);


  const takeSelfie = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      const video = videoRef.current;
      const canvas = canvasRef.current;

      // Calculate crop based on zoomLevel
      // Use the actual video dimensions for precision
      const vWidth = video.videoWidth || 400;
      const vHeight = video.videoHeight || 300;

      const sw = vWidth / zoomLevel;
      const sh = vHeight / vWidth * sw; // Keep aspect ratio
      const sx = (vWidth - sw) / 2;
      const sy = (vHeight - sh) / 2;

      // Reset transformation to draw mirrored
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.translate(canvas.width, 0);
      context.scale(-1, 1);

      // Draw ONLY the zoomed portion
      context.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

      const dataUrl = canvas.toDataURL('image/png');
      setTempSelfie(dataUrl);
      stopCamera();
    }
  };

  // Trigger capture when countdown reaches 0
  useEffect(() => {
    if (countdown === 0) {
      takeSelfie();
      setCountdown(null);
    }
  }, [countdown]);

  // Cleanup camera on unmount or step change
  useEffect(() => {
    return () => stopCamera();
  }, [step]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/api/professionals/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        const data = await response.json();
        setError(data.error || 'Verification failed. Please check all steps.');
      }
    } catch (err) {
      setError('Could not connect to the server. Please ensure the backend is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="container" style={{ padding: '4rem 0' }}>
        <div className="form-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏅</div>
          <h2>Expert Profile Under Review!</h2>
          <p>Thank you, <strong>{formData.fullName}</strong>. Your identity and retirement records have been submitted for verification.</p>
          <div className="badge-row" style={{ justifyContent: 'center' }}>
            <div className="verified-indicator">✔️ Identity Verification: Pending</div>
            <div className="verified-indicator">✔️ Employment Verification: Pending</div>
            <div className="verified-indicator">✔️ Video Intro: Uploaded</div>
          </div>
          <p className="text-secondary mt-4">We will notify you at {formData.email} once your <strong>Verified Expert Badge</strong> is active.</p>
          <button className="btn btn-primary mt-6" onClick={() => window.location.reload()}>Go to Expert Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '4rem 0' }}>
      <div className="signup-container" style={{ maxWidth: '900px' }}>
        <div className="form-header text-center">
          <h1 className="view-title">Expert Verification Flow</h1>
          <p>Complete these 6 steps to achieve the <strong>Verified Expert</strong> status.</p>
        </div>

        {/* 6-Step Stepper */}
        <div className="stepper stepper-extended">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className={`step ${step >= i ? 'completed' : ''} ${step === i ? 'active' : ''}`}>{i}</div>
          ))}
        </div>

        <div className="form-card">
          {error && <div className="validation-error" style={{ background: '#fee2e2', padding: '0.8rem', borderRadius: '4px', marginBottom: '1.5rem', textAlign: 'center' }}>{error}</div>}

          <form onSubmit={step === 6 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>

            {/* Step 1: Identity */}
            {step === 1 && (
              <div className="step-content">
                <div className="flex justify-between items-center mb-6">
                  <h3>Step 1: Identity Verification</h3>
                  {!digilockerVerified && (
                    <button type="button" className="btn btn-secondary btn-sm" onClick={handleDigilocker}>
                      ⚡ Verify via DigiLocker (Recommended)
                    </button>
                  )}
                  {digilockerVerified && <span className="badge badge-success">✓ DigiLocker Linked</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Full Name (as per ID)</label>
                  <input type="text" name="fullName" className="form-input" value={formData.fullName} onChange={handleChange} required disabled={digilockerVerified} />
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Date of Birth</label>
                    <input type="date" name="dob" className="form-input" value={formData.dob} onChange={handleChange} required disabled={digilockerVerified} />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Mobile Number</label>
                    <div className="flex gap-2">
                      <input type="tel" name="phone" className="form-input" value={formData.phone} onChange={handleChange} required placeholder="+91 XXXXX XXXXX" />
                      {!otpVerified && (
                        <button type="button" className="btn btn-outline" style={{ fontSize: '0.7rem' }} onClick={handleSendOtp}>
                          {otpSent ? 'Resend' : 'Send OTP'}
                        </button>
                      )}
                      {otpVerified && <span className="btn btn-success" style={{ fontSize: '0.7rem', pointerEvents: 'none' }}>Verified</span>}
                    </div>
                    {otpSent && !otpVerified && (
                      <div className="flex gap-2 mt-2">
                        <input
                          type="text"
                          placeholder="Enter 4-digit OTP"
                          className="form-input"
                          style={{ fontSize: '0.85rem' }}
                          value={otpInput}
                          onChange={(e) => setOtpInput(e.target.value)}
                        />
                        <button type="button" className="btn btn-primary" style={{ fontSize: '0.7rem' }} onClick={handleVerifyOtp}>Verify</button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Government ID Type</label>
                    <select name="idType" className="form-input" value={formData.idType} onChange={handleChange} disabled={digilockerVerified}>
                      <option>Aadhaar Card</option>
                      <option>PAN Card</option>
                      <option>Passport</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">ID Number</label>
                    <input type="text" name="idNumber" className="form-input" value={formData.idNumber} onChange={handleChange} required disabled={digilockerVerified} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Live Selfie Verification</label>
                  {!formData.selfie && !isCameraActive && !tempSelfie && (
                    <div className="file-upload" onClick={startCamera}>
                      📸 Click to Open Camera for Automated Selfie
                    </div>
                  )}

                  {isCameraActive && (
                    <div className={`camera-box ${isAnalyzing ? 'is-analyzing' : ''}`}>
                      <div className="camera-container">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="video-feed"
                          style={{ transform: `rotateY(180deg) scale(${zoomLevel})` }}
                        />
                        {isAnalyzing && <div className="scanner-line"></div>}
                        <div className="capture-overlay"></div>
                        {countdown !== null && <div className="countdown-overlay">{countdown > 0 ? countdown : '📸'}</div>}
                        <div className="guide-text">
                          {isAnalyzing ? 'Analyzing Face...' : (countdown !== null ? 'Stay Still' : 'Preparing...')}
                        </div>
                      </div>
                      <div className="camera-controls">
                        <button type="button" className="btn btn-outline" onClick={stopCamera}>Close Camera</button>
                      </div>
                      <canvas ref={canvasRef} width="400" height="300" style={{ display: 'none' }} />
                    </div>
                  )}

                  {tempSelfie && !isCameraActive && (
                    <div className="confirmation-view">
                      <h4 className="mb-4">Use this photo for verification?</h4>
                      <img src={tempSelfie} alt="Captured Selfie" className="selfie-result" />
                      <div className="camera-controls">
                        <button type="button" className="btn btn-primary" onClick={() => { setFormData({ ...formData, selfie: tempSelfie }); setTempSelfie(null); }}>Yes, Confirm</button>
                        <button type="button" className="btn btn-outline" onClick={() => { setTempSelfie(null); startCamera(); }}>No, Retake</button>
                      </div>
                    </div>
                  )}

                  {formData.selfie && !isCameraActive && !tempSelfie && (
                    <div className="selfie-preview-container text-center">
                      <img src={formData.selfie} alt="Verified Selfie" className="selfie-result" style={{ borderColor: 'var(--success-color)' }} />
                      <button type="button" className="btn btn-outline btn-sm mt-2" onClick={startCamera}>Retake Photo</button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Employment */}
            {step === 2 && (
              <div className="step-content">
                <h3>Step 2: Previous Employment</h3>
                <p className="text-secondary small mb-4">Provide details of your last or major organization.</p>
                <div className="form-group">
                  <label className="form-label">Organization Name</label>
                  <input type="text" name="exCompany" className="form-input" value={formData.exCompany} onChange={handleChange} required />
                </div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Last Designation</label>
                    <input type="text" name="exDesignation" className="form-input" value={formData.exDesignation} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Department</label>
                    <input type="text" name="department" className="form-input" value={formData.department} onChange={handleChange} required />
                  </div>
                </div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Duration (Years)</label>
                    <input type="text" name="duration" className="form-input" value={formData.duration} onChange={handleChange} required placeholder="e.g. 1995 - 2022" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Type of Exit</label>
                    <select name="exitType" className="form-input" value={formData.exitType} onChange={handleChange}>
                      <option>Retirement</option>
                      <option>Voluntary Retirement (VRS)</option>
                      <option>Resigned</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Comprehensive Resume / CV</label>
                  {!formData.resume && (
                    <div className="file-upload-box">
                      <input type="file" id="resume-upload" onChange={handleResumeUpload} style={{ display: 'none' }} accept=".pdf,.doc,.docx" />
                      <label htmlFor="resume-upload" className="file-upload-label">
                        {isScanningResume ? (
                          <div className="scanning-container">
                            <div className="scanner-line"></div>
                            <span>Analyzing Resume Structure...</span>
                          </div>
                        ) : (
                          <>
                            <span style={{ fontSize: '1.5rem' }}>📄</span>
                            <span>Click to upload Resume (PDF/DOCX)</span>
                          </>
                        )}
                      </label>
                    </div>
                  )}
                  {formData.resume && (
                    <div className="verified-file-badge flex items-center gap-3">
                      <span className="badge badge-success">✓ {resumeName} Analyzed</span>
                      <button 
                        type="button" 
                        className="btn-link" 
                        style={{ fontSize: '0.8rem', color: 'var(--primary-color)', fontWeight: 600 }}
                        onClick={() => window.open(URL.createObjectURL(formData.resume), '_blank')}
                      >
                        View
                      </button>
                      <button type="button" className="btn-link" onClick={() => setFormData({ ...formData, resume: null })}>Change</button>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Retirement Evidence (Letter/Experience Cert)</label>
                  <div className="file-upload-box">
                    <span style={{ fontSize: '1.5rem' }}>📁</span>
                    <span>Click to upload Organization Evidence</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Expertise */}
            {step === 3 && (
              <div className="step-content">
                <h3>Step 3: Work Expertise & Domain</h3>
                <div className="form-group">
                  <label className="form-label">Primary Industry</label>
                  <input type="text" name="industry" className="form-input" value={formData.industry} onChange={handleChange} required placeholder="e.g. Banking, Manufacturing, Public Sector" />
                </div>
                <div className="form-group">
                  <label className="form-label">Key Skills / Expertise Areas</label>
                  <input type="text" name="skills" className="form-input" value={formData.skills} onChange={handleChange} required placeholder="Project Mgt, Strategy, L&D" />
                </div>
                <div className="form-group">
                  <label className="form-label">Total Years of Professional Experience</label>
                  <input type="number" name="expYears" className="form-input" value={formData.expYears} onChange={handleChange} required min="15" />
                </div>
                <div className="form-group">
                  <label className="form-label">Major Achievements (Optional)</label>
                  <textarea name="achievements" className="form-input" value={formData.achievements} onChange={handleChange} rows="3" placeholder="Key projects, awards, or patents..."></textarea>
                </div>
              </div>
            )}

            {/* Step 4: Presence */}
            {step === 4 && (
              <div className="step-content">
                <h3>Step 4: Professional Presence</h3>
                <div className="form-group">
                  <label className="form-label">LinkedIn Profile URL</label>
                  <input type="url" name="linkedin" className="form-input" value={formData.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/username" />
                </div>
                <div className="form-group">
                  <label className="form-label">Published Work / Articles (Optional)</label>
                  <input type="text" name="publications" className="form-input" value={formData.publications} onChange={handleChange} placeholder="Links to blogs, papers, etc." />
                </div>
                <div className="form-group">
                  <label className="form-label">Do you have prior consulting experience?</label>
                  <div className="choice-grid">
                    {['Yes', 'No'].map(opt => (
                      <div key={opt} className={`choice-box ${formData.consultingExp === opt ? 'active' : ''}`} onClick={() => setFormData({ ...formData, consultingExp: opt })}>
                        {opt}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Location & Availability */}
            {step === 5 && (
              <div className="step-content">
                <h3>Step 5: Location & Availability</h3>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Country</label>
                    <select name="country" className="form-input" value={formData.country} onChange={handleChange}>
                      {Object.keys(LOCATION_DATA).map(c => <option key={c} value={c}>{c}</option>)}
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Current City</label>
                    {LOCATION_DATA[formData.country] ? (
                      <select name="city" className="form-input" value={formData.city} onChange={handleChange}>
                        <option value="">Select City</option>
                        {LOCATION_DATA[formData.country].map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    ) : (
                      <input type="text" name="city" className="form-input" value={formData.city} onChange={handleChange} required placeholder="Enter City Name" />
                    )}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Work Preference</label>
                  <div className="choice-grid">
                    {['Remote', 'On-site', 'Hybrid'].map(m => (
                      <div key={m} className={`choice-box ${formData.workMode === m ? 'active' : ''}`} onClick={() => setFormData({ ...formData, workMode: m })}>
                        {m}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Availability Type</label>
                  <div className="choice-grid">
                    {['Full-time', 'Part-time', 'Consulting'].map(a => (
                      <div key={a} className={`choice-box ${formData.availability === a ? 'active' : ''}`} onClick={() => setFormData({ ...formData, availability: a })}>
                        {a}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Video Intro */}
            {step === 6 && (
              <div className="step-content">
                <h3>Step 6: Video Introduction</h3>
                <p className="text-secondary small mb-4">Record a short (30-60s) intro to build instant trust with companies.</p>

                <div className="recording-box">
                  {recordedVideoUrl ? (
                    <video src={recordedVideoUrl} controls className="video-playback" />
                  ) : (
                    <>
                      {isCameraActive ? (
                        <video ref={videoRef} autoPlay playsInline muted className="video-feed" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-white">
                          <div style={{ fontSize: '3rem' }}>🎥</div>
                          <button type="button" className="btn btn-secondary mt-4" onClick={startCamera}>Open Camera</button>
                        </div>
                      )}

                      {isRecording && (
                        <div className="recording-timer">
                          <div className="rec-pulse"></div>
                          <span>{new Date(recordingTime * 1000).toISOString().substr(14, 5)}</span>
                        </div>
                      )}

                      {isCameraActive && !isRecording && (
                        <div className="video-overlay">
                          <div className="rec-dot" style={{ backgroundColor: '#94a3b8' }}></div>
                          <span style={{ fontSize: '0.8rem' }}>READY</span>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="flex gap-4">
                  {recordedVideoUrl ? (
                    <>
                      <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => { setRecordedVideoUrl(null); startCamera(); }}>Retake Video</button>
                      <button type="button" className="btn btn-primary" style={{ flex: 1 }} onClick={() => nextStep()}>Keep & Finish</button>
                    </>
                  ) : (
                    <>
                      {isCameraActive && (
                        <button
                          type="button"
                          className={`btn ${isRecording ? 'btn-danger' : 'btn-secondary'}`}
                          style={{ flex: 1 }}
                          onClick={isRecording ? stopRecording : startRecording}
                        >
                          {isRecording ? 'Stop Recording' : 'Start Recording'}
                        </button>
                      )}
                      <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={stopCamera}>
                        {isCameraActive ? 'Cancel' : 'Skip Video'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            <div className="form-actions" style={{ marginTop: '2.5rem' }}>
              {step > 1 && <button type="button" className="btn btn-outline" onClick={prevStep}>Previous Step</button>}
              <button type="submit" className="btn btn-primary" style={{ padding: '0.8rem 2.5rem' }} disabled={isSubmitting}>
                {step === 6 ? (isSubmitting ? 'Finalizing...' : 'Submit Profile') : 'Save & Continue'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


function CompanyHome() {
  return (
    <div className="company-dashboard">
      <header className="hero" style={{ padding: '4rem 0' }}>
        <div className="container">
          <h1 style={{ fontSize: '3rem' }}>Empower Your Projects with Seasoned Expertise</h1>
          <p>Join hundreds of companies finding project-ready veterans for high-impact roles.</p>
          <div className="flex justify-center gap-4 mt-6">
            <button className="btn btn-secondary" style={{ padding: '0.8rem 1.5rem' }}>Post a New Project</button>
            <button className="btn btn-outline" style={{ color: 'white', borderColor: 'white', padding: '0.8rem 1.5rem' }}>Browse Experts</button>
          </div>
        </div>
      </header>

      <main className="container" style={{ padding: '4rem 1.5rem' }}>
        <div className="view-title">What RetirePro Does for You</div>
        <div className="feature-grid">
          <div className="feature-item">
            <div className="feature-icon-small">🔍</div>
            <h3>Verified Expertise</h3>
            <p>Access a curated pool of retired professionals with 20+ years of domain experience.</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon-small">🛡️</div>
            <h3>Secure Transactions</h3>
            <p>Escrow-based payments ensure you only pay when milestones are successfully met.</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon-small">⚡</div>
            <h3>Rapid Onboarding</h3>
            <p>From posting to hiring in as little as 48 hours with our streamlined verification.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

function CompanySignup() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: '', businessEmail: '', phone: '', website: '', address: '',
    cin: '', gstin: '', pan: '',
    ownerName: '', ownerId: '', otpEmail: '', otpPhone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Final submission to backend
    try {
      const response = await fetch(`${API_BASE}/api/companies/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        const data = await response.json();
        setError(data.error || 'Registration failed.');
      }
    } catch (err) {
      setError('Connection error. Please ensure the backend is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="container" style={{ padding: '4rem 0' }}>
        <div className="form-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
          <h2>Application Received!</h2>
          <p>Thank you, <strong>{formData.companyName}</strong>. Your legal documents and registration IDs are now under manual review.</p>
          <div style={{ backgroundColor: 'rgba(13, 71, 161, 0.1)', padding: '1rem', borderRadius: 'var(--radius-md)', margin: '1.5rem 0', border: '1px solid var(--border-color)' }}>
            <strong style={{ color: 'var(--text-primary)' }}>Status:</strong> <span style={{ color: 'var(--secondary-color)' }}>Pending Review</span>
          </div>
          <p className="text-secondary">We will notify you at {formData.businessEmail} once verified.</p>
          <button className="btn btn-primary mt-4" onClick={() => window.location.reload()}>Return to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '4rem 0' }}>
      <div className="signup-container">
        <div className="form-header">
          <h1 className="view-title">Company Registration</h1>
          <p>Complete these 4 steps to verify your business and start hiring.</p>
        </div>

        {/* Stepper */}
        <div className="stepper">
          <div className={`step ${step >= 1 ? 'completed' : ''} ${step === 1 ? 'active' : ''}`}>1</div>
          <div className={`step ${step >= 2 ? 'completed' : ''} ${step === 2 ? 'active' : ''}`}>2</div>
          <div className={`step ${step >= 3 ? 'completed' : ''} ${step === 3 ? 'active' : ''}`}>3</div>
          <div className={`step ${step >= 4 ? 'completed' : ''} ${step === 4 ? 'active' : ''}`}>4</div>
        </div>

        <div className="form-card">
          {error && <div className="validation-error" style={{ marginBottom: '1rem', textAlign: 'center', padding: '0.5rem', background: '#fee2e2' }}>{error}</div>}

          <form onSubmit={step === 4 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>

            {/* Step 1: Business Identity */}
            {step === 1 && (
              <div className="step-content">
                <h3>Step 1: Business Identity</h3>
                <div className="form-group">
                  <label className="form-label">Legal Company Name</label>
                  <input type="text" name="companyName" className="form-input" value={formData.companyName} onChange={handleChange} required />
                </div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Business Email</label>
                    <input type="email" name="businessEmail" className="form-input" value={formData.businessEmail} onChange={handleChange} required placeholder="hr@yourcompany.com" />
                    {!formData.businessEmail.includes('@') || formData.businessEmail.endsWith('gmail.com') || formData.businessEmail.endsWith('yahoo.com') ?
                      <p style={{ fontSize: '0.7rem', color: 'var(--secondary-color)' }}>⚠️ Work domain email is preferred for faster approval.</p> : null}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input type="tel" name="phone" className="form-input" value={formData.phone} onChange={handleChange} required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Website (Optional)</label>
                  <input type="url" name="website" className="form-input" value={formData.website} onChange={handleChange} placeholder="https://www.yourcompany.com" />
                </div>
                <div className="form-group">
                  <label className="form-label">Office Address</label>
                  <textarea name="address" className="form-input" value={formData.address} onChange={handleChange} required rows="3"></textarea>
                </div>
              </div>
            )}

            {/* Step 2: Legal Registrations */}
            {step === 2 && (
              <div className="step-content">
                <h3>Step 2: Legal Registrations (India)</h3>
                <p style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>These identifiers are required for legal verification via MCA/GST portals.</p>
                <div className="form-group">
                  <label className="form-label">CIN (Corporate Identification Number)</label>
                  <input type="text" name="cin" className="form-input" value={formData.cin} onChange={handleChange} required placeholder="e.g. U12345KA2023PTC123456" />
                </div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">GST Number (GSTIN)</label>
                    <input type="text" name="gstin" className="form-input" value={formData.gstin} onChange={handleChange} required placeholder="22AAAAA0000A1Z5" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Company PAN</label>
                    <input type="text" name="pan" className="form-input" value={formData.pan} onChange={handleChange} required placeholder="ABCDE1234F" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Document Upload */}
            {step === 3 && (
              <div className="step-content">
                <h3>Step 3: Business Documents</h3>
                <p style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>Upload proof of existence for manual review.</p>
                <div className="form-group">
                  <label className="form-label">Certificate of Incorporation</label>
                  <div className="file-upload">
                    <div>📁 COI_Upload.pdf</div>
                    <span style={{ fontSize: '0.7rem' }}>Click to change file</span>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">GST Certificate</label>
                  <div className="file-upload">
                    <div>📁 GST_Certificate.pdf</div>
                    <span style={{ fontSize: '0.7rem' }}>Click to change file</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Admin & OTP */}
            {step === 4 && (
              <div className="step-content">
                <h3>Step 4: Owner / Admin Verification</h3>
                <div className="form-group">
                  <label className="form-label">Full Name of Admin</label>
                  <input type="text" name="ownerName" className="form-input" value={formData.ownerName} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Owner/ID Proof (Aadhaar / Individual PAN)</label>
                  <input type="text" name="ownerId" className="form-input" value={formData.ownerId} onChange={handleChange} required placeholder="Enter ID number" />
                </div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Email OTP</label>
                    <div className="flex gap-2">
                      <input type="text" className="form-input" placeholder="000000" maxLength="6" />
                      <button type="button" className="btn btn-outline" style={{ fontSize: '0.7rem' }}>Send</button>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone OTP</label>
                    <div className="flex gap-2">
                      <input type="text" className="form-input" placeholder="000000" maxLength="6" />
                      <button type="button" className="btn btn-outline" style={{ fontSize: '0.7rem' }}>Send</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="form-actions" style={{ marginTop: '2rem' }}>
              {step > 1 && (
                <button type="button" className="btn btn-outline" onClick={prevStep}>Previous</button>
              )}
              {step < 4 ? (
                <button type="submit" className="btn btn-primary" style={{ padding: '0.8rem 2rem' }}>Save & Continue</button>
              ) : (
                <button type="submit" className="btn btn-secondary" style={{ padding: '0.8rem 2rem' }} disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Finish Registration'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


function RoleSelection({ onSelect }) {
  return (
    <div className="role-selection-overlay">
      <h1 className="role-selection-title">Who are you?</h1>
      <div className="role-grid">
        <div className="role-card" onClick={() => onSelect('Company')}>
          <div className="role-icon">🏢</div>
          <h3>Company</h3>
          <p>I am looking to hire seasoned experts for project leadership and mentoring.</p>
        </div>
        <div className="role-card" onClick={() => onSelect('Professional')}>
          <div className="role-icon">👴</div>
          <h3>Professional</h3>
          <p>I am a retired professional ready to contribute my skills and experience.</p>
        </div>
      </div>
    </div>
  );
}

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const userDropdownRef = useRef(null);
  const notifDropdownRef = useRef(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('rp_theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('rp_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  const [activeTab, setActiveTab] = useState('companies');
  const [userRole, setUserRole] = useState(null);
  const [activeView, setActiveView] = useState('home');
  const [parsedProfile, setParsedProfile] = useState(() => {
    const saved = localStorage.getItem('rp_parsed_profile');
    return saved ? JSON.parse(saved) : null;
  });

  // Expose global function for ChatBot to help users fill profile
  useEffect(() => {
    window.updateRetiredProProfile = (data) => {
      setParsedProfile(prev => {
        const newData = { ...prev, ...data };
        localStorage.setItem('rp_parsed_profile', JSON.stringify(newData));
        return newData;
      });
      // Also trigger a notification or view update
      if (activeView !== 'profile') setActiveView('profile');
    };
  }, [activeView]);

  // Notifications State
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'view', text: 'Metro Logistics viewed your profile', time: '2h ago', unread: true, icon: '🏢' },
    { id: 2, type: 'shortlist', text: 'You were shortlisted by Vantage Corp for Senior Advisor', time: '5h ago', unread: true, icon: '🎯' },
    { id: 3, type: 'interest', text: 'Google (Alphabet) showed interest in your resume', time: '1d ago', unread: false, icon: '⚡' },
    { id: 4, type: 'message', text: 'Someone from Microsoft wants to connect', time: '2d ago', unread: false, icon: '💬' },
  ]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target)) {
        setShowNotifDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  // ── Auth State ──────────────────────────────────────────────────────────────
  const [authData, setAuthData] = useState(() => {
    try {
      // Check both 'token' (requested by user) and 'rp_token' (legacy)
      const token = localStorage.getItem('token') || localStorage.getItem('rp_token');
      if (!token) return null;
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp && Date.now() / 1000 > payload.exp) {
        localStorage.removeItem('token');
        localStorage.removeItem('rp_token');
        return null;
      }
      return { token, user: payload };
    } catch {
      return null;
    }
  });

  // Keep state in sync with localStorage changes (e.g. after AuthSuccess)
  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('rp_token');
    if (token && !authData) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setAuthData({ token, user: payload });
      } catch (e) {
        console.error("Token sync error", e);
      }
    }
  }, [location.pathname, authData]);

  const handleAuthSuccess = (data) => {
    setAuthData(data);
    if (data.user.isNewUser) {
      setActiveView('onboarding');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('rp_token');
    setAuthData(null);
    setUserRole(null);
    setActiveView('home');
    navigate('/');
  };

  const handleDeleteAccount = async (password) => {
    try {
      const response = await fetch(`${API_BASE || 'http://localhost:5050'}/api/user`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authData.token}`
        },
        body: JSON.stringify({ password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete account. Please verify your password.');
      }

      // Success
      alert("Account deleted permanently. We're sorry to see you go.");
      handleLogout();
    } catch (error) {
      console.error("Deletion error:", error);
      throw error;
    }
  };

  const handleRoleSelect = (role) => {
    setUserRole(role);
  };

  const handleResetRole = () => {
    setUserRole(null);
    setActiveView('home');
  };

  // ── Protected View Selection ───────────────────────────────────────────────
  const renderMainContent = () => {
    if (!authData) {
      return <AuthPage onAuthSuccess={handleAuthSuccess} />;
    }

    if (!userRole) {
      return <RoleSelection onSelect={handleRoleSelect} />;
    }

    const { user } = authData;
    const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';

    return (
      <div className="app">
        {/* Navigation */}
        <nav className="navbar">
          <div className="container flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'var(--secondary-color)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '1.2rem'
              }}>RP</div>
              <div onClick={handleResetRole} style={{ cursor: 'pointer' }}>
                <span className="navbar-logo-text" style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary-color)' }}>RetirePro</span>
              </div>
            </div>
            <div className="nav-links flex gap-6 items-center">
              <div className="flex flex-col items-end">
                <span style={{ fontSize: '0.7rem', color: 'var(--secondary-color)', fontWeight: 'bold', textTransform: 'uppercase' }}>
                  {userRole} Mode
                </span>
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); handleResetRole(); }}
                  style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textDecoration: 'underline' }}
                >
                  Switch to {userRole === 'Company' ? 'Professional' : 'Company'}
                </a>
              </div>
              {userRole === 'Company' ? (
                <>
                  <a href="#" className={activeView === 'home' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveView('home'); }}>Home</a>
                  <a href="#" className={activeView === 'verification' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveView('verification'); }}>Verify Account</a>
                  <button className="btn btn-outline">Our Talent</button>
                </>
              ) : (
                <>
                  <a href="#" className={activeView === 'home' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveView('home'); }}>Find Jobs</a>
                  <a href="#" className={activeView === 'applications' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveView('applications'); }}>My Applications</a>
                </>
              )}

              {/* Notification Bell */}
              <div className="notif-container" ref={notifDropdownRef}>
                <div className={`bell-icon ${showNotifDropdown ? 'active' : ''}`} onClick={() => setShowNotifDropdown(!showNotifDropdown)}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.37 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.64 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" />
                  </svg>
                  {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
                </div>

                {showNotifDropdown && (
                  <div className="notif-dropdown">
                    <div className="notif-header">
                      <h4>Notifications</h4>
                      <button
                        className="btn btn-xs btn-outline"
                        onClick={(e) => { e.stopPropagation(); markAllRead(); }}
                        style={{ fontSize: '0.7rem' }}
                      >
                        Mark all as read
                      </button>
                    </div>
                    <div className="notif-list">
                      {notifications.length > 0 ? (
                        notifications.map(n => (
                          <div key={n.id} className={`notif-item ${n.unread ? 'unread' : ''}`}>
                            <div className="notif-icon">{n.icon}</div>
                            <div className="notif-content">
                              <div className="notif-text">{n.text}</div>
                              <div className="notif-time">{n.time}</div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="notif-empty">No new notifications</div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User avatar with dropdown */}
              <div className="user-nav-container" ref={userDropdownRef}>
                <div
                  className={`nav-user-avatar cursor-pointer ${showUserDropdown ? 'active' : ''}`}
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  title={user.name || user.email}
                >
                  {(parsedProfile?.avatar || user.avatar)
                    ? <img src={parsedProfile?.avatar || user.avatar} alt={user.name} referrerPolicy="no-referrer" />
                    : initials
                  }
                  {userRole === 'Professional' && !parsedProfile?.isVerified && (
                    <div style={{
                      position: 'absolute',
                      top: '0',
                      right: '0',
                      width: '10px',
                      height: '10px',
                      backgroundColor: 'var(--error-color)',
                      borderRadius: '50%',
                      border: '2px solid white'
                    }}></div>
                  )}
                </div>

                {showUserDropdown && (
                  <div className="user-dropdown">
                    <div className="dropdown-user-info">
                      <div className="dropdown-initials">
                        {(parsedProfile?.avatar || user.avatar)
                          ? <img src={parsedProfile?.avatar || user.avatar} alt={user.name} />
                          : initials
                        }
                      </div>
                      <div>
                        <div className="font-bold">{user.name || 'User'}</div>
                        <div className="tiny-label text-secondary">{user.email}</div>
                      </div>
                    </div>
                    <div className="dropdown-divider"></div>
                    <a href="#" className="dropdown-item" onClick={(e) => { e.preventDefault(); setActiveView('profile'); setShowUserDropdown(false); }}>
                      <span className="dropdown-icon">👤</span> My Profile
                    </a>
                    {userRole === 'Professional' && !parsedProfile?.isVerified && (
                      <a href="#" className="dropdown-item" style={{ color: 'var(--error-color)', backgroundColor: 'rgba(239, 68, 68, 0.1)' }} onClick={(e) => { e.preventDefault(); setActiveView('verification'); setShowUserDropdown(false); }}>
                        <span className="dropdown-icon">⚠️</span> Verify Expert Status
                      </a>
                    )}
                    <a href="#" className="dropdown-item" onClick={(e) => { e.preventDefault(); setActiveView('settings'); setShowUserDropdown(false); }}>
                      <span className="dropdown-icon">⚙️</span> Settings
                    </a>
                    <div className="dropdown-divider"></div>
                    <a href="#" className="dropdown-item logout" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
                      <span className="dropdown-icon">🚪</span> Logout
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Conditional Rendering for Both Roles */}
        {activeView === 'onboarding' ? (
          <OnboardingScreen
            user={authData.user}
            onComplete={(data) => {
              setParsedProfile(data);
              localStorage.setItem('rp_parsed_profile', JSON.stringify(data));
              setActiveView('profile');
            }}
            onSkip={() => setActiveView('home')}
          />
        ) : userRole === 'Company' ? (
          activeView === 'home' ? <CompanyHome /> :
            activeView === 'verification' ? <CompanySignup /> :
              activeView === 'settings' ? <SettingsPage user={authData.user} userRole={userRole} theme={theme} toggleTheme={toggleTheme} onBack={() => setActiveView('home')} onDeleteAccount={handleDeleteAccount} /> :
                <ProfilePage user={authData.user} userRole={userRole} profileData={parsedProfile} onBack={() => setActiveView('home')} onUpdateProfile={window.updateRetiredProProfile} onDeleteAccount={handleDeleteAccount} />
        ) : (
          activeView === 'home' ? <ProfessionalHome onNavigateToApplications={() => setActiveView('applications')} /> :
            activeView === 'applications' ? <AppliedJobs onBack={() => setActiveView('home')} /> :
              activeView === 'verification' ? <ProfessionalSignup /> :
                activeView === 'settings' ? <SettingsPage user={authData.user} userRole={userRole} theme={theme} toggleTheme={toggleTheme} onBack={() => setActiveView('home')} onDeleteAccount={handleDeleteAccount} /> :
                  <ProfilePage user={authData.user} userRole={userRole} profileData={parsedProfile} onBack={() => setActiveView('home')} onUpdateProfile={window.updateRetiredProProfile} onDeleteAccount={handleDeleteAccount} />
        )}

        {/* Footer */}
        <footer style={{ backgroundColor: 'var(--text-primary)', color: 'white', padding: '3rem 0', textAlign: 'center' }}>
          <p>&copy; 2026 RetirePro Inc. All rights reserved.</p>
        </footer>

        {/* AI Chatbot Widget */}
        <ChatBot
          systemPrompt={`You are the lead assistant for RetiredPro. You can help users set up their profiles. 
          If a user needs help filling their details based on their resume or conversation, you can use the function: 
          window.updateRetiredProProfile({ name, industry, years_of_experience, bio, skills, location, ex_designation }) 
          to help them. Only use this when they explicitly ask or when you've helped them refine their details.
          BE VERY CAREFUL: Only output a code block with 'execute' when you are sure you want to update the UI.`}
          botName="RetiredPro Assistant"
          primaryColor="#4f46e5"
          puterModel="claude-sonnet-4-6"
          requireConfirmation={false}
          codeContext=""
        />

      </div>
    );
  };

  return (
    <>
      <Routes>
        <Route path="/auth-success" element={<AuthSuccess />} />
        <Route path="*" element={renderMainContent()} />
      </Routes>

      {/* Persistent Global Datalists for throughout the app suggestions */}
      <datalist id="degree-list">
        {DEGREES.map(d => <option key={d} value={d} />)}
      </datalist>
      <datalist id="university-list">
        {UNIVERSITIES.map(u => <option key={u} value={u} />)}
      </datalist>
      <datalist id="designation-list">
        {SENIOR_DESIGNATIONS.map(d => <option key={d} value={d} />)}
      </datalist>
      <datalist id="company-list">
        {MAJOR_COMPANIES.map(c => <option key={c} value={c} />)}
      </datalist>
      <datalist id="industry-list">
        {INDUSTRIES.map(i => <option key={i} value={i} />)}
      </datalist>
    </>
  );
}

export default App;


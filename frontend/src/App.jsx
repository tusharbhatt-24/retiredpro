import { useState, useRef, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './index.css';

// ─── Onboarding Component ──────────────────────────────────────────────────
function OnboardingScreen({ user, onComplete, onSkip }) {
  const [isParsing, setIsParsing] = useState(false);
  const [parsingProgress, setParsingProgress] = useState(0);
  const [isReviewing, setIsReviewing] = useState(false);
  const [editData, setEditData] = useState(null);
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
            age: 55,
            dob: '1969-01-01',
            industry: 'Management & Operations',
            years_of_experience: '25+ Years',
            expertise: 'Leadership, Strategic Planning, Financial Analysis',
            skills: 'Operations, Budgeting, Team Building',
            bio: 'Experienced professional with a proven track record of success in leading large teams and managing complex projects.',
            location: 'Mumbai, India',
            ex_company: 'Current/Previous Global Corp',
            ex_designation: 'Senior Executive'
          });
        }, 800);
      }
    }, 150);
  };

  if (isReviewing) {
    return (
      <div className="onboarding-container animate-fade-in">
        <div className="onboarding-card" style={{ textAlign: 'left', maxWidth: '700px' }}>
          <div className="flex justify-between items-center mb-4">
            <h2 style={{ margin: 0 }}>Confirm Your Details</h2>
            <span className="badge badge-success">Extraction Complete ⚡</span>
          </div>
          <p className="text-secondary mb-8">We've pre-filled your profile using your resume. **Does this look correct?** You can edit any field below before finalizing.</p>
          
          <div className="review-grid">
            <div className="form-group">
              <label className="small font-bold text-primary">Full Name</label>
              <input type="text" className="form-control" value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} placeholder="e.g. John Doe" />
            </div>

            <div className="flex gap-4">
              <div className="form-group flex-1">
                <label className="small font-bold text-primary">Years of Experience</label>
                <input type="text" className="form-control" value={editData.years_of_experience} onChange={e => setEditData({...editData, years_of_experience: e.target.value})} placeholder="e.g. 25+ Years" />
              </div>
              <div className="form-group flex-1">
                <label className="small font-bold text-primary">Industry Focus</label>
                <input type="text" className="form-control" value={editData.industry} onChange={e => setEditData({...editData, industry: e.target.value})} placeholder="e.g. Manufacturing" />
              </div>
            </div>

            <div className="form-group">
              <label className="small font-bold text-primary">Target Designation / Expertise</label>
              <input type="text" className="form-control" value={editData.ex_designation} onChange={e => setEditData({...editData, ex_designation: e.target.value})} placeholder="e.g. Senior Logistics Advisor" />
            </div>

            <div className="form-group">
              <label className="small font-bold text-primary">Professional Summary</label>
              <textarea className="form-control" rows="4" value={editData.bio} onChange={e => setEditData({...editData, bio: e.target.value})} placeholder="A brief summary of your career..." />
            </div>

            <div className="form-group">
              <label className="small font-bold text-primary">Key Skills (comma separated)</label>
              <input type="text" className="form-control" value={typeof editData.skills === 'string' ? editData.skills : editData.skills.join(', ')} onChange={e => setEditData({...editData, skills: e.target.value})} placeholder="e.g. Leadership, Strategy, Operations" />
            </div>
          </div>
          
          <div className="flex gap-4 mt-8">
            <button 
              className="btn btn-primary flex-1 py-4" 
              onClick={() => {
                const skillsArray = typeof editData.skills === 'string' 
                  ? editData.skills.split(',').map(s => s.trim()).filter(s => s !== '')
                  : editData.skills;
                onComplete({ ...editData, skills: skillsArray });
              }}
              style={{ fontSize: '1.1rem' }}
            >
              Correct & Continue to My Profile
            </button>
            <button className="btn btn-outline" onClick={onSkip}>Skip & Set Up Later</button>
          </div>
        </div>
        <style jsx="true">{`
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
          <div className="step-badge">Welcome, {user.name.split(' ')[0]}!</div>
          <h2>Let's build your expert profile</h2>
          <p>Quickly populate your profile by uploading your resume, or start from scratch.</p>
        </div>

        <div className="onboarding-options">
          <div className="option-card upload" onClick={!isParsing ? handleResumeClick : undefined}>
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept=".pdf,.doc,.docx" 
              onChange={handleFileChange}
            />
            {isParsing ? (
              <div className="parsing-loader">
                <div className="spinner"></div>
                <h4>Analyzing Resume...</h4>
                <div className="progress-bar-bg mt-4" style={{ width: '100%' }}>
                  <div className="progress-bar-fill" style={{ width: `${parsingProgress}%` }}></div>
                </div>
                <p className="small text-secondary mt-2">Extracting expertise, years, and skills...</p>
              </div>
            ) : (
              <>
                <div className="option-icon">📄</div>
                <h3>Upload Resume</h3>
                <p>We'll use AI to extract your career milestones and skills.</p>
                <button className="btn btn-primary mt-4">Select PDF/DOCX</button>
              </>
            )}
          </div>

          <div className="option-card skip" onClick={onSkip}>
            <div className="option-icon">✍️</div>
            <h3>Skip for Now</h3>
            <p>You can manually fill in your details later in your profile.</p>
            <button className="btn btn-outline mt-4">Start Manually</button>
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
          background-color: #f8fafc;
        }
        .onboarding-card {
          background: white;
          padding: 3rem;
          border-radius: 24px;
          box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
          max-width: 900px;
          width: 100%;
          text-align: center;
        }
        .step-badge {
          background: #eff6ff;
          color: #2563eb;
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
          border: 2px solid #f1f5f9;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
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
      `}</style>
    </div>
  );
}

import ChatBot from './chatbot/ChatBot';
import AuthPage from './AuthPage';
import AuthSuccess from './pages/AuthSuccess';
import ProfilePage from './pages/ProfilePage';

function ProfessionalHome() {
  return (
    <div className="professional-dashboard">
      <div className="pro-banner">
        <div className="container">
          <div className="flex justify-between items-end">
            <div>
              <div className="expert-badge">🎖️ Senior Expert & Mentor</div>
              <h1 style={{ marginTop: '0.5rem' }}>Welcome Back, Expert</h1>
              <p>Your 25+ years of experience is in high demand.</p>
            </div>
            <div className="stat-value" style={{ color: 'white' }}>$4,250.00 <span style={{ fontSize: '1rem', fontWeight: 'normal' }}>Earned</span></div>
          </div>
        </div>
      </div>

      <main className="container">
        <div className="dashboard-stats">
          <div className="stat-card">
            <span className="stat-value">12</span>
            <span className="stat-label">Applications</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">3</span>
            <span className="stat-label">Active Projects</span>
          </div>
          <div className="stat-card" style={{ borderTopColor: 'var(--secondary-color)' }}>
            <span className="stat-value">Verified</span>
            <span className="stat-label">Status</span>
          </div>
        </div>

        <div className="section-header flex justify-between items-center mb-6">
          <h2 className="view-title">Recommended for Your Expertise</h2>
          <btn className="btn btn-outline">View All Jobs</btn>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          {[
            { title: "Supply Chain Advisor", company: "Metro Logistics", pay: "$150/hr", tags: ["Logistics", "Strategy"] },
            { title: "Interim HR Director", company: "Vantage Corp", pay: "$200/hr", tags: ["HR", "Change Management"] }
          ].map((job, idx) => (
            <div key={idx} className="job-card">
              <div className="flex justify-between">
                <h3 style={{ margin: 0 }}>{job.title}</h3>
                <span style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>{job.pay}</span>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{job.company}</p>
              <div className="flex gap-2">
                {job.tags.map(tag => <span key={tag} className="job-tag">{tag}</span>)}
              </div>
              <button className="btn btn-primary" style={{ width: '100%', marginTop: 'auto' }}>Apply Now</button>
            </div>
          ))}
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
          {[1,2,3,4,5,6].map(i => (
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
                        <button type="button" className="btn btn-primary" onClick={() => { setFormData({...formData, selfie: tempSelfie}); setTempSelfie(null); }}>Yes, Confirm</button>
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
                    <div className="verified-file-badge">
                      <span className="badge badge-success">✓ {resumeName} Analyzed</span>
                      <button type="button" className="btn-link" onClick={() => setFormData({...formData, resume: null})}>Change</button>
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
                      <div key={opt} className={`choice-box ${formData.consultingExp === opt ? 'active' : ''}`} onClick={() => setFormData({...formData, consultingExp: opt})}>
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
                      <div key={m} className={`choice-box ${formData.workMode === m ? 'active' : ''}`} onClick={() => setFormData({...formData, workMode: m})}>
                        {m}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Availability Type</label>
                  <div className="choice-grid">
                    {['Full-time', 'Part-time', 'Consulting'].map(a => (
                      <div key={a} className={`choice-box ${formData.availability === a ? 'active' : ''}`} onClick={() => setFormData({...formData, availability: a})}>
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
                          <div style={{fontSize: '3rem'}}>🎥</div>
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
                          <div className="rec-dot" style={{backgroundColor: '#94a3b8'}}></div>
                          <span style={{fontSize: '0.8rem'}}>READY</span>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="flex gap-4">
                  {recordedVideoUrl ? (
                    <>
                      <button type="button" className="btn btn-outline" style={{flex: 1}} onClick={() => { setRecordedVideoUrl(null); startCamera(); }}>Retake Video</button>
                      <button type="button" className="btn btn-primary" style={{flex: 1}} onClick={() => nextStep()}>Keep & Finish</button>
                    </>
                  ) : (
                    <>
                      {isCameraActive && (
                        <button 
                          type="button" 
                          className={`btn ${isRecording ? 'btn-danger' : 'btn-secondary'}`} 
                          style={{flex: 1}} 
                          onClick={isRecording ? stopRecording : startRecording}
                        >
                          {isRecording ? 'Stop Recording' : 'Start Recording'}
                        </button>
                      )}
                      <button type="button" className="btn btn-outline" style={{flex: 1}} onClick={stopCamera}>
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
          <div style={{ backgroundColor: '#f0f9ff', padding: '1rem', borderRadius: 'var(--radius-md)', margin: '1.5rem 0' }}>
            <strong>Status:</strong> <span style={{ color: 'var(--secondary-color)' }}>Pending Review</span>
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
  const [activeTab, setActiveTab] = useState('companies');
  const [userRole, setUserRole] = useState(null);
  const [activeView, setActiveView] = useState('home');
  const [parsedProfile, setParsedProfile] = useState(() => {
    const saved = localStorage.getItem('rp_parsed_profile');
    return saved ? JSON.parse(saved) : null;
  });

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

  const handleRoleSelect = (role) => {
    setUserRole(role);
    // If it's a professional, and no parsed profile yet, show onboarding
    if (role === 'Professional' && !parsedProfile) {
      setActiveView('onboarding');
    }
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
                <h2 style={{ marginBottom: 0, color: 'var(--primary-color)' }}>RetirePro</h2>
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
                  <a href="#" onClick={(e) => { e.preventDefault(); setActiveView('home'); }}>Home</a>
                  <a href="#" onClick={(e) => { e.preventDefault(); setActiveView('verification'); }}>Verify Account</a>
                  <button className="btn btn-outline" style={{ marginRight: '0.5rem' }}>Our Talent</button>
                  <button className="btn btn-primary" onClick={() => setActiveView('profile')}>My Profile</button>
                </>
              ) : (
                <>
                  <a href="#" onClick={(e) => { e.preventDefault(); setActiveView('home'); }}>Find Jobs</a>
                  <a href="#" onClick={(e) => { e.preventDefault(); setActiveView('verification'); }}>Verify Expert Status</a>
                  <button className="btn btn-primary" onClick={() => setActiveView('profile')}>My Profile</button>
                </>
              )}

              {/* User avatar + logout */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div className="nav-user-avatar" title={user.name || user.email}>
                  {user.avatar
                    ? <img src={user.avatar} alt={user.name} referrerPolicy="no-referrer" />
                    : initials
                  }
                </div>
                <button
                  onClick={handleLogout}
                  style={{
                    background: 'none', border: '1px solid #e2e8f0', borderRadius: '8px',
                    padding: '0.3rem 0.7rem', fontSize: '0.72rem', cursor: 'pointer',
                    color: 'var(--text-secondary)', fontWeight: '600'
                  }}
                  title="Logout"
                >
                  Logout
                </button>
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
          <ProfilePage user={authData.user} userRole={userRole} profileData={parsedProfile} onBack={() => setActiveView('home')} />
        ) : (
          activeView === 'home' ? <ProfessionalHome /> : 
          activeView === 'verification' ? <ProfessionalSignup /> :
          <ProfilePage user={authData.user} userRole={userRole} profileData={parsedProfile} onBack={() => setActiveView('home')} />
        )}

        {/* Footer */}
        <footer style={{ backgroundColor: 'var(--text-primary)', color: 'white', padding: '3rem 0', textAlign: 'center' }}>
          <p>&copy; 2026 RetirePro Inc. All rights reserved.</p>
        </footer>

        {/* AI Chatbot Widget */}
        <ChatBot
          systemPrompt="You are the official support assistant for RetiredPro — a platform that connects retired professionals with companies seeking expert guidance. Help users navigate their verification steps, understand platform features, and resolve common issues. Always be brief, professional, and to the point."
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
    <Routes>
      <Route path="/auth-success" element={<AuthSuccess />} />
      <Route path="*" element={renderMainContent()} />
    </Routes>
  );
}

export default App;


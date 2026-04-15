import { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_URL;

export default function AuthPage({ onAuthSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(''); // 'google' | 'linkedin' | ''

  // ── Handle token coming back from OAuth redirect ─────────────────────────────
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const err = params.get('error');

    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('rp_token', token);
      // Decode user info from token payload (no verify needed here, server verifies)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        onAuthSuccess({ token, user: payload });
      } catch {
        setError('Invalid token received. Please try again.');
      }
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    }

    if (err) {
      const messages = {
        google_not_configured: 'Google login is not configured yet. Please use email.',
        google_failed: 'Google login failed. Please try again.',
        linkedin_not_configured: 'LinkedIn login is not configured yet. Please use email.',
        linkedin_failed: 'LinkedIn login failed. Please try again.',
        oauth_failed: 'OAuth login failed. Please try again.',
      };
      setError(messages[err] || 'Authentication failed.');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const handleOAuth = (provider) => {
    setOauthLoading(provider);
    window.location.href = `${API_BASE}/api/auth/${provider}`;
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Mock email auth — replace with real endpoint when ready
      await new Promise(r => setTimeout(r, 800));
      if (mode === 'login' && (email === '' || password === '')) {
        throw new Error('Please fill in all fields.');
      }
      // Create a mock user for now
      const mockUser = { id: 'email_user', name: name || email.split('@')[0], email, provider: 'email' };
      const mockToken = btoa(JSON.stringify({ header: 'mock' })) + '.' + btoa(JSON.stringify(mockUser)) + '.mock_sig';
      localStorage.setItem('token', mockToken);
      localStorage.setItem('rp_token', mockToken);
      onAuthSuccess({ token: mockToken, user: mockUser });
    } catch (err) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Animated Background */}
      <div className="auth-bg">
        <div className="auth-bg-orb auth-bg-orb-1" />
        <div className="auth-bg-orb auth-bg-orb-2" />
        <div className="auth-bg-orb auth-bg-orb-3" />
      </div>

      <div className="auth-split">
        {/* ── Left Panel: Branding ──────────────────────────────────────────── */}
        <div className="auth-left">
          <div className="auth-brand">
            <div className="auth-logo">RP</div>
            <h1 className="auth-brand-name">RetirePro</h1>
          </div>
          <div className="auth-tagline">
            <h2>Where Decades of Experience<br />Meet Tomorrow's Opportunities</h2>
            <p>Connect retired professionals with companies that need real expertise — not just resumes.</p>
          </div>
          <div className="auth-stats-row">
            <div className="auth-stat">
              <span className="auth-stat-num">12K+</span>
              <span className="auth-stat-label">Verified Experts</span>
            </div>
            <div className="auth-stat">
              <span className="auth-stat-num">3.2K</span>
              <span className="auth-stat-label">Partner Companies</span>
            </div>
            <div className="auth-stat">
              <span className="auth-stat-num">98%</span>
              <span className="auth-stat-label">Success Rate</span>
            </div>
          </div>
        </div>

        {/* ── Right Panel: Auth Form ────────────────────────────────────────── */}
        <div className="auth-right">
          <div className="auth-card">
            {/* Tab Toggle */}
            <div className="auth-tabs">
              <button
                className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
                onClick={() => { setMode('login'); setError(''); }}
              >
                Sign In
              </button>
              <button
                className={`auth-tab ${mode === 'signup' ? 'active' : ''}`}
                onClick={() => { setMode('signup'); setError(''); }}
              >
                Create Account
              </button>
            </div>

            <div className="auth-card-body">
              <h3 className="auth-heading">
                {mode === 'login' ? 'Welcome back 👋' : 'Join RetirePro 🚀'}
              </h3>
              <p className="auth-subheading">
                {mode === 'login'
                  ? 'Sign in to access your dashboard'
                  : 'Create your account in seconds'}
              </p>

              {/* Error Message */}
              {error && (
                <div className="auth-error">
                  <span>⚠️</span> {error}
                </div>
              )}

              {/* ── OAuth Buttons ─────────────────────────────────────────── */}
              <div className="oauth-buttons">
                <a
                  href={`${API_BASE}/auth/google`}
                  className="oauth-btn oauth-btn-google"
                  style={{ textDecoration: 'none' }}
                  id="btn-google-oauth"
                >
                  <svg className="oauth-icon" viewBox="0 0 24 24" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.61z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span>Continue with Google</span>
                </a>

                <a
                  href={`${API_BASE}/auth/linkedin`}
                  className="oauth-btn oauth-btn-linkedin"
                  style={{ textDecoration: 'none' }}
                  id="btn-linkedin-oauth"
                >
                  <svg className="oauth-icon" viewBox="0 0 24 24" fill="#0A66C2">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  <span>Continue with LinkedIn</span>
                </a>
              </div>

              {/* Divider */}
              <div className="auth-divider">
                <span>── or ──</span>
              </div>

              {/* Development Bypass */}
              <button
                type="button"
                className="auth-submit-btn"
                style={{ 
                  backgroundColor: '#f8fafc', 
                  color: '#475569', 
                  border: '1px dashed #cbd5e1',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
                onClick={() => {
                  const mockUser = { 
                    id: 'mock_user_123', 
                    name: 'Tushar Bhatt', 
                    email: 'tushar@example.com', 
                    provider: 'mock',
                    isNewUser: false 
                  };
                  const mockToken = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' })) + '.' + btoa(JSON.stringify(mockUser)) + '.mock_signature';
                  localStorage.setItem('token', mockToken);
                  localStorage.setItem('rp_token', mockToken);
                  onAuthSuccess({ token: mockToken, user: mockUser });
                }}
                id="dev-bypass-login"
              >
                <span>⚡</span> Bypass Auth (Dev Mode)
              </button>

              {/* ── Email Form ────────────────────────────────────────────── */}
              <form onSubmit={handleEmailAuth} className="auth-form">
                {mode === 'signup' && (
                  <div className="auth-field">
                    <label>Full Name</label>
                    <input
                      type="text"
                      placeholder="John Smith"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                      id="auth-name-input"
                    />
                  </div>
                )}
                <div className="auth-field">
                  <label>Email Address</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    id="auth-email-input"
                  />
                </div>
                <div className="auth-field">
                  <label>
                    Password
                    {mode === 'login' && (
                      <a href="#" className="auth-forgot">Forgot password?</a>
                    )}
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    id="auth-password-input"
                  />
                </div>

                <button
                  type="submit"
                  className="auth-submit-btn"
                  disabled={loading}
                  id="auth-submit-btn"
                >
                  {loading ? (
                    <><span className="oauth-spinner" /> Processing...</>
                  ) : (
                    mode === 'login' ? 'Sign In →' : 'Create Account →'
                  )}
                </button>
              </form>

              <p className="auth-switch">
                {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <button
                  className="auth-switch-btn"
                  onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}
                >
                  {mode === 'login' ? 'Sign Up' : 'Sign In'}
                </button>
              </p>

              <p className="auth-terms">
                By continuing, you agree to RetirePro's{' '}
                <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

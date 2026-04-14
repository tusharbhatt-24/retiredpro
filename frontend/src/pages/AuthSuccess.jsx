import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function AuthSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('rp_token', token); // For compatibility with my previous implementation
      
      // Simulate checking if dashboard exists, redirect to dashboard or home
      // In this app, App.jsx handles the dashboard view based on userRole
      // So we redirect home and App.jsx will take over
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } else {
      navigate('/login');
    }
  }, [location, navigate]);

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0d1b3e 0%, #0d47a1 100%)',
      color: 'white',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div className="oauth-spinner" style={{ width: '40px', height: '40px', marginBottom: '1rem' }}></div>
      <h2>Logging you in...</h2>
      <p style={{ opacity: 0.7 }}>Securely connecting your account</p>
    </div>
  );
}

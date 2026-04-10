import { useState } from 'react';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('companies');

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
            <h2 style={{ marginBottom: 0, color: 'var(--primary-color)' }}>RetirePro</h2>
          </div>
          <div className="nav-links flex gap-6 items-center">
            <a href="#">How it Works</a>
            <a href="#">Find Experts</a>
            <a href="#">For Professionals</a>
            <button className="btn btn-outline">Log in</button>
            <button className="btn btn-primary">Sign up</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <div className="container">
          <h1 style={{ fontSize: '3rem', maxWidth: '800px', margin: '0 auto 1rem auto' }}>
            Transform Experience into Impact
          </h1>
          <p>
            Connect with verified retired professionals for short-term project leadership, mentoring, and corporate events.
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <button className="btn btn-secondary" style={{ padding: '0.8rem 1.5rem', fontSize: '1rem' }}>Post a Project</button>
            <button className="btn btn-outline" style={{ color: 'white', borderColor: 'white', padding: '0.8rem 1.5rem', fontSize: '1rem' }}>Apply as Expert</button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container" style={{ padding: '4rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2>How RetirePro Works</h2>
          <p style={{ maxWidth: '600px', margin: '0 auto' }}>A seamless platform bridging the gap between companies needing seasoned expertise, and retired professionals ready to contribute.</p>
        </div>

        <div className="flex justify-center gap-4" style={{ marginBottom: '2rem' }}>
          <button 
            className={`btn ${activeTab === 'companies' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('companies')}
          >
            For Companies
          </button>
          <button 
            className={`btn ${activeTab === 'professionals' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('professionals')}
          >
            For Professionals
          </button>
        </div>

        {activeTab === 'companies' && (
          <div className="grid grid-cols-3 gap-6">
            <div className="card">
              <h3>1. Post Needs</h3>
              <p>Define your project, required domain expertise, and budget.</p>
            </div>
            <div className="card">
              <h3>2. Interview & Hire</h3>
              <p>Filter verified veterans, conduct in-app interviews, and sign digital contracts.</p>
            </div>
            <div className="card">
              <h3>3. Secure Escrow</h3>
              <p>Funds are held securely and released only when milestones are met.</p>
            </div>
          </div>
        )}

        {activeTab === 'professionals' && (
          <div className="grid grid-cols-3 gap-6">
            <div className="card">
              <h3>1. Get Verified</h3>
              <p>Upload your retirement and experience letters to get the Verified Expert badge.</p>
            </div>
            <div className="card">
              <h3>2. Choose Projects</h3>
              <p>Browse relevant assignments or receive direct invitations from companies.</p>
            </div>
            <div className="card">
              <h3>3. Deliver & Earn</h3>
              <p>Provide your expertise, update milestones, and get paid seamlessly.</p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: 'var(--text-primary)', color: 'white', padding: '3rem 0', textAlign: 'center' }}>
        <p>&copy; 2026 RetirePro Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;

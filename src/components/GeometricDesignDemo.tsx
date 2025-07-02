import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const GeometricDesignDemo: React.FC = () => {
  const navigate = useNavigate();

  const handleJoinProject = () => {
    navigate('/project/quantumchain-protocol');
  };

  return (
    <div style={{ 
      padding: '4rem 2rem', 
      background: '#0a0a0f',
      minHeight: '100vh'
    }}>
      <div className="container">
        <h1 style={{ 
          fontSize: '3rem', 
          marginBottom: '3rem', 
          textAlign: 'center',
          color: '#fff' 
        }}>
          Geometric Design System Demo
        </h1>

        {/* Buttons Section */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#fff' }}>Buttons</h2>
          
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <button className="geo-btn geo-btn-primary">
              Primary Button
            </button>
            
            <button className="geo-btn">
              Secondary Button
            </button>
            
            <button className="btn btn-primary">
              Updated Primary
            </button>
            
            <button className="btn btn-secondary">
              Updated Secondary
            </button>
          </div>
        </section>

        {/* Boxes Section */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#fff' }}>Boxes</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div className="geo-box">
              <h3 style={{ marginBottom: '1rem' }}>Geometric Box</h3>
              <p style={{ color: '#a1a1aa' }}>
                This is a geometric box with angled corners and gradient borders.
              </p>
            </div>

            <div className="geo-card">
              <h3 style={{ marginBottom: '1rem' }}>Geometric Card</h3>
              <p style={{ color: '#a1a1aa' }}>
                A more prominent card with enhanced hover effects.
              </p>
            </div>

            <div className="card">
              <h3 style={{ marginBottom: '1rem' }}>Updated Card</h3>
              <p style={{ color: '#a1a1aa' }}>
                Existing card class with new geometric styling.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#fff' }}>Stats</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
            <div className="geo-stat">
              <div className="geo-stat-value">9.8x</div>
              <div className="geo-stat-label">ATH AVG ROI</div>
            </div>

            <div className="geo-stat">
              <div className="geo-stat-value">$4.1M+</div>
              <div className="geo-stat-label">Total Raised</div>
            </div>

            <div className="geo-stat">
              <div className="geo-stat-value">156</div>
              <div className="geo-stat-label">Projects</div>
            </div>

            <div className="geo-stat">
              <div className="geo-stat-value">97%</div>
              <div className="geo-stat-label">Success Rate</div>
            </div>
          </div>
        </section>

        {/* Badges Section */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#fff' }}>Badges</h2>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <span className="geo-badge"style={{display: 'table'}}>Live</span>
            <span className="geo-badge">UPCOMING</span>
            <span className="geo-badge">COMPLETED</span>
            <span className="status-badge status-live">STATUS LIVE</span>
            <span className="status-badge status-upcoming">UPCOMING</span>
          </div>
        </section>

        {/* Project Card Example */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#fff' }}>Project Card</h2>
          
          <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <motion.div 
              className="project-card-enhanced"
              whileHover={{ scale: 1.02 }}
            >
              <div className="project-header-enhanced">
                <div className="project-info-enhanced">
                  <h3 className="project-name-enhanced">QuantumChain Protocol</h3>
                  <div className="project-meta-enhanced">
                    <span className="project-symbol-enhanced">QCP</span>
                    <span className="project-category">DeFi Infrastructure</span>
                  </div>
                </div>
                <div className="project-status-enhanced live">
                  <span className="status-indicator-dot"></span>
                  LIVE
                </div>
              </div>

              <div className="progress-section-enhanced">
                <div className="progress-info-enhanced">
                  <span>Progress</span>
                  <span className="progress-percent-enhanced">87%</span>
                </div>
                <div className="progress-bar-enhanced">
                  <motion.div 
                    className="progress-fill-enhanced"
                    initial={{ width: 0 }}
                    animate={{ width: '87%' }}
                    transition={{ duration: 2 }}
                  />
                </div>
              </div>

              <div className="project-details-enhanced">
                <div className="detail-row">
                  <div className="detail-item-enhanced">
                    <span className="detail-label-enhanced">Raised</span>
                    <span className="detail-value-enhanced success">$4.8M</span>
                  </div>
                  <div className="detail-item-enhanced">
                    <span className="detail-label-enhanced">Target</span>
                    <span className="detail-value-enhanced">$5.5M</span>
                  </div>
                </div>
              </div>

              <button className="project-action-enhanced" onClick={handleJoinProject}>
                <span className="action-icon">⚡</span>
                <span className="action-text">JOIN</span>
              </button>
            </motion.div>
          </div>
        </section>

        {/* Input Example */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#fff' }}>Forms</h2>
          
          <div style={{ maxWidth: '400px' }}>
            <div className="geo-input-wrapper" style={{ marginBottom: '1rem' }}>
              <input 
                type="text" 
                className="geo-input" 
                placeholder="Enter amount"
              />
            </div>
            
            <button className="geo-btn geo-btn-primary" style={{ width: '100%' }}>
              Submit
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default GeometricDesignDemo; 
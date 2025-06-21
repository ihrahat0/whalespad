import React from 'react';
import { motion } from 'framer-motion';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="legal-page">
      <Navigation />
      
      {/* Hero Section */}
      <div className="legal-hero">
        <div className="legal-bg-effects">
          <div className="bg-gradient-orb bg-orb-1"></div>
          <div className="bg-gradient-orb bg-orb-2"></div>
          <div className="bg-grid-pattern"></div>
        </div>
        
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="legal-hero-content"
          >
            <h1 className="legal-title">Privacy Policy</h1>
            <p className="legal-subtitle">Last updated: December 2024</p>
            <div className="legal-badge">
              <span className="badge-icon">🔒</span>
              <span>Your Privacy & Data Protection</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content Section */}
      <div className="legal-content">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="legal-card"
          >
            <div className="legal-section">
              <h2>1. Introduction</h2>
              <p>
                WhalesPad is committed to protecting your privacy and personal data. 
                This Privacy Policy explains how we collect, use, and safeguard your information 
                when you use our decentralized launchpad platform.
              </p>
            </div>

            <div className="legal-section">
              <h2>2. Information We Collect</h2>
              <ul className="legal-list">
                <li>Wallet addresses and blockchain transaction data</li>
                <li>Usage analytics and platform interaction data</li>
                <li>Communication data from support and community interactions</li>
                <li>Device and browser information for security purposes</li>
              </ul>
            </div>

            <div className="legal-section">
              <h2>3. How We Use Your Information</h2>
              <p>We use collected information to:</p>
              <ul className="legal-list">
                <li>Process IDO participation and token allocations</li>
                <li>Improve platform functionality and user experience</li>
                <li>Provide customer support and communication</li>
                <li>Ensure security and prevent fraudulent activities</li>
                <li>Comply with legal and regulatory requirements</li>
              </ul>
            </div>

            <div className="legal-section">
              <h2>4. Data Protection</h2>
              <p>
                We implement industry-standard security measures including encryption, 
                access controls, and regular security audits to protect your data.
              </p>
            </div>

            <div className="legal-section">
              <h2>5. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="legal-list">
                <li>Access your personal data</li>
                <li>Request data correction or deletion</li>
                <li>Object to data processing</li>
                <li>Data portability where applicable</li>
              </ul>
            </div>

            <div className="legal-section">
              <h2>6. Contact Us</h2>
              <div className="contact-info">
                <p>📧 Email: privacy@whalespad.com</p>
                <p>💬 Telegram: @WhalesPadSupport</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy; 
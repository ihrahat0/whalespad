import React from 'react';
import { motion } from 'framer-motion';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const CookiePolicy: React.FC = () => {
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
            <h1 className="legal-title">Cookie Policy</h1>
            <p className="legal-subtitle">Last updated: December 2024</p>
            <div className="legal-badge">
              <span className="badge-icon">🍪</span>
              <span>Cookies & Tracking Technologies</span>
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
              <h2>1. What Are Cookies</h2>
              <p>
                Cookies are small text files that are stored on your device (computer, tablet, or mobile) 
                when you visit a website. They help websites remember your preferences and improve your 
                browsing experience. WhalesPad uses cookies and similar tracking technologies to enhance 
                platform functionality and analyze usage patterns.
              </p>
            </div>

            <div className="legal-section">
              <h2>2. Types of Cookies We Use</h2>
              
              <div className="legal-subsection">
                <h3>2.1 Essential Cookies</h3>
                <p>
                  These cookies are necessary for the platform to function properly and cannot be disabled:
                </p>
                <ul className="legal-list">
                  <li><strong>Authentication:</strong> Remember your wallet connection status</li>
                  <li><strong>Security:</strong> Protect against cross-site request forgery attacks</li>
                  <li><strong>Session Management:</strong> Maintain your session across page visits</li>
                  <li><strong>Load Balancing:</strong> Distribute traffic across our servers</li>
                </ul>
              </div>

              <div className="legal-subsection">
                <h3>2.2 Functional Cookies</h3>
                <p>
                  These cookies enhance your experience by remembering your preferences:
                </p>
                <ul className="legal-list">
                  <li><strong>Language Settings:</strong> Remember your preferred language</li>
                  <li><strong>Theme Preferences:</strong> Save your dark/light mode choice</li>
                  <li><strong>Wallet Preferences:</strong> Remember your preferred wallet provider</li>
                  <li><strong>Display Settings:</strong> Save your customized dashboard layout</li>
                </ul>
              </div>

              <div className="legal-subsection">
                <h3>2.3 Analytics Cookies</h3>
                <p>
                  We use analytics cookies to understand how users interact with our platform:
                </p>
                <ul className="legal-list">
                  <li><strong>Google Analytics:</strong> Track page views and user behavior</li>
                  <li><strong>Performance Monitoring:</strong> Identify slow-loading pages</li>
                  <li><strong>Error Tracking:</strong> Monitor and fix technical issues</li>
                  <li><strong>User Journey Analysis:</strong> Understand navigation patterns</li>
                </ul>
              </div>

              <div className="legal-subsection">
                <h3>2.4 Marketing Cookies</h3>
                <p>
                  These cookies help us deliver relevant content and measure marketing effectiveness:
                </p>
                <ul className="legal-list">
                  <li><strong>Social Media Plugins:</strong> Enable social sharing functionality</li>
                  <li><strong>Conversion Tracking:</strong> Measure the effectiveness of our campaigns</li>
                  <li><strong>Retargeting:</strong> Show relevant ads on other websites</li>
                  <li><strong>Personalization:</strong> Customize content based on your interests</li>
                </ul>
              </div>
            </div>

            <div className="legal-section">
              <h2>3. Third-Party Cookies</h2>
              <p>
                Some cookies are set by third-party services that appear on our platform:
              </p>
              <ul className="legal-list">
                <li><strong>Google Analytics:</strong> Website analytics and performance monitoring</li>
                <li><strong>Social Media Platforms:</strong> Twitter, Telegram, Discord integration</li>
                <li><strong>Content Delivery Networks:</strong> Faster loading of images and resources</li>
                <li><strong>Customer Support Tools:</strong> Live chat and help desk functionality</li>
                <li><strong>Blockchain Data Providers:</strong> Real-time token prices and market data</li>
              </ul>
              <p>
                These third parties have their own privacy policies and cookie policies. 
                We recommend reviewing their policies to understand how they use cookies.
              </p>
            </div>

            <div className="legal-section">
              <h2>4. Local Storage and Session Storage</h2>
              <p>
                In addition to cookies, we use browser storage technologies:
              </p>
              <ul className="legal-list">
                <li><strong>Local Storage:</strong> Store wallet connection preferences and settings</li>
                <li><strong>Session Storage:</strong> Temporarily store data during your browsing session</li>
                <li><strong>IndexedDB:</strong> Store complex data for offline functionality</li>
                <li><strong>Web SQL:</strong> Cache blockchain data for faster loading</li>
              </ul>
            </div>

            <div className="legal-section">
              <h2>5. Web3 and Blockchain Tracking</h2>
              <div className="legal-warning">
                <h3> Blockchain Transparency Notice</h3>
                <p>
                  When you interact with smart contracts through WhalesPad:
                </p>
                <ul className="legal-list">
                  <li>Your wallet address becomes publicly visible on the blockchain</li>
                  <li>All transactions are permanently recorded and cannot be deleted</li>
                  <li>We may analyze on-chain data for security and compliance purposes</li>
                  <li>Third parties can also access this public blockchain information</li>
                </ul>
              </div>
            </div>

            <div className="legal-section">
              <h2>6. Managing Cookie Preferences</h2>
              
              <div className="legal-subsection">
                <h3>6.1 Browser Settings</h3>
                <p>
                  You can control cookies through your browser settings:
                </p>
                                 <ul className="legal-list">
                   <li><strong>Chrome:</strong> Settings {'>'}  Privacy and Security {'>'}  Cookies</li>
                   <li><strong>Firefox:</strong> Options {'>'}  Privacy & Security {'>'}  Cookies</li>
                   <li><strong>Safari:</strong> Preferences {'>'}  Privacy {'>'}  Cookies</li>
                   <li><strong>Edge:</strong> Settings {'>'}  Privacy {'>'}  Cookies</li>
                 </ul>
              </div>

              <div className="legal-subsection">
                <h3>6.2 Cookie Consent</h3>
                <p>
                  When you first visit WhalesPad, you'll see a cookie consent banner allowing you to:
                </p>
                <ul className="legal-list">
                  <li>Accept all cookies for the best experience</li>
                  <li>Customize your cookie preferences by category</li>
                  <li>Reject non-essential cookies (may limit functionality)</li>
                  <li>Change your preferences at any time through settings</li>
                </ul>
              </div>

              <div className="legal-subsection">
                <h3>6.3 Opt-Out Options</h3>
                <p>
                  You can opt out of specific tracking services:
                </p>
                <ul className="legal-list">
                  <li><strong>Google Analytics:</strong> Use the Google Analytics Opt-out Browser Add-on</li>
                  <li><strong>Social Media:</strong> Adjust privacy settings on respective platforms</li>
                  <li><strong>Marketing Cookies:</strong> Use industry opt-out tools like NAI or DAA</li>
                </ul>
              </div>
            </div>

            <div className="legal-section">
              <h2>7. Cookie Retention</h2>
              <p>
                Different cookies have different lifespans:
              </p>
              <ul className="legal-list">
                <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
                <li><strong>Persistent Cookies:</strong> Remain for a set period (30 days to 2 years)</li>
                <li><strong>Authentication Cookies:</strong> Typically expire after 24 hours</li>
                <li><strong>Preference Cookies:</strong> Usually last for 1 year</li>
                <li><strong>Analytics Cookies:</strong> Generally expire after 2 years</li>
              </ul>
            </div>

            <div className="legal-section">
              <h2>8. Impact of Disabling Cookies</h2>
              <div className="legal-warning">
                <h3>⚠️ Functionality Warning</h3>
                <p>
                  Disabling cookies may affect your platform experience:
                </p>
                <ul className="legal-list">
                  <li>You may need to reconnect your wallet frequently</li>
                  <li>Your preferences and settings may not be saved</li>
                  <li>Some platform features may not work properly</li>
                  <li>You may see less relevant content and recommendations</li>
                  <li>Performance monitoring and error detection may be limited</li>
                </ul>
              </div>
            </div>

            <div className="legal-section">
              <h2>9. Updates to This Policy</h2>
              <p>
                We may update this Cookie Policy from time to time to reflect:
              </p>
              <ul className="legal-list">
                <li>Changes in our use of cookies and tracking technologies</li>
                <li>New features or services that require different cookies</li>
                <li>Updates to applicable privacy laws and regulations</li>
                <li>Improvements to our privacy practices</li>
              </ul>
              <p>
                We will notify users of significant changes through our platform or via email.
              </p>
            </div>

            <div className="legal-section">
              <h2>10. Contact Us</h2>
              <p>
                If you have questions about our use of cookies or this policy, please contact us:
              </p>
              <div className="contact-info">
                <p>Email: contact@whalespad.com</p>
                <p>X: <a href="https://twitter.com/WhalesPadinfo" target="_blank" rel="noopener noreferrer">@WhalesPadinfo</a></p>
                <p> Website: https://whalespad.com</p>
                <p>📍 Cookie Settings: Available in your browser preferences</p>
              </div>
            </div>

            <div className="legal-footer">
              <p>
                By continuing to use WhalesPad, you consent to our use of cookies in accordance with this policy. 
                You can change your cookie preferences at any time through your browser settings or our cookie consent tool.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CookiePolicy; 
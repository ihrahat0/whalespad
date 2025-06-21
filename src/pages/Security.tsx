import React from 'react';
import { motion } from 'framer-motion';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const Security: React.FC = () => {
  const securityFeatures = [
    {
      icon: "🔒",
      title: "Smart Contract Audits",
      description: "All smart contracts undergo rigorous third-party security audits by leading blockchain security firms.",
      status: "active"
    },
    {
      icon: "🛡️",
      title: "Multi-Signature Wallets",
      description: "Treasury and admin functions secured with multi-signature technology requiring consensus approval.",
      status: "active"
    },
    {
      icon: "🔍",
      title: "Real-time Monitoring",
      description: "24/7 blockchain monitoring with automated threat detection and incident response systems.",
      status: "active"
    },
    {
      icon: "🔐",
      title: "Secure Infrastructure",
      description: "Enterprise-grade hosting with DDoS protection, encrypted databases, and secure API endpoints.",
      status: "active"
    },
    {
      icon: "⚡",
      title: "Bug Bounty Program",
      description: "Rewarding security researchers for discovering vulnerabilities in our platform and protocols.",
      status: "coming-soon"
    },
    {
      icon: "🔄",
      title: "Regular Penetration Testing",
      description: "Quarterly security assessments by certified ethical hackers and security professionals.",
      status: "active"
    }
  ];

  const securityPartners = [
    {
      name: "CertiK",
      logo: "🛡️",
      description: "Leading blockchain security firm providing smart contract audits",
      status: "verified"
    },
    {
      name: "ConsenSys Diligence",
      logo: "🔒",
      description: "Ethereum security specialists ensuring protocol safety",
      status: "verified"
    },
    {
      name: "OpenZeppelin",
      logo: "⚡",
      description: "Industry-standard secure smart contract frameworks",
      status: "verified"
    },
    {
      name: "Quantstamp",
      logo: "🔍",
      description: "Automated and manual security audit services",
      status: "planned"
    }
  ];

  const securityProtocols = [
    {
      category: "Smart Contract Security",
      items: [
        "Formal verification of critical contract functions",
        "Time-locked administrative functions with delays",
        "Circuit breakers for emergency protocol pausing",
        "Upgrade mechanisms with community governance",
        "Decentralized oracle price feeds with manipulation protection"
      ]
    },
    {
      category: "Platform Security",
      items: [
        "End-to-end encryption for all data transmission",
        "Zero-trust architecture with role-based access control",
        "Regular security training for all team members",
        "Incident response procedures with automated alerting",
        "Secure key management with hardware security modules"
      ]
    },
    {
      category: "User Protection",
      items: [
        "Phishing protection and domain verification",
        "Transaction simulation before execution",
        "Rate limiting and anti-bot measures",
        "Educational resources about DeFi security",
        "Community reporting system for suspicious activity"
      ]
    }
  ];

  return (
    <div className="security-page">
      <Navigation />
      
      {/* Hero Section */}
      <div className="security-hero">
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
            className="security-hero-content"
          >
            <h1 className="security-title">Security & Trust</h1>
            <p className="security-subtitle">
              Your safety is our priority. WhalesPad implements industry-leading security measures 
              to protect your assets and personal information.
            </p>
            <div className="security-badge">
              <span className="badge-icon">🛡️</span>
              <span>Bank-Grade Security Standards</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Security Promise */}
      <div className="security-promise">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="promise-content"
          >
            <h2 className="section-title">Our Security Commitment</h2>
            <div className="promise-grid">
              <div className="promise-card">
                <div className="promise-icon">🔐</div>
                <h3>Zero Compromise</h3>
                <p>We never compromise on security. Every component undergoes rigorous testing and verification.</p>
              </div>
              <div className="promise-card">
                <div className="promise-icon">🌟</div>
                <h3>Transparency</h3>
                <p>All security audits and assessments are publicly available for community review.</p>
              </div>
              <div className="promise-card">
                <div className="promise-icon">🚀</div>
                <h3>Continuous Improvement</h3>
                <p>We continuously enhance our security posture with the latest technologies and best practices.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Security Features */}
      <div className="security-features">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 className="section-title">Security Infrastructure</h2>
            <div className="features-grid">
              {securityFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className={`feature-card ${feature.status}`}
                  whileHover={{ y: -5 }}
                >
                  <div className="feature-icon">{feature.icon}</div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                  <div className={`feature-status ${feature.status}`}>
                    {feature.status === 'active' && <span>✅ Active</span>}
                    {feature.status === 'coming-soon' && <span>🚀 Coming Soon</span>}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Security Protocols */}
      <div className="security-protocols">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h2 className="section-title">Security Protocols</h2>
            <div className="protocols-grid">
              {securityProtocols.map((protocol, index) => (
                <div key={index} className="protocol-card">
                  <h3>{protocol.category}</h3>
                  <ul className="protocol-list">
                    {protocol.items.map((item, itemIndex) => (
                      <li key={itemIndex}>
                        <span className="protocol-check">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Security Partners */}
      <div className="security-partners">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <h2 className="section-title">Security Partners</h2>
            <div className="partners-grid">
              {securityPartners.map((partner, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className={`partner-card ${partner.status}`}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="partner-logo">{partner.logo}</div>
                  <h3>{partner.name}</h3>
                  <p>{partner.description}</p>
                  <div className={`partner-status ${partner.status}`}>
                    {partner.status === 'verified' && <span>✅ Verified Partner</span>}
                    {partner.status === 'planned' && <span>📅 Integration Planned</span>}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Incident Response */}
      <div className="incident-response">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="incident-content"
          >
            <h2 className="section-title">Incident Response</h2>
            <div className="incident-grid">
              <div className="incident-step">
                <div className="step-number">1</div>
                <h3>Detection</h3>
                <p>Automated monitoring systems detect potential threats in real-time</p>
              </div>
              <div className="incident-step">
                <div className="step-number">2</div>
                <h3>Assessment</h3>
                <p>Security team evaluates the threat level and potential impact</p>
              </div>
              <div className="incident-step">
                <div className="step-number">3</div>
                <h3>Response</h3>
                <p>Immediate containment measures and protocol safeguards activated</p>
              </div>
              <div className="incident-step">
                <div className="step-number">4</div>
                <h3>Communication</h3>
                <p>Transparent updates provided to community and stakeholders</p>
              </div>
              <div className="incident-step">
                <div className="step-number">5</div>
                <h3>Recovery</h3>
                <p>Safe restoration of services with enhanced security measures</p>
              </div>
              <div className="incident-step">
                <div className="step-number">6</div>
                <h3>Analysis</h3>
                <p>Post-incident review and implementation of preventive measures</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Security Resources */}
      <div className="security-resources">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="resources-content"
          >
            <h2 className="section-title">Security Resources</h2>
            <div className="resources-grid">
              <div className="resource-card">
                <h3>📋 Audit Reports</h3>
                <p>Access all our security audit reports and assessments</p>
                <a href="#" className="resource-link">View Reports</a>
              </div>
              <div className="resource-card">
                <h3>🐛 Bug Bounty</h3>
                <p>Report security vulnerabilities and earn rewards</p>
                <a href="#" className="resource-link">Report Bug</a>
              </div>
              <div className="resource-card">
                <h3>📚 Security Guide</h3>
                <p>Learn how to protect yourself in the DeFi ecosystem</p>
                <a href="#" className="resource-link">Read Guide</a>
              </div>
              <div className="resource-card">
                <h3>🚨 Report Issue</h3>
                <p>Report suspicious activity or security concerns</p>
                <a href="#" className="resource-link">Contact Security</a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Contact Security */}
      <div className="security-contact">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="contact-content"
          >
            <h2>Security Contact</h2>
            <p>
              Have a security concern or want to report a vulnerability? 
              Our security team is here to help.
            </p>
            <div className="contact-info">
              <div className="contact-item">
                <strong>🔒 Security Email:</strong>
                <span>contact@whalespad.com</span>
              </div>
              
              <div className="contact-item">
                <strong>🔐 PGP Key:</strong>
                <span>Download our PGP key for encrypted communication</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Security; 
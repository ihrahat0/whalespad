import React from 'react';
import { motion } from 'framer-motion';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const TermsOfService: React.FC = () => {
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
            <h1 className="legal-title">Terms of Service</h1>
            <p className="legal-subtitle">Last updated: December 2024</p>
            <div className="legal-badge">
              <span className="badge-icon">📋</span>
              <span>WhalesPad Platform Agreement</span>
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
              <h2>1. Agreement to Terms</h2>
              <p>
                By accessing and using WhalesPad ("Platform"), you agree to be bound by these Terms of Service 
                and all applicable laws and regulations. WhalesPad is a decentralized launchpad platform that 
                facilitates Initial DEX Offerings (IDOs) and token launches on EVM-compatible blockchain networks.
              </p>
            </div>

            <div className="legal-section">
              <h2>2. Platform Description</h2>
              <p>
                WhalesPad provides a comprehensive ecosystem for blockchain project launches, including:
              </p>
              <ul className="legal-list">
                <li>IDO launchpad services for EVM-compatible chains</li>
                <li>Token staking and liquidity provision mechanisms</li>
                <li>Airdrop distribution systems</li>
                <li>Project vetting and community governance tools</li>
                <li>Educational resources and market analytics</li>
              </ul>
            </div>

            <div className="legal-section">
              <h2>3. Eligibility and User Responsibilities</h2>
              <div className="legal-subsection">
                <h3>3.1 Age and Jurisdiction</h3>
                <p>
                  You must be at least 18 years old and legally able to enter into contracts. You are responsible 
                  for ensuring that your use of the Platform complies with applicable laws in your jurisdiction.
                </p>
              </div>
              <div className="legal-subsection">
                <h3>3.2 Prohibited Activities</h3>
                <ul className="legal-list">
                  <li>Using the Platform for money laundering or terrorist financing</li>
                  <li>Attempting to manipulate token prices or market conditions</li>
                  <li>Providing false or misleading information</li>
                  <li>Violating intellectual property rights</li>
                  <li>Engaging in market manipulation or fraudulent activities</li>
                </ul>
              </div>
            </div>

            <div className="legal-section">
              <h2>4. Blockchain and Smart Contract Risks</h2>
              <div className="legal-warning">
                <h3>⚠️ Important Blockchain Disclosures</h3>
                <p>
                  Blockchain transactions are irreversible. WhalesPad operates on decentralized networks where:
                </p>
                <ul className="legal-list">
                  <li>Smart contracts may contain bugs or vulnerabilities</li>
                  <li>Network congestion can cause transaction delays or failures</li>
                  <li>Gas fees are determined by network conditions</li>
                  <li>We cannot reverse or refund blockchain transactions</li>
                  <li>Private key security is solely your responsibility</li>
                </ul>
              </div>
            </div>

            <div className="legal-section">
              <h2>5. Investment Risks and Disclaimers</h2>
              <div className="legal-risk">
                <h3>🚨 High-Risk Investment Warning</h3>
                <p>
                  Cryptocurrency investments carry significant risks including:
                </p>
                <ul className="legal-list">
                  <li>Total loss of invested capital</li>
                  <li>Extreme price volatility</li>
                  <li>Regulatory uncertainty and potential changes</li>
                  <li>Liquidity risks and market manipulation</li>
                  <li>Technology risks and smart contract vulnerabilities</li>
                </ul>
                <p className="risk-disclaimer">
                  <strong>Never invest more than you can afford to lose. Past performance does not guarantee future results.</strong>
                </p>
              </div>
            </div>

            <div className="legal-section">
              <h2>6. Platform Availability and Modifications</h2>
              <p>
                WhalesPad reserves the right to modify, suspend, or discontinue any aspect of the Platform 
                with or without notice. We may also update these Terms of Service to reflect changes in our 
                services or applicable laws.
              </p>
            </div>

            <div className="legal-section">
              <h2>7. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, WhalesPad and its team members shall not be liable for:
              </p>
              <ul className="legal-list">
                <li>Any direct, indirect, incidental, or consequential damages</li>
                <li>Loss of profits, data, or business opportunities</li>
                <li>Damages resulting from smart contract failures or blockchain issues</li>
                <li>Third-party actions or market conditions</li>
                <li>Regulatory actions or legal changes</li>
              </ul>
            </div>

            <div className="legal-section">
              <h2>8. Governing Law and Dispute Resolution</h2>
              <p>
                These Terms are governed by the laws of [Jurisdiction]. Any disputes shall be resolved through 
                binding arbitration in accordance with international arbitration rules, except where prohibited 
                by local law.
              </p>
            </div>

            <div className="legal-section">
              <h2>9. Contact Information</h2>
              <p>
                For questions about these Terms of Service, please contact us at:
              </p>
              <div className="contact-info">
                <p>Email: contact@whalespad.com</p>
                <p>X: <a href="https://twitter.com/WhalesPadinfo" target="_blank" rel="noopener noreferrer">@WhalesPadinfo</a></p>
                <p>Website: https://whalespad.com</p>
              </div>
            </div>

            <div className="legal-footer">
              <p>
                By continuing to use WhalesPad, you acknowledge that you have read, understood, 
                and agree to be bound by these Terms of Service.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TermsOfService; 
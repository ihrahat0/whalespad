import React from 'react';
import { motion } from 'framer-motion';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const Disclaimer: React.FC = () => {
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
            <h1 className="legal-title">Disclaimer</h1>
            <p className="legal-subtitle">Last updated: December 2024</p>
            <div className="legal-badge">
              <span className="badge-icon">⚠️</span>
              <span>Important Legal Notices</span>
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
              <h2>1. General Information</h2>
              <p>
                The information provided on WhalesPad is for general informational purposes only. 
                WhalesPad is a decentralized launchpad platform that facilitates token sales and 
                Initial DEX Offerings (IDOs). This disclaimer governs your use of our platform 
                and any information provided through our services.
              </p>
            </div>

            <div className="legal-section">
              <h2>2. Not Financial Advice</h2>
              <div className="legal-warning">
                <h3>⚠️ Important Investment Notice</h3>
                <p>
                  <strong>Nothing on WhalesPad constitutes financial, investment, trading, or other advice.</strong> 
                  All content is provided for informational purposes only and should not be construed as:
                </p>
                <ul className="legal-list">
                  <li>Investment recommendations or solicitations</li>
                  <li>Financial planning or advisory services</li>
                  <li>Tax, legal, or accounting advice</li>
                  <li>Predictions of future market performance</li>
                  <li>Guarantees of investment returns</li>
                </ul>
                <p className="risk-disclaimer">
                  <strong>Always consult with qualified financial professionals before making investment decisions.</strong>
                </p>
              </div>
            </div>

            <div className="legal-section">
              <h2>3. High-Risk Investment Warning</h2>
              <div className="legal-risk">
                <h3>🚨 Cryptocurrency Investment Risks</h3>
                <p>
                  Cryptocurrency and token investments are speculative and carry significant risks including:
                </p>
                <ul className="legal-list">
                  <li><strong>Total Loss of Capital:</strong> You may lose your entire investment</li>
                  <li><strong>Extreme Volatility:</strong> Token prices can fluctuate dramatically</li>
                  <li><strong>Regulatory Risk:</strong> Changing laws may affect token legality or trading</li>
                  <li><strong>Liquidity Risk:</strong> Tokens may become difficult to sell or trade</li>
                  <li><strong>Technology Risk:</strong> Smart contracts may contain bugs or vulnerabilities</li>
                  <li><strong>Market Manipulation:</strong> Small markets are susceptible to manipulation</li>
                  <li><strong>Project Failure:</strong> Funded projects may fail to deliver promised products</li>
                </ul>
              </div>
            </div>

            <div className="legal-section">
              <h2>4. No Warranty or Representation</h2>
              <p>
                WhalesPad makes no warranties or representations about:
              </p>
              <ul className="legal-list">
                <li>The accuracy, completeness, or timeliness of information provided</li>
                <li>The performance or success of any project listed on our platform</li>
                <li>The technical functionality or security of smart contracts</li>
                <li>The continuous availability of our platform or services</li>
                <li>The compliance of projects with applicable laws and regulations</li>
              </ul>
            </div>

            <div className="legal-section">
              <h2>5. Third-Party Projects and Content</h2>
              <p>
                WhalesPad hosts projects from third-party developers and teams. We do not:
              </p>
              <ul className="legal-list">
                <li>Endorse or guarantee any project listed on our platform</li>
                <li>Verify the accuracy of project claims or documentation</li>
                <li>Audit smart contracts or technical implementations</li>
                <li>Take responsibility for project team actions or decisions</li>
                <li>Guarantee project completion or token utility</li>
              </ul>
              <p>
                <strong>Users must conduct their own research (DYOR) before participating in any project.</strong>
              </p>
            </div>

            <div className="legal-section">
              <h2>6. Blockchain and Smart Contract Risks</h2>
              <p>
                Blockchain technology and smart contracts involve inherent risks:
              </p>
              <ul className="legal-list">
                <li>Transactions are irreversible and cannot be undone</li>
                <li>Smart contracts may contain coding errors or vulnerabilities</li>
                <li>Network congestion may cause transaction failures or delays</li>
                <li>Gas fees are variable and determined by network conditions</li>
                <li>Private key loss results in permanent loss of access to funds</li>
                <li>Blockchain networks may experience downtime or attacks</li>
              </ul>
            </div>

            <div className="legal-section">
              <h2>7. Regulatory Compliance</h2>
              <p>
                Cryptocurrency regulations vary by jurisdiction and are rapidly evolving. Users are responsible for:
              </p>
              <ul className="legal-list">
                <li>Understanding applicable laws in their jurisdiction</li>
                <li>Ensuring compliance with local securities regulations</li>
                <li>Reporting transactions for tax purposes as required</li>
                <li>Obtaining necessary licenses or approvals</li>
                <li>Staying informed about regulatory changes</li>
              </ul>
            </div>

            <div className="legal-section">
              <h2>8. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, WhalesPad disclaims all liability for:
              </p>
              <ul className="legal-list">
                <li>Financial losses resulting from platform use</li>
                <li>Damages caused by third-party projects or tokens</li>
                <li>Technical failures or smart contract vulnerabilities</li>
                <li>Market volatility or adverse price movements</li>
                <li>Regulatory actions or legal changes</li>
                <li>Loss of private keys or wallet access</li>
              </ul>
            </div>

            <div className="legal-section">
              <h2>9. Forward-Looking Statements</h2>
              <p>
                Any forward-looking statements on our platform are subject to significant risks and uncertainties. 
                Actual results may differ materially from those projected or implied. We do not undertake any 
                obligation to update forward-looking statements.
              </p>
            </div>

            <div className="legal-section">
              <h2>10. Updates and Modifications</h2>
              <p>
                This disclaimer may be updated periodically. Continued use of the platform constitutes 
                acceptance of any modifications. Users are responsible for reviewing this disclaimer regularly.
              </p>
            </div>

            <div className="legal-section">
              <h2>11. Contact Information</h2>
              <p>
                For questions about this disclaimer, please contact us at:
              </p>
              <div className="contact-info">
                <p>Email: contact@whalespad.com</p>
                <p>X: <a href="https://twitter.com/WhalesPadinfo" target="_blank" rel="noopener noreferrer">@WhalesPadinfo</a></p>
                <p>Website: https://whalespad.com</p>
              </div>
            </div>

            <div className="legal-footer">
              <p>
                <strong>By using WhalesPad, you acknowledge that you have read, understood, and agree to this disclaimer. 
                If you do not agree with any part of this disclaimer, please do not use our platform.</strong>
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Disclaimer; 
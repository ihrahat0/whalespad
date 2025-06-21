import React from 'react';
import { motion } from 'framer-motion';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const GamePlan: React.FC = () => {
  const roadmapPhases = [
    {
      phase: "Phase 1",
      title: "Foundation & Launch",
      status: "completed",
      quarter: "Q1 2024",
      items: [
        "Platform development and smart contract deployment",
        "Security audits and penetration testing",
        "Initial community building and partnerships",
        "Beta testing with select projects",
        "IDO launchpad infrastructure setup"
      ]
    },
    {
      phase: "Phase 2", 
      title: "Multi-Chain Expansion",
      status: "active",
      quarter: "Q4 2024",
      items: [
        "Ethereum mainnet integration",
        "Binance Smart Chain support",
        "Polygon network deployment", 
        "Arbitrum and Optimism compatibility",
        "Cross-chain bridge implementation"
      ]
    },
    {
      phase: "Phase 3",
      title: "Advanced Features",
      status: "upcoming",
      quarter: "Q1 2025",
      items: [
        "Decentralized governance implementation",
        "Advanced staking mechanisms",
        "Liquidity farming protocols",
        "NFT marketplace integration",
        "Mobile application launch"
      ]
    },
    {
      phase: "Phase 4",
      title: "Ecosystem Growth",
      status: "upcoming", 
      quarter: "Q2 2025",
      items: [
        "Layer 2 scaling solutions",
        "Institutional investor tools",
        "API marketplace for developers",
        "Educational platform launch",
        "Global regulatory compliance"
      ]
    },
    {
      phase: "Phase 5",
      title: "Innovation & Beyond",
      status: "upcoming",
      quarter: "Q3 2025",
      items: [
        "AI-powered project analysis",
        "Decentralized identity integration",
        "Carbon-neutral blockchain initiatives",
        "Virtual reality trading interface",
        "Global expansion and localization"
      ]
    }
  ];

  const coreStrategies = [
    {
      icon: "🚀",
      title: "Multi-Chain Excellence",
      description: "Supporting all major EVM chains with seamless interoperability and future expansion to non-EVM networks."
    },
    {
      icon: "🛡️", 
      title: "Security First",
      description: "Rigorous security audits, bug bounty programs, and industry-leading protection standards."
    },
    {
      icon: "🌍",
      title: "Global Accessibility", 
      description: "Making DeFi accessible worldwide with localized support and regulatory compliance."
    },
    {
      icon: "🤝",
      title: "Community Driven",
      description: "Empowering our community through governance, rewards, and collaborative decision-making."
    },
    {
      icon: "💡",
      title: "Innovation Hub",
      description: "Continuously evolving with cutting-edge features and revolutionary blockchain technology."
    },
    {
      icon: "📈",
      title: "Sustainable Growth",
      description: "Building for long-term success with sustainable tokenomics and ecosystem development."
    }
  ];

  return (
    <div className="gameplan-page">
      <Navigation />
      
      {/* Hero Section */}
      <div className="gameplan-hero">
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
            className="gameplan-hero-content"
          >
            <h1 className="gameplan-title">WhalesPad Game Plan</h1>
            <p className="gameplan-subtitle">
              Our strategic roadmap to revolutionize the DeFi launchpad ecosystem
            </p>
            <div className="gameplan-badge">
              <span className="badge-icon">🎯</span>
              <span>Strategic Vision 2024-2025</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="mission-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mission-content"
          >
            <h2 className="section-title">Our Mission</h2>
            <div className="mission-grid">
              <div className="mission-card">
                <div className="mission-icon">🌊</div>
                <h3>Democratize DeFi</h3>
                <p>Making advanced DeFi tools accessible to everyone, from retail investors to institutions.</p>
              </div>
              <div className="mission-card">
                <div className="mission-icon">🔗</div>
                <h3>Bridge Ecosystems</h3>
                <p>Connecting multiple blockchain networks to create a truly interoperable DeFi experience.</p>
              </div>
              <div className="mission-card">
                <div className="mission-icon">⚡</div>
                <h3>Accelerate Innovation</h3>
                <p>Empowering the next generation of blockchain projects with cutting-edge launchpad technology.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Core Strategies */}
      <div className="strategies-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 className="section-title">Core Strategies</h2>
            <div className="strategies-grid">
              {coreStrategies.map((strategy, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="strategy-card"
                  whileHover={{ y: -5 }}
                >
                  <div className="strategy-icon">{strategy.icon}</div>
                  <h3>{strategy.title}</h3>
                  <p>{strategy.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Roadmap Section */}
      <div className="roadmap-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h2 className="section-title">Development Roadmap</h2>
            <div className="roadmap-timeline">
              {roadmapPhases.map((phase, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className={`roadmap-phase ${phase.status}`}
                >
                  <div className="phase-marker">
                    <div className={`phase-dot ${phase.status}`}></div>
                    <div className="phase-line"></div>
                  </div>
                  <div className="phase-content">
                    <div className="phase-header">
                      <h3>{phase.phase}: {phase.title}</h3>
                      <span className="phase-quarter">{phase.quarter}</span>
                      <span className={`phase-status ${phase.status}`}>
                        {phase.status === 'completed' && '✅ Completed'}
                        {phase.status === 'active' && '🚀 In Progress'}
                        {phase.status === 'upcoming' && '📅 Planned'}
                      </span>
                    </div>
                    <ul className="phase-items">
                      {phase.items.map((item, itemIndex) => (
                        <li key={itemIndex}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Metrics Section */}
      <div className="metrics-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <h2 className="section-title">Target Metrics</h2>
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-number">50+</div>
                <div className="metric-label">Successful IDO Launches</div>
                <div className="metric-target">by Q2 2025</div>
              </div>
              <div className="metric-card">
                <div className="metric-number">$100M+</div>
                <div className="metric-label">Total Value Locked</div>
                <div className="metric-target">by Q3 2025</div>
              </div>
              <div className="metric-card">
                <div className="metric-number">500K+</div>
                <div className="metric-label">Active Users</div>
                <div className="metric-target">by Q4 2025</div>
              </div>
              <div className="metric-card">
                <div className="metric-number">10+</div>
                <div className="metric-label">Supported Chains</div>
                <div className="metric-target">by Q1 2026</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="cta-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="cta-content"
          >
            <h2>Join the Revolution</h2>
            <p>
              Be part of the future of decentralized finance. Together, we're building 
              the most advanced and accessible DeFi launchpad ecosystem.
            </p>
            <div className="cta-buttons">
              <a href="/submit-project" className="cta-button primary">
                Apply for IDO
              </a>
              <a href="/staking" className="cta-button secondary">
                Start Staking
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default GamePlan; 
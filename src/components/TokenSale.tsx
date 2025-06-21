import React, { useState } from 'react';
import { motion } from 'framer-motion';

const TokenSale: React.FC = () => {
  const [activeTab, setActiveTab] = useState('tokenomics');

  // Updated tokenomics data for 2 billion total supply
  const tokenomicsData = [
    { label: 'Public Sale', percentage: 25, color: '#00ff88', amount: '500M WPT' },
    { label: 'Private Sale', percentage: 15, color: '#00d4ff', amount: '300M WPT' },
    { label: 'Team & Advisors', percentage: 20, color: '#a855f7', amount: '400M WPT' },
    { label: 'Marketing & Community', percentage: 12, color: '#f59e0b', amount: '240M WPT' },
    { label: 'Development & Operations', percentage: 15, color: '#ef4444', amount: '300M WPT' },
    { label: 'Liquidity & Exchange', percentage: 8, color: '#06b6d4', amount: '160M WPT' },
    { label: 'Reserve & Treasury', percentage: 5, color: '#8b5cf6', amount: '100M WPT' }
  ];

  // Blockchain deployment information
  const blockchainDeployments = [
    {
      name: 'Binance Smart Chain',
      symbol: 'BSC',
      address: '0x9335d409b74d013c6F626dA6E43F2E65c427A835',
      explorer: 'https://bscscan.com/token/0x9335d409b74d013c6F626dA6E43F2E65c427A835',
      color: '#f3ba2f',
      network: 'BEP-20'
    },
    {
      name: 'Ethereum',
      symbol: 'ETH',
      address: '0x241dd0d61BEA19890F4252Dbc787C11f0925Ef1f',
      explorer: 'https://etherscan.io/token/0x241dd0d61BEA19890F4252Dbc787C11f0925Ef1f',
      color: '#627eea',
      network: 'ERC-20'
    }
  ];



  const navigateToCreatePresale = () => {
    window.location.href = '/create-presale';
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <div className="container mx-auto p-6 min-h-screen">
      {/* Hero Section */}
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
          WhalesPad Token
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
          The future of decentralized launchpad ecosystems with multi-chain deployment
        </p>
        
        {/* Token Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
          <div className="tokenomics-stat-card">
            <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">2B</div>
            <div className="text-lg text-gray-300">Total Supply</div>
          </div>
          <div className="tokenomics-stat-card">
            <div className="text-3xl md:text-4xl font-bold text-green-400 mb-2">WPT</div>
            <div className="text-lg text-gray-300">Token Symbol</div>
          </div>
          <div className="tokenomics-stat-card">
            <div className="text-3xl md:text-4xl font-bold text-purple-400 mb-2">2</div>
            <div className="text-lg text-gray-300">Active Chains</div>
          </div>
        </div>

        <button 
          onClick={() => window.location.href = '/submit-project'}
          className="tokenomics-cta-button"
        >
          <span>Launch Your Project</span>
          <div className="button-shine"></div>
        </button>
      </motion.div>
      
      {/* Tab Navigation */}
      <div className="tokenomics-tab-container">
        <button
          className={`tokenomics-tab ${activeTab === 'tokenomics' ? 'active' : ''}`}
          onClick={() => setActiveTab('tokenomics')}
        >
          <span className="tab-icon"></span>
          <span>Tokenomics</span>
        </button>
        <button
          className={`tokenomics-tab ${activeTab === 'blockchain' ? 'active' : ''}`}
          onClick={() => setActiveTab('blockchain')}
        >
          <span className="tab-icon">🔗</span>
          <span>Blockchain</span>
        </button>
      </div>
      
      {/* Tokenomics Tab */}
      {activeTab === 'tokenomics' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 xl:grid-cols-2 gap-8"
        >
          {/* Enhanced Tokenomics Chart */}
          <div className="tokenomics-main-card">
            <div className="card-header">
              <h3 className="card-title">
                <span className="title-icon">🎯</span>
                Token Distribution
              </h3>
              <div className="total-supply-badge">
                2,000,000,000 WPT
              </div>
            </div>
            
            <div className="tokenomics-chart-container">
              <div className="tokenomics-chart">
                <div className="chart-segments">
                  {tokenomicsData.map((item, index) => {
                    const startAngle = tokenomicsData.slice(0, index).reduce((sum, item) => sum + item.percentage, 0) * 3.6;
                    const endAngle = startAngle + item.percentage * 3.6;
                    
                    return (
                      <div 
                        key={index}
                        className="chart-segment"
                        style={{
                          background: `conic-gradient(${item.color} ${startAngle}deg, ${item.color} ${endAngle}deg, transparent ${endAngle}deg)`,
                        }}
                      />
                    );
                  })}
                  <div className="chart-center">
                    <div className="center-content">
                      <span className="supply-amount">2B</span>
                      <span className="supply-symbol">WPT</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="tokenomics-legend">
              {tokenomicsData.map((item, index) => (
                <motion.div 
                  key={index} 
                  className="legend-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                >
                  <div className="legend-color" style={{ backgroundColor: item.color }}></div>
                  <div className="legend-info">
                    <p className="legend-label">{item.label}</p>
                    <div className="legend-stats">
                      <span className="legend-percentage">{item.percentage}%</span>
                      <span className="legend-amount">({item.amount})</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Enhanced Token Details */}
          <div className="tokenomics-main-card">
            <div className="card-header">
              <h3 className="card-title">
                Token Information
              </h3>
            </div>
            
            <div className="token-details-grid">
              <div className="detail-item featured">
                <span className="detail-label">Token Name</span>
                <span className="detail-value">WhalesPad</span>
              </div>
              
              <div className="detail-item featured">
                <span className="detail-label">Symbol</span>
                <span className="detail-value">WPT</span>
              </div>
              
              <div className="detail-item">
                <span className="detail-label">Total Supply</span>
                <span className="detail-value">2,000,000,000 WPT</span>
              </div>
              
              <div className="detail-item">
                <span className="detail-label">Circulating Supply</span>
                <span className="detail-value">500,000,000 WPT</span>
              </div>
              
              <div className="detail-item">
                <span className="detail-label">Initial Market Cap</span>
                <span className="detail-value">$40,000,000</span>
              </div>
              
              <div className="detail-item">
                <span className="detail-label">Launch Price</span>
                <span className="detail-value">$0.08</span>
              </div>
              
              <div className="detail-item">
                <span className="detail-label">Token Standards</span>
                <span className="detail-value">BEP-20 / ERC-20</span>
              </div>

              <div className="detail-item">
                <span className="detail-label">Deflation Mechanism</span>
                <span className="detail-value">2% Burn on Transactions</span>
              </div>
            </div>

            {/* Utility Features */}
            <div className="utility-section">
              <h4 className="utility-title">Token Utility</h4>
              <div className="utility-grid">
                <div className="utility-item">
                  <span className="utility-text">IDO Participation</span>
                </div>
                <div className="utility-item">
                  <span className="utility-text">Governance Voting</span>
                </div>
                <div className="utility-item">
                  <span className="utility-text">Staking Rewards</span>
                </div>
                <div className="utility-item">
                  <span className="utility-text">Fee Discounts</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Blockchain Tab */}
      {activeTab === 'blockchain' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          <div className="tokenomics-main-card">
            <div className="card-header">
              <h3 className="card-title">
                <span className="title-icon">🔗</span>
                Multi-Chain Deployment
              </h3>
              <p className="card-subtitle">WhalesPad token is deployed on multiple blockchains for maximum accessibility</p>
            </div>

            <div className="blockchain-grid">
              {blockchainDeployments.map((blockchain, index) => (
                <motion.div
                  key={index}
                  className="blockchain-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <div className="blockchain-header">
                    <div className="blockchain-info">
                      <div 
                        className="blockchain-icon"
                        style={{ backgroundColor: blockchain.color }}
                      >
                        {blockchain.symbol}
                      </div>
                      <div>
                        <h4 className="blockchain-name">{blockchain.name}</h4>
                        <span className="blockchain-network">{blockchain.network}</span>
                      </div>
                    </div>
                    <div className="deployment-badge">
                      <span className="badge-dot"></span>
                      <span>Live</span>
                    </div>
                  </div>

                  <div className="contract-section">
                    <label className="contract-label">Contract Address:</label>
                    <div className="contract-address-container">
                      <code className="contract-address">{blockchain.address}</code>
                      <button 
                        className="copy-button"
                        onClick={() => copyToClipboard(blockchain.address)}
                        title="Copy Address"
                      >
                        📋
                      </button>
                    </div>
                  </div>

                  <div className="blockchain-actions">
                    <a 
                      href={blockchain.explorer}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="explorer-button"
                    >
                      <span className="button-icon">🔍</span>
                      <span>View on Explorer</span>
                      <div className="button-shine"></div>
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Cross-Chain Bridge Info */}
            <div className="bridge-info-card">
              <div className="bridge-header">
                <h4 className="bridge-title">
                  <span className="bridge-icon">🌉</span>
                  Cross-Chain Bridge
                </h4>
                <span className="coming-soon-badge">Coming Soon</span>
              </div>
              <p className="bridge-description">
                Seamlessly transfer WPT tokens between Ethereum and Binance Smart Chain with our upcoming cross-chain bridge solution.
              </p>
            </div>
          </div>
        </motion.div>
      )}
      


    </div>
  );
};

export default TokenSale; 
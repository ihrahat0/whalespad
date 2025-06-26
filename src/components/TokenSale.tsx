import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const TokenSale: React.FC = () => {
  const [activeTab, setActiveTab] = useState('tokenomics');
  
  // Countdown timer state (90 days from now)
  const [timeLeft, setTimeLeft] = useState({
    days: 90,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Countdown effect
  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 90);
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;
      
      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0f',
      position: 'relative',
      padding: 0,
      margin: 0,
      width: '100%',
      overflow: 'visible'
    }}>
      <style>
        {`
          .tokenomics-hero {
            background: linear-gradient(135deg, 
              rgba(10, 10, 15, 0.95) 0%, 
              rgba(26, 26, 46, 0.9) 50%, 
              rgba(10, 10, 15, 0.95) 100%
            );
            padding: 6rem 2rem 4rem;
            text-align: center;
            position: relative;
            border-bottom: 1px solid rgba(0, 212, 255, 0.1);
          }

          .hero-logo-section {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1.5rem;
            margin-bottom: 2rem;
          }

          .token-hero-logo {
            width: 120px;
            height: 120px;
            object-fit: contain;
            border-radius: 50%;
            border: 3px solid rgba(0, 212, 255, 0.3);
            padding: 10px;
            background: linear-gradient(135deg, 
              rgba(0, 212, 255, 0.1) 0%, 
              rgba(139, 92, 246, 0.1) 100%
            );
            box-shadow: 0 0 30px rgba(0, 212, 255, 0.2);
          }

          .token-hero-title {
            font-family: 'Orbitron', sans-serif;
            font-size: clamp(2.5rem, 6vw, 4rem);
            font-weight: 900;
            background: linear-gradient(135deg, #00d4ff 0%, #4f8fff 50%, #8b5cf6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin: 0;
            text-shadow: 0 0 30px rgba(0, 212, 255, 0.3);
          }

          .token-symbol-badge {
            background: linear-gradient(135deg, #00d4ff, #4f8fff);
            color: #000;
            padding: 0.75rem 2rem;
            border-radius: 50px;
            font-weight: 900;
            font-size: 1.2rem;
            letter-spacing: 2px;
            box-shadow: 0 8px 25px rgba(0, 212, 255, 0.3);
          }

          .token-hero-description {
            font-size: clamp(1.1rem, 2.5vw, 1.5rem);
            color: #a1a1aa;
            max-width: 600px;
            margin: 0 auto 3rem;
            line-height: 1.6;
          }

          .token-stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 2rem;
            max-width: 800px;
            margin: 0 auto 3rem;
          }

          .token-stat-card {
            background: linear-gradient(135deg, 
              rgba(26, 26, 46, 0.8) 0%, 
              rgba(15, 23, 42, 0.9) 100%
            );
            border: 2px solid rgba(0, 212, 255, 0.2);
            border-radius: 20px;
            padding: 2rem 1.5rem;
            text-align: center;
            position: relative;
            overflow: hidden;
            transition: all 0.4s ease;
            backdrop-filter: blur(20px);
          }

          .token-stat-card:hover {
            border-color: rgba(0, 212, 255, 0.6);
            transform: translateY(-8px);
            box-shadow: 0 20px 60px rgba(0, 212, 255, 0.2);
          }

          .token-stat-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, transparent, #00d4ff, transparent);
            opacity: 0;
            transition: opacity 0.3s ease;
          }

          .token-stat-card:hover::before {
            opacity: 1;
          }

          .token-stat-card .stat-value {
            font-size: 2.5rem;
            font-weight: 900;
            color: #00d4ff;
            margin-bottom: 0.5rem;
            font-family: 'Orbitron', sans-serif;
          }

          .token-stat-card .stat-label {
            font-size: 1rem;
            color: #a1a1aa;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          .token-cta-button {
            position: relative;
            display: inline-flex;
            align-items: center;
            gap: 0.75rem;
            padding: 1.25rem 2.5rem;
            background: linear-gradient(135deg, #00d4ff 0%, #4f8fff 50%, #8b5cf6 100%);
            border: none;
            border-radius: 50px;
            color: #000;
            font-size: 1.1rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            cursor: pointer;
            transition: all 0.4s ease;
            overflow: hidden;
            box-shadow: 0 8px 30px rgba(0, 212, 255, 0.3);
          }

          .token-cta-button:hover {
            box-shadow: 0 15px 60px rgba(0, 212, 255, 0.5);
          }

          @media (max-width: 768px) {
            .tokenomics-hero {
              padding: 4rem 1rem 3rem;
            }
            
            .token-hero-logo {
              width: 80px;
              height: 80px;
            }
            
            .token-symbol-badge {
              padding: 0.5rem 1.5rem;
              font-size: 1rem;
            }
            
            .token-stats-grid {
              grid-template-columns: 1fr;
              gap: 1.5rem;
              margin: 0 auto 2rem;
            }
            
            .token-stat-card {
              padding: 1.5rem 1rem;
            }
            
            .token-stat-card .stat-value {
              font-size: 2rem;
            }
            
            .token-cta-button {
              padding: 1rem 2rem;
              font-size: 1rem;
            }
          }

          @media (max-width: 480px) {
            .tokenomics-hero {
              padding: 3rem 0.75rem 2rem;
            }
            
            .token-hero-logo {
              width: 60px;
              height: 60px;
            }
            
            .hero-logo-section {
              gap: 1rem;
              margin-bottom: 1.5rem;
            }
            
            .token-stats-grid {
              gap: 1rem;
              margin: 0 auto 1.5rem;
            }
            
            .token-stat-card {
              padding: 1rem;
            }
            
            .token-stat-card .stat-value {
              font-size: 1.5rem;
            }
            
            .token-stat-card .stat-label {
              font-size: 0.9rem;
            }
          }

          /* Enhanced Tokenomics Chart Styles */
          .tokenomics-container {
            padding: 4rem 2rem;
            max-width: 1400px;
            margin: 0 auto;
          }

          .tokenomics-tab-container {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin-bottom: 3rem;
            padding: 0 2rem;
          }

          .tokenomics-tab {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 1rem 2rem;
            background: linear-gradient(135deg, rgba(26, 26, 46, 0.8), rgba(15, 23, 42, 0.9));
            border: 2px solid rgba(0, 212, 255, 0.2);
            border-radius: 50px;
            color: #a1a1aa;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
          }

          .tokenomics-tab.active {
            border-color: #00d4ff;
            color: #ffffff;
            background: linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(79, 143, 255, 0.2));
          }

          .tokenomics-tab:hover {
            border-color: rgba(0, 212, 255, 0.5);
            transform: translateY(-2px);
          }

          .tab-icon {
            width: 8px;
            height: 8px;
            background: currentColor;
            border-radius: 50%;
          }

          .tokenomics-main-card {
            background: linear-gradient(135deg, 
              rgba(26, 26, 46, 0.8) 0%, 
              rgba(15, 23, 42, 0.9) 100%
            );
            border: 2px solid rgba(0, 212, 255, 0.2);
            border-radius: 25px;
            padding: 2.5rem;
            position: relative;
            overflow: hidden;
            backdrop-filter: blur(20px);
            margin-bottom: 2rem;
          }

          .tokenomics-main-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 1px;
            background: linear-gradient(90deg, transparent, #00d4ff, transparent);
            opacity: 0.5;
          }

          .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2.5rem;
            flex-wrap: wrap;
            gap: 1rem;
          }

          .card-title {
            font-family: 'Orbitron', sans-serif;
            font-size: clamp(1.5rem, 4vw, 2rem);
            font-weight: 800;
            color: #ffffff;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            margin: 0;
          }

          .title-icon {
            font-size: 1.5rem;
          }

          .card-subtitle {
            color: #a1a1aa;
            font-size: 1.1rem;
            margin-top: 0.5rem;
            margin-bottom: 0;
          }

          .total-supply-badge {
            background: linear-gradient(135deg, #00d4ff, #4f8fff);
            color: #000;
            padding: 0.75rem 1.5rem;
            border-radius: 50px;
            font-weight: 900;
            font-size: 1.1rem;
            letter-spacing: 1px;
            white-space: nowrap;
            box-shadow: 0 8px 25px rgba(0, 212, 255, 0.3);
          }

          /* Enhanced Pie Chart Styles */
          .tokenomics-chart-container {
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 3rem 0;
            position: relative;
          }

          .tokenomics-chart {
            position: relative;
            width: 320px;
            height: 320px;
            border-radius: 50%;
            overflow: hidden;
            box-shadow: 0 0 50px rgba(0, 212, 255, 0.3);
          }

          .chart-segments {
            position: relative;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            overflow: hidden;
          }

          .chart-pie {
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            mask: radial-gradient(circle at center, transparent 35%, black 36%, black 100%);
            -webkit-mask: radial-gradient(circle at center, transparent 35%, black 36%, black 100%);
          }

          .chart-center {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 110px;
            height: 110px;
            background: linear-gradient(135deg, 
              rgba(10, 10, 15, 0.95) 0%, 
              rgba(26, 26, 46, 0.9) 100%
            );
            border: 3px solid rgba(0, 212, 255, 0.4);
            border-radius: 50%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 10;
            backdrop-filter: blur(10px);
            box-shadow: 0 0 30px rgba(0, 212, 255, 0.2);
          }

          .center-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.25rem;
            position: relative;
          }

          .center-logo {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            margin-bottom: 0.25rem;
            border: 2px solid rgba(0, 212, 255, 0.3);
            object-fit: contain;
          }

          .supply-amount {
            font-family: 'Orbitron', sans-serif;
            font-size: 1.5rem;
            font-weight: 900;
            color: #00d4ff;
            line-height: 1;
          }

          .supply-symbol {
            font-size: 0.9rem;
            font-weight: 700;
            color: #a1a1aa;
            letter-spacing: 1px;
          }

          /* Enhanced Legend Styles */
          .tokenomics-legend {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 1rem;
            margin-top: 2rem;
          }

          .legend-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem 1.5rem;
            background: linear-gradient(135deg, 
              rgba(15, 23, 42, 0.6) 0%, 
              rgba(26, 26, 46, 0.7) 100%
            );
            border: 1px solid rgba(0, 212, 255, 0.1);
            border-radius: 15px;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
          }

          .legend-item:hover {
            border-color: rgba(0, 212, 255, 0.4);
            background: linear-gradient(135deg, 
              rgba(15, 23, 42, 0.8) 0%, 
              rgba(26, 26, 46, 0.9) 100%
            );
          }

          .legend-item::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 1px;
            background: linear-gradient(90deg, transparent, currentColor, transparent);
            opacity: 0;
            transition: opacity 0.3s ease;
          }

          .legend-item:hover::before {
            opacity: 0.3;
          }

          .legend-color {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            flex-shrink: 0;
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
          }

          .legend-info {
            flex: 1;
            min-width: 0;
          }

          .legend-label {
            font-weight: 600;
            color: #ffffff;
            margin: 0 0 0.25rem 0;
            font-size: 0.95rem;
          }

          .legend-stats {
            display: flex;
            align-items: center;
            gap: 0.75rem;
          }

          .legend-percentage {
            font-weight: 800;
            color: #00d4ff;
            font-size: 1.1rem;
            font-family: 'Orbitron', sans-serif;
          }

          .legend-amount {
            color: #a1a1aa;
            font-size: 0.9rem;
            font-weight: 500;
          }

          /* Token Details Grid */
          .token-details-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
          }

          .detail-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.25rem 1.5rem;
            background: linear-gradient(135deg, 
              rgba(15, 23, 42, 0.6) 0%, 
              rgba(26, 26, 46, 0.7) 100%
            );
            border: 1px solid rgba(0, 212, 255, 0.1);
            border-radius: 12px;
            transition: all 0.3s ease;
          }

          .detail-item.featured {
            border-color: rgba(0, 212, 255, 0.3);
            background: linear-gradient(135deg, 
              rgba(0, 212, 255, 0.1) 0%, 
              rgba(79, 143, 255, 0.1) 100%
            );
          }

          .detail-item:hover {
            border-color: rgba(0, 212, 255, 0.4);
            transform: translateY(-2px);
          }

          .detail-label {
            color: #a1a1aa;
            font-weight: 600;
            font-size: 0.9rem;
          }

          .detail-value {
            color: #ffffff;
            font-weight: 700;
            text-align: right;
            font-family: 'Orbitron', sans-serif;
          }

          .detail-item.featured .detail-value {
            color: #00d4ff;
          }

          /* Utility Section */
          .utility-section {
            margin-top: 2rem;
            padding-top: 2rem;
            border-top: 1px solid rgba(0, 212, 255, 0.1);
          }

          .utility-title {
            font-size: 1.3rem;
            font-weight: 700;
            color: #ffffff;
            margin-bottom: 1.5rem;
            text-align: center;
          }

          .utility-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
          }

          .utility-item {
            padding: 1rem 1.5rem;
            background: linear-gradient(135deg, #00d4ff, #4f8fff);
            border-radius: 25px;
            text-align: center;
            transition: all 0.3s ease;
          }

          .utility-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 212, 255, 0.3);
          }

          .utility-text {
            color: #000;
            font-weight: 700;
            font-size: 0.9rem;
          }

          /* Blockchain Deployment Styles */
          .blockchain-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-bottom: 3rem;
          }

          .blockchain-card {
            background: linear-gradient(135deg, 
              rgba(15, 23, 42, 0.8) 0%, 
              rgba(26, 26, 46, 0.9) 100%
            );
            border: 2px solid rgba(0, 212, 255, 0.2);
            border-radius: 20px;
            padding: 2rem;
            transition: all 0.4s ease;
            position: relative;
            overflow: hidden;
          }

          .blockchain-card:hover {
            border-color: rgba(0, 212, 255, 0.5);
            box-shadow: 0 15px 40px rgba(0, 212, 255, 0.2);
          }

          .blockchain-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
          }

          .blockchain-info {
            display: flex;
            align-items: center;
            gap: 1rem;
          }

          .blockchain-icon {
            width: 50px;
            height: 50px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #000;
            font-weight: 900;
            font-size: 0.8rem;
          }

          .blockchain-name {
            font-size: 1.2rem;
            font-weight: 700;
            color: #ffffff;
            margin: 0 0 0.25rem 0;
          }

          .blockchain-network {
            color: #a1a1aa;
            font-size: 0.9rem;
            font-weight: 600;
          }

          .deployment-badge {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            background: rgba(0, 255, 136, 0.1);
            border: 1px solid rgba(0, 255, 136, 0.3);
            border-radius: 20px;
            padding: 0.5rem 1rem;
            font-size: 0.8rem;
            font-weight: 600;
            color: #00ff88;
          }

          .badge-dot {
            width: 6px;
            height: 6px;
            background: #00ff88;
            border-radius: 50%;
            animation: pulse 2s infinite;
          }

          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }

          .contract-section {
            margin-bottom: 1.5rem;
          }

          .contract-label {
            display: block;
            color: #a1a1aa;
            font-size: 0.9rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
          }

          .contract-address-container {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(0, 212, 255, 0.2);
            border-radius: 10px;
            padding: 0.75rem 1rem;
          }

          .contract-address {
            flex: 1;
            background: none;
            border: none;
            color: #00d4ff;
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 0.85rem;
            word-break: break-all;
          }

          .copy-button {
            background: none;
            border: none;
            color: #a1a1aa;
            cursor: pointer;
            padding: 0.25rem;
            border-radius: 6px;
            transition: all 0.3s ease;
          }

          .copy-button:hover {
            color: #00d4ff;
            background: rgba(0, 212, 255, 0.1);
          }

          .blockchain-actions {
            display: flex;
            justify-content: center;
          }

          .explorer-button {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1.5rem;
            background: linear-gradient(135deg, #00d4ff, #4f8fff);
            color: #000;
            text-decoration: none;
            border-radius: 25px;
            font-weight: 700;
            font-size: 0.9rem;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
          }

          .explorer-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 212, 255, 0.3);
          }

          .button-icon {
            font-size: 1rem;
          }

          .button-shine {
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
            transition: left 0.5s ease;
          }

          .explorer-button:hover .button-shine {
            left: 100%;
          }

          /* Bridge Info Card */
          .bridge-info-card {
            background: linear-gradient(135deg, 
              rgba(139, 92, 246, 0.1) 0%, 
              rgba(79, 143, 255, 0.1) 100%
            );
            border: 2px solid rgba(139, 92, 246, 0.3);
            border-radius: 20px;
            padding: 2rem;
            text-align: center;
          }

          .bridge-header {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1rem;
            flex-wrap: wrap;
          }

          .bridge-title {
            font-size: 1.3rem;
            font-weight: 700;
            color: #ffffff;
            margin: 0;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .bridge-icon {
            font-size: 1.5rem;
          }

          .coming-soon-badge {
            background: linear-gradient(135deg, #8b5cf6, #a855f7);
            color: #000;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-weight: 700;
            font-size: 0.8rem;
            letter-spacing: 1px;
          }

          .bridge-description {
            color: #a1a1aa;
            line-height: 1.6;
            margin: 0;
          }

          /* Responsive Design */
          @media (max-width: 768px) {
            .tokenomics-container {
              padding: 2rem 1rem;
            }

            .tokenomics-main-card {
              padding: 1.5rem;
            }

            .tokenomics-chart {
              width: 280px;
              height: 280px;
            }

            .chart-center {
              width: 90px;
              height: 90px;
            }

            .supply-amount {
              font-size: 1.2rem;
            }

            .supply-symbol {
              font-size: 0.8rem;
            }

            .tokenomics-legend {
              grid-template-columns: 1fr;
            }

            .token-details-grid {
              grid-template-columns: 1fr;
            }

            .utility-grid {
              grid-template-columns: repeat(2, 1fr);
            }

            .blockchain-grid {
              grid-template-columns: 1fr;
            }

            .card-header {
              flex-direction: column;
              align-items: flex-start;
              gap: 1rem;
            }

            .total-supply-badge {
              align-self: center;
            }
          }

          @media (max-width: 480px) {
            .tokenomics-container {
              padding: 1.5rem 0.75rem;
            }

            .tokenomics-tab-container {
              padding: 0 1rem;
              flex-direction: column;
              align-items: center;
            }

            .tokenomics-tab {
              padding: 0.75rem 1.5rem;
              width: 100%;
              max-width: 200px;
              justify-content: center;
            }

            .tokenomics-chart {
              width: 240px;
              height: 240px;
            }

            .chart-center {
              width: 75px;
              height: 75px;
            }

            .center-logo {
              width: 30px;
              height: 30px;
            }

            .supply-amount {
              font-size: 1rem;
            }

            .supply-symbol {
              font-size: 0.7rem;
            }

            .utility-grid {
              grid-template-columns: 1fr;
            }

            .legend-item {
              padding: 0.75rem 1rem;
            }

            .detail-item {
              padding: 1rem;
              flex-direction: column;
              text-align: center;
              gap: 0.5rem;
            }

            .detail-value {
              text-align: center;
            }

            .contract-address-container {
              flex-direction: column;
              align-items: stretch;
              gap: 0.5rem;
            }

                       .copy-button {
             align-self: center;
           }
         }

         /* Featured Sale Countdown Styles */
         .featured-sale-section {
           background: linear-gradient(135deg, 
             rgba(10, 10, 15, 0.95) 0%, 
             rgba(26, 26, 46, 0.9) 50%, 
             rgba(10, 10, 15, 0.95) 100%
           );
           padding: 4rem 2rem;
           text-align: center;
           border-bottom: 1px solid rgba(0, 212, 255, 0.1);
           position: relative;
         }

         .featured-sale-title {
           font-family: 'Orbitron', sans-serif;
           font-size: clamp(2rem, 5vw, 3rem);
           font-weight: 800;
           background: linear-gradient(135deg, #00d4ff 0%, #4f8fff 50%, #8b5cf6 100%);
           -webkit-background-clip: text;
           -webkit-text-fill-color: transparent;
           background-clip: text;
           margin: 0 0 1rem 0;
         }

         .featured-sale-subtitle {
           color: #a1a1aa;
           font-size: 1.2rem;
           margin-bottom: 3rem;
         }

         .countdown-container {
           margin: 3rem 0;
         }

         .countdown-title {
           color: #ffffff;
           font-size: 1.5rem;
           font-weight: 600;
           margin-bottom: 2rem;
           font-family: 'Orbitron', sans-serif;
         }

         .countdown-timer {
           display: flex;
           justify-content: center;
           align-items: center;
           gap: 1.5rem;
           flex-wrap: wrap;
           margin-bottom: 3rem;
         }

         .countdown-segment {
           display: flex;
           flex-direction: column;
           align-items: center;
           background: linear-gradient(135deg, 
             rgba(15, 23, 42, 0.9) 0%, 
             rgba(26, 26, 46, 0.8) 100%
           );
           border: 2px solid rgba(0, 212, 255, 0.3);
           border-radius: 20px;
           padding: 1.5rem 1rem;
           min-width: 100px;
           position: relative;
           overflow: hidden;
           backdrop-filter: blur(10px);
         }

         .countdown-segment::before {
           content: '';
           position: absolute;
           top: 0;
           left: 0;
           right: 0;
           height: 1px;
           background: linear-gradient(90deg, transparent, #00d4ff, transparent);
           opacity: 0.7;
         }

         .countdown-number {
           font-family: 'Orbitron', 'Monaco', monospace;
           font-size: 3rem;
           font-weight: 900;
           color: #ffffff;
           line-height: 1;
           margin-bottom: 0.5rem;
           text-shadow: 0 0 20px rgba(0, 212, 255, 0.5);
         }

         .countdown-label {
           color: #00d4ff;
           font-size: 0.9rem;
           font-weight: 700;
           text-transform: uppercase;
           letter-spacing: 2px;
           border-bottom: 2px solid #00d4ff;
           padding-bottom: 0.25rem;
         }

         .countdown-letter {
           color: #a1a1aa;
           font-size: 1.2rem;
           font-weight: 600;
           margin-top: 0.5rem;
         }

         .countdown-separator {
           color: #00d4ff;
           font-size: 2rem;
           font-weight: 900;
           font-family: 'Orbitron', sans-serif;
           margin: 0 0.5rem;
         }

         .sale-info-grid {
           display: grid;
           grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
           gap: 2rem;
           max-width: 800px;
           margin: 0 auto;
         }

         .sale-info-card {
           background: linear-gradient(135deg, 
             rgba(0, 212, 255, 0.1) 0%, 
             rgba(79, 143, 255, 0.1) 100%
           );
           border: 2px solid rgba(0, 212, 255, 0.3);
           border-radius: 20px;
           padding: 2rem 1.5rem;
           text-align: center;
           position: relative;
           overflow: hidden;
           transition: all 0.3s ease;
         }

         .sale-info-card:hover {
           border-color: rgba(0, 212, 255, 0.6);
           transform: translateY(-5px);
           box-shadow: 0 15px 40px rgba(0, 212, 255, 0.2);
         }

         .sale-info-card::before {
           content: '';
           position: absolute;
           top: 0;
           left: 0;
           right: 0;
           height: 2px;
           background: linear-gradient(90deg, transparent, #00d4ff, transparent);
           opacity: 0;
           transition: opacity 0.3s ease;
         }

         .sale-info-card:hover::before {
           opacity: 1;
         }

         .sale-info-label {
           color: #a1a1aa;
           font-size: 0.9rem;
           font-weight: 600;
           text-transform: uppercase;
           letter-spacing: 1px;
           margin-bottom: 1rem;
         }

         .sale-info-value {
           font-family: 'Orbitron', sans-serif;
           font-size: 1.8rem;
           font-weight: 900;
           color: #00d4ff;
           line-height: 1;
         }

         .sale-info-card.featured .sale-info-value {
           color: #00ff88;
           font-size: 2.2rem;
         }

         .sale-cta-section {
           margin-top: 3rem;
           display: flex;
           justify-content: center;
           gap: 1.5rem;
           flex-wrap: wrap;
         }

         .sale-cta-button {
           display: inline-flex;
           align-items: center;
           gap: 0.75rem;
           padding: 1.25rem 2.5rem;
           background: linear-gradient(135deg, #00d4ff 0%, #4f8fff 50%, #8b5cf6 100%);
           border: none;
           border-radius: 50px;
           color: #000;
           font-size: 1.1rem;
           font-weight: 700;
           text-transform: uppercase;
           letter-spacing: 1px;
           cursor: pointer;
           transition: all 0.4s ease;
           text-decoration: none;
           position: relative;
           overflow: hidden;
           box-shadow: 0 8px 30px rgba(0, 212, 255, 0.3);
         }

         .sale-cta-button:hover {
           transform: translateY(-3px);
           box-shadow: 0 15px 60px rgba(0, 212, 255, 0.5);
         }

         .sale-cta-button.secondary {
           background: linear-gradient(135deg, 
             rgba(26, 26, 46, 0.8) 0%, 
             rgba(15, 23, 42, 0.9) 100%
           );
           border: 2px solid #00d4ff;
           color: #00d4ff;
         }

         .sale-cta-button.secondary:hover {
           background: rgba(0, 212, 255, 0.1);
         }

         @media (max-width: 768px) {
           .featured-sale-section {
             padding: 3rem 1rem;
           }

           .countdown-timer {
             gap: 1rem;
           }

           .countdown-segment {
             padding: 1rem 0.75rem;
             min-width: 80px;
           }

           .countdown-number {
             font-size: 2.2rem;
           }

           .countdown-separator {
             font-size: 1.5rem;
             margin: 0 0.25rem;
           }

           .sale-info-grid {
             grid-template-columns: 1fr;
             gap: 1.5rem;
           }

           .sale-cta-section {
             flex-direction: column;
             align-items: center;
           }

           .sale-cta-button {
             width: 100%;
             max-width: 300px;
           }
         }

         @media (max-width: 480px) {
           .countdown-timer {
             gap: 0.5rem;
           }

           .countdown-segment {
             padding: 0.75rem 0.5rem;
             min-width: 70px;
           }

           .countdown-number {
             font-size: 1.8rem;
           }

           .countdown-label {
             font-size: 0.7rem;
             letter-spacing: 1px;
           }

           .countdown-separator {
             font-size: 1.2rem;
           }

           .sale-info-value {
             font-size: 1.5rem;
           }

           .sale-info-card.featured .sale-info-value {
             font-size: 1.8rem;
           }
         }
        `}
      </style>
      
      {/* Enhanced Hero Section with Logo */}
      <motion.div 
        className="tokenomics-hero"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Logo and Title Section */}
        <div className="hero-logo-section">
          <motion.img 
            src="/coinlogo.png" 
            alt="WhalesPad Token" 
            className="token-hero-logo"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          />
          <motion.h1 
            className="token-hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            WhalesPad Token
          </motion.h1>
          <motion.div 
            className="token-symbol-badge"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            WPT
          </motion.div>
        </div>

        <motion.p 
          className="token-hero-description"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          The future of decentralized launchpad ecosystems with multi-chain deployment
        </motion.p>
        
        {/* Token Overview Stats */}
        <motion.div 
          className="token-stats-grid"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <div className="token-stat-card">
            <div className="stat-value">2B</div>
            <div className="stat-label">Total Supply</div>
          </div>
          <div className="token-stat-card">
            <div className="stat-value">$0.08</div>
            <div className="stat-label">Launch Price</div>
          </div>
          <div className="token-stat-card">
            <div className="stat-value">2</div>
            <div className="stat-label">Active Chains</div>
          </div>
        </motion.div>

        <motion.button 
          onClick={() => window.location.href = '/submit-project'}
          className="token-cta-button"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>Launch Your Project</span>
          <div className="button-shine"></div>
        </motion.button>
      </motion.div>
      
      {/* Featured Sale Section with Countdown */}
      <motion.div 
        className="featured-sale-section"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <motion.h2 
          className="featured-sale-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Featured Sale
        </motion.h2>
        
        <motion.p 
          className="featured-sale-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Join the exclusive presale with early bird pricing
        </motion.p>

        {/* Countdown Timer */}
        <motion.div 
          className="countdown-container"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <h3 className="countdown-title">Countdown to start time</h3>
          
          <div className="countdown-timer">
            <div className="countdown-segment">
              <div className="countdown-number">
                {String(timeLeft.days).padStart(2, '0')}
              </div>
              <div className="countdown-label">DAYS</div>
              <div className="countdown-letter">D</div>
            </div>
            
            <div className="countdown-separator">:</div>
            
            <div className="countdown-segment">
              <div className="countdown-number">
                {String(timeLeft.hours).padStart(2, '0')}
              </div>
              <div className="countdown-label">HOURS</div>
              <div className="countdown-letter">H</div>
            </div>
            
            <div className="countdown-separator">:</div>
            
            <div className="countdown-segment">
              <div className="countdown-number">
                {String(timeLeft.minutes).padStart(2, '0')}
              </div>
              <div className="countdown-label">MINS</div>
              <div className="countdown-letter">M</div>
            </div>
            
            <div className="countdown-separator">:</div>
            
            <div className="countdown-segment">
              <div className="countdown-number">
                {String(timeLeft.seconds).padStart(2, '0')}
              </div>
              <div className="countdown-label">SECS</div>
              <div className="countdown-letter">S</div>
            </div>
          </div>
        </motion.div>

        {/* Sale Information */}
        <motion.div 
          className="sale-info-grid"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <div className="sale-info-card featured">
            <div className="sale-info-label">Current Price</div>
            <div className="sale-info-value">$0.008</div>
          </div>
          
          <div className="sale-info-card">
            <div className="sale-info-label">Minimum Buy</div>
            <div className="sale-info-value">$20</div>
          </div>
          
          <div className="sale-info-card">
            <div className="sale-info-label">CEX Listing Price</div>
            <div className="sale-info-value">$0.015</div>
          </div>
        </motion.div>

        {/* Call to Action Buttons */}
        <motion.div 
          className="sale-cta-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <button 
            onClick={() => window.location.href = '/create-presale'}
            className="sale-cta-button"
          >
            <span>Join Presale</span>
          </button>
          
          <a 
            href="/ido-sales" 
            className="sale-cta-button secondary"
          >
            <span>View Details</span>
          </a>
        </motion.div>
      </motion.div>
      
      {/* Tokenomics Container */}
      <div className="tokenomics-container">
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
          <span className="tab-icon"></span>
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
                  {/* Generate pie chart with proper conic gradient */}
                  <div 
                    className="chart-pie"
                    style={{
                      background: `conic-gradient(
                        ${tokenomicsData.map((item, index) => {
                          const startPercent = tokenomicsData.slice(0, index).reduce((sum, item) => sum + item.percentage, 0);
                          const endPercent = startPercent + item.percentage;
                          return `${item.color} ${startPercent}% ${endPercent}%`;
                        }).join(', ')}
                      )`
                    }}
                  />
                  <div className="chart-center">
                    <div className="center-content">
                      <img 
                        src="/coinlogo.png" 
                        alt="WhalesPad Logo" 
                        className="center-logo"
                      />
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
                <span className="title-icon"></span>
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
      
      </div> {/* End of tokenomics-container */}

    </div>
  );
};

export default TokenSale; 
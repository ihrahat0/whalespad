import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';
import BlogNavbar from '../components/BlogNavbar';
import Footer from '../components/Footer';
import { ConnectWalletButton } from '../components/ConnectWalletButton';

// Extend Window interface for ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      selectedAddress?: string;
    };
  }
}

interface StakingPool {
  id: string;
  name: string;
  token_symbol: string;
  apy: number;
  min_stake: number;
  lock_period: number;
  total_staked: number;
  max_capacity: number;
  status: 'active' | 'upcoming' | 'ended';
  description: string;
  logo_url: string;
}

interface AirdropCampaign {
  id: string;
  name: string;
  token_symbol: string;
  total_allocation: number;
  participants: number;
  end_date: string;
  status: 'active' | 'upcoming' | 'ended';
  requirements: string[];
  reward_per_user: number;
  logo_url: string;
}

const StakingAirdrop: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'staking' | 'airdrops'>('staking');
  const [stakingPools, setStakingPools] = useState<StakingPool[]>([]);
  const [airdropCampaigns, setAirdropCampaigns] = useState<AirdropCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [stakeAmount, setStakeAmount] = useState('');
  const [selectedPool, setSelectedPool] = useState<StakingPool | null>(null);
  const [userStakes, setUserStakes] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    loadMockData();
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        setIsConnected(accounts && accounts.length > 0);
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    }
  };

  const loadMockData = async () => {
    // Mock staking pools
    const mockStakingPools: StakingPool[] = [
      {
        id: '1',
        name: 'WhalesPad Core',
        token_symbol: 'WHALE',
        apy: 125.5,
        min_stake: 100,
        lock_period: 30,
        total_staked: 2500000,
        max_capacity: 5000000,
        status: 'active',
        description: 'Stake WHALE tokens to earn rewards and gain access to exclusive IDO allocations',
        logo_url: '/images/logo/logo.png'
      },
      {
        id: '2',
        name: 'High Yield Pool',
        token_symbol: 'WHALE',
        apy: 200.0,
        min_stake: 1000,
        lock_period: 90,
        total_staked: 1200000,
        max_capacity: 2000000,
        status: 'active',
        description: 'Higher rewards for longer commitment periods',
        logo_url: '/images/logo/logo.png'
      },
      {
        id: '3',
        name: 'Flexible Pool',
        token_symbol: 'WHALE',
        apy: 85.0,
        min_stake: 50,
        lock_period: 0,
        total_staked: 800000,
        max_capacity: 1500000,
        status: 'active',
        description: 'No lock period, withdraw anytime with competitive APY',
        logo_url: '/images/logo/logo.png'
      }
    ];

    // Mock airdrop campaigns
    const mockAirdrops: AirdropCampaign[] = [
      {
        id: '1',
        name: 'Genesis Airdrop',
        token_symbol: 'WHALE',
        total_allocation: 1000000,
        participants: 15420,
        end_date: '2024-02-15',
        status: 'active',
        requirements: ['Hold 100+ WHALE tokens', 'Complete KYC', 'Join Telegram'],
        reward_per_user: 50,
        logo_url: '/images/logo/logo.png'
      },
      {
        id: '2',
        name: 'Community Rewards',
        token_symbol: 'WHALE',
        total_allocation: 500000,
        participants: 8900,
        end_date: '2024-03-01',
        status: 'upcoming',
        requirements: ['Follow on Twitter', 'Retweet announcement', 'Join Discord'],
        reward_per_user: 25,
        logo_url: '/images/logo/logo.png'
      },
      {
        id: '3',
        name: 'Loyalty Bonus',
        token_symbol: 'WHALE',
        total_allocation: 750000,
        participants: 12100,
        end_date: '2024-01-20',
        status: 'ended',
        requirements: ['Stake for 60+ days', 'Participate in governance'],
        reward_per_user: 75,
        logo_url: '/images/logo/logo.png'
      }
    ];

    setStakingPools(mockStakingPools);
    setAirdropCampaigns(mockAirdrops);
    setLoading(false);
  };

  const handleStake = async (pool: StakingPool) => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    if (!stakeAmount || parseFloat(stakeAmount) < pool.min_stake) {
      alert(`Minimum stake amount is ${pool.min_stake} ${pool.token_symbol}`);
      return;
    }

    try {
      // Mock staking transaction
      alert(`🎉 Successfully staked ${stakeAmount} ${pool.token_symbol} in ${pool.name}!
      
APY: ${pool.apy}%
Lock Period: ${pool.lock_period} days
Estimated Daily Rewards: ${(parseFloat(stakeAmount) * pool.apy / 365 / 100).toFixed(4)} ${pool.token_symbol}`);
      
      setStakeAmount('');
      setSelectedPool(null);
    } catch (error) {
      console.error('Staking error:', error);
      alert('Transaction failed. Please try again.');
    }
  };

  const handleAirdropClaim = async (airdrop: AirdropCampaign) => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    if (airdrop.status !== 'active') {
      alert('This airdrop is not currently active');
      return;
    }

    try {
      // Mock airdrop claim
      alert(`🎉 Successfully claimed ${airdrop.reward_per_user} ${airdrop.token_symbol} from ${airdrop.name}!
      
Tokens will be distributed to your wallet within 24 hours.`);
    } catch (error) {
      console.error('Airdrop claim error:', error);
      alert('Claim failed. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#00ff88';
      case 'upcoming': return '#ffd700';
      case 'ended': return '#666';
      default: return '#666';
    }
  };

  if (loading) {
    return (
      <div className="staking-airdrop-page">
        <BlogNavbar />
        <div className="staking-main-content">
          <div className="container">
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <h2>Loading Staking & Airdrops...</h2>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="staking-airdrop-page">
      <BlogNavbar />
      
      {/* Hero Section */}
      <div className="staking-hero-section">
        <div className="container">
          <motion.div 
            className="hero-content-staking"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="hero-badges-staking">
              <div className="status-badge-staking live">
                <span className="status-dot"></span>
                EARN REWARDS
              </div>
              <div className="status-badge-staking rated">
                <span className="rating-stars">⭐</span>
                HIGH APY
              </div>
            </div>

            <h1 className="staking-hero-title">
              <span className="title-line">Staking &</span>
              <span className="title-line title-accent">Airdrops</span>
            </h1>
            
            <p className="staking-hero-subtitle">
              Stake your tokens to earn rewards and participate in exclusive airdrops. 
              Join our community-driven ecosystem and maximize your returns.
            </p>

            <div className="hero-stats-staking">
              <div className="stat-item-staking">
                <span className="stat-number-staking">$2.5M+</span>
                <span className="stat-label-staking">Total Staked</span>
              </div>
              <div className="stat-item-staking">
                <span className="stat-number-staking">125%</span>
                <span className="stat-label-staking">Max APY</span>
              </div>
              <div className="stat-item-staking">
                <span className="stat-number-staking">15,420</span>
                <span className="stat-label-staking">Stakers</span>
              </div>
            </div>

            <div className="hero-wallet-section">
              <ConnectWalletButton />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="staking-main-content">
        <div className="container">
          {/* Tabs */}
          <motion.div 
            className="staking-tabs"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <button 
              className={`tab-button-staking ${activeTab === 'staking' ? 'active' : ''}`}
              onClick={() => setActiveTab('staking')}
            >
              <span className="tab-icon">🔒</span>
              Staking Pools
            </button>
            <button 
              className={`tab-button-staking ${activeTab === 'airdrops' ? 'active' : ''}`}
              onClick={() => setActiveTab('airdrops')}
            >
              <span className="tab-icon">🪂</span>
              Airdrops
            </button>
          </motion.div>

          {/* Staking Pools Tab */}
          {activeTab === 'staking' && (
            <motion.div 
              className="staking-pools-section"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="section-header-staking">
                <h2>Available Staking Pools</h2>
                <p>Choose a pool that matches your investment strategy</p>
              </div>

              <div className="pools-grid">
                {stakingPools.map((pool, index) => (
                  <motion.div 
                    key={pool.id}
                    className="pool-card-modern"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <div className="pool-header">
                      <div className="pool-logo-section">
                        <img src={pool.logo_url} alt={pool.name} className="pool-logo" />
                        <div className="pool-info">
                          <h3 className="pool-name">{pool.name}</h3>
                          <span className="pool-symbol">${pool.token_symbol}</span>
                        </div>
                      </div>
                      <div className="pool-status-badge" style={{ color: getStatusColor(pool.status) }}>
                        {pool.status.toUpperCase()}
                      </div>
                    </div>

                    <p className="pool-description">{pool.description}</p>

                    <div className="pool-metrics">
                      <div className="metric-item">
                        <span className="metric-label">APY</span>
                        <span className="metric-value primary">{pool.apy}%</span>
                      </div>
                      <div className="metric-item">
                        <span className="metric-label">Min Stake</span>
                        <span className="metric-value">{pool.min_stake.toLocaleString()} {pool.token_symbol}</span>
                      </div>
                      <div className="metric-item">
                        <span className="metric-label">Lock Period</span>
                        <span className="metric-value">{pool.lock_period} days</span>
                      </div>
                    </div>

                    <div className="pool-progress">
                      <div className="progress-info">
                        <span>Pool Utilization</span>
                        <span>{((pool.total_staked / pool.max_capacity) * 100).toFixed(1)}%</span>
                      </div>
                      <div className="progress-bar-staking">
                        <div 
                          className="progress-fill-staking"
                          style={{ width: `${(pool.total_staked / pool.max_capacity) * 100}%` }}
                        ></div>
                      </div>
                      <div className="progress-amounts">
                        <span>{(pool.total_staked / 1000000).toFixed(1)}M staked</span>
                        <span>{(pool.max_capacity / 1000000).toFixed(1)}M capacity</span>
                      </div>
                    </div>

                    <div className="pool-stake-section">
                      <div className="stake-input-group">
                        <input
                          type="number"
                          className="stake-input-modern"
                          placeholder={`Min ${pool.min_stake} ${pool.token_symbol}`}
                          value={selectedPool?.id === pool.id ? stakeAmount : ''}
                          onChange={(e) => {
                            setStakeAmount(e.target.value);
                            setSelectedPool(pool);
                          }}
                        />
                        <span className="input-suffix">{pool.token_symbol}</span>
                      </div>
                      <button 
                        className="stake-button-modern"
                        onClick={() => handleStake(pool)}
                        disabled={!isConnected}
                      >
                        <span className="btn-icon">🔒</span>
                        <span className="btn-text">Stake Now</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Airdrops Tab */}
          {activeTab === 'airdrops' && (
            <motion.div 
              className="airdrops-section"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="section-header-staking">
                <h2>Active Airdrop Campaigns</h2>
                <p>Complete tasks and claim your free tokens</p>
              </div>

              <div className="airdrops-grid">
                {airdropCampaigns.map((airdrop, index) => (
                  <motion.div 
                    key={airdrop.id}
                    className="airdrop-card-modern"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <div className="airdrop-header">
                      <div className="airdrop-logo-section">
                        <img src={airdrop.logo_url} alt={airdrop.name} className="airdrop-logo" />
                        <div className="airdrop-info">
                          <h3 className="airdrop-name">{airdrop.name}</h3>
                          <span className="airdrop-symbol">${airdrop.token_symbol}</span>
                        </div>
                      </div>
                      <div className="airdrop-status-badge" style={{ color: getStatusColor(airdrop.status) }}>
                        {airdrop.status.toUpperCase()}
                      </div>
                    </div>

                    <div className="airdrop-metrics">
                      <div className="metric-row">
                        <div className="metric-item">
                          <span className="metric-label">Reward</span>
                          <span className="metric-value primary">{airdrop.reward_per_user} {airdrop.token_symbol}</span>
                        </div>
                        <div className="metric-item">
                          <span className="metric-label">Participants</span>
                          <span className="metric-value">{airdrop.participants.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="metric-row">
                        <div className="metric-item">
                          <span className="metric-label">Total Pool</span>
                          <span className="metric-value">{(airdrop.total_allocation / 1000000).toFixed(1)}M {airdrop.token_symbol}</span>
                        </div>
                        <div className="metric-item">
                          <span className="metric-label">End Date</span>
                          <span className="metric-value">{new Date(airdrop.end_date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="airdrop-requirements">
                      <h4>Requirements:</h4>
                      <ul className="requirements-list">
                        {airdrop.requirements.map((req, idx) => (
                          <li key={idx} className="requirement-item">
                            <span className="req-check">✅</span>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button 
                      className={`airdrop-button-modern ${airdrop.status !== 'active' ? 'disabled' : ''}`}
                      onClick={() => handleAirdropClaim(airdrop)}
                      disabled={!isConnected || airdrop.status !== 'active'}
                    >
                      <span className="btn-icon">🪂</span>
                      <span className="btn-text">
                        {airdrop.status === 'active' ? 'Claim Airdrop' : 
                         airdrop.status === 'upcoming' ? 'Coming Soon' : 'Ended'}
                      </span>
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default StakingAirdrop; 
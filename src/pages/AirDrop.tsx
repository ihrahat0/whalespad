import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BlogNavbar from '../components/BlogNavbar';
import { ConnectWalletButton } from '../components/ConnectWalletButton';
import Navigation from '../components/Navigation';

interface AirdropCampaign {
  id: string;
  name: string;
  description: string;
  totalRewards: string;
  endDate: string;
  status: 'active' | 'upcoming' | 'ended';
  claimed: boolean;
  claimableAmount: string;
  requirements: {
    description: string;
    completed: boolean;
  }[];
  participants: number;
  maxParticipants: number;
  logo?: string;
}

const AirDrop: React.FC = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [claimingId, setClaimingId] = useState<string | null>(null);

  // Mock airdrop campaigns data
  const [airdropCampaigns] = useState<AirdropCampaign[]>([
    {
      id: '1',
      name: 'Genesis Airdrop',
      description: 'Exclusive airdrop for early WhalesPad community members and supporters',
      totalRewards: '1,000,000 WPD',
      endDate: '2024-03-15',
      status: 'active',
      claimed: false,
      claimableAmount: '2,500 WPD',
      requirements: [
        { description: 'Join WhalesPad Telegram', completed: true },
        { description: 'Follow WhalesPad Twitter', completed: true },
        { description: 'Hold minimum 0.1 ETH', completed: true },
        { description: 'Complete KYC verification', completed: false }
      ],
      participants: 8420,
      maxParticipants: 10000
    },
    {
      id: '2',
      name: 'Community Rewards',
      description: 'Rewards for active community members who participate in governance and discussions',
      totalRewards: '500,000 WPD',
      endDate: '2024-04-20',
      status: 'upcoming',
      claimed: false,
      claimableAmount: '1,250 WPD',
      requirements: [
        { description: 'Participate in 3+ governance votes', completed: false },
        { description: 'Refer 5+ friends to platform', completed: false },
        { description: 'Complete social media tasks', completed: true },
        { description: 'Stake minimum 1000 WPD', completed: false }
      ],
      participants: 3200,
      maxParticipants: 5000
    },
    {
      id: '3',
      name: 'Loyalty Bonus',
      description: 'Special bonus for long-term holders and platform loyalists',
      totalRewards: '2,000,000 WPD',
      endDate: '2024-02-28',
      status: 'ended',
      claimed: true,
      claimableAmount: '5,000 WPD',
      requirements: [
        { description: 'Hold WPD tokens for 6+ months', completed: true },
        { description: 'Never sold more than 25%', completed: true },
        { description: 'Participated in IDO launches', completed: true },
        { description: 'Active platform user', completed: true }
      ],
      participants: 12500,
      maxParticipants: 15000
    }
  ]);

  useEffect(() => {
    // Mock wallet connection check
    const checkWalletConnection = () => {
      // This would be replaced with actual wallet connection logic
      setIsWalletConnected(!!window.ethereum);
    };
    checkWalletConnection();
  }, []);

  const handleClaimAirdrop = async (campaignId: string) => {
    if (!isWalletConnected) {
      alert('Please connect your wallet first');
      return;
    }

    setClaimingId(campaignId);
    
    try {
      // Simulate claim process
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Airdrop claimed successfully!');
    } catch (error) {
      alert('Failed to claim airdrop. Please try again.');
    } finally {
      setClaimingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#00ff88';
      case 'upcoming': return '#ffa500';
      case 'ended': return '#ff6b6b';
      default: return '#888';
    }
  };

  const calculateProgress = (participants: number, maxParticipants: number) => {
    return (participants / maxParticipants) * 100;
  };

  const isEligibleToClaim = (campaign: AirdropCampaign) => {
    return campaign.requirements.every(req => req.completed) && 
           campaign.status === 'active' && 
           !campaign.claimed;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black text-white">
      <Navigation />
      {/* <BlogNavbar /> */}
      
      {/* Hero Section */}
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.h1 
              className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              AirDrops
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Claim exclusive token rewards and participate in our community airdrop campaigns
            </motion.p>
            
            {/* Stats */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="airdrop-stat-card">
                <div className="text-4xl md:text-5xl font-bold text-blue-400 mb-2">3.5M+</div>
                <div className="text-lg text-gray-300">Total Distributed</div>
              </div>
              <div className="airdrop-stat-card">
                <div className="text-4xl md:text-5xl font-bold text-green-400 mb-2">24,120</div>
                <div className="text-lg text-gray-300">Total Recipients</div>
              </div>
              <div className="airdrop-stat-card">
                <div className="text-4xl md:text-5xl font-bold text-purple-400 mb-2">15</div>
                <div className="text-lg text-gray-300">Active Campaigns</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Airdrop Campaigns */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Available Airdrops
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {airdropCampaigns.map((campaign, index) => (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="airdrop-campaign-card group"
                  whileHover={{ y: -5 }}
                >
                  <div className="campaign-header">
                    <div className="campaign-status-badge" 
                         style={{ backgroundColor: getStatusColor(campaign.status) }}>
                      {campaign.status.toUpperCase()}
                    </div>
                    <div className="campaign-rewards">
                      {campaign.totalRewards}
                    </div>
                  </div>

                  <div className="campaign-content">
                    <h3 className="campaign-title">{campaign.name}</h3>
                    <p className="campaign-description">{campaign.description}</p>

                    {/* Participation Progress */}
                    <div className="participation-info">
                      <div className="participation-header">
                        <span>Participants</span>
                        <span>{campaign.participants.toLocaleString()}/{campaign.maxParticipants.toLocaleString()}</span>
                      </div>
                      <div className="progress-bar">
                        <motion.div 
                          className="progress-fill"
                          initial={{ width: 0 }}
                          animate={{ width: `${calculateProgress(campaign.participants, campaign.maxParticipants)}%` }}
                          transition={{ duration: 1, delay: index * 0.1 + 1 }}
                        />
                      </div>
                    </div>

                    {/* Requirements */}
                    <div className="requirements-section">
                      <h4 className="requirements-title">Requirements:</h4>
                      <div className="requirements-list">
                        {campaign.requirements.map((req, reqIndex) => (
                          <div key={reqIndex} className={`requirement-item ${req.completed ? 'completed' : 'pending'}`}>
                            <span className="requirement-icon">
                              {req.completed ? '✅' : '⏳'}
                            </span>
                            <span className="requirement-text">{req.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Claimable Amount */}
                    <div className="claimable-section">
                      <div className="claimable-label">Your Reward:</div>
                      <div className="claimable-amount">{campaign.claimableAmount}</div>
                    </div>

                    {/* Action Button */}
                    <div className="campaign-actions">
                      {campaign.status === 'ended' ? (
                        <button className="claim-button disabled">
                          Campaign Ended
                        </button>
                      ) : campaign.status === 'upcoming' ? (
                        <button className="claim-button upcoming">
                          Coming Soon
                        </button>
                      ) : campaign.claimed ? (
                        <button className="claim-button claimed">
                          ✅ Claimed
                        </button>
                      ) : isEligibleToClaim(campaign) ? (
                        <motion.button
                          className="claim-button active"
                          onClick={() => handleClaimAirdrop(campaign.id)}
                          disabled={claimingId === campaign.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {claimingId === campaign.id ? (
                            <span className="loading-spinner">⏳ Claiming...</span>
                          ) : (
                            <>
                              🎁 Claim Airdrop
                              <div className="button-shine"></div>
                            </>
                          )}
                        </motion.button>
                      ) : (
                        <button className="claim-button requirements-not-met">
                          Complete Requirements
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Wallet Connection Notice */}
          {!isWalletConnected && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="wallet-notice-card mt-16"
            >
              <div className="notice-icon"></div>
              <div className="notice-content">
                <h3 className="notice-title">Connect Your Wallet</h3>
                <p className="notice-description">
                  Connect your wallet to check eligibility and claim your airdrops
                </p>
                <ConnectWalletButton />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AirDrop; 
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { ConnectWalletButton } from '../components/ConnectWalletButton';
import BlogNavbar from '../components/BlogNavbar';
import Footer from '../components/Footer';

// Extend Window interface for ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      selectedAddress?: string;
    };
  }
}

interface DatabaseProject {
  id: string;
  project_name: string;
  token_symbol: string;
  category: string;
  description: string;
  full_description: string;
  features: string[];
  rating: number;
  logo_url: string;
  banner_url: string;
  website: string;
  telegram: string;
  twitter: string;
  discord: string;
  medium: string;
  whitepaper: string;
  audit_link: string;
  has_audit: boolean;
  total_supply: number;
  presale_price: number;
  listing_price: number;
  min_contribution: number;
  max_contribution: number;
  soft_cap: number;
  hard_cap: number;
  current_raised: number;
  investor_count: number;
  presale_start: string;
  presale_end: string;
  liquidity_percent: string;
  liquidity_lock_time: string;
  expected_roi: string;
  contract_address: string;
  progress_percentage: number;
  time_left: string;
  // IDO pool info from updated view
  chain_id?: number;
  native_token_symbol?: string;
  presale_contract_address?: string;
  ido_pool_id?: string;
  ido_chain_id?: number;
  ido_token_address?: string;
  ido_total_supply?: number;
  ido_hard_cap?: number;
  ido_soft_cap?: number;
  min_allocation?: number;
  max_allocation?: number;
  presale_rate?: number;
  listing_rate?: number;
  ido_start_date?: string;
  ido_end_date?: string;
  ido_status?: string;
  ido_presale_contract?: string;
  ido_native_symbol?: string;
  computed_ido_status?: string;
  real_current_raised?: number;
  real_investor_count?: number;
  real_progress_percentage?: number;
  tokens_sold?: number;
  stats_last_updated?: string;
  ido_pool_info?: {
    presale_contract_address?: string;
    chain_id?: number;
    native_token_symbol?: string;
    total_supply?: number;
    hard_cap?: number;
    soft_cap?: number;
    min_allocation?: number;
    max_allocation?: number;
    presale_rate?: number;
    listing_rate?: number;
    start_date?: string;
    end_date?: string;
    status?: string;
  };
  team_members?: Array<{
    name: string;
    position: string;
    experience: string;
    linkedin_url: string;
    image_url: string;
  }>;
  tokenomics?: Array<{
    name: string;
    percentage: number;
    amount: number;
    color: string;
    description: string;
  }>;
  roadmap?: Array<{
    quarter: string;
    phase: string;
    status: string;
    description: string;
    tasks: string[];
  }>;
  partnerships?: Array<{
    name: string;
    logo: string;
    description: string;
  }>;
}

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [investAmount, setInvestAmount] = useState('');
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [project, setProject] = useState<DatabaseProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        if (!id) {
          throw new Error('No project ID provided');
        }

        const { data, error } = await supabase
          .from('project_details_view')
          .select('*')
          .eq('slug', id)
          .single();

        if (error) {
          console.error('Error fetching project:', error);
          throw new Error('Project not found or has been deleted');
        }

        if (!data) {
          throw new Error('Project not found or has been deleted');
        }

        setProject(data);
      } catch (err: any) {
        console.error('Error loading project:', err);
        setError(err.message || 'Failed to load project data');
        
        // Redirect to home page after 3 seconds if project doesn't exist
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [id, navigate]);

  // Helper function to get chain info and native token symbol
  const getChainInfo = (chainId?: number) => {
    const chains = {
      1: { name: 'Ethereum', symbol: 'ETH', rpc: 'https://mainnet.infura.io/v3/' },
      56: { name: 'BNB Smart Chain', symbol: 'BNB', rpc: 'https://bsc-dataseed.binance.org/' },
      137: { name: 'Polygon', symbol: 'MATIC', rpc: 'https://polygon-rpc.com/' },
      42161: { name: 'Arbitrum', symbol: 'ETH', rpc: 'https://arb1.arbitrum.io/rpc' },
      10: { name: 'Optimism', symbol: 'ETH', rpc: 'https://mainnet.optimism.io/' }
    };
    return chains[chainId as keyof typeof chains] || { name: 'Ethereum', symbol: 'ETH', rpc: '' };
  };

  // Get the native token symbol for the project - FIXED LOGIC
  const getNativeTokenSymbol = () => {
    // Priority 1: IDO pool native symbol
    if (project?.ido_native_symbol) {
      return project.ido_native_symbol;
    }
    
    // Priority 2: Chain ID from IDO pool
    if (project?.ido_chain_id) {
      return getChainInfo(project.ido_chain_id).symbol;
    }
    
    // Priority 3: Project chain ID
    if (project?.chain_id) {
      return getChainInfo(project.chain_id).symbol;
    }

    // Priority 4: Native token symbol from project submissions
    if (project?.native_token_symbol && project?.native_token_symbol !== 'ETH') {
      return project.native_token_symbol;
    }

    // Default fallback
    return 'ETH';
  };

  // Get the presale contract address
  const getPresaleContractAddress = () => {
    return project?.ido_presale_contract || project?.ido_pool_info?.presale_contract_address || project?.presale_contract_address;
  };

  const handleJoinProject = () => {
    setShowInvestModal(true);
    setPaymentError(null);
  };

  const handleInvestConfirm = async () => {
    if (!investAmount || parseFloat(investAmount) <= 0) {
      setPaymentError('Please enter a valid investment amount');
      return;
    }

    const minContrib = parseFloat(project?.min_allocation as any) || parseFloat(project?.min_contribution as any) || 0.1;
    const maxContrib = parseFloat(project?.max_allocation as any) || parseFloat(project?.max_contribution as any) || 10;
    const amount = parseFloat(investAmount);

    if (amount < minContrib || amount > maxContrib) {
      setPaymentError(`Investment amount must be between ${minContrib} and ${maxContrib} ${getNativeTokenSymbol()}`);
      return;
    }

    const presaleContract = getPresaleContractAddress();
    if (!presaleContract) {
      setPaymentError('Presale contract address not found');
      return;
    }

    try {
      setIsProcessingPayment(true);
      setPaymentError(null);

      // Check if MetaMask is installed
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask is required to participate in the presale');
      }

      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (!accounts || accounts.length === 0) {
        throw new Error('Please connect your wallet first');
      }

      const userAccount = accounts[0];
      
      // Get chain info for the project - FIXED CHAIN ID DETECTION
      const chainId = project?.ido_chain_id || project?.chain_id || 1;
      const nativeSymbol = getNativeTokenSymbol();
      const presaleRate = parseFloat(project?.presale_rate as any) || 
                          parseFloat(project?.ido_pool_info?.presale_rate as any) || 
                          1000; // Default to 1000 tokens per 1 native token

      console.log('Investment details:', {
        chainId,
        nativeSymbol,
        presaleRate,
        amount
      });

      // Validate chainId
      if (!chainId || typeof chainId !== 'number' || isNaN(chainId)) {
        console.error('Invalid chainId detected:', chainId);
        throw new Error(`Invalid chain ID detected. Project may not be properly configured.`);
      }

      // Validate presaleRate
      if (!presaleRate || typeof presaleRate !== 'number' || isNaN(presaleRate)) {
        console.error('Invalid presaleRate detected:', presaleRate);
        throw new Error(`Invalid presale rate detected. Project may not be properly configured.`);
      }

      // Switch to correct network if needed
      const chainHex = `0x${chainId.toString(16)}`;
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: chainHex }],
        });
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          throw new Error(`Please add chain ${chainId} to your MetaMask`);
        }
        throw switchError;
      }

      // Convert investment amount to Wei (18 decimals)
      const amountInWei = BigInt(Math.floor(amount * 1e18)).toString(16);
      console.log('Amount conversion:', { amount, amountInWei });

      // Prepare transaction with higher gas limit for contract interaction
      const transactionParameters = {
        to: presaleContract,
        from: userAccount,
        value: '0x' + amountInWei,
        gas: '0x186A0', // 100,000 gas limit for contract interaction
      };

      // Send transaction
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });

      console.log('Transaction sent:', txHash);

      // Calculate tokens to receive
      const tokensToReceive = amount * presaleRate;

      // Store investment in database (pending confirmation)
      const { error: dbError } = await supabase
        .from('ido_investments')
        .insert({
          ido_pool_id: project?.ido_pool_id,
          project_id: project?.id,
          investor_wallet_address: userAccount.toLowerCase(),
          amount_invested: amount,
          tokens_received: tokensToReceive,
          transaction_hash: txHash,
          chain_id: chainId,
          presale_rate: presaleRate,
          status: 'pending'
        });

      if (dbError) {
        console.error('Database error:', dbError);
        // Still show success since transaction was sent
      }

      alert(`🎉 Investment sent successfully!

Transaction Hash: ${txHash}
Amount: ${amount} ${nativeSymbol}
Tokens to receive: ${tokensToReceive.toLocaleString()} ${project?.token_symbol}

Your investment will be confirmed once the transaction is mined.
The presale contract will automatically send tokens to your wallet.`);
      
      setShowInvestModal(false);
      setInvestAmount('');
      
      // Refresh project data to show updated stats after 30 seconds
      setTimeout(() => {
        window.location.reload();
      }, 30000);
      
    } catch (error: any) {
      console.error('Payment error:', error);
      setPaymentError(error.message || 'Transaction failed. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  // Loading state
  if (loading) {
    return (
      <div className="project-details-page-new">
        <BlogNavbar />
        <div className="project-main-content">
          <div className="container">
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <h2>Loading Project Details...</h2>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error || !project) {
    return (
      <div className="project-details-page-new">
        <BlogNavbar />
        <div className="project-main-content">
          <div className="container">
            <div className="error-container">
              <div style={{ fontSize: '4rem' }}>😔</div>
              <h2>Project Not Found</h2>
              <p>{error || 'The project you\'re looking for doesn\'t exist or has been deleted.'}</p>
              <p>Redirecting to home page in 3 seconds...</p>
              <motion.button
                onClick={() => navigate('/', { replace: true })}
                style={{
                  padding: '1rem 2rem',
                  background: 'linear-gradient(135deg, var(--primary-cyan), var(--accent-blue))',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#000',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
                whileHover={{ scale: 1.05 }}
              >
                Back to Home
              </motion.button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="project-details-page-new">
      {/* Use Main Navigation from Landing Page */}
      <BlogNavbar />

      {/* Banner Section */}
      <div className="project-banner-section">
        <div className="project-banner" style={{ backgroundImage: `url(${project.banner_url})` }}>
          <div className="banner-overlay"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="project-content-wrapper">
        <div className="container">
          <div className="project-content-grid">
            {/* Left Column - Project Info */}
            <div className="project-info-column">
              {/* Project Header */}
              <motion.div 
                className="project-header-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="project-header-content">
                  <div className="project-logo-section">
                    <img src={project.logo_url} alt={project.project_name} className="project-logo" />
                    <div className="project-basic-info">
                      <h1 className="project-name">{project.project_name}</h1>
                      <div className="project-symbol-badge">${project.token_symbol}</div>
                      <div className="project-category-tag">{project.category}</div>
                    </div>
                  </div>
                  
                  <div className="project-rating-section">
                    <div className="rating-display">
                      <span className="rating-stars">⭐⭐⭐⭐⭐</span>
                      <span className="rating-number">{project.rating}/10</span>
                    </div>
                    <div className="project-status-live">
                      <span className="status-dot"></span>
                      LIVE PRESALE
                    </div>
                  </div>
                </div>

                <div className="project-social-links">
                  {project.website && <a href={project.website} target="_blank" rel="noopener noreferrer" className="social-link">🌐</a>}
                  {project.telegram && <a href={project.telegram} target="_blank" rel="noopener noreferrer" className="social-link">💬</a>}
                  {project.twitter && <a href={project.twitter} target="_blank" rel="noopener noreferrer" className="social-link">🐦</a>}
                  {project.discord && <a href={project.discord} target="_blank" rel="noopener noreferrer" className="social-link">🎮</a>}
                </div>
              </motion.div>

              {/* Project Description */}
              <motion.div 
                className="project-description-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <h3 className="card-title">📋 Project Description</h3>
                <p className="project-full-description">{project.full_description || project.description}</p>
                
                {project.features && project.features.length > 0 && (
                  <div className="project-features">
                    <h4>🔥 Key Features</h4>
                    <div className="features-grid">
                      {project.features.map((feature, index) => (
                        <div key={index} className="feature-item">
                          <span className="feature-check">✅</span>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Tokenomics */}
              <motion.div 
                className="tokenomics-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h3 className="card-title">💰 Tokenomics</h3>
                <div className="tokenomics-chart">
                  {(() => {
                    console.log('Tokenomics data:', project.tokenomics);
                    return project.tokenomics && project.tokenomics.length > 0;
                  })() ? (
                    <>
                      <div className="tokenomics-visual">
                        {project.tokenomics!.map((item, index) => (
                          <div 
                            key={index}
                            className="tokenomics-segment"
                            style={{ 
                              width: `${item.percentage}%`, 
                              backgroundColor: item.color,
                              minWidth: '60px'
                            }}
                          >
                            {item.percentage}%
                          </div>
                        ))}
                      </div>
                      <div className="tokenomics-legend">
                        {project.tokenomics!.map((item, index) => (
                          <div key={index} className="legend-item">
                            <div className="legend-color" style={{ backgroundColor: item.color }}></div>
                            <div className="legend-info">
                              <span className="legend-name">{item.name}</span>
                              <span className="legend-percentage">{item.percentage}%</span>
                              <span className="legend-amount">{item.amount} {project.token_symbol}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="no-data-message">
                      <p>Tokenomics data will be available soon</p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Team */}
              <motion.div 
                className="team-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h3 className="card-title">👥 Team</h3>
                <div className="team-grid-new">
                  {project.team_members && project.team_members.length > 0 ? (
                    project.team_members.map((member: any, index: number) => (
                      <div key={index} className="team-member-card">
                        <div className="member-avatar">
                          <img src={member.image_url} alt={member.name} />
                        </div>
                        <div className="member-info">
                          <h4 className="member-name">{member.name}</h4>
                          <div className="member-position">{member.position}</div>
                          <div className="member-experience">{member.experience}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-data-message">
                      <p>Team information will be available soon</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Right Column - Investment Info */}
            <div className="investment-info-column">
              {/* Investment Card */}
              <motion.div 
                className="investment-details-modern"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="investment-header-modern">
                  <h3> Investment Details</h3>
                  <div className="time-remaining-modern">
                    <span className="timer-icon-modern">⏰</span>
                    <span className="timer-text-modern">{project.time_left}</span>
                  </div>
                </div>

                <div className="progress-section-modern">
                  <div className="progress-info-modern">
                    <span className="progress-label-modern">Progress</span>
                    <span className="progress-percent-modern">{(project.real_progress_percentage || project.progress_percentage || 0).toFixed(1)}%</span>
                  </div>
                  <div className="progress-bar-modern">
                    <motion.div 
                      className="progress-fill-modern"
                      initial={{ width: 0 }}
                      animate={{ width: `${(project.real_progress_percentage || project.progress_percentage || 0)}%` }}
                      transition={{ duration: 2, ease: "easeOut" }}
                    />
                  </div>
                  <div className="progress-amounts-modern">
                    <span className="raised-amount-modern">{(project.real_current_raised || project.current_raised || 0).toLocaleString()} {getNativeTokenSymbol()} raised</span>
                    <span className="target-amount-modern">of {(project.ido_hard_cap || project.hard_cap || 0).toLocaleString()} {getNativeTokenSymbol()}</span>
                  </div>
                </div>

                <div className="price-info-grid-modern">
                  <div className="price-item-modern">
                    <span className="price-label-modern">Token Price</span>
                    <span className="price-value-modern">${project.presale_price || 'TBA'}</span>
                  </div>
                  <div className="price-item-modern">
                    <span className="price-label-modern">Participants</span>
                    <span className="price-value-modern">{(project.real_investor_count || project.investor_count || 0).toLocaleString()}</span>
                  </div>
                  <div className="price-item-modern">
                    <span className="price-label-modern">Min Buy</span>
                    <span className="price-value-modern">{project.min_allocation || project.min_contribution || '0.1'} {getNativeTokenSymbol()}</span>
                  </div>
                  <div className="price-item-modern">
                    <span className="price-label-modern">Max Buy</span>
                    <span className="price-value-modern">{project.max_allocation || project.max_contribution || '10'} {getNativeTokenSymbol()}</span>
                  </div>
                </div>

                <motion.button 
                  className="join-presale-btn-modern"
                  onClick={handleJoinProject}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="btn-icon-modern">🚀</span>
                  <span>Join Presale</span>
                </motion.button>
              </motion.div>

              {/* Presale Details */}
              <motion.div 
                className="detail-card-modern"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h3 className="card-title">⏰ Presale Information</h3>
                <div className="detail-row-modern">
                  <span className="detail-label-modern">Presale Start</span>
                  <span className="detail-value-modern">{new Date(project.presale_start).toLocaleDateString()} at {new Date(project.presale_start).toLocaleTimeString()}</span>
                </div>
                <div className="detail-row-modern">
                  <span className="detail-label-modern">Presale End</span>
                  <span className="detail-value-modern">{new Date(project.presale_end).toLocaleDateString()} at {new Date(project.presale_end).toLocaleTimeString()}</span>
                </div>
                <div className="detail-row-modern">
                  <span className="detail-label-modern">Soft Cap</span>
                  <span className="detail-value-modern">{project.soft_cap} {getNativeTokenSymbol()}</span>
                </div>
                <div className="detail-row-modern">
                  <span className="detail-label-modern">Hard Cap</span>
                  <span className="detail-value-modern">{project.hard_cap} {getNativeTokenSymbol()}</span>
                </div>
                <div className="detail-row-modern">
                  <span className="detail-label-modern">Liquidity %</span>
                  <span className="detail-value-modern">{project.liquidity_percent}</span>
                </div>
                <div className="detail-row-modern">
                  <span className="detail-label-modern">Liquidity Lock</span>
                  <span className="detail-value-modern">{project.liquidity_lock_time}</span>
                </div>
              </motion.div>

              {/* Blockchain & Presale Contract */}
              <motion.div 
                className="detail-card-modern"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h3 className="card-title">⛓️ Blockchain & Presale Contract</h3>
                <div className="detail-row-modern">
                  <span className="detail-label-modern">Blockchain</span>
                  <span className="detail-value-modern">
                    {getChainInfo(project.ido_pool_info?.chain_id || project.chain_id).name}
                  </span>
                </div>
                <div className="detail-row-modern">
                  <span className="detail-label-modern">Native Token</span>
                  <span className="detail-value-modern">{getNativeTokenSymbol()}</span>
                </div>
                {getPresaleContractAddress() && (
                  <div className="detail-row-modern">
                    <span className="detail-label-modern">Presale Contract</span>
                    <span className="detail-value-modern contract-address-modern" onClick={() => copyToClipboard(getPresaleContractAddress() || '')}>
                      {`${getPresaleContractAddress()?.slice(0, 10)}...${getPresaleContractAddress()?.slice(-8)}`}
                      <span className="copy-icon-modern">📋</span>
                    </span>
                  </div>
                )}
                <div className="detail-row-modern">
                  <span className="detail-label-modern">Payment Method</span>
                  <span className="detail-value-modern">Send {getNativeTokenSymbol()} to presale contract</span>
                </div>
              </motion.div>

              {/* Token Information */}
              <motion.div 
                className="detail-card-modern"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <h3 className="card-title">🪙 Token Information</h3>
                <div className="detail-row-modern">
                  <span className="detail-label-modern">Name</span>
                  <span className="detail-value-modern">{project.project_name}</span>
                </div>
                <div className="detail-row-modern">
                  <span className="detail-label-modern">Symbol</span>
                  <span className="detail-value-modern">{project.token_symbol}</span>
                </div>
                <div className="detail-row-modern">
                  <span className="detail-label-modern">Total Supply</span>
                  <span className="detail-value-modern">{project.total_supply?.toLocaleString() || 'TBA'}</span>
                </div>
                <div className="detail-row-modern">
                  <span className="detail-label-modern">Token Contract</span>
                  <span className="detail-value-modern contract-address-modern" onClick={() => copyToClipboard(project.contract_address || '')}>
                    {project.contract_address ? `${project.contract_address.slice(0, 10)}...${project.contract_address.slice(-8)}` : 'TBA'}
                    <span className="copy-icon-modern">📋</span>
                  </span>
                </div>
              </motion.div>

              {/* Links & Resources */}
              <motion.div 
                className="detail-card-modern"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <h3 className="card-title">📎 Resources</h3>
                <div className="resources-links">
                  {project.whitepaper && (
                    <a href={project.whitepaper} target="_blank" rel="noopener noreferrer" className="resource-link">
                      📄 Whitepaper
                    </a>
                  )}
                  {project.audit_link && (
                    <a href={project.audit_link} target="_blank" rel="noopener noreferrer" className="resource-link">
                      🛡️ Security Audit
                    </a>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Investment Modal */}
      {showInvestModal && (
        <motion.div 
          className="modal-overlay-new"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowInvestModal(false)}
        >
          <motion.div 
            className="investment-modal-new"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header-new">
              <h3>Join {project.project_name} Presale</h3>
              <button className="modal-close-new" onClick={() => setShowInvestModal(false)}>×</button>
            </div>
            <div className="modal-content-new">
              <div className="investment-summary">
                <div className="summary-row">
                  <span>Token Price:</span>
                  <span>${project.presale_price || 'TBA'}</span>
                </div>
                <div className="summary-row">
                  <span>Min Investment:</span>
                  <span>{project.min_allocation || project.min_contribution || '0.1'} {getNativeTokenSymbol()}</span>
                </div>
                <div className="summary-row">
                  <span>Max Investment:</span>
                  <span>{project.max_allocation || project.max_contribution || '10'} {getNativeTokenSymbol()}</span>
                </div>
                <div className="summary-row">
                  <span>Blockchain:</span>
                  <span>{getChainInfo(project.ido_pool_info?.chain_id || project.chain_id).name}</span>
                </div>
                <div className="summary-row">
                  <span>You will receive:</span>
                  <span className="tokens-received">
                    {(() => {
                      const amount = parseFloat(investAmount || '0');
                      if (amount <= 0) return '0';
                      
                      // Try multiple sources for presale rate
                      const presaleRate = project.presale_rate || 
                                         project.ido_pool_info?.presale_rate || 
                                         1000; // Default rate of 1000 tokens per 1 native token
                      
                      const tokensToReceive = Math.floor(amount * presaleRate);
                      return tokensToReceive.toLocaleString();
                    })()
                    } {project.token_symbol}
                  </span>
                </div>
              </div>
              
              <div className="investment-input-section">
                <label>Investment Amount ({getNativeTokenSymbol()})</label>
                <input
                  type="number"
                  value={investAmount}
                  onChange={(e) => setInvestAmount(e.target.value)}
                  placeholder="0.0"
                  min={project.min_allocation || project.min_contribution || 0.1}
                  max={project.max_allocation || project.max_contribution || 10}
                  step="0.01"
                  className="investment-input-new"
                />
                {getPresaleContractAddress() && (
                  <p className="investment-note">
                    💡 {getNativeTokenSymbol()} will be sent directly to the presale smart contract
                  </p>
                )}
              </div>
              
              {paymentError && (
                <div className="payment-error" style={{
                  color: '#ff4444',
                  background: 'rgba(255, 68, 68, 0.1)',
                  border: '1px solid rgba(255, 68, 68, 0.3)',
                  borderRadius: '8px',
                  padding: '12px',
                  marginBottom: '16px',
                  fontSize: '14px'
                }}>
                  ⚠️ {paymentError}
                </div>
              )}
              
              <div className="modal-actions-new">
                <button className="btn-cancel" onClick={() => setShowInvestModal(false)}>
                  Cancel
                </button>
                <button 
                  className="btn-confirm"
                  onClick={handleInvestConfirm}
                  disabled={(() => {
                    if (isProcessingPayment) return true;
                    if (!investAmount || investAmount.trim() === '') return true;
                    
                    const amount = parseFloat(investAmount);
                    const minAmount = parseFloat(project.min_allocation?.toString() || project.min_contribution?.toString() || '0.1');
                    const maxAmount = parseFloat(project.max_allocation?.toString() || project.max_contribution?.toString() || '10');
                    
                    return isNaN(amount) || amount <= 0 || amount < minAmount || amount > maxAmount;
                  })()}
                  style={{
                    opacity: isProcessingPayment || 
                            !investAmount || 
                            parseFloat(investAmount || '0') < parseFloat(project.min_allocation?.toString() || project.min_contribution?.toString() || '0.1') 
                            ? 0.7 : 1,
                    cursor: isProcessingPayment || 
                           !investAmount || 
                           parseFloat(investAmount || '0') < parseFloat(project.min_allocation?.toString() || project.min_contribution?.toString() || '0.1') 
                           ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isProcessingPayment ? '⏳ Processing...' : `Invest ${investAmount || '0'} ${getNativeTokenSymbol()}`}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      <Footer />
    </div>
  );
};

export default ProjectDetails; 
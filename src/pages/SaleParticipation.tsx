import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { FiArrowLeft, FiGlobe, FiUsers, FiClock, FiTrendingUp, FiDollarSign, FiTarget, FiShield } from 'react-icons/fi';
import { useAccount, useDisconnect, useSendTransaction, useSwitchChain, useChainId } from 'wagmi';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { parseEther } from 'viem';

interface SaleProject {
  id: string;
  project_name: string;
  token_symbol: string;
  description: string;
  contract_address: string;
  chain_id: number;
  native_token_symbol: string;
  logo_url: string;
  banner_url: string;
  website: string;
  telegram: string;
  twitter: string;
  custom_category: string;
  tokens_per_native: number;
  bonus_percentage: number;
  sale_countdown_end: string | null;
  sale_status: string;
  hard_cap: number;
  soft_cap: number;
  current_raised: number;
  investor_count: number;
  min_contribution: number;
  max_contribution: number;
  presale_start: string | null;
  presale_end: string | null;
  token_address?: string;
}

const SaleParticipation: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<SaleProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [contributionAmount, setContributionAmount] = useState('');
  const [expectedTokens, setExpectedTokens] = useState(0);
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
  const [countdownLabel, setCountdownLabel] = useState('Sale Ends In');
  const [transactionStatus, setTransactionStatus] = useState<string | null>(null);
  const [copyToast, setCopyToast] = useState(false);

  // Wagmi hooks
  const { address, isConnected } = useAccount();
  const { open } = useWeb3Modal();
  const { disconnect } = useDisconnect();
  const currentChainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { sendTransaction, isPending: isTransactionPending, isSuccess, isError, error } = useSendTransaction();

  useEffect(() => {
    if (slug) {
      fetchProject();
    }
  }, [slug]);

  useEffect(() => {
    if (project) {
      const interval = setInterval(() => {
        updateCountdown();
        updateSaleStatus();
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [project]);

  useEffect(() => {
    if (contributionAmount && project) {
      calculateExpectedTokens();
    }
  }, [contributionAmount, project]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('project_submissions')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        setLoadingError('Sale not found');
        return;
      }

      setProject(data);
    } catch (err: any) {
      console.error('Error fetching project:', err);
      setLoadingError('Failed to load sale details');
    } finally {
      setLoading(false);
    }
  };

  const updateSaleStatus = () => {
    if (!project) return;

    const now = new Date().getTime();
    const startTime = project.presale_start ? new Date(project.presale_start).getTime() : 0;
    const endTime = project.presale_end ? new Date(project.presale_end).getTime() : project.sale_countdown_end ? new Date(project.sale_countdown_end).getTime() : 0;

    let newStatus = project.sale_status;
    if (endTime && now > endTime) {
      newStatus = 'ended';
    } else if (startTime && now >= startTime && endTime && now < endTime) {
      newStatus = 'live';
    } else if (startTime && now < startTime) {
      newStatus = 'upcoming';
    }

    // Update project status if it changed
    if (newStatus !== project.sale_status) {
      setProject(prev => prev ? { ...prev, sale_status: newStatus } : null);
    }
  };

  const updateCountdown = () => {
    if (!project) return;

    const now = new Date().getTime();
    let targetTime = 0;
    let countdownLabel = '';

    // Determine what we're counting down to
    if (project.sale_status === 'upcoming') {
      if (project.presale_start) {
        targetTime = new Date(project.presale_start).getTime();
        setCountdownLabel('Sale Starts In');
      } else if (project.sale_countdown_end) {
        targetTime = new Date(project.sale_countdown_end).getTime();
        setCountdownLabel('Sale Starts In');
      }
    } else if (project.sale_status === 'live') {
      if (project.sale_countdown_end) {
        targetTime = new Date(project.sale_countdown_end).getTime();
        setCountdownLabel('Sale Ends In');
      } else if (project.presale_end) {
        targetTime = new Date(project.presale_end).getTime();
        setCountdownLabel('Sale Ends In');
      }
    }

    if (targetTime > 0) {
      const difference = targetTime - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft(null);
      }
    } else {
      setTimeLeft(null);
    }
  };

  const calculateExpectedTokens = () => {
    if (!contributionAmount || !project) return;

    const contribution = parseFloat(contributionAmount);
    if (isNaN(contribution)) return;

    const baseTokens = contribution * project.tokens_per_native;
    const bonusTokens = baseTokens * (project.bonus_percentage / 100);
    const totalTokens = baseTokens + bonusTokens;

    setExpectedTokens(totalTokens);
  };

  const getChainInfo = (chainId: number) => {
    const chains: Record<number, { name: string; symbol: string; logo: string; rpcUrl: string; explorerUrl: string }> = {
      1: { 
        name: 'Ethereum', 
        symbol: 'ETH', 
        logo: '/images/logo/ethereum-logo.svg',
        rpcUrl: 'https://mainnet.infura.io/v3/YOUR_INFURA_ID',
        explorerUrl: 'https://etherscan.io'
      },
      56: { 
        name: 'BNB Smart Chain', 
        symbol: 'BNB', 
        logo: '/images/logo/bsc-logo.svg',
        rpcUrl: 'https://bsc-dataseed.binance.org/',
        explorerUrl: 'https://bscscan.com'
      },
      137: { 
        name: 'Polygon', 
        symbol: 'MATIC', 
        logo: '/images/logo/polygon-logo.svg',
        rpcUrl: 'https://polygon-rpc.com/',
        explorerUrl: 'https://polygonscan.com'
      },
      42161: { 
        name: 'Arbitrum', 
        symbol: 'ETH', 
        logo: '/images/logo/arbitrum-logo.svg',
        rpcUrl: 'https://arb1.arbitrum.io/rpc',
        explorerUrl: 'https://arbiscan.io'
      },
      10: { 
        name: 'Optimism', 
        symbol: 'ETH', 
        logo: '/images/logo/optimism-logo.svg',
        rpcUrl: 'https://mainnet.optimism.io',
        explorerUrl: 'https://optimistic.etherscan.io'
      }
    };
    return chains[chainId] || { name: 'Unknown', symbol: 'ETH', logo: '/images/logo/ethereum-logo.svg', rpcUrl: '', explorerUrl: '' };
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyToast(true);
      setTimeout(() => setCopyToast(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopyToast(true);
      setTimeout(() => setCopyToast(false), 2000);
    }
  };

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleConnectWallet = () => {
    open();
  };

  const handleSwitchChain = async (targetChainId: number) => {
    if (currentChainId !== targetChainId) {
      try {
        await switchChain({ chainId: targetChainId });
      } catch (err) {
        console.error('Failed to switch chain:', err);
        setTransactionStatus('Failed to switch network. Please switch manually in your wallet.');
      }
    }
  };

  const participateInSale = async () => {
    if (!isConnected || !contributionAmount || !project) {
      setTransactionStatus('Please connect wallet and enter contribution amount');
      return;
    }

    const contribution = parseFloat(contributionAmount);
    if (isNaN(contribution) || contribution < project.min_contribution || contribution > project.max_contribution) {
      setTransactionStatus(`Contribution must be between ${project.min_contribution} and ${project.max_contribution} ${project.native_token_symbol}`);
      return;
    }

    // Check if we're on the correct chain
    if (currentChainId !== project.chain_id) {
      setTransactionStatus('Switching to correct network...');
      await handleSwitchChain(project.chain_id);
      return;
    }

    try {
      setTransactionStatus('Preparing transaction...');

      // Send transaction using Wagmi
      sendTransaction({
        to: project.contract_address as `0x${string}`,
        value: parseEther(contribution.toString()),
      });

    } catch (error: any) {
      console.error('Transaction error:', error);
      setTransactionStatus(`Transaction failed: ${error?.message || 'Unknown error'}`);
    }
  };

  // Handle transaction status updates
  useEffect(() => {
    if (isTransactionPending) {
      setTransactionStatus('Please confirm transaction in your wallet...');
    } else if (isSuccess) {
      setTransactionStatus('Transaction confirmed! Tokens will be distributed according to the sale terms.');
      setContributionAmount('');
      setExpectedTokens(0);
         } else if (isError && error) {
       setTransactionStatus(`Transaction failed: ${error?.message || error?.toString() || 'Unknown error'}`);
     }
  }, [isTransactionPending, isSuccess, isError, error]);

  const getProgressPercentage = () => {
    if (!project) return 0;
    return Math.min((project.current_raised / project.hard_cap) * 100, 100);
  };

  const getSaleStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-green-500';
      case 'upcoming': return 'bg-yellow-500';
      case 'ended': return 'bg-gray-500';
      default: return 'bg-blue-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'private_sale': return '🔒';
      case 'presale': return '💰';
      default: return '🚀';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20">
        <Navigation />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading sale details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (loadingError || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20">
        <Navigation />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="text-6xl mb-4">😞</div>
            <p className="text-white text-xl mb-4">{loadingError || 'Sale not found'}</p>
            <Link 
              to="/sale" 
              className="inline-flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              <FiArrowLeft className="w-4 h-4" />
              <span>Back to Sales</span>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const chainInfo = getChainInfo(project.chain_id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20">
      <Navigation />
      
      {/* Hero Section with Banner */}
      <div className="relative pt-24 pb-12">
        {project.banner_url && (
          <div className="absolute inset-0 z-0">
            <img 
              src={project.banner_url} 
              alt={project.project_name}
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-blue-900/60 to-purple-900/60"></div>
          </div>
        )}
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            to="/sale" 
            className="inline-flex items-center space-x-2 text-gray-400 hover:text-white mb-8 transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>Back to Sales</span>
          </Link>

          <div className="flex flex-col lg:flex-row items-start gap-8">
            {/* Project Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-6">
                {project.logo_url && (
                  <img 
                    src={project.logo_url} 
                    alt={project.project_name}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                )}
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">{project.project_name}</h1>
                  <div className="flex items-center space-x-4">
                    <span className="text-xl text-gray-300 font-mono">{project.token_symbol}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${getSaleStatusColor(project.sale_status)}`}>
                      {project.sale_status.toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-400">
                      {getCategoryIcon(project.custom_category)} {project.custom_category.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-gray-300 text-lg leading-relaxed mb-8">
                {project.description}
              </p>

              {/* Social Links */}
              <div className="flex items-center space-x-4 mb-8">
                {project.website && (
                  <a 
                    href={project.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 bg-gray-800/50 hover:bg-gray-700/50 px-4 py-2 rounded-lg text-gray-300 hover:text-white transition-colors"
                  >
                    <FiGlobe className="w-4 h-4" />
                    <span>Website</span>
                  </a>
                )}
                {project.telegram && (
                  <a 
                    href={project.telegram} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 bg-blue-600/20 hover:bg-blue-600/30 px-4 py-2 rounded-lg text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <FiUsers className="w-4 h-4" />
                    <span>Telegram</span>
                  </a>
                )}
                {project.twitter && (
                  <a 
                    href={project.twitter} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 bg-sky-600/20 hover:bg-sky-600/30 px-4 py-2 rounded-lg text-sky-400 hover:text-sky-300 transition-colors"
                  >
                    <span>Twitter</span>
                  </a>
                )}
              </div>

              {/* Token Contract Address */}
              {project.token_address && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <FiTarget className="w-5 h-5 mr-2" />
                    Token Contract
                  </h3>
                  <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Contract Address</p>
                        <p className="text-white font-mono text-sm">{formatAddress(project.token_address)}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => copyToClipboard(project.token_address!)}
                          className="p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg text-gray-400 hover:text-cyan-400 transition-colors"
                          title="Copy address"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                        <a
                          href={`${chainInfo.explorerUrl}/token/${project.token_address}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg text-gray-400 hover:text-cyan-400 transition-colors"
                          title="View on blockchain explorer"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-700/50">
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <img src={chainInfo.logo} alt={chainInfo.name} className="w-4 h-4" />
                        <span>{chainInfo.name} Network</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sale Participation Card */}
            <div className="w-full lg:w-96">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6 sticky top-24"
              >
                {/* Countdown Timer */}
                {timeLeft && project.sale_status !== 'ended' && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                      <FiClock className="w-5 h-5 mr-2" />
                      {countdownLabel}
                    </h3>
                    <div className="grid grid-cols-4 gap-2">
                      {Object.entries(timeLeft).map(([unit, value]) => (
                        <div key={unit} className="text-center">
                          <div className={`rounded-lg py-3 ${
                            project.sale_status === 'upcoming' 
                              ? 'bg-gradient-to-br from-yellow-500 to-orange-600'
                              : 'bg-gradient-to-br from-blue-500 to-purple-600'
                          }`}>
                            <div className="text-2xl font-bold text-white">{value}</div>
                            <div className="text-xs text-gray-200 uppercase">{unit}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Progress</span>
                    <span className="text-white font-semibold">{getProgressPercentage().toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${getProgressPercentage()}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2 text-sm text-gray-400">
                    <span>{project.current_raised} {chainInfo.symbol}</span>
                    <span>{project.hard_cap} {chainInfo.symbol}</span>
                  </div>
                </div>

                {/* Sale Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-700/30 rounded-lg p-3">
                    <div className="text-gray-400 text-xs">Token Rate</div>
                    <div className="text-white font-semibold">{project.tokens_per_native.toLocaleString()} {project.token_symbol}</div>
                    <div className="text-gray-500 text-xs">per {chainInfo.symbol}</div>
                  </div>
                  <div className="bg-gray-700/30 rounded-lg p-3">
                    <div className="text-gray-400 text-xs">Bonus</div>
                    <div className="text-green-400 font-semibold">{project.bonus_percentage}%</div>
                    <div className="text-gray-500 text-xs">Extra tokens</div>
                  </div>
                </div>



                {/* Contribution Form */}
                {project.sale_status === 'live' ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Contribution Amount ({chainInfo.symbol})
                      </label>
                      <input
                        type="number"
                        step="0.001"
                        min={project.min_contribution}
                        max={project.max_contribution}
                        value={contributionAmount}
                        onChange={(e) => setContributionAmount(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        placeholder={`Min: ${project.min_contribution} Max: ${project.max_contribution}`}
                      />
                    </div>

                    {expectedTokens > 0 && (
                      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                        <div className="text-center">
                          <div className="text-blue-400 text-sm">You will receive</div>
                          <div className="text-2xl font-bold text-white">{expectedTokens.toLocaleString()}</div>
                          <div className="text-blue-400 text-sm">{project.token_symbol} tokens</div>
                          {project.bonus_percentage > 0 && (
                            <div className="text-green-400 text-xs mt-1">
                              (Includes {project.bonus_percentage}% bonus)
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {!isConnected ? (
                      <button
                        onClick={handleConnectWallet}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        Connect Wallet
                      </button>
                    ) : (
                      <button
                        onClick={participateInSale}
                        disabled={isTransactionPending || !contributionAmount}
                        className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                      >
                        {isTransactionPending ? 'Processing...' : 'Participate in Sale'}
                      </button>
                    )}

                    {transactionStatus && (
                      <div className={`p-3 rounded-lg text-sm ${
                        transactionStatus.includes('failed') || transactionStatus.includes('error')
                          ? 'bg-red-500/20 border border-red-500/30 text-red-400'
                          : transactionStatus.includes('confirmed')
                          ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                          : 'bg-blue-500/20 border border-blue-500/30 text-blue-400'
                      }`}>
                        {transactionStatus}
                      </div>
                    )}

                    <div className="text-xs text-gray-500 space-y-1">
                      <div>• Min contribution: {project.min_contribution} {chainInfo.symbol}</div>
                      <div>• Max contribution: {project.max_contribution} {chainInfo.symbol}</div>
                      <div>• Network: {chainInfo.name}</div>
                    </div>
                  </div>
                ) : project.sale_status === 'upcoming' ? (
                  <div className="text-center py-8">
                    <div className="text-yellow-400 text-lg font-semibold mb-2">Sale Coming Soon</div>
                    <div className="text-gray-400">This sale hasn't started yet. Check back soon!</div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-lg font-semibold mb-2">Sale Ended</div>
                    <div className="text-gray-500">This sale has concluded. Thank you for your interest!</div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Details Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sale Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <FiTarget className="w-5 h-5 mr-2" />
              Sale Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Soft Cap</span>
                <span className="text-white">{project.soft_cap} {chainInfo.symbol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Hard Cap</span>
                <span className="text-white">{project.hard_cap} {chainInfo.symbol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Investors</span>
                <span className="text-white">{project.investor_count}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Network</span>
                <div className="flex items-center space-x-2">
                  <img src={chainInfo.logo} alt={chainInfo.name} className="w-4 h-4" />
                  <span className="text-white">{chainInfo.name}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Token Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <FiDollarSign className="w-5 h-5 mr-2" />
              Token Information
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Symbol</span>
                <span className="text-white font-mono">{project.token_symbol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Rate</span>
                <span className="text-white">{project.tokens_per_native.toLocaleString()} / {chainInfo.symbol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Bonus</span>
                <span className="text-green-400">{project.bonus_percentage}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Contract</span>
                <a 
                  href={`${chainInfo.explorerUrl}/address/${project.contract_address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 font-mono text-sm truncate max-w-32"
                >
                  {project.contract_address.slice(0, 6)}...{project.contract_address.slice(-4)}
                </a>
              </div>
            </div>
          </motion.div>

          {/* Security */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <FiShield className="w-5 h-5 mr-2" />
              Security
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Smart Contract</span>
                <span className="text-green-400">✓ Verified</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Audit</span>
                <span className="text-green-400">✓ Completed</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">KYC</span>
                <span className="text-green-400">✓ Verified</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Liquidity Lock</span>
                <span className="text-green-400">✓ 12 Months</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />

      {/* Copy Toast Notification */}
      {copyToast && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-medium">Address copied to clipboard!</span>
        </motion.div>
      )}
    </div>
  );
};

export default SaleParticipation; 
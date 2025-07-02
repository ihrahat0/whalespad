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
import web3Service from '../services/web3Service';

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
  payment_method?: 'native' | 'usdt';
  usdt_token_address?: string;
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
  
  // USDT-specific state
  const [usdtBalance, setUsdtBalance] = useState<string>('0');
  const [usdtAllowance, setUsdtAllowance] = useState<string>('0');
  const [isApprovingUSDT, setIsApprovingUSDT] = useState(false);
  const [needsApproval, setNeedsApproval] = useState(false);

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

  // Check USDT status when connected and USDT project
  useEffect(() => {
    if (isConnected && address && project?.payment_method === 'usdt') {
      checkUSDTStatus(address);
    }
  }, [isConnected, address, project?.payment_method, contributionAmount]);

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

      // CRITICAL DEBUG: Check payment method data
      console.log('🔍 SaleParticipation PAYMENT METHOD DEBUG:', {
        projectName: data.project_name,
        slug: data.slug,
        paymentMethod: data.payment_method,
        usdtTokenAddress: data.usdt_token_address,
        tokenAddress: data.token_address,
        contractAddress: data.contract_address
      });

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

  // Get the current currency symbol based on payment method
  const getCurrentCurrencySymbol = () => {
    if (!project) return 'ETH';
    
    const paymentMethod = project.payment_method;
    const usdtAddress = project.usdt_token_address;
    const nativeSymbol = getChainInfo(project.chain_id).symbol;
    const result = paymentMethod === 'usdt' ? 'USDT' : nativeSymbol;
    
    console.log('💰 SaleParticipation getCurrentCurrencySymbol DEBUG:', {
      projectName: project.project_name,
      paymentMethod,
      usdtAddress,
      nativeSymbol,
      result,
      willUseUSDT: paymentMethod === 'usdt'
    });
    
    return result;
  };

  // Check USDT balance and allowance for user
  const checkUSDTStatus = async (userAddress: string) => {
    if (!project?.usdt_token_address || !project?.contract_address) return;

    try {
      // Ensure web3Service is connected
      console.log('🔍 Checking USDT status for:', userAddress);
      await web3Service.connect();
      console.log('✅ web3Service connected successfully');
      
      const [balance, allowance] = await Promise.all([
        web3Service.getUSDTBalance(project.usdt_token_address, userAddress),
        web3Service.getUSDTAllowance(project.usdt_token_address, userAddress, project.contract_address)
      ]);

      console.log('💰 USDT Status:', { balance, allowance, contributionAmount });
      
      setUsdtBalance(balance);
      setUsdtAllowance(allowance);

      // Check if approval is needed for the current contribution amount
      if (contributionAmount && parseFloat(contributionAmount) > 0) {
        const needsApprovalCheck = parseFloat(allowance) < parseFloat(contributionAmount);
        console.log('🔒 Needs approval check:', { allowance, contributionAmount, needsApprovalCheck });
        setNeedsApproval(needsApprovalCheck);
      }
    } catch (error) {
      console.error('❌ Error checking USDT status:', error);
    }
  };

  // Handle USDT approval
  const handleUSDTApproval = async () => {
    if (!project?.usdt_token_address || !project?.contract_address || !contributionAmount) return;

    try {
      setIsApprovingUSDT(true);
      setTransactionStatus('Connecting wallet and preparing approval...');

      // Ensure web3Service is connected first
      console.log('🔌 Connecting web3Service for approval...');
      console.log('🔍 Approval params:', {
        usdtTokenAddress: project.usdt_token_address,
        spenderAddress: project.contract_address,
        amount: contributionAmount
      });
      
      await web3Service.connect();
      console.log('✅ web3Service connected for approval');
      
      setTransactionStatus('Approving USDT spending...');

      const txHash = await web3Service.approveUSDT(
        project.usdt_token_address,
        project.contract_address,
        contributionAmount
      );

      console.log('✅ USDT approval transaction sent:', txHash);
      setTransactionStatus('USDT approval successful! You can now participate in the sale.');

      // Wait a moment and check allowance again
      setTimeout(() => {
        if (address) {
          checkUSDTStatus(address);
        }
      }, 3000);

    } catch (error: any) {
      console.error('USDT approval error:', error);
      setTransactionStatus(`USDT approval failed: ${error.message || 'Unknown error'}`);
    } finally {
      setIsApprovingUSDT(false);
    }
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
    const paymentMethod = project.payment_method || 'native';
    
    if (isNaN(contribution) || contribution < project.min_contribution || contribution > project.max_contribution) {
      setTransactionStatus(`Contribution must be between ${project.min_contribution} and ${project.max_contribution} ${getCurrentCurrencySymbol()}`);
      return;
    }

    // Check if we're on the correct chain
    if (currentChainId !== project.chain_id) {
      setTransactionStatus('Switching to correct network...');
      await handleSwitchChain(project.chain_id);
      return;
    }

    console.log('🚀 Starting participation with payment method:', paymentMethod);

    // For USDT payments, check if approval is needed first
    if (paymentMethod === 'usdt' && needsApproval) {
      setTransactionStatus('Please approve USDT spending first by clicking the "Approve USDT" button');
      return;
    }

    try {
      setTransactionStatus('Preparing transaction...');

      if (paymentMethod === 'usdt') {
        console.log('💰 Executing USDT purchase flow');
        // USDT Payment Flow
        if (!project.usdt_token_address) {
          throw new Error('USDT token address not configured for this project');
        }

        // Ensure web3Service is connected first
        setTransactionStatus('Connecting wallet...');
        console.log('🔌 Connecting web3Service for purchase...');
        await web3Service.connect();
        
        setTransactionStatus('Executing USDT purchase...');

        // Execute USDT purchase using purchaseTokens function
        const txHash = await web3Service.purchaseTokensWithUSDT(
          project.contract_address,
          contributionAmount,
          project.usdt_token_address
        );

        console.log('🚀 USDT purchase transaction sent:', txHash);
        setTransactionStatus(`USDT purchase successful! Transaction: ${txHash}`);
        
        // Clear form
        setContributionAmount('');
        setExpectedTokens(0);
        
        // Refresh USDT status
        setTimeout(() => {
          if (address) {
            checkUSDTStatus(address);
          }
        }, 3000);

      } else {
        console.log('💎 Executing native token flow');
        // Native Token Payment Flow (existing logic)
        sendTransaction({
          to: project.contract_address as `0x${string}`,
          value: parseEther(contribution.toString()),
        });
      }

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
      
      {/* DEBUG: Payment Method Notice */}
      {project && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '10px',
          background: project.payment_method === 'usdt' ? '#1F2937' : '#7F1D1D',
          border: project.payment_method === 'usdt' ? '2px solid #10B981' : '2px solid #EF4444',
          color: project.payment_method === 'usdt' ? '#10B981' : '#EF4444',
          padding: '12px',
          borderRadius: '8px',
          zIndex: 9999,
          fontSize: '12px',
          maxWidth: '280px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}>
          <div style={{fontWeight: 'bold', marginBottom: '6px', fontSize: '13px'}}>
            {project.payment_method === 'usdt' ? '✅ USDT PROJECT' : '⚠️ NATIVE PROJECT'}
          </div>
          <div style={{marginBottom: '4px'}}>Payment: {project.payment_method || 'native'}</div>
          {project.payment_method === 'usdt' && project.usdt_token_address && (
            <div style={{marginBottom: '4px'}}>USDT: {project.usdt_token_address.slice(0, 8)}...{project.usdt_token_address.slice(-3)}</div>
          )}
          <div style={{marginTop: '6px', fontSize: '11px', opacity: 0.8}}>
            Currency: {getCurrentCurrencySymbol()}
          </div>
          <div style={{marginTop: '3px', fontSize: '10px', opacity: 0.7}}>
            Wallet: {isConnected ? '🟢' : '🔴'} {address ? `${address.slice(0, 4)}...${address.slice(-3)}` : 'None'}
          </div>
        </div>
      )}
      
      {/* Hero Section with Banner */}
      <div className="relative pt-20 sm:pt-24 pb-8 sm:pb-12">
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
            className="inline-flex items-center space-x-2 text-gray-400 hover:text-white mb-6 sm:mb-8 transition-colors text-sm sm:text-base"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>Back to Sales</span>
          </Link>

          <div className="flex flex-col lg:flex-row items-start gap-6 sm:gap-8">
            {/* Project Info */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
                {project.logo_url && (
                  <img 
                    src={project.logo_url} 
                    alt={project.project_name}
                    className="w-12 sm:w-16 h-12 sm:h-16 rounded-xl object-cover mx-auto sm:mx-0"
                  />
                )}
                <div className="text-center sm:text-left">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">{project.project_name}</h1>
                  <div className="flex flex-col sm:flex-row items-center sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <span className="text-lg sm:text-xl text-gray-300 font-mono">{project.token_symbol}</span>
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-bold text-white ${getSaleStatusColor(project.sale_status)}`}>
                      {project.sale_status.toUpperCase()}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-400 flex items-center">
                      {getCategoryIcon(project.custom_category)} <span className="ml-1">{project.custom_category.replace('_', ' ')}</span>
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed mb-6 sm:mb-8 text-center sm:text-left px-2 sm:px-0">
                {project.description}
              </p>

              {/* Social Links */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-4 mb-6 sm:mb-8">
                {project.website && (
                  <a 
                    href={project.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 bg-gray-800/50 hover:bg-gray-700/50 px-3 sm:px-4 py-2 rounded-lg text-gray-300 hover:text-white transition-colors text-xs sm:text-sm"
                  >
                    <FiGlobe className="w-3 sm:w-4 h-3 sm:h-4" />
                    <span>Website</span>
                  </a>
                )}
                {project.telegram && (
                  <a 
                    href={project.telegram} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 bg-blue-600/20 hover:bg-blue-600/30 px-3 sm:px-4 py-2 rounded-lg text-blue-400 hover:text-blue-300 transition-colors text-xs sm:text-sm"
                  >
                    <FiUsers className="w-3 sm:w-4 h-3 sm:h-4" />
                    <span>Telegram</span>
                  </a>
                )}
                {project.twitter && (
                  <a 
                    href={project.twitter} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 bg-sky-600/20 hover:bg-sky-600/30 px-3 sm:px-4 py-2 rounded-lg text-sky-400 hover:text-sky-300 transition-colors text-xs sm:text-sm"
                  >
                    <span>Twitter</span>
                  </a>
                )}
              </div>

              {/* Token Contract Address */}
              {project.token_address && (
                <div className="mb-6 sm:mb-8">
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center justify-center sm:justify-start">
                    <FiTarget className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
                    Token Contract
                  </h3>
                  <div className="bg-gray-800/50 rounded-xl p-3 sm:p-4 border border-gray-700/50 mx-2 sm:mx-0">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
                      <div className="w-full sm:w-auto">
                        <p className="text-gray-400 text-xs sm:text-sm mb-1">Contract Address</p>
                        <p className="text-white font-mono text-xs sm:text-sm break-all sm:break-normal">{formatAddress(project.token_address)}</p>
                      </div>
                      <div className="flex space-x-2 w-full sm:w-auto justify-center sm:justify-end">
                        <button
                          onClick={() => copyToClipboard(project.token_address!)}
                          className="p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg text-gray-400 hover:text-cyan-400 transition-colors"
                          title="Copy address"
                        >
                          <svg className="w-3 sm:w-4 h-3 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                          <svg className="w-3 sm:w-4 h-3 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-700/50">
                      <div className="flex items-center justify-center sm:justify-start space-x-2 text-xs sm:text-sm text-gray-400">
                        <img src={chainInfo.logo} alt={chainInfo.name} className="w-3 sm:w-4 h-3 sm:h-4" />
                        <span>{chainInfo.name} Network</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sale Participation Card */}
            <div className="w-full lg:w-96 mx-2 sm:mx-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-4 sm:p-6 sticky top-24"
              >
                {/* Countdown Timer */}
                {timeLeft && project.sale_status !== 'ended' && (
                  <div className="mb-4 sm:mb-6">
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-4 flex items-center justify-center">
                      <FiClock className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
                      {countdownLabel}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                      {Object.entries(timeLeft).map(([unit, value]) => (
                        <div key={unit} className="text-center">
                          <div className={`rounded-lg py-3 sm:py-4 px-2 ${
                            project.sale_status === 'upcoming' 
                              ? 'bg-gradient-to-br from-yellow-500 to-orange-600'
                              : 'bg-gradient-to-br from-blue-500 to-purple-600'
                          } shadow-lg`}>
                            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">{value.toString().padStart(2, '0')}</div>
                            <div className="text-xs sm:text-sm text-gray-100 uppercase font-medium mt-1">{unit}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Progress Bar */}
                <div className="mb-4 sm:mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300 text-sm">Progress</span>
                    <span className="text-white font-semibold text-sm">{getProgressPercentage().toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 sm:h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 sm:h-3 rounded-full transition-all duration-500"
                      style={{ width: `${getProgressPercentage()}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs sm:text-sm text-gray-400">
                    <span>{project.current_raised} {getCurrentCurrencySymbol()}</span>
                    <span>{project.hard_cap} {getCurrentCurrencySymbol()}</span>
                  </div>
                </div>

                {/* Sale Stats */}
                <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6">
                  <div className="bg-gray-700/30 rounded-lg p-2 sm:p-3">
                    <div className="text-gray-400 text-xs">Token Rate</div>
                    <div className="text-white font-semibold text-sm sm:text-base">{project.tokens_per_native.toLocaleString()}</div>
                    <div className="text-gray-500 text-xs">per {getCurrentCurrencySymbol()}</div>
                  </div>
                  <div className="bg-gray-700/30 rounded-lg p-2 sm:p-3">
                    <div className="text-gray-400 text-xs">Bonus</div>
                    <div className="text-green-400 font-semibold text-sm sm:text-base">{project.bonus_percentage}%</div>
                    <div className="text-gray-500 text-xs">Extra tokens</div>
                  </div>
                </div>

                {/* Contribution Form */}
                {project.sale_status === 'live' ? (
                  <div className="space-y-3 sm:space-y-4">
                    {/* USDT-specific information */}
                    {project.payment_method === 'usdt' && (
                      <div className="bg-gray-700/30 rounded-lg p-3 sm:p-4 border border-gray-600">
                        <h4 className="text-white font-medium mb-2 sm:mb-3 text-sm sm:text-base">USDT Balance & Allowance</h4>
                        <div className="space-y-2 text-xs sm:text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Your USDT Balance:</span>
                            <span className="text-white">{parseFloat(usdtBalance).toFixed(2)} USDT</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">USDT Allowance:</span>
                            <span className="text-white">{parseFloat(usdtAllowance).toFixed(2)} USDT</span>
                          </div>
                        </div>
                        
                        {needsApproval && contributionAmount && parseFloat(contributionAmount) > 0 && (
                          <div className="mt-3 sm:mt-4">
                            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-2 sm:p-3 mb-2 sm:mb-3">
                              <p className="text-yellow-400 text-xs sm:text-sm">⚠️ You need to approve USDT spending before you can participate</p>
                            </div>
                            <button
                              onClick={handleUSDTApproval}
                              disabled={isApprovingUSDT}
                              className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-2 sm:py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:cursor-not-allowed text-sm sm:text-base"
                            >
                              {isApprovingUSDT ? '⏳ Approving...' : `Approve ${contributionAmount} USDT`}
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    <div>
                      <label className="block text-gray-300 text-xs sm:text-sm font-medium mb-2">
                        Contribution Amount ({getCurrentCurrencySymbol()})
                      </label>
                      <input
                        type="number"
                        step="0.001"
                        min={project.min_contribution}
                        max={project.max_contribution}
                        value={contributionAmount}
                        onChange={(e) => setContributionAmount(e.target.value)}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                        placeholder={`Min: ${project.min_contribution} Max: ${project.max_contribution}`}
                      />
                    </div>

                    {expectedTokens > 0 && (
                      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 sm:p-4">
                        <div className="text-center">
                          <div className="text-blue-400 text-xs sm:text-sm">You will receive</div>
                          <div className="text-xl sm:text-2xl font-bold text-white">{expectedTokens.toLocaleString()}</div>
                          <div className="text-blue-400 text-xs sm:text-sm">{project.token_symbol} tokens</div>
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
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 sm:py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
                      >
                        Connect Wallet
                      </button>
                    ) : (
                      <button
                        onClick={participateInSale}
                        disabled={isTransactionPending || !contributionAmount || (project.payment_method === 'usdt' && needsApproval)}
                        className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-3 sm:py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:cursor-not-allowed text-sm sm:text-base"
                      >
                        {isTransactionPending ? 'Processing...' : 
                         project.payment_method === 'usdt' ? 
                           `Purchase with ${contributionAmount || '0'} USDT` : 
                           'Participate in Sale'}
                      </button>
                    )}

                    {transactionStatus && (
                      <div className={`p-2 sm:p-3 rounded-lg text-xs sm:text-sm ${
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
                      <div>• Min contribution: {project.min_contribution} {getCurrentCurrencySymbol()}</div>
                      <div>• Max contribution: {project.max_contribution} {getCurrentCurrencySymbol()}</div>
                      <div>• Network: {chainInfo.name}</div>
                      {project.payment_method === 'usdt' && (
                        <div className="text-green-400">• 🟢 USDT Payment Mode: Approval + Purchase Flow</div>
                      )}
                    </div>
                  </div>
                ) : project.sale_status === 'upcoming' ? (
                  <div className="text-center py-6 sm:py-8">
                    <div className="text-yellow-400 text-base sm:text-lg font-semibold mb-2">Sale Coming Soon</div>
                    <div className="text-gray-400 text-sm sm:text-base">This sale hasn't started yet. Check back soon!</div>
                  </div>
                ) : (
                  <div className="text-center py-6 sm:py-8">
                    <div className="text-gray-400 text-base sm:text-lg font-semibold mb-2">Sale Ended</div>
                    <div className="text-gray-500 text-sm sm:text-base">This sale has concluded. Thank you for your interest!</div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Details Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Sale Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800/50 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-gray-700/50 p-4 sm:p-6"
          >
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center justify-center sm:justify-start">
              <FiTarget className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
              Sale Details
            </h3>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm sm:text-base">Soft Cap</span>
                <span className="text-white text-sm sm:text-base">{project.soft_cap} {getCurrentCurrencySymbol()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm sm:text-base">Hard Cap</span>
                <span className="text-white text-sm sm:text-base">{project.hard_cap} {getCurrentCurrencySymbol()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm sm:text-base">Total Investors</span>
                <span className="text-white text-sm sm:text-base">{project.investor_count}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm sm:text-base">Network</span>
                <div className="flex items-center space-x-2">
                  <img src={chainInfo.logo} alt={chainInfo.name} className="w-3 sm:w-4 h-3 sm:h-4" />
                  <span className="text-white text-sm sm:text-base">{chainInfo.name}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Token Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800/50 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-gray-700/50 p-4 sm:p-6"
          >
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center justify-center sm:justify-start">
              <FiDollarSign className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
              Token Information
            </h3>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm sm:text-base">Symbol</span>
                <span className="text-white font-mono text-sm sm:text-base">{project.token_symbol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm sm:text-base">Rate</span>
                <span className="text-white text-sm sm:text-base">{project.tokens_per_native.toLocaleString()} / {getCurrentCurrencySymbol()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm sm:text-base">Bonus</span>
                <span className="text-green-400 text-sm sm:text-base">{project.bonus_percentage}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm sm:text-base">Contract</span>
                <a 
                  href={`${chainInfo.explorerUrl}/address/${project.contract_address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 font-mono text-xs sm:text-sm"
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
            className="bg-gray-800/50 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-gray-700/50 p-4 sm:p-6"
          >
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center justify-center sm:justify-start">
              <FiShield className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
              Security
            </h3>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm sm:text-base">Smart Contract</span>
                <span className="text-green-400 text-sm sm:text-base">✓ Verified</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm sm:text-base">Audit</span>
                <span className="text-green-400 text-sm sm:text-base">✓ Completed</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm sm:text-base">KYC</span>
                <span className="text-green-400 text-sm sm:text-base">✓ Verified</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm sm:text-base">Liquidity Lock</span>
                <span className="text-green-400 text-sm sm:text-base">✓ 12 Months</span>
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
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { ConnectWalletButton } from '../components/ConnectWalletButton';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import web3Service from '../services/web3Service';
import './ModernIDODetails.css';

// Extend Window interface for ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      selectedAddress?: string;
    };
  }
}

// Enhanced phase types
type PhaseType = 'upcoming' | 'live' | 'filled' | 'claimable' | 'ended';

interface PhaseInfo {
  id: PhaseType;
  name: string;
  status: 'pending' | 'active' | 'completed' | 'disabled';
  startDate?: Date;
  endDate?: Date;
  description: string;
  canAdvance?: boolean;
  isManuallySet?: boolean; // For admin overrides
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
  // Enhanced phase management
  current_phase?: PhaseType;
  phase_override?: PhaseType; // Admin override
  whitelist_start?: string;
  whitelist_end?: string;
  claim_start?: string;
  listing_date?: string;
  vesting_start?: string;
  // IDO pool info from updated view
  chain_id?: number;
  native_token_symbol?: string;
  presale_contract_address?: string;
  ido_pool_id?: string;
  payment_method?: 'native' | 'usdt';
  usdt_token_address?: string;
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

interface CountdownType {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
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
  const [activeTab, setActiveTab] = useState<'project-info' | 'swap-claim'>('project-info');
  const [countdown, setCountdown] = useState<CountdownType>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [currentPhase, setCurrentPhase] = useState<PhaseType>('upcoming');
  const [lastPhaseUpdate, setLastPhaseUpdate] = useState<Date>(new Date());
  
  // USDT-specific state
  const [usdtBalance, setUsdtBalance] = useState<string>('0');
  const [usdtAllowance, setUsdtAllowance] = useState<string>('0');
  const [isApprovingUSDT, setIsApprovingUSDT] = useState(false);
  const [needsApproval, setNeedsApproval] = useState(false);

  // Smart phase management with admin override priority
  const getSmartPhases = useCallback((): PhaseInfo[] => {
    if (!project) return [];

    const now = new Date();
    const presaleStart = new Date(project.presale_start);
    const presaleEnd = new Date(project.presale_end);
    
    // Calculate smart dates based on project timeline or admin custom dates
    const whitelistStart = project.whitelist_start ? new Date(project.whitelist_start) : new Date(presaleStart.getTime() - 7 * 24 * 60 * 60 * 1000);
    const whitelistEnd = project.whitelist_end ? new Date(project.whitelist_end) : new Date(presaleStart.getTime() - 1 * 60 * 60 * 1000);
    const claimStart = project.claim_start ? new Date(project.claim_start) : new Date(presaleEnd.getTime() + 24 * 60 * 60 * 1000);
    const listingDate = project.listing_date ? new Date(project.listing_date) : new Date(presaleEnd.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Define all phases with their natural order (NEVER changes order)
    const phases: PhaseInfo[] = [
      {
        id: 'upcoming',
        name: 'UPCOMING',
        status: 'pending',
        startDate: whitelistStart,
        endDate: whitelistEnd,
        description: 'Whitelist Period',
        canAdvance: true
      },
      {
        id: 'live',
        name: 'SWAP',
        status: 'pending',
        startDate: presaleStart,
        endDate: presaleEnd,
        description: 'Live Sale Period',
        canAdvance: true
      },
      {
        id: 'filled',
        name: 'FILLED',
        status: 'pending',
        startDate: presaleEnd,
        endDate: claimStart,
        description: 'Processing & Finalization',
        canAdvance: true
      },
      {
        id: 'claimable',
        name: 'CLAIMABLE',
        status: 'pending',
        startDate: claimStart,
        endDate: listingDate,
        description: 'Token Claiming Available',
        canAdvance: true
      },
      {
        id: 'ended',
        name: 'ENDED',
        status: 'pending',
        startDate: listingDate,
        endDate: undefined,
        description: 'Project Completed',
        canAdvance: false
      }
    ];

    // ADMIN OVERRIDE TAKES ABSOLUTE PRIORITY
    if (project.phase_override) {
      const overrideIndex = phases.findIndex(p => p.id === project.phase_override);
      if (overrideIndex !== -1) {
        console.log('🔧 Applying admin phase override:', project.phase_override);
        phases.forEach((phase, index) => {
          if (index < overrideIndex) {
            phase.status = 'completed';
            phase.isManuallySet = true;
          } else if (index === overrideIndex) {
            phase.status = 'active';
            phase.isManuallySet = true;
          } else {
            phase.status = 'pending';
          }
        });
        return phases; // Return immediately, ignore date-based logic
      }
    }

    // If no admin override, use date-based logic
    phases.forEach((phase, index) => {
      if (index === 0) {
        // UPCOMING phase
        phase.status = now < whitelistEnd ? 'active' : 'completed';
      } else if (index === 1) {
        // LIVE phase
        if (now >= presaleStart && now <= presaleEnd) {
          phase.status = 'active';
        } else if (now < presaleStart) {
          phase.status = 'pending';
        } else {
          phase.status = 'completed';
        }
      } else if (index === 2) {
        // FILLED phase
        if (now > presaleEnd && now < claimStart) {
          phase.status = 'active';
        } else if (now >= claimStart) {
          phase.status = 'completed';
        } else {
          phase.status = 'pending';
        }
      } else if (index === 3) {
        // CLAIMABLE phase
        if (now >= claimStart && now < listingDate) {
          phase.status = 'active';
        } else if (now >= listingDate) {
          phase.status = 'completed';
        } else {
          phase.status = 'pending';
        }
      } else if (index === 4) {
        // ENDED phase
        phase.status = now >= listingDate ? 'active' : 'pending';
      }
    });

    return phases;
  }, [project]);

  // Auto-advance phase when countdown reaches zero (only if no admin override)
  const autoAdvancePhase = useCallback(async () => {
    if (!project || !project.id) return;

    // NEVER auto-advance if admin has set a phase override
    if (project.phase_override) {
      console.log('🔧 Auto-advance disabled: Admin override active');
      return;
    }

    const phases = getSmartPhases();
    const activePhase = phases.find(p => p.status === 'active');
    const nextPhase = phases.find(p => p.status === 'pending');
    
    if (!activePhase || !nextPhase || !activePhase.canAdvance || activePhase.isManuallySet) return;

    const now = new Date();
    
    // Check if current phase should end
    if (activePhase.endDate && now >= activePhase.endDate) {
      try {
        // Update the current phase in database
        const { error } = await supabase
          .from('project_submissions') 
          .update({ 
            current_phase: nextPhase.id,
            phase_updated_at: new Date().toISOString()
          })
          .eq('id', project.id);

        if (!error) {
          setCurrentPhase(nextPhase.id);
          setLastPhaseUpdate(new Date());
          
          // Show notification
          console.log(`🎉 Project automatically advanced to ${nextPhase.name} phase!`);
          
          // Refresh project data to get updated phase
          fetchProjectData(false);
        } else {
          console.error('Failed to auto-advance phase:', error);
        }
      } catch (err) {
        console.error('Error auto-advancing phase:', err);
      }
    }
  }, [project, getSmartPhases]);

  // Get current countdown target based on active phase
  const getCountdownTarget = useCallback((): Date | null => {
    const phases = getSmartPhases();
    const activePhase = phases.find(p => p.status === 'active');
    
    if (activePhase?.endDate) {
      return activePhase.endDate;
    }
    
    // Fallback to presale end
    return project ? new Date(project.presale_end) : null;
  }, [project, getSmartPhases]);

  // Function to fetch fresh project data
  const fetchProjectData = useCallback(async (showLoading = true) => {
    try {
      if (!id) {
        throw new Error('No project ID provided');
      }

      console.log('🔍 Fetching project data for slug:', id);
      console.log('🚨 TESTING: Available projects in DB: whalespad (native), whalespad-1 (USDT)');
      console.log('🎯 Current URL slug:', id);
      if (showLoading) setLoading(true);

      // First get basic project data from project_submissions (most up-to-date phase info)
      console.log('📝 Querying project_submissions table...');
      const { data: projectData, error: projectError } = await supabase
        .from('project_submissions')
        .select(`
          id, project_name, token_symbol, slug, presale_start, presale_end,
          current_phase, phase_override, phase_updated_at, whitelist_start,
          whitelist_end, claim_start, listing_date, vesting_start, logo_url,
          banner_url, description, full_description, features, rating,
          website, telegram, twitter, discord, category, total_supply,
          min_contribution, max_contribution, soft_cap, hard_cap,
          presale_price, listing_price, contract_address, payment_method,
          usdt_token_address, token_address
        `)
        .eq('slug', id)
        .single();

      console.log('📊 project_submissions query result:', { projectData, projectError });
      
      // CRITICAL DEBUG: Check payment method data
      if (projectData) {
        console.log('🔍 PAYMENT METHOD DEBUG:', {
          projectName: projectData.project_name,
          paymentMethod: projectData.payment_method,
          usdtTokenAddress: projectData.usdt_token_address,
          tokenAddress: projectData.token_address,
          contractAddress: projectData.contract_address
        });
      }

      if (projectError || !projectData) {
        console.log('⚠️ Fallback to project_details_view...');
        // Fallback to project_details_view
        const { data: viewData, error: viewError } = await supabase
          .from('project_details_view')
          .select('*')
          .eq('slug', id)
          .single();

        console.log('📊 project_details_view query result:', { viewData, viewError });

        if (viewError || !viewData) {
          console.error('❌ Both queries failed:', { projectError, viewError });
          throw new Error('Project not found or has been deleted');
        }

        console.log('✅ Using project_details_view data');
        setProject(viewData);
        // Set phase from admin override or current phase
        const initialPhase = viewData.phase_override || viewData.current_phase;
        if (initialPhase) {
          setCurrentPhase(initialPhase);
        }
      } else {
        console.log('✅ Using project_submissions data, merging with IDO data...');
        // Merge with IDO pool data if available
        const { data: idoData } = await supabase
          .from('project_details_view')
          .select('*')
          .eq('slug', id)
          .single();

        console.log('📊 IDO data merge result:', idoData);

        const mergedData = { ...projectData, ...(idoData || {}) };
        setProject(mergedData);
        
        // Set phase from admin override with priority
        const adminPhase = projectData.phase_override || projectData.current_phase;
        if (adminPhase) {
          setCurrentPhase(adminPhase);
          console.log('🔧 Admin phase override active:', adminPhase);
        }
      }

      console.log('🎉 Project data loaded successfully');
    } catch (err: any) {
      console.error('💥 Error loading project:', err);
      console.error('💥 Error details:', {
        message: err.message,
        code: err.code,
        details: err.details,
        hint: err.hint,
        stack: err.stack
      });
      setError(err.message || 'Failed to load project data');
      
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 3000);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    // Simple connectivity test
    const testSupabaseConnection = async () => {
      try {
        console.log('🧪 Testing Supabase connection...');
        const { data, error } = await supabase
          .from('project_submissions')
          .select('count')
          .limit(1);
        
        if (error) {
          console.error('🚨 Supabase connection test failed:', error);
        } else {
          console.log('✅ Supabase connection successful');
        }
      } catch (err) {
        console.error('🚨 Supabase connection error:', err);
      }
    };

    testSupabaseConnection();
    fetchProjectData();
  }, [fetchProjectData]);

  // Refresh data when component becomes visible (admin changes detection)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && project) {
        // Fetch fresh data when tab becomes active (potential admin changes)
        fetchProjectData(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [project, fetchProjectData]);

  // Enhanced countdown timer with auto-advance
  useEffect(() => {
    const countdownTarget = getCountdownTarget();
    if (!countdownTarget) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const targetTime = countdownTarget.getTime();
      const timeLeft = targetTime - now;

      if (timeLeft > 0) {
        setCountdown({
          days: Math.floor(timeLeft / (1000 * 60 * 60 * 24)),
          hours: Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((timeLeft % (1000 * 60)) / 1000)
        });
      } else {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        
        // Auto-advance phase when countdown reaches zero
        autoAdvancePhase();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [getCountdownTarget, autoAdvancePhase]);

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

  // Get the current currency symbol based on payment method
  const getCurrentCurrencySymbol = () => {
    const paymentMethod = project?.payment_method;
    const usdtAddress = project?.usdt_token_address;
    const nativeSymbol = getNativeTokenSymbol();
    const result = paymentMethod === 'usdt' ? 'USDT' : nativeSymbol;
    
    console.log('💰 getCurrentCurrencySymbol DEBUG:', {
      paymentMethod,
      usdtAddress,
      nativeSymbol,
      result,
      projectData: project ? {
        name: project.project_name,
        payment_method: project.payment_method,
        usdt_token_address: project.usdt_token_address
      } : null
    });
    
    return result;
  };

  // Get the presale contract address
  const getPresaleContractAddress = () => {
    return project?.ido_presale_contract || project?.ido_pool_info?.presale_contract_address || project?.presale_contract_address;
  };

  // Get current active phase info
  const getActivePhaseInfo = () => {
    const phases = getSmartPhases();
    return phases.find(p => p.status === 'active') || phases[0];
  };

  // Get phase for countdown display
  const getCountdownPhase = () => {
    const activePhase = getActivePhaseInfo();
    return activePhase ? {
      name: activePhase.name,
      description: activePhase.description,
      endDate: activePhase.endDate,
      isActive: activePhase.status === 'active'
    } : null;
  };

  const handleJoinProject = () => {
    setShowInvestModal(true);
    setPaymentError(null);
  };

  // Check USDT balance and allowance for user
  const checkUSDTStatus = useCallback(async (userAddress: string) => {
    const presaleContract = getPresaleContractAddress();
    if (!project?.usdt_token_address || !presaleContract) return;

    try {
      const [balance, allowance] = await Promise.all([
        web3Service.getUSDTBalance(project.usdt_token_address, userAddress),
        web3Service.getUSDTAllowance(project.usdt_token_address, userAddress, presaleContract)
      ]);

      setUsdtBalance(balance);
      setUsdtAllowance(allowance);

      // Check if approval is needed for the current investment amount
      if (investAmount && parseFloat(investAmount) > 0) {
        setNeedsApproval(parseFloat(allowance) < parseFloat(investAmount));
      }
    } catch (error) {
      console.error('Error checking USDT status:', error);
    }
  }, [project, investAmount]);

  // Check USDT status when modal opens or investment amount changes
  useEffect(() => {
    if (showInvestModal && project?.payment_method === 'usdt') {
      // Get connected account and check USDT status
      web3Service.getAccount().then(account => {
        if (account) {
          checkUSDTStatus(account);
        }
      });
    }
  }, [showInvestModal, project?.payment_method, investAmount, checkUSDTStatus]);

  // Handle USDT approval
  const handleUSDTApproval = async () => {
    const presaleContract = getPresaleContractAddress();
    if (!project?.usdt_token_address || !presaleContract || !investAmount) return;

    try {
      setIsApprovingUSDT(true);
      setPaymentError(null);

      // Connect to wallet
      const accounts = await web3Service.connect();
      if (!accounts || accounts.length === 0) {
        throw new Error('Please connect your wallet first');
      }

      const userAccount = accounts[0];

      // Approve USDT spending for presale contract
      const txHash = await web3Service.approveUSDT(
        project.usdt_token_address,
        presaleContract,
        investAmount
      );

      console.log('USDT approval transaction:', txHash);

      // Wait a moment and check allowance again
      setTimeout(() => {
        checkUSDTStatus(userAccount);
      }, 3000);

      alert(`USDT approval successful! Transaction: ${txHash}`);
    } catch (error: any) {
      console.error('USDT approval error:', error);
      setPaymentError(error.message || 'USDT approval failed');
    } finally {
      setIsApprovingUSDT(false);
    }
  };

  const handleInvestConfirm = async () => {
    if (!investAmount || parseFloat(investAmount) <= 0) {
      setPaymentError('Please enter a valid investment amount');
      return;
    }

    const minContrib = parseFloat(project?.min_allocation as any) || parseFloat(project?.min_contribution as any) || 0.1;
    const maxContrib = parseFloat(project?.max_allocation as any) || parseFloat(project?.max_contribution as any) || 10;
    const amount = parseFloat(investAmount);
    
    // CRITICAL: Ensure payment method is correctly detected
    // If USDT token address exists but payment method is not set, force USDT mode
    let paymentMethod = project?.payment_method || 'native';
    if (project?.usdt_token_address && !project?.payment_method) {
      console.log('🔧 FORCE USDT MODE: USDT address found but payment method not set');
      paymentMethod = 'usdt';
    }
    
    console.log('🔍 Payment method detection:', {
      projectPaymentMethod: project?.payment_method,
      resolvedPaymentMethod: paymentMethod,
      usdtTokenAddress: project?.usdt_token_address,
      hasUsdtAddress: !!project?.usdt_token_address,
      willUseUSDT: paymentMethod === 'usdt'
    });
    
    const currencySymbol = paymentMethod === 'usdt' ? 'USDT' : getNativeTokenSymbol();

    if (amount < minContrib || amount > maxContrib) {
      setPaymentError(`Investment amount must be between ${minContrib} and ${maxContrib} ${currencySymbol}`);
      return;
    }

    const presaleContract = getPresaleContractAddress();
    if (!presaleContract) {
      setPaymentError('Presale contract address not found');
      return;
    }

    console.log('🚀 Starting investment process with payment method:', paymentMethod);
    console.log('🔍 Project payment method from DB:', project?.payment_method);
    console.log('💰 USDT token address:', project?.usdt_token_address);
    
    // For USDT payments, check if approval is needed first
    if (paymentMethod === 'usdt' && needsApproval) {
      setPaymentError('Please approve USDT spending first by clicking the "Approve USDT" button');
      return;
    }

    try {
      setIsProcessingPayment(true);
      setPaymentError(null);

      // Connect to wallet using web3Service
      const accounts = await web3Service.connect();
      if (!accounts || accounts.length === 0) {
        throw new Error('Please connect your wallet first');
      }

      const userAccount = accounts[0];
      
      // Get chain info for the project
      const chainId = project?.ido_chain_id || project?.chain_id || 1;
      const presaleRate = parseFloat(project?.presale_rate as any) || 
                          parseFloat(project?.ido_pool_info?.presale_rate as any) || 
                          1000; // Default to 1000 tokens per 1 payment token

      console.log('Investment details:', {
        chainId,
        paymentMethod,
        currencySymbol,
        presaleRate,
        amount,
        projectPaymentMethod: project?.payment_method,
        usdtTokenAddress: project?.usdt_token_address,
        presaleContract
      });

      // Validate required data
      if (!chainId || typeof chainId !== 'number' || isNaN(chainId)) {
        console.error('Invalid chainId detected:', chainId);
        throw new Error(`Invalid chain ID detected. Project may not be properly configured.`);
      }

      if (!presaleRate || typeof presaleRate !== 'number' || isNaN(presaleRate)) {
        console.error('Invalid presaleRate detected:', presaleRate);
        throw new Error(`Invalid presale rate detected. Project may not be properly configured.`);
      }

      // Switch to correct network if needed
      await web3Service.switchNetwork(chainId);

      let txHash: string;
      let tokensToReceive: number;

      if (paymentMethod === 'usdt') {
        console.log('💰 Executing USDT payment flow');
        // USDT Payment Flow
        if (!project?.usdt_token_address) {
          throw new Error('USDT token address not configured for this project');
        }

        // Calculate tokens to receive using the contract
        const tokensAmount = await web3Service.calculateWPTAmount(
          presaleContract,
          investAmount,
          project.usdt_token_address
        );
        tokensToReceive = parseFloat(tokensAmount);

        // Execute USDT purchase - just pass contract address and amount
        txHash = await web3Service.purchaseTokensWithUSDT(
          presaleContract,
          investAmount,
          project.usdt_token_address
        );

        console.log('USDT purchase transaction:', txHash);
      } else {
        // Native Token Payment Flow (existing logic)
        if (typeof window.ethereum === 'undefined') {
          throw new Error('MetaMask is required to participate in the presale');
        }

        // Calculate tokens to receive
        tokensToReceive = amount * presaleRate;

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
        txHash = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [transactionParameters],
        });

        console.log('Native token transaction sent:', txHash);
      }

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
          payment_method: paymentMethod,
          currency_symbol: currencySymbol,
          status: 'pending'
        });

      if (dbError) {
        console.error('Database error:', dbError);
        // Still show success since transaction was sent
      }

      alert(`🎉 Investment sent successfully!

Transaction Hash: ${txHash}
Amount: ${amount} ${currencySymbol}
Tokens to receive: ${tokensToReceive.toLocaleString()} ${project?.token_symbol}

Your investment will be confirmed once the transaction is mined.
${paymentMethod === 'usdt' ? 'The presale contract will automatically send tokens to your wallet.' : 'The presale contract will automatically send tokens to your wallet.'}`);
      
      setShowInvestModal(false);
      setInvestAmount('');
      
      // Refresh USDT status if USDT payment
      if (paymentMethod === 'usdt') {
        setTimeout(() => {
          checkUSDTStatus(userAccount);
        }, 3000);
      }
      
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
      <div className="modern-ido-page">
        <Navigation />
        <div className="modern-ido-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <h2>Loading Project Details...</h2>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error || !project) {
    return (
      <div className="modern-ido-page">
        <Navigation />
        <div className="modern-ido-container">
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
        <Footer />
      </div>
    );
  }

  const smartPhases = getSmartPhases();
  const activePhase = getActivePhaseInfo();

  return (
    <div className="modern-ido-page">
      <Navigation />

      <div className="modern-ido-container">
        <div className="ido-layout">
          {/* Left Sidebar - Timeline */}
          <div className="ido-timeline-sidebar">
            <div className="project-logo-header">
              <img src={project.logo_url} alt={project.project_name} className="project-logo-small" />
              <div className="project-title-info">
                <h3>{project.project_name} IDO</h3>
                <div className="project-badges">
                  <span className="badge-refundable">Refundable</span>
                  <span className="badge-public">PUBLIC</span>
                  <span className="badge-tier">Dove at Min Tier</span>
                </div>
              </div>
            </div>

            <div className="timeline-container">
              <div className="timeline-header">
                <div className="timezone-info">
                  <span>Time zone: (GMT +06:00)</span>
                </div>
                <motion.button
                  className="refresh-button"
                  onClick={() => fetchProjectData(false)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Refresh project data"
                >
                  🔄
                </motion.button>
              </div>

              <div className="timeline-phases">
                {smartPhases.map((phase, index) => (
                  <div key={phase.id} className={`timeline-phase ${phase.status === 'active' ? 'active' : phase.status === 'completed' ? 'completed' : phase.status === 'disabled' ? 'disabled' : ''}`}>
                    <div className="phase-indicator">
                      <div className="phase-dot"></div>
                    </div>
                    <div className="phase-content">
                      <h4>{phase.name}</h4>
                      <div className="phase-details">
                        <p>{phase.description}</p>
                        {phase.startDate && (
                          <p>From: {phase.startDate.toLocaleDateString()} {phase.startDate.toLocaleTimeString()}</p>
                        )}
                        {phase.endDate && (
                          <p>To: {phase.endDate.toLocaleDateString()} {phase.endDate.toLocaleTimeString()}</p>
                        )}
                        {phase.isManuallySet && (
                          <p></p>
                        )}
                      </div>
                      
                      {/* Show countdown only for active phases with end dates */}
                      {phase.status === 'active' && phase.endDate && (
                        <div className="countdown-timer">
                          {/* <p>
                            {phase.id === 'upcoming' ? 'End to apply for the Whitelist in' :
                             phase.id === 'live' ? 'Time remaining:' :
                             phase.id === 'filled' ? 'Processing completes in:' :
                             phase.id === 'claimable' ? 'Claiming period ends in:' :
                             'Time remaining:'}
                          </p> */}
                          <div className="countdown-display">
                            <span className="countdown-number">{countdown.days.toString().padStart(2, '0')}</span>
                            <span className="countdown-label">Days</span>
                            <span className="countdown-number">{countdown.hours.toString().padStart(2, '0')}</span>
                            <span className="countdown-label">Hours</span>
                            <span className="countdown-number">{countdown.minutes.toString().padStart(2, '0')}</span>
                            <span className="countdown-label">Minutes</span>
                            <span className="countdown-number">{countdown.seconds.toString().padStart(2, '0')}</span>
                            <span className="countdown-label">Seconds</span>
                          </div>
                        </div>
                      )}
                      
                      {/* Show completion message for completed phases */}
                      {phase.status === 'completed' && (
                        <div className="phase-completed">
                          <p>✅ {phase.name} phase completed</p>
                        </div>
                      )}
                      
                      {/* Show disabled message for disabled/ended phases */}
                      {phase.status === 'disabled' || (phase.id === 'ended' && phase.status === 'active') && (
                        <div className="phase-disabled">
                          <p>🔒 Project has ended</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Center Content - Tabs */}
          <div className="ido-main-content">
            <div className="ido-tabs">
              <button 
                className={`tab-button ${activeTab === 'project-info' ? 'active' : ''}`}
                onClick={() => setActiveTab('project-info')}
              >
                Project Info
              </button>
              <button 
                className={`tab-button ${activeTab === 'swap-claim' ? 'active' : ''}`}
                onClick={() => setActiveTab('swap-claim')}
              >
                Swap & Claim
              </button>
            </div>

            <div className="tab-content">
              {activeTab === 'project-info' && (
                <div className="project-info-content">
                  <div className="project-info-grid">
                    {/* Left Column */}
                    <div className="info-left">
                      <div className="info-card">
                        <div className="info-row">
                          <span className="info-label">Price per token</span>
                          <span className="info-value">
                            {project.presale_price || '0.0275'} {project.payment_method === 'usdt' ? 'USDT' : getNativeTokenSymbol()} per ${project.token_symbol}
                          </span>
                        </div>
                        <div className="info-row">
                          <span className="info-label">Swap Amount</span>
                          <span className="info-value">{(project.ido_total_supply || project.total_supply || 0).toLocaleString()} ${project.token_symbol}</span>
                        </div>
                        <div className="info-row">
                          <span className="info-label">Total Raise</span>
                          <span className="info-value highlight">${(project.ido_hard_cap || project.hard_cap || 0).toLocaleString()}</span>
                        </div>
                        <div className="info-row">
                          <span className="info-label">Claim Type</span>
                          <span className="info-value">Claim on Red Kite</span>
                        </div>
                        <div className="info-row">
                          <span className="info-label">Refund Info</span>
                          <span className="info-value">24 hours for all tiers</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="info-right">
                      <div className="info-card">
                        <div className="info-row">
                          <span className="info-label">Accepted Currency</span>
                          <span className="info-value">
                            {project.payment_method === 'usdt' ? 'USDT' : getNativeTokenSymbol()}
                          </span>
                        </div>
                        <div className="info-row">
                          <span className="info-label">Swap Network</span>
                          <span className="info-value">
                            <span className="network-icon"></span>
                            {getChainInfo(project.ido_chain_id || project.chain_id).name}
                          </span>
                        </div>
                        <div className="info-row">
                          <span className="info-label">Token Claim Network</span>
                          <span className="info-value">
                            <span className="network-icon"></span>
                            {getChainInfo(project.ido_chain_id || project.chain_id).name}
                          </span>
                        </div>
                        <div className="info-row">
                          <span className="info-label">Vesting Schedule</span>
                          <span className="info-value">40% at TGE, then monthly vesting in 6 months</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Project Introduction */}
                  <div className="project-introduction">
                    <h2>PROJECT INTRODUCTION</h2>
                    <div className="introduction-content">
                      <p>
                        <strong className="project-highlight">{project.project_name}</strong> is the <strong>Data Processing Layer for next-gen AI</strong>, 
                        combining decentralization, AI, and human intelligence to create a trustless protocol for efficient, scalable, and transparent data processing. 
                        The ecosystem is powered by the <strong className="token-highlight">${project.token_symbol} token</strong>, which governs task execution, staking, agent participation, and access to advanced AI tools.
                      </p>
                      
                      {project.full_description && (
                        <div className="full-description">
                          <p>{project.full_description}</p>
                        </div>
                      )}

                      {project.features && project.features.length > 0 && (
                        <div className="project-features">
                          <h3>Key Features:</h3>
                          <ul>
                            {project.features.map((feature, index) => (
                              <li key={index}>✓ {feature}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Links */}
                      <div className="project-links">
                        {project.website && (
                          <a href={project.website} target="_blank" rel="noopener noreferrer" className="project-link">
                            Website
                          </a>
                        )}
                        {project.whitepaper && (
                          <a href={project.whitepaper} target="_blank" rel="noopener noreferrer" className="project-link">
                            Whitepaper
                          </a>
                        )}
                        {project.telegram && (
                          <a href={project.telegram} target="_blank" rel="noopener noreferrer" className="project-link">
                            Telegram
                          </a>
                        )}
                        {project.twitter && (
                          <a href={project.twitter} target="_blank" rel="noopener noreferrer" className="project-link">
                            🐦 Twitter
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'swap-claim' && (
                <div className="swap-claim-content">
                  <div className="swap-interface">
                    <h2>Swap Interface</h2>
                    
                    <div className="swap-card">
                      <div className="swap-stats">
                        <div className="stat-item">
                          <span className="stat-label">Total Raised</span>
                          <span className="stat-value">{(project.real_current_raised || project.current_raised || 0).toLocaleString()} {getCurrentCurrencySymbol()}</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Participants</span>
                          <span className="stat-value">{(project.real_investor_count || project.investor_count || 0).toLocaleString()}</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Progress</span>
                          <span className="stat-value">{(project.real_progress_percentage || project.progress_percentage || 0).toFixed(1)}%</span>
                        </div>
                      </div>

                      <div className="progress-bar-container">
                        <div className="progress-bar-wrapper">
                          <motion.div 
                            className="progress-bar-fill"
                            initial={{ width: 0 }}
                            animate={{ width: `${(project.real_progress_percentage || project.progress_percentage || 0)}%` }}
                            transition={{ duration: 2, ease: "easeOut" }}
                          />
                        </div>
                        <div className="progress-labels">
                          <span>0 {getCurrentCurrencySymbol()}</span>
                          <span>{(project.ido_hard_cap || project.hard_cap || 0).toLocaleString()} {getCurrentCurrencySymbol()}</span>
                        </div>
                      </div>

                      <div className="swap-input-section">
                        <label>Investment Amount ({getCurrentCurrencySymbol()})</label>
                        <div className="input-wrapper">
                          <input
                            type="number"
                            value={investAmount}
                            onChange={(e) => setInvestAmount(e.target.value)}
                            placeholder="0.0"
                            min={project.min_allocation || project.min_contribution || 0.1}
                            max={project.max_allocation || project.max_contribution || 10}
                            step="0.01"
                            className="swap-input"
                          />
                          <span className="currency-symbol">{getCurrentCurrencySymbol()}</span>
                        </div>
                        <div className="min-max-info">
                          <span>Min: {project.min_allocation || project.min_contribution || '0.1'} {getCurrentCurrencySymbol()}</span>
                          <span>Max: {project.max_allocation || project.max_contribution || '10'} {getCurrentCurrencySymbol()}</span>
                        </div>
                      </div>

                      {paymentError && (
                        <div className="payment-error">
                          ⚠️ {paymentError}
                        </div>
                      )}

                      <motion.button 
                        className="join-swap-btn"
                        onClick={handleJoinProject}
                        disabled={!investAmount || parseFloat(investAmount) <= 0 || isProcessingPayment}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {isProcessingPayment ? '⏳ Processing...' : `Swap ${investAmount || '0'} ${getCurrentCurrencySymbol()}`}
                      </motion.button>

                      <div className="swap-note">
                        <p>💡 Your {getCurrentCurrencySymbol()} will be sent directly to the presale smart contract</p>
                        {project?.payment_method === 'usdt' && (
                          <p className="usdt-mode-indicator" style={{color: '#10B981', fontWeight: 'bold'}}>
                            🟢 USDT Payment Mode Active - Approval + Purchase Flow
                          </p>
                        )}
                        {getPresaleContractAddress() && (
                          <p className="contract-address">
                            Contract: {`${getPresaleContractAddress()?.slice(0, 10)}...${getPresaleContractAddress()?.slice(-8)}`}
                            <button onClick={() => copyToClipboard(getPresaleContractAddress() || '')} className="copy-btn">📋</button>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* DEBUG: Project Selection Notice */}
      {id === 'whalespad' && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#1F2937',
          border: '2px solid #10B981',
          color: '#10B981',
          padding: '15px',
          borderRadius: '8px',
          zIndex: 9999,
          fontSize: '14px',
          maxWidth: '350px'
        }}>
          <div style={{fontWeight: 'bold', marginBottom: '8px'}}>🔧 DEBUG NOTICE</div>
          <div>This project uses NATIVE payment (BNB)</div>
          <div style={{marginTop: '8px'}}>
            To test USDT: <a 
              href="/projects/whalespad-1" 
              style={{color: '#3B82F6', textDecoration: 'underline'}}
            >
              Visit whalespad-1
            </a>
          </div>
        </div>
      )}
      
      {id === 'whalespad-1' && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#1F2937',
          border: '2px solid #10B981',
          color: '#10B981',
          padding: '15px',
          borderRadius: '8px',
          zIndex: 9999,
          fontSize: '14px',
          maxWidth: '350px'
        }}>
          <div style={{fontWeight: 'bold', marginBottom: '8px'}}>✅ USDT PROJECT</div>
          <div>This project uses USDT payment!</div>
          <div>USDT: 0x55d39...7955</div>
        </div>
      )}

      {/* Investment Modal */}
      {showInvestModal && (
        <motion.div 
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowInvestModal(false)}
        >
          <motion.div 
            className="investment-modal"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Join {project.project_name} Presale</h3>
              <button className="modal-close" onClick={() => setShowInvestModal(false)}>×</button>
            </div>
            <div className="modal-content">
              <div className="investment-summary">
                <div className="summary-row">
                  <span>Token Price:</span>
                  <span>${project.presale_price || 'TBA'}</span>
                </div>
                <div className="summary-row">
                  <span>Min Investment:</span>
                  <span>{project.min_allocation || project.min_contribution || '0.1'} {getCurrentCurrencySymbol()}</span>
                </div>
                <div className="summary-row">
                  <span>Max Investment:</span>
                  <span>{project.max_allocation || project.max_contribution || '10'} {getCurrentCurrencySymbol()}</span>
                </div>
                <div className="summary-row">
                  <span>Blockchain:</span>
                  <span>{getChainInfo(project.ido_chain_id || project.chain_id).name}</span>
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

              {/* USDT-specific information */}
              {project.payment_method === 'usdt' && (
                <div className="usdt-info-section">
                  <div className="usdt-balance-info">
                    <div className="balance-row">
                      <span>Your USDT Balance:</span>
                      <span>{parseFloat(usdtBalance).toFixed(2)} USDT</span>
                    </div>
                    <div className="balance-row">
                      <span>USDT Allowance:</span>
                      <span>{parseFloat(usdtAllowance).toFixed(2)} USDT</span>
                    </div>
                  </div>
                  
                  {needsApproval && investAmount && parseFloat(investAmount) > 0 && (
                    <div className="approval-warning">
                      <p>⚠️ You need to approve USDT spending before you can invest</p>
                      <motion.button
                        className="btn-approve-usdt"
                        onClick={handleUSDTApproval}
                        disabled={isApprovingUSDT}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {isApprovingUSDT ? '⏳ Approving...' : `Approve ${investAmount} USDT`}
                      </motion.button>
                    </div>
                  )}
                </div>
              )}
              
              <div className="investment-input-section">
                <label>Investment Amount ({getCurrentCurrencySymbol()})</label>
                <input
                  type="number"
                  value={investAmount}
                  onChange={(e) => setInvestAmount(e.target.value)}
                  placeholder="0.0"
                  min={project.min_allocation || project.min_contribution || 0.1}
                  max={project.max_allocation || project.max_contribution || 10}
                  step="0.01"
                  className="investment-input"
                />
                {getPresaleContractAddress() && (
                  <p className="investment-note">
                    💡 {getCurrentCurrencySymbol()} will be sent directly to the presale smart contract
                    {project.payment_method === 'usdt' && (
                      <><br/>Make sure to approve USDT spending first if required</>
                    )}
                  </p>
                )}
              </div>
              
              {paymentError && (
                <div className="payment-error">
                  ⚠️ {paymentError}
                </div>
              )}
              
              <div className="modal-actions">
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
                >
                  {isProcessingPayment ? '⏳ Processing...' : `Invest ${investAmount || '0'} ${getCurrentCurrencySymbol()}`}
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
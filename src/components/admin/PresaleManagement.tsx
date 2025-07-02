import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../supabaseClient';
import { FiPlus, FiUpload, FiDollarSign, FiCalendar, FiSettings, FiTrash2, FiEdit, FiEye } from 'react-icons/fi';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
  is_active: boolean;
  display_order: number;
}

interface PresaleManagementProps {
  adminUser: { id: string; username: string; role: string };
}

const PresaleManagement: React.FC<PresaleManagementProps> = ({ adminUser }) => {
  const [presales, setPresales] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states
  const [projectName, setProjectName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [description, setDescription] = useState('');
  const [customCategory, setCustomCategory] = useState('private_sale');
  const [contractAddress, setContractAddress] = useState('');
  const [chainId, setChainId] = useState(56); // Default to BSC
  const [logoUrl, setLogoUrl] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [website, setWebsite] = useState('');
  const [telegram, setTelegram] = useState('');
  const [twitter, setTwitter] = useState('');
  
  // Sale specific fields
  const [tokensPerNative, setTokensPerNative] = useState('1000');
  const [bonusPercentage, setBonusPercentage] = useState('0');
  const [saleCountdownEnd, setSaleCountdownEnd] = useState('');
  const [saleStatus, setSaleStatus] = useState('upcoming');
  const [tokenPrice, setTokenPrice] = useState('');
  const [softCap, setSoftCap] = useState('');
  const [hardCap, setHardCap] = useState('');
  const [minContribution, setMinContribution] = useState('');
  const [maxContribution, setMaxContribution] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalSupply, setTotalSupply] = useState('');

  // KYC & Audit fields
  const [hasKyc, setHasKyc] = useState(false);
  const [kycLink, setKycLink] = useState('');
  const [hasAudit, setHasAudit] = useState(false);
  const [auditLink, setAuditLink] = useState('');

  // Token contract address (different from presale contract)
  const [tokenAddress, setTokenAddress] = useState('');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState('native'); // 'native' or 'usdt'
  const [usdtTokenAddress, setUsdtTokenAddress] = useState('');

  useEffect(() => {
    fetchPresales();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('sale_categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching categories:', error);
      } else {
        setCategories(data || []);
        // Set first category as default if available
        if (data && data.length > 0) {
          setCustomCategory(data[0].slug);
        }
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchPresales = async () => {
    try {
      const { data, error } = await supabase
        .from('project_submissions')
        .select(`
          *,
          ido_pools (
            id,
            status,
            total_supply,
            hard_cap,
            soft_cap,
            presale_rate,
            start_date,
            end_date,
            chain_id,
            presale_contract_address,
            native_token_symbol,
            banner_image_url
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching presales:', error);
        setError('Failed to fetch presales');
      } else {
        setPresales(data || []);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('An unexpected error occurred');
    }
  };

  const getChainInfo = (chainId: number) => {
    const chains: Record<number, { name: string; symbol: string; logo: string }> = {
      1: { name: 'Ethereum', symbol: 'ETH', logo: '/images/logo/ethereum-logo.svg' },
      56: { name: 'BNB Smart Chain', symbol: 'BNB', logo: '/images/logo/bsc-logo.svg' },
      137: { name: 'Polygon', symbol: 'MATIC', logo: '/images/logo/polygon-logo.svg' },
      42161: { name: 'Arbitrum', symbol: 'ETH', logo: '/images/logo/arbitrum-logo.svg' },
      10: { name: 'Optimism', symbol: 'ETH', logo: '/images/logo/optimism-logo.svg' }
    };
    return chains[chainId] || { name: 'Unknown', symbol: 'ETH', logo: '/images/logo/ethereum-logo.svg' };
  };

  const resetForm = () => {
    setProjectName('');
    setTokenSymbol('');
    setDescription('');
    setCustomCategory('private_sale');
    setContractAddress('');
    setChainId(56);
    setLogoUrl('');
    setBannerUrl('');
    setWebsite('');
    setTelegram('');
    setTwitter('');
    setTokensPerNative('1000');
    setBonusPercentage('0');
    setSaleCountdownEnd('');
    setSaleStatus('upcoming');
    setTokenPrice('');
    setSoftCap('');
    setHardCap('');
    setMinContribution('');
    setMaxContribution('');
    setStartDate('');
    setEndDate('');
    setTotalSupply('');
    setHasKyc(false);
    setKycLink('');
    setHasAudit(false);
    setAuditLink('');
    setTokenAddress('');
    setPaymentMethod('native');
    setUsdtTokenAddress('');
    setError(null);
    setSuccess(null);
  };

  const handleCreatePresale = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Validation
      if (!projectName || !tokenSymbol || !contractAddress || !tokenPrice || !hardCap) {
        throw new Error('Please fill in all required fields');
      }

      // Additional validation for USDT payment method
      if (paymentMethod === 'usdt' && !usdtTokenAddress) {
        throw new Error('USDT token address is required when using USDT payment method');
      }

      // Generate unique slug
      const baseSlug = projectName.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');

      // Check for existing slugs and generate unique one
      let slug = baseSlug;
      let slugExists = true;
      let counter = 1;

      while (slugExists) {
        const { data: existingProject, error: slugError } = await supabase
          .from('project_submissions')
          .select('id')
          .eq('slug', slug)
          .single();

        if (slugError && slugError.code === 'PGRST116') {
          // No matching record found, slug is unique
          slugExists = false;
        } else if (existingProject) {
          // Slug exists, try with counter
          slug = `${baseSlug}-${counter}`;
          counter++;
        } else {
          // Other error occurred
          throw new Error('Error checking slug uniqueness');
        }

        // Safety check to prevent infinite loop
        if (counter > 100) {
          slug = `${baseSlug}-${Date.now()}`;
          break;
        }
      }

      const chainInfo = getChainInfo(chainId);

      // Create project submission
      const projectData = {
        project_name: projectName,
        token_symbol: tokenSymbol,
        description: description || `${projectName} - ${customCategory} project`,
        custom_category: customCategory,
        contract_address: contractAddress,
        chain_id: chainId,
        native_token_symbol: chainInfo.symbol,
        logo_url: logoUrl,
        banner_url: bannerUrl,
        website: website,
        telegram: telegram,
        twitter: twitter,
        slug: slug,
        status: 'approved',
        total_supply: totalSupply ? parseInt(totalSupply) : 1000000000,
        presale_price: parseFloat(tokenPrice),
        soft_cap: parseFloat(softCap || '0'),
        hard_cap: parseFloat(hardCap),
        min_contribution: parseFloat(minContribution || '0.1'),
        max_contribution: parseFloat(maxContribution || '10'),
        presale_start: startDate ? new Date(startDate).toISOString() : null,
        presale_end: endDate ? new Date(endDate).toISOString() : null,
        current_raised: 0,
        investor_count: 0,
        tokens_per_native: parseFloat(tokensPerNative),
        bonus_percentage: parseFloat(bonusPercentage),
        sale_countdown_end: saleCountdownEnd ? new Date(saleCountdownEnd).toISOString() : null,
        sale_status: saleStatus,
        has_kyc: hasKyc,
        kyc_link: kycLink,
        has_audit: hasAudit,
        audit_link: auditLink,
        token_address: tokenAddress,
        payment_method: paymentMethod,
        usdt_token_address: usdtTokenAddress
      };

      const { data: project, error: projectError } = await supabase
        .from('project_submissions')
        .insert([projectData])
        .select()
        .single();

      if (projectError) throw projectError;

      // Create IDO pool
      const idoData = {
        project_id: project.id,
        token_address: contractAddress,
        total_supply: totalSupply ? parseInt(totalSupply) : 1000000000,
        hard_cap: parseFloat(hardCap),
        soft_cap: parseFloat(softCap || '0'),
        min_allocation: parseFloat(minContribution || '0.1'),
        max_allocation: parseFloat(maxContribution || '10'),
        presale_rate: parseFloat(tokenPrice),
        listing_rate: parseFloat(tokenPrice) * 0.8, // 20% discount for listing
        start_date: startDate ? new Date(startDate).toISOString() : new Date().toISOString(),
        end_date: endDate ? new Date(endDate).toISOString() : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        liquidity_percentage: 70,
        liquidity_unlock_date: endDate ? new Date(new Date(endDate).getTime() + 365 * 24 * 60 * 60 * 1000).toISOString() : new Date(Date.now() + 395 * 24 * 60 * 60 * 1000).toISOString(),
        owner_wallet: adminUser.id,
        status: startDate && new Date(startDate) > new Date() ? 'upcoming' : 'active',
        chain_id: chainId,
        presale_contract_address: contractAddress,
        native_token_symbol: chainInfo.symbol,
        banner_image_url: bannerUrl,
        payment_method: paymentMethod,
        usdt_token_address: usdtTokenAddress
      };

      const { error: idoError } = await supabase
        .from('ido_pools')
        .insert([idoData]);

      if (idoError) throw idoError;

      setSuccess(`${customCategory.charAt(0).toUpperCase() + customCategory.slice(1).replace('_', ' ')} created successfully!`);
      resetForm();
      setShowCreateForm(false);
      fetchPresales();

    } catch (err: any) {
      console.error('Error creating presale:', err);
      setError(err.message || 'Failed to create presale');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePresale = async (projectId: string, idoId?: string) => {
    if (!window.confirm('Are you sure you want to delete this presale? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);

      // Delete IDO pool first if exists
      if (idoId) {
        const { error: idoError } = await supabase
          .from('ido_pools')
          .delete()
          .eq('id', idoId);

        if (idoError) throw idoError;
      }

      // Delete project submission
      const { error: projectError } = await supabase
        .from('project_submissions')
        .delete()
        .eq('id', projectId);

      if (projectError) throw projectError;

      setSuccess('Presale deleted successfully');
      fetchPresales();

    } catch (err: any) {
      console.error('Error deleting presale:', err);
      setError(err.message || 'Failed to delete presale');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'upcoming': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'ended': case 'completed': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'presale': return <FiDollarSign className="w-4 h-4" />;
      case 'fair_launch': return <FiSettings className="w-4 h-4" />;
      case 'ido': return <FiUpload className="w-4 h-4" />;
      default: return <FiDollarSign className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Presale Management</h1>
          <p className="text-gray-400">Create and manage token launches. Presales & Fair Launches appear on Sale page, IDOs appear on Join IDO page.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 rounded-lg text-white font-semibold shadow-lg"
        >
          <FiPlus className="w-5 h-5" />
          <span>Create New Presale</span>
        </motion.button>
      </div>

      {/* Alerts */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg"
        >
          {error}
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-500/20 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg"
        >
          {success}
        </motion.div>
      )}

      {/* Create Presale Form */}
      {showCreateForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Create New Presale</h2>
          
          <form onSubmit={handleCreatePresale} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Project Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-300">Project Information</h3>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Project Name *</label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="e.g., My Token Project"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Token Symbol *</label>
                  <input
                    type="text"
                    value={tokenSymbol}
                    onChange={(e) => setTokenSymbol(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="e.g., MTK"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Category *</label>
                  <select
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.slug}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                  {categories.length === 0 && (
                    <p className="text-gray-500 text-sm mt-1">No categories available. Create categories first.</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Blockchain Network *</label>
                  <select
                    value={chainId}
                    onChange={(e) => setChainId(parseInt(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value={56}>BNB Smart Chain (BSC)</option>
                    <option value={1}>Ethereum</option>
                    <option value={137}>Polygon</option>
                    <option value={42161}>Arbitrum</option>
                    <option value={10}>Optimism</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Presale Smart Contract Address *</label>
                  <input
                    type="text"
                    value={contractAddress}
                    onChange={(e) => setContractAddress(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="0x... (presale contract where users send funds)"
                    required
                  />
                  <p className="text-gray-500 text-sm mt-1">
                    Contract address where users send {paymentMethod === 'usdt' ? 'USDT' : getChainInfo(chainId).symbol} to participate
                  </p>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Token Contract Address</label>
                  <input
                    type="text"
                    value={tokenAddress}
                    onChange={(e) => setTokenAddress(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="0x... (token contract address)"
                  />
                  <p className="text-gray-500 text-sm mt-1">The actual token contract address (for blockchain explorer link)</p>
                </div>
              </div>

              {/* Sale Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-300">Sale Details</h3>
                
                {/* Payment Method Selection */}
                <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600">
                  <label className="block text-gray-300 text-sm font-medium mb-3">Payment Method *</label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        id="payment-native"
                        name="paymentMethod"
                        value="native"
                        checked={paymentMethod === 'native'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
                      />
                      <label htmlFor="payment-native" className="text-gray-300 text-sm">
                        Native Token ({getChainInfo(chainId).symbol})
                      </label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        id="payment-usdt"
                        name="paymentMethod"
                        value="usdt"
                        checked={paymentMethod === 'usdt'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
                      />
                      <label htmlFor="payment-usdt" className="text-gray-300 text-sm">
                        USDT Token
                      </label>
                    </div>
                  </div>
                  
                  {paymentMethod === 'usdt' && (
                    <div className="mt-4">
                      <label className="block text-gray-300 text-sm font-medium mb-2">USDT Contract Address *</label>
                      <input
                        type="text"
                        value={usdtTokenAddress}
                        onChange={(e) => setUsdtTokenAddress(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        placeholder="0x... (USDT token contract address)"
                        required={paymentMethod === 'usdt'}
                      />
                      <p className="text-gray-500 text-sm mt-1">Contract address of the USDT token users will pay with</p>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Tokens per {paymentMethod === 'usdt' ? 'USDT' : getChainInfo(chainId).symbol} *
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={tokensPerNative}
                    onChange={(e) => setTokensPerNative(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="1000"
                    required
                  />
                  <p className="text-gray-500 text-sm mt-1">
                    How many tokens buyers get per 1 {paymentMethod === 'usdt' ? 'USDT' : getChainInfo(chainId).symbol}
                  </p>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Bonus Percentage</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={bonusPercentage}
                    onChange={(e) => setBonusPercentage(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="0"
                  />
                  <p className="text-gray-500 text-sm mt-1">Additional bonus tokens (0-100%)</p>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Sale Countdown End</label>
                  <input
                    type="datetime-local"
                    value={saleCountdownEnd}
                    onChange={(e) => setSaleCountdownEnd(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                  <p className="text-gray-500 text-sm mt-1">When the sale countdown timer ends</p>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Sale Status</label>
                  <select
                    value={saleStatus}
                    onChange={(e) => setSaleStatus(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="live">Live</option>
                    <option value="ended">Ended</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Token Price (in {paymentMethod === 'usdt' ? 'USDT' : getChainInfo(chainId).symbol}) *
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    value={tokenPrice}
                    onChange={(e) => setTokenPrice(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="0.001"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Soft Cap ({paymentMethod === 'usdt' ? 'USDT' : getChainInfo(chainId).symbol})
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={softCap}
                      onChange={(e) => setSoftCap(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      placeholder="50"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Hard Cap ({paymentMethod === 'usdt' ? 'USDT' : getChainInfo(chainId).symbol}) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={hardCap}
                      onChange={(e) => setHardCap(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      placeholder="100"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Min Contribution ({paymentMethod === 'usdt' ? 'USDT' : getChainInfo(chainId).symbol})
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={minContribution}
                      onChange={(e) => setMinContribution(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      placeholder="0.1"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Max Contribution ({paymentMethod === 'usdt' ? 'USDT' : getChainInfo(chainId).symbol})
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={maxContribution}
                      onChange={(e) => setMaxContribution(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      placeholder="10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Start Date</label>
                    <input
                      type="datetime-local"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">End Date</label>
                    <input
                      type="datetime-local"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Media & Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Logo URL</label>
                <input
                  type="url"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="https://example.com/logo.png"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Banner URL</label>
                <input
                  type="url"
                  value={bannerUrl}
                  onChange={(e) => setBannerUrl(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="https://example.com/banner.jpg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Website</label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="https://yourproject.com"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Telegram</label>
                <input
                  type="url"
                  value={telegram}
                  onChange={(e) => setTelegram(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="https://t.me/yourproject"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Twitter</label>
                <input
                  type="url"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="https://twitter.com/yourproject"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                placeholder="Brief description of your project..."
              />
            </div>

            {/* KYC & Audit Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-600 pt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-300 flex items-center space-x-2">
                  <span>🔐</span>
                  <span>KYC Information</span>
                </h3>
                
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="hasKyc"
                    checked={hasKyc}
                    onChange={(e) => setHasKyc(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="hasKyc" className="text-gray-300 text-sm font-medium">
                    Project has completed KYC
                  </label>
                </div>

                {hasKyc && (
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">KYC Certificate URL</label>
                    <input
                      type="url"
                      value={kycLink}
                      onChange={(e) => setKycLink(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      placeholder="https://kyc-provider.com/certificate"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-300 flex items-center space-x-2">
                  <span>🛡️</span>
                  <span>Audit Information</span>
                </h3>
                
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="hasAudit"
                    checked={hasAudit}
                    onChange={(e) => setHasAudit(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="hasAudit" className="text-gray-300 text-sm font-medium">
                    Smart contract is audited
                  </label>
                </div>

                {hasAudit && (
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Audit Report URL</label>
                    <input
                      type="url"
                      value={auditLink}
                      onChange={(e) => setAuditLink(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      placeholder="https://audit-firm.com/report"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  resetForm();
                }}
                className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Presale'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Presales List - Simplified version showing the completed presale list */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Existing Presales</h2>
        </div>

        {presales.length === 0 ? (
          <div className="text-center py-12">
            <FiDollarSign className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">No presales created yet</p>
            <p className="text-gray-500 text-sm">Create your first presale to get started</p>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {presales.map((presale) => (
                <motion.div
                  key={presale.id}
                  whileHover={{ y: -5 }}
                  className="bg-gray-700/30 rounded-xl p-6 border border-gray-600 hover:border-blue-500/50 transition-all"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    {presale.logo_url ? (
                      <img 
                        src={presale.logo_url} 
                        alt={presale.project_name} 
                        className="w-12 h-12 rounded-full object-cover" 
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                        {presale.token_symbol?.charAt(0) || 'T'}
                      </div>
                    )}
                    <div>
                      <h3 className="text-white font-semibold">{presale.project_name}</h3>
                      <p className="text-gray-400 text-sm">{presale.token_symbol}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Category:</span>
                      <span className="text-white capitalize">
                        {(presale.presale_category || 'presale').replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Hard Cap:</span>
                      <span className="text-white">
                        {presale.hard_cap || 'N/A'} {getChainInfo(presale.chain_id || 56).symbol}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Status:</span>
                      <span className="text-green-400">{presale.status || 'pending'}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <img 
                        src={getChainInfo(presale.chain_id || 56).logo} 
                        alt={getChainInfo(presale.chain_id || 56).name}
                        className="w-5 h-5"
                      />
                      <span className="text-gray-400 text-sm">
                        {getChainInfo(presale.chain_id || 56).name}
                      </span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors">
                        <FiEye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-yellow-400 hover:bg-yellow-500/20 rounded-lg transition-colors">
                        <FiEdit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeletePresale(presale.id, presale.ido_pools?.[0]?.id)}
                        className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PresaleManagement; 
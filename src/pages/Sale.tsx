import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { supabase } from '../supabaseClient';

interface PresaleProject {
  id: string;
  project_name: string;
  token_symbol: string;
  description: string;
  custom_category: string;
  presale_price: number;
  soft_cap: number;
  hard_cap: number;
  min_contribution: number;
  max_contribution: number;
  presale_start: string;
  presale_end: string;
  current_raised: number;
  investor_count: number;
  logo_url?: string;
  banner_url?: string;
  website?: string;
  twitter?: string;
  telegram?: string;
  chain_id: number;
  native_token_symbol: string;
  status: string;
  contract_address?: string;
  slug?: string;
  has_kyc?: boolean;
  kyc_link?: string;
  has_audit?: boolean;
  audit_link?: string;
  token_address?: string;
  // IDO pool data
  ido_pools?: Array<{
    id: string;
    status: string;
    start_date: string;
    end_date: string;
    presale_rate: number;
    total_supply: number;
    banner_image_url?: string;
  }>;
}

const Sale: React.FC = () => {
  const [projects, setProjects] = useState<PresaleProject[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'live' | 'upcoming' | 'ended'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copyToast, setCopyToast] = useState(false);

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
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchPresales = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('project_submissions')
        .select(`
          *,
          ido_pools (
            id,
            status,
            start_date,
            end_date,
            presale_rate,
            total_supply,
            banner_image_url
          )
        `)
        .eq('status', 'approved')
        .neq('custom_category', 'ido')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching presales:', error);
        setError('Failed to load presales');
      } else {
        const transformedProjects = (data || []).map(project => ({
          ...project,
          // Determine current status based on dates and pool status
          current_status: getCurrentStatus(project, project.ido_pools?.[0]),
          // Calculate progress
          progress: project.hard_cap > 0 ? (project.current_raised / project.hard_cap) * 100 : 0
        }));
        
        setProjects(transformedProjects);
        console.log('Fetched presales:', transformedProjects.length);
      }
    } catch (err: any) {
      console.error('Error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentStatus = (project: any, idoPool?: any): 'live' | 'upcoming' | 'ended' => {
    const now = new Date();
    const startDate = new Date(project.presale_start || idoPool?.start_date || now);
    const endDate = new Date(project.presale_end || idoPool?.end_date || now);

    if (idoPool?.status) {
      if (idoPool.status === 'active') return 'live';
      if (idoPool.status === 'upcoming') return 'upcoming';
      if (idoPool.status === 'ended' || idoPool.status === 'completed') return 'ended';
    }

    if (now < startDate) return 'upcoming';
    if (now > endDate) return 'ended';
    return 'live';
  };

  const getChainInfo = (chainId: number) => {
    const chains: Record<number, { name: string; symbol: string; logo: string; color: string; explorer: string }> = {
      1: { 
        name: 'Ethereum', 
        symbol: 'ETH', 
        logo: '/images/logo/ethereum-logo.svg',
        color: 'from-blue-400 to-blue-600',
        explorer: 'https://etherscan.io'
      },
      56: { 
        name: 'BNB Smart Chain', 
        symbol: 'BNB', 
        logo: '/images/logo/bsc-logo.svg',
        color: 'from-yellow-400 to-yellow-600',
        explorer: 'https://bscscan.com'
      },
      137: { 
        name: 'Polygon', 
        symbol: 'MATIC', 
        logo: '/images/logo/polygon-logo.svg',
        color: 'from-purple-400 to-purple-600',
        explorer: 'https://polygonscan.com'
      },
      42161: { 
        name: 'Arbitrum', 
        symbol: 'ETH', 
        logo: '/images/logo/arbitrum-logo.svg',
        color: 'from-blue-400 to-blue-600',
        explorer: 'https://arbiscan.io'
      },
      10: { 
        name: 'Optimism', 
        symbol: 'ETH', 
        logo: '/images/logo/optimism-logo.svg',
        color: 'from-red-400 to-red-600',
        explorer: 'https://optimistic.etherscan.io'
      }
    };
    return chains[chainId] || { 
      name: 'Unknown', 
      symbol: 'ETH', 
      logo: '/images/logo/ethereum-logo.svg',
      color: 'from-gray-400 to-gray-600',
      explorer: 'https://etherscan.io'
    };
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

  const filteredProjects = projects.filter(project => {
    let matchesCategory = true;
    let matchesStatus = true;
    let matchesSearch = true;

    // Category filter
    if (selectedFilter !== 'all') {
      matchesCategory = project.custom_category === selectedFilter;
    }

    // Status filter
    if (statusFilter !== 'all') {
      const currentStatus = getCurrentStatus(project, project.ido_pools?.[0]);
      matchesStatus = currentStatus === statusFilter;
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      matchesSearch = 
        project.project_name?.toLowerCase().includes(query) ||
        project.token_symbol?.toLowerCase().includes(query) ||
        project.description?.toLowerCase().includes(query);
    }

    return matchesCategory && matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'upcoming': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'ended': return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'presale': return '💰';
      case 'fair_launch': return '🚀';
      case 'ido': return '💎';
      default: return '💰';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'presale': return 'from-blue-500 to-cyan-500';
      case 'fair_launch': return 'from-green-500 to-emerald-500';
      case 'ido': return 'from-purple-500 to-pink-500';
      default: return 'from-blue-500 to-cyan-500';
    }
  };

  const formatCurrency = (amount: number, symbol: string) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M ${symbol}`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K ${symbol}`;
    }
    return `${amount} ${symbol}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <Navigation />
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading presales...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <Navigation />
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">⚠ Error</div>
          <p className="text-gray-400 mb-4">{error}</p>
          <button 
            onClick={fetchPresales}
            className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] font-[Space_Grotesk]">
      <Navigation />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Presale & Fair Launch
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Discover and participate in the latest presales and fair launches. Get early access to innovative blockchain projects with instant token distribution.
            </p>
            <div className="mt-6 flex justify-center items-center space-x-4 text-sm text-gray-500">
              <span>Total Projects: {projects.length}</span>
              <span>•</span>
              <span>Live Now: {projects.filter(p => getCurrentStatus(p, p.ido_pools?.[0]) === 'live').length}</span>
              <span>•</span>
              <span>Upcoming: {projects.filter(p => getCurrentStatus(p, p.ido_pools?.[0]) === 'upcoming').length}</span>
            </div>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12 bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800"
          >
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-10 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

                             {/* Category Filter */}
               <div className="flex flex-wrap gap-2">
                 <button
                   key="all"
                   onClick={() => setSelectedFilter('all')}
                   className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 flex items-center space-x-2 ${
                     selectedFilter === 'all'
                       ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg'
                       : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 border border-gray-700'
                   }`}
                 >
                   <span>🌟</span>
                   <span>All Sales</span>
                 </button>
                 {categories.map((category) => (
                  <button
                    key={category.slug}
                    onClick={() => setSelectedFilter(category.slug)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 flex items-center space-x-2 ${
                      selectedFilter === category.slug
                        ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg'
                        : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 border border-gray-700'
                    }`}
                  >
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                  </button>
                ))}
              </div>

              {/* Status Filter */}
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'all', label: 'All Status' },
                  { key: 'live', label: 'Live' },
                  { key: 'upcoming', label: 'Upcoming' },
                  { key: 'ended', label: 'Ended' }
                ].map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => setStatusFilter(filter.key as any)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                      statusFilter === filter.key
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                        : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 border border-gray-700'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => {
              const currentStatus = getCurrentStatus(project, project.ido_pools?.[0]);
              const chainInfo = getChainInfo(project.chain_id);
              const progress = project.hard_cap > 0 ? (project.current_raised / project.hard_cap) * 100 : 0;
              
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 overflow-hidden hover:border-cyan-500/50 transition-all duration-300 group"
                >
                  {/* Project Banner/Image */}
                  <div className="relative h-48 bg-gradient-to-br from-cyan-600/20 to-purple-600/20 overflow-hidden">
                    {project.banner_url || project.ido_pools?.[0]?.banner_image_url ? (
                      <img
                        src={project.banner_url || project.ido_pools?.[0]?.banner_image_url}
                        alt={project.project_name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${getCategoryColor(project.custom_category)} opacity-20 flex items-center justify-center`}>
                        <span className="text-4xl">{getCategoryIcon(project.custom_category)}</span>
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(currentStatus)}`}>
                      {currentStatus.toUpperCase()}
                    </div>

                    {/* Chain Badge & Trust Badges */}
                    <div className="absolute top-4 left-4 flex flex-col space-y-2">
                      <div className="flex items-center space-x-2 bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1">
                        <img
                          src={chainInfo.logo}
                          alt={chainInfo.name}
                          className="w-5 h-5"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMTAiIGZpbGw9IiM2MzY2RjEiLz4KPHN2ZyB4PSI1IiB5PSI1IiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IndoaXRlIj4KPHBhdGggZD0iTTUgNWgxMHYxMEg1eiIvPgo8L3N2Zz4KPC9zdmc+';
                          }}
                        />
                        <span className="text-white text-xs font-medium">{chainInfo.symbol}</span>
                      </div>
                      
                      {/* Trust Badges */}
                      <div className="flex space-x-1">
                        {project.has_kyc && (
                          <div className="bg-green-500/20 backdrop-blur-sm rounded-md px-2 py-1 border border-green-500/30">
                            <span className="text-green-400 text-xs font-semibold">🔐 KYC</span>
                          </div>
                        )}
                        {project.has_audit && (
                          <div className="bg-blue-500/20 backdrop-blur-sm rounded-md px-2 py-1 border border-blue-500/30">
                            <span className="text-blue-400 text-xs font-semibold">🛡️ AUDIT</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute bottom-4 left-4">
                      <div className={`bg-gradient-to-r ${getCategoryColor(project.custom_category)} px-3 py-1 rounded-full text-xs font-semibold text-white flex items-center space-x-1`}>
                        <span>{getCategoryIcon(project.custom_category)}</span>
                        <span>{project.custom_category.replace('_', ' ').toUpperCase()}</span>
                      </div>
                    </div>

                    {/* Project Logo */}
                    <div className="absolute bottom-4 right-4">
                      {project.logo_url ? (
                        <img
                          src={project.logo_url}
                          alt={project.project_name}
                          className="w-12 h-12 rounded-full border-2 border-white/20 object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white font-bold border-2 border-white/20">
                          {project.token_symbol?.charAt(0) || 'T'}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Project Info */}
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                        {project.project_name}
                      </h3>
                      <span className="text-cyan-400 font-semibold text-sm bg-cyan-400/10 px-2 py-1 rounded">
                        {project.token_symbol}
                      </span>
                    </div>
                    
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {project.description || 'No description available'}
                    </p>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-gray-500 text-xs">Token Price</p>
                        <p className="text-white font-semibold">
                          {project.presale_price || project.ido_pools?.[0]?.presale_rate || 'TBA'} {chainInfo.symbol}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Hard Cap</p>
                        <p className="text-white font-semibold">
                          {formatCurrency(project.hard_cap, chainInfo.symbol)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Raised</p>
                        <p className="text-green-400 font-semibold">
                          {formatCurrency(project.current_raised, chainInfo.symbol)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Participants</p>
                        <p className="text-white font-semibold">{project.investor_count}</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {currentStatus !== 'upcoming' && project.hard_cap > 0 && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-400">Progress</span>
                          <span className="text-cyan-400">{Math.min(progress, 100).toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Trust Indicators */}
                    {(project.has_kyc || project.has_audit) && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.has_kyc && (
                          <a
                            href={project.kyc_link || '#'}
                            target={project.kyc_link ? "_blank" : undefined}
                            rel={project.kyc_link ? "noopener noreferrer" : undefined}
                            className={`flex items-center space-x-2 px-3 py-1 rounded-lg border text-xs font-semibold transition-all ${
                              project.kyc_link 
                                ? 'bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20 cursor-pointer' 
                                : 'bg-green-500/10 border-green-500/30 text-green-400'
                            }`}
                          >
                            <span>🔐</span>
                            <span>KYC Verified</span>
                            {project.kyc_link && <span>↗</span>}
                          </a>
                        )}
                        {project.has_audit && (
                          <a
                            href={project.audit_link || '#'}
                            target={project.audit_link ? "_blank" : undefined}
                            rel={project.audit_link ? "noopener noreferrer" : undefined}
                            className={`flex items-center space-x-2 px-3 py-1 rounded-lg border text-xs font-semibold transition-all ${
                              project.audit_link 
                                ? 'bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20 cursor-pointer' 
                                : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                            }`}
                          >
                            <span>🛡️</span>
                            <span>Audited</span>
                            {project.audit_link && <span>↗</span>}
                          </a>
                        )}
                      </div>
                    )}

                    {/* Social Links */}
                    {(project.website || project.twitter || project.telegram) && (
                      <div className="flex space-x-2 mb-4">
                        {project.website && (
                          <a
                            href={project.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg text-gray-400 hover:text-white transition-colors"
                          >
                            🌐
                          </a>
                        )}
                        {project.twitter && (
                          <a
                            href={project.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg text-gray-400 hover:text-white transition-colors"
                          >
                            🐦
                          </a>
                        )}
                        {project.telegram && (
                          <a
                            href={project.telegram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg text-gray-400 hover:text-white transition-colors"
                          >
                            📱
                          </a>
                        )}
                      </div>
                    )}

                    {/* Action Button */}
                    <button 
                      onClick={() => {
                        if (project.slug) {
                          window.open(`/sale/${project.slug}`, '_blank');
                        } else {
                          window.open(`/sale/${project.id}`, '_blank');
                        }
                      }}
                      className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 group-hover:scale-105 shadow-lg hover:shadow-cyan-500/25"
                    >
                      {currentStatus === 'live' ? 'Join Sale' : 
                       currentStatus === 'upcoming' ? 'View Details' : 'View Project'}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filteredProjects.length === 0 && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-400 text-lg mb-2">No projects found</p>
              <p className="text-gray-500">Try adjusting your filters or search query</p>
              {(selectedFilter !== 'all' || statusFilter !== 'all' || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedFilter('all');
                    setStatusFilter('all');
                    setSearchQuery('');
                  }}
                  className="mt-4 px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </motion.div>
          )}
        </div>
      </main>

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

export default Sale; 
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { supabase } from '../supabaseClient';

// Types
interface IDOProject {
  id: string;
  project_name: string;
  token_symbol: string;
  description: string;
  presale_category: 'ido';
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
  rating?: number;
  category?: string;
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

const IDOSales: React.FC = () => {
  const [projects, setProjects] = useState<IDOProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeMainTab, setActiveMainTab] = useState<'sales' | 'contributions' | 'favorites'>('sales');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'live' | 'upcoming' | 'ended'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [favoriteProjects, setFavoriteProjects] = useState<string[]>([]);
  const [userContributions, setUserContributions] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchIDOProjects();
    // Load favorites and contributions from localStorage
    const savedFavorites = localStorage.getItem('ido_favorites');
    const savedContributions = localStorage.getItem('ido_contributions');
    if (savedFavorites) setFavoriteProjects(JSON.parse(savedFavorites));
    if (savedContributions) setUserContributions(JSON.parse(savedContributions));
  }, []);

  const fetchIDOProjects = async () => {
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
        .eq('presale_category', 'ido')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching IDO projects:', error);
        setError('Failed to load IDO projects');
      } else {
        const transformedProjects = (data || []).map(project => ({
          ...project,
          // Determine current status based on dates and pool status
          current_status: getCurrentStatus(project, project.ido_pools?.[0]),
          // Calculate progress
          progress: project.hard_cap > 0 ? (project.current_raised / project.hard_cap) * 100 : 0
        }));
        
        setProjects(transformedProjects);
        console.log('Fetched IDO projects:', transformedProjects.length);
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
    const chains: Record<number, { name: string; symbol: string; logo: string }> = {
      1: { name: 'Ethereum', symbol: 'ETH', logo: '/images/logo/ethereum-logo.svg' },
      56: { name: 'BNB Smart Chain', symbol: 'BNB', logo: '/images/logo/bsc-logo.svg' },
      137: { name: 'Polygon', symbol: 'MATIC', logo: '/images/logo/polygon-logo.svg' },
      42161: { name: 'Arbitrum', symbol: 'ETH', logo: '/images/logo/arbitrum-logo.svg' },
      10: { name: 'Optimism', symbol: 'ETH', logo: '/images/logo/optimism-logo.svg' }
    };
    return chains[chainId] || { name: 'Unknown', symbol: 'ETH', logo: '/images/logo/ethereum-logo.svg' };
  };

  const filteredProjects = projects.filter(project => {
    // Filter by main tab
    let matchesMainTab = true;
    if (activeMainTab === 'contributions') {
      matchesMainTab = userContributions.includes(project.id);
    } else if (activeMainTab === 'favorites') {
      matchesMainTab = favoriteProjects.includes(project.id);
    }

    // Filter by status
    let matchesFilter = true;
    if (selectedFilter !== 'all') {
      const currentStatus = getCurrentStatus(project, project.ido_pools?.[0]);
      matchesFilter = currentStatus === selectedFilter;
    }
    
    // Filter by search
    const matchesSearch = project.project_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.token_symbol?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesMainTab && matchesFilter && matchesSearch;
  });

  const toggleFavorite = (projectId: string) => {
    const newFavorites = favoriteProjects.includes(projectId) 
      ? favoriteProjects.filter(id => id !== projectId)
      : [...favoriteProjects, projectId];
    
    setFavoriteProjects(newFavorites);
    localStorage.setItem('ido_favorites', JSON.stringify(newFavorites));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-green-500 text-white';
      case 'upcoming': return 'bg-yellow-500 text-black';
      case 'ended': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-cyan-500';
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
          <p className="text-gray-400">Loading IDO projects...</p>
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
            onClick={fetchIDOProjects}
            className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navigation />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Join IDO
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Discover and participate in Initial DEX Offerings. Multi-phase token launches with roadmaps, vesting schedules, and advanced tokenomics.
            </p>
            <div className="mt-6 flex justify-center items-center space-x-4 text-sm text-gray-500">
              <span>Total IDOs: {projects.length}</span>
              <span>•</span>
              <span>Live Now: {projects.filter(p => getCurrentStatus(p, p.ido_pools?.[0]) === 'live').length}</span>
              <span>•</span>
              <span>Upcoming: {projects.filter(p => getCurrentStatus(p, p.ido_pools?.[0]) === 'upcoming').length}</span>
            </div>
          </motion.div>

          {/* Main Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border-2 border-gray-800 p-2 inline-flex flex-wrap gap-2 md:gap-0">
              {[
                { id: 'sales', label: 'All IDOs', count: projects.length },
                { id: 'contributions', label: 'My Participations', count: userContributions.length },
                { id: 'favorites', label: 'Watchlist', count: favoriteProjects.length }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveMainTab(tab.id as any)}
                  className={`relative px-4 md:px-8 py-3 md:py-4 rounded-xl font-semibold text-xs md:text-sm uppercase tracking-wide transition-all duration-300 flex items-center gap-1 md:gap-2 ${
                    activeMainTab === tab.id
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-black shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`px-1.5 md:px-2 py-0.5 md:py-1 rounded-full text-xs font-bold ${
                    activeMainTab === tab.id 
                      ? 'bg-black/20 text-black' 
                      : 'bg-gray-700 text-gray-300'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
            
          {/* Filter and Search Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 p-6 mb-8"
          >
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search IDO projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Status Filters */}
              <div className="flex gap-2">
                {['all', 'live', 'upcoming', 'ended'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter as any)}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm uppercase tracking-wide transition-all duration-300 ${
                      selectedFilter === filter
                        ? 'bg-cyan-500 text-black'
                        : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 border border-gray-700'
                    }`}
                  >
                    {filter === 'all' ? 'All' : filter}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* IDO Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 overflow-hidden"
          >
            {/* Table Header */}
            <div className="bg-gray-800/50 px-6 py-4">
              <div className="grid grid-cols-2 md:grid-cols-7 gap-4 text-sm font-semibold text-gray-400 uppercase tracking-wide">
                <div className="col-span-2">Project</div>
                <div className="hidden md:block">Status</div>
                <div className="hidden md:block">Price</div>
                <div className="hidden md:block">Progress</div>
                <div className="hidden md:block">Participants</div>
                <div className="text-right">Action</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-800">
              {filteredProjects.map((project, index) => {
                const currentStatus = getCurrentStatus(project, project.ido_pools?.[0]);
                const chainInfo = getChainInfo(project.chain_id);
                const progress = project.hard_cap > 0 ? (project.current_raised / project.hard_cap) * 100 : 0;
                
                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="px-6 py-4 hover:bg-gray-800/30 transition-colors cursor-pointer"
                    onClick={() => {
                      if (project.slug) {
                        navigate(`/project/${project.slug}`);
                      } else {
                        navigate(`/project/${project.id}`);
                      }
                    }}
                  >
                    <div className="grid grid-cols-2 md:grid-cols-7 gap-4 items-center">
                      {/* Project Info */}
                      <div className="col-span-2 flex items-center gap-4">
                        {project.logo_url ? (
                          <img
                            src={project.logo_url}
                            alt={project.project_name}
                            className="w-12 h-12 rounded-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white font-bold">
                            {project.token_symbol?.charAt(0) || 'T'}
                          </div>
                        )}
                        <div>
                          <h3 className="font-bold text-white text-lg">{project.project_name}</h3>
                          <div className="flex items-center gap-2">
                            <span className="text-cyan-400 font-semibold">{project.token_symbol}</span>
                            <span className="text-xs text-gray-500">{chainInfo.name}</span>
                            <span className="text-xs text-gray-500">•</span>
                            <span className="text-xs text-gray-500">IDO</span>
                            {/* Chain Logo */}
                            <img
                              src={chainInfo.logo}
                              alt={chainInfo.name}
                              className="w-4 h-4"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="hidden md:block">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(currentStatus)}`}>
                          {currentStatus.toUpperCase()}
                        </span>
                      </div>

                      {/* Price */}
                      <div className="hidden md:block">
                        <span className="text-white font-semibold">
                          {project.presale_price || project.ido_pools?.[0]?.presale_rate || 'TBA'} {chainInfo.symbol}
                        </span>
                      </div>

                      {/* Progress */}
                      <div className="hidden md:block">
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Progress</span>
                            <span className="text-white">{Math.min(progress, 100).toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(progress)}`}
                              style={{ width: `${Math.min(progress, 100)}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-400">
                            {formatCurrency(project.current_raised, chainInfo.symbol)} / {formatCurrency(project.hard_cap, chainInfo.symbol)}
                          </div>
                        </div>
                      </div>

                      {/* Participants */}
                      <div className="hidden md:block text-center">
                        <div className="text-white font-semibold">{project.investor_count.toLocaleString()}</div>
                        <div className="text-xs text-gray-400">participants</div>
                      </div>

                      {/* Action */}
                      <div className="text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            className="p-2 rounded-lg text-gray-400 hover:text-red-400 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(project.id);
                            }}
                            title={favoriteProjects.includes(project.id) ? 'Remove from watchlist' : 'Add to watchlist'}
                          >
                            {favoriteProjects.includes(project.id) ? '❤️' : '🤍'}
                          </button>
                          <button
                            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
                              currentStatus === 'live'
                                ? 'bg-green-500 hover:bg-green-600 text-white'
                                : currentStatus === 'upcoming'
                                ? 'bg-yellow-500 hover:bg-yellow-600 text-black'
                                : 'bg-gray-600 hover:bg-gray-700 text-white'
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (project.slug) {
                                navigate(`/project/${project.slug}`);
                              } else {
                                navigate(`/project/${project.id}`);
                              }
                            }}
                          >
                            {currentStatus === 'live' ? 'Join IDO' : 
                             currentStatus === 'upcoming' ? 'View Roadmap' : 'View Details'}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Mobile Progress Bar */}
                    <div className="md:hidden mt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Progress: {Math.min(progress, 100).toFixed(1)}%</span>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(currentStatus)}`}>
                          {currentStatus.toUpperCase()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(progress)}`}
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>{formatCurrency(project.current_raised, chainInfo.symbol)} / {formatCurrency(project.hard_cap, chainInfo.symbol)}</span>
                        <span>{project.investor_count.toLocaleString()} participants</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {filteredProjects.length === 0 && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-4">💎</div>
              <h3 className="text-2xl font-bold text-gray-300 mb-2">No IDO projects found</h3>
              <p className="text-gray-400 mb-4">
                {activeMainTab === 'favorites' 
                  ? 'You haven\'t added any IDOs to your watchlist yet.' 
                  : activeMainTab === 'contributions'
                  ? 'You haven\'t participated in any IDOs yet.'
                  : 'Try adjusting your search or filter criteria.'
                }
              </p>
              {(selectedFilter !== 'all' || searchTerm) && (
                <button
                  onClick={() => {
                    setSelectedFilter('all');
                    setSearchTerm('');
                  }}
                  className="mt-4 px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </motion.div>
          )}

          {/* Stats Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12"
          >
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">
                {projects.filter(p => getCurrentStatus(p, p.ido_pools?.[0]) === 'live').length}
              </div>
              <div className="text-gray-400">Live IDOs</div>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6 text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {projects.filter(p => getCurrentStatus(p, p.ido_pools?.[0]) === 'upcoming').length}
              </div>
              <div className="text-gray-400">Upcoming IDOs</div>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6 text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-2">
                {projects.reduce((acc, p) => acc + p.investor_count, 0).toLocaleString()}
              </div>
              <div className="text-gray-400">Total Participants</div>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {formatCurrency(projects.reduce((acc, p) => acc + p.current_raised, 0), 'USD')}
              </div>
              <div className="text-gray-400">Total Raised</div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default IDOSales; 
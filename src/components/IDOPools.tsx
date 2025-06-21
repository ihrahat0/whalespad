import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import '../IDOPools.css';

type Pool = {
  id: string;
  project_id: string;
  token_address: string;
  total_supply: number;
  hard_cap: number;
  soft_cap: number | null;
  min_allocation: number | null;
  max_allocation: number | null;
  presale_rate: number;
  listing_rate: number | null;
  start_date: string;
  end_date: string;
  liquidity_percentage: number | null;
  liquidity_unlock_date: string | null;
  owner_wallet: string;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  chain_id?: number;
  native_token_symbol?: string;
  presale_contract_address?: string;
  // Fields from project details view
  project_name?: string;
  token_symbol?: string;
  logo_url?: string;
  banner_url?: string;
  category?: string;
  description?: string;
  total_raised?: number;
  total_contributors?: number;
  real_current_raised?: number;
  real_investor_count?: number;
  investor_count?: number;
  current_raised?: number;
  tokenomics?: any;
};

type PoolCategory = 'All' | 'Active' | 'Completed';

const IDOPools: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<PoolCategory>('All');
  const [pools, setPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPools = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch from project_details_view which includes all necessary data
        const { data, error } = await supabase
          .from('project_details_view')
          .select('*')
          .in('status', ['approved', 'live'])
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        const formattedPools: Pool[] = (data || []).map((project: any) => ({
          id: project.id,
          project_id: project.id,
          project_name: project.project_name,
          token_symbol: project.token_symbol,
          logo_url: project.logo_url,
          banner_url: project.banner_url,
          category: project.category,
          description: project.description,
          token_address: project.contract_address || '0x...',
          total_supply: project.total_supply || 0,
          hard_cap: project.hard_cap || 0,
          soft_cap: project.soft_cap || 0,
          min_allocation: project.min_contribution || 0,
          max_allocation: project.max_contribution || 0,
          presale_rate: project.presale_price ? (1 / project.presale_price) : 0,
          listing_rate: project.listing_price ? (1 / project.listing_price) : 0,
          start_date: project.presale_start || new Date().toISOString(),
          end_date: project.presale_end || new Date().toISOString(),
          liquidity_percentage: parseInt(project.liquidity_percent) || 0,
          liquidity_unlock_date: null,
          owner_wallet: '',
          status: project.status === 'live' ? 'active' : 'upcoming',
          current_raised: project.current_raised || 0,
          investor_count: project.investor_count || 0,
          real_current_raised: project.real_current_raised || project.current_raised || 0,
          real_investor_count: project.real_investor_count || project.investor_count || 0,
          chain_id: project.chain_id,
          native_token_symbol: project.native_token_symbol,
          presale_contract_address: project.presale_contract_address,
          tokenomics: project.tokenomics
        }));

        setPools(formattedPools);
      } catch (e: any) {
        console.error('Error fetching IDO pools:', e);
        setError(`Failed to fetch pools: ${e.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchPools();
  }, []);

  const filteredPools = pools.filter(pool => {
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Active') return pool.status === 'active' || pool.status === 'upcoming';
    if (selectedCategory === 'Completed') return pool.status === 'completed' || pool.status === 'cancelled';
    return false;
  });

  const getChainName = (chainId?: number) => {
    const chains: { [key: number]: string } = {
      1: 'Ethereum',
      56: 'BSC',
      137: 'Polygon',
      42161: 'Arbitrum',
      10: 'Optimism'
    };
    return chains[chainId || 1] || 'Ethereum';
  };

  const getNativeSymbol = (pool: Pool) => {
    if (pool.native_token_symbol) return pool.native_token_symbol;
    const symbols: { [key: number]: string } = {
      1: 'ETH',
      56: 'BNB',
      137: 'MATIC',
      42161: 'ETH',
      10: 'ETH'
    };
    return symbols[pool.chain_id || 1] || 'ETH';
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(0)}K`;
    return `$${num.toFixed(0)}`;
  };

  const handleCardClick = (poolId: string) => {
    navigate(`/project/${poolId}`);
  };

  if (loading) {
    return (
      <div className="ido-pools-modern">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading IDO Pools...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ido-pools-modern">
        <div className="error-container">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ido-pools-modern">
      <div className="container">
        {/* Header */}
        <motion.div 
          className="pools-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="pools-title">Active IDO Pools</h2>
          <p className="pools-subtitle">Discover and invest in the next generation of crypto projects</p>
        </motion.div>

        {/* Filter Tabs */}
        <div className="pools-filters">
          {(['All', 'Active', 'Completed'] as PoolCategory[]).map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`filter-tab ${selectedCategory === category ? 'active' : ''}`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Pools Grid */}
        <div className="pools-grid-modern">
          {filteredPools.map((pool, index) => (
            <motion.div
              key={pool.id}
              className="pool-card-modern"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => handleCardClick(pool.id)}
              whileHover={{ y: -5 }}
            >
              {/* Banner Image */}
              <div className="pool-banner" style={{ backgroundImage: `url(${pool.banner_url || 'https://via.placeholder.com/400x200'})` }}>
                <div className="banner-overlay"></div>
                <div className="pool-badges">
                  {pool.status === 'active' && (
                    <span className="badge-live">LIVE</span>
                  )}
                  <span className="badge-chain">{getChainName(pool.chain_id)}</span>
                </div>
              </div>

              {/* Card Content */}
              <div className="pool-content">
                {/* Project Header */}
                <div className="pool-header">
                  <div className="pool-logo">
                    {pool.logo_url ? (
                      <img src={pool.logo_url} alt={pool.project_name} />
                    ) : (
                      <div className="logo-placeholder">{pool.token_symbol?.charAt(0)}</div>
                    )}
                  </div>
                  <div className="pool-title-section">
                    <h3 className="pool-name">{pool.project_name}</h3>
                    <span className="pool-symbol">{pool.token_symbol}</span>
                  </div>
                </div>

                {/* Total Raise */}
                <div className="pool-info-row">
                  <span className="info-label">Total Raise</span>
                  <span className="info-value">{formatNumber(pool.hard_cap * 1000)}</span>
                </div>

                {/* Token Price */}
                <div className="pool-info-row">
                  <span className="info-label">Token Price</span>
                  <span className="info-value">${pool.presale_rate ? (1 / pool.presale_rate).toFixed(4) : '0.0000'}</span>
                </div>

                {/* Start Date */}
                <div className="pool-info-row">
                  <span className="info-label">Start date</span>
                  <span className="info-value">
                    {pool.start_date ? new Date(pool.start_date).toLocaleDateString() : 'TBA'}
                  </span>
                </div>

                {/* Progress */}
                <div className="pool-info-row">
                  <span className="info-label">Progress</span>
                  <span className="info-value">{((pool.real_current_raised || pool.current_raised || 0) / pool.hard_cap * 100).toFixed(1)}%</span>
                </div>

                {/* Action Button */}
                <button className="pool-action-btn">
                  {pool.status === 'active' ? 'Join Pool' : 'View Details'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredPools.length === 0 && (
          <div className="empty-state">
            <p>No pools found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IDOPools; 
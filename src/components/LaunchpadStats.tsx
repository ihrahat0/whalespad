import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

interface IDOPool {
  id: string;
  project_name: string;
  token_symbol: string;
  description?: string;
  target_amount?: number;
  current_amount?: number;
  start_date?: string;
  end_date?: string;
  token_price?: number;
  chain_id?: string;
  website?: string;
  telegram?: string;
  twitter?: string;
  logo_url?: string;
  category?: string;
  status?: string;
  total_raised?: number;
  presale_rate?: string;
  hard_cap?: number;
  native_token_symbol?: string;
  project_submissions?: {
    project_name: string;
    token_symbol: string;
    description: string;
    website: string;
    telegram: string;
    twitter: string;
    email: string;
    audit_link: string;
    whitepaper: string;
    logo_url?: string;
    banner_url?: string;
    category?: string;
  };
}

const LaunchpadStats: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('live');
  const [liveProjects, setLiveProjects] = useState<any[]>([]);
  const [upcomingProjects, setUpcomingProjects] = useState<any[]>([]);
  const [completedProjects, setCompletedProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const platformStats = [
    {
      label: 'ATH AVG ROI',
      value: '24.8%',
      change: '+130%',
      trend: 'up',
      icon: '💰',
      color: 'var(--primary-cyan)'
    },
    {
      label: 'Active Projects',
      value: liveProjects.length.toString(),
      change: `+${liveProjects.length}`,
      trend: 'up',
      icon: '🚀',
      color: 'var(--primary-green)'
    },
    {
      label: 'Total Investors',
      value: '345K',
      change: '+12.5%',
      trend: 'up',
      icon: '👥',
      color: 'var(--accent-purple)'
    },
    {
      label: 'Success Rate',
      value: '99.2%',
      change: '+0.5%',
      trend: 'up',
      icon: '⭐',
      color: 'var(--accent-gold)'
    }
  ];



  useEffect(() => {
    fetchIDOPools();
  }, []);

  const fetchIDOPools = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch from ido_pools with project data
      const { data: idoPools, error: idoError } = await supabase
        .from('ido_pools')
        .select(`
          *,
          project_submissions (
            project_name,
            token_symbol,
            description,
            website,
            telegram,
            twitter,
            email,
            audit_link,
            whitepaper,
            logo_url,
            banner_url,
            category
          )
        `)
        .limit(10);

      if (idoError) {
        console.error('Error fetching IDO pools:', idoError);
        throw idoError;
      }

      if (idoPools && idoPools.length > 0) {
        // Transform IDO pools data and categorize by status
        const transformedPools = idoPools.map((pool: IDOPool) => {
          const now = new Date();
          const startDate = new Date(pool.start_date || '');
          const endDate = new Date(pool.end_date || '');
          
          // Determine actual status based on dates
          let actualStatus = 'upcoming';
          if (endDate < now) {
            actualStatus = 'completed';
          } else if (startDate <= now && endDate >= now) {
            actualStatus = 'live';
          }

          return {
          name: pool.project_submissions?.project_name || pool.project_name || 'Untitled Project',
          symbol: pool.project_submissions?.token_symbol || pool.token_symbol || 'TKN',
          raised: pool.total_raised ? `$${(pool.total_raised / 1000000).toFixed(1)}M` : `$${((Math.random() * 8 + 2)).toFixed(1)}M`,
            target: pool.hard_cap ? `$${pool.hard_cap}${pool.native_token_symbol || 'ETH'}` : `$${((Math.random() * 3 + 8)).toFixed(1)}M`,
            progress: pool.current_amount && pool.hard_cap 
              ? Math.round((pool.current_amount / pool.hard_cap) * 100)
            : Math.floor(Math.random() * 30 + 70),
          investors: Math.floor(Math.random() * 5000 + 1000),
            timeLeft: actualStatus === 'live' ? calculateTimeLeft(pool.end_date) : calculateTimeLeft(pool.start_date),
          rating: Number((Math.random() * 1.5 + 8.5).toFixed(1)),
            category: pool.project_submissions?.category || getCategoryFromDescription(pool.project_submissions?.description),
          roi: `+${Math.floor(Math.random() * 200 + 250)}%`,
          website: pool.project_submissions?.website || pool.website,
            description: pool.project_submissions?.description || pool.description,
            logo_url: pool.project_submissions?.logo_url,
            banner_url: pool.project_submissions?.banner_url,
            status: actualStatus,
            // Additional fields for upcoming
            startDate: actualStatus === 'upcoming' ? startDate.toLocaleDateString() : '',
            whitelist: actualStatus === 'upcoming' ? Math.floor(Math.random() * 10000 + 5000) : 0,
            // Additional fields for completed
            completedDate: actualStatus === 'completed' ? endDate.toLocaleDateString() : ''
          };
        });

        // Separate projects by status
        const liveProjects = transformedPools.filter(p => p.status === 'live');
        const upcomingProjects = transformedPools.filter(p => p.status === 'upcoming');
        const completedProjects = transformedPools.filter(p => p.status === 'completed');

        // Set the projects
        setLiveProjects(liveProjects);
        setUpcomingProjects(upcomingProjects);
        setCompletedProjects(completedProjects);

        console.log('Projects loaded:', {
          live: liveProjects.length,
          upcoming: upcomingProjects.length,
          completed: completedProjects.length
        });

      } else {
        // No IDO pools found - set empty arrays
        setLiveProjects([]);
        setUpcomingProjects([]);
        setCompletedProjects([]);
      }
    } catch (err) {
      console.error('Error fetching IDO pools:', err);
      setError('Failed to load projects');
      
      // Set empty arrays instead of fake data
      setLiveProjects([]);
      setUpcomingProjects([]);
      setCompletedProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryFromDescription = (description?: string): string => {
    if (!description) return 'DeFi';
    
    const desc = description.toLowerCase();
    if (desc.includes('gaming') || desc.includes('game') || desc.includes('metaverse')) return 'Gaming';
    if (desc.includes('ai') || desc.includes('artificial') || desc.includes('neural') || desc.includes('machine learning')) return 'AI';
    if (desc.includes('nft') || desc.includes('art') || desc.includes('collectible')) return 'NFT';
    if (desc.includes('exchange') || desc.includes('swap') || desc.includes('trade')) return 'Exchange';
    if (desc.includes('infrastructure') || desc.includes('network') || desc.includes('protocol')) return 'Infrastructure';
    return 'DeFi';
  };

  const calculateTimeLeft = (endDate?: string): string => {
    if (!endDate) return `${Math.floor(Math.random() * 10 + 1)}d ${Math.floor(Math.random() * 24)}h`;
    
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    return `${days}d ${hours}h`;
  };

  const getCurrentProjects = () => {
    switch (activeTab) {
      case 'live': return liveProjects;
      case 'upcoming': return upcomingProjects;
      default: return liveProjects;
    }
  };

  const handleProjectAction = (project: any, action: string) => {
    if (action === 'join') {
      // Create a URL-friendly version of the project name
      const projectId = project.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
      navigate(`/project/${projectId}`);
    }
  };

  return (
    <section id="projects" className="section" style={{ background: 'var(--primary-bg)' }}>
      <div className="container">
        {/* Section Header */}
        <motion.div 
          style={{ textAlign: 'center', marginBottom: '5rem' }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <motion.div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem 2rem',
              background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.1), rgba(0, 255, 136, 0.05))',
              border: '2px solid rgba(0, 255, 136, 0.2)',
              borderRadius: '50px',
              marginBottom: '2rem'
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <span style={{ fontSize: '1.5rem' }}></span>
            <span style={{ 
              fontWeight: '700', 
              color: 'var(--primary-green)',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              fontSize: '1rem'
            }}>
              Platform Analytics
            </span>
          </motion.div>

          <motion.h2 
            className="heading-2"
            style={{ 
              marginBottom: '2rem',
              background: 'linear-gradient(135deg, var(--chrome-light), var(--primary-green), var(--chrome-light))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundSize: '200% 200%'
            }}
            animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            Launchpad Performance
          </motion.h2>

          <motion.p 
            className="body-large"
            style={{ 
              maxWidth: '800px', 
              margin: '0 auto',
              fontSize: '1.3rem',
              lineHeight: '1.8',
              color: 'var(--text-secondary)'
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Track real-time performance metrics and discover high-potential projects with 
            <strong style={{ color: 'var(--primary-green)' }}> institutional-grade analytics</strong>.
          </motion.p>
        </motion.div>

        {/* Platform Stats Grid */}
        <motion.div 
          className="stats-grid platform-stats-mobile-fix" 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {platformStats.map((stat, index) => (
            <motion.div 
              key={index}
              className="stat-card"
              style={{
                padding: '2.5rem',
                background: `linear-gradient(135deg, ${stat.color}08, ${stat.color}03)`,
                border: '2px solid',
                borderImage: `linear-gradient(135deg, ${stat.color}40, transparent) 1`,
                position: 'relative',
                overflow: 'hidden'
              }}
              whileHover={{ scale: 1.02, y: -8 }}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              {/* Background Glow */}
              <motion.div
                style={{
                  position: 'absolute',
                  top: '-50%',
                  left: '-50%',
                  width: '200%',
                  height: '200%',
                  background: `radial-gradient(circle, ${stat.color}15 0%, transparent 70%)`,
                  borderRadius: '50%',
                  opacity: 0
                }}
                whileHover={{ opacity: 1, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              />

              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                marginBottom: '1.5rem'
              }}>
                <motion.div
                  style={{
                    width: '60px',
                    height: '60px',
                    background: `linear-gradient(135deg, ${stat.color}20, ${stat.color}10)`,
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    border: `2px solid ${stat.color}30`
                  }}
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.6 }}
                >
                  {stat.icon}
                </motion.div>
                
                <motion.div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    background: stat.trend === 'up' 
                      ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.1))'
                      : 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.1))',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    fontWeight: '700',
                    color: stat.trend === 'up' ? 'var(--success)' : 'var(--error)'
                  }}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span>{stat.trend === 'up' ? '↗' : '↘'}</span>
                  <span>{stat.change}</span>
                </motion.div>
              </div>

              <div className="stat-value" style={{ 
                fontSize: '2.8rem',
                marginBottom: '0.5rem',
                background: `linear-gradient(135deg, ${stat.color}, var(--chrome-light))`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                {stat.value}
              </div>
              
              <div className="stat-label" style={{ fontSize: '1rem' }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Project Tabs */}
        <motion.div 
          className="tabs"
          style={{ 
            marginBottom: '4rem',
            maxWidth: '400px',
            margin: '0 auto 4rem'
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {[
            { id: 'live', label: 'Live Projects', count: liveProjects.length },
            { id: 'upcoming', label: 'Upcoming', count: upcomingProjects.length }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              className={`tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>{tab.label}</span>
              <span style={{
                marginLeft: '0.5rem',
                padding: '0.25rem 0.5rem',
                background: activeTab === tab.id ? 'rgba(0,0,0,0.2)' : 'var(--border-primary)',
                borderRadius: '10px',
                fontSize: '0.8rem',
                fontWeight: '800'
              }}>
                {tab.count}
              </span>
            </motion.button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        {loading ? (
          <div className="loading-state-advanced">
            <div className="loading-spinner-advanced"></div>
            <p className="loading-text">Loading live projects...</p>
          </div>
        ) : error ? (
          <div className="empty-state-advanced">
            <div className="empty-icon">⚠️</div>
            <h3>Error Loading Projects</h3>
            <p>{error}</p>
            <button 
              className="empty-action-btn"
              onClick={fetchIDOPools}
            >
              Retry
            </button>
          </div>
        ) : getCurrentProjects().length === 0 ? (
          <div className="empty-state-advanced">
            <h3>No Projects Found</h3>
            <p>Be the first to launch your project on WhalesPad!</p>
            <a href="/submit-project" className="empty-action-btn">
              Submit Project
            </a>
          </div>
        ) : (
          <motion.div 
            className="grid grid-2" 
            style={{ gap: '1.5rem' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            key={activeTab}
          >
            {getCurrentProjects().map((project, index) => (
              <motion.div
                key={`${activeTab}-${index}`}
                className="card card-premium"
                style={{
                  padding: '1.5rem',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
              {/* Project Header */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                marginBottom: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {project.logo_url ? (
                    <img
                      src={project.logo_url}
                      alt={project.name}
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        objectFit: 'cover',
                        border: '2px solid rgba(0, 212, 255, 0.3)'
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        // Show fallback icon
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'linear-gradient(135deg, var(--primary-cyan), var(--accent-blue))',
                    borderRadius: '12px',
                    display: project.logo_url ? 'none' : 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    fontWeight: '900',
                    color: '#000',
                    fontFamily: 'Orbitron'
                  }}>
                    {project.symbol.slice(0, 2)}
                  </div>
                  <div>
                    <h3 style={{ 
                      fontSize: '1.1rem',
                      fontWeight: '700',
                      marginBottom: '0.125rem',
                      color: 'var(--text-primary)'
                    }}>
                      {project.name}
                    </h3>
                    <div style={{
                      display: 'flex',
                      gap: '0.75rem',
                      alignItems: 'center'
                    }}>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        color: 'var(--text-secondary)',
                        fontWeight: '500'
                      }}>
                        {project.category}
                      </span>
                      <div style={{
                        background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 215, 0, 0.1))',
                        color: 'var(--accent-gold)',
                        padding: '0.125rem 0.5rem',
                        borderRadius: '10px',
                        fontSize: '0.7rem',
                        fontWeight: '700'
                      }}>
                        ⭐ {project.rating}
                      </div>
                    </div>
                  </div>
                </div>

                {activeTab === 'live' && (
                  <div className="status-badge status-live" style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}>
                    <motion.div 
                      style={{ 
                        width: '5px', 
                        height: '5px', 
                        background: 'var(--success)', 
                        borderRadius: '50%' 
                      }}
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    LIVE
                  </div>
                )}
              </div>

              {/* Detailed Project Information */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '0.5rem',
                marginBottom: '1rem'
              }}>
                {/* Total Raise */}
                <div style={{
                  padding: '0.5rem',
                  background: 'rgba(0, 212, 255, 0.05)',
                  borderRadius: '8px',
                  border: '1px solid rgba(0, 212, 255, 0.1)'
                }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                    Total Raise
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--primary-cyan)' }}>
                    ${project.hard_cap ? Number(project.hard_cap).toLocaleString() : '50,000'}
                  </div>
                </div>

                {/* Refund Term */}
                <div style={{
                  padding: '0.5rem',
                  background: 'rgba(255, 215, 0, 0.05)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 215, 0, 0.1)'
                }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                    Refund term
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--accent-gold)' }}>
                    12 hours for all tiers
                  </div>
                </div>

                {/* Min tier */}
                <div style={{
                  padding: '0.5rem',
                  background: 'rgba(139, 92, 246, 0.05)',
                  borderRadius: '8px',
                  border: '1px solid rgba(139, 92, 246, 0.1)'
                }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                    Min tier
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--accent-purple)' }}>
                    {project.min_allocation && project.min_allocation < 0.5 ? 'Dove' : 
                     project.min_allocation && project.min_allocation < 2 ? 'Eagle' :
                     project.min_allocation && project.min_allocation < 5 ? 'Shark' : 'Whale'}
                  </div>
                </div>

                {/* Swap Network */}
                <div style={{
                  padding: '0.5rem',
                  background: 'rgba(0, 255, 136, 0.05)',
                  borderRadius: '8px',
                  border: '1px solid rgba(0, 255, 136, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                      Swap Network
                    </div>
                    <div style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--primary-green)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <img 
                        src={project.chain_id === 56 || project.native_token_symbol === 'BNB' ? '/images/logo/bsc-logo.svg' : '/images/logo/ethereum-logo.svg'}
                        alt={project.chain_id === 56 || project.native_token_symbol === 'BNB' ? 'BSC' : 'Ethereum'}
                        style={{ width: '16px', height: '16px' }}
                      />
                      {project.chain_id === 56 || project.native_token_symbol === 'BNB' ? 'Binance Smart Chain' : 
                       project.chain_id === 1 || project.native_token_symbol === 'ETH' ? 'Ethereum' :
                       project.chain_id === 137 ? 'Polygon' : 'Binance Smart Chain'}
                    </div>
                  </div>
                </div>

                {/* Token Claim Network */}
                <div style={{
                  padding: '0.5rem',
                  background: 'rgba(96, 165, 250, 0.05)',
                  borderRadius: '8px',
                  border: '1px solid rgba(96, 165, 250, 0.1)',
                  gridColumn: 'span 2'
                }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                    Token Claim Network
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: '800', color: '#60a5fa', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <img 
                        src="/images/logo/ethereum-logo.svg" 
                        alt="Ethereum" 
                        style={{ width: '16px', height: '16px' }}
                      />
                    Ethereum
                  </div>
                </div>

                {/* Vesting Schedule */}
                <div style={{
                  padding: '0.5rem',
                  background: 'rgba(236, 72, 153, 0.05)',
                  borderRadius: '8px',
                  border: '1px solid rgba(236, 72, 153, 0.1)',
                  gridColumn: 'span 2'
                }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                    Vesting Schedule
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: '800', color: '#ec4899' }}>
                    {project.liquidity_percentage ? 
                      `${project.liquidity_percentage}% unlock at TGE, then daily vesting in 6 months` :
                      '30% unlock at TGE, then daily vesting in 6 months'
                    }
                  </div>
                </div>
              </div>

              {/* Additional Stats for Live Projects */}
              {activeTab === 'live' && (
                <>
                  {/* Progress Bar */}
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      marginBottom: '0.5rem'
                    }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>
                         Progress
                      </span>
                      <span style={{ 
                        fontWeight: '800', 
                        color: 'var(--primary-cyan)',
                        fontFamily: 'Orbitron',
                        fontSize: '0.8rem'
                      }}>
                        {'progress' in project ? project.progress : 93}%
                      </span>
                    </div>
                    <div className="progress-bar" style={{ height: '8px' }}>
                      <motion.div 
                        className="progress-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${'progress' in project ? project.progress : 93}%` }}
                        transition={{ duration: 2, ease: 'easeOut' }}
                      />
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      marginTop: '0.25rem',
                      fontSize: '0.7rem',
                      color: 'var(--text-muted)'
                    }}>
                      <span>$7.4M</span>
                      <span>$10.8M</span>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr 1fr', 
                    gap: '0.5rem',
                    marginBottom: '1rem'
                  }}>
                    <div style={{
                      textAlign: 'center',
                      padding: '0.5rem',
                      background: 'rgba(0, 212, 255, 0.05)',
                      borderRadius: '8px',
                      border: '1px solid rgba(0, 212, 255, 0.1)'
                    }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--primary-cyan)' }}>
                        2,282
                      </div>
                      <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>
                        Investors
                      </div>
                    </div>
                    <div style={{
                      textAlign: 'center',
                      padding: '0.5rem',
                      background: 'rgba(0, 255, 136, 0.05)',
                      borderRadius: '8px',
                      border: '1px solid rgba(0, 255, 136, 0.1)'
                    }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--primary-green)' }}>
                        7d 16h
                      </div>
                      <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>
                        Time Left
                      </div>
                    </div>
                    <div style={{
                      textAlign: 'center',
                      padding: '0.5rem',
                      background: 'rgba(255, 215, 0, 0.05)',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 215, 0, 0.1)'
                    }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--accent-gold)' }}>
                        +250%
                      </div>
                      <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>
                        Expected ROI
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'upcoming' && (
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '0.5rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    padding: '0.75rem',
                    background: 'rgba(139, 92, 246, 0.05)',
                    borderRadius: '8px',
                    border: '1px solid rgba(139, 92, 246, 0.1)',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--accent-purple)' }}>
                      ${project.hard_cap ? Number(project.hard_cap).toLocaleString() : '50,000'}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                      Target Raise
                    </div>
                  </div>
                  <div style={{
                    padding: '0.75rem',
                    background: 'rgba(0, 153, 255, 0.05)',
                    borderRadius: '8px',
                    border: '1px solid rgba(0, 153, 255, 0.1)',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--accent-blue)' }}>
                      {'whitelist' in project ? project.whitelist.toLocaleString() : '2,450'}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                      Whitelisted
                    </div>
                  </div>
                  <div style={{
                    padding: '0.75rem',
                    background: 'rgba(0, 212, 255, 0.05)',
                    borderRadius: '8px',
                    border: '1px solid rgba(0, 212, 255, 0.1)',
                    textAlign: 'center',
                    gridColumn: 'span 2'
                  }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--primary-cyan)' }}>
                      🗓️ {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'Coming Soon'}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                      Launch Date
                    </div>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <motion.button
                className={`btn ${activeTab === 'live' ? 'btn-primary' : 'btn-secondary'}`}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  fontSize: '0.85rem',
                  fontWeight: '700'
                }}
                onClick={() => {
                  if (activeTab === 'live') {
                    handleProjectAction(project, 'join');
                  }
                }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                {activeTab === 'live' && '⚡ JOIN'}
                {activeTab === 'upcoming' && '📝 JOIN WHITELIST'}
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
        )}

        {/* Completed Projects Table Section */}
        {completedProjects.length > 0 && (
          <motion.div
            style={{ marginTop: '8rem' }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <motion.div
              style={{
                textAlign: 'center',
                marginBottom: '4rem'
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.h2 
                className="heading-2"
                style={{ 
                  marginBottom: '1rem',
                  background: 'linear-gradient(135deg, var(--accent-purple), var(--chrome-light), var(--accent-purple))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundSize: '200% 200%'
                }}
                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                Completed Projects
              </motion.h2>
              <p style={{ 
                color: 'var(--text-secondary)',
                fontSize: '1.1rem',
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                Successful launches with proven results
              </p>
            </motion.div>

            {/* Table Style Completed Projects */}
            <motion.div
              className="completed-projects-table"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                border: '2px solid rgba(139, 92, 246, 0.2)',
                borderRadius: '20px',
                padding: '2rem',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px rgba(139, 92, 246, 0.1)'
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              {/* Table Header */}
              <div 
                className="completed-table-header"
                style={{
                  display: 'grid', 
                  gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 120px',
                  gap: '1rem',
                  padding: '1.5rem 2rem',
                  background: 'rgba(139, 92, 246, 0.1)',
                  borderRadius: '12px',
                  marginBottom: '1rem',
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  color: 'var(--accent-purple)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                <span>Project</span>
                <span style={{ textAlign: 'center' }}>Total Raised</span>
                <span style={{ textAlign: 'center' }}>ROI</span>
                <span style={{ textAlign: 'center' }}>Investors</span>
                <span style={{ textAlign: 'center' }}>Completed</span>
                <span style={{ textAlign: 'center' }}>Action</span>
              </div>

              {/* Table Rows */}
              <div className="completed-table-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {completedProjects.map((project, index) => (
                  <motion.div
                    key={index}
                    className="completed-table-row"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 120px',
                      gap: '1rem',
                      padding: '1.5rem 2rem',
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      alignItems: 'center',
                      transition: 'all 0.3s ease'
                    }}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{
                      background: 'rgba(139, 92, 246, 0.1)',
                      borderColor: 'rgba(139, 92, 246, 0.3)',
                      scale: 1.01
                    }}
                  >
                    {/* Project Info */}
                    <div className="project-info" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      {project.logo_url ? (
                        <img
                          src={project.logo_url}
                          alt={project.name}
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '12px',
                            objectFit: 'cover',
                            border: '2px solid rgba(139, 92, 246, 0.3)'
                          }}
                        />
                      ) : (
                  <div style={{
                          width: '40px',
                          height: '40px',
                          background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-blue))',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1rem',
                          fontWeight: '900',
                          color: '#000',
                          fontFamily: 'Orbitron'
                        }}>
                          {project.symbol.slice(0, 2)}
                    </div>
                      )}
                      <div>
                        <h4 style={{ 
                          fontSize: '1.1rem',
                          fontWeight: '700',
                          color: 'var(--text-primary)',
                          margin: '0 0 0.25rem 0'
                        }}>
                          {project.name}
                        </h4>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <span style={{ 
                            fontSize: '0.8rem', 
                            color: 'var(--text-secondary)' 
                          }}>
                            {project.category}
                          </span>
                          <span style={{
                            background: 'rgba(139, 92, 246, 0.2)',
                            color: 'var(--accent-purple)',
                            padding: '0.125rem 0.5rem',
                            borderRadius: '8px',
                            fontSize: '0.7rem',
                            fontWeight: '600'
                          }}>
                            COMPLETED
                          </span>
                    </div>
                  </div>
                    </div>

                    {/* Total Raised */}
                    <div className="stat-raised" style={{ textAlign: 'center' }}>
                  <div style={{
                        fontSize: '1.1rem', 
                        fontWeight: '700', 
                        color: 'var(--success)' 
                      }}>
                        {project.raised}
                    </div>
                    </div>

                    {/* ROI */}
                    <div className="stat-roi" style={{ textAlign: 'center' }}>
                      <div style={{ 
                        fontSize: '1.1rem', 
                        fontWeight: '700', 
                        color: 'var(--accent-gold)' 
                      }}>
                        {project.roi}
                  </div>
                    </div>

                    {/* Investors */}
                    <div className="stat-investors" style={{ textAlign: 'center' }}>
                  <div style={{
                        fontSize: '1rem', 
                        fontWeight: '600', 
                        color: 'var(--primary-cyan)' 
                      }}>
                        {project.investors.toLocaleString()}
                    </div>
                    </div>

                    {/* Completed Date */}
                    <div className="stat-completed" style={{ textAlign: 'center' }}>
                      <div style={{ 
                        fontSize: '0.9rem', 
                        color: 'var(--text-secondary)' 
                      }}>
                        {project.completedDate}
                  </div>
                </div>

              {/* Action Button */}
                    <div className="action-button" style={{ textAlign: 'center' }}>
              <motion.button
                style={{
                          padding: '0.5rem 1rem',
                          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(139, 92, 246, 0.1))',
                          border: '1px solid rgba(139, 92, 246, 0.4)',
                          borderRadius: '8px',
                          color: 'var(--accent-purple)',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                }}
                        whileHover={{ 
                          scale: 1.05,
                          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(139, 92, 246, 0.2))'
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleProjectAction(project, 'view')}
                      >
                        View
              </motion.button>
                    </div>
            </motion.div>
          ))}
              </div>
            </motion.div>
        </motion.div>
        )}

        {/* View All Projects CTA */}
        <motion.div
          style={{
            textAlign: 'center',
            marginTop: '5rem'
          }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <motion.a
            href="/ido-sales"
            className="btn btn-outline"
            style={{
              padding: '1.5rem 3rem',
              fontSize: '1.1rem',
              fontWeight: '700',
              display: 'inline-block',
              textDecoration: 'none'
            }}
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            🔍 Browse All Projects
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default LaunchpadStats; 
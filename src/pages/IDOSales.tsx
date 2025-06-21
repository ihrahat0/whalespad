import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Navigation from '../components/Navigation';
import TrendingIDOs from '../components/TrendingIDOs';
import './IDOSales.css';

// Types
interface Project {
  id: string;
  project_name: string;
  token_symbol: string;
  description: string;
  logo_url?: string;
  banner_url?: string;
  category?: string;
  website?: string;
  telegram?: string;
  twitter?: string;
  rating?: number;
  status: string;
  chain_id?: number;
  native_token_symbol?: string;
  hard_cap?: number;
  soft_cap?: number;
  current_raised?: number;
  investor_count?: number;
  presale_start?: string;
  presale_end?: string;
  progress_percentage?: number;
  real_current_raised?: number;
  real_investor_count?: number;
  ido_pool_info?: {
    status?: string;
    start_date?: string;
    end_date?: string;
  };
}

interface FilterState {
  saleType: string;
  status: string;
  category: string;
  chain: string;
  search: string;
}

const IDOSales: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const [filters, setFilters] = useState<FilterState>({
    saleType: 'All',
    status: 'All',
    category: 'All',
    chain: 'All',
    search: ''
  });

  // Filter options
  const saleTypes = ['All', 'Presale', 'Fair Launch', 'IDO', 'Private Sale'];
  const statuses = ['All', 'Active', 'Upcoming', 'Completed', 'Live'];
  const categories = ['All', 'DeFi', 'GameFi', 'AI', 'Infrastructure', 'NFT', 'Layer 1', 'Layer 2', 'DAO', 'Metaverse'];
  const chains = ['All', 'Ethereum', 'BSC', 'Polygon', 'Arbitrum', 'Optimism'];

  const chainMap: { [key: number]: string } = {
    1: 'Ethereum',
    56: 'BSC',
    137: 'Polygon',
    42161: 'Arbitrum',
    10: 'Optimism'
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [projects, filters]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('project_details_view')
        .select('*')
        .in('status', ['approved', 'live'])
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      const formattedProjects: Project[] = (data || []).map(project => ({
        id: project.id,
        project_name: project.project_name,
        token_symbol: project.token_symbol,
        description: project.description,
        logo_url: project.logo_url,
        banner_url: project.banner_url,
        category: project.category || 'DeFi',
        website: project.website,
        telegram: project.telegram,
        twitter: project.twitter,
        rating: project.rating || 9.5,
        status: project.status,
        chain_id: project.chain_id || 1,
        native_token_symbol: project.native_token_symbol || 'ETH',
        hard_cap: project.hard_cap || 0,
        soft_cap: project.soft_cap || 0,
        current_raised: project.current_raised || project.real_current_raised || 0,
        investor_count: project.investor_count || project.real_investor_count || 0,
        presale_start: project.presale_start,
        presale_end: project.presale_end,
        progress_percentage: project.progress_percentage || 0,
        real_current_raised: project.real_current_raised,
        real_investor_count: project.real_investor_count,
        ido_pool_info: project.ido_pool_info
      }));

      setProjects(formattedProjects);
    } catch (e: any) {
      console.error('Error fetching projects:', e);
      setError(`Failed to fetch projects: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = projects;

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(project =>
        project.project_name.toLowerCase().includes(filters.search.toLowerCase()) ||
        project.token_symbol.toLowerCase().includes(filters.search.toLowerCase()) ||
        project.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Sale type filter
    if (filters.saleType !== 'All') {
      filtered = filtered.filter(project => {
        // This is a simple mapping - you might want to add actual sale type field to your data
        if (filters.saleType === 'Presale') return true; // Most projects are presales
        if (filters.saleType === 'IDO') return project.status === 'live';
        if (filters.saleType === 'Fair Launch') return project.soft_cap === 0;
        return true;
      });
    }

    // Status filter
    if (filters.status !== 'All') {
      filtered = filtered.filter(project => {
        const now = new Date();
        const startDate = project.presale_start ? new Date(project.presale_start) : null;
        const endDate = project.presale_end ? new Date(project.presale_end) : null;

        if (filters.status === 'Active' || filters.status === 'Live') {
          return startDate && endDate && startDate <= now && now <= endDate;
        }
        if (filters.status === 'Upcoming') {
          return startDate && startDate > now;
        }
        if (filters.status === 'Completed') {
          return endDate && endDate < now;
        }
        return true;
      });
    }

    // Category filter
    if (filters.category !== 'All') {
      filtered = filtered.filter(project => project.category === filters.category);
    }

    // Chain filter
    if (filters.chain !== 'All') {
      filtered = filtered.filter(project => 
        chainMap[project.chain_id || 1] === filters.chain
      );
    }

    setFilteredProjects(filtered);
  };

  const getProjectStatus = (project: Project): { status: string; color: string } => {
    const now = new Date();
    const startDate = project.presale_start ? new Date(project.presale_start) : null;
    const endDate = project.presale_end ? new Date(project.presale_end) : null;

    if (startDate && endDate) {
      if (startDate <= now && now <= endDate) {
        return { status: 'Live', color: '#22c55e' };
      }
      if (startDate > now) {
        return { status: 'Upcoming', color: '#f59e0b' };
      }
      if (endDate < now) {
        return { status: 'Completed', color: '#6b7280' };
      }
    }

    return { status: 'TBA', color: '#8b5cf6' };
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(0)}K`;
    return `$${num.toFixed(0)}`;
  };

  const handleProjectClick = (projectId: string) => {
    navigate(`/project/${projectId}`);
  };

  if (loading) {
    return (
      <div className="ido-sales-page">
        <div className="loading-container">
          <div className="loading-spinner-advanced"></div>
          <p>Loading Projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ido-sales-page">
        <div className="error-container">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ido-sales-page">
      <Navigation />
      <TrendingIDOs />
      
      <div className="ido-sales-content">
        <div className="filters-section">
          <div className="filters-container">
            <div className="filters-header">
              <h2>Filter Projects</h2>
              <span className="results-count">{filteredProjects.length} projects found</span>
            </div>
            
            <div className="filters-grid">
              <div className="filter-group">
                <label>Search</label>
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="search-input"
                />
              </div>

              <div className="filter-group">
                <label>Sale Type</label>
                <select
                  value={filters.saleType}
                  onChange={(e) => setFilters(prev => ({ ...prev, saleType: e.target.value }))}
                  className="filter-select"
                >
                  {saleTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="filter-select"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                  className="filter-select"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Blockchain</label>
                <select
                  value={filters.chain}
                  onChange={(e) => setFilters(prev => ({ ...prev, chain: e.target.value }))}
                  className="filter-select"
                >
                  {chains.map(chain => (
                    <option key={chain} value={chain}>{chain}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="projects-section">
          <div className="projects-container">
            <AnimatePresence>
              <div className="projects-grid">
                {filteredProjects.map((project, index) => {
                  const projectStatus = getProjectStatus(project);
                  const progress = project.hard_cap ? ((project.current_raised || 0) / project.hard_cap) * 100 : 0;

                  return (
                    <motion.div
                      key={project.id}
                      className="project-card-ido"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -30 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      onClick={() => handleProjectClick(project.id)}
                    >
                      <div className="project-header">
                        <div className="project-logo">
                          {project.logo_url ? (
                            <img src={project.logo_url} alt={project.project_name} />
                          ) : (
                            <div className="default-logo">{project.token_symbol?.charAt(0) || 'P'}</div>
                          )}
                        </div>
                        <div className="project-info">
                          <h3 className="project-name">{project.project_name}</h3>
                          <div className="project-meta">
                            <span className="token-symbol">${project.token_symbol}</span>
                            <span className="project-category">{project.category}</span>
                          </div>
                        </div>
                        <div className="project-status-badge" style={{ backgroundColor: projectStatus.color }}>
                          {projectStatus.status}
                        </div>
                      </div>

                      {project.banner_url && (
                        <div className="project-banner">
                          <img src={project.banner_url} alt={project.project_name} />
                        </div>
                      )}

                      <div className="project-description">
                        <p>{project.description}</p>
                      </div>

                      <div className="project-stats">
                        <div className="stat-row">
                          <div className="stat-item">
                            <span className="stat-label">Raised</span>
                            <span className="stat-value">{formatNumber(project.current_raised || 0)}</span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-label">Hard Cap</span>
                            <span className="stat-value">{formatNumber(project.hard_cap || 0)}</span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-label">Participants</span>
                            <span className="stat-value">{project.investor_count || 0}</span>
                          </div>
                        </div>

                        <div className="progress-section">
                          <div className="progress-info">
                            <span>Progress</span>
                            <span className="progress-percent">{progress.toFixed(0)}%</span>
                          </div>
                          <div className="progress-bar">
                            <div 
                              className="progress-fill" 
                              style={{ width: `${Math.min(progress, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      <div className="project-footer">
                        <div className="chain-info">
                          <span className="chain-name">{chainMap[project.chain_id || 1]}</span>
                          <span className="rating">⭐ {project.rating?.toFixed(1) || '9.5'}</span>
                        </div>
                        <button className="view-project-btn">
                          View Details
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </AnimatePresence>

            {filteredProjects.length === 0 && (
              <div className="no-projects">
                <div className="no-projects-icon">🔍</div>
                <h3>No projects found</h3>
                <p>Try adjusting your filters to see more results</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IDOSales; 
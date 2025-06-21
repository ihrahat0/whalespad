import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';
import TrendingIDOs from './TrendingIDOs';
// Logo will be imported from public folder

const Hero: React.FC = () => {
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [featuredProjects, setFeaturedProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);


  // Fetch IDO pools from database
  useEffect(() => {
    const fetchIDOPools = async () => {
      try {
        setLoading(true);
        
        // Fetch IDO pools with project information
        const { data, error } = await supabase
          .from('ido_pools')
          .select(`
            *,
            project_submissions (project_name, token_symbol, description)
          `)
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) {
          console.error('Error fetching IDO pools:', error);
          // Use fallback data if database fails
          setFeaturedProjects([
            {
              name: "No IDO Pools Found",
              symbol: "NONE",
              status: "UPCOMING",
              progress: 0,
              raised: "$0",
              target: "$0",
              timeLeft: "TBA",
              participants: 0,
              price: "$0.00",
              allocation: "0",
              category: "No Category",
              roi: "TBA",
              rating: 0
            }
          ]);
          setLoading(false);
          return;
        }

        if (data && data.length > 0) {
          // Transform database data to match the expected format
          const transformedProjects = data.map((pool: any) => {
            const now = new Date();
            const startDate = new Date(pool.start_date);
            const endDate = new Date(pool.end_date);
            
            // Calculate status based on dates
            let status = 'UPCOMING';
            if (now >= startDate && now <= endDate) {
              status = 'LIVE';
            } else if (now > endDate) {
              status = 'ENDED';
            }
            
            // Calculate progress (you can make this more sophisticated)
            const progress = status === 'LIVE' ? Math.floor(Math.random() * 30) + 50 : 0;
            
            // Calculate time left
            const timeLeft = status === 'LIVE' ? 
              Math.floor((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) + 'd ' +
              Math.floor(((endDate.getTime() - now.getTime()) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) + 'h'
              : status === 'UPCOMING' ?
              Math.floor((startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) + 'd until start'
              : 'Ended';

            return {
              name: pool.project_submissions?.project_name || 'Unknown Project',
              symbol: pool.project_submissions?.token_symbol || 'TKN',
              status: status,
              progress: progress,
              raised: `$${(pool.hard_cap * progress / 100).toFixed(1)}M`,
              target: `$${pool.hard_cap}M`,
              timeLeft: timeLeft,
              participants: Math.floor(Math.random() * 5000) + 1000, // Random for now
              price: `$${(1 / pool.presale_rate).toFixed(4)}`,
              allocation: `${(pool.total_supply / 1000000).toFixed(1)}M ${pool.project_submissions?.token_symbol || 'TKN'}`,
              category: pool.project_submissions?.description?.slice(0, 20) + '...' || 'DeFi Project',
              roi: status === 'LIVE' ? `+${Math.floor(Math.random() * 300) + 100}%` : 'TBA',
              rating: (8.5 + Math.random() * 1.5).toFixed(1)
            };
          });
          
          setFeaturedProjects(transformedProjects);
        } else {
          // No pools found, show placeholder
          setFeaturedProjects([
            {
              name: "Submit Your Project",
              symbol: "APPLY",
              status: "UPCOMING",
              progress: 0,
              raised: "$0",
              target: "Your Target",
              timeLeft: "Apply Now",
              participants: 0,
              price: "Your Price",
              allocation: "Your Allocation",
              category: "Your Category",
              roi: "Your ROI",
              rating: 0
            }
          ]);
        }
      } catch (e) {
        console.error('Failed to fetch IDO pools:', e);
        // Use fallback data
        setFeaturedProjects([
          {
            name: "Database Error",
            symbol: "ERR",
            status: "UPCOMING",
            progress: 0,
            raised: "$0",
            target: "$0",
            timeLeft: "TBA",
            participants: 0,
            price: "$0.00",
            allocation: "0",
            category: "Error",
            roi: "TBA",
            rating: 0
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchIDOPools();
  }, []);

  useEffect(() => {
    if (featuredProjects.length > 0) {
      const interval = setInterval(() => {
        setCurrentProjectIndex((prev) => (prev + 1) % featuredProjects.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [featuredProjects.length]);



  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const currentProject = featuredProjects[currentProjectIndex];

  return (
    <div className="futuristic-hero">
      {/* Trending Bar */}
      <TrendingIDOs />

      {/* Dynamic Background Effects */}
      <div 
        className="hero-bg-effects"
        style={{
          '--mouse-x': `${mousePosition.x}%`,
          '--mouse-y': `${mousePosition.y}%`,
        } as React.CSSProperties}
      >
        <div className="bg-gradient-orb bg-orb-1"></div>
        <div className="bg-gradient-orb bg-orb-2"></div>
        <div className="bg-gradient-orb bg-orb-3"></div>
        <div className="bg-grid-pattern"></div>
        <div className="bg-particles"></div>
        
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="floating-particle"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: window.innerHeight + 100 
            }}
            animate={{ 
              y: -100,
              x: Math.random() * window.innerWidth 
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 10
            }}
            style={{
              position: 'absolute',
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              background: `rgba(0, 212, 255, ${Math.random() * 0.5 + 0.3})`,
              borderRadius: '50%',
              filter: 'blur(1px)',
              pointerEvents: 'none'
            }}
          />
        ))}
      </div>

      {/* Hero Content */}
      <div className="hero-content-enhanced">
        <div className="hero-container-enhanced">
          {/* Left Side - Main Content */}
          <div className="hero-left-enhanced">
            {/* Status Badges */}
            <motion.div 
              className="hero-badges-enhanced"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="status-badge-enhanced live">
                <div className="badge-glow"></div>
                <span className="status-pulse"></span>
                <span className="badge-text">Platform Live & Secured</span>
              </div>
              <div className="status-badge-enhanced rated">
                <div className="badge-glow"></div>
                <span className="rating-stars">⭐</span>
                <span className="badge-text">Top Rated Platform</span>
              </div>
            </motion.div>

            {/* Main Heading */}
            <motion.div 
              className="hero-heading-enhanced"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              <h1 className="main-title">
                <motion.span 
                  className="title-line"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  Launch The Future
                </motion.span>
                <motion.span 
                  className="title-line title-accent"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  of Crypto
                </motion.span>
              </h1>
              <motion.p 
                className="hero-subtitle-enhanced"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
              >
                The most advanced decentralized launchpad for next-generation 
                blockchain projects.
                <br />
                <span className="subtitle-highlight">Secure, Transparent, Community-Driven.</span>
              </motion.p>
            </motion.div>

            
            {/* still the trending tab isnt in the top uder the header */}

            
            {/* Action Buttons */}
            <motion.div 
              className="hero-actions-enhanced"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <motion.a 
                href="https://docs.whalespad.com/"
                className="btn-enhanced btn-primary-enhanced"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="btn-text">WHitepaper</span>
                <div className="btn-shine"></div>
              </motion.a>
              <motion.a 
                href="/submit-project"
                className="btn-enhanced btn-secondary-enhanced"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="btn-text">Apply for IDO</span>
                <div className="btn-shine"></div>
              </motion.a>
            </motion.div>

            {/* Platform Stats */}
            <motion.div 
              className="hero-stats-enhanced"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              <motion.div 
                className="stat-item-enhanced"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div 
                  className="stat-number-enhanced"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1 }}
                >
                  $3.1M+
                </motion.div>
                <div className="stat-label-enhanced">Total Raised</div>
                <div className="stat-glow-effect"></div>
              </motion.div>
              <motion.div 
                className="stat-item-enhanced"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div 
                  className="stat-number-enhanced"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.1 }}
                >
                  21
                </motion.div>
                <div className="stat-label-enhanced">Projects Launched</div>
                <div className="stat-glow-effect"></div>
              </motion.div>
              <motion.div 
                className="stat-item-enhanced"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div 
                  className="stat-number-enhanced"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                >
                  1M+
                </motion.div>
                <div className="stat-label-enhanced">Community Members</div>
                <div className="stat-glow-effect"></div>
              </motion.div>
              <motion.div 
                className="stat-item-enhanced"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div 
                  className="stat-number-enhanced"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.3 }}
                >
                  97%
                </motion.div>
                <div className="stat-label-enhanced">Success Rate</div>
                <div className="stat-glow-effect"></div>
              </motion.div>
            </motion.div>
          </div>



      {/* Right Side - Project Showcase */}
                <motion.div 
        className="hero-right-enhanced"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.4 }}
      >
            <div className="project-showcase-advanced">
              {loading ? (
                <div className="loading-state-advanced">
                  <div className="loading-spinner-advanced"></div>
                  <p className="loading-text">Loading IDO pools...</p>
                </div>
              ) : featuredProjects.length === 0 ? (
                <div className="empty-state-advanced">
                  <h3>No Active IDO Pools</h3>
                  <p>Be the first to create an IDO pool!</p>
                  <motion.a 
                    href="/submit-project"
                    className="empty-action-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Submit Your Project
                  </motion.a>
                </div>
              ) : (
                <>
              {/* Advanced Showcase Header */}
              <div className="showcase-header-advanced">
                <div className="header-left">
                  <div className="featured-label">
                    <div className="label-glow"></div>
                    <span className="label-icon">🚀</span>
                    <span className="label-text">FEATURED LAUNCH</span>
                  </div>
                  <div className="live-indicator">
                    <div className="pulse-dot"></div>
                    <span>LIVE NOW</span>
                  </div>
                </div>
                <div className="showcase-controls">
                  {featuredProjects.map((_, index) => (
                    <motion.div 
                      key={index}
                      className={`control-dot ${index === currentProjectIndex ? 'active' : ''}`}
                      onClick={() => setCurrentProjectIndex(index)}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    />
                  ))}
                </div>
              </div>
              
              {/* Advanced Project Card */}
              <motion.div 
                className="project-card-advanced"
                key={currentProjectIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                {/* Multiple Glow Layers */}
                <div className="card-glow-layer-1"></div>
                <div className="card-glow-layer-2"></div>
                <div className="card-glow-layer-3"></div>
                
                {/* Project Header with Advanced Layout */}
                <div className="project-header-advanced">
                  <div className="project-title-section">
                    <div className="project-icon-wrapper">
                      <div className="project-icon">🌟</div>
                      <div className="icon-orbit"></div>
                    </div>
                    <div className="project-title-info">
                      <h3 className="project-name-advanced">{currentProject.name}</h3>
                      <div className="project-subtitle">{currentProject.category}</div>
                    </div>
                  </div>
                  
                  <div className="project-status-section">
                    <div className={`status-badge-advanced ${currentProject.status.toLowerCase()}`}>
                      <div className="status-pulse-advanced"></div>
                      <span>{currentProject.status}</span>
                    </div>
                    <div className="rating-badge-advanced">
                      <span className="rating-stars">⭐</span>
                      <span className="rating-value">{currentProject.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Advanced Progress Section */}
                {currentProject.status === 'LIVE' && (
                  <div className="progress-section-advanced">
                    <div className="progress-header">
                      <span className="progress-label">Sale Progress</span>
                      <span className="progress-percentage">{currentProject.progress}%</span>
                    </div>
                    <div className="progress-container">
                      <div className="progress-track">
                        <motion.div 
                          className="progress-fill-advanced"
                          initial={{ width: 0 }}
                          animate={{ width: `${currentProject.progress}%` }}
                          transition={{ duration: 2, ease: "easeOut" }}
                        />
                        <div className="progress-glow-effect"></div>
                        <div className="progress-particles"></div>
                      </div>
                      <div className="progress-markers">
                        <div className="marker">25%</div>
                        <div className="marker">50%</div>
                        <div className="marker">75%</div>
                        <div className="marker">100%</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Advanced Stats Grid */}
                <div className="stats-grid-advanced">
                  <div className="stat-card-mini">
                    <div className="stat-info">
                      <div className="stat-label">Raised</div>
                      <div className="stat-value primary">{currentProject.raised}</div>
                      <div className="stat-target">of {currentProject.target}</div>
                    </div>
                  </div>
                  
                  <div className="stat-card-mini">
                    <div className="stat-info">
                      <div className="stat-label">Time Left</div>
                      <div className="stat-value">{currentProject.timeLeft}</div>
                      <div className="stat-target">Until end</div>
                    </div>
                  </div>
                  
                  <div className="stat-card-mini">
                    <div className="stat-info">
                      <div className="stat-label">Participants</div>
                      <div className="stat-value">{currentProject.participants.toLocaleString()}</div>
                      <div className="stat-target">Investors</div>
                    </div>
                  </div>
                  
                  <div className="stat-card-mini">
                    <div className="stat-info">
                      <div className="stat-label">Token Price</div>
                      <div className="stat-value">{currentProject.price}</div>
                      <div className="stat-target">{currentProject.symbol}</div>
                    </div>
                  </div>
                </div>

                {/* Advanced Action Section */}
                <div className="action-section-advanced">
                  <motion.button 
                    className="primary-action-btn"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="btn-glow"></div>
                    <span className="btn-text">
                      {currentProject.status === 'LIVE' ? 'Join IDO Sale' : 'Get Notified'}
                    </span>
                    <div className="btn-shine-effect"></div>
                  </motion.button>
                  
                  <motion.button 
                    className="secondary-action-btn"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="btn-text">View Details</span>
                  </motion.button>
                </div>
              </motion.div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero; 
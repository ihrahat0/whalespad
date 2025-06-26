import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

// Logo will be imported from public folder

interface MousePosition {
  x: number;
  y: number;
}

const Hero: React.FC = () => {
  // Removed unused state variables
  const [trendingCoins] = useState([
    { id: "01", name: "FNL" },
    { id: "02", name: "TEST" },
    { id: "03", name: "TEST2" },
    { id: "04", name: "TEST3" },
    { id: "05", name: "TEST4" },
    { id: "06", name: "TEST5" },
    { id: "07", name: "TEST6" },
    { id: "08", name: "TEST7" },
    { id: "09", name: "TEST8" },
    { id: "10", name: "TEST9" }
  ]);
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);
  
  // Calculate countdown for WhalesPad presale (3 days from now)
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Fetch trending coins from API or use the default ones
  useEffect(() => {
    const fetchTrendingCoins = async () => {
      try {
        // You can replace this with an actual API call to get real-time trending coins
        // For example: const response = await fetch('https://api.coingecko.com/api/v3/search/trending');
        // const data = await response.json();
        
        // For now, we're using the default state
        // If you implement an API call, map the response to match the expected format:
        // const trendingCoinsData = data.coins.map((coin, index) => ({
        //   id: String(index + 1).padStart(2, '0'),
        //   name: coin.item.name
        // }));
        // setTrendingCoins(trendingCoinsData);
      } catch (error) {
        console.error('Error fetching trending coins:', error);
        // Default coins remain in state if there's an error
      }
    };

    fetchTrendingCoins();
  }, []);

  // Removed database fetching logic since we're using static presale data

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    const heroElement = heroRef.current;
    if (heroElement) {
      heroElement.addEventListener('mousemove', handleMouseMove);
      return () => heroElement.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 3); // 3 days from now

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // WhalesPad featured presale
  const featuredPresale = {
    name: "WhalesPad Token",
    symbol: "WPT",
    price: "$0.05",
    hardCap: "$500,000",
    raised: "$325,000",
    progress: 65,
    participants: 1250,
    status: "LIVE NOW",
    category: "DeFi Launchpad",
    roi: "+250%",
    rating: "9.5"
  };

  // Removed unused currentProject variable

  return (
    <div className="hero-unified" ref={heroRef}>
      {/* Background Video */}
      <div className="hero-video-background">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="hero-background-video"
        >
          <source src="/hero.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="video-overlay"></div>
      </div>

      {/* Simple Mouse Interactive Glow */}
      <div 
        className="cursor-glow-effect"
        style={{
          left: mousePosition.x - 100,
          top: mousePosition.y - 100,
          background: `radial-gradient(circle, rgba(0, 212, 255, 0.05) 0%, transparent 70%)`,
        }}
      />
      
      {/* Trending Coins Marquee */}
      <div className="trending-section">
        {/* Background pattern */}
        <div className="trending-bg-pattern" />
        
        {/* Trending label */}
        <div className="trending-label">
          <div className="flex items-center space-x-2 text-white">
            <span className="text-yellow-400 text-lg">🔥</span>
            <span className="font-bold text-sm tracking-wide">TRENDING</span>
          </div>
        </div>

        {/* Marquee container */}
        <div className="marquee-track flex whitespace-nowrap ml-32">
          {/* First set of coins */}
          {trendingCoins.map((coin, index) => (
            <div 
              key={`first-${index}`}
              className="trending-coin-item"
            >
              <div className="flex items-center space-x-3">
                <span className="text-yellow-400 font-bold text-sm">#{coin.id}</span>
                <span className="text-white font-bold text-sm">{coin.name}</span>
                <span className="text-green-400 text-xs font-medium">+2.34%</span>
              </div>
            </div>
          ))}
          
          {/* Duplicate set for seamless loop */}
          {trendingCoins.map((coin, index) => (
            <div 
              key={`second-${index}`}
              className="trending-coin-item"
            >
              <div className="flex items-center space-x-3">
                <span className="text-yellow-400 font-bold text-sm">#{coin.id}</span>
                <span className="text-white font-bold text-sm">{coin.name}</span>
                <span className="text-green-400 text-xs font-medium">+2.34%</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right fade */}
        <div className="trending-fade-right" />
      </div>

      {/* Main Hero Content */}
      <div className="hero-main-content">
        <div className="hero-container-unified">
          {/* Left Side - Main Content */}
          <div className="hero-left-unified">
            {/* Status Badges */}
            <motion.div 
              className="hero-badges-unified"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="status-badge live">
                <span className="status-pulse"></span>
                <span className="badge-text">Platform Live & Secured</span>
              </div>
              <div className="status-badge rated">
                <span className="rating-stars">⭐</span>
                <span className="badge-text">Top Rated Platform</span>
              </div>
            </motion.div>

            {/* Main Heading */}
            <motion.div 
              className="hero-heading-unified"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              <h1 className="main-title-unified">
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
                className="hero-subtitle-unified"
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
            
            {/* Action Buttons */}
            <motion.div 
              className="hero-actions-unified"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <motion.a 
                href="https://docs.whalespad.com/"
                className="btn-primary-unified glow-button"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="btn-text">Whitepaper</span>
              </motion.a>
              <motion.a 
                href="/submit-project"
                className="btn-secondary-unified glow-button"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="btn-text">Apply for IDO</span>
              </motion.a>
            </motion.div>

            {/* Platform Stats */}
            <motion.div 
              className="hero-stats-unified"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              <motion.div 
                className="stat-item-unified"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div 
                  className="stat-number-unified"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1 }}
                >
                  $3.1M+
                </motion.div>
                <div className="stat-label-unified">Total Raised</div>
              </motion.div>
              <motion.div 
                className="stat-item-unified"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div 
                  className="stat-number-unified"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.1 }}
                >
                  21
                </motion.div>
                <div className="stat-label-unified">Projects Launched</div>
              </motion.div>
              <motion.div 
                className="stat-item-unified"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div 
                  className="stat-number-unified"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                >
                  1M+
                </motion.div>
                <div className="stat-label-unified">Community Members</div>
              </motion.div>
              <motion.div 
                className="stat-item-unified"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div 
                  className="stat-number-unified"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.3 }}
                >
                  97%
                </motion.div>
                <div className="stat-label-unified">Success Rate</div>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Side - Featured Presale Showcase */}
          <motion.div 
            className="hero-right-unified"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <div className="presale-showcase-unified">
              {/* Featured Banner - Compact */}
              <div className="presale-banner">
                <div className="banner-bg"></div>
                <div className="banner-content">
                  <img 
                    src="/images/logo/logo.png" 
                    alt="WhalesPad" 
                    className="presale-logo"
                  />
                  <div className="presale-title">
                    <h3>{featuredPresale.name}</h3>
                    <span className="token-symbol">{featuredPresale.symbol}</span>
                  </div>
                  <div className="live-indicator">
                    <div className="pulse-dot"></div>
                    <span>LIVE</span>
                  </div>
                </div>
              </div>
              
              {/* Countdown Timer */}
              <div className="countdown-section">
                <h4 className="countdown-title">Presale Ends In:</h4>
                <div className="countdown-timer">
                  <div className="time-unit">
                    <span className="time-value">{timeLeft.days.toString().padStart(2, '0')}</span>
                    <span className="time-label">Days</span>
                  </div>
                  <div className="time-separator">:</div>
                  <div className="time-unit">
                    <span className="time-value">{timeLeft.hours.toString().padStart(2, '0')}</span>
                    <span className="time-label">Hours</span>
                  </div>
                  <div className="time-separator">:</div>
                  <div className="time-unit">
                    <span className="time-value">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                    <span className="time-label">Minutes</span>
                  </div>
                  <div className="time-separator">:</div>
                  <div className="time-unit">
                    <span className="time-value">{timeLeft.seconds.toString().padStart(2, '0')}</span>
                    <span className="time-label">Seconds</span>
                  </div>
                </div>
              </div>

              {/* Presale Stats */}
              <div className="presale-stats-grid">
                <div className="stat-card">
                  <span className="stat-label">Price</span>
                  <span className="stat-value">{featuredPresale.price}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Hard Cap</span>
                  <span className="stat-value">{featuredPresale.hardCap}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Raised</span>
                  <span className="stat-value text-green-400">{featuredPresale.raised}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Participants</span>
                  <span className="stat-value">{featuredPresale.participants.toLocaleString()}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="progress-section-unified">
                <div className="progress-info">
                  <span>Progress</span>
                  <span className="progress-percent">{featuredPresale.progress}%</span>
                </div>
                <div className="progress-bar-unified">
                  <div 
                    className="progress-fill-unified" 
                    style={{ width: `${featuredPresale.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="presale-actions">
                <motion.a 
                  href="/sale"
                  className="btn-presale-primary"
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="btn-text">Join Presale</span>
                </motion.a>
                <motion.a 
                  href="/project/whalespad"
                  className="btn-presale-secondary"
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="btn-text">View Details</span>
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero; 
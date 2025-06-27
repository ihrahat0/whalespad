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
    { id: "01", name: "Bitcoin", symbol: "BTC", price: "$67,234", change: "+2.34%" },
    { id: "02", name: "Ethereum", symbol: "ETH", price: "$3,456", change: "+1.87%" },
    { id: "03", name: "Solana", symbol: "SOL", price: "$234", change: "+5.67%" },
    { id: "04", name: "BNB", symbol: "BNB", price: "$612", change: "+0.92%" },
    { id: "05", name: "XRP", symbol: "XRP", price: "$0.63", change: "+4.21%" },
    { id: "06", name: "Cardano", symbol: "ADA", price: "$0.98", change: "+3.15%" },
    { id: "07", name: "Polkadot", symbol: "DOT", price: "$7.89", change: "+2.11%" },
    { id: "08", name: "Polygon", symbol: "MATIC", price: "$1.23", change: "+1.45%" },
    { id: "09", name: "Chainlink", symbol: "LINK", price: "$15.67", change: "+3.78%" },
    { id: "10", name: "Avalanche", symbol: "AVAX", price: "$42.89", change: "+2.95%" }
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
    // Get or set target date: 90 days from first visit (persists across reloads)
    let targetDate;
    const storedTargetDate = localStorage.getItem('whalespad-countdown-target');
    
    if (storedTargetDate) {
      targetDate = new Date(storedTargetDate);
    } else {
      // First time - set 90 days from now
      targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + 90);
      localStorage.setItem('whalespad-countdown-target', targetDate.toISOString());
    }

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
      } else {
        // Countdown finished
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
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
      {/* Animated Background Effects */}
      <div className="hero-bg-effects">
        <div className="bg-gradient-orb bg-orb-1"></div>
        <div className="bg-gradient-orb bg-orb-2"></div>
        <div className="bg-gradient-orb bg-orb-3"></div>
        <div className="bg-grid-pattern"></div>
        <div className="animated-particles">
          <div className="particle particle-1"></div>
          <div className="particle particle-2"></div>
          <div className="particle particle-3"></div>
          <div className="particle particle-4"></div>
          <div className="particle particle-5"></div>
        </div>
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
                <span className="text-white font-bold text-sm">{coin.symbol}</span>
                <span className="text-gray-300 text-xs hidden sm:block">{coin.name}</span>
                <span className="text-white font-semibold text-sm">{coin.price}</span>
                <span className="text-green-400 text-xs font-medium">{coin.change}</span>
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
                <span className="text-white font-bold text-sm">{coin.symbol}</span>
                <span className="text-gray-300 text-xs hidden sm:block">{coin.name}</span>
                <span className="text-white font-semibold text-sm">{coin.price}</span>
                <span className="text-green-400 text-xs font-medium">{coin.change}</span>
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
              {/* Featured Banner */}
              <div className="presale-banner-image">
                <img 
                  src="/images/pools/presale.jpg" 
                  alt="Featured Presale Banner" 
                  className="banner-image"
                  onError={(e) => {
                    console.log('Banner image failed to load, using placeholder');
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x300/1a1a24/00d4ff?text=Featured+Presale+Banner';
                  }}
                />
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
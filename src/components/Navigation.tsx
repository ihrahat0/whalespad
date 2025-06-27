import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ConnectWalletButton } from './ConnectWalletButton';
import { MdWaves } from 'react-icons/md';
import { HiX, HiHome, HiDocumentText, HiCube, HiLightningBolt, HiSparkles } from 'react-icons/hi';

const Navigation: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Handle escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        closeMobileMenu();
      }
    };

    document.addEventListener('keydown', handleEscape);

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('mobile-menu-open');
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (!isMobileMenuOpen) {
      document.body.classList.add('mobile-menu-open');
    } else {
      document.body.classList.remove('mobile-menu-open');
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.classList.remove('mobile-menu-open');
  };

  // Mobile Menu Portal Component
  const MobileMenuPortal = () => {
    if (!isMobileMenuOpen) return null;

    return ReactDOM.createPortal(
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="mobile-menu-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
            />
            
            {/* Mobile Menu */}
            <motion.div
              className="mobile-menu"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
            >
              <div className="mobile-menu-header">
                <div className="mobile-logo">
                  <img 
                    src="/images/logo/logo.png" 
                    alt="WhalesPad" 
                    className="mobile-logo-image" 
                    onError={(e) => {
                      console.log('Mobile logo failed to load, trying alternative path');
                      (e.target as HTMLImageElement).src = '/public/images/logo/logo.png';
                    }}
                  />
                </div>
                <button className="mobile-menu-close" onClick={closeMobileMenu}>
                  <HiX />
                </button>
              </div>
              
              <div className="mobile-menu-items">
                <motion.a 
                  href="/" 
                  className="mobile-nav-item"
                  onClick={closeMobileMenu}
                  whileHover={{ x: 10 }}
                >
                  HOME
                </motion.a>
                
                <motion.a 
                  href="/ido-sales" 
                  className="mobile-nav-item highlight"
                  onClick={closeMobileMenu}
                  whileHover={{ x: 10 }}
                >
                  JOIN IDO
                </motion.a>
                
                <motion.a 
                  href="/sale" 
                  className="mobile-nav-item"
                  onClick={closeMobileMenu}
                  whileHover={{ x: 10 }}
                >
                  SALE
                </motion.a>
                
                <motion.a 
                  href="/blog" 
                  className="mobile-nav-item"
                  onClick={closeMobileMenu}
                  whileHover={{ x: 10 }}
                >
                  BLOG
                </motion.a>
                
                <motion.a 
                  href="/staking" 
                  className="mobile-nav-item"
                  onClick={closeMobileMenu}
                  whileHover={{ x: 10 }}
                >
                  STAKING
                </motion.a>
                
                <motion.a 
                  href="/airdrop" 
                  className="mobile-nav-item"
                  onClick={closeMobileMenu}
                  whileHover={{ x: 10 }}
                >
                  AIRDROP
                </motion.a>
              </div>
              
              {/* Connect Wallet Button - Positioned in middle area for easy access */}
              <div className="mobile-menu-wallet">
                <div className="mobile-wallet-section">
                  <ConnectWalletButton />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>,
      document.body
    );
  };

  return (
    <>
    <motion.nav 
      className="cyberpunk-navbar"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <div className="cyberpunk-nav-container">
        {/* WhalesPad Logo */}
        <motion.div 
          className="navbar-logo-simple"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
            <a href="/" onClick={closeMobileMenu}>
            <img 
              src="/images/logo/logo.png" 
              alt="WhalesPad" 
              className="logo-image-simple" 
              onError={(e) => {
                console.log('Logo failed to load, trying alternative path');
                (e.target as HTMLImageElement).src = '/public/images/logo/logo.png';
              }}
            />
          </a>
        </motion.div>

        {/* Desktop Navigation Menu */}
        <div className="cyberpunk-nav-frame desktop-nav">
        <motion.a 
              href="/ido-sales" 
              className="cyberpunk-nav-item apply-ido-btn"
              whileHover={{ scale: 1.05 }}
            >
              JOIN IDO
            </motion.a>

            <motion.a 
              href="/staking" 
              className="cyberpunk-nav-item"
              whileHover={{ scale: 1.05 }}
            >
              STAKING
            </motion.a>

          <div className="nav-items-container">
            <motion.a 
              href="/sale" 
              className="cyberpunk-nav-item"
              whileHover={{ scale: 1.05 }}
            >
              SALE
            </motion.a>
          
            <motion.a 
              href="/blog" 
              className="cyberpunk-nav-item blog-nav-item"
              whileHover={{ scale: 1.05 }}
            >
              BLOG
            </motion.a>
           
            <motion.a 
              href="/airdrop" 
              className="cyberpunk-nav-item"
              whileHover={{ scale: 1.05 }}
            >
              AIRDROP
            </motion.a>
          </div>
          
          {/* Connect Wallet Button */}
          <ConnectWalletButton />
        </div>

          {/* Mobile Navigation Controls */}
        <div className="mobile-nav-controls">
          <ConnectWalletButton />
            <motion.button
              className="mobile-menu-toggle"
              onClick={toggleMobileMenu}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </motion.button>
        </div>
      </div>
    </motion.nav>

      {/* Mobile Menu Portal - Renders outside nav element */}
      <MobileMenuPortal />
    </>
  );
};

export default Navigation; 
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ConnectWalletButton } from './ConnectWalletButton';

const Navigation: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        closeMobileMenu();
      }
    };

    document.addEventListener('keydown', handleEscape);

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

  return (
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
          <a href="/">
            <img src="/images/logo/logo.png" alt="WhalesPad" className="logo-image-simple" />
          </a>
        </motion.div>

        {/* Desktop Navigation Menu */}
        <div className="cyberpunk-nav-frame desktop-nav">
          <div className="nav-items-container">
            <motion.a 
              href="/" 
              className="cyberpunk-nav-item"
              whileHover={{ scale: 1.05 }}
            >
              HOME
            </motion.a>
          
            <motion.a 
              href="/blog" 
              className="cyberpunk-nav-item blog-nav-item"
              whileHover={{ scale: 1.05 }}
            >
              BLOG
            </motion.a>
            <motion.a 
              href="/ido-sales" 
              className="cyberpunk-nav-item"
              whileHover={{ scale: 1.05 }}
            >
              PROJECTS
            </motion.a>
            <motion.a 
              href="/staking" 
              className="cyberpunk-nav-item"
              whileHover={{ scale: 1.05 }}
            >
              STAKING
            </motion.a>
            <motion.a 
              href="/airdrop" 
              className="cyberpunk-nav-item"
              whileHover={{ scale: 1.05 }}
            >
              AIRDROP
            </motion.a>
            <motion.a 
              href="/submit-project" 
              className="cyberpunk-nav-item apply-ido-btn"
              whileHover={{ scale: 1.05 }}
            >
              APPLY IDO
            </motion.a>
          </div>
          
          {/* Connect Wallet Button */}
          <ConnectWalletButton />
        </div>

        {/* Mobile Menu Toggle Button */}
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

      {/* Mobile Menu Overlay */}
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
                  <span className="logo-icon">🐋</span>
                  <span className="logo-text">WhalesPad</span>
                </div>
                <button className="mobile-menu-close" onClick={closeMobileMenu}>
                  ✕
                </button>
              </div>
              
              <div className="mobile-menu-items">
                <motion.a 
                  href="/" 
                  className="mobile-nav-item active"
                  onClick={closeMobileMenu}
                  whileHover={{ x: 10 }}
                >
                  <span className="nav-icon">🏠</span>
                  HOME
                </motion.a>
                
                <motion.a 
                  href="/blog" 
                  className="mobile-nav-item"
                  onClick={closeMobileMenu}
                  whileHover={{ x: 10 }}
                >
                  <span className="nav-icon">📝</span>
                  BLOG
                </motion.a>
                
                <motion.a 
                  href="/ido-sales" 
                  className="mobile-nav-item"
                  onClick={closeMobileMenu}
                  whileHover={{ x: 10 }}
                >
                  <span className="nav-icon">💎</span>
                  PROJECTS
                </motion.a>
                
                <motion.a 
                  href="/staking" 
                  className="mobile-nav-item"
                  onClick={closeMobileMenu}
                  whileHover={{ x: 10 }}
                >
                  <span className="nav-icon">⚡</span>
                  STAKING
                </motion.a>
                
                <motion.a 
                  href="/airdrop" 
                  className="mobile-nav-item"
                  onClick={closeMobileMenu}
                  whileHover={{ x: 10 }}
                >
                  <span className="nav-icon">🎁</span>
                  AIRDROP
                </motion.a>
                
                <motion.a 
                  href="/submit-project" 
                  className="mobile-nav-item highlight"
                  onClick={closeMobileMenu}
                  whileHover={{ x: 10 }}
                >
                  <span className="nav-icon">🚀</span>
                  APPLY IDO
                </motion.a>
              </div>
              
              <div className="mobile-menu-footer">
                <div className="mobile-wallet-section">
                  <ConnectWalletButton />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navigation; 
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ConnectWalletButton } from './ConnectWalletButton';
import { 
  HiHome, 
  HiCube, 
  HiLightningBolt, 
  HiDocumentText,
  HiCog,
  HiX
} from 'react-icons/hi';
import { IoRocketSharp } from 'react-icons/io5';
import { MdWaves } from 'react-icons/md';

interface BlogNavbarProps {
  isAdmin?: boolean;
}

const BlogNavbar: React.FC<BlogNavbarProps> = ({ isAdmin = false }) => {
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

  return (
    <motion.nav 
      className="cyberpunk-navbar fixed w-full top-0 left-0 z-50"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <div className="cyberpunk-nav-container">
        {/* WhalesPad Logo */}
        <motion.div 
          className="navbar-logo-enhanced"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Link to="/" className="flex items-center" onClick={closeMobileMenu}>
            <div className="logo-orbit">
              <div className="logo-center">
                <MdWaves className="logo-icon-enhanced" />
              </div>
              <div className="orbit-ring"></div>
              <div className="orbit-ring orbit-ring-2"></div>
            </div>
            <div className="logo-text-enhanced">
              <span className="logo-main">WhalesPad</span>
              <span className="logo-tagline">LAUNCHPAD</span>
            </div>
          </Link>
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
              className="cyberpunk-nav-item blog-nav-item active"
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
            {isAdmin && (
              <motion.a 
                href="/admin/dashboard" 
                className="cyberpunk-nav-item admin-nav-item"
                whileHover={{ scale: 1.05 }}
              >
                DASHBOARD
              </motion.a>
            )}
            <motion.a 
              href="/create-presale" 
              className="cyberpunk-nav-item create-presale-btn"
              whileHover={{ scale: 1.05 }}
            >
              CREATE PRESALE
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
                  <MdWaves className="logo-icon" />
                  <span className="logo-text">WhalesPad</span>
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
                  <HiHome className="nav-icon" />
                  HOME
                </motion.a>
                
                <motion.a 
                  href="/blog" 
                  className="mobile-nav-item active"
                  onClick={closeMobileMenu}
                  whileHover={{ x: 10 }}
                >
                  <HiDocumentText className="nav-icon" />
                  BLOG
                </motion.a>
                
                <motion.a 
                  href="/ido-sales" 
                  className="mobile-nav-item"
                  onClick={closeMobileMenu}
                  whileHover={{ x: 10 }}
                >
                  <HiCube className="nav-icon" />
                  PROJECTS
                </motion.a>
                
                <motion.a 
                  href="/staking" 
                  className="mobile-nav-item"
                  onClick={closeMobileMenu}
                  whileHover={{ x: 10 }}
                >
                  <HiLightningBolt className="nav-icon" />
                  STAKING
                </motion.a>
                
                {isAdmin && (
                  <motion.a 
                    href="/admin/dashboard" 
                    className="mobile-nav-item"
                    onClick={closeMobileMenu}
                    whileHover={{ x: 10 }}
                  >
                    <HiCog className="nav-icon" />
                    DASHBOARD
                  </motion.a>
                )}
                
                <motion.a 
                  href="/create-presale" 
                  className="mobile-nav-item highlight"
                  onClick={closeMobileMenu}
                  whileHover={{ x: 10 }}
                >
                  <IoRocketSharp className="nav-icon" />
                  CREATE PRESALE
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

export default BlogNavbar; 
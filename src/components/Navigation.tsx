import React from 'react';
import { motion } from 'framer-motion';
import { ConnectWalletButton } from './ConnectWalletButton';
import { 
  HiHome, 
  HiCube, 
  HiLightningBolt, 
  HiGift 
} from 'react-icons/hi';
import { 
  FiHome, 
  FiBox, 
  FiZap, 
  FiGift, 
  FiTrendingUp 
} from 'react-icons/fi';
import { IoRocketSharp } from 'react-icons/io5';

const Navigation: React.FC = () => {

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

        {/* Mobile Connect Wallet Button Only */}
        <div className="mobile-nav-controls">
          <ConnectWalletButton />
        </div>
      </div>

      {/* Mobile Bottom Navigation - Always Visible on Mobile */}
      <motion.div 
        className="mobile-bottom-nav"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.a 
          href="/" 
          className="bottom-nav-item"
          whileHover={{ scale: 1.1, y: -5 }}
          whileTap={{ scale: 0.9 }}
        >
          <div className="nav-icon-container">
            <HiHome className="nav-icon" />
          </div>
          <span className="nav-label">Home</span>
        </motion.a>

        <motion.a 
          href="/ido-sales" 
          className="bottom-nav-item"
          whileHover={{ scale: 1.1, y: -5 }}
          whileTap={{ scale: 0.9 }}
        >
          <div className="nav-icon-container">
            <HiCube className="nav-icon" />
          </div>
          <span className="nav-label">Projects</span>
        </motion.a>

        <motion.a 
          href="/staking" 
          className="bottom-nav-item"
          whileHover={{ scale: 1.1, y: -5 }}
          whileTap={{ scale: 0.9 }}
        >
          <div className="nav-icon-container">
            <HiLightningBolt className="nav-icon" />
          </div>
          <span className="nav-label">Staking</span>
        </motion.a>

        <motion.a 
          href="/airdrop" 
          className="bottom-nav-item"
          whileHover={{ scale: 1.1, y: -5 }}
          whileTap={{ scale: 0.9 }}
        >
          <div className="nav-icon-container">
            <HiGift className="nav-icon" />
          </div>
          <span className="nav-label">Airdrop</span>
        </motion.a>

        <motion.a 
          href="/submit-project" 
          className="bottom-nav-item special"
          whileHover={{ scale: 1.1, y: -8 }}
          whileTap={{ scale: 0.9 }}
        >
          <div className="nav-icon-container special-icon">
            <IoRocketSharp className="nav-icon" />
          </div>
          <span className="nav-label">Apply</span>
        </motion.a>
      </motion.div>
    </motion.nav>
  );
};

export default Navigation; 
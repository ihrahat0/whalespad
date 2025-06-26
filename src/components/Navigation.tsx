import React from 'react';
import { motion } from 'framer-motion';
import { ConnectWalletButton } from './ConnectWalletButton';

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
            {/* <motion.a 
              href="/ido-sales" 
              className="cyberpunk-nav-item"
              whileHover={{ scale: 1.05 }}
            >
              PROJECTS
            </motion.a> */}
           
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

        {/* Mobile Connect Wallet Button Only */}
        <div className="mobile-nav-controls">
          <ConnectWalletButton />
        </div>
      </div>

      {/* Mobile Bottom Navigation - Text Only */}
      <div className="mobile-bottom-nav">
        <div className="cyberpunk-nav-frame mobile-nav-frame">
          <div className="mobile-nav-items-container">

          <motion.a 
              href="/ido-sales" 
              className="cyberpunk-nav-item mobile-nav-item apply-ido-btn"
              whileHover={{ scale: 1.05 }}
            >
              <span>JOIN IDO</span>
            </motion.a>

           
            <motion.a 
              href="/staking" 
              className="cyberpunk-nav-item mobile-nav-item"
              whileHover={{ scale: 1.05 }}
            >
              <span>STAKING</span>
            </motion.a>

            <motion.a 
              href="/blog" 
              className="cyberpunk-nav-item mobile-nav-item"
              whileHover={{ scale: 1.05 }}
            >
              <span>BLOG</span>
            </motion.a>
            
            <motion.a 
              href="/airdrop" 
              className="cyberpunk-nav-item mobile-nav-item"
              whileHover={{ scale: 1.05 }}
            >
              <span>AIRDROP</span>
            </motion.a>

            <motion.a
              className="cyberpunk-nav-item mobile-nav-item"
              whileHover={{ scale: 1.05 }}
            >
             <ConnectWalletButton />
            </motion.a>


            
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation; 
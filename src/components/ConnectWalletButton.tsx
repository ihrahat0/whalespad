import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount, useDisconnect } from 'wagmi';
import { motion } from 'framer-motion';
import './simple-modal.css';

interface ConnectWalletButtonProps {
  onMobileMenuClose?: () => void;
}

export const ConnectWalletButton: React.FC<ConnectWalletButtonProps> = ({ onMobileMenuClose }) => {
  const { open } = useWeb3Modal();
  const { address, isConnecting, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  // Use a global approach to handle mobile menu close timing
  useEffect(() => {
    const handlePendingWalletConnect = () => {
      console.log('🔗 Wallet Connect: Global event received, showing modal in 200ms');
      setTimeout(() => {
        console.log('🔗 Wallet Connect: Showing terms modal now');
        // Ensure body classes are cleared
        document.body.classList.remove('mobile-menu-open');
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        
        setShowTermsModal(true);
      }, 200);
    };

    // Listen for global event
    window.addEventListener('wallet-connect-pending', handlePendingWalletConnect);
    
    return () => {
      window.removeEventListener('wallet-connect-pending', handlePendingWalletConnect);
    };
  }, []);

  const handleClick = () => {
    if (isConnected) {
      disconnect();
    } else {
      // If called from mobile menu, close menu first then trigger global event
      if (onMobileMenuClose) {
        console.log('🔗 Wallet Connect: Mobile menu detected, closing menu and dispatching event');
        onMobileMenuClose();
        // Dispatch global event after menu closes
        setTimeout(() => {
          console.log('🔗 Wallet Connect: Dispatching wallet-connect-pending event');
          window.dispatchEvent(new CustomEvent('wallet-connect-pending'));
        }, 100);
      } else {
        console.log('🔗 Wallet Connect: Desktop mode, showing modal directly');
        setShowTermsModal(true);
      }
    }
  };

  const handleCloseModal = () => {
    setShowTermsModal(false);
    setTermsAccepted(false);
  };

  const handleProceedToConnect = () => {
    if (termsAccepted) {
      setShowTermsModal(false);
      setTimeout(() => {
        open();
      }, 300);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Simple modal component
  const TermsModal = () => (
    <div className="simple-terms-overlay" onClick={handleCloseModal}>
      <div className="simple-terms-content" onClick={(e) => e.stopPropagation()}>
        <div className="simple-terms-header">
          <h2>Terms & Conditions</h2>
          <button onClick={handleCloseModal}>×</button>
        </div>
        
        <div className="simple-terms-body">
          <div className="terms-icon">🛡️</div>
          <p>To connect your wallet and use WhalesPad, you must agree to our Terms of Service and Privacy Policy.</p>
          
          <label className="simple-checkbox-label">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
            />
            <span className="simple-checkmark"></span>
            <span>
              I agree to the{' '}
              <a href="/terms-of-service" target="_blank" rel="noopener noreferrer">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </a>
            </span>
          </label>
          
          <div className="simple-warning">
            <span>⚠️</span>
            <p>Cryptocurrency investments carry significant risks. Never invest more than you can afford to lose.</p>
          </div>
        </div>
        
        <div className="simple-terms-footer">
          <button className="simple-btn-cancel" onClick={handleCloseModal}>
            Cancel
          </button>
          <button 
            className={`simple-btn-connect ${!termsAccepted ? 'disabled' : ''}`}
            onClick={handleProceedToConnect}
            disabled={!termsAccepted}
          >
            Connect Wallet
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <motion.button
        className="cyberpunk-wallet-btn"
        onClick={handleClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={isConnecting}
      >
        {isConnecting ? (
          <>
            <span className="wallet-loading-spinner"></span>
            <span>CONNECTING...</span>
          </>
        ) : isConnected && address ? (
          <>
            <span className="wallet-connected-dot"></span>
            <span>{formatAddress(address)}</span>
          </>
        ) : (
          <>
            <span className="wallet-icon">Connect Wallet</span>
          </>
        )}
      </motion.button>

      {/* Simple Portal Modal */}
      {showTermsModal && ReactDOM.createPortal(<TermsModal />, document.body)}
    </>
  );
}; 
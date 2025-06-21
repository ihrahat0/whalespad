import React from 'react';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount, useDisconnect } from 'wagmi';
import { motion } from 'framer-motion';

export const FloatingConnectWallet: React.FC = () => {
  const { open } = useWeb3Modal();
  const { address, isConnecting, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const handleClick = () => {
    if (isConnected) {
      disconnect();
    } else {
      open();
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="floating-wallet-container">
      <motion.button
        className={`floating-connect-wallet ${isConnected ? 'connected' : ''}`}
        onClick={handleClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={isConnecting}
        initial={{ opacity: 0, scale: 0, y: 100 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ 
          duration: 0.8, 
          delay: 2,
          type: "spring", 
          stiffness: 200, 
          damping: 15 
        }}
      >
        <div className="floating-wallet-content">
          {isConnecting ? (
            <>
              <div className="floating-wallet-loading"></div>
              <span className="floating-wallet-text">CONNECTING...</span>
            </>
          ) : isConnected && address ? (
            <>
              <span className="floating-wallet-connected-dot"></span>
              <span className="floating-wallet-text">{formatAddress(address)}</span>
            </>
          ) : (
            <>
              <span className="floating-wallet-icon"></span>
              <span className="floating-wallet-text">CONNECT</span>
            </>
          )}
        </div>
        {!isConnecting && <div className="floating-wallet-pulse"></div>}
      </motion.button>
    </div>
  );
}; 
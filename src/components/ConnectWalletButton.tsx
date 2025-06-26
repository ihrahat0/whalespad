import React from 'react';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount, useDisconnect } from 'wagmi';
import { motion } from 'framer-motion';

export const ConnectWalletButton: React.FC = () => {
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
          <span className="wallet-icon"></span>
          <img height={20} width={20} src="https://cdn.prod.website-files.com/6527c669d575da173bf65551/6602c9b25c310ea51dc36a79_crypto_non-custodial.webp" alt="wallet" className="wallet-icon" />
        </>
      )}
    </motion.button>
  );
}; 
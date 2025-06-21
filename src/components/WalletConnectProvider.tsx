import React from 'react';
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react';
import { WagmiProvider } from 'wagmi';
import { mainnet, polygon, bsc, optimism, arbitrum } from 'viem/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Your Project ID
const projectId = 'c6ac2a7972be6c9d0ad711c5f247038b';

// Chains for the app
const chains = [mainnet, polygon, bsc, optimism, arbitrum] as const;

// Create metadata
const metadata = {
  name: 'WhalesPad',
  description: 'WhalesPad Crypto Launchpad',
  url: 'https://whalespad.com',
  icons: ['https://whalespad.com/icon.png']
};

// Wagmi configuration using defaultWagmiConfig
const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  enableCoinbase: true,
  enableInjected: true,
});

// QueryClient for React Query
const queryClient = new QueryClient();

// Create Web3Modal
createWeb3Modal({
  wagmiConfig,
  projectId,
  themeMode: 'dark',
  themeVariables: {
    '--w3m-font-family': 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    '--w3m-accent': '#00d4ff',
    '--w3m-color-mix': '#1a1a1a',
    '--w3m-color-mix-strength': 40,
  },
});

interface WalletConnectProviderProps {
  children: React.ReactNode;
}

export const WalletConnectProvider: React.FC<WalletConnectProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        {children}
      </WagmiProvider>
    </QueryClientProvider>
  );
}; 
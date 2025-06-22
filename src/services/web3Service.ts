import { ethers, BrowserProvider, JsonRpcSigner } from 'ethers';
import { formatEther, parseEther } from 'ethers';

// Custom ethereum interface
interface EthereumProvider {
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on: (event: string, callback: (...args: any[]) => void) => void;
  selectedAddress?: string;
}

// Helper to get ethereum provider with correct typing
const getEthereum = (): EthereumProvider | undefined => {
  return (window as any).ethereum;
};

// Contract ABIs (simplified - you'll need the full ABIs from compilation)
const LAUNCHPAD_FACTORY_ABI = [
  'function createPool(address,uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint8,uint256) external payable returns (address)',
  'function getAllPools() external view returns (address[])',
  'function getUserPools(address) external view returns (address[])',
  'function getPoolCreationFee() external view returns (uint256)',
  'function isValidPool(address) external view returns (bool)'
];

const IDO_POOL_ABI = [
  'function contribute() external payable',
  'function claimTokens() external',
  'function claimRefund() external',
  'function startPool() external',
  'function finishPool() external',
  'function getTokenPrice() external view returns (uint256)',
  'function getUserContribution(address) external view returns (uint256)',
  'function totalRaised() external view returns (uint256)',
  'function hardCap() external view returns (uint256)',
  'function status() external view returns (uint8)',
  'function contributions(address) external view returns (uint256)',
  'function hasClaimedTokens(address) external view returns (bool)'
];

// Network chain IDs
const SEPOLIA_CHAIN_ID = 11155111;
const BSC_TESTNET_CHAIN_ID = 97;
const POLYGON_MUMBAI_CHAIN_ID = 80001;

// Contract addresses by network
const CONTRACT_ADDRESSES: Record<number, { factory: string }> = {
  [SEPOLIA_CHAIN_ID]: {
    factory: '0x3B419D3Fb4E603507831F3c40fBb84FC037Ed15e',
  },
  [BSC_TESTNET_CHAIN_ID]: {
    factory: process.env.REACT_APP_BSC_TESTNET_FACTORY_ADDRESS || '',
  },
  [POLYGON_MUMBAI_CHAIN_ID]: {
    factory: process.env.REACT_APP_POLYGON_MUMBAI_FACTORY_ADDRESS || '',
  }
};

export interface CreatePoolParams {
  tokenAddress: string;
  tokenPrice: string;
  hardCap: string;
  softCap: string;
  minContribution: string;
  maxContribution: string;
  startTime: number;
  endTime: number;
  liquidityPercentage: number;
  liquidityLockTime: number;
}

export interface PoolInfo {
  address: string;
  owner: string;
  tokenAddress: string;
  tokenPrice: string;
  hardCap: string;
  softCap: string;
  totalRaised: string;
  status: number;
  startTime: number;
  endTime: number;
}

class Web3Service {
  private provider: BrowserProvider | null = null;
  private signer: JsonRpcSigner | null = null;
  private chainId: number | null = null;

  constructor() {
    this.initializeProvider();
  }

  private async initializeProvider() {
    const ethereum = getEthereum();
    if (typeof window !== 'undefined' && ethereum) {
      this.provider = new BrowserProvider(ethereum as any);
      
      // Listen for account changes
      ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          this.disconnect();
        } else {
          this.initializeSigner();
        }
      });

      // Listen for chain changes
      ethereum.on('chainChanged', (chainId: string) => {
        this.chainId = parseInt(chainId, 16);
        window.location.reload();
      });
    }
  }

  async connect(): Promise<string[]> {
    if (!this.provider) {
      throw new Error('No Web3 provider found');
    }

    const accounts = await this.provider.send('eth_requestAccounts', []);
    await this.initializeSigner();
    
    return accounts;
  }

  private async initializeSigner() {
    if (this.provider) {
      this.signer = await this.provider.getSigner();
      const network = await this.provider.getNetwork();
      this.chainId = Number(network.chainId);
    }
  }

  disconnect() {
    this.provider = null;
    this.signer = null;
    this.chainId = null;
  }

  async getAccount(): Promise<string | null> {
    if (!this.signer) return null;
    try {
      return await this.signer.getAddress();
    } catch {
      return null;
    }
  }

  async getBalance(): Promise<string> {
    if (!this.signer || !this.provider) throw new Error('No signer available');
    const address = await this.signer.getAddress();
    const balance = await this.provider.getBalance(address);
    return formatEther(balance);
  }

  async switchNetwork(chainId: number): Promise<void> {
    const ethereum = getEthereum();
    if (!ethereum) throw new Error('No Web3 provider found');
    
    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (error: any) {
      // If the chain hasn't been added to MetaMask, add it
      if (error.code === 4902) {
        await this.addNetwork(chainId);
      } else {
        throw error;
      }
    }
  }

  private async addNetwork(chainId: number): Promise<void> {
    const networkConfigs: Record<number, any> = {
      [SEPOLIA_CHAIN_ID]: {
        chainId: '0xaa36a7',
        chainName: 'Sepolia Test Network',
        nativeCurrency: { name: 'SepoliaETH', symbol: 'ETH', decimals: 18 },
        rpcUrls: ['https://sepolia.infura.io/v3/'],
        blockExplorerUrls: ['https://sepolia.etherscan.io/']
      },
      [BSC_TESTNET_CHAIN_ID]: {
        chainId: '0x61',
        chainName: 'BSC Testnet',
        nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
        rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
        blockExplorerUrls: ['https://testnet.bscscan.com/']
      },
      [POLYGON_MUMBAI_CHAIN_ID]: {
        chainId: '0x13881',
        chainName: 'Polygon Mumbai',
        nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
        rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
        blockExplorerUrls: ['https://mumbai.polygonscan.com/']
      }
    };

    const config = networkConfigs[chainId];
    if (!config) throw new Error('Unsupported network');

    const ethereum = getEthereum();
    if (!ethereum) throw new Error('No Web3 provider found');
    
    await ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [config],
    });
  }

  // Factory Contract Methods
  async createPool(params: CreatePoolParams): Promise<string> {
    if (!this.signer || !this.chainId) throw new Error('Not connected');
    
    const factoryAddress = CONTRACT_ADDRESSES[this.chainId]?.factory;
    if (!factoryAddress) throw new Error('Factory not deployed on this network');

    const factory = new ethers.Contract(factoryAddress, LAUNCHPAD_FACTORY_ABI, this.signer);
    const fee = await factory.getPoolCreationFee();

    const tx = await factory.createPool(
      params.tokenAddress,
      parseEther(params.tokenPrice),
      parseEther(params.hardCap),
      parseEther(params.softCap),
      parseEther(params.minContribution),
      parseEther(params.maxContribution),
      params.startTime,
      params.endTime,
      params.liquidityPercentage,
      params.liquidityLockTime,
      { value: fee }
    );

    const receipt = await tx.wait();
    const poolCreatedEvent = receipt?.logs?.find((log: any) => {
      try {
        const parsed = factory.interface.parseLog(log);
        return parsed?.name === 'PoolCreated';
      } catch {
        return false;
      }
    });
    
    if (poolCreatedEvent) {
      const parsed = factory.interface.parseLog(poolCreatedEvent);
      return parsed?.args?.poolAddress || '';
    }
    return '';
  }

  async getAllPools(): Promise<string[]> {
    if (!this.provider || !this.chainId) throw new Error('Not connected');
    
    const factoryAddress = CONTRACT_ADDRESSES[this.chainId]?.factory;
    if (!factoryAddress) return [];

    const factory = new ethers.Contract(factoryAddress, LAUNCHPAD_FACTORY_ABI, this.provider);
    return await factory.getAllPools();
  }

  async getUserPools(userAddress: string): Promise<string[]> {
    if (!this.provider || !this.chainId) throw new Error('Not connected');
    
    const factoryAddress = CONTRACT_ADDRESSES[this.chainId]?.factory;
    if (!factoryAddress) return [];

    const factory = new ethers.Contract(factoryAddress, LAUNCHPAD_FACTORY_ABI, this.provider);
    return await factory.getUserPools(userAddress);
  }

  async getPoolCreationFee(): Promise<string> {
    if (!this.provider || !this.chainId) throw new Error('Not connected');
    
    const factoryAddress = CONTRACT_ADDRESSES[this.chainId]?.factory;
    if (!factoryAddress) return '0';

    const factory = new ethers.Contract(factoryAddress, LAUNCHPAD_FACTORY_ABI, this.provider);
    const fee = await factory.getPoolCreationFee();
    return formatEther(fee);
  }

  // Pool Contract Methods
  async contributeToPool(poolAddress: string, amount: string): Promise<string> {
    if (!this.signer) throw new Error('Not connected');
    
    const pool = new ethers.Contract(poolAddress, IDO_POOL_ABI, this.signer);
    const tx = await pool.contribute({ value: parseEther(amount) });
    
    return tx.hash;
  }

  async claimTokens(poolAddress: string): Promise<string> {
    if (!this.signer) throw new Error('Not connected');
    
    const pool = new ethers.Contract(poolAddress, IDO_POOL_ABI, this.signer);
    const tx = await pool.claimTokens();
    
    return tx.hash;
  }

  async claimRefund(poolAddress: string): Promise<string> {
    if (!this.signer) throw new Error('Not connected');
    
    const pool = new ethers.Contract(poolAddress, IDO_POOL_ABI, this.signer);
    const tx = await pool.claimRefund();
    
    return tx.hash;
  }

  async getPoolInfo(poolAddress: string): Promise<PoolInfo | null> {
    if (!this.provider) throw new Error('Not connected');
    
    try {
      const pool = new ethers.Contract(poolAddress, IDO_POOL_ABI, this.provider);
      
      const [tokenPrice, totalRaised, hardCap, status] = await Promise.all([
        pool.getTokenPrice(),
        pool.totalRaised(),
        pool.hardCap(),
        pool.status()
      ]);

      return {
        address: poolAddress,
        owner: '', // You'll need to add this to the contract
        tokenAddress: '', // You'll need to add this to the contract
        tokenPrice: formatEther(tokenPrice),
        hardCap: formatEther(hardCap),
        softCap: '0', // You'll need to add this to the contract
        totalRaised: formatEther(totalRaised),
        status: Number(status),
        startTime: 0, // You'll need to add this to the contract
        endTime: 0 // You'll need to add this to the contract
      };
    } catch (error) {
      console.error('Error getting pool info:', error);
      return null;
    }
  }

  async getUserContribution(poolAddress: string, userAddress: string): Promise<string> {
    if (!this.provider) throw new Error('Not connected');
    
    const pool = new ethers.Contract(poolAddress, IDO_POOL_ABI, this.provider);
    const contribution = await pool.getUserContribution(userAddress);
    return formatEther(contribution);
  }

  async hasClaimedTokens(poolAddress: string, userAddress: string): Promise<boolean> {
    if (!this.provider) throw new Error('Not connected');
    
    const pool = new ethers.Contract(poolAddress, IDO_POOL_ABI, this.provider);
    return await pool.hasClaimedTokens(userAddress);
  }
}

export default new Web3Service(); 
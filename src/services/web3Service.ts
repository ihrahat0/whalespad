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

// USDT Presale Contract ABI (from the attached demo-abi.json)
const USDT_PRESALE_ABI = [
  'function purchaseTokens(uint256 usdtAmount) external',
  'function calculateWPTAmount(uint256 usdtAmount) external view returns (uint256)',
  'function getUserInfo(address user) external view returns (uint256 _usdtSpent, uint256 _wptReceived, uint256 _remainingAllowance)',
  'function getPresaleStats() external view returns (uint256 _totalUSDTRaised, uint256 _totalWPTSold, uint256 _presaleRate, uint256 _startTime, uint256 _endTime, bool _isActive)',
  'function getContractBalances() external view returns (uint256 _usdtBalance, uint256 _wptBalance)',
  'function isPresaleActive() external view returns (bool)',
  'function USDT() external view returns (address)',
  'function WPT() external view returns (address)',
  'function presaleRate() external view returns (uint256)',
  'function minPurchaseAmount() external view returns (uint256)',
  'function maxPurchaseAmount() external view returns (uint256)',
  'function presaleStartTime() external view returns (uint256)',
  'function presaleEndTime() external view returns (uint256)',
  'function totalUSDTRaised() external view returns (uint256)',
  'function totalWPTSold() external view returns (uint256)',
  'function userPurchases(address) external view returns (uint256)',
  'function userTokens(address) external view returns (uint256)'
];

// ERC20 Token ABI (for USDT operations)
const ERC20_ABI = [
  'function balanceOf(address owner) external view returns (uint256)',
  'function allowance(address owner, address spender) external view returns (uint256)',
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function transfer(address to, uint256 amount) external returns (bool)',
  'function transferFrom(address from, address to, uint256 amount) external returns (bool)',
  'function decimals() external view returns (uint8)',
  'function symbol() external view returns (string)',
  'function name() external view returns (string)'
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

  // USDT Presale Methods
  async getUSDTBalance(usdtTokenAddress: string, userAddress: string): Promise<string> {
    if (!this.provider) throw new Error('Not connected');
    
    const usdtContract = new ethers.Contract(usdtTokenAddress, ERC20_ABI, this.provider);
    const balance = await usdtContract.balanceOf(userAddress);
    const decimals = await usdtContract.decimals();
    return ethers.formatUnits(balance, decimals);
  }

  async getUSDTAllowance(usdtTokenAddress: string, userAddress: string, spenderAddress: string): Promise<string> {
    if (!this.provider) throw new Error('Not connected');
    
    const usdtContract = new ethers.Contract(usdtTokenAddress, ERC20_ABI, this.provider);
    const allowance = await usdtContract.allowance(userAddress, spenderAddress);
    const decimals = await usdtContract.decimals();
    return ethers.formatUnits(allowance, decimals);
  }

  async approveUSDT(usdtTokenAddress: string, spenderAddress: string, amount: string): Promise<string> {
    if (!this.signer) throw new Error('Not connected');
    
    const usdtContract = new ethers.Contract(usdtTokenAddress, ERC20_ABI, this.signer);
    const decimals = await usdtContract.decimals();
    const amountInWei = ethers.parseUnits(amount, decimals);
    
    const tx = await usdtContract.approve(spenderAddress, amountInWei);
    return tx.hash;
  }

  async purchaseTokensWithUSDT(presaleContractAddress: string, usdtAmount: string, usdtTokenAddress: string): Promise<string> {
    if (!this.signer) throw new Error('Not connected');
    
    const presaleContract = new ethers.Contract(presaleContractAddress, USDT_PRESALE_ABI, this.signer);
    const usdtContract = new ethers.Contract(usdtTokenAddress, ERC20_ABI, this.signer);
    const decimals = await usdtContract.decimals();
    const amountInWei = ethers.parseUnits(usdtAmount, decimals);
    
    const tx = await presaleContract.purchaseTokens(amountInWei);
    return tx.hash;
  }

  async calculateWPTAmount(presaleContractAddress: string, usdtAmount: string, usdtTokenAddress: string): Promise<string> {
    if (!this.provider) throw new Error('Not connected');
    
    const presaleContract = new ethers.Contract(presaleContractAddress, USDT_PRESALE_ABI, this.provider);
    const usdtContract = new ethers.Contract(usdtTokenAddress, ERC20_ABI, this.provider);
    const decimals = await usdtContract.decimals();
    const amountInWei = ethers.parseUnits(usdtAmount, decimals);
    
    const wptAmount = await presaleContract.calculateWPTAmount(amountInWei);
    return ethers.formatEther(wptAmount); // Assuming WPT has 18 decimals
  }

  async getUSDTPresaleUserInfo(presaleContractAddress: string, userAddress: string): Promise<{
    usdtSpent: string;
    wptReceived: string;
    remainingAllowance: string;
  }> {
    if (!this.provider) throw new Error('Not connected');
    
    const presaleContract = new ethers.Contract(presaleContractAddress, USDT_PRESALE_ABI, this.provider);
    const [usdtSpent, wptReceived, remainingAllowance] = await presaleContract.getUserInfo(userAddress);
    
    // Get USDT contract to determine decimals
    const usdtAddress = await presaleContract.USDT();
    const usdtContract = new ethers.Contract(usdtAddress, ERC20_ABI, this.provider);
    const usdtDecimals = await usdtContract.decimals();
    
    return {
      usdtSpent: ethers.formatUnits(usdtSpent, usdtDecimals),
      wptReceived: ethers.formatEther(wptReceived), // Assuming WPT has 18 decimals
      remainingAllowance: ethers.formatUnits(remainingAllowance, usdtDecimals)
    };
  }

  async getUSDTPresaleStats(presaleContractAddress: string): Promise<{
    totalUSDTRaised: string;
    totalWPTSold: string;
    presaleRate: string;
    startTime: number;
    endTime: number;
    isActive: boolean;
  }> {
    if (!this.provider) throw new Error('Not connected');
    
    const presaleContract = new ethers.Contract(presaleContractAddress, USDT_PRESALE_ABI, this.provider);
    const [totalUSDTRaised, totalWPTSold, presaleRate, startTime, endTime, isActive] = await presaleContract.getPresaleStats();
    
    // Get USDT contract to determine decimals
    const usdtAddress = await presaleContract.USDT();
    const usdtContract = new ethers.Contract(usdtAddress, ERC20_ABI, this.provider);
    const usdtDecimals = await usdtContract.decimals();
    
    return {
      totalUSDTRaised: ethers.formatUnits(totalUSDTRaised, usdtDecimals),
      totalWPTSold: ethers.formatEther(totalWPTSold), // Assuming WPT has 18 decimals
      presaleRate: presaleRate.toString(),
      startTime: Number(startTime),
      endTime: Number(endTime),
      isActive
    };
  }

  async isUSDTPresaleActive(presaleContractAddress: string): Promise<boolean> {
    if (!this.provider) throw new Error('Not connected');
    
    const presaleContract = new ethers.Contract(presaleContractAddress, USDT_PRESALE_ABI, this.provider);
    return await presaleContract.isPresaleActive();
  }

  async getUSDTPresaleMinMaxAmounts(presaleContractAddress: string): Promise<{
    minAmount: string;
    maxAmount: string;
    usdtAddress: string;
  }> {
    if (!this.provider) throw new Error('Not connected');
    
    const presaleContract = new ethers.Contract(presaleContractAddress, USDT_PRESALE_ABI, this.provider);
    const [minAmount, maxAmount, usdtAddress] = await Promise.all([
      presaleContract.minPurchaseAmount(),
      presaleContract.maxPurchaseAmount(),
      presaleContract.USDT()
    ]);
    
    const usdtContract = new ethers.Contract(usdtAddress, ERC20_ABI, this.provider);
    const usdtDecimals = await usdtContract.decimals();
    
    return {
      minAmount: ethers.formatUnits(minAmount, usdtDecimals),
      maxAmount: ethers.formatUnits(maxAmount, usdtDecimals),
      usdtAddress
    };
  }
}

export default new Web3Service(); 
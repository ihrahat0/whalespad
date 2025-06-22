# Environment Setup Guide

Create a `.env` file in your project root with the following variables:

```bash
# Blockchain RPC URLs
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
BSC_TESTNET_RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545
POLYGON_MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com

# Private Key for Deployment (NEVER commit this)
PRIVATE_KEY=your_private_key_here

# API Keys for Contract Verification
ETHERSCAN_API_KEY=your_etherscan_api_key
BSCSCAN_API_KEY=your_bscscan_api_key
POLYGONSCAN_API_KEY=your_polygonscan_api_key

# Smart Contract Addresses (Update after deployment)
REACT_APP_SEPOLIA_FACTORY_ADDRESS=
REACT_APP_BSC_TESTNET_FACTORY_ADDRESS=
REACT_APP_POLYGON_MUMBAI_FACTORY_ADDRESS=

# Supabase Configuration
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key

# Additional Configuration
REACT_APP_ENVIRONMENT=development
REACT_APP_ENABLE_ANALYTICS=false
```

## Setup Instructions

1. Copy this template to `.env` in your project root
2. Fill in your actual values
3. Never commit the `.env` file to version control
4. Deploy contracts and update the factory addresses 
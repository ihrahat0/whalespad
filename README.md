# WhalesPad - Crypto Launchpad Platform

A modern, secure launchpad platform for cryptocurrency token sales and IDOs (Initial DEX Offerings) across multiple EVM chains.

## Features

- Multi-chain support (Ethereum, BSC, Polygon, Arbitrum)
- User-friendly project submission
- Admin panel for project review and management
- Smart contract integration for token sales
- Automated token distribution
- Vesting options for token distributions
- Liquidity pool creation and locking

## Project Structure

- `/contracts` - Smart contracts for the launchpad
- `/src` - React frontend
- `/api` - PHP backend API
- `/database_schema.sql` - Database schema

## Setup Instructions

### 1. Smart Contract Deployment

The platform requires two smart contracts:

1. `LaunchpadFactory.sol` - Main factory contract that creates IDO pools
2. `IDOPool.sol` - Individual pool contract for each token sale

Deploy these contracts on each blockchain you want to support using tools like Remix, Hardhat, or Truffle.

#### Deployment Steps:

1. Deploy `LaunchpadFactory.sol` first
2. Note the deployed contract address - this is your main launchpad address
3. Set appropriate fees using the setPoolsFee function

### 2. Database Setup

1. Import the `database_schema.sql` file to your MySQL/MariaDB database
2. Default admin credentials:
   - Username: `admin`
   - Password: `admin123` (change this immediately!)

### 3. Backend API Setup

1. Edit the `api/index.php` file to include your database credentials:
   ```php
   $host = 'your_host';
   $username = 'your_username';
   $password = 'your_password';
   $database = 'your_database_name';
   ```

2. Make sure your server supports PHP (7.4+ recommended)
3. Set up proper URL rewriting for clean API endpoints

### 4. Frontend Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure the app by editing the following env variables:
   - REACT_APP_API_URL=your_api_url
   - REACT_APP_FACTORY_ADDRESS_ETH=your_eth_contract_address
   - REACT_APP_FACTORY_ADDRESS_BSC=your_bsc_contract_address
   - REACT_APP_FACTORY_ADDRESS_POLYGON=your_polygon_contract_address
   - REACT_APP_FACTORY_ADDRESS_ARBITRUM=your_arbitrum_contract_address

3. Start the development server:
   ```bash
   npm start
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## How to Use

### User Flow

1. Users visit the platform and connect their wallet using the "Connect Wallet" button
2. Navigate to "Submit Project" to submit their token project for review
3. Approved projects will be listed on the platform
4. Users can participate in active IDOs by navigating to the project page and contributing

### Admin Flow

1. Access the admin panel at `/admin`
2. Log in with your admin credentials
3. Review submitted projects from the "Projects" tab
4. Create new IDO pools for approved projects
5. Manage active and completed IDOs

### Smart Contract Interaction

The platform interacts with the smart contracts in the following ways:

1. **Project Creation**:
   - Admin creates a new IDO pool via the admin panel
   - Backend calls the LaunchpadFactory contract to create a new IDOPool contract
   - Token owner approves the IDOPool contract to distribute tokens

2. **User Participation**:
   - User connects wallet and contributes ETH/BNB to the IDOPool contract
   - Contract tracks contribution and calculates token allocation

3. **Token Distribution**:
   - After the IDO ends successfully, users can claim their tokens
   - If the IDO fails to reach soft cap, users can claim refunds

## Security Considerations

1. Always verify contract addresses before interacting
2. Use multi-sig wallets for admin operations
3. Set appropriate minimum/maximum contribution limits
4. Implement KYC/AML if required by your jurisdiction

## Technical Requirements

- Node.js 14+
- PHP 7.4+
- MySQL/MariaDB
- Web3 wallet (MetaMask, Trust Wallet, etc.)
- Modern web browser

## License

This project is licensed under the MIT License.

## Support

For support, contact support@whalespad.com or visit our official Telegram channel.

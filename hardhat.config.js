require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.17",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      {
        version: "0.8.20",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }
    ]
  },
  networks: {
    hardhat: {
      chainId: 1337
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 1337
    },
    sepolia: {
      url: "https://rpc.ankr.com/eth_sepolia/5d12226c7a80061e157c9e97e01c05d3474f925769267c3c4468fd3dd65c056f",
      accounts: ["e4800f809e1dd561c46912176a8f1bc105b8f774f3d8ada6e7aefcbb942e504e"],
      chainId: 11155111,
      gasPrice: 20000000000, // 20 gwei
      gas: 6000000
    },
    bsc_testnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      accounts: ["e4800f809e1dd561c46912176a8f1bc105b8f774f3d8ada6e7aefcbb942e504e"],
      chainId: 97,
      gasPrice: 10000000000, // 10 gwei
      gas: 6000000
    },
    polygon_mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: ["e4800f809e1dd561c46912176a8f1bc105b8f774f3d8ada6e7aefcbb942e504e"],
      chainId: 80001,
      gasPrice: 30000000000, // 30 gwei
      gas: 6000000
    }
  },
  etherscan: {
    apiKey: {
      sepolia: "VVZQW84IDVZ5CR8ZGK7ER1WBVYQH9D8RI1",
      bscTestnet: "your_bscscan_api_key_here",
      polygonMumbai: "your_polygonscan_api_key_here"
    }
  },
  sourcify: {
    enabled: true
  }
};

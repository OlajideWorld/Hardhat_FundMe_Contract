require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("hardhat-gas-reporter");
require("solidity-coverage");
const dotenv = require("dotenv");

dotenv.config();

const sepoliaRpc = process.env.jsonRpcSepolia;
const privateKey = process.env.sepolia_privatekey;
const etherscan_key = process.env.ETHERSCAN_API_KEY;
const coinmarketcpa_Apikey = process.env.COINMARKETCAP_API_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      // how to add your preferred chain to deploy to
      url: sepoliaRpc, // add your RPC
      accounts: [privateKey], // add your private keys
      chainId: 11155111, // chain Id
    },
    localhost: {
      // local server for deploying your contract and test your contract
      url: "http://127.0.0.1:8545/", // add your RPC
      chainId: 31337, // ( same as hardhat for localhost server)
    },
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: etherscan_key,
  },
  gasReporter: {
    // this is to get the gas used by each function
    enabled: true,
    outputFile: "gas-report.txt",
    noColors: true,
    currency: "USD",
    // token: "MATIC",
    coinmarketcap: coinmarketcpa_Apikey, // to get the rate of the gas
    L1Etherscan: etherscan_key, // to get the gas for ETH
  },
};

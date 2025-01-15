require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("@nomicfoundation/hardhat-chai-matchers");
require("hardhat-gas-reporter");
require("solidity-coverage");
const dotenv = require("dotenv");
// require("./tasks/get_accounts.js");

dotenv.config();

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await ethers.getSigners();

  console.log(`account 1 : ${accounts[1]}`);

  // for (const account of accounts) {
  //   console.log(account.address);
  // }
});

const sepoliaRpc = process.env.jsonRpcSepolia;
const amoyRpc = process.env.jsonRpcAmoy;
const sepoliaPrivateKey = process.env.sepolia_privatekey;
const amoyPrivateKey = process.env.amoy_privatekey;

/////////////////////////
const etherscan_key = process.env.ETHERSCAN_API_KEY;
const coinmarketcpa_Apikey = process.env.COINMARKETCAP_API_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  // solidity: "0.8.28",  // if you want to compile with a single type of solidity version
  solidity: {
    // if you want to compile a different versions of solidity
    compilers: [{ version: "0.8.28" }, { version: "0.6.6" }],
  },
  networks: {
    sepolia: {
      // how to add your preferred chain to deploy to
      url: sepoliaRpc, // add your RPC
      accounts: [sepoliaPrivateKey], // add your private keys
      chainId: 11155111, // chain Id
      blockConfirmations: 6, // you can set the number here before it verifies your contract on the network
    },
    amoy: {
      // how to add your preferred chain to deploy to
      url: amoyRpc, // add your RPC
      accounts: [amoyPrivateKey], // add your private keys
      chainId: 80002, // chain Id
      blockConfirmations: 6, // you can set the number here before it verifies your contract on the network
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
  namedAccounts: {
    deployer: {
      default: 0,
    },
    user: {
      default: 1,
    },
  },
};

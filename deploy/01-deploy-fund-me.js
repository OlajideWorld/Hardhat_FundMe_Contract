// import
// main

const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat.config.js");

const verify = require("../utils/verify.js");
const { network } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const chainId = network.config.chainId;

  let ethUsdPriceFeed;

  log("Deploying Fundme Contract_____________________ wait");
  // when we want to use localhost or hardhat, we need to use mocks for contracts that need address for ETH/USD
  // we will deploy a fake ETH/USD contract, so that we can use it for our own testing
  // 1. create a Mock Deployer.js file
  // 2. create a mock contract importing a contract from @chainlink package
  // 3. deploy the mock contract if you are working on the hardhat chain
  // 4. get the address with the get() and use it in the ethUsdPriceFeed if you are using the mock

  if (developmentChains.includes(network.name)) {
    const mockPriceFeedAddress = await deployments.get("MockV3Aggregator");
    ethUsdPriceFeed = mockPriceFeedAddress.address;
  } else {
    // we will use a helper hardhat file to different the different chain and the address to use for it
    ethUsdPriceFeed = networkConfig[chainId]["ethUsdAddress"];
  }

  const args = [ethUsdPriceFeed];

  const fundme = await deploy("Fundme", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 2,
  });

  log("FundMe Contract Deployed _______ 100%");
  log("");
  log("Verifying Contracts now ________ wait");

  if (!developmentChains.includes(network.name)) {
    await verify(fundme.address, args);
    log("")
    log("Verification done _________ 100%")
  }
};

module.exports.tags = ["all", "fundme"];

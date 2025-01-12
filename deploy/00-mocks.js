const { network } = require("hardhat");
const {
  developmentChains,
  DECIMALS,
  INITIAL_ANSWER,
} = require("../helper-hardhat.config.js");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  //   const chainId = network.config.chainId;
  // if(chainId == 31337)

  // OR

  // don't deploy to any chain that has ETH/USD address
  if (developmentChains.includes(network.name)) {
    log("Deploying our Mocks first for Fake ETH/USD practice");

    await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      from: deployer,
      args: [DECIMALS, INITIAL_ANSWER],
      log: true,
    });
    log("Mocks Deployed");
    log("====================================");
  }
};

module.exports.tags = ["all", "mocks"]; // to only deploy this file, you can use the line here for the tags

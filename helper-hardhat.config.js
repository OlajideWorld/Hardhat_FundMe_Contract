const networkConfig = {
  11155111: {
    name: "Sepolia Testchain",
    ethUsdAddress: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
  },

  80002: {
    name: "Amoy Testchain",
    ethUsdAddress: "0xF0d50568e3A7e8259E16663972b11910F89BD8e7",
  },
};

const developmentChains = ["hardhat", "localhost"];
const DECIMALS = 8;
const INITIAL_ANSWER = 300000000000;
module.exports = {
  networkConfig,
  developmentChains,
  DECIMALS,
  INITIAL_ANSWER,
};

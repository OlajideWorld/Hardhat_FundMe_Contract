// Withdraw function

const { getNamedAccounts, ethers } = require("hardhat");

const main = async () => {
  let deployer = (await getNamedAccounts()).deployer;
  const fundme = await ethers.getContract("Fundme", deployer);

  // Withdraw
  const transactionResponse = await fundme.withdraw();
  await transactionResponse.wait(2);

  console.log("Funds Withdrawn successfull....");
};

main();

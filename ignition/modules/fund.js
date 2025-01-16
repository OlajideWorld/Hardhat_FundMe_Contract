// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { getNamedAccounts, ethers } = require("hardhat");

const main = async () => {
  let deployer = (await getNamedAccounts()).deployer;

  const fundme = await ethers.getContract("Fundme", deployer);
  const transactionResponse = await fundme.fund({
    value: ethers.parseEther("0.01"),
  });

  await transactionResponse.wait(2);
  console.log("Funded Successfully....");
};

main();

const { getNamedAccounts, deployments, network, ethers } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat.config.js");
const { assert } = require("chai");

describe("Fundme Contract", async function () {
  let fundme;
  let deployer;
  developmentChains.includes(network.name)
    ? describe.skip()
    : beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer;
        const fundmeContract = await deployments.get("Fundme");
        fundme = await ethers.getContractAt(
          fundmeContract.abi,
          fundmeContract.address
        );
      });

  it("fund", async function () {
    await fundme.fund({ value: ethers.parseEther("0.02") });
    await fundme.withdraw();
    const endingFudmeBalance = await fundme.provider.getBalance(fundme.address);
    // const endingFudmeBalance2 = await ethers.provider.getBalance(
    //   fundme.address
    // );
    assert.equal(endingFudmeBalance.toString(), "0");
  });
});

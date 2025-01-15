const { ethers, deployments, getNamedAccounts } = require("hardhat");
const { expect, assert } = require("chai");

describe("FundMe Contract", async function () {
  let fundme;
  let deployer;
  let mockV3Aggregator;
  const fundValue = ethers.parseEther("1");
  beforeEach(async function () {
    // deploy our contracts
    // using hardhat
    // getting a deployer

    // another way to get deployers
    // const accounts = await ethers.getSigner();
    // const accountOne = accounts(0);

    // Or
    deployer = (await getNamedAccounts()).deployer;
    await deployments.fixture(["all"]);
    fundme = await ethers.getContract("Fundme", deployer); // this will link the contract to the deployer (address)
    mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer); // this will link the contract to the deployer (address)
  });

  describe("contructor", async function () {
    it("sets the aggregator address correctly", async function () {
      const response = await fundme.priceFeed();
      const address = await mockV3Aggregator.address;
      assert.equal(response, address);
    });
  });

  describe("fund function", async function () {
    it("doesn't allow users to fund the contract with an empty value", async function () {
      await expect(fundme.fund()).to.be.revertedWith(
        "You did not pass enough eth"
      );
    });

    it("update the ammount funded", async function () {
      await fundme.fund({ value: fundValue });
      const response = await fundme.funderToAmountFunded(deployer);
      assert.equal(response.toString(), fundValue.toString());
    });

    it("check the funders List", async function () {
      await fundme.fund({ value: fundValue });
      const response = await fundme.fundersList(0);
      assert.equal(response, deployer);
    });
  });

  describe("Withdraw", async function () {
    beforeEach(async function () {
      await fundme.fund({ value: fundValue });
    });

    it("Withdraw Eth from a single funder", async function () {
      // arrange
      const startingBalance = await fundme.provider.getBalance(fundme.address);
      const startingDeployerBalance = fundme.provider.getBalance(deployer);

      //act
      const transactionResponse = await fundme.withdraw();
      const transactionReceipt = await transactionResponse.wait(1);

      // this is  for Ethers@6
      const { gasUsed, gasPrice } = transactionReceipt; // getting the gas cost from the transaction on the javascript debug console
      const gasCost = gasUsed.mul(gasPrice); // using bigNumber way of multiplication

      // this is for Ethere@5
      // const { gasUsed, effectiveGasPrice } = transactionReceipt; // getting the gas cost from the transaction on the javascript debug console
      // const gasCost = gasUsed.mul(gasPrice); // using bigNumber way of multiplication

      const endingFundmeBalance = await fundme.provider.getBalance(
        fundme.address
      );
      const endingDeployerBalance = await fundme.provider.getBalance(deployer);

      // assert
      assert.equal(endingFundmeBalance, 0);
      assert.equal(
        startingBalance.add(startingDeployerBalance).toString(),
        endingDeployerBalance.add(gasCost).toString()
      );
    });

    it("allowss us to withdraw with multiple funders", async function () {
      const accounts = await ethers.getSigner();

      for (let i = 1; i < 6; i++) {
        const fundedAccounts = await fundme.connect(accounts[1]);
        await fundedAccounts.fund({ value: fundValue });
      }
      // arrange
      const startingBalance = await fundme.provider.getBalance(fundme.address);
      const startingDeployerBalance = fundme.provider.getBalance(deployer);

      //act
      const transactionResponse = await fundme.withdraw();
      const transactionReceipt = await transactionResponse.wait(1);

      // this is  for Ethers@6
      const { gasUsed, gasPrice } = transactionReceipt; // getting the gas cost from the transaction on the javascript debug console
      const gasCost = gasUsed.mul(gasPrice); // using bigNumber way of multiplication

      const endingFundmeBalance = await fundme.provider.getBalance(
        fundme.address
      );
      const endingDeployerBalance = await fundme.provider.getBalance(deployer);

      // assert
      assert.equal(endingFundmeBalance, 0);
      assert.equal(
        startingBalance.add(startingDeployerBalance).toString(),
        endingDeployerBalance.add(gasCost).toString()
      );

      await expect(fundme.fundersList(0)).to.be.reverted;

      for (let i = 1; 1 < 6; i++) {
        assert.equal(await fundme.funderToAmountFunded(accounts[1].address), 0);
      }
    });
    it("only owner should withdraw", async function () {
      const accounts = await ethers.getSigner();
      const connectedAccounts = await fundme.connect(accounts[1]);
      await expect(connectedAccounts.withdraw()).to.be.revertedWith(
        "Fundme__UnAuthorized" // using the custom error in your contracts
      );
    });
  });
});

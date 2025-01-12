const { run } = require("hardhat");

// Verifying Contracts Programmatically
const verifyContractAddress = async (contractAddress, args) => {
  console.log("Verifying Contracts .........");

  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });

    console.log("");
    console.log("Verified Successfully");
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already Verified");
    } else {
      console.log(e);
    }
  }
};

module.exports = verifyContractAddress;

require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true
    }
  },
  solidity: {
    compilers: [{
      version: "0.8.17",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
          details: { yul: false }
        },
      },
    }]
  }
};

require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
const Private_key = process.env.Private_key;
const URL = process.env.URL
const etherscanApi = process.env.etherscanApi

module.exports = {
  solidity: "0.8.17",
  networks: {
    goerli: {
      url: URL,
      accounts: [Private_key]
    }
  },
  etherscan: {
    apiKey: etherscanApi
  }
};

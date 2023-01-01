import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
// import "@nomiclabs/hardhat-waffle"

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.17",
  },
  paths: {
    artifacts: "./client/src/artifacts"
  },
  // mocha: {
  //   timeout: 100000000
  // },
};

export default config;

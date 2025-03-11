import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-viem";
import "@nomicfoundation/hardhat-toolbox-viem";
import "@nomicfoundation/hardhat-foundry";
import "@nomicfoundation/hardhat-ethers";
import dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  defaultNetwork: "arb",
  networks: {
    arb: {
      url: process.env.RPC_URL as string,
      accounts: [process.env.PRIVATE_KEY as string],
    },
  },
};

export default config;

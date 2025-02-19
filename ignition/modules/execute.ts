import * as hre from "hardhat";

const FACTORY_NONCE = 1;
const ENTRY_POINT_ADDRESS = "0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0";
const FACTORY_ADDRESS = "0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9";

async function main(){
  const entryPoint = await hre.viem.getContractAt("EntryPoint", ENTRY_POINT_ADDRESS);
  console.log({entryPoint})

  const sender = hre.ethers.getCreateAddress({from: FACTORY_ADDRESS, nonce: FACTORY_NONCE});
  console.log({sender})
    // CREATE: hash(deployer + nonce)
    // CREATE2: hash(0xFF + deployer + bytecode + salt)

    const userOp = {
         sender, // smart account address
         nonce,
         initCode,
         callData,
         callGasLimit: 200_00,
         verificationGasLimit: 200_00,
         preVerificationGas: 500_00,
         maxFeePerGas: hre.ethers.parseUnits("10", "gwei"),
         maxPriorityFeePerGas:hre.ethers.parseUnits("5", "gwei"),
         paymasterAndData: "0x",
         signature: "0x",
    }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1
})
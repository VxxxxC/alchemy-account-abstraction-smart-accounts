import * as hre from "hardhat";

const ENTRY_POINT_ADDRESS = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
const PAYMASTER_ADDRESS = "0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0";

async function main() {
  const entryPoint = await hre.ethers.getContractAt(
    "EntryPoint",
    ENTRY_POINT_ADDRESS
  );
  //* NOTE: By the first time of deploying and creating an smart account, the entryPoint will send 100 ETH to the paymaster
  try {
    await entryPoint.depositTo(PAYMASTER_ADDRESS, {
      value: hre.ethers.parseEther(".05"),
    });

    console.log("deposit successful!");
  } catch (err) {
    console.error("deposit error : ", err);
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

import * as hre from "hardhat";

const ENTRY_POINT_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
const PAYMASTER_ADDRESS = "0x69e87b5a5d7f0ea7ef61b7e32edb9d48012bde42";

async function main() {
  const entryPoint = await hre.ethers.getContractAt(
    "EntryPoint",
    ENTRY_POINT_ADDRESS
  );
  //* NOTE: By the first time of deploying and creating an smart account, the entryPoint will send 100 ETH to the paymaster
  try {
    await entryPoint.depositTo(PAYMASTER_ADDRESS, {
      value: hre.ethers.parseEther(".1"),
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

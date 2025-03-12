import * as hre from "hardhat";

const ACCOUNT_ADDRESS = "0x4a2116712ac237da0143e970f22bf94c3e28edea";
const ENTRY_POINT_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
const PAYMASTER_ADDRESS = "0x69e87b5a5d7f0ea7ef61b7e32edb9d48012bde42";

async function main() {
  const account = await hre.ethers.getContractAt("Account", ACCOUNT_ADDRESS);
  const count = await account.count();
  console.log("count : ", count);

  const balance = await hre.ethers.provider.getBalance(ACCOUNT_ADDRESS);
  console.log("balance : ", balance);

  const entryPoint = await hre.ethers.getContractAt(
    "EntryPoint",
    ENTRY_POINT_ADDRESS
  );
  console.log(
    "Entry Point balance : ",
    await entryPoint.balanceOf(ACCOUNT_ADDRESS)
  );
  console.log(
    "Paymaster balance : ",
    await entryPoint.balanceOf(PAYMASTER_ADDRESS)
  );
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

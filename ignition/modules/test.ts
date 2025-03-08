import * as hre from "hardhat";

const ACCOUNT_ADDRESS = "0xe73bc5BD4763A3307AB5F8F126634b7E12E3dA9b";
const ENTRY_POINT_ADDRESS = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
const PAYMASTER_ADDRESS = "0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0";

async function main(){

  const account = await hre.ethers.getContractAt("Account", ACCOUNT_ADDRESS);
  const count = await account.count();
  console.log("count : ", count );

  const balance = await hre.ethers.provider.getBalance(ACCOUNT_ADDRESS);
  console.log("balance : ", balance );

  const entryPoint = await hre.ethers.getContractAt("EntryPoint", ENTRY_POINT_ADDRESS);
  console.log("Entry Point balance : ", await entryPoint.balanceOf(ACCOUNT_ADDRESS) );
  console.log("Paymaster balance : ", await entryPoint.balanceOf(PAYMASTER_ADDRESS) );

}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1
})
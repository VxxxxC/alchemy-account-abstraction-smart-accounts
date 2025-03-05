import * as hre from "hardhat";

async function main(){

  const entryPoint = await hre.viem.deployContract("EntryPoint");
  console.log("Entry Point deployed at : ", entryPoint.address );

  const accountFactory = await hre.viem.deployContract("AccountFactory");
  console.log("Account Factory deployed at : ", accountFactory.address );

  const paymaster = await hre.viem.deployContract("Paymaster");
  console.log("Entry Point deployed at : ", paymaster.address );
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1
})
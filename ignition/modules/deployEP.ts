import * as hre from "hardhat";

async function main(){
  const entryPoint = await hre.viem.deployContract("EntryPoint");
  console.log("Entry Point deployed at : ", entryPoint.address );
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1
})
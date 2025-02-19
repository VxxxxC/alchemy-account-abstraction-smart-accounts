import * as hre from "hardhat";

async function main(){
  const entryPoint = await hre.viem.deployContract("EntryPoint");
  console.log({entryPoint});
  const address = entryPoint.address
  console.log("contract deployed at : ", address)
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1
})
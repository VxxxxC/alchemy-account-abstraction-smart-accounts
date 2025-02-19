import * as hre from "hardhat";

async function main(){
  const entryPoint = await hre.viem.deployContract("AccountFactory");
  console.log("Account Factory deployed at : ", entryPoint.address );
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1
})
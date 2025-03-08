import * as hre from "hardhat";

const ACCOUNT_ADDRESS = "0xe73bc5BD4763A3307AB5F8F126634b7E12E3dA9b";
async function main(){

  const account = await hre.ethers.getContractAt("Account", ACCOUNT_ADDRESS);
  const count = await account.count();
  console.log("count : ", count );
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1
})
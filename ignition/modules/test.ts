import * as hre from "hardhat";

const ACCOUNT_ADDRESS = "0xeC4cFde48EAdca2bC63E94BB437BbeAcE1371bF3";
async function main(){

  const account = await hre.ethers.getContractAt("Account", ACCOUNT_ADDRESS);
  const count = await account.count();
  console.log("count : ", count );
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1
})
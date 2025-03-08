import * as hre from "hardhat";

async function main(){

    const [signer] = await hre.ethers.getSigners();

    // NOTE: pass the hash sig to Test contract constructor
    const hashMsg = hre.ethers.id("testHashMessage..");
    const toBytes = hre.ethers.getBytes(hashMsg);
    const signature = signer.signMessage(toBytes);

  const test = await hre.ethers.getContractFactory("Test");
  const deploy = await test.deploy(signature);
  const deployed = await deploy.waitForDeployment();
  console.log({deployed})
  console.log("signer address : ", await signer.getAddress())

}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1
})
import * as hre from "hardhat";

const FACTORY_NONCE = 1;
const ENTRY_POINT_ADDRESS = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
const FACTORY_ADDRESS = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512";
const PAYMASTER_ADDRESS = "0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0";

async function main() {
  const [signer, signer1] = await hre.ethers.getSigners();
  const address = await signer.getAddress();
  const entryPoint = await hre.ethers.getContractAt(
    "EntryPoint",
    ENTRY_POINT_ADDRESS
  );

  const sender = hre.ethers.getCreateAddress({
    from: FACTORY_ADDRESS,
    nonce: FACTORY_NONCE,
  });
  console.log({ sender });

  //* NOTE: By the first time of deploying and creating an smart account, the entryPoint will send 100 ETH to the paymaster 
  //  await entryPoint.depositTo(PAYMASTER_ADDRESS, {
  //    value: hre.ethers.parseEther("100"),
  //  });
   

  // CREATE: hash(deployer + nonce)
  // CREATE2: hash(0xFF + deployer + bytecode + salt)

  const AccountFactory = await hre.ethers.getContractFactory("AccountFactory");
  const Account = await hre.ethers.getContractFactory("Account");
  const initCode = 
  "0x";
  // FACTORY_ADDRESS +
  // AccountFactory.interface
  //   .encodeFunctionData("createAccount", [address])
  //   .slice(2);

  const hashMsg = hre.ethers.id("testHashMessage..");
  const toBytes = hre.ethers.getBytes(hashMsg);
  const signature = signer1.signMessage(toBytes);

  const userOp = {
    sender, //* NOTE: SMART ACCOUNT ADDRESS
    nonce: await entryPoint.getNonce(sender, 0),
    initCode,
    callData: Account.interface.encodeFunctionData("execute"),
    callGasLimit: 500_000, //! BUG: IF 200_00 WILL FAIL AS 'FailedOp(0, "AA13 initCode failed or OOG")'
    verificationGasLimit: 500_000, //! BUG: IF 200_00 WILL FAIL AS 'FailedOp(0, "AA13 initCode failed or OOG")'
    preVerificationGas: 1000_000, //! BUG: IF 500_00 WILL FAIL AS 'FailedOp(0, "AA13 initCode failed or OOG")'
    maxFeePerGas: hre.ethers.parseUnits("20", "gwei"),
    maxPriorityFeePerGas: hre.ethers.parseUnits("10", "gwei"),
    paymasterAndData: PAYMASTER_ADDRESS,
    signature,
  };

  const tx = await entryPoint.handleOps([userOp], address);
  const receipt = await tx.wait();
  console.log({ receipt });
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

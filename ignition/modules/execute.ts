import { AddressLike } from "ethers";
import * as hre from "hardhat";

const ENTRY_POINT_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
const FACTORY_ADDRESS = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512";
const PAYMASTER_ADDRESS = "0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0";

async function main() {
  const [signer, signer1] = await hre.ethers.getSigners();
  const address = await signer.getAddress();
  const entryPoint = await hre.ethers.getContractAt(
    "EntryPoint",
    ENTRY_POINT_ADDRESS
  );

  // CREATE: hash(deployer + nonce)
  // CREATE2: hash(0xFF + deployer + bytecode + salt)

  const AccountFactory = await hre.ethers.getContractFactory("AccountFactory");

  let initCode =
    FACTORY_ADDRESS +
    AccountFactory.interface
      .encodeFunctionData("createAccount", [address])
      .slice(2);

  let sender;
  try {
    await entryPoint.getSenderAddress(initCode);
  } catch (err: any) {
    sender = "0x" + err.data.data.slice(-40);
  }

  const code = await hre.ethers.provider.getCode(sender as AddressLike);
  if (code !== "0x") {
    initCode = "0x";
  }

  console.log({ sender });

  const Account = await hre.ethers.getContractFactory("Account");

  const userOp = {
    sender, //* NOTE: SMART ACCOUNT ADDRESS
    nonce: await entryPoint.getNonce(sender, 0),
    initCode,
    callData: Account.interface.encodeFunctionData("execute"),
    paymasterAndData: PAYMASTER_ADDRESS,
    signature:
      "0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c",
  };

  const res = await hre.ethers.provider.send("eth_estimateUserOperationGas", [
    ENTRY_POINT_ADDRESS,
    userOp,
  ]);

  //? TODO: implement by calling from real API data, instead using fake hardcode gas value data
  // callGasLimit: 500_000, //! BUG: IF 200_00 WILL FAIL AS 'FailedOp(0, "AA13 initCode failed or OOG")'
  // verificationGasLimit: 500_000, //! BUG: IF 200_00 WILL FAIL AS 'FailedOp(0, "AA13 initCode failed or OOG")'
  // preVerificationGas: 1000_000, //! BUG: IF 500_00 WILL FAIL AS 'FailedOp(0, "AA13 initCode failed or OOG")'
  // maxFeePerGas: hre.ethers.parseUnits("20", "gwei"),
  // maxPriorityFeePerGas: hre.ethers.parseUnits("10", "gwei"),

  const userOpHash = await entryPoint.getUserOpHash(userOp);
  userOp.signature = await signer.signMessage(hre.ethers.getBytes(userOpHash));
  // userOp.signature = await signer1.signMessage(hre.ethers.getBytes(userOpHash)); //* NOTE: THIS SIGNATURE FROM ANOTHER ACCOUNT , FOR TRYING THE EXPECTED 'FailedOp(0, "AA24 signature error")' ERROR ON EXECUTION

  const tx = await entryPoint.handleOps([userOp], address);
  const receipt = await tx.wait();
  console.log({ receipt });
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

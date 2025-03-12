import { AddressLike, BigNumberish, BytesLike } from "ethers";
import * as hre from "hardhat";

const ENTRY_POINT_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
const FACTORY_ADDRESS = "0x302524f0640b71705672637e42e6eab7a3960859";
const PAYMASTER_ADDRESS = "0x69e87b5a5d7f0ea7ef61b7e32edb9d48012bde42";

interface userOp {
   sender: AddressLike;
   nonce: BytesLike;
   initCode: BytesLike;
   callData: BytesLike;
   callGasLimit?: BigNumberish;
   verificationGasLimit?: BigNumberish;
   preVerificationGas?: BigNumberish;
   maxFeePerGas?: BigNumberish;
   maxPriorityFeePerGas?: BigNumberish;
   paymasterAndData: BytesLike;
   signature: BytesLike;
}

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
    sender = "0x" + err.data.slice(-40) as any;
  }

  const code = await hre.ethers.provider.getCode(sender as AddressLike);
  if (code !== "0x") {
    initCode = "0x";
  }

  console.log({ sender });

  const Account = await hre.ethers.getContractFactory("Account");

  const userOp: userOp = {
    sender, //* NOTE: SMART ACCOUNT ADDRESS
    nonce: "0x" + (await entryPoint.getNonce(sender, 0)).toString(16),
    initCode,
    callData: Account.interface.encodeFunctionData("execute"),
    paymasterAndData: PAYMASTER_ADDRESS,
    signature:
      "0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c",
  };

  //? TODO: implement by calling from real API data, instead using fake hardcode gas value data
  const { callGasLimit, verificationGasLimit, preVerificationGas } = await hre.ethers.provider.send("eth_estimateUserOperationGas", [
    userOp,
    ENTRY_POINT_ADDRESS,
  ]);
  userOp.callGasLimit = callGasLimit;
  userOp.preVerificationGas = preVerificationGas;
  userOp.verificationGasLimit = verificationGasLimit;

  const { maxFeePerGas } = await hre.ethers.provider.getFeeData();
  userOp.maxFeePerGas = "0x" + maxFeePerGas?.toString(16);

  const maxPriorityFeePerGas = await hre.ethers.provider.send("rundler_maxPriorityFeePerGas");
  userOp.maxPriorityFeePerGas = maxPriorityFeePerGas;


  const userOpHash = await entryPoint.getUserOpHash(userOp);
  userOp.signature = await signer.signMessage(hre.ethers.getBytes(userOpHash));
  // userOp.signature = await signer1.signMessage(hre.ethers.getBytes(userOpHash)); //* NOTE: THIS SIGNATURE FROM ANOTHER ACCOUNT , FOR TRYING THE EXPECTED 'FailedOp(0, "AA24 signature error")' ERROR ON EXECUTION

  const opHast = await hre.ethers.provider.send("eth_sendUserOperation", [userOp, ENTRY_POINT_ADDRESS]);
  console.log({opHast});

  setTimeout(async () => {
    const txHash = await hre.ethers.provider.send("eth_getUserOperationByHash", [opHast]);
    console.log({txHash});

  }, 5000)

  // const tx = await entryPoint.handleOps([userOp], address);
  // const receipt = await tx.wait();
  // console.log({ receipt });
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

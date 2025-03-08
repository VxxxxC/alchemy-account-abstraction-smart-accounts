import * as hre from "hardhat";

const FACTORY_NONCE = 1;
const ENTRY_POINT_ADDRESS = "0x7a2088a1bfc9d81c55368ae168c2c02570cb814f";
const FACTORY_ADDRESS = "0x09635f643e140090a9a8dcd712ed6285858cebef";
const PAYMASTER_ADDRESS = "0xc5a5c42992decbae36851359345fe25997f5c42d";

async function main() {
  const [signer] = await hre.ethers.getSigners();
  const address = await signer.getAddress();
  const entryPoint = await hre.ethers.getContractAt(
    "EntryPoint",
    ENTRY_POINT_ADDRESS
  );

  const sender = hre.ethers.getCreateAddress({
    from: FACTORY_ADDRESS,
    nonce: FACTORY_NONCE,
  });

  console.log({sender});

  await entryPoint.depositTo(PAYMASTER_ADDRESS, {
    value: hre.ethers.parseEther("100"),
  });

  // CREATE: hash(deployer + nonce)
  // CREATE2: hash(0xFF + deployer + bytecode + salt)

  const AccountFactory = await hre.ethers.getContractFactory("AccountFactory");
  const Account = await hre.ethers.getContractFactory("Account");
  const initCode =
    FACTORY_ADDRESS +
    AccountFactory.interface
      .encodeFunctionData("createAccount", [address])
      .slice(2);

  const userOp = {
    sender, // smart account address
    nonce: await entryPoint.getNonce(sender, 0),
    initCode,
    callData: Account.interface.encodeFunctionData("execute"),
    callGasLimit: 200_000,
    verificationGasLimit: 200_000,
    preVerificationGas: 500_000,
    maxFeePerGas: hre.ethers.parseUnits("20", "gwei"),
    maxPriorityFeePerGas: hre.ethers.parseUnits("10", "gwei"),
    paymasterAndData: PAYMASTER_ADDRESS,
    signature: "0x",
  };

  const tx = await entryPoint.handleOps([userOp], address);
  const receipt = await tx.wait();
  console.log({ receipt });
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

import * as hre from "hardhat";

const FACTORY_NONCE = 1;
const ENTRY_POINT_ADDRESS = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
const FACTORY_ADDRESS = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512";

async function main() {
    const [signer] = await hre.ethers.getSigners();
    const address = await signer.getAddress();
    const entryPoint = await hre.ethers.getContractAt("EntryPoint", ENTRY_POINT_ADDRESS);

    const sender = hre.ethers.getCreateAddress({ from: FACTORY_ADDRESS, nonce: FACTORY_NONCE });

    // CREATE: hash(deployer + nonce)
    // CREATE2: hash(0xFF + deployer + bytecode + salt)

    const AccountFactory = await hre.ethers.getContractFactory("AccountFactory");
    const Account = await hre.ethers.getContractFactory("Account");
    const initCode = FACTORY_ADDRESS + AccountFactory.interface.encodeFunctionData("createAccount",[address]);

    const userOp = {
        sender, // smart account address
        nonce: await entryPoint.getNonce(sender),
        initCode,
        callData: Account.interface.encodeFunctionData("execute"),
        callGasLimit: 200_00,
        verificationGasLimit: 200_00,
        preVerificationGas: 500_00,
        maxFeePerGas: hre.ethers.parseUnits("10", "gwei"),
        maxPriorityFeePerGas: hre.ethers.parseUnits("5", "gwei"),
        paymasterAndData: "0x",
        signature: "0x",
    }

    console.log({userOp})
}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1
})
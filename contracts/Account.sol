// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@account-abstraction/contracts/core/EntryPoint.sol";
import "@account-abstraction/contracts/interfaces/IAccount.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/Create2.sol";
import "hardhat/console.sol";

contract Account is IAccount {
    uint256 public count;
    address public owner;

    constructor(address _owner) {
        owner = _owner;
    }

    function validateUserOp(
        UserOperation calldata userOp,
        bytes32 userOpHash,
        uint256
    ) external view returns (uint256 validationData) {
        bytes32 message = ECDSA.toEthSignedMessageHash(userOpHash);
        address recovered = ECDSA.recover(message, userOp.signature);

        return owner == recovered ? 0 : 1;
    }

    function execute() external {
        count++;
    }
}

contract AccountFactory {
    function createAccount(address _owner) external returns (address) {
        bytes32 salt = bytes32(uint256(uint160(_owner))); //* NOTE: cast the address to bytes32 , this solution by Alchemy Don.
        bytes memory bytecode = abi.encodePacked(
            type(Account).creationCode,
            abi.encode(_owner)
        );

        address addr = Create2.computeAddress(salt, keccak256(bytecode));
        if (addr.code.length > 0) {
            return addr;
        }

        //* NOTE: amount, salt, bytecode
        return Create2.deploy(0, salt, bytecode);
    }
}

contract Test {
    constructor(bytes memory sig) {}
}

// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@account-abstraction/contracts/core/EntryPoint.sol";
import "@account-abstraction/contracts/interfaces/IAccount.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "hardhat/console.sol";

contract Account is IAccount {
    uint256 public count;
    address public owner;

    constructor(address _owner) {
        owner = _owner;
    }

    function validateUserOp(
        UserOperation calldata,
        bytes32,
        uint256
    ) external pure returns (uint256 validationData) {
        return 0;
    }

    function execute() external {
        count++;
    }
}

contract AccountFactory {
    function createAccount(address _owner) external returns (address) {
        Account acc = new Account(_owner);
        return address(acc);
    }
}

contract Test {
    constructor(bytes memory sig) {
        bytes32 message = ECDSA.toEthSignedMessageHash(
            keccak256("testHashMessage..")
        );
        console.logBytes32(message);
        console.logBytes(sig);

        address recovered = ECDSA.recover(message, sig);
        console.log(recovered);
    }
}

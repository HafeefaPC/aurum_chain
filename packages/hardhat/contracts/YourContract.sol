// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "hardhat/console.sol";

contract GoldLedger {
    struct GoldDetails {
        string weight;
        string purity;
        string description;
        string certificationDetails;
        string certificationDate;
        string mineLocation;
        string parentGoldId;
        uint256 uniqueIdentifier;
    }

    mapping(uint256 => GoldDetails) public goldRegistry;
    uint256 public totalRegistrations;

    event GoldRegistered(uint256 indexed uniqueIdentifier, address indexed registrar);

    function registerGold(
        string memory _weight,
        string memory _purity,
        string memory _description,
        string memory _certificationDetails,
        string memory _certificationDate,
        string memory _mineLocation,
        string memory _parentGoldId
    ) public returns (uint256) {
        totalRegistrations++;
        uint256 uniqueIdentifier = generateUniqueIdentifier();

        goldRegistry[uniqueIdentifier] = GoldDetails({
            weight: _weight,
            purity: _purity,
            description: _description,
            certificationDetails: _certificationDetails,
            certificationDate: _certificationDate,
            mineLocation: _mineLocation,
            parentGoldId: _parentGoldId,
            uniqueIdentifier: uniqueIdentifier
        });

        emit GoldRegistered(uniqueIdentifier, msg.sender);

        return uniqueIdentifier;
    }

    function getGoldDetails(uint256 _uniqueIdentifier) public view returns (GoldDetails memory) {
        require(goldRegistry[_uniqueIdentifier].uniqueIdentifier != 0, "Gold not found");
        return goldRegistry[_uniqueIdentifier];
    }

    function generateUniqueIdentifier() private view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, totalRegistrations))) % 1000000000000;
    }
}

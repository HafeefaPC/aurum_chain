// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GoldLedger {
    struct GoldDetails {
        string weight;
        string purity;
        string description;
        string certificationDetails;
        string certificationDate;
        string mineLocation;
        bytes32 parentGoldId;
    }

    mapping(bytes32 => GoldDetails) private goldRegistry;
    uint256 public totalRegistrations;

    event GoldRegistered(bytes32 indexed uniqueIdentifier, address indexed registrar);

    function registerGold(
        string calldata _weight,
        string calldata _purity,
        string calldata _description
    ) public returns (bytes32) {
        bytes32 uniqueIdentifier = keccak256(abi.encodePacked(block.timestamp, msg.sender, ++totalRegistrations));
        
        goldRegistry[uniqueIdentifier].weight = _weight;
        goldRegistry[uniqueIdentifier].purity = _purity;
        goldRegistry[uniqueIdentifier].description = _description;

        emit GoldRegistered(uniqueIdentifier, msg.sender);  // Make sure this line is present

        return uniqueIdentifier;
    }

    function completeGoldRegistration(
        bytes32 _uniqueIdentifier,
        string calldata _certificationDetails,
        string calldata _certificationDate,
        string calldata _mineLocation,
        bytes32 _parentGoldId
    ) public {
        require(bytes(goldRegistry[_uniqueIdentifier].weight).length > 0, "Gold not found");
        
        goldRegistry[_uniqueIdentifier].certificationDetails = _certificationDetails;
        goldRegistry[_uniqueIdentifier].certificationDate = _certificationDate;
        goldRegistry[_uniqueIdentifier].mineLocation = _mineLocation;
        goldRegistry[_uniqueIdentifier].parentGoldId = _parentGoldId;

        emit GoldRegistered(_uniqueIdentifier, msg.sender);
    }

    function getGoldDetails(bytes32 _uniqueIdentifier) external view returns (GoldDetails memory) {
        require(bytes(goldRegistry[_uniqueIdentifier].weight).length > 0, "Gold not found");
        return goldRegistry[_uniqueIdentifier];
    }
}

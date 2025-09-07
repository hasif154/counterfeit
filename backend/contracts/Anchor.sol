// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Anchor {
    struct BatchAnchor {
        bytes32 merkleRoot;
        string metadataURI;
        address manufacturer;
        uint256 timestamp;
    }
    
    mapping(bytes32 => BatchAnchor) public batches;
    mapping(address => bytes32[]) public manufacturerBatches;
    
    event BatchAnchored(
        bytes32 indexed merkleRoot,
        address indexed manufacturer,
        string metadataURI,
        uint256 timestamp
    );
    
    function anchorBatch(bytes32 merkleRoot, string memory metadataURI) external {
        require(merkleRoot != bytes32(0), "Invalid merkle root");
        require(batches[merkleRoot].timestamp == 0, "Batch already anchored");
        
        batches[merkleRoot] = BatchAnchor({
            merkleRoot: merkleRoot,
            metadataURI: metadataURI,
            manufacturer: msg.sender,
            timestamp: block.timestamp
        });
        
        manufacturerBatches[msg.sender].push(merkleRoot);
        
        emit BatchAnchored(merkleRoot, msg.sender, metadataURI, block.timestamp);
    }
    
    function getBatch(bytes32 merkleRoot) external view returns (
        string memory metadataURI,
        address manufacturer,
        uint256 timestamp
    ) {
        BatchAnchor memory batch = batches[merkleRoot];
        require(batch.timestamp != 0, "Batch not found");
        
        return (batch.metadataURI, batch.manufacturer, batch.timestamp);
    }
    
    function getManufacturerBatches(address manufacturer) external view returns (bytes32[] memory) {
        return manufacturerBatches[manufacturer];
    }
}
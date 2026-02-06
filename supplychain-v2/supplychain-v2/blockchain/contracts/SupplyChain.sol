// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SupplyChain {
    address public admin;
    uint256 public productCounter;
    
    struct Product {
        string destination;
        address recipient;
        address transportDevice;
        uint256 lastValue;
        uint256 lastUpdateTime;
        bool received;
    }
    
    mapping(uint256 => Product) public products;
    mapping(address => bool) public authorizedProducers;
    
    uint256 public timeGap = 20; // seconds
    
    constructor() {
        admin = msg.sender;
    }
    
    // ---------------- ACCESS CONTROL ----------------
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }
    
    modifier onlyProducer() {
        require(authorizedProducers[msg.sender], "Only producer");
        _;
    }
    
    function grantProducer(address producer) external onlyAdmin {
        authorizedProducers[producer] = true;
    }
    
    function revokeProducer(address producer) external onlyAdmin {
        authorizedProducers[producer] = false;
    }
    
    // ---------------- PRODUCT FLOW ----------------
    
    function createProduct(
        string calldata destination,
        address recipient,
        address transportDevice
    ) external onlyProducer returns (uint256) {
        uint256 pid = productCounter;
        products[pid] = Product({
            destination: destination,
            recipient: recipient,
            transportDevice: transportDevice,
            lastValue: 0,
            lastUpdateTime: 0,
            received: false
        });
        productCounter++;
        return pid;
    }
    
    function updateProduct(uint256 productId, uint256 value) external {
        Product storage p = products[productId];
        require(msg.sender == p.transportDevice, "Only transport device");
        require(!p.received, "Product already received");
        require(
            block.timestamp >= p.lastUpdateTime + timeGap,
            "Time gap not satisfied"
        );
        p.lastValue = value;
        p.lastUpdateTime = block.timestamp;
    }
    
    function receiveProduct(uint256 productId) external {
        Product storage p = products[productId];
        require(msg.sender == p.recipient, "Only recipient");
        require(!p.received, "Already received");
        p.received = true;
    }
}

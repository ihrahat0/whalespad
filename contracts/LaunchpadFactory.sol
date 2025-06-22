// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./IDOPool.sol";

/**
 * @title LaunchpadFactory
 * @dev Contract for creating and managing IDO pools
 */
contract LaunchpadFactory {
    // Events
    event PoolCreated(
        address indexed poolAddress,
        address indexed owner,
        address tokenAddress,
        uint256 startTime,
        uint256 endTime
    );

    // Variables
    address public owner;
    address[] public allPools;
    mapping(address => address[]) public userPools;
    mapping(address => bool) public poolExists;
    uint256 public poolCreationFee = 0.1 ether; // Fee for creating a pool
    uint256 public totalPoolsCreated;

    // Constructor
    constructor() {
        owner = msg.sender;
    }

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    /**
     * @dev Creates a new IDO pool
     */
    function createPool(
        address _tokenAddress,
        uint256 _tokenPrice,
        uint256 _hardCap,
        uint256 _softCap,
        uint256 _minContribution,
        uint256 _maxContribution,
        uint256 _startTime,
        uint256 _endTime,
        uint8 _liquidityPercentage,
        uint256 _liquidityLockTime
    ) external payable returns (address) {
        require(msg.value >= poolCreationFee, "Insufficient fee");
        require(_tokenAddress != address(0), "Invalid token");
        require(_startTime > block.timestamp, "Invalid start time");
        require(_endTime > _startTime, "Invalid end time");
        require(_hardCap > _softCap, "Hard cap must be > soft cap");
        require(_liquidityPercentage >= 51 && _liquidityPercentage <= 100, "Invalid liquidity percentage");
        
        // Deploy new IDOPool contract
        IDOPool newPool = new IDOPool(
            msg.sender,
            _tokenAddress,
            _tokenPrice,
            _hardCap,
            _softCap,
            _minContribution,
            _maxContribution,
            _startTime,
            _endTime,
            _liquidityPercentage,
            _liquidityLockTime
        );
        
        address poolAddress = address(newPool);
        
        // Track the pool
        allPools.push(poolAddress);
        userPools[msg.sender].push(poolAddress);
        poolExists[poolAddress] = true;
        totalPoolsCreated++;
        
        emit PoolCreated(
            poolAddress,
            msg.sender,
            _tokenAddress,
            _startTime,
            _endTime
        );
        
        return poolAddress;
    }
    
    /**
     * @dev Sets the fee for creating pools
     */
    function setPoolCreationFee(uint256 _newFee) external onlyOwner {
        poolCreationFee = _newFee;
    }
    
    /**
     * @dev Withdraws fees collected
     */
    function withdrawFees(address payable _to) external onlyOwner {
        require(_to != address(0), "Invalid address");
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        _to.transfer(balance);
    }
    
    /**
     * @dev Get all pools created
     */
    function getAllPools() external view returns (address[] memory) {
        return allPools;
    }
    
    /**
     * @dev Get pools created by a user
     */
    function getUserPools(address _user) external view returns (address[] memory) {
        return userPools[_user];
    }
    
    /**
     * @dev Check if pool exists
     */
    function isValidPool(address _pool) external view returns (bool) {
        return poolExists[_pool];
    }
    
    /**
     * @dev Get pool creation fee
     */
    function getPoolCreationFee() external view returns (uint256) {
        return poolCreationFee;
    }
} 
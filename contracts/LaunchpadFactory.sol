// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

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
    uint256 public poolsFee = 0.5 ether; // Fee for creating a pool

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
     * @param _tokenAddress Address of the token being sold
     * @param _tokenPrice Price of the token in ETH/BNB
     * @param _hardCap Maximum amount to raise
     * @param _softCap Minimum amount to raise
     * @param _minContribution Minimum contribution per user
     * @param _maxContribution Maximum contribution per user
     * @param _startTime IDO start timestamp
     * @param _endTime IDO end timestamp
     * @param _liquidityPercentage Percentage of raised funds for liquidity
     * @param _liquidityLockTime Duration for locking liquidity in days
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
    ) external payable {
        require(msg.value >= poolsFee, "Fee not paid");
        require(_tokenAddress != address(0), "Invalid token");
        require(_startTime > block.timestamp, "Invalid start time");
        require(_endTime > _startTime, "Invalid end time");
        require(_hardCap > _softCap, "Hard cap must be > soft cap");
        require(_liquidityPercentage >= 60, "Liquidity must be >= 60%");
        
        // Create new pool - implementation would deploy a new IDOPool contract
        address poolAddress = address(0); // Replace with actual deployment
        
        // Track the pool
        allPools.push(poolAddress);
        userPools[msg.sender].push(poolAddress);
        
        emit PoolCreated(
            poolAddress,
            msg.sender,
            _tokenAddress,
            _startTime,
            _endTime
        );
    }
    
    /**
     * @dev Sets the fee for creating pools
     * @param _newFee New fee amount in ETH/BNB
     */
    function setPoolsFee(uint256 _newFee) external onlyOwner {
        poolsFee = _newFee;
    }
    
    /**
     * @dev Withdraws fees collected
     * @param _to Address to send fees to
     */
    function withdrawFees(address payable _to) external onlyOwner {
        require(_to != address(0), "Invalid address");
        _to.transfer(address(this).balance);
    }
    
    /**
     * @dev Get all pools created
     */
    function getAllPools() external view returns (address[] memory) {
        return allPools;
    }
    
    /**
     * @dev Get pools created by a user
     * @param _user User address
     */
    function getUserPools(address _user) external view returns (address[] memory) {
        return userPools[_user];
    }
} 
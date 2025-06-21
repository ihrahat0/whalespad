// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title IERC20
 * @dev Interface for ERC20 token standard
 */
interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

/**
 * @title IDOPool
 * @dev Contract for running token IDO (Initial DEX Offering)
 */
contract IDOPool {
    enum PoolStatus { Pending, Active, Completed, Cancelled, Failed }
    
    // Events
    event Contributed(address indexed user, uint256 amount);
    event TokensClaimed(address indexed user, uint256 amount);
    event PoolStatusChanged(PoolStatus status);
    
    // Variables
    address public factory;
    address public owner;
    IERC20 public token;
    uint256 public tokenPrice; // price of 1 token in ETH/BNB (wei)
    uint256 public hardCap;
    uint256 public softCap;
    uint256 public minContribution;
    uint256 public maxContribution;
    uint256 public startTime;
    uint256 public endTime;
    uint8 public liquidityPercentage;
    uint256 public liquidityLockTime;
    PoolStatus public status;
    
    uint256 public totalRaised;
    uint256 public totalTokensSold;
    mapping(address => uint256) public contributions;
    mapping(address => bool) public hasClaimedTokens;
    
    // Constructor
    constructor(
        address _owner,
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
    ) {
        factory = msg.sender;
        owner = _owner;
        token = IERC20(_tokenAddress);
        tokenPrice = _tokenPrice;
        hardCap = _hardCap;
        softCap = _softCap;
        minContribution = _minContribution;
        maxContribution = _maxContribution;
        startTime = _startTime;
        endTime = _endTime;
        liquidityPercentage = _liquidityPercentage;
        liquidityLockTime = _liquidityLockTime;
        status = PoolStatus.Pending;
    }
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }
    
    modifier onlyFactoryOrOwner() {
        require(msg.sender == factory || msg.sender == owner, "Not authorized");
        _;
    }
    
    modifier poolActive() {
        require(block.timestamp >= startTime && block.timestamp <= endTime, "Pool not active");
        require(status == PoolStatus.Active, "Pool not in active status");
        _;
    }
    
    /**
     * @dev Start the pool if in pending status
     */
    function startPool() external onlyOwner {
        require(status == PoolStatus.Pending, "Pool not pending");
        require(block.timestamp >= startTime, "Start time not reached");
        
        status = PoolStatus.Active;
        emit PoolStatusChanged(PoolStatus.Active);
    }
    
    /**
     * @dev Contribute ETH/BNB to the pool
     */
    function contribute() external payable poolActive {
        require(msg.value >= minContribution, "Below min contribution");
        require(contributions[msg.sender] + msg.value <= maxContribution, "Exceeds max contribution");
        require(totalRaised + msg.value <= hardCap, "Hard cap reached");
        
        contributions[msg.sender] += msg.value;
        totalRaised += msg.value;
        
        // Calculate tokens to distribute
        uint256 tokenAmount = (msg.value * 10**18) / tokenPrice;
        totalTokensSold += tokenAmount;
        
        emit Contributed(msg.sender, msg.value);
    }
    
    /**
     * @dev Claim tokens after pool ends if successful
     */
    function claimTokens() external {
        require(status == PoolStatus.Completed, "Pool not completed");
        require(contributions[msg.sender] > 0, "No contribution");
        require(!hasClaimedTokens[msg.sender], "Already claimed");
        
        uint256 tokenAmount = (contributions[msg.sender] * 10**18) / tokenPrice;
        hasClaimedTokens[msg.sender] = true;
        
        token.transfer(msg.sender, tokenAmount);
        
        emit TokensClaimed(msg.sender, tokenAmount);
    }
    
    /**
     * @dev Finish the pool after end time
     */
    function finishPool() external onlyFactoryOrOwner {
        require(block.timestamp > endTime || totalRaised >= hardCap, "Pool still active");
        
        if (totalRaised >= softCap) {
            // Success - transfer funds to owner minus liquidity portion
            status = PoolStatus.Completed;
            
            // In a real implementation, this would lock liquidity on a DEX
            uint256 liquidityAmount = (totalRaised * liquidityPercentage) / 100;
            uint256 ownerAmount = totalRaised - liquidityAmount;
            
            payable(owner).transfer(ownerAmount);
        } else {
            // Failed - allow refunds
            status = PoolStatus.Failed;
        }
        
        emit PoolStatusChanged(status);
    }
    
    /**
     * @dev Claim refund if pool failed
     */
    function claimRefund() external {
        require(status == PoolStatus.Failed, "Pool not failed");
        require(contributions[msg.sender] > 0, "No contribution");
        
        uint256 refundAmount = contributions[msg.sender];
        contributions[msg.sender] = 0;
        
        payable(msg.sender).transfer(refundAmount);
    }
    
    /**
     * @dev Cancel pool if still pending
     */
    function cancelPool() external onlyFactoryOrOwner {
        require(status == PoolStatus.Pending || status == PoolStatus.Active, "Cannot cancel");
        
        status = PoolStatus.Cancelled;
        emit PoolStatusChanged(PoolStatus.Cancelled);
    }
    
    /**
     * @dev Get token price
     */
    function getTokenPrice() external view returns (uint256) {
        return tokenPrice;
    }
    
    /**
     * @dev Get user contribution
     */
    function getUserContribution(address _user) external view returns (uint256) {
        return contributions[_user];
    }
} 
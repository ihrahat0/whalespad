// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SimplePresale is Ownable {
    IERC20 public presaleToken;
    uint256 public rate; // How many presale tokens per unit of native currency (e.g., 1 ETH = X presaleTokens)

    event TokensPurchased(address indexed buyer, uint256 amountNative, uint256 tokensReceived);
    event FundsWithdrawn(address indexed owner, uint256 nativeAmount);
    event TokensWithdrawn(address indexed owner, uint256 tokenAmount);
    event PresaleTokenSet(address indexed tokenAddress);
    event RateSet(uint256 newRate);

    constructor(address _presaleTokenAddress, uint256 _rate, address initialOwner) Ownable(initialOwner) {
        require(_presaleTokenAddress != address(0), "Invalid presale token address");
        require(_rate > 0, "Rate must be greater than 0");
        presaleToken = IERC20(_presaleTokenAddress);
        rate = _rate;
    }

    // --- Owner Functions ---

    function setPresaleToken(address _presaleTokenAddress) public onlyOwner {
        require(_presaleTokenAddress != address(0), "Invalid presale token address");
        presaleToken = IERC20(_presaleTokenAddress);
        emit PresaleTokenSet(_presaleTokenAddress);
    }

    function setRate(uint256 _newRate) public onlyOwner {
        require(_newRate > 0, "Rate must be greater than 0");
        rate = _newRate;
        emit RateSet(_newRate);
    }

    // Withdraw native currency sent to the contract
    function withdrawNativeFunds() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No native funds to withdraw");
        payable(owner()).transfer(balance);
        emit FundsWithdrawn(owner(), balance);
    }

    // Withdraw any remaining presale tokens from the contract
    function withdrawPresaleTokens() public onlyOwner {
        uint256 tokenBalance = presaleToken.balanceOf(address(this));
        require(tokenBalance > 0, "No presale tokens to withdraw");
        presaleToken.transfer(owner(), tokenBalance);
        emit TokensWithdrawn(owner(), tokenBalance);
    }

    // --- User Functions ---

    // Function to buy presale tokens with native currency (ETH/BNB)
    receive() external payable {
        buyTokensWithNative();
    }

    function buyTokensWithNative() public payable {
        require(msg.value > 0, "Must send native currency");
        // The rate is set in the constructor, so no need to check here again assuming it's > 0

        uint256 tokensToReceive = msg.value * rate;
        require(presaleToken.balanceOf(address(this)) >= tokensToReceive, "Not enough presale tokens in contract");

        presaleToken.transfer(msg.sender, tokensToReceive);
        emit TokensPurchased(msg.sender, msg.value, tokensToReceive);
    }
} 
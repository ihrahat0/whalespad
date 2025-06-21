const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TaxableToken", function () {
  let token;
  let owner;
  let addr1;
  let addr2;
  let dexPair;
  let dexPair2;
  
  const TOKEN_NAME = "Test Token";
  const TOKEN_SYMBOL = "TEST";
  const TOTAL_SUPPLY = ethers.parseEther("1000000000"); // 1 billion tokens
  const TAX_RATE = 200; // 2%
  const BASIS_POINTS = 10000;
  
  beforeEach(async function () {
    // Get signers
    [owner, addr1, addr2, dexPair, dexPair2] = await ethers.getSigners();
    
    // Deploy token
    const TaxableToken = await ethers.getContractFactory("TaxableToken");
    token = await TaxableToken.deploy(TOKEN_NAME, TOKEN_SYMBOL, TOTAL_SUPPLY);
    await token.waitForDeployment();
  });
  
  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await token.owner()).to.equal(owner.address);
    });
    
    it("Should assign the total supply to the owner", async function () {
      expect(await token.balanceOf(owner.address)).to.equal(TOTAL_SUPPLY);
    });
    
    it("Should have correct name and symbol", async function () {
      expect(await token.name()).to.equal(TOKEN_NAME);
      expect(await token.symbol()).to.equal(TOKEN_SYMBOL);
    });
    
    it("Should exclude owner and contract from tax", async function () {
      expect(await token.isExcludedFromTax(owner.address)).to.be.true;
      expect(await token.isExcludedFromTax(await token.getAddress())).to.be.true;
    });
  });
  
  describe("DEX Pair Management", function () {
    it("Should allow owner to set DEX pair", async function () {
      await token.setDexPair(dexPair.address, true);
      expect(await token.isDexPair(dexPair.address)).to.be.true;
    });
    
    it("Should allow owner to remove DEX pair", async function () {
      await token.setDexPair(dexPair.address, true);
      await token.setDexPair(dexPair.address, false);
      expect(await token.isDexPair(dexPair.address)).to.be.false;
    });
    
    it("Should not allow non-owner to set DEX pair", async function () {
      await expect(
        token.connect(addr1).setDexPair(dexPair.address, true)
      ).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
    });
    
    it("Should set multiple DEX pairs in batch", async function () {
      await token.setMultipleDexPairs([dexPair.address, dexPair2.address], true);
      expect(await token.isDexPair(dexPair.address)).to.be.true;
      expect(await token.isDexPair(dexPair2.address)).to.be.true;
    });
  });
  
  describe("Tax Exclusion", function () {
    it("Should allow owner to exclude address from tax", async function () {
      await token.setExcludedFromTax(addr1.address, true);
      expect(await token.isExcludedFromTax(addr1.address)).to.be.true;
    });
    
    it("Should allow owner to remove tax exclusion", async function () {
      await token.setExcludedFromTax(addr1.address, true);
      await token.setExcludedFromTax(addr1.address, false);
      expect(await token.isExcludedFromTax(addr1.address)).to.be.false;
    });
    
    it("Should not allow non-owner to set tax exclusion", async function () {
      await expect(
        token.connect(addr1).setExcludedFromTax(addr2.address, true)
      ).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
    });
  });
  
  describe("Regular Transfers (No Tax)", function () {
    beforeEach(async function () {
      // Transfer some tokens to addr1
      await token.transfer(addr1.address, ethers.parseEther("1000"));
    });
    
    it("Should transfer without tax between regular wallets", async function () {
      const amount = ethers.parseEther("100");
      await token.connect(addr1).transfer(addr2.address, amount);
      
      expect(await token.balanceOf(addr2.address)).to.equal(amount);
    });
    
    it("Should not collect tax on regular transfers", async function () {
      const ownerBalanceBefore = await token.balanceOf(owner.address);
      const amount = ethers.parseEther("100");
      
      await token.connect(addr1).transfer(addr2.address, amount);
      
      // Owner balance should not increase (no tax collected)
      expect(await token.balanceOf(owner.address)).to.equal(ownerBalanceBefore);
    });
  });
  
  describe("DEX Trades (With Tax)", function () {
    beforeEach(async function () {
      // Set up DEX pair
      await token.setDexPair(dexPair.address, true);
      
      // Transfer tokens to addr1 and DEX pair
      await token.transfer(addr1.address, ethers.parseEther("10000"));
      await token.transfer(dexPair.address, ethers.parseEther("100000"));
    });
    
    it("Should apply 2% tax when buying from DEX", async function () {
      const amount = ethers.parseEther("1000");
      const expectedTax = amount * BigInt(TAX_RATE) / BigInt(BASIS_POINTS);
      const expectedReceived = amount - expectedTax;
      
      const ownerBalanceBefore = await token.balanceOf(owner.address);
      
      // Simulate DEX selling to user (buy)
      await token.connect(dexPair).transfer(addr2.address, amount);
      
      expect(await token.balanceOf(addr2.address)).to.equal(expectedReceived);
      expect(await token.balanceOf(owner.address)).to.equal(ownerBalanceBefore + expectedTax);
    });
    
    it("Should apply 2% tax when selling to DEX", async function () {
      const amount = ethers.parseEther("1000");
      const expectedTax = amount * BigInt(TAX_RATE) / BigInt(BASIS_POINTS);
      const expectedReceived = amount - expectedTax;
      
      const ownerBalanceBefore = await token.balanceOf(owner.address);
      
      // User selling to DEX (sell)
      await token.connect(addr1).transfer(dexPair.address, amount);
      
      expect(await token.balanceOf(dexPair.address)).to.equal(
        ethers.parseEther("100000") + expectedReceived
      );
      expect(await token.balanceOf(owner.address)).to.equal(ownerBalanceBefore + expectedTax);
    });
    
    it("Should emit TaxCollected event", async function () {
      const amount = ethers.parseEther("1000");
      const expectedTax = amount * BigInt(TAX_RATE) / BigInt(BASIS_POINTS);
      
      await expect(token.connect(dexPair).transfer(addr2.address, amount))
        .to.emit(token, "TaxCollected")
        .withArgs(dexPair.address, addr2.address, expectedTax);
    });
  });
  
  describe("Tax Exemption", function () {
    beforeEach(async function () {
      await token.setDexPair(dexPair.address, true);
      await token.transfer(dexPair.address, ethers.parseEther("100000"));
    });
    
    it("Should not tax excluded addresses when buying from DEX", async function () {
      await token.setExcludedFromTax(addr1.address, true);
      
      const amount = ethers.parseEther("1000");
      await token.connect(dexPair).transfer(addr1.address, amount);
      
      // Should receive full amount (no tax)
      expect(await token.balanceOf(addr1.address)).to.equal(amount);
    });
    
    it("Should not tax when excluded address sells to DEX", async function () {
      await token.transfer(addr1.address, ethers.parseEther("10000"));
      await token.setExcludedFromTax(addr1.address, true);
      
      const amount = ethers.parseEther("1000");
      const dexBalanceBefore = await token.balanceOf(dexPair.address);
      
      await token.connect(addr1).transfer(dexPair.address, amount);
      
      // DEX should receive full amount (no tax)
      expect(await token.balanceOf(dexPair.address)).to.equal(dexBalanceBefore + amount);
    });
  });
  
  describe("Tax Calculation", function () {
    it("Should calculate tax correctly", async function () {
      const amount = ethers.parseEther("1000");
      const expectedTax = ethers.parseEther("20"); // 2% of 1000
      
      expect(await token.calculateTax(amount)).to.equal(expectedTax);
    });
    
    it("Should calculate amount after tax correctly", async function () {
      const amount = ethers.parseEther("1000");
      const expectedAfterTax = ethers.parseEther("980"); // 1000 - 20
      
      expect(await token.getAmountAfterTax(amount)).to.equal(expectedAfterTax);
    });
  });
  
  describe("Token Recovery", function () {
    it("Should allow owner to recover ETH", async function () {
      // Send ETH to contract
      const ethAmount = ethers.parseEther("1");
      await owner.sendTransaction({
        to: await token.getAddress(),
        value: ethAmount
      });
      
      const ownerBalanceBefore = await ethers.provider.getBalance(owner.address);
      
      // Recover ETH
      await token.recoverToken(ethers.ZeroAddress, ethAmount);
      
      const ownerBalanceAfter = await ethers.provider.getBalance(owner.address);
      expect(ownerBalanceAfter).to.be.gt(ownerBalanceBefore);
    });
    
    it("Should allow owner to recover ERC20 tokens", async function () {
      // Deploy another token
      const OtherToken = await ethers.getContractFactory("TaxableToken");
      const otherToken = await OtherToken.deploy("Other", "OTHER", ethers.parseEther("1000"));
      await otherToken.waitForDeployment();
      
      // Send some tokens to our contract
      const amount = ethers.parseEther("100");
      await otherToken.transfer(await token.getAddress(), amount);
      
      // Recover tokens
      await token.recoverToken(await otherToken.getAddress(), amount);
      
      expect(await otherToken.balanceOf(owner.address)).to.equal(
        ethers.parseEther("1000") // All tokens back to owner
      );
    });
    
    it("Should not allow non-owner to recover tokens", async function () {
      await expect(
        token.connect(addr1).recoverToken(ethers.ZeroAddress, ethers.parseEther("1"))
      ).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
    });
  });
  
  describe("Edge Cases", function () {
    it("Should handle zero amount transfers", async function () {
      await token.setDexPair(dexPair.address, true);
      await token.transfer(dexPair.address, ethers.parseEther("1000"));
      
      // Transfer zero amount
      await expect(
        token.connect(dexPair).transfer(addr1.address, 0)
      ).to.not.be.reverted;
      
      expect(await token.balanceOf(addr1.address)).to.equal(0);
    });
    
    it("Should not allow setting zero address as DEX pair", async function () {
      await expect(
        token.setDexPair(ethers.ZeroAddress, true)
      ).to.be.revertedWith("Invalid pair address");
    });
    
    it("Should not allow excluding zero address from tax", async function () {
      await expect(
        token.setExcludedFromTax(ethers.ZeroAddress, true)
      ).to.be.revertedWith("Invalid account address");
    });
  });
}); 
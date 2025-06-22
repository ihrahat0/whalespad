const hre = require("hardhat");

async function main() {
  console.log("Starting deployment...");

  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address)));

  // Deploy LaunchpadFactory
  console.log("Deploying LaunchpadFactory...");
  const LaunchpadFactory = await hre.ethers.getContractFactory("LaunchpadFactory");
  const launchpadFactory = await LaunchpadFactory.deploy();
  
  await launchpadFactory.waitForDeployment();
  console.log("LaunchpadFactory deployed to:", await launchpadFactory.getAddress());

  // Save deployment addresses
  const deploymentInfo = {
    network: hre.network.name,
    chainId: (await hre.ethers.provider.getNetwork()).chainId,
    deployer: deployer.address,
    contracts: {
      LaunchpadFactory: await launchpadFactory.getAddress()
    },
    timestamp: new Date().toISOString()
  };

  console.log("Deployment completed!");
  console.log("Deployment info:", JSON.stringify(deploymentInfo, null, 2));

  // Verify contracts on testnet/mainnet
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("Waiting for block confirmations...");
    await launchpadFactory.deploymentTransaction().wait(6);
    
    console.log("Verifying contract...");
    try {
      await hre.run("verify:verify", {
        address: await launchpadFactory.getAddress(),
        constructorArguments: []
      });
    } catch (error) {
      console.log("Verification failed:", error.message);
    }
  }
  
  return deploymentInfo;
}

main()
  .then((deploymentInfo) => {
    console.log("\n🎉 Deployment successful!");
    console.log(`📝 LaunchpadFactory address: ${deploymentInfo.contracts.LaunchpadFactory}`);
    console.log(`🌐 Network: ${deploymentInfo.network}`);
    console.log(`⛽ Chain ID: ${deploymentInfo.chainId}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 
const hre = require("hardhat");

async function main() {
  console.log("========================================");
  console.log("  Deploying SupplyChain");
  console.log("========================================\n");

  const SupplyChain = await hre.ethers.getContractFactory("SupplyChain");
  const supplyChain = await SupplyChain.deploy();
  await supplyChain.waitForDeployment();
  
  const address = await supplyChain.getAddress();
  
  console.log("✅ SupplyChain deployed to:", address);
  console.log();
  console.log("Next: Run setup script");
  console.log("npm run setup");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

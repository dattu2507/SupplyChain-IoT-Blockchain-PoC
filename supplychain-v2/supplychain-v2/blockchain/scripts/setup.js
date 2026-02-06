const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("========================================");
  console.log("  Complete Setup");
  console.log("========================================\n");

  // Get accounts
  const [admin, producer, iotDevice, recipient] = await hre.ethers.getSigners();
  
  console.log("Accounts:");
  console.log("  Admin:      ", admin.address);
  console.log("  Producer:   ", producer.address);
  console.log("  IoT Device: ", iotDevice.address);
  console.log("  Recipient:  ", recipient.address);
  console.log();

  // Deploy
  console.log("Deploying contract...");
  const SupplyChain = await hre.ethers.getContractFactory("SupplyChain");
  const supplyChain = await SupplyChain.deploy();
  await supplyChain.waitForDeployment();
  const contractAddress = await supplyChain.getAddress();
  console.log("✅ Deployed to:", contractAddress);
  console.log();

  // Grant producer
  console.log("Granting producer...");
  await supplyChain.grantProducer(producer.address);
  console.log("✅ Producer granted");
  console.log();

  // Create product
  console.log("Creating product...");
  await supplyChain.connect(producer).createProduct(
    "Mumbai, India",
    recipient.address,
    iotDevice.address
  );
  console.log("✅ Product created (ID: 0)");
  console.log();

  // Save config
  const config = {
    contractAddress: contractAddress,
    iotDeviceAddress: iotDevice.address,
    iotDevicePrivateKey: "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a",
    productId: 0
  };

  fs.writeFileSync(
    path.join(__dirname, "..", "config.json"),
    JSON.stringify(config, null, 2)
  );
  console.log("✅ Config saved to blockchain/config.json");
  console.log();

  console.log("========================================");
  console.log("  Setup Complete!");
  console.log("========================================");
  console.log();
  console.log("Contract:", contractAddress);
  console.log("IoT Device:", iotDevice.address);
  console.log("Product ID: 0");
  console.log();
  console.log("Next steps:");
  console.log("1. Update frontend (will be auto-generated)");
  console.log("2. Run IoT simulator");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

const hre = require("hardhat");

async function main() {
  console.log("🔨 Desplegando PropertyAuction...");
  
  const PropertyAuction = await hre.ethers.getContractFactory("PropertyAuction");
  const propertyAuction = await PropertyAuction.deploy();
  await propertyAuction.waitForDeployment();
  
  const contractAddress = await propertyAuction.getAddress();
  
  console.log("✅ PropertyAuction desplegado!");
  console.log("📍 Dirección del contrato:", contractAddress);
  console.log("🔗 Explorer: https://sepolia.basescan.org/address/" + contractAddress);
  
  return contractAddress;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });

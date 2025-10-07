const hre = require("hardhat");

async function main() {
  console.log("🏢 Desplegando PropertyManagement...");
  
  const PropertyManagement = await hre.ethers.getContractFactory("PropertyManagement");
  const propertyManagement = await PropertyManagement.deploy();
  await propertyManagement.waitForDeployment();
  
  const contractAddress = await propertyManagement.getAddress();
  
  console.log("✅ PropertyManagement desplegado!");
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

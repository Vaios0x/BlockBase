const hre = require("hardhat");

async function main() {
  console.log("🏠 Desplegando PropertyRental...");
  
  const PropertyRental = await hre.ethers.getContractFactory("PropertyRental");
  const propertyRental = await PropertyRental.deploy();
  await propertyRental.waitForDeployment();
  
  const contractAddress = await propertyRental.getAddress();
  
  console.log("✅ PropertyRental desplegado!");
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

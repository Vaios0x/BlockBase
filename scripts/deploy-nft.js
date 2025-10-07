const hre = require("hardhat");

async function main() {
  console.log("🎨 Desplegando PropertyNFT...");
  
  const PropertyNFT = await hre.ethers.getContractFactory("PropertyNFT");
  const propertyNFT = await PropertyNFT.deploy();
  await propertyNFT.waitForDeployment();
  
  const contractAddress = await propertyNFT.getAddress();
  
  console.log("✅ PropertyNFT desplegado!");
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

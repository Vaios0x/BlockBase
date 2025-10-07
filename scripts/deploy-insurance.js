const hre = require("hardhat");

async function main() {
  console.log("🛡️ Desplegando PropertyInsurance...");
  
  const PropertyInsurance = await hre.ethers.getContractFactory("PropertyInsurance");
  const propertyInsurance = await PropertyInsurance.deploy();
  await propertyInsurance.waitForDeployment();
  
  const contractAddress = await propertyInsurance.getAddress();
  
  console.log("✅ PropertyInsurance desplegado!");
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

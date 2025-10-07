const hre = require("hardhat");

async function main() {
  console.log("🔒 Desplegando EscrowService...");
  
  const EscrowService = await hre.ethers.getContractFactory("EscrowService");
  const escrowService = await EscrowService.deploy();
  await escrowService.waitForDeployment();
  
  const contractAddress = await escrowService.getAddress();
  
  console.log("✅ EscrowService desplegado!");
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

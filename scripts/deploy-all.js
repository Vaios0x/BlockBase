const hre = require("hardhat");

async function main() {
  console.log("🚀 Iniciando despliegue de todos los contratos del marketplace...");
  
  const contracts = [
    { name: "PropertyRental", file: "deploy-rental.js" },
    { name: "PropertyNFT", file: "deploy-nft.js" },
    { name: "EscrowService", file: "deploy-escrow.js" },
    { name: "PropertyAuction", file: "deploy-auction.js" },
    { name: "PropertyInsurance", file: "deploy-insurance.js" },
    { name: "PropertyManagement", file: "deploy-management.js" }
  ];

  const deployedContracts = {};

  for (const contract of contracts) {
    try {
      console.log(`\n📦 Desplegando ${contract.name}...`);
      const { exec } = require('child_process');
      const { promisify } = require('util');
      const execAsync = promisify(exec);
      
      const { stdout } = await execAsync(`pnpm hardhat run scripts/${contract.file} --network baseSepolia`);
      console.log(`✅ ${contract.name} desplegado exitosamente!`);
      
      // Extraer dirección del contrato del output
      const addressMatch = stdout.match(/Dirección del contrato: (0x[a-fA-F0-9]{40})/);
      if (addressMatch) {
        deployedContracts[contract.name] = addressMatch[1];
      }
    } catch (error) {
      console.error(`❌ Error desplegando ${contract.name}:`, error.message);
    }
  }

  console.log("\n🎉 Resumen del despliegue:");
  console.log("=".repeat(50));
  for (const [name, address] of Object.entries(deployedContracts)) {
    console.log(`${name}: ${address}`);
    console.log(`Explorer: https://sepolia.basescan.org/address/${address}`);
  }
  
  console.log("\n🌐 Red: Base Sepolia");
  console.log("🔗 Explorer: https://sepolia.basescan.org/");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error durante el despliegue:", error);
    process.exit(1);
  });

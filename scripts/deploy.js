const hre = require("hardhat");

async function main() {
  console.log("🚀 Iniciando despliegue del contrato PropertyRental...");
  
  // Obtener el contrato
  const PropertyRental = await hre.ethers.getContractFactory("PropertyRental");
  
  // Desplegar el contrato
  const propertyRental = await PropertyRental.deploy();
  
  // Esperar a que se confirme el despliegue
  await propertyRental.waitForDeployment();
  
  const contractAddress = await propertyRental.getAddress();
  
  console.log("✅ Contrato desplegado exitosamente!");
  console.log("📍 Dirección del contrato:", contractAddress);
  console.log("🌐 Red: Base Sepolia");
  console.log("🔗 Explorer: https://sepolia.basescan.org/address/" + contractAddress);
  
  // Verificar el contrato (opcional)
  console.log("\n🔍 Verificando contrato...");
  try {
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: [],
    });
    console.log("✅ Contrato verificado en BaseScan!");
  } catch (error) {
    console.log("⚠️  No se pudo verificar el contrato automáticamente:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error durante el despliegue:", error);
    process.exit(1);
  });

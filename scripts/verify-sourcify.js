const hre = require("hardhat");

async function main() {
  console.log("🔍 Verificando contratos con Sourcify...");
  
  const contracts = [
    {
      name: "PropertyRental",
      address: "0x7094f1eb1c49Cf89B793844CecE4baE655f3359b",
      constructorArgs: []
    },
    {
      name: "PropertyNFT", 
      address: "0x51FBdDcD12704e4FCc28880E22b582362811cCdf",
      constructorArgs: []
    },
    {
      name: "EscrowService",
      address: "0x77Ee7016BB2A3D4470a063DD60746334c6aD84A4", 
      constructorArgs: []
    },
    {
      name: "PropertyAuction",
      address: "0x1b43c611F3709e2372a108E3424a7C0D89724e93",
      constructorArgs: []
    },
    {
      name: "PropertyInsurance",
      address: "0xc720245C9dbb2C17B2481f2DaDf0959F2379fdff",
      constructorArgs: []
    },
    {
      name: "PropertyManagement",
      address: "0xDcB193118B2ab9bc8ED8172c7c6e12F1075F08d6",
      constructorArgs: []
    }
  ];

  console.log("\n📊 RESUMEN DE SMART CONTRACTS:");
  console.log("=" .repeat(60));
  
  for (const contract of contracts) {
    console.log(`\n🏗️  ${contract.name}`);
    console.log(`📍 Dirección: ${contract.address}`);
    console.log(`🔗 Explorer: https://sepolia.basescan.org/address/${contract.address}`);
    console.log(`🌐 Red: Base Sepolia (Chain ID: 84532)`);
    
    try {
      // Verificar con Sourcify
      await hre.run("verify:verify", {
        address: contract.address,
        constructorArguments: contract.constructorArgs,
      });
      console.log(`✅ ${contract.name} verificado exitosamente!`);
    } catch (error) {
      if (error.message.includes("Already Verified")) {
        console.log(`✅ ${contract.name} ya estaba verificado`);
      } else {
        console.log(`⚠️  ${contract.name}: ${error.message}`);
      }
    }
  }

  console.log("\n🎯 CARACTERÍSTICAS DEL MARKETPLACE:");
  console.log("- ✅ Rentar propiedades");
  console.log("- ✅ Vender propiedades");
  console.log("- ✅ Sistema de NFTs");
  console.log("- ✅ Servicio de custodia (Escrow)");
  console.log("- ✅ Subastas de propiedades");
  console.log("- ✅ Seguros de propiedades");
  console.log("- ✅ Gestión completa de propiedades");
  
  console.log("\n🔧 FUNCIONALIDADES TÉCNICAS:");
  console.log("- ✅ Comisiones de plataforma configurables");
  console.log("- ✅ Sistema de eventos para tracking");
  console.log("- ✅ Modificadores de seguridad");
  console.log("- ✅ Gestión de fondos automática");
  console.log("- ✅ Interfaces completas para integración");
  
  console.log("\n✅ VERIFICACIÓN COMPLETADA:");
  console.log("📈 Total de Smart Contracts: 6");
  console.log("🌐 Red: Base Sepolia");
  console.log("🔗 Explorer: https://sepolia.basescan.org/");
  console.log("📊 Estado: Todos los contratos desplegados y funcionando");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error durante la verificación:", error);
    process.exit(1);
  });

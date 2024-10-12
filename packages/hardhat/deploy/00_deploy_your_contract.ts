import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys a contract named "GoldLedger" using the deployer account
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployGoldLedger: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("GoldLedger", {
    from: deployer,
    args: [], // GoldLedger constructor doesn't have any arguments
    log: true,
    autoMine: true,
  });

  // Get the deployed contract to interact with it after deploying.
  const goldLedger = await hre.ethers.getContract<Contract>("GoldLedger", deployer);
  console.log("👋 GoldLedger deployed at:", goldLedger.address);
  console.log("📦 Initial total registrations:", await goldLedger.totalRegistrations());

  try {
    // Register initial gold entries
    const tx1 = await goldLedger.registerGold("100", "24", "Gold bar", "Cert123", "2023-06-01", "Mine A", "0");
    const receipt1 = await tx1.wait();
    const event1 = receipt1.events?.find((event: { event: string; args: any }) => event.event === "GoldRegistered");
    const uniqueIdentifier1 = event1?.args?.uniqueIdentifier;

    const tx2 = await goldLedger.registerGold("50", "22", "Gold coin", "Cert456", "2023-06-02", "Mine B", "0");
    const receipt2 = await tx2.wait();
    const event2 = receipt2.events?.find((event: { event: string; args: any }) => event.event === "GoldRegistered");
    const uniqueIdentifier2 = event2?.args?.uniqueIdentifier;

    console.log("🏆 Initial gold entries registered");
    console.log("🚀 Updated total registrations:", await goldLedger.totalRegistrations());

    // Retrieve and log details of the first registered gold entry
    if (uniqueIdentifier1) {
      const firstGoldDetails = await goldLedger.getGoldDetails(uniqueIdentifier1);
      console.log("🔍 Details of first gold entry:", firstGoldDetails);
    }

    if (uniqueIdentifier2) {
      const secondGoldDetails = await goldLedger.getGoldDetails(uniqueIdentifier2);
      console.log("🔍 Details of second gold entry:", secondGoldDetails);
    }
  } catch (error) {
    console.error("Error registering gold entries:", error);
  }
};

export default deployGoldLedger;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags GoldLedger
deployGoldLedger.tags = ["GoldLedger"];

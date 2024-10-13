import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

/**
 * Deploys a contract named "GoldLedger" using the deployer account.
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployGoldLedger: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const goldLedger = await deploy("GoldLedger", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  console.log("🚀 GoldLedger deployed:", goldLedger.address);
};

export default deployGoldLedger;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags GoldLedger
deployGoldLedger.tags = ["GoldLedger"];

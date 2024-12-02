import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

/**
 * Deploys a contract named "DiamondLedger" using the deployer account.
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployDiamondLedger: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const DiamondLedger = await deploy("DiamondLedger", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  console.log("🚀 DiamondLedger deployed:", DiamondLedger.address);
};

export default deployDiamondLedger;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags DiamondLedger
deployDiamondLedger.tags = ["DiamondLedger"];

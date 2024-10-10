import { expect } from "chai";
import { ethers } from "hardhat";
import { GoldLedger } from "../typechain-types";

describe("GoldLedger", function () {
  let goldLedger: GoldLedger;
  // Remove the unused 'owner' variable
  // let owner: any;

  before(async () => {
    // Remove the unused 'owner' assignment
    // [owner] = await ethers.getSigners();
    const GoldLedgerFactory = await ethers.getContractFactory("GoldLedger");
    goldLedger = (await GoldLedgerFactory.deploy()) as GoldLedger;
    await goldLedger.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should initialize with zero total registrations", async function () {
      expect(await goldLedger.totalRegistrations()).to.equal(0);
    });
  });

  describe("Gold Registration", function () {
    it("Should register gold and increase total registrations", async function () {
      const tx = await goldLedger.registerGold("100g", "24K", "Gold bar", "Cert123", "2023-06-01", "Mine A", "0");
      await tx.wait();

      expect(await goldLedger.totalRegistrations()).to.equal(1);
    });

    it("Should emit GoldRegistered event", async function () {
      await expect(goldLedger.registerGold("50g", "22K", "Gold coin", "Cert456", "2023-06-02", "Mine B", "0")).to.emit(
        goldLedger,
        "GoldRegistered",
      );
    });
  });

  describe("Gold Details Retrieval", function () {
    it("Should retrieve correct gold details", async function () {
      const tx = await goldLedger.registerGold("75g", "18K", "Gold necklace", "Cert789", "2023-06-03", "Mine C", "0");
      const receipt = await tx.wait();
      const event = receipt?.logs[0];
      const uniqueIdentifier = (event as any)?.args?.uniqueIdentifier;
      const goldDetails = await goldLedger.getGoldDetails(uniqueIdentifier);

      expect(goldDetails.weight).to.equal("75g");
      expect(goldDetails.purity).to.equal("18K");
      expect(goldDetails.description).to.equal("Gold necklace");
      expect(goldDetails.certificationDetails).to.equal("Cert789");
      expect(goldDetails.certificationDate).to.equal("2023-06-03");
      expect(goldDetails.mineLocation).to.equal("Mine C");
      expect(goldDetails.parentGoldId).to.equal("0");
    });

    it("Should revert when querying non-existent gold", async function () {
      await expect(goldLedger.getGoldDetails(999999999999)).to.be.revertedWith("Gold not found");
    });
  });
});

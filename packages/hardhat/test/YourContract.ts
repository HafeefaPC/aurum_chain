import { expect } from "chai";
import { ethers } from "hardhat";
import { GoldLedger } from "../typechain-types";
import { EventLog } from "ethers";

describe("GoldLedger", function () {
  let goldLedger: GoldLedger;
  let owner: any;

  before(async () => {
    [owner] = await ethers.getSigners();
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
      const tx = await goldLedger.registerGold("50g", "22K", "Gold coin", "Cert456", "2023-06-02", "Mine B", "0");
      const receipt = await tx.wait();

      // Check if the event was emitted
      const event = receipt?.logs[0] as EventLog;
      expect(event.eventName).to.equal("GoldRegistered");

      // Check the event arguments
      const [uniqueIdentifier, registrar] = event.args;
      expect(uniqueIdentifier).to.be.a("string");
      expect(registrar).to.equal(owner.address);
    });

    it("Should register gold with a parent gold ID", async function () {
      const parentTx = await goldLedger.registerGold(
        "200g",
        "24K",
        "Parent Gold",
        "Cert789",
        "2023-06-03",
        "Mine C",
        "0",
      );
      const parentReceipt = await parentTx.wait();
      const parentEvent = parentReceipt?.logs[0] as EventLog;
      const parentUniqueIdentifier = parentEvent.args?.uniqueIdentifier;

      const childTx = await goldLedger.registerGold(
        "100g",
        "24K",
        "Child Gold",
        "Cert101",
        "2023-06-04",
        "Mine C",
        parentUniqueIdentifier,
      );
      await childTx.wait();

      const childReceipt = await childTx.wait();
      const childEvent = childReceipt?.logs[0] as EventLog;
      const childUniqueIdentifier = childEvent.args?.uniqueIdentifier;

      const childDetails = await goldLedger.getGoldDetails(childUniqueIdentifier);
      expect(childDetails.parentGoldId).to.equal(parentUniqueIdentifier);
    });
  });

  describe("Gold Details Retrieval", function () {
    it("Should retrieve correct gold details", async function () {
      const tx = await goldLedger.registerGold("75g", "18K", "Gold necklace", "Cert202", "2023-06-05", "Mine D", "0");
      const receipt = await tx.wait();
      const event = receipt?.logs[0] as EventLog;
      const uniqueIdentifier = event.args?.uniqueIdentifier;
      const goldDetails = await goldLedger.getGoldDetails(uniqueIdentifier);

      expect(goldDetails.weight).to.equal("75g");
      expect(goldDetails.purity).to.equal("18K");
      expect(goldDetails.description).to.equal("Gold necklace");
      expect(goldDetails.certificationDetails).to.equal("Cert202");
      expect(goldDetails.certificationDate).to.equal("2023-06-05");
      expect(goldDetails.mineLocation).to.equal("Mine D");
      expect(goldDetails.parentGoldId).to.equal("0");
      expect(goldDetails.uniqueIdentifier).to.equal(uniqueIdentifier);
    });

    it("Should revert when querying non-existent gold", async function () {
      const nonExistentId = ethers.randomBytes(32);
      await expect(goldLedger.getGoldDetails(nonExistentId)).to.be.revertedWith("Gold not found");
    });

    it("Should retrieve gold details by unique identifier", async function () {
      const tx = await goldLedger.registerGold("60g", "20K", "Gold bracelet", "Cert303", "2023-06-06", "Mine E", "0");
      const receipt = await tx.wait();
      const event = receipt?.logs[0] as EventLog;
      const uniqueIdentifier = event.args?.uniqueIdentifier;

      if (uniqueIdentifier) {
        console.log("Unique Identifier:", uniqueIdentifier);

        try {
          const goldDetails = await goldLedger.getGoldDetails(uniqueIdentifier);
          console.log("Gold Details:", goldDetails);

          expect(goldDetails.weight).to.equal("60g");
          expect(goldDetails.purity).to.equal("20K");
          expect(goldDetails.description).to.equal("Gold bracelet");
          expect(goldDetails.certificationDetails).to.equal("Cert303");
          expect(goldDetails.certificationDate).to.equal("2023-06-06");
          expect(goldDetails.mineLocation).to.equal("Mine E");
          expect(goldDetails.parentGoldId).to.equal("0");
        } catch (error) {
          console.error("Error retrieving gold details:", error);
          throw error;
        }
      } else {
        throw new Error("Unique identifier is undefined");
      }
    });

    it("Should revert when querying non-existent unique identifier", async function () {
      const nonExistentId = ethers.randomBytes(32);
      await expect(goldLedger.getGoldDetails(nonExistentId)).to.be.revertedWith("Gold not found");
    });
  });
});

import { expect } from "chai";
import { ethers } from "hardhat";
import { GoldLedger } from "../typechain-types";
import { BytesLike } from "ethers";

describe("GoldLedger", function () {
  let goldLedger: GoldLedger;

  before(async () => {
    const goldLedgerFactory = await ethers.getContractFactory("GoldLedger");
    goldLedger = await goldLedgerFactory.deploy();
    await goldLedger.waitForDeployment();
  });

  describe("Gold Registration", function () {
    it("Should register gold with initial details and complete registration", async function () {
      const weight = "10g";
      const purity = "99.9%";
      const description = "Pure gold bar";
      const certificationDetails = "Certified by XYZ";
      const certificationDate = "2023-06-01";
      const mineLocation = "Mine A";
      const parentGoldId = ethers.ZeroHash;

      // Initial registration
      const tx = await goldLedger.registerGold(weight, purity, description);

      const receipt = await tx.wait();
      if (!receipt) {
        throw new Error("Transaction receipt is null");
      }

      console.log("Transaction receipt:", JSON.stringify(receipt, null, 2));

      // Get the unique identifier from the transaction return value
      let uniqueIdentifier: BytesLike;
      if (receipt.logs && receipt.logs.length > 0) {
        const log = receipt.logs[0];
        console.log("First log:", JSON.stringify(log, null, 2));
        if (log.topics && log.topics.length > 1) {
          uniqueIdentifier = log.topics[1];
        } else {
          throw new Error("Unable to extract uniqueIdentifier from logs");
        }
      } else {
        console.log("No logs found. Attempting to get uniqueIdentifier from function return value.");
        uniqueIdentifier = await goldLedger.registerGold.staticCall(weight, purity, description);
      }

      console.log("Extracted uniqueIdentifier:", uniqueIdentifier);

      // Complete registration
      await goldLedger.completeGoldRegistration(
        uniqueIdentifier,
        certificationDetails,
        certificationDate,
        mineLocation,
        parentGoldId,
      );

      // Retrieve and verify gold details
      const goldDetails = await goldLedger.getGoldDetails(uniqueIdentifier);

      expect(goldDetails.weight).to.equal(weight);
      expect(goldDetails.purity).to.equal(purity);
      expect(goldDetails.description).to.equal(description);
      expect(goldDetails.certificationDetails).to.equal(certificationDetails);
      expect(goldDetails.certificationDate).to.equal(certificationDate);
      expect(goldDetails.mineLocation).to.equal(mineLocation);
      expect(goldDetails.parentGoldId).to.equal(parentGoldId);
    });

    it("Should fail to retrieve non-existent gold details", async function () {
      const nonExistentId = ethers.randomBytes(32);
      await expect(goldLedger.getGoldDetails(nonExistentId)).to.be.revertedWith("Gold not found");
    });

    it("Should fail to complete registration for non-existent gold", async function () {
      const nonExistentId = ethers.randomBytes(32);
      await expect(
        goldLedger.completeGoldRegistration(nonExistentId, "Certification", "2023-06-02", "Mine B", ethers.ZeroHash),
      ).to.be.revertedWith("Gold not found");
    });
  });
});

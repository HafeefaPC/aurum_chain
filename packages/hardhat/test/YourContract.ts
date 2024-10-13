import { expect } from "chai";
import { ethers } from "hardhat";
import { GoldLedger, GoldLedger__factory } from "../typechain-types";
import { BytesLike } from "ethers";

describe("GoldLedger", function () {
  let goldLedger: GoldLedger;

  before(async () => {
    const goldLedgerFactory: GoldLedger__factory = (await ethers.getContractFactory(
      "GoldLedger",
    )) as GoldLedger__factory;
    goldLedger = await goldLedgerFactory.deploy();
    await goldLedger.waitForDeployment();
  });

  describe("Gold Registration", function () {
    it("Should register gold with initial details", async function () {
      const weight: string = "10g";
      const purity: string = "99.9%";
      const description: string = "Pure gold bar";
      const certificationDetails: string = "Certified by XYZ";
      const certificationDate: string = "2023-01-01";
      const mineLocation: string = "Mine A";
      const parentGoldId: BytesLike = ethers.zeroPadBytes(ethers.toBeHex("0x123456789012"), 12);

      // Initial registration
      const tx = await goldLedger.registerGold(
        weight,
        purity,
        description,
        certificationDetails,
        certificationDate,
        mineLocation,
        parentGoldId,
      );

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
        throw new Error("No logs found. Unable to extract uniqueIdentifier.");
      }

      console.log("Extracted uniqueIdentifier:", uniqueIdentifier);

      // Retrieve and verify gold details
      const goldDetails = await goldLedger.getAllGoldDetails();

      expect(goldDetails.length).to.equal(1);
      expect(goldDetails[0].weight).to.equal(weight);
      expect(goldDetails[0].purity).to.equal(purity);
      expect(goldDetails[0].description).to.equal(description);
    });

    it("Should fail to retrieve non-existent gold details", async function () {
      const nonExistentId: BytesLike = ethers.zeroPadBytes(ethers.toBeHex("0x000000000000"), 12);
      await expect(goldLedger.getGoldDetails(nonExistentId)).to.be.revertedWith("Gold not found");
    });
  });
});

// packages/nextjs/app/Ownership/page.tsx
"use client";

import { useState } from "react";
import { Button } from "../../~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../~/components/ui/card";
import { Input } from "../../~/components/ui/input";
import { Label } from "../../~/components/ui/label";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const OwnershipUpdate = () => {
  const [uniqueIdentifier, setUniqueIdentifier] = useState<string>("");
  const [certificateDetails, setCertificateDetails] = useState<string[]>([""]); // Initialize as an array

  const { writeContractAsync: addCertificationDetailAsync } = useScaffoldWriteContract("DiamondLedger");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newDetails = [...certificateDetails];
    newDetails[index] = e.target.value; // Update the specific index
    setCertificateDetails(newDetails);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await addCertificationDetailAsync({
        functionName: "addCertificationDetail",
        args: [uniqueIdentifier, certificateDetails], // Pass the entire array
      });

      if (!result) {
        throw new Error("Failed to write to contract");
      }

      console.log("Certification detail updated successfully");
    } catch (error) {
      console.error("Error updating certification detail:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 text-white">
      <Card className="w-full max-w-2xl p-4">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl sm:text-3xl font-bold text-center text-white">Update Certification Details</CardTitle>
          <CardDescription className="text-center text-white">Update certification details for ownership</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="uniqueIdentifier" className="text-white">
                Unique Identifier
              </Label>
              <Input
                id="uniqueIdentifier"
                name="uniqueIdentifier"
                value={uniqueIdentifier}
                onChange={(e) => setUniqueIdentifier(e.target.value)}
                className="text-white w-full"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Certification Details</Label>
              {certificateDetails.map((detail, index) => (
                <Input
                  key={index}
                  value={detail}
                  onChange={(e) => handleChange(e, index)} // Update specific index
                  className="text-white w-full mb-2"
                  placeholder="Enter certificate URL"
                />
              ))}
              <Button type="button" onClick={() => setCertificateDetails([...certificateDetails, ""])} className="text-black bg-slate-400">
                Add Certificate URL
              </Button>
            </div>
            <CardFooter className="mt-4 sm:mt-6 md:mt-8">
              <Button type="submit" className="w-full text-black bg-slate-400">
                Update Certification Details
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OwnershipUpdate;
"use client";

import { useState } from "react";
import { Button } from "../../~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../~/components/ui/card";
import { Input } from "../../~/components/ui/input";
import { Label } from "../../~/components/ui/label";
import { Textarea } from "../../~/components/ui/textarea";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { waitForTransactionReceipt } from 'viem/actions'
import { createPublicClient, http, } from 'viem'
import { hardhat } from 'viem/chains'


interface FormData {
  weight: string;
  purity: string;
  description: string;
  certificationDetails: string;
  certificationDate: string;
  mineLocation: string;
  parentDiamondId?: string; // Make parentDiamondId optional
}
interface CertificateDetail {
  details: string;
}

const DiamondRegistration = () => {
  const [formData, setFormData] = useState<FormData>({
    weight: "",
    purity: "",
    description: "",
    certificationDetails: "",
    certificationDate: "",
    mineLocation: "",
    parentDiamondId: "",
  });

  const { writeContractAsync: writeDiamondLedgerAsync } = useScaffoldWriteContract("DiamondLedger");
  const [hallmarkId, setHallmarkId] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(hallmarkId);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const args = [
      formData.weight,
      formData.purity,
      formData.description,
      formData.certificationDetails,
      formData.certificationDate,
      formData.mineLocation,
      formData.parentDiamondId ? (formData.parentDiamondId as `0x${string}`) : "0x000000000000000000000000",
    ] as const;

    // Submit transaction
    const result = await writeDiamondLedgerAsync({
      functionName: "registerDiamond",
      args,
    });

    if (!result) {
      throw new Error("Failed to write to contract");
    }

    const publicClient = createPublicClient({
      chain: hardhat,
      transport: http(),
    });

    // Wait for transaction receipt
    const receipt = await waitForTransactionReceipt(publicClient, {
      hash: result,
    });

    if (receipt.logs && receipt.logs.length > 0) {
      const log = receipt.logs[0];

  

      console.log("Gold registered successfully");
    

      setHallmarkId(log.topics?.[1]?.slice(0, 26) ?? "No identifier found");
      setShowSuccess(true);

      console.log("Hallmark ID:", hallmarkId);
      console.log("Show Success:", showSuccess);
      console.log("Unique Identifier", log.topics?.[1]?.slice(0, 26) ?? "No identifier found");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 text-white">
      <Card className="w-full max-w-2xl p-4">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl sm:text-3xl font-bold text-center text-white">Diamond Registration</CardTitle>
          <CardDescription className="text-center text-white">Register your Diamond with details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="weight" className="text-white">
                  Weight (in grams or ounces)
                </Label>
                <Input
                  id="weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="text-white w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="purity" className="text-white">
                  Purity
                </Label>
                <Input
                  id="purity"
                  name="purity"
                  value={formData.purity}
                  onChange={handleChange}
                  placeholder="e.g., 24K, 22K, 18K"
                  className="text-white w-full"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-white">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="text-white w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="certificationDetails" className="text-white">
                Certification Details
              </Label>
              <Input
                id="certificationDetails"
                name="certificationDetails"
                value={formData.certificationDetails}
                onChange={handleChange}
                className="text-white w-full"
              />
            </div>
           
            <div className="space-y-2">
              <Label htmlFor="certificationDate" className="text-white">
                Certification Date
              </Label>
              <Input
                id="  "
                name="certificationDate"
                type="date"
                value={formData.certificationDate}
                onChange={handleChange}
                className="text-white w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mineLocation" className="text-white">
                Mine Location
              </Label>
              <Input
                id="mineLocation"
                name="mineLocation"
                value={formData.mineLocation}
                onChange={handleChange}
                className="text-white w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parentDiamondId" className="text-white">
                Parent Diamond ID
              </Label>
              <Input
                id="parentDiamondId"
                name="parentDiamondId"
                value={formData.parentDiamondId}
                onChange={handleChange}
                className="text-white w-full"
                placeholder="Leave blank if not applicable"
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="mt-4 sm:mt-6 md:mt-8">
          <Button type="submit" onClick={handleSubmit} className="w-full text-black bg-slate-400">
            Register Diamond
          </Button>
        </CardFooter>
        
      </Card>
      {showSuccess && (
      <Card className="mt-4  p-2 w-2/3">
             
              <CardContent className="text-white pl-8">
                <p className="font-mono "> Hallmark ID : {hallmarkId}</p>
              </CardContent>
            </Card>
  )}
    </div>

    
  );
};

export default DiamondRegistration;

"use client";

import { useEffect, useState } from "react";
import { Button } from "../../~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../~/components/ui/card";
import { Input } from "../../~/components/ui/input";
import { Label } from "../../~/components/ui/label";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

interface DiamondDetails {
  uniqueIdentifier: string;
  weight: string;
  purity: string;
  description: string;
  certificationDetails: string;
  certificationDate: string;
  mineLocation: string;
  parentDiamondId: string;
  hasParentDiamondId: boolean;
}

const DiamondSearch = () => {
  const [searchId, setSearchId] = useState<string>("");
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [matchedDiamondDetails, setMatchedDiamondDetails] = useState<DiamondDetails | null>(null);

  const {
    data: allDiamondDetails,
    isLoading,
    error,
    refetch,
  } = useScaffoldReadContract({
    contractName: "DiamondLedger",
    functionName: "getAllDiamondDetails",
  });

  useEffect(() => {
    if (searchPerformed && searchId !== "") {
      refetch();
    }
  }, [searchPerformed, searchId, refetch]);

  useEffect(() => {
    if (allDiamondDetails && searchId) {
      console.log("Result from smart contract:", allDiamondDetails);
      const matchedDetails = (allDiamondDetails as unknown as DiamondDetails[]).find(
        details => details.uniqueIdentifier === searchId,
      );
      setMatchedDiamondDetails(matchedDetails || null);
    }
  }, [allDiamondDetails, searchId]);

  const handleSearch = () => {
    if (searchId) {
      setSearchPerformed(true);
    }
  };

  const renderDiamondDetails = (details: DiamondDetails) => (
    <Card className="p-4">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Diamond Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="font-bold">Weight:</Label>
            <p>{details.weight}</p>
          </div>
          <div>
            <Label className="font-bold">Purity:</Label>
            <p>{details.purity}</p>
          </div>
          <div>
            <Label className="font-bold">Description:</Label>
            <p>{details.description}</p>
          </div>
          <div>
            <Label className="font-bold">Certification Details:</Label>
            <p>{details.certificationDetails}</p>
          </div>
          <div>
            <Label className="font-bold">Certification Date:</Label>
            <p>{details.certificationDate}</p>
          </div>
          <div>
            <Label className="font-bold">Mine Location:</Label>
            <p>{details.mineLocation}</p>
          </div>
          <div>
            <Label className="font-bold">Parent Diamond ID:</Label>
            <p>{details.parentDiamondId}</p>
          </div>
          <div>
            <Label className="font-bold">Unique Identifier:</Label>
            <p>{details.uniqueIdentifier}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 text-white">
      <Card className="w-full max-w-2xl p-4">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl font-bold text-center text-white">Diamond Search</CardTitle>
          <CardDescription className="text-center text-white">
            Enter a unique identifier to search for Diamond details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="Enter Unique Identifier"
              value={searchId}
              onChange={e => setSearchId(e.target.value)}
              className="text-white w-full"
            />
            <Button onClick={handleSearch} className="text-black bg-slate-400">
              Search
            </Button>
          </div>
          {isLoading && <p className="mt-4">Loading...</p>}
          {error && <p className="mt-4 text-red-500">Error: {error.message}</p>}
          {searchPerformed && !isLoading && !error && !matchedDiamondDetails && (
            <p className="mt-4">No Diamond details found for the given identifier.</p>
          )}
          {matchedDiamondDetails && <div className="mt-4">{renderDiamondDetails(matchedDiamondDetails)}</div>}
        </CardContent>
      </Card>
    </div>
  );
};

export default DiamondSearch;

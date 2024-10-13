"use client";

import { useEffect, useState } from "react";
import { Button } from "../../~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../~/components/ui/card";
import { Input } from "../../~/components/ui/input";
import { Label } from "../../~/components/ui/label";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

interface GoldDetails {
  uniqueIdentifier: string;
  weight: string;
  purity: string;
  description: string;
  certificationDetails: string;
  certificationDate: string;
  mineLocation: string;
  parentGoldId: string;
  hasParentGoldId: boolean;
}

const GoldSearch = () => {
  const [searchId, setSearchId] = useState<string>("");
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [matchedGoldDetails, setMatchedGoldDetails] = useState<GoldDetails | null>(null);

  const {
    data: allGoldDetails,
    isLoading,
    error,
    refetch,
  } = useScaffoldReadContract({
    contractName: "GoldLedger",
    functionName: "getAllGoldDetails",
  });

  useEffect(() => {
    if (searchPerformed && searchId !== "") {
      refetch();
    }
  }, [searchPerformed, searchId, refetch]);

  useEffect(() => {
    if (allGoldDetails && searchId) {
      console.log("Result from smart contract:", allGoldDetails);
      const matchedDetails = (allGoldDetails as unknown as GoldDetails[]).find(
        details => details.uniqueIdentifier === searchId,
      );
      setMatchedGoldDetails(matchedDetails || null);
    }
  }, [allGoldDetails, searchId]);

  const handleSearch = () => {
    if (searchId) {
      setSearchPerformed(true);
    }
  };

  const renderGoldDetails = (details: GoldDetails) => (
    <Card className="p-4">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Gold Details</CardTitle>
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
            <Label className="font-bold">Parent Gold ID:</Label>
            <p>{details.parentGoldId}</p>
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
          <CardTitle className="text-2xl sm:text-3xl font-bold text-center text-white">Gold Search</CardTitle>
          <CardDescription className="text-center text-white">
            Enter a unique identifier to search for gold details
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
            <Button onClick={handleSearch} className="text-black">
              Search
            </Button>
          </div>
          {isLoading && <p className="mt-4">Loading...</p>}
          {error && <p className="mt-4 text-red-500">Error: {error.message}</p>}
          {searchPerformed && !isLoading && !error && !matchedGoldDetails && (
            <p className="mt-4">No gold details found for the given identifier.</p>
          )}
          {matchedGoldDetails && <div className="mt-4">{renderGoldDetails(matchedGoldDetails)}</div>}
        </CardContent>
      </Card>
    </div>
  );
};

export default GoldSearch;

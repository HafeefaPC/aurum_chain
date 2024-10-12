"use client";

import React, { useState } from "react";
import { Button } from "../../~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../~/components/ui/card";
import { Input } from "../../~/components/ui/input";
import { Label } from "../../~/components/ui/label";

interface GoldDetails {
  weight: string;
  purity: string;
  description: string;
  certificationDetails: string;
  certificationDate: string;
  mineLocation: string;
  parentGoldId: string;
  uniqueIdentifier: string;
}

const GoldSearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResult, setSearchResult] = useState<GoldDetails | null>(null);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Replace with actual API call
    const mockResult: GoldDetails = {
      weight: "100g",
      purity: "24K",
      description: "Gold bar",
      certificationDetails: "Cert123",
      certificationDate: "2023-06-01",
      mineLocation: "Mine A",
      parentGoldId: "0",
      uniqueIdentifier: "0x1234...5678",
    };
    setSearchResult(mockResult);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 text-white">
      <Card className="w-full max-w-2xl p-4">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl sm:text-3xl font-bold text-center text-white">Gold Search</CardTitle>
          <CardDescription className="text-center text-white">
            Search for registered gold by unique identifier
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="search" className="text-white">
                Unique Identifier
              </Label>
              <div className="flex space-x-2">
                <Input
                  id="search"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="text-white w-full"
                  placeholder="Enter unique identifier"
                />
                <Button type="submit" className="text-black">
                  Search
                </Button>
              </div>
            </div>
          </form>

          {searchResult && (
            <div className="mt-6 space-y-4">
              <h3 className="text-xl font-semibold">Search Result:</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="text-white">Weight</Label>
                  <p>{searchResult.weight}</p>
                </div>
                <div>
                  <Label className="text-white">Purity</Label>
                  <p>{searchResult.purity}</p>
                </div>
                <div>
                  <Label className="text-white">Description</Label>
                  <p>{searchResult.description}</p>
                </div>
                <div>
                  <Label className="text-white">Certification Details</Label>
                  <p>{searchResult.certificationDetails}</p>
                </div>
                <div>
                  <Label className="text-white">Certification Date</Label>
                  <p>{searchResult.certificationDate}</p>
                </div>
                <div>
                  <Label className="text-white">Mine Location</Label>
                  <p>{searchResult.mineLocation}</p>
                </div>
                <div>
                  <Label className="text-white">Parent Gold ID</Label>
                  <p>{searchResult.parentGoldId}</p>
                </div>
                <div>
                  <Label className="text-white">Unique Identifier</Label>
                  <p>{searchResult.uniqueIdentifier}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GoldSearchPage;

"use client";

import { useEffect, useState } from "react";
import { Button } from "../../~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../~/components/ui/card";
import { Input } from "../../~/components/ui/input";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { CII_VALUES } from "../../constants/ciiValues";

interface TaxCalculation {
  purchasePrice: number;
  salePrice: number;
  indexedCost: number;
  capitalGains: number;
  taxPayable: number;
}


const TaxCalculator = () => {
  const [searchId, setSearchId] = useState<string>("");
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [taxDetails, setTaxDetails] = useState<TaxCalculation | null>(null);

  const { data: diamondDetails, isLoading } = useScaffoldReadContract({
    contractName: "DiamondLedger",
    functionName: "getAllDiamondDetails",
  });

  const calculateTax = (certDate: string, purchasePrice: number, salePrice: number) => {
    const purchaseDate = new Date(certDate);
    const currentDate = new Date();
    const holdingPeriodMonths = (currentDate.getFullYear() - purchaseDate.getFullYear()) * 12 + (currentDate.getMonth() - purchaseDate.getMonth());

    const purchaseYear = purchaseDate.getFullYear().toString();
    const currentYear = currentDate.getFullYear().toString();
    
    const purchaseCII = CII_VALUES[purchaseYear] || 254;
    const currentCII = CII_VALUES[currentYear] || 348;

    const indexedCost = purchasePrice * (currentCII / purchaseCII);
    const capitalGains = salePrice - indexedCost;

    let taxPayable: number;
    if (holdingPeriodMonths < 36) {
      taxPayable = capitalGains * 0.30; // 30% for STCG
    } else {
      taxPayable = capitalGains * 0.20; // 20% for LTCG
    }

    return {
      purchasePrice,
      salePrice,
      indexedCost,
      capitalGains,
      taxPayable,
    };
  };
  const handleCalculate = () => {
    if (diamondDetails && searchId && currentPrice) {
      const diamond = (diamondDetails as any[]).find(d => d.uniqueIdentifier === searchId);
      if (diamond) {
        const purchasePrice = parseFloat(diamond.weight) * 100000; // Example conversion
        const result = calculateTax(diamond.certificationDate, purchasePrice, currentPrice);
        setTaxDetails(result);
      }
    }
  };

  const renderTaxDetails = () => (
    taxDetails && (
      <Card className="mt-4  p-2 w-2/3">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center text-slate-300">Tax Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2 pl-7 text-slate-400">
            <p>Purchase Price: ₹{taxDetails.purchasePrice.toFixed(2)}</p>
            <p>Sale Price: ₹{taxDetails.salePrice.toFixed(2)}</p>
            <p>Indexed Cost: ₹{taxDetails.indexedCost.toFixed(2)}</p>
            <p>Capital Gains: ₹{taxDetails.capitalGains.toFixed(2)}</p>
            <p>Tax Payable (20%): ₹{taxDetails.taxPayable.toFixed(2)}</p>
          </div>
        </CardContent>
      </Card>
    )
  );
  

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-4">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-slate-400">Gold Tax Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 flex  flex-col justify-center items-center">
            <Input
              placeholder="Enter Unique Identifier"
              value={searchId}
              onChange={e => setSearchId(e.target.value)}
              className="text-white"
            />
            <Input
              type="number"
              placeholder="Enter Current Price"
              value={currentPrice || ''}
              onChange={e => setCurrentPrice(Number(e.target.value))}
              className="text-white"
            />
            <Button onClick={handleCalculate} disabled={isLoading} className="bg-slate-400 w-1/4 ">
              Calculate Tax
            </Button>
           
          </div>
        </CardContent>
      </Card>
      {renderTaxDetails()}
    </div>
  );
};

export default TaxCalculator;

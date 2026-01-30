"use client";

import React from "react";
import { ABTestStatistics } from "@/services/ab-testing/statistics";

interface Variant {
  id: string;
  variantName: string;
  clickCount: number;
  viewCount: number;
  trafficSplitPercent: number;
}

interface ABTest {
  id: string;
  testName: string;
  status: string;
  variants: Variant[];
  createdAt: string;
}

interface ABTestDashboardProps {
  test: ABTest;
}

export const ABTestDashboard: React.FC<ABTestDashboardProps> = ({ test }) => {
  const calculateWinner = () => {
    if (test.variants.length < 2) return null;

    // Simple version: just compare CTR
    const sorted = [...test.variants].sort((a, b) => {
      const ctrA = ABTestStatistics.calculateCTR(a.clickCount, a.viewCount);
      const ctrB = ABTestStatistics.calculateCTR(b.clickCount, b.viewCount);
      return ctrB - ctrA;
    });

    return sorted[0];
  };

  const winner = calculateWinner();

  return (
    <div className="space-y-6 bg-card p-6 rounded-xl border shadow-sm">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold">{test.testName}</h3>
          <p className="text-sm text-muted-foreground">
            Status:{" "}
            <span className="capitalize font-medium">{test.status}</span> •
            Created {new Date(test.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {test.variants.map((variant) => {
          const ctr = ABTestStatistics.calculateCTR(
            variant.clickCount,
            variant.viewCount,
          );
          const isWinner = winner?.id === variant.id;

          return (
            <div
              key={variant.id}
              className={`p-4 rounded-lg border flex flex-col justify-between ${isWinner ? "border-primary ring-1 ring-primary" : ""}`}
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold truncate">{variant.variantName}</h4>
                  {isWinner && (
                    <span className="bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
                      Leading
                    </span>
                  )}
                </div>
                <div className="text-2xl font-black mb-1">
                  {ctr.toFixed(1)}%{" "}
                  <span className="text-xs font-normal text-muted-foreground">
                    CTR
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Clicks</span>
                  <span className="font-medium">{variant.clickCount}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Views</span>
                  <span className="font-medium">{variant.viewCount}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Traffic</span>
                  <span className="font-medium">
                    {variant.trafficSplitPercent}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {test.variants.length >= 2 && (
        <div className="mt-8 p-4 bg-muted/50 rounded-lg text-sm">
          <h4 className="font-bold mb-2">Statistical Insight</h4>
          <p className="text-muted-foreground">
            {winner
              ? `Variant "${winner.variantName}" is currently performing better with a ${ABTestStatistics.calculateCTR(winner.clickCount, winner.viewCount).toFixed(1)}% conversion rate.`
              : "Collecting data to determine a winner..."}
          </p>
        </div>
      )}
    </div>
  );
};

"use client";

import { useState, useEffect } from "react";
import { ABTestDashboard } from "@/components/ab-testing/dashboard";

export default function ABTestingDashboardPage() {
  const [tests, setTests] = useState<any[]>([]);
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const resp = await fetch("/api/ab-tests");
      if (resp.ok) {
        const data = await resp.json();
        setTests(data);
        if (data.length > 0) setSelectedTestId(data[0].id);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          A/B Testing Experiments
        </h1>
        <p className="mt-2 text-gray-600">
          Optimize your performance by testing different titles, styles, and
          content variants.
        </p>
      </div>

      {loading ? (
        <p>Loading experiments...</p>
      ) : tests.length === 0 ? (
        <div className="bg-purple-50 border-l-4 border-purple-400 p-6 rounded-lg text-center">
          <div className="text-purple-600 mb-4">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900">
            No experiments found
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Start an experiment by adding a variant to any of your links in the
            Links editor.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 border-r border-gray-100 pr-4">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
              Active Tests
            </h2>
            <div className="space-y-2">
              {tests.map((test) => (
                <div
                  key={test.id}
                  onClick={() => setSelectedTestId(test.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-all border ${selectedTestId === test.id ? "bg-purple-50 border-purple-200 shadow-sm" : "hover:bg-gray-50 border-transparent"}`}
                >
                  <p className="text-sm font-bold text-gray-800 truncate">
                    {test.testName}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <span
                      className={`text-[10px] font-bold uppercase ${test.status === "running" ? "text-green-600" : "text-gray-400"}`}
                    >
                      {test.status}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">
                      {test.variants?.length || 0} Variants
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3">
            {selectedTestId ? (
              (() => {
                const test = tests.find((t) => t.id === selectedTestId);
                return test ? (
                  <ABTestDashboard test={test} />
                ) : (
                  <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-xl">
                    <p className="text-gray-400 italic">
                      Experimental data not found
                    </p>
                  </div>
                );
              })()
            ) : (
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-xl">
                <p className="text-gray-400 italic">
                  Select an experiment to view results
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

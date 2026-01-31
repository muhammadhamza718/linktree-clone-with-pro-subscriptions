"use client";

import { useState, useEffect } from "react";
import { BrandKitLibrary } from "@/components/brand-kit/library";

export default function BrandKitPage() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const resp = await fetch("/api/profiles");
      if (resp.ok) {
        const data = await resp.json();
        setProfiles(data);
        if (data.length > 0) setSelectedProfileId(data[0].id);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Brand Kit</h1>
        <p className="mt-2 text-gray-600">
          Centralize your brand assets, logos, and color schemes for a
          consistent look across all profiles.
        </p>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center space-x-4 bg-white p-4 shadow rounded-lg">
            <label className="text-sm font-medium text-gray-700">
              Manage Assets for:
            </label>
            <select
              value={selectedProfileId || ""}
              onChange={(e) => setSelectedProfileId(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.username}
                </option>
              ))}
            </select>
          </div>

          {selectedProfileId && (
            <BrandKitLibrary profileId={selectedProfileId} canEdit={true} />
          )}
        </div>
      )}
    </div>
  );
}

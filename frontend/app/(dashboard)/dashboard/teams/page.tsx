"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth";
import { MemberManagement as TeamMemberManagement } from "@/components/teams/member-management";

export default function TeamsPage() {
  const { data: session } = authClient.useSession();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch profiles the user owns to manage teams for them
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

  const selectedProfile = profiles.find((p) => p.id === selectedProfileId);
  const isOwner =
    selectedProfile && session?.user?.id === selectedProfile.userId;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Team Collaboration</h1>
        <p className="mt-2 text-gray-600">
          Invite teammates to help manage your links and branding with precise
          role-based access.
        </p>
      </div>

      {loading ? (
        <p>Loading profiles...</p>
      ) : profiles.length === 0 ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <p className="text-sm text-yellow-700">
            You need to create a profile before you can manage a team.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center space-x-4 bg-white p-4 shadow rounded-lg">
            <label className="text-sm font-medium text-gray-700">
              Select Profile:
            </label>
            <select
              value={selectedProfileId || ""}
              onChange={(e) => setSelectedProfileId(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.username} ({p.displayName})
                </option>
              ))}
            </select>
          </div>

          {selectedProfileId && (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <TeamMemberManagement
                profileId={selectedProfileId}
                currentUserId={session?.user?.id || ""}
                isOwner={!!isOwner}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

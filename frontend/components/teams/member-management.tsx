"use client";

import React, { useState, useEffect } from "react";

interface TeamMember {
  id: string;
  userId: string;
  role: string;
  invitedAt: string;
  acceptedAt: string | null;
  user: {
    name: string;
    email: string;
  };
}

interface MemberManagementProps {
  profileId: string;
  currentUserId: string;
  isOwner: boolean;
}

export const MemberManagement: React.FC<MemberManagementProps> = ({
  profileId,
  currentUserId,
  isOwner,
}) => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("editor");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    fetchMembers();
  }, [profileId]);

  const fetchMembers = async () => {
    try {
      const resp = await fetch(`/api/teams?profileId=${profileId}`);
      if (resp.ok) {
        setMembers(await resp.json());
      }
    } catch (err) {
      console.error("Failed to fetch members:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const inviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const resp = await fetch("/api/teams/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId, email, role }),
      });

      const data = await resp.json();

      if (resp.ok) {
        setMessage({ type: "success", text: "Invitation sent successfully!" });
        setEmail("");
        fetchMembers();
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to send invitation",
        });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: "An unexpected error occurred." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeMember = async (id: string) => {
    if (!confirm("Are you sure you want to remove this team member?")) return;

    try {
      const resp = await fetch(`/api/teams/${id}`, { method: "DELETE" });
      if (resp.ok) {
        setMembers(members.filter((m) => m.id !== id));
      }
    } catch (err) {
      console.error("Failed to remove member:", err);
    }
  };

  if (isLoading)
    return <div className="animate-pulse h-40 bg-muted rounded-xl"></div>;

  return (
    <div className="space-y-8">
      {isOwner && (
        <div className="bg-card rounded-xl border p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-4">Invite Team Member</h3>
          <form
            onSubmit={inviteMember}
            className="flex flex-col md:flex-row gap-4"
          >
            <input
              type="email"
              required
              placeholder="teammate@example.com"
              className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <select
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm md:w-32"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary text-primary-foreground h-10 px-6 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Sending..." : "Invite"}
            </button>
          </form>
          {message && (
            <div
              className={`mt-4 p-3 rounded-md text-sm ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
            >
              {message.text}
            </div>
          )}
        </div>
      )}

      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-lg font-bold">Team Members</h3>
          <p className="text-sm text-muted-foreground">
            Manage access to this profile.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
              <tr>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Status</th>
                {isOwner && <th className="px-6 py-3 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y">
              {members.map((member) => (
                <tr
                  key={member.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium">{member.user.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {member.user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 capitalize">{member.role}</td>
                  <td className="px-6 py-4">
                    {member.acceptedAt ? (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-[10px] font-bold uppercase">
                        Invited
                      </span>
                    )}
                  </td>
                  {isOwner && (
                    <td className="px-6 py-4 text-right">
                      {member.userId !== currentUserId && (
                        <button
                          onClick={() => removeMember(member.id)}
                          className="text-red-500 hover:underline font-medium"
                        >
                          Remove
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

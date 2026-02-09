"use client";

import { useState } from "react";
import { Link, LinkCreateInput } from "../../types";
import LinkForm from "../links/link-form";
import LinkList from "../links/link-list";

interface LinkManagerProps {
  initialLinks: Link[];
  onUpdateLinks: (links: Link[]) => void;
}

export default function LinkManager({
  initialLinks,
  onUpdateLinks,
}: LinkManagerProps) {
  const [links, setLinks] = useState<Link[]>(initialLinks);
  const [isAdding, setIsAdding] = useState(false);
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  // --- Actions ---

  const handleAddLink = async (data: LinkCreateInput) => {
    try {
      const response = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, order: links.length }),
      });

      if (!response.ok) throw new Error("Failed to add link");

      const result = await response.json();
      const updatedLinks = [...links, result.link];
      setLinks(updatedLinks);
      onUpdateLinks(updatedLinks);
      setIsAdding(false);
    } catch (error) {
      console.error(error);
      throw error; // Re-throw for form to handle
    }
  };

  const handleUpdateLink = async (updatedLink: Link) => {
    try {
      const response = await fetch(`/api/links/${updatedLink.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedLink),
      });

      if (!response.ok) throw new Error("Failed to update link");

      const result = await response.json();

      const updatedLinks = links.map((l) =>
        l.id === updatedLink.id ? { ...l, ...updatedLink } : l,
      );

      setLinks(updatedLinks);
      onUpdateLinks(updatedLinks);
      setEditingLinkId(null);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleDeleteLink = async (linkId: string) => {
    if (!confirm("Are you sure you want to delete this link?")) return;

    try {
      const response = await fetch(`/api/links/${linkId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete link");

      const updatedLinks = links.filter((l) => l.id !== linkId);
      setLinks(updatedLinks);
      onUpdateLinks(updatedLinks);
    } catch (error) {
      setErrors(["Failed to delete link"]);
      setTimeout(() => setErrors([]), 3000);
    }
  };

  const handleToggleVisibility = async (linkId: string) => {
    const link = links.find((l) => l.id === linkId);
    if (!link) return;
    await handleUpdateLink({ ...link, isVisible: !link.isVisible });
  };

  const handleTogglePin = async (linkId: string) => {
    const link = links.find((l) => l.id === linkId);
    if (!link) return;
    await handleUpdateLink({ ...link, isFeatured: !link.isFeatured });
  };

  const handleSyncGithub = async (linkId: string) => {
    try {
      const response = await fetch("/api/profile/github-metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ linkId }),
      });
      if (response.ok) {
        // Refresh links or notify user
        alert("GitHub metadata synced!");
        // Optionally fetch updated link data here
      } else {
        throw new Error("Failed to sync");
      }
    } catch (e) {
      alert("Failed to sync GitHub metadata");
    }
  };

  // --- Drag & Drop ---

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id);
    setDraggingId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData("text/plain");
    if (!draggedId) return;

    const draggedIndex = links.findIndex((l) => l.id === draggedId);
    if (draggedIndex === -1 || draggedIndex === targetIndex) {
      setDraggingId(null);
      return;
    }

    const newLinks = [...links];
    const [draggedLink] = newLinks.splice(draggedIndex, 1);
    newLinks.splice(targetIndex, 0, draggedLink);

    const reorderedLinks = newLinks.map((l, index) => ({ ...l, order: index }));

    setLinks(reorderedLinks);
    onUpdateLinks(reorderedLinks);
    setDraggingId(null);

    // Save order to server
    fetch("/api/links/reorder", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        linkOrder: reorderedLinks.map((l, i) => ({ id: l.id, order: i })),
      }),
    }).catch(console.error);
  };

  return (
    <div className="space-y-6">
      {errors.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-sm text-red-700">{errors.join(", ")}</p>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Your Links</h2>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Link
          </button>
        )}
      </div>

      {isAdding && (
        <LinkForm
          onSubmit={handleAddLink}
          onCancel={() => setIsAdding(false)}
        />
      )}

      <LinkList
        links={links}
        editingLinkId={editingLinkId}
        draggingId={draggingId}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onToggleVisibility={handleToggleVisibility}
        onTogglePin={handleTogglePin}
        onEdit={setEditingLinkId}
        onDelete={handleDeleteLink}
        onUpdate={handleUpdateLink}
        onCancelEdit={() => setEditingLinkId(null)}
        onSyncGithub={handleSyncGithub}
      />
    </div>
  );
}

"use client";

import { useState } from "react";
import { validateLink } from "../../lib/validations";

interface LinkManagerProps {
  initialLinks: any[];
  onUpdateLinks: (links: any[]) => void;
}

export default function LinkManager({
  initialLinks,
  onUpdateLinks,
}: LinkManagerProps) {
  const [links, setLinks] = useState(initialLinks);
  const [newLink, setNewLink] = useState({
    title: "",
    url: "",
    linkType: "website" as string,
    isVisible: true,
    startDate: "" as string,
    endDate: "" as string,
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    // Validate the new link
    const linkData = {
      title: newLink.title,
      url: newLink.url,
      linkType: newLink.linkType,
      order: links.length,
      isVisible: newLink.isVisible,
      startDate: newLink.startDate ? newLink.startDate : null,
      endDate: newLink.endDate ? newLink.endDate : null,
    };

    const validation = validateLink(linkData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      // Add to database
      const response = await fetch("/api/links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...linkData,
          order: links.length, // Set order as the last position
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add link");
      }

      const result = await response.json();

      // Add to local state
      const updatedLinks = [...links, result.link];
      setLinks(updatedLinks);
      onUpdateLinks(updatedLinks);

      // Reset form
      setNewLink({
        title: "",
        url: "",
        linkType: "website",
        isVisible: true,
        startDate: "",
        endDate: "",
      });
      setIsAdding(false);
    } catch (error) {
      setErrors(["Failed to add link"]);
    }
  };

  const handleUpdateLink = async (linkId: string, updatedData: any) => {
    try {
      const response = await fetch(`/api/links/${linkId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error("Failed to update link");
      }

      const result = await response.json();

      // Update local state
      const updatedLinks = links.map((link) =>
        link.id === linkId ? { ...link, ...updatedData } : link,
      );
      setLinks(updatedLinks);
      onUpdateLinks(updatedLinks);
      setEditingLinkId(null);
    } catch (error) {
      setErrors(["Failed to update link"]);
    }
  };

  const handleDeleteLink = async (linkId: string) => {
    try {
      const response = await fetch(`/api/links/${linkId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete link");
      }

      // Remove from local state
      const updatedLinks = links.filter((link) => link.id !== linkId);
      setLinks(updatedLinks);
      onUpdateLinks(updatedLinks);
    } catch (error) {
      setErrors(["Failed to delete link"]);
    }
  };

  const handleToggleVisibility = async (linkId: string) => {
    const link = links.find((l) => l.id === linkId);
    if (!link) return;

    const updatedLink = { ...link, isVisible: !link.isVisible };
    await handleUpdateLink(linkId, updatedLink);
  };

  const handleTogglePin = async (linkId: string) => {
    const link = links.find((l) => l.id === linkId);
    if (!link) return;

    const updatedLink = { ...link, isPinned: !link.isPinned };
    await handleUpdateLink(linkId, { isPinned: updatedLink.isPinned });
  };

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id);
    setDraggingId(id);
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData("text/plain");
    if (!draggedId) return;

    const draggedIndex = links.findIndex((link) => link.id === draggedId);
    if (draggedIndex === -1 || draggedIndex === targetIndex) {
      setDraggingId(null);
      return;
    }

    // Reorder links
    const newLinks = [...links];
    const [draggedLink] = newLinks.splice(draggedIndex, 1);
    newLinks.splice(targetIndex, 0, draggedLink);

    // Update order property
    const reorderedLinks = newLinks.map((link, index) => ({
      ...link,
      order: index,
    }));

    setLinks(reorderedLinks);
    onUpdateLinks(reorderedLinks);

    // Update order on server
    try {
      const linkOrder = reorderedLinks.map((link, index) => ({
        id: link.id,
        order: index,
      }));

      fetch("/api/links/reorder", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ linkOrder }),
      }).catch((error) => {
        console.error("Failed to update link order:", error);
      });
    } catch (error) {
      console.error("Failed to update link order:", error);
    }

    setDraggingId(null);
  };

  return (
    <div className="space-y-6">
      {errors.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {errors.map((error, idx) => (
                  <span key={idx} className="block">
                    • {error}
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Your Links</h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isAdding ? "Cancel" : "Add Link"}
        </button>
      </div>

      {isAdding && (
        <form
          onSubmit={handleAddLink}
          className="bg-white shadow rounded-lg p-6 mb-6"
        >
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Link Title *
              </label>
              <input
                type="text"
                id="title"
                required
                value={newLink.title}
                onChange={(e) =>
                  setNewLink({ ...newLink, title: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="e.g. My Portfolio"
              />
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="url"
                className="block text-sm font-medium text-gray-700"
              >
                URL *
              </label>
              <input
                type="url"
                id="url"
                required
                value={newLink.url}
                onChange={(e) =>
                  setNewLink({ ...newLink, url: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="https://example.com"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="linkType"
                className="block text-sm font-medium text-gray-700"
              >
                Link Type
              </label>
              <select
                id="linkType"
                value={newLink.linkType}
                onChange={(e) =>
                  setNewLink({ ...newLink, linkType: e.target.value })
                }
                className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="website">Website</option>
                <option value="social">Social Media</option>
                <option value="project">Project</option>
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="embed">Embed</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700"
              >
                Start Date
              </label>
              <input
                type="datetime-local"
                id="startDate"
                value={newLink.startDate}
                onChange={(e) =>
                  setNewLink({ ...newLink, startDate: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-gray-700"
              >
                End Date
              </label>
              <input
                type="datetime-local"
                id="endDate"
                value={newLink.endDate}
                onChange={(e) =>
                  setNewLink({ ...newLink, endDate: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div className="sm:col-span-2 flex items-center pt-6">
              <input
                id="isVisible"
                type="checkbox"
                checked={newLink.isVisible}
                onChange={(e) =>
                  setNewLink({ ...newLink, isVisible: e.target.checked })
                }
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="isVisible"
                className="ml-2 block text-sm text-gray-900"
              >
                Visible on profile
              </label>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Link
            </button>
          </div>
        </form>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {links.map((link, index) => (
            <li
              key={link.id}
              draggable
              onDragStart={(e) => handleDragStart(e, link.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              className={`bg-white ${draggingId === link.id ? "opacity-50" : ""}`}
            >
              <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="cursor-move mr-4 text-gray-400 hover:text-gray-600">
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </div>

                  {editingLinkId === link.id ? (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const target = e.target as any;
                        handleUpdateLink(link.id, {
                          title: target.title.value,
                          url: target.url.value,
                          linkType: target.linkType.value,
                        });
                      }}
                      className="flex-1 flex items-center space-x-2"
                    >
                      <input
                        type="text"
                        name="title"
                        defaultValue={link.title}
                        className="flex-1 border border-gray-300 rounded-md px-2 py-1 text-sm"
                      />
                      <input
                        type="text"
                        name="url"
                        defaultValue={link.url}
                        className="flex-1 border border-gray-300 rounded-md px-2 py-1 text-sm"
                      />
                      <button
                        type="submit"
                        className="text-green-600 hover:text-green-900"
                      >
                        Save
                      </button>
                    </form>
                  ) : (
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <p className="text-sm font-bold text-indigo-600 truncate py-1">
                          {link.title}
                        </p>
                        {link.isPinned && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-100 text-blue-700">
                            Pinned
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 truncate">
                        {link.url}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end space-y-2">
                  <div className="flex items-center space-x-3">
                    {/* Visibility Toggle */}
                    <button
                      onClick={() => handleToggleVisibility(link.id)}
                      className={`relative inline-flex shrink-0 h-5 w-10 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none ${
                        link.isVisible ? "bg-indigo-600" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                          link.isVisible ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>

                    {/* Pin Action */}
                    <button
                      onClick={() => handleTogglePin(link.id)}
                      className={`p-1 rounded-md ${link.isPinned ? "text-blue-600 bg-blue-50" : "text-gray-400 hover:text-gray-600"}`}
                      title="Pin Link"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v8l2 2v2h-7v5l-1 1-1-1v-5H4v-2l2-2V4z" />
                      </svg>
                    </button>

                    {/* GitHub Sync */}
                    {(link.url.includes("github.com") || link.githubRepo) && (
                      <button
                        onClick={async () => {
                          const resp = await fetch(
                            "/api/profile/github-metadata",
                            {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ linkId: link.id }),
                            },
                          );
                          if (resp.ok) alert("GitHub synced!");
                        }}
                        className="p-1 rounded-md text-gray-400 hover:text-gray-600"
                        title="Sync GitHub"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                      </button>
                    )}

                    <button
                      onClick={() => setEditingLinkId(link.id)}
                      className="text-indigo-600 hover:text-indigo-900 text-xs font-bold uppercase"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteLink(link.id)}
                      className="text-red-600 hover:text-red-900 text-xs font-bold uppercase"
                    >
                      Delete
                    </button>
                  </div>

                  {/* A/B Testing Toggle */}
                  <button
                    onClick={() => {
                      const el = document.getElementById(`ab-test-${link.id}`);
                      if (el) el.classList.toggle("hidden");
                    }}
                    className="text-[10px] font-bold bg-purple-50 text-purple-600 px-2 py-0.5 rounded border border-purple-100 uppercase tracking-tighter"
                  >
                    A/B TESTING{" "}
                    {link.linkVariants?.length > 0
                      ? `(${link.linkVariants.length})`
                      : ""}
                  </button>
                </div>
              </div>

              {/* A/B Testing Panel */}
              <div
                id={`ab-test-${link.id}`}
                className="hidden bg-purple-50 border-t border-purple-100 p-4"
              >
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-[11px] font-black text-purple-900 uppercase tracking-widest">
                    Link Experiments
                  </h4>
                  <button
                    onClick={async () => {
                      const name = prompt("Variant Name");
                      const title = prompt("Alternative Title");
                      if (!name || !title) return;
                      await fetch("/api/ab-tests", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          testName: `Test ${link.title}`,
                          linkId: link.id,
                          variants: [{ name, title, split: 50 }],
                        }),
                      });
                      window.location.reload();
                    }}
                    className="text-[10px] font-bold bg-purple-600 text-white px-2 py-1 rounded uppercase tracking-tighter"
                  >
                    Add Variant
                  </button>
                </div>

                {link.linkVariants?.map((v: any) => (
                  <div
                    key={v.id}
                    className="bg-white p-2 rounded border border-purple-100 mb-2 flex justify-between items-center text-xs"
                  >
                    <div>
                      <span className="font-bold text-purple-700">
                        {v.variantName}:
                      </span>{" "}
                      {v.title}
                    </div>
                    <div className="font-mono text-[10px] bg-gray-50 px-1 rounded">
                      {v.trafficSplitPercent}%
                    </div>
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

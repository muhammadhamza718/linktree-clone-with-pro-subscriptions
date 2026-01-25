'use client';

import { useState } from 'react';
import { validateLink } from '../../lib/validations';

interface LinkManagerProps {
  initialLinks: any[];
  onUpdateLinks: (links: any[]) => void;
}

export default function LinkManager({ initialLinks, onUpdateLinks }: LinkManagerProps) {
  const [links, setLinks] = useState(initialLinks);
  const [newLink, setNewLink] = useState({
    title: '',
    url: '',
    linkType: 'website' as string,
    isVisible: true,
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
    };

    const validation = validateLink(linkData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      // Add to database
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...linkData,
          order: links.length, // Set order as the last position
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add link');
      }

      const result = await response.json();

      // Add to local state
      const updatedLinks = [...links, result.link];
      setLinks(updatedLinks);
      onUpdateLinks(updatedLinks);

      // Reset form
      setNewLink({
        title: '',
        url: '',
        linkType: 'website',
        isVisible: true,
      });
      setIsAdding(false);
    } catch (error) {
      setErrors(['Failed to add link']);
    }
  };

  const handleUpdateLink = async (linkId: string, updatedData: any) => {
    try {
      const response = await fetch(`/api/links/${linkId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error('Failed to update link');
      }

      const result = await response.json();

      // Update local state
      const updatedLinks = links.map(link =>
        link.id === linkId ? { ...link, ...updatedData } : link
      );
      setLinks(updatedLinks);
      onUpdateLinks(updatedLinks);
      setEditingLinkId(null);
    } catch (error) {
      setErrors(['Failed to update link']);
    }
  };

  const handleDeleteLink = async (linkId: string) => {
    try {
      const response = await fetch(`/api/links/${linkId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete link');
      }

      // Remove from local state
      const updatedLinks = links.filter(link => link.id !== linkId);
      setLinks(updatedLinks);
      onUpdateLinks(updatedLinks);
    } catch (error) {
      setErrors(['Failed to delete link']);
    }
  };

  const handleToggleVisibility = async (linkId: string) => {
    const link = links.find(l => l.id === linkId);
    if (!link) return;

    const updatedLink = { ...link, isVisible: !link.isVisible };
    await handleUpdateLink(linkId, updatedLink);
  };

  const handleTogglePin = async (linkId: string) => {
    const link = links.find(l => l.id === linkId);
    if (!link) return;

    const updatedLink = { ...link, isPinned: !link.isPinned };
    await handleUpdateLink(linkId, { isPinned: updatedLink.isPinned });
  };

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    setDraggingId(id);
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text/plain');
    if (!draggedId) return;

    const draggedIndex = links.findIndex(link => link.id === draggedId);
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

      fetch('/api/links/reorder', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ linkOrder }),
      }).catch(error => {
        console.error('Failed to update link order:', error);
      });
    } catch (error) {
      console.error('Failed to update link order:', error);
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
          {isAdding ? 'Cancel' : 'Add Link'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddLink} className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Link Title *
              </label>
              <input
                type="text"
                id="title"
                required
                value={newLink.title}
                onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="e.g. My Portfolio"
              />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                URL *
              </label>
              <input
                type="url"
                id="url"
                required
                value={newLink.url}
                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="https://example.com"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="linkType" className="block text-sm font-medium text-gray-700">
                Link Type
              </label>
              <select
                id="linkType"
                value={newLink.linkType}
                onChange={(e) => setNewLink({ ...newLink, linkType: e.target.value })}
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

            <div className="sm:col-span-2 flex items-center pt-6">
              <input
                id="isVisible"
                type="checkbox"
                checked={newLink.isVisible}
                onChange={(e) => setNewLink({ ...newLink, isVisible: e.target.checked })}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="isVisible" className="ml-2 block text-sm text-gray-900">
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
              className={`bg-white ${draggingId === link.id ? 'opacity-50' : ''}`}
            >
              <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className="cursor-move mr-4 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </div>

                  {editingLinkId === link.id ? (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleUpdateLink(link.id, {
                          title: (e.target as any).title.value,
                          url: (e.target as any).url.value,
                          linkType: (e.target as any).linkType.value,
                          isPinned: (e.target as any).isPinned.checked,
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
                      <select
                        name="linkType"
                        defaultValue={link.linkType}
                        className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                      >
                        <option value="website">Website</option>
                        <option value="social">Social Media</option>
                        <option value="project">Project</option>
                        <option value="email">Email</option>
                        <option value="phone">Phone</option>
                        <option value="embed">Embed</option>
                        <option value="custom">Custom</option>
                      </select>
                      <div className="flex items-center space-x-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="isPinned"
                            defaultChecked={!!link.isPinned}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">Pin Link</span>
                        </label>
                      </div>
                      <button
                        type="submit"
                        className="text-green-600 hover:text-green-900"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingLinkId(null)}
                        className="text-gray-600 hover:text-gray-900 ml-1"
                      >
                        Cancel
                      </button>
                    </form>
                  ) : (
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-indigo-600 truncate">
                          {link.title}
                        </p>
                        {!link.isVisible && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Hidden
                          </span>
                        )}
                        {link.isPinned && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Pinned
                          </span>
                        )}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <p className="truncate">{link.url}</p>
                        <span className="mx-2">•</span>
                        <span className="capitalize">{link.linkType}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleVisibility(link.id)}
                    className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none ${
                      link.isVisible ? 'bg-indigo-600' : 'bg-gray-200'
                    }`}
                    role="switch"
                  >
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                        link.isVisible ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>

                  <button
                    onClick={() => handleTogglePin(link.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      link.isPinned
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {link.isPinned ? 'Pinned' : 'Pin'}
                  </button>

                  <button
                    onClick={() => setEditingLinkId(link.id)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDeleteLink(link.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
"use client";

import { Link } from "../../types";

interface LinkCardProps {
  link: Link;
  index: number;
  isDragging: boolean;
  isEditing: boolean;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  onToggleVisibility: (id: string) => void;
  onTogglePin?: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onSyncGithub?: (id: string) => void;
  children?: React.ReactNode; // For edit form or other content
}

export default function LinkCard({
  link,
  index,
  isDragging,
  isEditing,
  onDragStart,
  onDragOver,
  onDrop,
  onToggleVisibility,
  onTogglePin,
  onEdit,
  onDelete,
  onSyncGithub,
  children,
}: LinkCardProps) {
  return (
    <div
      draggable={!isEditing}
      onDragStart={(e) => onDragStart(e, link.id)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, index)}
      className={`bg-white shadow rounded-lg border border-gray-200 transition-all duration-200 ${
        isDragging
          ? "opacity-50 ring-2 ring-indigo-500 ring-offset-2"
          : "hover:border-gray-300"
      }`}
    >
      <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center flex-1 min-w-0">
          <div className="cursor-move mr-4 text-gray-400 hover:text-gray-600">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </div>

          {isEditing ? (
            <div className="flex-1">{children}</div>
          ) : (
            <div className="flex-1 min-w-0">
              <div className="flex items-center">
                <p className="text-sm font-bold text-indigo-600 truncate py-1">
                  {link.title}
                </p>
                {link.isFeatured && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-100 text-blue-700">
                    Pinned
                  </span>
                )}
                {link.githubRepo && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-gray-100 text-gray-700">
                    GitHub
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 truncate">{link.url}</p>
            </div>
          )}
        </div>

        {!isEditing && (
          <div className="flex flex-col items-end space-y-2 ml-4">
            <div className="flex items-center space-x-3">
              {/* Visibility Toggle */}
              <button
                onClick={() => onToggleVisibility(link.id)}
                className={`relative inline-flex shrink-0 h-5 w-10 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none ${
                  link.isVisible ? "bg-indigo-600" : "bg-gray-200"
                }`}
                title="Toggle Visibility"
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                    link.isVisible ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>

              {/* Pin Action */}
              {onTogglePin && (
                <button
                  onClick={() => onTogglePin(link.id)}
                  className={`p-1 rounded-md ${
                    link.isFeatured
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
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
              )}

              {/* GitHub Sync */}
              {(link.url.includes("github.com") || link.githubRepo) &&
                onSyncGithub && (
                  <button
                    onClick={() => onSyncGithub(link.id)}
                    className="p-1 rounded-md text-gray-400 hover:text-gray-600"
                    title="Sync GitHub Metadata"
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
                onClick={() => onEdit(link.id)}
                className="text-indigo-600 hover:text-indigo-900 text-xs font-bold uppercase transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(link.id)}
                className="text-red-600 hover:text-red-900 text-xs font-bold uppercase transition-colors"
              >
                Delete
              </button>
            </div>

            {/* A/B Testing Badge logic could go here if needed, but keeping it simple for now */}
          </div>
        )}
      </div>
    </div>
  );
}

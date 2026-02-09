"use client";

import { Link } from "../../types";
import LinkCard from "./link-card";
import LinkForm from "./link-form";

interface LinkListProps {
  links: Link[];
  editingLinkId: string | null;
  draggingId: string | null;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  onToggleVisibility: (id: string) => void;
  onTogglePin?: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (link: any) => Promise<void>;
  onCancelEdit: () => void;
  onSyncGithub?: (id: string) => void;
}

export default function LinkList({
  links,
  editingLinkId,
  draggingId,
  onDragStart,
  onDragOver,
  onDrop,
  onToggleVisibility,
  onTogglePin,
  onEdit,
  onDelete,
  onUpdate,
  onCancelEdit,
  onSyncGithub,
}: LinkListProps) {
  if (links.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
        <p className="text-gray-500">
          No links yet. Add your first link above!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {links.map((link, index) => (
        <div key={link.id}>
          {editingLinkId === link.id ? (
            // Edit Mode: Render Form directly or inside Card
            <div className="bg-white shadow rounded-lg p-6 border-2 border-indigo-100">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Edit Link
              </h3>
              <LinkForm
                initialData={link}
                onSubmit={async (data) => {
                  await onUpdate({ ...link, ...data });
                }}
                onCancel={onCancelEdit}
              />
            </div>
          ) : (
            // View Mode: Render Card
            <LinkCard
              link={link}
              index={index}
              isDragging={draggingId === link.id}
              isEditing={false}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDrop={onDrop}
              onToggleVisibility={onToggleVisibility}
              onTogglePin={onTogglePin}
              onEdit={onEdit}
              onDelete={onDelete}
              onSyncGithub={onSyncGithub}
            />
          )}
        </div>
      ))}
    </div>
  );
}

import { ReactNode } from 'react';

interface DragAndDropProps {
  children: ReactNode;
  onDragStart?: (e: React.DragEvent, id: string) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent, targetIndex: number) => void;
  id?: string;
  index?: number;
}

export default function DragAndDrop({
  children,
  onDragStart,
  onDragOver,
  onDrop,
  id,
  index
}: DragAndDropProps) {
  const handleDragStart = (e: React.DragEvent) => {
    if (id) {
      e.dataTransfer.setData('text/plain', id);
    }
    onDragStart?.(e, id || '');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    onDragOver?.(e);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (index !== undefined) {
      onDrop?.(e, index);
    }
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {children}
    </div>
  );
}
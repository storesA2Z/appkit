import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface DraggableSectionProps {
  id: string;
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

export function DraggableSection({ id, label, isSelected, onClick }: DraggableSectionProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm cursor-pointer ${
        isSelected ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-300' : 'bg-ide-panel hover:bg-ide-bg'
      }`}
      onClick={onClick}
    >
      <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
        <GripVertical size={14} className="text-ide-text-dim" />
      </button>
      <span>{label}</span>
    </div>
  );
}

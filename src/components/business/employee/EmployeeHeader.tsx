import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, GripVertical, ChevronDown, ChevronUp } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface EmployeeHeaderProps {
  id: string;
  name: string;
  color: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onRemove: () => void;
  onUpdateEmployee: (updates: { name: string; color: string }) => void;
}

export const EmployeeHeader = ({
  id,
  name,
  color,
  isExpanded,
  onToggleExpand,
  onRemove,
  onUpdateEmployee,
}: EmployeeHeaderProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(name);
  const [tempColor, setTempColor] = useState(color);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSaveEdit = () => {
    onUpdateEmployee({ 
      name: tempName,
      color: tempColor 
    });
    setIsEditing(false);
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div
        className="flex items-center justify-between p-4"
        style={{ borderLeft: `4px solid ${color}` }}
      >
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="cursor-grab active:cursor-grabbing" 
            {...attributes} 
            {...listeners}
          >
            <GripVertical className="w-4 h-4 text-muted-foreground" />
          </Button>
          {isEditing ? (
            <div className="flex items-center space-x-2">
              <Input
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="w-32"
              />
              <Input
                type="color"
                value={tempColor}
                onChange={(e) => setTempColor(e.target.value)}
                className="w-12"
              />
              <Button onClick={handleSaveEdit} size="sm">Save</Button>
            </div>
          ) : (
            <>
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span 
                className="font-medium cursor-pointer hover:underline"
                onClick={() => setIsEditing(true)}
              >
                {name}
              </span>
            </>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onToggleExpand}
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="text-destructive hover:text-destructive"
            disabled={id === "manager"}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
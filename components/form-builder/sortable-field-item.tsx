"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, Copy } from "lucide-react";
import { FormField } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { renderFieldPreview } from "./field-preview-utils";

interface SortableFieldItemProps {
  field: FormField;
  index: number;
  isSelected: boolean;
  onClick: () => void;
  onDelete: () => void;
}

export function SortableFieldItem({
  field,
  index,
  isSelected,
  onClick,
  onDelete,
}: SortableFieldItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: field.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getFieldTypeLabel = (type: string) => {
    const typeLabels: Record<string, { label: string; color: string }> = {
      text: {
        label: "Text",
        color: "bg-blue-100 text-blue-800 hover:bg-blue-200",
      },
      textarea: {
        label: "Text Area",
        color: "bg-blue-100 text-blue-800 hover:bg-blue-200",
      },
      email: {
        label: "Email",
        color: "bg-green-100 text-green-800 hover:bg-green-200",
      },
      number: {
        label: "Number",
        color: "bg-amber-100 text-amber-800 hover:bg-amber-200",
      },
      password: {
        label: "Password",
        color: "bg-red-100 text-red-800 hover:bg-red-200",
      },
      tel: {
        label: "Phone",
        color: "bg-purple-100 text-purple-800 hover:bg-purple-200",
      },
      url: {
        label: "URL",
        color: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200",
      },
      select: {
        label: "Dropdown",
        color: "bg-pink-100 text-pink-800 hover:bg-pink-200",
      },
      checkbox: {
        label: "Checkbox",
        color: "bg-teal-100 text-teal-800 hover:bg-teal-200",
      },
      radio: {
        label: "Radio",
        color: "bg-violet-100 text-violet-800 hover:bg-violet-200",
      },
      date: {
        label: "Date",
        color: "bg-lime-100 text-lime-800 hover:bg-lime-200",
      },
      file: {
        label: "File",
        color: "bg-orange-100 text-orange-800 hover:bg-orange-200",
      },
    };

    return (
      typeLabels[type] || { label: type, color: "bg-gray-100 text-gray-800" }
    );
  };

  const typeInfo = getFieldTypeLabel(field.type);

  const requiredBadge = field.validation?.required ? (
    <Badge
      variant="outline"
      className="ml-2 text-xs border-red-300 text-red-600"
    >
      Required
    </Badge>
  ) : null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={cn("relative focus-within:z-10", isDragging ? "z-10" : "z-0")}
    >
      <Card
        className={cn(
          "shadow-sm transition-all",
          "hover:border-primary/30 hover:shadow-sm",
          "focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/10",
          isDragging ? "opacity-50" : "opacity-100",
          isSelected && "border-primary/50 ring-1 ring-primary/10 shadow-sm"
        )}
        onClick={onClick}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick();
          }
        }}
      >
        <CardHeader className="p-3 flex flex-row items-center justify-between">
          <div className="flex items-center">
            <div
              {...listeners}
              className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-muted cursor-grab active:cursor-grabbing focus:outline-none focus:ring-2 focus:ring-primary"
              tabIndex={0}
              role="button"
              aria-label="Drag to reorder"
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="ml-2">
              <Badge className={cn("text-xs font-normal", typeInfo.color)}>
                {typeInfo.label}
              </Badge>
              {requiredBadge}
            </div>
          </div>

          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8",
                "hover:bg-muted",
                "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              )}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Copy className="h-4 w-4 text-muted-foreground" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8",
                "hover:bg-destructive/10 hover:text-destructive",
                "focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2"
              )}
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="space-y-1">
            <p className="text-sm font-medium">{field.label}</p>
            {field.description && (
              <p className="text-xs text-muted-foreground">
                {field.description}
              </p>
            )}
          </div>
          <div className="mt-2 opacity-80 pointer-events-none">
            {renderFieldPreview(field)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

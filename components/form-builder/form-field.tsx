"use client";

import { useState } from "react";
import { Trash2, GripVertical, Settings } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField as FormFieldType } from "@/lib/types";
import { FieldSettings } from "./field-settings";

interface FormFieldProps {
  field: FormFieldType;
  index: number;
  onUpdate: (updatedField: Partial<FormFieldType>) => void;
  onRemove: () => void;
  onOrderChange: (startIndex: number, endIndex: number) => void;
}

export function FormField({
  field,
  index,
  onUpdate,
  onRemove,
  onOrderChange,
}: FormFieldProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("fieldIndex", index.toString());
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    const startIndex = parseInt(e.dataTransfer.getData("fieldIndex"), 10);
    onOrderChange(startIndex, index);
    setIsDragging(false);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <Card
      className={`${isDragging ? "opacity-50" : ""} transition-all`}
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragEnd={handleDragEnd}
    >
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          <GripVertical className="h-5 w-5 cursor-move text-muted-foreground" />
          <span className="font-medium">{field.label}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onRemove}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        {!showSettings ? (
          <div className="space-y-2">
            <FieldPreview field={field} />
          </div>
        ) : (
          <FieldSettings field={field} onUpdate={onUpdate} />
        )}
      </CardContent>
    </Card>
  );
}

function FieldPreview({ field }: { field: FormFieldType }) {
  switch (field.type) {
    case "text":
    case "email":
    case "number":
    case "url":
    case "tel":
    case "password":
      return (
        <div className="space-y-2">
          <label className="text-sm font-medium">
            {field.label}{" "}
            {field.validation?.required && (
              <span className="text-destructive">*</span>
            )}
          </label>
          <Input type={field.type} placeholder={field.placeholder} disabled />
        </div>
      );
    case "textarea":
      return (
        <div className="space-y-2">
          <label className="text-sm font-medium">
            {field.label}{" "}
            {field.validation?.required && (
              <span className="text-destructive">*</span>
            )}
          </label>
          <textarea
            className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            placeholder={field.placeholder}
            rows={3}
            disabled
          />
        </div>
      );
    case "checkbox":
      return (
        <div className="flex items-center space-x-2">
          <Checkbox id={`preview-${field.id}`} disabled />
          <label
            htmlFor={`preview-${field.id}`}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {field.label}{" "}
            {field.validation?.required && (
              <span className="text-destructive">*</span>
            )}
          </label>
        </div>
      );
    case "select":
      return (
        <div className="space-y-2">
          <label className="text-sm font-medium">
            {field.label}{" "}
            {field.validation?.required && (
              <span className="text-destructive">*</span>
            )}
          </label>
          <select
            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            disabled
          >
            <option value="" disabled selected>
              {field.placeholder || "Select an option"}
            </option>
            {field.options?.map((option, i) => (
              <option key={i} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      );
    case "radio":
      return (
        <div className="space-y-2">
          <span className="text-sm font-medium">
            {field.label}{" "}
            {field.validation?.required && (
              <span className="text-destructive">*</span>
            )}
          </span>
          <div className="space-y-2">
            {field.options?.map((option, i) => (
              <div key={i} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={`preview-radio-${field.id}`}
                  disabled
                />
                <label className="text-sm">{option}</label>
              </div>
            ))}
          </div>
        </div>
      );
    default:
      return <div>Unsupported field type</div>;
  }
}

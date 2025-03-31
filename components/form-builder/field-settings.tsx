"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { FormField } from "@/lib/types";

interface FieldSettingsProps {
  field: FormField;
  onUpdate: (updatedField: Partial<FormField>) => void;
}

export function FieldSettings({ field, onUpdate }: FieldSettingsProps) {
  const [label, setLabel] = useState(field.label);
  const [placeholder, setPlaceholder] = useState(field.placeholder || "");
  const [isRequired, setIsRequired] = useState(
    field.validation?.required || false
  );
  const [options, setOptions] = useState<string[]>(
    field.type === "select" ||
      field.type === "radio" ||
      field.type === "checkbox"
      ? field.options || []
      : []
  );
  const [newOption, setNewOption] = useState("");

  useEffect(() => {
    const updatedField: Partial<FormField> = {
      label,
      placeholder: placeholder || undefined,
      validation: {
        ...field.validation,
        required: isRequired,
      },
    };

    if (
      field.type === "select" ||
      field.type === "radio" ||
      (field.type === "checkbox" && options.length > 0)
    ) {
      if (field.type === "select") {
        (updatedField as Partial<FormField & { options: string[] }>).options =
          options;
      } else if (field.type === "radio") {
        (updatedField as Partial<FormField & { options: string[] }>).options =
          options;
      } else if (field.type === "checkbox" && options.length > 0) {
        (updatedField as Partial<FormField & { options: string[] }>).options =
          options;
      }
    }

    onUpdate(updatedField);
  }, [
    label,
    placeholder,
    isRequired,
    options,
    onUpdate,
    field.validation,
    field.type,
  ]);

  const handleAddOption = () => {
    if (newOption.trim()) {
      setOptions([...options, newOption.trim()]);
      setNewOption("");
    }
  };

  const handleRemoveOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={`label-${field.id}`}>Field Label</Label>
        <Input
          id={`label-${field.id}`}
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`placeholder-${field.id}`}>Placeholder</Label>
        <Input
          id={`placeholder-${field.id}`}
          value={placeholder}
          onChange={(e) => setPlaceholder(e.target.value)}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id={`required-${field.id}`}
          checked={isRequired}
          onCheckedChange={(checked) => setIsRequired(checked as boolean)}
        />
        <Label htmlFor={`required-${field.id}`}>Required field</Label>
      </div>

      {(field.type === "select" ||
        field.type === "radio" ||
        field.type === "checkbox") && (
        <div className="space-y-2">
          <Label>Options</Label>
          <div className="space-y-2">
            {options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...options];
                    newOptions[index] = e.target.value;
                    setOptions(newOptions);
                  }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveOption(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Add option"
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddOption();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleAddOption}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

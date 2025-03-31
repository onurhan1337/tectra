"use client";

import { useState, useEffect } from "react";
import { FormField } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FieldPropertiesProps {
  field: FormField;
  onChange: (updatedField: Partial<FormField>) => void;
}

export function FieldProperties({ field, onChange }: FieldPropertiesProps) {
  const [label, setLabel] = useState(field.label);
  const [placeholder, setPlaceholder] = useState(field.placeholder || "");
  const [description, setDescription] = useState(field.description || "");
  const [options, setOptions] = useState<string[]>(
    (field as any).options || []
  );
  const [newOption, setNewOption] = useState("");

  const [isRequired, setIsRequired] = useState(
    field.validation?.required || false
  );
  const [minLength, setMinLength] = useState(
    field.validation?.minLength?.toString() || ""
  );
  const [maxLength, setMaxLength] = useState(
    field.validation?.maxLength?.toString() || ""
  );
  const [min, setMin] = useState(field.validation?.min?.toString() || "");
  const [max, setMax] = useState(field.validation?.max?.toString() || "");
  const [pattern, setPattern] = useState(field.validation?.pattern || "");

  useEffect(() => {
    setLabel(field.label);
    setPlaceholder(field.placeholder || "");
    setDescription(field.description || "");
    setOptions((field as any).options || []);
    setIsRequired(field.validation?.required || false);
    setMinLength(field.validation?.minLength?.toString() || "");
    setMaxLength(field.validation?.maxLength?.toString() || "");
    setMin(field.validation?.min?.toString() || "");
    setMax(field.validation?.max?.toString() || "");
    setPattern(field.validation?.pattern || "");
  }, [field.id]);

  useEffect(() => {
    const updatedField: Partial<FormField> = {
      label,
      placeholder: placeholder || undefined,
      description: description || undefined,
    };

    if (field.type === "select" || field.type === "radio") {
      (updatedField as any).options = options;
    } else if (field.type === "checkbox" && options.length > 0) {
      (updatedField as any).options = options;
    }

    const validation: Record<string, any> = {};

    if (isRequired) validation.required = true;
    if (minLength) validation.minLength = parseInt(minLength, 10);
    if (maxLength) validation.maxLength = parseInt(maxLength, 10);
    if (min) validation.min = parseFloat(min);
    if (max) validation.max = parseFloat(max);
    if (pattern) validation.pattern = pattern;

    if (Object.keys(validation).length > 0) {
      updatedField.validation = validation as any;
    } else {
      updatedField.validation = undefined;
    }

    onChange(updatedField);
  }, [
    label,
    placeholder,
    description,
    options,
    isRequired,
    minLength,
    maxLength,
    min,
    max,
    pattern,
    field.type,
  ]);

  const handleAddOption = () => {
    if (newOption.trim()) {
      setOptions([...options, newOption.trim()]);
      setNewOption("");
    }
  };

  const handleRemoveOption = (indexToRemove: number) => {
    setOptions(options.filter((_, index) => index !== indexToRemove));
  };

  const supportsMinMaxLength = [
    "text",
    "textarea",
    "email",
    "password",
    "tel",
    "url",
  ].includes(field.type);
  const supportsMinMaxValue = field.type === "number";
  const supportsPattern = ["text", "email", "password", "tel", "url"].includes(
    field.type
  );
  const supportsOptions = ["select", "radio", "checkbox"].includes(field.type);

  return (
    <div className="space-y-5">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="field-label">Label</Label>
          <Input
            id="field-label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="field-placeholder">Placeholder</Label>
          <Input
            id="field-placeholder"
            value={placeholder}
            onChange={(e) => setPlaceholder(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="field-description">Help Text</Label>
          <Input
            id="field-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Additional information about this field"
          />
        </div>
      </div>

      {supportsOptions && (
        <div className="space-y-3">
          <Label>Options</Label>
          {options.length > 0 ? (
            <div className="space-y-2 mb-2">
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
            </div>
          ) : (
            <p className="text-sm text-muted-foreground mb-2">
              No options added yet
            </p>
          )}

          <div className="flex space-x-2">
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
              size="sm"
              onClick={handleAddOption}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <Accordion type="single" collapsible defaultValue="validation">
        <AccordionItem value="validation">
          <AccordionTrigger>Validation</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="validation-required"
                  checked={isRequired}
                  onCheckedChange={(checked) => setIsRequired(checked === true)}
                />
                <Label htmlFor="validation-required">Required field</Label>
              </div>

              {supportsMinMaxLength && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="validation-min-length">Min Length</Label>
                    <Input
                      id="validation-min-length"
                      type="number"
                      value={minLength}
                      onChange={(e) => setMinLength(e.target.value)}
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="validation-max-length">Max Length</Label>
                    <Input
                      id="validation-max-length"
                      type="number"
                      value={maxLength}
                      onChange={(e) => setMaxLength(e.target.value)}
                      min={minLength || "0"}
                    />
                  </div>
                </div>
              )}

              {supportsMinMaxValue && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="validation-min">Min Value</Label>
                    <Input
                      id="validation-min"
                      type="number"
                      value={min}
                      onChange={(e) => setMin(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="validation-max">Max Value</Label>
                    <Input
                      id="validation-max"
                      type="number"
                      value={max}
                      onChange={(e) => setMax(e.target.value)}
                      min={min || "0"}
                    />
                  </div>
                </div>
              )}

              {supportsPattern && (
                <div className="space-y-2">
                  <Label htmlFor="validation-pattern">Pattern (RegEx)</Label>
                  <Input
                    id="validation-pattern"
                    value={pattern}
                    onChange={(e) => setPattern(e.target.value)}
                    placeholder="e.g. ^[a-zA-Z0-9]{3,}$"
                  />
                  <p className="text-xs text-muted-foreground">
                    Regular expression for advanced validation
                  </p>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

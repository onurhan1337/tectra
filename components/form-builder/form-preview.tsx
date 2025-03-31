"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormField } from "@/lib/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

interface FormPreviewProps {
  fields: FormField[];
}

export function FormPreview({ fields }: FormPreviewProps) {
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (id: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [id]: value }));

    if (errors[id]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    fields.forEach((field) => {
      if (field.validation?.required) {
        const value = formValues[field.id];
        if (
          value === undefined ||
          value === "" ||
          (Array.isArray(value) && value.length === 0)
        ) {
          newErrors[field.id] = "This field is required";
          isValid = false;
        }
      }

      if (field.validation) {
        const value = formValues[field.id] || "";

        if (field.validation.pattern && value) {
          const pattern = new RegExp(field.validation.pattern);
          if (!pattern.test(value)) {
            newErrors[field.id] = "Invalid format";
            isValid = false;
          }
        }

        if (
          field.validation.minLength &&
          value.length < field.validation.minLength
        ) {
          newErrors[field.id] =
            `At least ${field.validation.minLength} characters required`;
          isValid = false;
        }

        if (
          field.validation.maxLength &&
          value.length > field.validation.maxLength
        ) {
          newErrors[field.id] =
            `Maximum ${field.validation.maxLength} characters allowed`;
          isValid = false;
        }

        if (field.type === "number") {
          const numValue = Number(value);
          if (
            field.validation.min !== undefined &&
            numValue < field.validation.min
          ) {
            newErrors[field.id] = `Minimum value is ${field.validation.min}`;
            isValid = false;
          }
          if (
            field.validation.max !== undefined &&
            numValue > field.validation.max
          ) {
            newErrors[field.id] = `Maximum value is ${field.validation.max}`;
            isValid = false;
          }
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      console.log("Form submitted:", formValues);
      alert("Form submitted successfully!");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Form Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <PreviewField
                field={field}
                value={formValues[field.id]}
                onChange={(value) => handleInputChange(field.id, value)}
                error={errors[field.id]}
              />
            </div>
          ))}

          {fields.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">
              No fields added to the form yet.
            </div>
          )}
        </form>
      </CardContent>

      {fields.length > 0 && (
        <CardFooter>
          <Button type="submit" onClick={handleSubmit}>
            Submit
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

interface PreviewFieldProps {
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  error?: string;
}

function PreviewField({ field, value, onChange, error }: PreviewFieldProps) {
  switch (field.type) {
    case "text":
    case "email":
    case "password":
    case "tel":
    case "url":
      return (
        <>
          <Label
            htmlFor={field.id}
            className="flex items-baseline justify-between"
          >
            <span>
              {field.label}
              {field.validation?.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </span>
            {error && <span className="text-destructive text-xs">{error}</span>}
          </Label>
          <Input
            id={field.id}
            type={field.type}
            placeholder={field.placeholder}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className={error ? "border-destructive" : ""}
          />
        </>
      );
    case "number":
      return (
        <>
          <Label
            htmlFor={field.id}
            className="flex items-baseline justify-between"
          >
            <span>
              {field.label}
              {field.validation?.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </span>
            {error && <span className="text-destructive text-xs">{error}</span>}
          </Label>
          <Input
            id={field.id}
            type="number"
            placeholder={field.placeholder}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className={error ? "border-destructive" : ""}
          />
        </>
      );
    case "textarea":
      return (
        <>
          <Label
            htmlFor={field.id}
            className="flex items-baseline justify-between"
          >
            <span>
              {field.label}
              {field.validation?.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </span>
            {error && <span className="text-destructive text-xs">{error}</span>}
          </Label>
          <textarea
            id={field.id}
            placeholder={field.placeholder}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className={`flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground ${error ? "border-destructive" : ""}`}
            rows={3}
          />
        </>
      );
    case "checkbox":
      return (
        <div className="flex items-start space-x-2">
          <Checkbox
            id={field.id}
            checked={value || false}
            onCheckedChange={onChange}
          />
          <div className="grid gap-1.5 leading-none">
            <Label htmlFor={field.id} className="flex items-baseline gap-1">
              {field.label}
              {field.validation?.required && (
                <span className="text-destructive">*</span>
              )}
            </Label>
            {error && <p className="text-destructive text-xs">{error}</p>}
          </div>
        </div>
      );
    case "select":
      return (
        <>
          <Label
            htmlFor={field.id}
            className="flex items-baseline justify-between"
          >
            <span>
              {field.label}
              {field.validation?.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </span>
            {error && <span className="text-destructive text-xs">{error}</span>}
          </Label>
          <select
            id={field.id}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className={`flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground ${error ? "border-destructive" : ""}`}
          >
            <option value="">{field.placeholder || "Select an option"}</option>
            {field.options?.map((option, i) => (
              <option key={i} value={option}>
                {option}
              </option>
            ))}
          </select>
        </>
      );
    case "radio":
      return (
        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <Label>
              {field.label}
              {field.validation?.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            {error && <span className="text-destructive text-xs">{error}</span>}
          </div>
          <div className="space-y-2">
            {field.options?.map((option, i) => (
              <div key={i} className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={`${field.id}-${i}`}
                  name={field.id}
                  value={option}
                  checked={value === option}
                  onChange={(e) => onChange(e.target.value)}
                />
                <Label htmlFor={`${field.id}-${i}`}>{option}</Label>
              </div>
            ))}
          </div>
        </div>
      );
    default:
      return <div>Unsupported field type: {field.type}</div>;
  }
}

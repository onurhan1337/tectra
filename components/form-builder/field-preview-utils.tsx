"use client";

import React from "react";
import { FormField } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export function renderFieldPreview(field: FormField): React.ReactNode {
  switch (field.type) {
    case "text":
    case "email":
    case "number":
    case "url":
    case "tel":
    case "password":
      return (
        <div className="space-y-1">
          <Input
            type={field.type}
            placeholder={field.placeholder}
            disabled
            className="h-8 text-sm"
          />
        </div>
      );

    case "textarea":
      return (
        <textarea
          className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 min-h-[60px] max-h-[60px]"
          placeholder={field.placeholder}
          disabled
        />
      );

    case "select":
      return (
        <select
          className="flex h-8 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          disabled
        >
          <option value="" disabled selected>
            {field.placeholder || "Select an option"}
          </option>
          {(field as any).options?.map((option: string, i: number) => (
            <option key={i} value={option}>
              {option}
            </option>
          ))}
        </select>
      );

    case "checkbox":
      return (
        <div className="flex items-center space-x-2">
          <Checkbox id={`preview-${field.id}`} disabled />
          <label
            htmlFor={`preview-${field.id}`}
            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {field.label}
          </label>
        </div>
      );

    case "radio":
      return (
        <div className="space-y-1.5">
          {(field as any).options
            ?.slice(0, 2)
            .map((option: string, i: number) => (
              <div key={i} className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={`${field.id}-${i}`}
                  name={field.id}
                  disabled
                  className="h-4 w-4 rounded-full border border-input disabled:cursor-not-allowed disabled:opacity-50"
                />
                <Label htmlFor={`${field.id}-${i}`} className="text-sm">
                  {option}
                </Label>
              </div>
            ))}
          {((field as any).options?.length || 0) > 2 && (
            <div className="text-xs text-muted-foreground">
              +{((field as any).options?.length || 0) - 2} more options
            </div>
          )}
        </div>
      );

    case "date":
      return <Input type="date" disabled className="h-8 text-sm" />;

    case "file":
      return (
        <div className="flex h-8 w-full items-center rounded-md border border-input bg-transparent px-3 py-1 text-sm text-muted-foreground">
          Choose file...
        </div>
      );

    default:
      return (
        <div className="text-sm text-muted-foreground">
          Unsupported field type
        </div>
      );
  }
}

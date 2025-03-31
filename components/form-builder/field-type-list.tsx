"use client";

import {
  AlignJustify,
  Type,
  Mail,
  Hash,
  Key,
  Phone,
  Link as LinkIcon,
  List,
  CheckSquare,
  Circle,
  Calendar,
  File,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldType } from "@/lib/types";
import { cn } from "@/lib/utils";

interface FieldTypeListProps {
  onAddField: (type: string) => void;
}

interface FieldTypeItem {
  type: FieldType;
  icon: React.ReactNode;
  label: string;
  description: string;
}

export function FieldTypeList({ onAddField }: FieldTypeListProps) {
  const fieldTypes: FieldTypeItem[] = [
    {
      type: "text",
      icon: <Type className="h-4 w-4" />,
      label: "Text",
      description: "Short text input field",
    },
    {
      type: "textarea",
      icon: <AlignJustify className="h-4 w-4" />,
      label: "Text Area",
      description: "Multi-line text input",
    },
    {
      type: "email",
      icon: <Mail className="h-4 w-4" />,
      label: "Email",
      description: "Email address input with validation",
    },
    {
      type: "number",
      icon: <Hash className="h-4 w-4" />,
      label: "Number",
      description: "Numerical input with optional limits",
    },
    {
      type: "password",
      icon: <Key className="h-4 w-4" />,
      label: "Password",
      description: "Secure password input field",
    },
    {
      type: "tel",
      icon: <Phone className="h-4 w-4" />,
      label: "Phone",
      description: "Phone number input",
    },
    {
      type: "url",
      icon: <LinkIcon className="h-4 w-4" />,
      label: "URL",
      description: "Website or link input",
    },
    {
      type: "select",
      icon: <List className="h-4 w-4" />,
      label: "Dropdown",
      description: "Select from a list of options",
    },
    {
      type: "checkbox",
      icon: <CheckSquare className="h-4 w-4" />,
      label: "Checkbox",
      description: "Single checkbox for yes/no options",
    },
    {
      type: "radio",
      icon: <Circle className="h-4 w-4" />,
      label: "Radio Group",
      description: "Choose one from multiple options",
    },
    {
      type: "date",
      icon: <Calendar className="h-4 w-4" />,
      label: "Date",
      description: "Date picker input",
    },
    {
      type: "file",
      icon: <File className="h-4 w-4" />,
      label: "File Upload",
      description: "File or image upload field",
    },
  ];

  return (
    <div className="space-y-2">
      {fieldTypes.map((field) => (
        <div
          key={field.type}
          className={cn(
            "group relative rounded-lg border bg-card transition-all",
            "hover:border-primary/50 hover:shadow-sm",
            "focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
            "cursor-pointer"
          )}
          onClick={() => onAddField(field.type)}
          tabIndex={0}
          role="button"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onAddField(field.type);
            }
          }}
        >
          <div className="flex items-start space-x-3 p-3">
            <div
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-md border bg-muted/50",
                "text-muted-foreground",
                "group-hover:border-primary/50 group-hover:text-primary group-hover:bg-primary/5",
                "group-focus:border-primary group-focus:text-primary group-focus:bg-primary/5"
              )}
            >
              {field.icon}
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-medium leading-none">
                {field.label}
              </h4>
              <p className="text-xs text-muted-foreground">
                {field.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

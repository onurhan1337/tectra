"use client";

import {
  AlignJustify,
  Check,
  ChevronsUpDown,
  CircleDot,
  Calendar,
  FileUp,
  KeyRound,
  Link,
  Mail,
  Phone,
  Text,
  TextCursor,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface FieldPaletteProps {
  onAddField: (type: string) => void;
}

interface FieldTypeItem {
  type: string;
  icon: React.ReactNode;
  label: string;
  description: string;
}

export function FieldPalette({ onAddField }: FieldPaletteProps) {
  const fieldTypes: FieldTypeItem[] = [
    {
      type: "select",
      icon: <ChevronsUpDown className="h-4 w-4" />,
      label: "Dropdown",
      description: "Select from a list of options",
    },
    {
      type: "checkbox",
      icon: <Check className="h-4 w-4" />,
      label: "Checkbox",
      description: "Single checkbox for yes/no options",
    },
    {
      type: "radio",
      icon: <CircleDot className="h-4 w-4" />,
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
      icon: <FileUp className="h-4 w-4" />,
      label: "File Upload",
      description: "File or image upload field",
    },
    {
      type: "text",
      icon: <Text className="h-4 w-4" />,
      label: "Text Input",
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
      icon: <TextCursor className="h-4 w-4" />,
      label: "Number",
      description: "Numerical input with optional limits",
    },
    {
      type: "password",
      icon: <KeyRound className="h-4 w-4" />,
      label: "Password",
      description: "Secure password input field",
    },
    {
      type: "tel",
      icon: <Phone className="h-4 w-4" />,
      label: "Phone",
      description: "Phone number input field",
    },
    {
      type: "url",
      icon: <Link className="h-4 w-4" />,
      label: "URL",
      description: "Website URL input field",
    },
  ];

  const handleDragStart = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData("fieldType", type);
  };

  return (
    <div className="grid grid-cols-1 gap-3">
      {fieldTypes.map((field) => (
        <Button
          key={field.type}
          variant="outline"
          className="justify-start flex-col items-start h-auto py-3 px-4 w-full text-left"
          draggable
          onDragStart={(e) => handleDragStart(e, field.type)}
          onClick={() => onAddField(field.type)}
        >
          <div className="flex items-center w-full">
            <span className="flex items-center justify-center h-6 w-6 rounded-md bg-muted">
              {field.icon}
            </span>
            <span className="ml-2 font-medium">{field.label}</span>
          </div>
          <span className="text-xs text-muted-foreground mt-1">
            {field.description}
          </span>
        </Button>
      ))}
    </div>
  );
}

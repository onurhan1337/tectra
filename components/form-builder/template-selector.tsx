"use client";

import { useState } from "react";
import { FormTemplate } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FileText, Plus, ListPlus, Save } from "lucide-react";

const predefinedTemplates: FormTemplate[] = [
  {
    id: "contact-form",
    name: "Contact Form",
    description: "Standard contact form with name, email, and message fields",
    fields: [
      {
        id: "name",
        type: "text",
        label: "Full Name",
        placeholder: "Enter your full name",
        validation: {
          required: true,
        },
      },
      {
        id: "email",
        type: "email",
        label: "Email Address",
        placeholder: "your.email@example.com",
        validation: {
          required: true,
        },
      },
      {
        id: "phone",
        type: "tel",
        label: "Phone Number",
        placeholder: "Enter your phone number",
        validation: {
          required: false,
        },
      },
      {
        id: "message",
        type: "textarea",
        label: "Message",
        placeholder: "Type your message here...",
        validation: {
          required: true,
        },
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "survey-form",
    name: "Customer Survey",
    description:
      "Basic customer satisfaction survey with various question types",
    fields: [
      {
        id: "satisfaction",
        type: "select",
        label: "How satisfied are you with our service?",
        placeholder: "Select your satisfaction level",
        validation: {
          required: true,
        },
        options: [
          "Very Satisfied",
          "Satisfied",
          "Neutral",
          "Dissatisfied",
          "Very Dissatisfied",
        ],
      },
      {
        id: "recommend",
        type: "radio",
        label: "Would you recommend our product to others?",
        validation: {
          required: true,
        },
        options: ["Definitely", "Maybe", "Not sure", "No"],
      },
      {
        id: "improvements",
        type: "textarea",
        label: "What improvements would you suggest?",
        placeholder: "Your suggestions...",
        validation: {
          required: false,
        },
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "registration-form",
    name: "User Registration",
    description: "New user registration form with account details",
    fields: [
      {
        id: "username",
        type: "text",
        label: "Username",
        placeholder: "Choose a username",
        validation: {
          required: true,
        },
      },
      {
        id: "email",
        type: "email",
        label: "Email",
        placeholder: "your.email@example.com",
        validation: {
          required: true,
        },
      },
      {
        id: "password",
        type: "password",
        label: "Password",
        placeholder: "Create a password",
        validation: {
          required: true,
        },
      },
      {
        id: "confirm-password",
        type: "password",
        label: "Confirm Password",
        placeholder: "Confirm your password",
        validation: {
          required: true,
        },
      },
      {
        id: "terms",
        type: "checkbox",
        label: "I agree to the terms and conditions",
        validation: {
          required: true,
        },
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

interface TemplateSelectorProps {
  onSelectTemplate: (template: FormTemplate) => void;
}

export function TemplateSelector({ onSelectTemplate }: TemplateSelectorProps) {
  const [templates, setTemplates] = useState<FormTemplate[]>([
    ...predefinedTemplates,
  ]);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateDescription, setNewTemplateDescription] = useState("");
  const [showSaveSheet, setShowSaveSheet] = useState(false);

  const handleSaveNewTemplate = (template: FormTemplate) => {
    setTemplates([...templates, template]);
    setNewTemplateName("");
    setNewTemplateDescription("");
    setShowSaveSheet(false);
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Templates</h2>

        <Sheet open={showSaveSheet} onOpenChange={setShowSaveSheet}>
          <SheetTrigger asChild>
            <Button variant="outline">
              <Save className="mr-2 h-4 w-4" />
              Save Current Form
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Save Form Template</SheetTitle>
              <SheetDescription>
                Save your current form as a template for future use.
              </SheetDescription>
            </SheetHeader>
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="template-name">Template Name</Label>
                <Input
                  id="template-name"
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  placeholder="Enter a name for this template"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="template-description">Description</Label>
                <Input
                  id="template-description"
                  value={newTemplateDescription}
                  onChange={(e) => setNewTemplateDescription(e.target.value)}
                  placeholder="Describe the purpose of this template"
                />
              </div>
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button variant="outline">Cancel</Button>
              </SheetClose>
              <Button
                type="submit"
                disabled={!newTemplateName.trim()}
                onClick={() => {
                  // This would normally get the current form structure from a parent component
                  // For demo purposes, we'll create a simple template
                  const newTemplate: FormTemplate = {
                    id: `template-${Date.now()}`,
                    name: newTemplateName,
                    description: newTemplateDescription || "Custom template",
                    fields: [],
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  };
                  handleSaveNewTemplate(newTemplate);
                }}
              >
                Save Template
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                <CardTitle className="text-base">{template.name}</CardTitle>
              </div>
              <CardDescription className="text-xs">
                {template.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              <p>{template.fields.length} fields</p>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full text-sm"
                onClick={() => onSelectTemplate(template)}
              >
                Use Template
              </Button>
            </CardFooter>
          </Card>
        ))}

        <Card className="border-dashed hover:border-solid hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <Plus className="h-5 w-5 mr-2 text-muted-foreground" />
              Create New Template
            </CardTitle>
            <CardDescription className="text-xs">
              Start from scratch with a blank form
            </CardDescription>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            <p>Empty template</p>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="w-full text-sm"
              onClick={() => {
                const emptyTemplate: FormTemplate = {
                  id: `template-${Date.now()}`,
                  name: "New Form",
                  description: "Empty form template",
                  fields: [],
                  createdAt: new Date(),
                  updatedAt: new Date(),
                };
                onSelectTemplate(emptyTemplate);
              }}
            >
              Create Blank Form
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  Save,
  Eye,
  Settings,
  Undo,
  Redo,
  Trash2,
  MoreHorizontal,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormSchema, FormField, FormFieldSchema } from "@/lib/types";
import { FormBuilder } from "@/components/form-builder/form-builder";
import { FormPreview } from "@/components/form-builder/form-preview";
import { FormSettings } from "@/components/form-builder/form-settings";
import { createClient } from "@/utils/supabase/client";

const generateId = () =>
  `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const templates = {
  "contact-form": {
    name: "Contact Form",
    description: "Standard contact form with name, email, and message fields",
    fields: [
      {
        id: "name",
        type: "text",
        label: "Full Name",
        placeholder: "Enter your full name",
        validation: { required: true },
      },
      {
        id: "email",
        type: "email",
        label: "Email Address",
        placeholder: "your.email@example.com",
        validation: { required: true },
      },
      {
        id: "phone",
        type: "tel",
        label: "Phone Number",
        placeholder: "Enter your phone number",
      },
      {
        id: "message",
        type: "textarea",
        label: "Message",
        placeholder: "Type your message here...",
        validation: { required: true },
      },
    ],
  },
  "customer-feedback": {
    name: "Customer Feedback",
    description:
      "Collect feedback from customers about your products or services",
    fields: [
      {
        id: "name",
        type: "text",
        label: "Your Name",
        placeholder: "Enter your name",
        validation: { required: true },
      },
      {
        id: "email",
        type: "email",
        label: "Email Address",
        placeholder: "your.email@example.com",
        validation: { required: true },
      },
      {
        id: "rating",
        type: "select",
        label: "Rate your experience",
        validation: { required: true },
        options: ["Excellent", "Good", "Neutral", "Poor", "Very Poor"],
      },
      {
        id: "recommend",
        type: "radio",
        label: "Would you recommend us to others?",
        validation: { required: true },
        options: ["Definitely", "Maybe", "Probably Not", "No"],
      },
      {
        id: "feedback",
        type: "textarea",
        label: "Your Feedback",
        placeholder: "Please share your thoughts...",
        validation: { required: true },
      },
    ],
  },
};

export default function FormBuilderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get("template");

  const [activeTab, setActiveTab] = useState("editor");
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState<Form>({
    id: generateId(),
    name: "Untitled Form",
    description: "",
    fields: [],
    status: "draft",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const validatedForm = FormSchema.parse(form);

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Not authenticated");
      }

      const response = await fetch("/api/forms/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          form: {
            name: validatedForm.name,
            description: validatedForm.description,
            fields: validatedForm.fields,
          },
          templateId: templateId || undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save form");
      }

      router.push("/dashboard/forms");
    } catch (error) {
      console.error("Form save error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFormUpdate = (updates: Partial<Form>) => {
    setForm((prev) => ({
      ...prev,
      ...updates,
      updatedAt: new Date(),
    }));
  };

  const handleFieldUpdate = (fields: FormField[]) => {
    setForm((prev) => ({
      ...prev,
      fields,
      updatedAt: new Date(),
    }));
  };

  return (
    <div className="flex h-[calc(100vh-65px)] flex-col overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div className="space-y-1">
          <Link
            href="/dashboard/forms/create"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Templates
          </Link>
          <div className="flex items-center gap-3">
            <Input
              value={form.name}
              onChange={(e) => handleFormUpdate({ name: e.target.value })}
              className="text-2xl font-bold h-auto px-0 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
              placeholder="Untitled Form"
            />
            <Input
              value={form.description || ""}
              onChange={(e) =>
                handleFormUpdate({ description: e.target.value })
              }
              className="text-muted-foreground px-0 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
              placeholder="Add a form description..."
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setActiveTab("preview")}
            disabled={form.fields.length === 0}
          >
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || form.fields.length === 0}
          >
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Form
          </Button>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col overflow-hidden"
      >
        <div className="flex justify-between px-6 py-2">
          <TabsList>
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="preview" disabled={form.fields.length === 0}>
              Preview
            </TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <div className="flex items-center">
            <Button variant="ghost" size="icon" disabled>
              <Undo className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" disabled>
              <Redo className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="editor" className="h-full border-t">
            <FormBuilder
              fields={form.fields}
              onFieldsChange={handleFieldUpdate}
            />
          </TabsContent>

          <TabsContent value="preview" className="h-full p-6">
            <FormPreview fields={form.fields} />
          </TabsContent>

          <TabsContent value="settings" className="h-full p-6">
            <FormSettings form={form} onUpdate={handleFormUpdate} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

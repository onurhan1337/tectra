import { useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { BookTemplate, Copy, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FormTemplate, FormField } from "@/lib/types";
import { showToast } from "@/lib/toast";
import { createClient } from "@/utils/supabase/client";
import { renderFieldPreview } from "@/components/form-builder/field-preview-utils";

function FieldPreview({ field }: { field: FormField }) {
  return <div>{renderFieldPreview(field)}</div>;
}

interface TemplateDetailSheetProps {
  templateId: string;
  children: ReactNode;
  mutate?: () => void;
}

export function TemplateDetailSheet({
  templateId,
  children,
  mutate,
}: TemplateDetailSheetProps) {
  const router = useRouter();
  const [template, setTemplate] = useState<FormTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isCreatingForm, setIsCreatingForm] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchTemplate = async () => {
        setIsLoading(true);
        try {
          const supabase = createClient();
          const { data, error } = await supabase
            .from("form_templates")
            .select("*")
            .eq("id", templateId)
            .single();

          if (error) {
            throw error;
          }

          setTemplate({
            id: data.id,
            name: data.name,
            description: data.description || "",
            fields: data.fields || [],
            createdAt: new Date(data.created_at),
            updatedAt: new Date(data.updated_at),
          });
        } catch (error) {
          console.error("Error fetching template:", error);
          showToast.error("Failed to load template details");
        } finally {
          setIsLoading(false);
        }
      };
      fetchTemplate();
    }
  }, [templateId, isOpen]);

  const handleUseTemplate = async () => {
    setIsCreatingForm(true);
    try {
      if (!template) return;

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      // Get template data first (we already have it in the state but double check)
      const templateData = template || (await fetchTemplateData());

      // Create new form from template
      const { data, error } = await supabase
        .from("forms")
        .insert({
          created_by: user.id,
          name: `${templateData.name} Copy`,
          description: templateData.description,
          fields: templateData.fields,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      showToast.success("Form created from template");
      router.push(`/dashboard/forms/builder?id=${data.id}`);
      setIsOpen(false);
    } catch (error) {
      console.error("Error creating form from template:", error);
      showToast.error("Failed to create form from template");
    } finally {
      setIsCreatingForm(false);
    }
  };

  // Helper function to fetch template data if needed
  const fetchTemplateData = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("form_templates")
      .select("*")
      .eq("id", templateId)
      .single();

    if (error) {
      throw error;
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description || "",
      fields: data.fields || [],
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="flex items-center">
            <BookTemplate className="mr-2 h-5 w-5" />
            Template Details
          </SheetTitle>
          <SheetDescription>View and use this template</SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : template ? (
          <div className="space-y-6 py-6">
            <div>
              <h3 className="text-xl font-semibold">{template.name}</h3>
              <p className="text-muted-foreground text-sm mt-1">
                {template.description || "No description"}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Fields</h4>
              <div className="space-y-3 border rounded-md p-3 max-h-64 overflow-y-auto">
                {template.fields.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No fields</p>
                ) : (
                  template.fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="border rounded-md p-3 bg-background"
                    >
                      <FieldPreview field={field} />
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="default"
                className="flex-1"
                onClick={handleUseTemplate}
                disabled={isCreatingForm}
              >
                {isCreatingForm ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Copy className="mr-2 h-4 w-4" />
                )}
                Use Template
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-6 text-center">
            <p className="text-muted-foreground">Template not found</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

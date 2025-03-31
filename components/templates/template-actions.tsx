"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MoreVertical, Trash, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { showToast } from "@/lib/toast";
import { createClient } from "@/utils/supabase/client";

export function TemplateItemActions({
  templateId,
  mutate,
}: {
  templateId: string;
  mutate?: () => void;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    const deleteTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    try {
      showToast.promise(
        new Promise<boolean>((resolve, reject) => {
          showToast.message("Template will be deleted", {
            action: {
              label: "Undo",
              onClick: () => {
                if (deleteTimeoutRef.current) {
                  clearTimeout(deleteTimeoutRef.current);
                  deleteTimeoutRef.current = null;
                  setIsLoading(false);
                  showToast.success("Deletion canceled");
                  reject(new Error("Deletion canceled"));
                }
              },
            },
            duration: 5000,
          });

          deleteTimeoutRef.current = setTimeout(async () => {
            try {
              // Delete template directly with Supabase client
              const supabase = createClient();
              const { error } = await supabase
                .from("form_templates")
                .delete()
                .eq("id", templateId);

              if (error) {
                throw error;
              }

              if (mutate) {
                mutate();
              }
              resolve(true);
            } catch (error) {
              reject(error);
            } finally {
              setIsLoading(false);
              deleteTimeoutRef.current = null;
            }
          }, 5000);
        }),
        {
          loading: "Deleting template...",
          success: "Template deleted successfully",
          error: "Failed to delete template",
        }
      );
    } catch (error) {
      showToast.error("Failed to delete template");
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleUseTemplate = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      // Get template data
      const { data: templateData, error: templateError } = await supabase
        .from("form_templates")
        .select("*")
        .eq("id", templateId)
        .single();

      if (templateError) {
        throw templateError;
      }

      // Create new form from template
      const { data, error } = await supabase
        .from("forms")
        .insert({
          created_by: user.id,
          name: "New Form from Template",
          description: templateData.description || "",
          fields: templateData.fields || [],
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      showToast.success("Form created from template");
      router.push(`/dashboard/forms/builder?id=${data.id}`);
    } catch (error) {
      showToast.error("Failed to create form from template");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 text-muted-foreground">
            <span className="sr-only">Open menu</span>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={handleUseTemplate} disabled={isLoading}>
            <FileText className="mr-2 h-4 w-4" />
            Use Template
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleDelete}
            disabled={isLoading}
            className="text-destructive focus:text-destructive"
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

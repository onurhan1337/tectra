import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookTemplate, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast";

interface SaveAsTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formId: string;
  formName: string;
  formDescription: string;
  onSuccess?: () => void;
}

export function SaveAsTemplateDialog({
  open,
  onOpenChange,
  formId,
  formName,
  formDescription,
  onSuccess,
}: SaveAsTemplateDialogProps) {
  const router = useRouter();
  const [name, setName] = useState(formName ? `${formName} Template` : "");
  const [description, setDescription] = useState(formDescription || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast.error("Template name is required");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/templates/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formId,
          name,
          description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create template");
      }

      showToast.success("Template created successfully");

      if (onSuccess) {
        onSuccess();
      }

      onOpenChange(false);

      // Optionally navigate to templates page
      router.push("/dashboard/templates");
    } catch (error) {
      console.error("Error creating template:", error);
      showToast.error("Failed to create template");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookTemplate className="h-5 w-5" />
              Save as Template
            </DialogTitle>
            <DialogDescription>
              Create a reusable template from this form's structure
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="template-name" className="text-sm font-medium">
                Template Name
              </Label>
              <Input
                id="template-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter a name for this template"
                disabled={isLoading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="template-description"
                className="text-sm font-medium"
              >
                Description
              </Label>
              <Textarea
                id="template-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the purpose of this template"
                disabled={isLoading}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !name.trim()}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Template"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

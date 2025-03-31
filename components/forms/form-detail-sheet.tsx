import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/forms/status-badge";
import {
  CheckCircle,
  AlertCircle,
  Edit,
  ExternalLink,
  Share2,
  ChevronRight,
  Save,
  BookTemplate,
  Loader2,
} from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { cn } from "@/lib/utils";
import { useForm, useUpdateFormStatus } from "@/lib/hooks/use-forms";
import { FormStatus } from "@/lib/types";
import { SaveAsTemplateDialog } from "@/components/templates/save-as-template-dialog";

interface FormDetailSheetProps {
  formId: string;
  children: React.ReactNode;
  side?: "left" | "right" | "top" | "bottom";
  onOpenChange?: (open: boolean) => void;
  mutate?: () => void;
}

export function FormDetailSheet({
  formId,
  children,
  side = "right",
  onOpenChange,
  mutate,
}: FormDetailSheetProps) {
  const router = useRouter();
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [saveAsTemplateOpen, setSaveAsTemplateOpen] = useState(false);

  // Use React Query hooks
  const { data: form, isLoading, refetch } = useForm(formId);

  const updateFormStatus = useUpdateFormStatus();

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleStatusChange = async (newStatus: FormStatus) => {
    if (!form || form.status === newStatus) return;

    try {
      await updateFormStatus.mutateAsync({
        formId: form.id,
        status: newStatus,
      });

      setNotification({
        type: "success",
        message:
          newStatus === "published"
            ? "Your form is now published and available for submissions."
            : `Form status changed to ${newStatus}.`,
      });

      // Refetch to get latest data
      refetch();

      if (mutate) {
        mutate();
      }
    } catch (error) {
      console.error("Error updating form status:", error);
      setNotification({
        type: "error",
        message: "Failed to update form status. Please try again.",
      });
    }
  };

  const handleSheetOpenChange = (open: boolean) => {
    if (open) {
      refetch();
    }

    if (!open && mutate) {
      mutate();
    }

    if (onOpenChange) {
      onOpenChange(open);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-amber-500";
      case "published":
        return "bg-green-500";
      case "archived":
        return "bg-gray-400";
      default:
        return "bg-gray-300";
    }
  };

  return (
    <Sheet onOpenChange={handleSheetOpenChange}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        side={side}
        className="sm:max-w-md w-full overflow-y-auto p-0 border-l shadow-md"
      >
        {isLoading ? (
          <>
            <SheetHeader className="p-6 border-b border-border/40">
              <SheetTitle>
                <VisuallyHidden>Loading form details</VisuallyHidden>
              </SheetTitle>
            </SheetHeader>
            <div className="h-[70vh] flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
            </div>
          </>
        ) : !form ? (
          <>
            <SheetHeader className="p-6 border-b border-border/40">
              <SheetTitle>
                <VisuallyHidden>Form Not Found</VisuallyHidden>
              </SheetTitle>
            </SheetHeader>
            <div className="h-[70vh] flex flex-col items-center justify-center px-6">
              <div className="bg-amber-50 border border-amber-100 text-amber-800 px-5 py-4 rounded-lg mb-4 text-sm max-w-[280px] text-center">
                <AlertCircle className="h-5 w-5 mx-auto mb-2 opacity-70" />
                <p>Form not found or you don't have permission to view it.</p>
              </div>
              <SheetClose asChild>
                <Button variant="outline" size="sm">
                  Close
                </Button>
              </SheetClose>
            </div>
          </>
        ) : (
          <div className="flex flex-col h-full bg-white">
            {/* Header */}
            <div className="border-b border-border/40">
              <SheetHeader className="p-6 pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <StatusBadge status={form.status} />
                </div>
                <SheetTitle className="text-xl font-medium leading-tight">
                  {form.name}
                </SheetTitle>
                {form.description && (
                  <SheetDescription className="text-sm mt-1 line-clamp-2">
                    {form.description}
                  </SheetDescription>
                )}
              </SheetHeader>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {notification && (
                <div
                  className={`mx-6 mt-4 p-3 rounded-lg flex items-center gap-3 ${
                    notification.type === "success"
                      ? "bg-green-50 text-green-800"
                      : "bg-red-50 text-red-800"
                  }`}
                >
                  {notification.type === "success" ? (
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
                  )}
                  <p className="text-sm font-medium">{notification.message}</p>
                </div>
              )}

              <div className="px-6 py-4 space-y-6">
                {/* Status selector */}
                <div className="mb-4">
                  <Label
                    htmlFor="form-status"
                    className="text-sm font-medium mb-1.5 block"
                  >
                    Status
                  </Label>

                  <div className="relative">
                    <Select
                      value={form.status}
                      onValueChange={handleStatusChange}
                      disabled={updateFormStatus.isPending}
                    >
                      <SelectTrigger
                        id="form-status"
                        className="bg-background border-border/40 w-full"
                      >
                        <div className="flex items-center">
                          <div
                            className={cn(
                              "h-2.5 w-2.5 rounded-full mr-2",
                              getStatusColor(form.status)
                            )}
                          ></div>
                          <span>{form.status}</span>
                        </div>
                      </SelectTrigger>

                      <SelectContent
                        position="popper"
                        className="w-[var(--radix-select-trigger-width)] border border-border/40 shadow-md p-0"
                        align="start"
                      >
                        <SelectItem
                          value="published"
                          className="py-2.5 pl-8 pr-2 focus:bg-muted/10 rounded-none border-b border-border/5"
                        >
                          <div className="flex items-center">
                            <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                            <span>Published</span>
                          </div>
                        </SelectItem>
                        <SelectItem
                          value="draft"
                          className="py-2.5 pl-8 pr-2 focus:bg-muted/10 rounded-none border-b border-border/5"
                        >
                          <div className="flex items-center">
                            <div className="h-2.5 w-2.5 rounded-full bg-amber-500 mr-2"></div>
                            <span>Draft</span>
                          </div>
                        </SelectItem>
                        <SelectItem
                          value="archived"
                          className="py-2.5 pl-8 pr-2 focus:bg-muted/10 rounded-none"
                        >
                          <div className="flex items-center">
                            <div className="h-2.5 w-2.5 rounded-full bg-gray-400 mr-2"></div>
                            <span>Archived</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <p
                    className={cn(
                      "mt-2 text-xs",
                      form.status === "draft"
                        ? "text-amber-600"
                        : form.status === "published"
                          ? "text-green-600"
                          : "text-gray-500"
                    )}
                  >
                    {form.status === "draft"
                      ? "Draft forms are only accessible to you"
                      : form.status === "published"
                        ? "Published forms are accessible via link or embed"
                        : "Archived forms are no longer accessible"}
                  </p>
                </div>

                {/* Quick actions */}
                <div className="space-y-2.5">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full justify-between border-border/40 h-11 hover:bg-muted/10"
                  >
                    <Link href={`/dashboard/forms/builder?id=${form.id}`}>
                      <div className="flex items-center">
                        <div className="bg-primary/5 p-1.5 rounded-md mr-3">
                          <Edit className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-medium">Edit Form</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-between border-border/40 h-11 hover:bg-muted/10"
                  >
                    <div className="flex items-center">
                      <div className="bg-primary/5 p-1.5 rounded-md mr-3">
                        <Share2 className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-medium">Share Form</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-between border-border/40 h-11 hover:bg-muted/10"
                  >
                    <div className="flex items-center">
                      <div className="bg-primary/5 p-1.5 rounded-md mr-3">
                        <ExternalLink className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-medium">Preview</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-between border-border/40 h-11 hover:bg-muted/10"
                    onClick={() => setSaveAsTemplateOpen(true)}
                  >
                    <div className="flex items-center">
                      <div className="bg-primary/5 p-1.5 rounded-md mr-3">
                        <BookTemplate className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-medium">Save as Template</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              </div>
            </div>

            <SheetFooter className="px-6 py-4 border-t border-border/40 mt-auto">
              <SheetClose asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-border/40"
                >
                  Close
                </Button>
              </SheetClose>
            </SheetFooter>
          </div>
        )}
      </SheetContent>

      {form && (
        <SaveAsTemplateDialog
          open={saveAsTemplateOpen}
          onOpenChange={setSaveAsTemplateOpen}
          formId={form.id}
          formName={form.name}
          formDescription={form.description || ""}
          onSuccess={() => {
            setNotification({
              type: "success",
              message: "Template created successfully",
            });
          }}
        />
      )}
    </Sheet>
  );
}

"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { MoreHorizontal, Eye, Edit, Trash, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "./status-badge";
import { FormDetailSheet } from "./form-detail-sheet";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { showToast } from "@/lib/toast";

interface FormData {
  id: string;
  name: string;
  description: string;
  status: string;
  submissions: number;
  lastSubmission: string | null;
}

interface FormCardProps {
  form: FormData;
  mutate?: () => void;
}

export function FormCard({ form, mutate }: FormCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const deleteTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const formattedDate = form.lastSubmission
    ? new Date(form.lastSubmission).toLocaleDateString()
    : null;

  const deleteFormClient = async (formId: string) => {
    const supabase = createClient();

    const { error } = await supabase.from("forms").delete().eq("id", formId);

    if (error) {
      throw new Error(`Failed to delete form: ${error.message}`);
    }

    return true;
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleting(true);

    showToast.promise(
      new Promise<boolean>((resolve, reject) => {
        showToast.message(`Deleting form "${form.name}"...`, {
          description:
            "This action will delete the form and all its submissions.",
          action: {
            label: "Undo",
            onClick: () => {
              if (deleteTimeoutRef.current) {
                clearTimeout(deleteTimeoutRef.current);
                deleteTimeoutRef.current = null;
                setIsDeleting(false);
                showToast.success(`Deletion of "${form.name}" canceled`);
                reject(new Error("Deletion canceled"));
              }
            },
          },
          duration: 5000,
        });

        deleteTimeoutRef.current = setTimeout(async () => {
          try {
            await deleteFormClient(form.id);
            setIsDeleting(false);
            deleteTimeoutRef.current = null;

            if (mutate) {
              mutate();
            } else {
              router.refresh();
            }
            resolve(true);
          } catch (error) {
            console.error("Error deleting form:", error);
            setIsDeleting(false);
            deleteTimeoutRef.current = null;
            reject(error);
          }
        }, 5000);
      }),
      {
        loading: `Deleting form "${form.name}"...`,
        success: `Form "${form.name}" deleted successfully`,
        error: `Failed to delete form`,
      }
    );
  };

  return (
    <FormDetailSheet formId={form.id} mutate={mutate}>
      <div className="cursor-pointer w-full h-full">
        <Card className="flex flex-col border border-border/40 hover:border-primary/20 transition-all hover:shadow-sm h-full">
          <CardHeader className="pb-1 pt-3 px-3 space-y-1">
            <div className="flex justify-between items-start mb-1">
              <StatusBadge
                status={form.status}
                className="hover:cursor-pointer"
              />

              <div onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[160px]">
                    <Link href={`/dashboard/forms/${form.id}/preview`} passHref>
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                      </DropdownMenuItem>
                    </Link>
                    <Link
                      href={`/dashboard/forms/builder?id=${form.id}`}
                      passHref
                    >
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem>
                      <FileDown className="mr-2 h-4 w-4" />
                      Export
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={handleDelete}
                      disabled={isDeleting}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      {isDeleting ? "Deleting..." : "Delete"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <CardTitle className="text-sm">{form.name}</CardTitle>
            <CardDescription className="line-clamp-1 text-xs">
              {form.description}
            </CardDescription>
          </CardHeader>

          <CardContent className="pb-3 pt-0 px-3 mt-auto">
            <div className="grid grid-cols-2 gap-2 text-xs bg-secondary/20 rounded-md p-2">
              <div className="flex flex-col">
                <p className="text-muted-foreground text-[10px]">Submissions</p>
                <p className="font-medium">{form.submissions}</p>
              </div>
              <div className="flex flex-col">
                <p className="text-muted-foreground text-[10px]">
                  Last activity
                </p>
                <p className="font-medium text-xs">{formattedDate || "—"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </FormDetailSheet>
  );
}

import Link from "next/link";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash,
  FileDown,
  Settings,
} from "lucide-react";
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
import { cn } from "@/lib/utils";

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
  const formattedDate = form.lastSubmission
    ? new Date(form.lastSubmission).toLocaleDateString()
    : null;

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
                    <DropdownMenuItem className="text-destructive">
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
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

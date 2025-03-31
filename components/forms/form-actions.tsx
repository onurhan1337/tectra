import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash,
  FileDown,
  Settings,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FormDetailSheet } from "./form-detail-sheet";

export function FormActions() {
  return (
    <div className="flex items-center gap-2">
      <Button asChild>
        <Link href="/dashboard/forms/create">
          <Plus className="mr-2 h-4 w-4" />
          Create Form
        </Link>
      </Button>
    </div>
  );
}

interface FormItemActionsProps {
  formId: string;
  mutate?: () => void;
}

export function FormItemActions({ formId, mutate }: FormItemActionsProps) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <Link href={`/dashboard/forms/${formId}/preview`} passHref>
          <DropdownMenuItem>
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </DropdownMenuItem>
        </Link>
        <Link href={`/dashboard/forms/builder?id=${formId}`} passHref>
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
  );
}

import Link from "next/link";
import { Plus, Inbox } from "lucide-react";
import { FormCard } from "./form-card";
import { CreateFormCard } from "./create-form-card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { FormItemActions } from "./form-actions";
import { FormDetailSheet } from "./form-detail-sheet";
import { StatusBadge } from "./status-badge";

interface FormData {
  id: string;
  name: string;
  description: string;
  status: string;
  submissions: number;
  lastSubmission: string | null;
}

interface FormsListProps {
  forms: FormData[];
  isLoading?: boolean;
  mutate?: () => void;
}

function FormCardSkeleton() {
  return (
    <div className="flex flex-col space-y-3 border border-border/40 p-3 rounded-lg">
      <div className="flex justify-between items-start">
        <Skeleton className="h-5 w-20 rounded-md" />
        <Skeleton className="h-6 w-6 rounded-full" />
      </div>
      <Skeleton className="h-4 w-full rounded-md" />
      <Skeleton className="h-3 w-3/4 rounded-md" />
      <div className="grid grid-cols-2 gap-2 mt-2 bg-secondary/20 rounded-md p-2">
        <div className="flex flex-col space-y-1">
          <Skeleton className="h-2 w-16 rounded-md" />
          <Skeleton className="h-3 w-8 rounded-md" />
        </div>
        <div className="flex flex-col space-y-1">
          <Skeleton className="h-2 w-16 rounded-md" />
          <Skeleton className="h-3 w-12 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export function FormsList({
  forms,
  isLoading = false,
  mutate,
}: FormsListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {[...Array(4)].map((_, index) => (
          <FormCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (forms.length === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title="No pending forms here, yet"
        description="Your forms will appear here"
        actionLink="/dashboard/forms/create"
        actionLabel="Create Form"
        actionIcon={Plus}
      />
    );
  }

  return (
    <div>
      <div className="md:hidden space-y-2">
        {forms.map((form) => (
          <div
            key={form.id}
            className="flex items-center justify-between border rounded-md p-3"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <StatusBadge status={form.status} />
              </div>
              <FormDetailSheet formId={form.id} mutate={mutate}>
                <button className="text-left block truncate font-medium text-sm hover:underline">
                  {form.name}
                </button>
              </FormDetailSheet>
              <p className="text-xs text-muted-foreground truncate">
                {form.description || "No description"}
              </p>
            </div>
            <FormItemActions formId={form.id} mutate={mutate} />
          </div>
        ))}
        <Link
          href="/dashboard/forms/create"
          className="flex items-center justify-center p-4 border border-dashed rounded-md"
        >
          <button className="flex items-center text-primary text-sm">
            <Plus className="mr-2 h-4 w-4" />
            Create new form
          </button>
        </Link>
      </div>

      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {forms.map((form) => (
          <FormCard key={form.id} form={form} mutate={mutate} />
        ))}
        <CreateFormCard />
      </div>
    </div>
  );
}

import { Plus, BookTemplate } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { TemplateItemActions } from "@/components/templates/template-actions";
import { TemplateDetailSheet } from "@/components/templates/template-detail-sheet";
import { TemplateCard } from "@/components/templates/template-card";
import { Badge } from "@/components/ui/badge";

interface TemplateData {
  id: string;
  name: string;
  description: string;
  fields: any[];
  createdAt: string;
  updatedAt: string;
}

interface TemplatesListProps {
  templates: TemplateData[];
  isLoading?: boolean;
  mutate?: () => void;
}

function TemplateCardSkeleton() {
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

export function TemplatesList({
  templates,
  isLoading = false,
  mutate,
}: TemplatesListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {[...Array(4)].map((_, index) => (
          <TemplateCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <EmptyState
        icon={BookTemplate}
        title="No templates here, yet"
        description="Templates will be created when you save a form as template"
        actionLink="/dashboard/forms"
        actionLabel="Create Form"
        actionIcon={Plus}
      />
    );
  }

  return (
    <div>
      <div className="md:hidden space-y-2">
        {templates.map((template) => (
          <div
            key={template.id}
            className="flex flex-col border border-slate-100 rounded-lg overflow-hidden bg-zinc-950"
          >
            <div className="flex items-center gap-1 px-3 py-1 border-b border-zinc-800 bg-black">
              <BookTemplate className="h-3.5 w-3.5 text-purple-400" />
              <span className="text-xs font-medium text-zinc-300">
                Template
              </span>
              <span className="ml-auto text-xs text-zinc-500">
                {template.fields.length} fields
              </span>
            </div>

            <div className="p-3">
              <div className="flex items-center justify-between">
                <TemplateDetailSheet templateId={template.id} mutate={mutate}>
                  <h3 className="block truncate font-medium text-sm text-zinc-100 hover:underline">
                    {template.name}
                  </h3>
                </TemplateDetailSheet>
                <TemplateItemActions templateId={template.id} mutate={mutate} />
              </div>
              <p className="text-xs text-zinc-400 truncate mt-1">
                {template.description || "No description"}
              </p>

              <div className="flex flex-wrap gap-1 my-2">
                {["Custom", "Personal"].map((tag, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="text-xs py-0.5 px-1.5 font-normal bg-zinc-800 border-0 text-zinc-400"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
        {templates.map((template) => (
          <TemplateCard key={template.id} template={template} mutate={mutate} />
        ))}
      </div>
    </div>
  );
}

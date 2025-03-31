import { Crown, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { PremiumTemplateCard } from "@/components/templates/premium-template-card";
import { Button } from "@/components/ui/button";
import { AddCreditsDialog } from "@/components/add-credits-dialog";
import { Separator } from "../ui/separator";

interface TemplateData {
  id: string;
  name: string;
  description: string;
  fields: any[];
  createdAt: string;
  updatedAt: string;
  isPremium?: boolean;
  price?: number;
  previewImageUrl?: string;
}

interface PremiumTemplatesListProps {
  templates: TemplateData[];
  userId: string;
  userCredits: number;
  purchasedTemplateIds: string[];
  isLoading?: boolean;
  mutate?: () => void;
}

function PremiumTemplateCardSkeleton() {
  return (
    <div className="flex flex-col h-full overflow-hidden border border-slate-100 rounded-lg">
      <div className="flex items-center gap-1 px-3 py-1 border-b border-zinc-200 dark:border-zinc-800">
        <Skeleton className="h-3.5 w-16 rounded-md bg-zinc-800" />
        <Skeleton className="h-3.5 w-16 rounded-md bg-zinc-800 ml-auto" />
      </div>

      <div className="flex flex-col items-center justify-center pt-8 pb-4 px-4">
        <Skeleton className="mb-4 h-10 w-10 rounded-md bg-zinc-800" />
        <Skeleton className="h-4 w-32 rounded-md bg-zinc-800 mb-1" />
        <Skeleton className="h-3 w-40 rounded-md bg-zinc-800" />
      </div>

      <div className="px-3 pt-2 pb-3">
        <div className="flex flex-wrap gap-1 mb-3">
          <Skeleton className="h-5 w-20 rounded-md bg-zinc-800" />
          <Skeleton className="h-5 w-24 rounded-md bg-zinc-800" />
          <Skeleton className="h-5 w-16 rounded-md bg-zinc-800" />
        </div>

        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-3 w-14 rounded-md bg-zinc-800" />
        </div>
        <Skeleton className="h-7 w-full rounded-md bg-zinc-800" />
      </div>
    </div>
  );
}

export function PremiumTemplatesList({
  templates,
  userId,
  userCredits,
  purchasedTemplateIds,
  isLoading = false,
  mutate,
}: PremiumTemplatesListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, index) => (
          <PremiumTemplateCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <EmptyState
        icon={Crown}
        title="No premium templates available"
        description="Premium templates will be available soon"
      />
    );
  }

  return (
    <div className="space-y-2">
      <Separator className="my-4" />
      <div className="flex items-center justify-between pb-2">
        <div className="flex items-center gap-1.5">
          <h2 className="text-sm font-medium">Premium Templates</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <PremiumTemplateCard
            key={template.id}
            template={template}
            userId={userId}
            userCredits={userCredits}
            isPurchased={purchasedTemplateIds.includes(template.id)}
            mutate={mutate}
          />
        ))}
      </div>
    </div>
  );
}

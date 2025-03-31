import { useState } from "react";
import Link from "next/link";
import { CheckCircle, LockIcon, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { purchaseTemplate } from "@/lib/services/credit-service";
import { showToast } from "@/lib/toast";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
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

interface PremiumTemplateCardProps {
  template: TemplateData;
  userId: string;
  userCredits: number;
  isPurchased?: boolean;
  mutate?: () => void;
}

export function PremiumTemplateCard({
  template,
  userId,
  userCredits,
  isPurchased = false,
  mutate,
}: PremiumTemplateCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [purchased, setPurchased] = useState(isPurchased);
  const hasEnoughCredits = userCredits >= (template.price || 0);

  const handlePurchase = async () => {
    if (!userId) {
      showToast.error("You must be logged in to purchase templates");
      return;
    }

    if (!hasEnoughCredits) {
      showToast.error(
        "You don't have enough credits to purchase this template"
      );
      return;
    }

    setIsLoading(true);

    try {
      const result = await purchaseTemplate(
        userId,
        template.id,
        template.price || 0
      );

      if (result) {
        setPurchased(true);
        if (mutate) mutate();
      }
    } catch (error) {
      console.error("Failed to purchase template:", error);
      showToast.error("Failed to purchase template");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden border border-slate-200 dark:border-zinc-800 rounded-lg shadow-sm">
      <div className="flex items-center gap-1 px-3 py-1 border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900">
        <Sparkles className="h-3.5 w-3.5 text-orange-500 dark:text-orange-400" />
        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
          Premium
        </span>
        <span className="ml-auto text-xs text-slate-500 dark:text-slate-400">
          {template.fields.length} fields
        </span>
      </div>

      <div className="flex flex-col p-4">
        <h3 className="font-semibold text-base text-slate-800 dark:text-slate-200">
          {template.name}
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
          {template.description || "No description"}
        </p>
      </div>

      <div className="mt-auto">
        <div className="border-t border-slate-100 dark:border-zinc-800 p-4 pb-2">
          <div className="flex flex-wrap gap-1 mb-3">
            {["Advanced", "Time-saving", "Professional"].map((tag, i) => (
              <Badge
                key={i}
                variant="secondary"
                className="text-xs py-0.5 px-1.5 font-normal bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-slate-300 border-0"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="px-4 pb-4">
          <div className="font-mono text-xs flex items-baseline mb-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {template.price} credits
            </span>
            {purchased && (
              <Badge
                variant="outline"
                className="ml-2 text-xs border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-slate-300"
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                <span>Owned</span>
              </Badge>
            )}
          </div>

          {purchased ? (
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs h-9 border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-800 dark:text-slate-200"
              asChild
            >
              <Link href={`/dashboard/forms/builder?template=${template.id}`}>
                Use Template
              </Link>
            </Button>
          ) : (
            <Button
              variant={hasEnoughCredits ? "outline" : "outline"}
              size="sm"
              className={cn(
                "w-full text-xs h-9",
                hasEnoughCredits
                  ? "border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-800 dark:text-slate-200"
                  : "border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-800 cursor-not-allowed"
              )}
              disabled={isLoading || !hasEnoughCredits}
              onClick={handlePurchase}
            >
              {isLoading ? (
                <>
                  <Skeleton className="h-3 w-3 rounded-full mr-2" />
                  Processing...
                </>
              ) : hasEnoughCredits ? (
                "Purchase Template"
              ) : (
                "Need More Credits"
              )}
              {!hasEnoughCredits && <LockIcon className="h-3 w-3 ml-2" />}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

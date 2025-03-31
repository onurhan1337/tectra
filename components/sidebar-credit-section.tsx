import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreditCard, Sparkles } from "lucide-react";
import { useUserCredits } from "@/lib/hooks/use-user-credits";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/lib/hooks";
import { AddCreditsDialog } from "@/components/add-credits-dialog";
import { cn } from "@/lib/utils";

export function SidebarCreditSection() {
  const { user } = useUser();
  const { credits, isLoading, mutate } = useUserCredits(user?.id);

  return (
    <Card className="border border-slate-200 dark:border-zinc-800 dark:bg-zinc-900 bg-background">
      <CardHeader className="pb-3 pt-4 px-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium dark:text-white">
            Credits
          </CardTitle>
          <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-transparent px-2.5 py-1 rounded-md">
            <Sparkles size={14} className="text-blue-500" />
            {isLoading ? (
              <Skeleton className="h-4 w-10 dark:bg-zinc-800" />
            ) : (
              <span className="text-sm font-medium">{credits}</span>
            )}
          </div>
        </div>
        <CardDescription className="text-xs text-muted-foreground dark:text-zinc-400">
          Used for premium templates and features
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <AddCreditsDialog
          trigger={
            <Button
              className={cn(
                "w-full font-mono text-xs tracking-wide",
                "bg-slate-200/60 hover:bg-slate-200/80 text-slate-900 font-mono border border-dashed border-slate-400",
                "dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-200 dark:border-0"
              )}
              size="sm"
            >
              <CreditCard size={14} className="mr-2 dark:opacity-70" />
              ADD CREDITS
            </Button>
          }
          onCreditsAdded={() => mutate()}
        />
      </CardContent>
    </Card>
  );
}

import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLink?: string;
  actionLabel?: string;
  actionIcon?: LucideIcon;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLink,
  actionLabel,
  actionIcon: ActionIcon,
}: EmptyStateProps) {
  return (
    <div className="border border-dashed rounded-lg flex flex-col items-center justify-center min-h-[500px] py-20 text-center">
      <div className="relative mb-3">
        <div className="absolute inset-0 bg-primary/5 dark:bg-primary/10 rounded-full scale-150 blur-sm"></div>
        <div className="relative rounded-lg p-2 ring-2 ring-border/40 ring-offset-2 ring-offset-background bg-background border shadow-sm">
          <Icon className="h-10 w-10 text-muted-foreground" strokeWidth={1.5} />
        </div>
      </div>
      <h3 className="text-xl font-mono font-normal tracking-tight mb-2">
        {title}
      </h3>
      <p className="text-muted-foreground mb-8 tracking-tight">{description}</p>
      {actionLink && actionLabel && (
        <Link href={actionLink}>
          <Button
            variant="outline"
            className="gap-2 px-10 font-mono tracking-tight text-sm transition-all"
          >
            {ActionIcon && <ActionIcon className="h-4 w-4" />}
            {actionLabel}
          </Button>
        </Link>
      )}
    </div>
  );
}

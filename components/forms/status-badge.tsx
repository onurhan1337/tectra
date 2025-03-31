import { Check, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const isPublished = status === "published";

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        isPublished
          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
          : "border border-amber-300 text-amber-800 dark:text-amber-300",
        className
      )}
    >
      {isPublished ? (
        <Check className="h-2.5 w-2.5 mr-1 inline" />
      ) : (
        <Clock className="h-2.5 w-2.5 mr-1 inline" />
      )}
      {status}
    </div>
  );
}

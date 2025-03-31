import Link from "next/link";
import { BookTemplate } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TemplateDetailSheet } from "@/components/templates/template-detail-sheet";
import { TemplateItemActions } from "@/components/templates/template-actions";
import { Badge } from "@/components/ui/badge";

interface TemplateData {
  id: string;
  name: string;
  description: string;
  fields: any[];
  createdAt: string;
  updatedAt: string;
}

interface TemplateCardProps {
  template: TemplateData;
  mutate?: () => void;
}

export function TemplateCard({ template, mutate }: TemplateCardProps) {
  // Remove debug and mock usage count
  return (
    <Card className="flex flex-col h-full overflow-hidden border border-slate-200 dark:border-zinc-800 rounded-lg shadow-sm relative">
      <div className="flex items-center gap-1 px-3 py-1 border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900">
        <BookTemplate className="h-3.5 w-3.5 text-lime-500 dark:text-lime-400" />
        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
          Template
        </span>
        <span className="ml-auto text-xs text-slate-500 dark:text-slate-400">
          {template.fields.length} fields
        </span>
      </div>

      <div className="flex w-full justify-between items-start p-4">
        <div className="flex flex-col items-start">
          <TemplateDetailSheet templateId={template.id} mutate={mutate}>
            <h3 className="font-semibold text-base text-slate-800 dark:text-slate-200 hover:underline cursor-pointer">
              {template.name}
            </h3>
          </TemplateDetailSheet>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
            {template.description || "No description"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <TemplateItemActions templateId={template.id} mutate={mutate} />
        </div>
      </div>

      <div className="mt-auto">
        <div className="border-t border-slate-100 dark:border-zinc-800 p-4 pb-2">
          <div className="flex flex-wrap gap-1 mb-3">
            {["Custom", "Personal"].map((tag, i) => (
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
          <Button
            variant="outline"
            className="w-full text-xs h-9 border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-800 dark:text-slate-200"
            asChild
          >
            <Link href={`/dashboard/forms/builder?template=${template.id}`}>
              Use Template
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}

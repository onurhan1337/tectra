import Link from "next/link";
import { PlusCircle, FilePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormCard } from "./form-card";
import { CreateFormCard } from "./create-form-card";

interface FormData {
  id: string;
  name: string;
  description: string;
  status: string;
  submissions: number;
  lastSubmission: string | null;
}

export function FormsList({ forms }: { forms: FormData[] }) {
  if (forms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FilePlus className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No forms created yet</h3>
        <p className="text-muted-foreground mb-4 max-w-sm">
          Get started by creating your first form. You can add custom fields and
          share it with your audience.
        </p>
        <Link href="/dashboard/forms/create">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create your first form
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {forms.map((form) => (
        <FormCard key={form.id} form={form} />
      ))}
      <CreateFormCard />
    </div>
  );
}

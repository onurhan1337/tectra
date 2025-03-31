import Link from "next/link";
import { PlusCircle, FilePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function CreateFormCard() {
  return (
    <Link href="/dashboard/forms/create" className="block">
      <Card className="border-dashed flex flex-col items-center justify-center text-center p-3 hover:border-primary/50 hover:bg-secondary/10 transition-all h-full">
        <FilePlus className="h-7 w-7 text-muted-foreground mb-2" />
        <h3 className="font-medium text-xs">Create a new form</h3>
        <p className="text-[10px] text-muted-foreground my-2 max-w-[150px]">
          Add a new form to collect information
        </p>
        <Button variant="outline" size="sm" className="h-7 text-xs">
          <PlusCircle className="mr-1.5 h-3 w-3" />
          Create Form
        </Button>
      </Card>
    </Link>
  );
}

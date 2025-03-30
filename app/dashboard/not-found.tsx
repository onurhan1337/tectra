import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardNotFound() {
  return (
    <div className="flex h-[calc(100vh-4rem)] w-full flex-col items-center justify-center bg-gradient-to-b from-background/50 to-muted/20 p-4">
      <div className="relative max-w-md text-center">
        <div className="relative mb-6">
          <div className="text-[8rem] font-bold leading-none tracking-wider text-muted-foreground/10">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-32 w-32 bg-[url('/images/sootsprite.svg')] bg-contain bg-center bg-no-repeat opacity-80"></div>
          </div>
        </div>

        <h1 className="mb-3 text-3xl font-medium text-foreground/90">
          This path is overgrown
        </h1>

        <p className="mb-8 text-muted-foreground">
          The dashboard section you're looking for has disappeared, like a
          spirit in the wind.
        </p>

        <Button
          asChild
          variant="outline"
          className="relative rounded-full border-primary/30 px-6 text-sm font-normal text-foreground/80 shadow-sm hover:bg-primary/5"
        >
          <Link href="/dashboard" className="flex items-center gap-2">
            <ChevronLeft className="h-4 w-4" />
            <span>Return to your journey</span>
          </Link>
        </Button>
      </div>

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-green-900/5 to-transparent"></div>
        <div className="absolute bottom-0 left-10 right-10 h-16 bg-[url('/images/grass.svg')] bg-repeat-x bg-bottom opacity-30"></div>
      </div>
    </div>
  );
}

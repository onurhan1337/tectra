import { FormInput } from "lucide-react";
import Link from "next/link";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted/50">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="flex aspect-square size-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <FormInput className="size-6" />
            </div>
          </div>
          <h1 className="text-3xl font-semibold text-foreground">Tectra</h1>
          <p className="text-muted-foreground mt-1">Form Builder Platform</p>
        </div>
        <div className="bg-card border rounded-xl shadow-sm p-8">
          {children}
        </div>
        <p className="text-center text-xs text-muted-foreground mt-6">
          © {new Date().getFullYear()} Tectra.{" "}
          <Link
            href="https://github.com/onurhan1337/tectra"
            className="text-primary underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open Source
          </Link>
        </p>
      </div>
    </div>
  );
}

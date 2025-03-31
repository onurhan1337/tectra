import { Metadata } from "next";
import Link from "next/link";
import { PlusCircle, ListFilter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FormsList } from "@/components/forms/forms-list";

export const metadata: Metadata = {
  title: "Forms | Dashboard",
  description: "Manage your forms and templates",
};

const mockForms = [
  {
    id: "form-1",
    name: "Contact Form",
    description: "A simple contact form for your website",
    status: "published",
    submissions: 145,
    lastSubmission: "2023-09-15",
  },
  {
    id: "form-2",
    name: "Job Application",
    description: "Application form for job candidates",
    status: "published",
    submissions: 47,
    lastSubmission: "2023-09-12",
  },
  {
    id: "form-3",
    name: "Customer Feedback",
    description: "Survey to collect customer feedback",
    status: "draft",
    submissions: 0,
    lastSubmission: null,
  },
];

export default function FormsPage() {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold font-mono tracking-tight">
            Forms
          </h1>
          <p className="text-muted-foreground">Create and manage your forms</p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <ListFilter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuCheckboxItem>
                Published Forms
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Draft Forms</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>
                With Submissions
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>
                Recently Updated
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link href="/dashboard/forms/create">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Form
            </Button>
          </Link>
        </div>
      </div>

      <FormsList forms={mockForms} />
    </div>
  );
}

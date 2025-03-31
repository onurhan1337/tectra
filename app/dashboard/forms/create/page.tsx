import { Metadata } from "next";
import Link from "next/link";
import {
  FileText,
  ArrowRight,
  Plus,
  ChevronLeft,
  MessageSquare,
  UserPlus,
  ClipboardCheck,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Create Form | Dashboard",
  description: "Create a new form from a template or start from scratch",
};

const categories = [
  {
    id: "popular",
    name: "Popular",
    icon: <Star className="h-4 w-4" />,
  },
  {
    id: "feedback",
    name: "Feedback",
    icon: <MessageSquare className="h-4 w-4" />,
  },
  {
    id: "registration",
    name: "Registration",
    icon: <UserPlus className="h-4 w-4" />,
  },
  {
    id: "survey",
    name: "Survey",
    icon: <ClipboardCheck className="h-4 w-4" />,
  },
];

const templates = [
  {
    id: "contact-form",
    name: "Contact Form",
    description: "Standard contact form with name, email, and message fields",
    category: "popular",
    fields: 4,
  },
  {
    id: "customer-feedback",
    name: "Customer Feedback",
    description:
      "Collect feedback from customers about your products or services",
    category: "feedback",
    fields: 5,
  },
  {
    id: "event-registration",
    name: "Event Registration",
    description: "Register participants for your event with basic information",
    category: "registration",
    fields: 6,
  },
  {
    id: "job-application",
    name: "Job Application",
    description:
      "Collect applications from job seekers including resume upload",
    category: "registration",
    fields: 8,
  },
  {
    id: "satisfaction-survey",
    name: "Satisfaction Survey",
    description: "Measure satisfaction with your product or service",
    category: "survey",
    fields: 7,
  },
  {
    id: "newsletter-signup",
    name: "Newsletter Signup",
    description: "Simple form to collect emails for your newsletter",
    category: "popular",
    fields: 2,
  },
];

export default function CreateFormPage() {
  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/dashboard/forms"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Forms
          </Link>
          <h1 className="text-3xl font-bold">Create a New Form</h1>
          <p className="text-muted-foreground">
            Start with a template or create from scratch
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <div className="md:col-span-3 space-y-4">
          <h2 className="text-lg font-semibold">Categories</h2>
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start font-normal"
            >
              <FileText className="mr-2 h-4 w-4" />
              All Templates
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant="ghost"
                className="w-full justify-start font-normal"
              >
                {category.icon}
                <span className="ml-2">{category.name}</span>
              </Button>
            ))}
          </div>
        </div>
        <div className="md:col-span-9">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link href="/dashboard/forms/builder" className="block">
              <Card className="h-full hover:shadow-md transition-shadow border-dashed hover:border-primary/50">
                <CardHeader>
                  <CardTitle className="flex items-center text-base">
                    <Plus className="mr-2 h-5 w-5 text-muted-foreground" />
                    Start from Scratch
                  </CardTitle>
                  <CardDescription>
                    Create a completely blank form
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Build your form exactly how you want it</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full text-sm">
                    Create Blank Form
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </Link>

            {templates.map((template) => (
              <Link
                key={template.id}
                href={`/dashboard/forms/builder?template=${template.id}`}
                className="block"
              >
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center text-base">
                      <FileText className="mr-2 h-5 w-5 text-muted-foreground" />
                      {template.name}
                    </CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    <p>{template.fields} fields</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full text-sm">
                      Use Template
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

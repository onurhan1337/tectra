"use client";

import { useState } from "react";
import { Form, FormStatus, FormStatusSchema } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Check, Copy, AlertCircle, Info } from "lucide-react";

interface FormSettingsProps {
  form: Form;
  onUpdate: (updates: Partial<Form>) => void;
}

export function FormSettings({ form, onUpdate }: FormSettingsProps) {
  const [copied, setCopied] = useState(false);

  const embedCode = `<iframe 
  src="https://example.com/forms/embed/${form.id}" 
  style="width: 100%; height: 600px; border: none;" 
  title="${form.name}"
></iframe>`;

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStatusChange = (status: string) => {
    try {
      const validStatus = FormStatusSchema.parse(status);
      onUpdate({ status: validStatus });
    } catch (error) {
      console.error("Invalid status:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form details */}
        <Card>
          <CardHeader>
            <CardTitle>Form Details</CardTitle>
            <CardDescription>Basic information about your form</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="form-name">Form Name</Label>
              <Input
                id="form-name"
                value={form.name}
                onChange={(e) => onUpdate({ name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="form-description">Description</Label>
              <Textarea
                id="form-description"
                value={form.description || ""}
                onChange={(e) => onUpdate({ description: e.target.value })}
                placeholder="Describe the purpose of this form"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Form status */}
        <Card>
          <CardHeader>
            <CardTitle>Form Status</CardTitle>
            <CardDescription>
              Control the visibility and access to your form
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="form-status">Status</Label>
              <Select value={form.status} onValueChange={handleStatusChange}>
                <SelectTrigger id="form-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Published forms are accessible to users
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="space-y-0.5">
                <Label htmlFor="form-public">Public Form</Label>
                <p className="text-xs text-muted-foreground">
                  Allow anyone to view and submit without authentication
                </p>
              </div>
              <Switch
                id="form-public"
                checked={true}
                onCheckedChange={() => {}}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Embed code */}
      <Card>
        <CardHeader>
          <CardTitle>Embed Form</CardTitle>
          <CardDescription>
            Copy this code to embed the form on your website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-3 rounded-md text-sm font-mono overflow-x-auto">
            {embedCode}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex items-center text-sm text-muted-foreground">
            <Info className="h-4 w-4 mr-1" />
            Form must be published to be embedded
          </div>
          <Button variant="outline" onClick={copyEmbedCode}>
            {copied ? (
              <Check className="mr-2 h-4 w-4" />
            ) : (
              <Copy className="mr-2 h-4 w-4" />
            )}
            {copied ? "Copied" : "Copy Code"}
          </Button>
        </CardFooter>
      </Card>

      {/* Danger zone */}
      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions for your form</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium">Delete this form</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Once deleted, this form and all its submissions will be
                permanently removed. This action cannot be undone.
              </p>
              <Button variant="destructive" size="sm">
                Delete Form
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

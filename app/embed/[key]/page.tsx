"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { verifyEmbedKey, logEmbedLoad } from "@/lib/embed";
import { getFormById } from "@/lib/services/form-service";
import { FormField } from "@/lib/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function EmbeddedForm() {
  const params = useParams();
  const searchParams = useSearchParams();
  const embedKey = params.key as string;
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [form, setForm] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  // Get referrer domain from URL parameters if available (for testing purposes)
  // In production, this would be handled securely on the server
  const testReferer = searchParams.get("referer");

  useEffect(() => {
    const loadForm = async () => {
      try {
        // Get actual referrer from document if available
        const documentReferer =
          typeof document !== "undefined" ? document.referrer : "";
        const referer = documentReferer || testReferer;

        // Extract domain from referrer
        let refererDomain: string | undefined = undefined;
        if (referer) {
          try {
            const url = new URL(referer);
            refererDomain = url.hostname;
          } catch (e) {
            // Invalid URL, ignore
          }
        }

        // Verify embedding key and domain
        const verification = await verifyEmbedKey(embedKey, refererDomain);

        if (!verification.valid) {
          setError(verification.error || "Invalid embed key");
          setLoading(false);
          return;
        }

        // Log embed load
        await logEmbedLoad(
          embedKey,
          referer || undefined,
          typeof navigator !== "undefined" ? navigator.userAgent : undefined
        );

        // Load form data
        if (verification.formId) {
          const formData = await getFormById(verification.formId);
          if (formData) {
            setForm(formData);

            // Initialize form data with empty values
            const initialData: Record<string, any> = {};
            formData.fields.forEach((field: FormField) => {
              initialData[field.id] = "";
            });
            setFormData(initialData);
          } else {
            setError("Form not found");
          }
        }
      } catch (err) {
        console.error("Error loading form:", err);
        setError("Error loading form");
      } finally {
        setLoading(false);
      }
    };

    loadForm();
  }, [embedKey, testReferer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Submit the form data to our API endpoint
      const response = await fetch("/api/forms/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formId: form.id,
          embedKey: embedKey,
          data: formData,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit form");
      }

      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(err instanceof Error ? err.message : "Error submitting form");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldId]: value,
    }));
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <Card className="w-full max-w-lg mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-red-500">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
        </CardContent>
      </Card>
    );
  }

  // Render success message after submission
  if (submitted) {
    return (
      <Card className="w-full max-w-lg mx-auto mt-8">
        <CardHeader>
          <CardTitle>Thank you!</CardTitle>
          <CardDescription>Your submission has been received.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>We appreciate your feedback.</p>
        </CardContent>
      </Card>
    );
  }

  // Render form if available
  if (!form) {
    return null;
  }

  return (
    <Card className="w-full max-w-lg mx-auto mt-8">
      <CardHeader>
        <CardTitle>{form.name}</CardTitle>
        {form.description && (
          <CardDescription>{form.description}</CardDescription>
        )}
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {form.fields.map((field: FormField) => (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={field.id}>{field.label}</Label>

              {field.type === "text" && (
                <Input
                  id={field.id}
                  placeholder={field.placeholder}
                  value={formData[field.id] || ""}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  required={field.validation?.required}
                />
              )}

              {field.type === "textarea" && (
                <Textarea
                  id={field.id}
                  placeholder={field.placeholder}
                  value={formData[field.id] || ""}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  required={field.validation?.required}
                />
              )}

              {field.type === "email" && (
                <Input
                  id={field.id}
                  type="email"
                  placeholder={field.placeholder}
                  value={formData[field.id] || ""}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  required={field.validation?.required}
                />
              )}

              {field.type === "tel" && (
                <Input
                  id={field.id}
                  type="tel"
                  placeholder={field.placeholder}
                  value={formData[field.id] || ""}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  required={field.validation?.required}
                />
              )}

              {field.type === "number" && (
                <Input
                  id={field.id}
                  type="number"
                  placeholder={field.placeholder}
                  value={formData[field.id] || ""}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  required={field.validation?.required}
                />
              )}

              {field.type === "checkbox" && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={field.id}
                    checked={!!formData[field.id]}
                    onCheckedChange={(checked) =>
                      handleInputChange(field.id, checked)
                    }
                    required={field.validation?.required}
                  />
                  <Label htmlFor={field.id}>
                    {field.placeholder || field.label}
                  </Label>
                </div>
              )}

              {field.type === "select" && field.options && (
                <Select
                  value={formData[field.id] || ""}
                  onValueChange={(value) => handleInputChange(field.id, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={field.placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options.map((option, index) => (
                      <SelectItem key={index} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {field.type === "radio" && field.options && (
                <RadioGroup
                  value={formData[field.id] || ""}
                  onValueChange={(value: string) =>
                    handleInputChange(field.id, value)
                  }
                >
                  {field.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={option}
                        id={`${field.id}-${index}`}
                      />
                      <Label htmlFor={`${field.id}-${index}`}>{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {field.description && (
                <p className="text-sm text-muted-foreground">
                  {field.description}
                </p>
              )}
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={loading}>
            Submit
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

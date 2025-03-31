import { NextRequest, NextResponse } from "next/server";
import { getFormById } from "@/lib/services/form-service";
import { submitForm } from "@/lib/services/embed-service";
import { verifyEmbedKey } from "@/lib/embed";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { formId, embedKey, data } = body;

    // Check referer for security
    const referer = req.headers.get("referer");
    let refererDomain: string | undefined = undefined;

    if (referer) {
      try {
        const url = new URL(referer);
        refererDomain = url.hostname;
      } catch {
        // Invalid URL, ignore
      }
    }

    // If embedKey is provided, verify it matches the formId and is valid for the domain
    if (embedKey) {
      const verification = await verifyEmbedKey(embedKey, refererDomain);

      if (!verification.valid) {
        return NextResponse.json(
          { error: verification.error || "Invalid embed key" },
          { status: 403 }
        );
      }

      // Make sure the form ID matches
      if (verification.formId !== formId) {
        return NextResponse.json(
          { error: "Form ID mismatch" },
          { status: 403 }
        );
      }
    }

    // Get the form to validate submission
    const form = await getFormById(formId);

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    // Check if form is published
    if (form.status !== "published") {
      return NextResponse.json(
        { error: "Form is not accepting submissions" },
        { status: 403 }
      );
    }

    // Validate required fields
    const missingFields = form.fields
      .filter((field) => field.validation?.required && !data[field.id])
      .map((field) => field.id);

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          fields: missingFields,
        },
        { status: 400 }
      );
    }

    // Get IP address from request headers
    const forwardedFor = req.headers.get("x-forwarded-for") || "";
    const ipAddress = forwardedFor.split(",")[0].trim() || "unknown";
    const userAgent = req.headers.get("user-agent") || "";

    const metadata = {
      userAgent: userAgent || null,
      ipAddress,
      referer,
      timestamp: new Date().toISOString(),
      embedKey: embedKey || null,
    };

    // Submit the form data
    const submission = await submitForm(formId, data, metadata);

    return NextResponse.json({
      success: true,
      submissionId: submission.id,
    });
  } catch (error) {
    console.error("Error submitting form:", error);

    return NextResponse.json(
      { error: "Failed to submit form" },
      { status: 500 }
    );
  }
}

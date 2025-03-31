import { NextRequest, NextResponse } from "next/server";
import { createForm } from "@/lib/services/form-service";
import { createFormFromTemplate } from "@/lib/services/template-service";
import { createClient } from "@/utils/supabase/server";
import { Form } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { form, templateId } = body;

    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let createdForm;

    if (templateId) {
      createdForm = await createFormFromTemplate(templateId, user.id);
    } else {
      createdForm = await createForm(
        user.id,
        form as Omit<
          Form,
          | "id"
          | "status"
          | "createdAt"
          | "updatedAt"
          | "publishedAt"
          | "archivedAt"
        >,
        templateId
      );
    }

    return NextResponse.json({
      success: true,
      form: createdForm,
    });
  } catch (error) {
    console.error("Error creating form:", error);

    return NextResponse.json(
      { error: "Failed to create form" },
      { status: 500 }
    );
  }
}

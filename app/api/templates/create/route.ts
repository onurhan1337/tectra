import { NextRequest, NextResponse } from "next/server";
import { createTemplateFromForm } from "@/lib/services/template-service";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { formId, name, description } = body;

    if (!formId || !name) {
      return NextResponse.json(
        { error: "Form ID and name are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const template = await createTemplateFromForm(
      formId,
      user.id,
      name,
      description
    );

    return NextResponse.json({
      success: true,
      template,
    });
  } catch (error) {
    console.error("Error creating template:", error);

    return NextResponse.json(
      { error: "Failed to create template" },
      { status: 500 }
    );
  }
}

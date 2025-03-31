"use client";

import { createClient } from "@/utils/supabase/client";

export interface FormListItem {
  id: string;
  name: string;
  description: string;
  status: string;
  submissions: number;
  lastSubmission: string | null;
}

export async function fetchForms(
  userId: string | undefined,
  filter: string = "all"
): Promise<FormListItem[]> {
  if (!userId) {
    return [];
  }

  try {
    const supabase = createClient();

    let query = supabase
      .from("forms")
      .select(
        `
        id, 
        name, 
        description, 
        status, 
        updated_at
      `
      )
      .eq("created_by", userId)
      .order("updated_at", { ascending: false });

    if (filter === "published") {
      query = query.eq("status", "published");
    } else if (filter === "draft") {
      query = query.eq("status", "draft");
    }

    const { data: formsData, error } = await query;

    if (error) {
      console.error("Error loading forms:", error);
      throw new Error("Failed to load forms");
    }

    if (!formsData || formsData.length === 0) {
      return [];
    }

    const formWithSubmissions = await Promise.all(
      formsData.map(async (form) => {
        const { count, error: countError } = await supabase
          .from("form_submissions")
          .select("id", { count: "exact", head: true })
          .eq("form_id", form.id);

        const { data: lastSubmission, error: submissionError } = await supabase
          .from("form_submissions")
          .select("submitted_at")
          .eq("form_id", form.id)
          .order("submitted_at", { ascending: false })
          .limit(1)
          .single();

        return {
          id: form.id,
          name: form.name,
          description: form.description || "",
          status: form.status,
          submissions: count || 0,
          lastSubmission: lastSubmission?.submitted_at || null,
        };
      })
    );

    return formWithSubmissions;
  } catch (error) {
    console.error("Error in fetchForms:", error);
    throw error;
  }
}

export async function fetchFormById(formId: string): Promise<any> {
  if (!formId) {
    return null;
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("forms")
      .select("*")
      .eq("id", formId)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error fetching form:", error);
    throw error;
  }
}

/**
 * Fetch templates for a user
 * @param userId User ID
 * @returns Array of templates
 */
export async function fetchTemplates(userId?: string) {
  const response = await fetch(`/api/templates?userId=${userId || ""}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch templates");
  }

  const data = await response.json();
  return data.templates;
}

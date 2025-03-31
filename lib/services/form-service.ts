import { createClient } from "@/utils/supabase/server";
import { unstable_cache } from "next/cache";
import { FormTemplate, Form, FormStatus, FormSubmission } from "@/lib/types";
import {
  dbFormToAppForm,
  dbFormTemplateToAppTemplate,
  dbSubmissionToAppSubmission,
} from "@/lib/transformers";

// Cache duration: 60 seconds
const CACHE_DURATION = 60;

/**
 * Get all forms for a user with optional status filter
 * Uses unstable_cache for improved performance on repeated requests
 */
export const getForms = unstable_cache(
  async (userId: string, status?: FormStatus) => {
    const supabase = await createClient();

    let query = supabase.from("forms").select("*").eq("created_by", userId);

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query.order("updated_at", {
      ascending: false,
    });

    if (error) throw error;

    return data.map(dbFormToAppForm);
  },
  ["forms-list"],
  { revalidate: CACHE_DURATION, tags: ["forms"] }
);

/**
 * Get a specific form by ID
 */
export const getFormById = unstable_cache(
  async (formId: string) => {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("forms")
      .select("*")
      .eq("id", formId)
      .single();

    if (error) throw error;
    if (!data) return null;

    return dbFormToAppForm(data);
  },
  ["form-by-id"],
  { revalidate: CACHE_DURATION, tags: ["forms"] }
);

/**
 * Create a new form
 */
export async function createForm(
  userId: string,
  form: Omit<
    Form,
    "id" | "status" | "createdAt" | "updatedAt" | "publishedAt" | "archivedAt"
  >
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("forms")
    .insert({
      created_by: userId,
      name: form.name,
      description: form.description,
      fields: form.fields,
      status: "draft",
    })
    .select()
    .single();

  if (error) throw error;

  return dbFormToAppForm(data);
}

/**
 * Update an existing form
 */
export async function updateForm(
  formId: string,
  updates: Partial<
    Omit<Form, "id" | "createdAt" | "updatedAt" | "publishedAt" | "archivedAt">
  >
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("forms")
    .update({
      name: updates.name,
      description: updates.description,
      fields: updates.fields,
      status: updates.status,
    })
    .eq("id", formId)
    .select()
    .single();

  if (error) throw error;

  return dbFormToAppForm(data);
}

/**
 * Publish a form
 */
export async function publishForm(formId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("forms")
    .update({
      status: "published",
      published_at: new Date().toISOString(),
    })
    .eq("id", formId)
    .select()
    .single();

  if (error) throw error;

  return dbFormToAppForm(data);
}

/**
 * Get all submissions for a form
 */
export const getFormSubmissions = unstable_cache(
  async (formId: string) => {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("form_submissions")
      .select("*")
      .eq("form_id", formId)
      .order("submitted_at", { ascending: false });

    if (error) throw error;

    return data.map(dbSubmissionToAppSubmission);
  },
  ["form-submissions"],
  { revalidate: CACHE_DURATION, tags: ["submissions"] }
);

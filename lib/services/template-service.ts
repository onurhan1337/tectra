import { createClient } from "@/utils/supabase/server";
import { unstable_cache } from "next/cache";
import { FormTemplate } from "@/lib/types";
import { dbFormTemplateToAppTemplate } from "@/lib/transformers";
import { createForm } from "./form-service";

// Cache duration: 60 seconds
const CACHE_DURATION = 60;

/**
 * Get all form templates for a user
 */
export const getFormTemplates = unstable_cache(
  async (userId: string) => {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("form_templates")
      .select("*")
      .eq("created_by", userId)
      .order("updated_at", { ascending: false });

    if (error) throw error;

    return data.map(dbFormTemplateToAppTemplate);
  },
  ["templates-list"],
  { revalidate: CACHE_DURATION, tags: ["templates"] }
);

/**
 * Get a specific template by ID
 */
export const getFormTemplateById = unstable_cache(
  async (templateId: string) => {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("form_templates")
      .select("*")
      .eq("id", templateId)
      .single();

    if (error) throw error;
    if (!data) return null;

    return dbFormTemplateToAppTemplate(data);
  },
  ["template-by-id"],
  { revalidate: CACHE_DURATION, tags: ["templates"] }
);

/**
 * Create a new form template
 */
export async function createFormTemplate(
  userId: string,
  template: Omit<FormTemplate, "id" | "createdAt" | "updatedAt">
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("form_templates")
    .insert({
      created_by: userId,
      name: template.name,
      description: template.description,
      fields: template.fields,
    })
    .select()
    .single();

  if (error) throw error;

  return dbFormTemplateToAppTemplate(data);
}

/**
 * Create a form based on a template
 */
export async function createFormFromTemplate(
  userId: string,
  templateId: string,
  name: string,
  description?: string
) {
  // Get the template
  const template = await getFormTemplateById(templateId);

  if (!template) {
    throw new Error("Template not found");
  }

  // Create a new form using the template fields
  return createForm(userId, {
    name,
    description,
    fields: template.fields,
  });
}

/**
 * Update an existing form template
 */
export async function updateFormTemplate(
  templateId: string,
  updates: Partial<Omit<FormTemplate, "id" | "createdAt" | "updatedAt">>
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("form_templates")
    .update({
      name: updates.name,
      description: updates.description,
      fields: updates.fields,
    })
    .eq("id", templateId)
    .select()
    .single();

  if (error) throw error;

  return dbFormTemplateToAppTemplate(data);
}

/**
 * Delete a form template
 */
export async function deleteFormTemplate(templateId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("form_templates")
    .delete()
    .eq("id", templateId);

  if (error) throw error;

  return true;
}

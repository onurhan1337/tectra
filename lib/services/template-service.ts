import { createClient } from "@/utils/supabase/server";
import { unstable_cache } from "next/cache";
import { FormTemplate } from "@/lib/types";
import { dbFormTemplateToAppTemplate } from "@/lib/transformers";
import { createForm } from "./form-service";

// Cache duration: 60 seconds
const CACHE_DURATION = 60;

/**
 * Get all form templates for a user
 * @param userId - ID of the user whose templates to retrieve
 * @returns Array of form templates
 */
export const getFormTemplates = unstable_cache(
  async (userId: string) => {
    const supabase = await createClient();

    try {
      const { data, error } = await supabase
        .from("form_templates")
        .select("*")
        .eq("created_by", userId)
        .order("updated_at", { ascending: false });

      if (error) {
        console.error("Error getting form templates:", error);
        throw new Error(`Failed to get form templates: ${error.message}`);
      }

      return data.map(dbFormTemplateToAppTemplate);
    } catch (error) {
      console.error("Error in getFormTemplates:", error);
      throw error;
    }
  },
  ["form-templates-list"],
  { revalidate: CACHE_DURATION, tags: ["templates"] }
);

/**
 * Get a specific template by ID
 * @param templateId - ID of the template to retrieve
 * @returns The form template or null if not found
 */
export const getFormTemplateById = unstable_cache(
  async (templateId: string) => {
    const supabase = await createClient();

    try {
      const { data, error } = await supabase
        .from("form_templates")
        .select("*")
        .eq("id", templateId)
        .single();

      if (error) {
        // Don't treat not found as an error to throw
        if (error.code === "PGRST116") {
          return null;
        }
        console.error("Error getting form template:", error);
        throw new Error(`Failed to get form template: ${error.message}`);
      }

      if (!data) return null;

      return dbFormTemplateToAppTemplate(data);
    } catch (error) {
      console.error("Error in getFormTemplateById:", error);
      throw error;
    }
  },
  ["form-template-by-id"],
  { revalidate: CACHE_DURATION, tags: ["templates"] }
);

/**
 * Create a new form template
 * @param userId - ID of the user creating the template
 * @param template - The template data to create
 * @returns The created form template
 */
export async function createFormTemplate(
  userId: string,
  template: Omit<FormTemplate, "id" | "createdAt" | "updatedAt">
) {
  const supabase = await createClient();

  try {
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

    if (error) {
      console.error("Error creating form template:", error);
      throw new Error(`Failed to create form template: ${error.message}`);
    }

    return dbFormTemplateToAppTemplate(data);
  } catch (error) {
    console.error("Error in createFormTemplate:", error);
    throw error;
  }
}

/**
 * Create a form based on a template
 * @param userId - ID of the user creating the form
 * @param templateId - ID of the template to use
 * @param name - Name for the new form
 * @param description - Optional description for the new form
 * @returns The created form
 * @throws Error if template not found
 */
export async function createFormFromTemplate(
  userId: string,
  templateId: string,
  name: string,
  description?: string
) {
  try {
    // Get the template
    const template = await getFormTemplateById(templateId);

    if (!template) {
      throw new Error(`Template with ID ${templateId} not found`);
    }

    // Create a new form using the template fields
    const form = await createForm(userId, {
      name,
      description,
      fields: template.fields,
    });

    return form;
  } catch (error) {
    console.error("Error in createFormFromTemplate:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to create form from template");
  }
}

/**
 * Update an existing form template
 * @param templateId - ID of the template to update
 * @param updates - Partial template data to update
 * @returns The updated form template
 */
export async function updateFormTemplate(
  templateId: string,
  updates: Partial<Omit<FormTemplate, "id" | "createdAt" | "updatedAt">>
) {
  const supabase = await createClient();

  // Create update object with only the defined fields
  const updateData = Object.fromEntries(
    Object.entries({
      name: updates.name,
      description: updates.description,
      fields: updates.fields,
    }).filter(([_, value]) => value !== undefined)
  );

  try {
    const { data, error } = await supabase
      .from("form_templates")
      .update(updateData)
      .eq("id", templateId)
      .select()
      .single();

    if (error) {
      console.error("Error updating form template:", error);
      throw new Error(`Failed to update form template: ${error.message}`);
    }

    return dbFormTemplateToAppTemplate(data);
  } catch (error) {
    console.error("Error in updateFormTemplate:", error);
    throw error;
  }
}

/**
 * Delete a form template
 * @param templateId - ID of the template to delete
 * @returns true if deletion was successful
 */
export async function deleteFormTemplate(templateId: string) {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from("form_templates")
      .delete()
      .eq("id", templateId);

    if (error) {
      console.error("Error deleting form template:", error);
      throw new Error(`Failed to delete form template: ${error.message}`);
    }

    return true;
  } catch (error) {
    console.error("Error in deleteFormTemplate:", error);
    throw error;
  }
}

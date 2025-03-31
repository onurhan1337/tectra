import { cache } from "react";
import { FormTemplate, Form } from "@/lib/types";
import { createForm } from "./form-service";
import { showToast } from "@/lib/toast";

// Cache duration in seconds
const CACHE_DURATION = 60;

/**
 * Convert a database form template to application format
 */
function dbFormTemplateToAppTemplate(dbTemplate: any): FormTemplate {
  return {
    id: dbTemplate.id,
    name: dbTemplate.name,
    description: dbTemplate.description || "",
    fields: dbTemplate.fields || [],
    createdAt: new Date(dbTemplate.created_at),
    updatedAt: new Date(dbTemplate.updated_at),
    isPremium: dbTemplate.is_premium || false,
    price: dbTemplate.price || 0,
    previewImageUrl: dbTemplate.preview_image_url || null,
  };
}

/**
 * Get all form templates for a user - SERVER SIDE ONLY
 * @param userId - ID of the user
 * @returns Array of form templates
 */
export const getFormTemplates = cache(
  async (userId?: string): Promise<FormTemplate[]> => {
    // Use only in server components!
    const { createClient } = await import("@/utils/supabase/server");
    const supabase = await createClient();

    try {
      let query = supabase
        .from("form_templates")
        .select("*")
        .order("created_at", { ascending: false });

      if (userId) {
        query = query.eq("created_by", userId);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error getting form templates:", error);
        throw new Error(error.message);
      }

      return (data || []).map(dbFormTemplateToAppTemplate);
    } catch (error) {
      console.error("Error in getFormTemplates:", error);
      throw error;
    }
  }
);

/**
 * Get a form template by ID - SERVER SIDE ONLY
 * @param templateId - ID of the template to get
 * @returns The form template or null if not found
 */
export const getFormTemplateById = cache(
  async (templateId: string): Promise<FormTemplate | null> => {
    // Use only in server components!
    const { createClient } = await import("@/utils/supabase/server");
    const supabase = await createClient();

    try {
      const { data, error } = await supabase
        .from("form_templates")
        .select("*")
        .eq("id", templateId)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          // PGRST116 means no rows returned by the query
          return null;
        }
        console.error("Error getting form template:", error);
        throw new Error(error.message);
      }

      return dbFormTemplateToAppTemplate(data);
    } catch (error) {
      console.error("Error in getFormTemplateById:", error);
      throw error;
    }
  }
);

/**
 * Delete a form template - SERVER SIDE ONLY
 * @param templateId - ID of the template to delete
 * @returns true if successful, throws an error otherwise
 */
export async function deleteFormTemplate(templateId: string): Promise<boolean> {
  // Use only in server components!
  const { createClient } = await import("@/utils/supabase/server");
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from("form_templates")
      .delete()
      .eq("id", templateId);

    if (error) {
      console.error("Error deleting form template:", error);
      throw new Error(error.message);
    }

    return true;
  } catch (error) {
    console.error("Error in deleteFormTemplate:", error);
    throw error;
  }
}

/**
 * Create a new form template - SERVER SIDE ONLY
 * @param template - Form template to create
 * @param userId - ID of the user creating the template
 * @returns The newly created form template
 */
export async function createFormTemplate(
  template: Omit<FormTemplate, "id" | "createdAt" | "updatedAt">,
  userId: string
): Promise<FormTemplate> {
  // Use only in server components!
  const { createClient } = await import("@/utils/supabase/server");
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("form_templates")
      .insert([
        {
          name: template.name,
          description: template.description,
          fields: template.fields,
          created_by: userId,
          is_premium: template.isPremium || false,
          price: template.price || 0,
          preview_image_url: template.previewImageUrl || null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating form template:", error);
      throw new Error(error.message);
    }

    return dbFormTemplateToAppTemplate(data);
  } catch (error) {
    console.error("Error in createFormTemplate:", error);
    throw error;
  }
}

/**
 * Create a form from a template - SERVER SIDE ONLY
 * @param templateId - ID of the template to create form from
 * @param userId - ID of the user creating the form
 * @returns The newly created form
 */
export async function createFormFromTemplate(
  templateId: string,
  userId: string
): Promise<Form> {
  try {
    // Get the template
    const template = await getFormTemplateById(templateId);
    if (!template) {
      throw new Error("Template not found");
    }

    // Create a new form from the template
    const form = await createForm(
      userId,
      {
        name: template.name,
        description: template.description,
        fields: template.fields,
      },
      templateId
    );

    return form;
  } catch (error) {
    console.error("Error in createFormFromTemplate:", error);
    throw error;
  }
}

/**
 * Update a form template - SERVER SIDE ONLY
 * @param templateId - ID of the template to update
 * @param updates - The fields to update
 * @returns The updated form template
 */
export async function updateFormTemplate(
  templateId: string,
  updates: Partial<Omit<FormTemplate, "id" | "createdAt" | "updatedAt">>
): Promise<FormTemplate> {
  // Use only in server components!
  const { createClient } = await import("@/utils/supabase/server");
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("form_templates")
      .update({
        name: updates.name,
        description: updates.description,
        fields: updates.fields,
        updated_at: new Date().toISOString(),
      })
      .eq("id", templateId)
      .select()
      .single();

    if (error) {
      console.error("Error updating form template:", error);
      showToast.error(`Failed to update form template: ${error.message}`);
      throw new Error(`Failed to update form template: ${error.message}`);
    }

    return dbFormTemplateToAppTemplate(data);
  } catch (error) {
    console.error("Error in updateFormTemplate:", error);
    throw error;
  }
}

/**
 * Create a form template from an existing form - SERVER SIDE ONLY
 * @param formId - ID of the form to convert to a template
 * @param userId - ID of the user creating the template
 * @param name - Name for the new template
 * @param description - Optional description for the new template
 * @returns The created template
 */
export async function createTemplateFromForm(
  formId: string,
  userId: string,
  name: string,
  description?: string
): Promise<FormTemplate> {
  // Use only in server components!
  const { createClient } = await import("@/utils/supabase/server");
  const supabase = await createClient();

  try {
    // Get the form first
    const { data: formData, error: formError } = await supabase
      .from("forms")
      .select("fields, description")
      .eq("id", formId)
      .single();

    if (formError) {
      console.error("Error getting form:", formError);
      showToast.error(`Failed to get form: ${formError.message}`);
      throw new Error(`Failed to get form: ${formError.message}`);
    }

    // Create a new template with the form fields
    return await createFormTemplate(
      {
        name,
        description: description || formData.description || "",
        fields: formData.fields || [],
        isPremium: false,
        price: 0,
        previewImageUrl: undefined,
      },
      userId
    );
  } catch (error) {
    console.error("Error in createTemplateFromForm:", error);
    throw error;
  }
}

/**
 * Client-side version of deleteFormTemplate
 * @param templateId - ID of the template to delete
 * @returns true if deletion was successful
 */
export async function deleteFormTemplateClient(
  templateId: string
): Promise<boolean> {
  const { createClient } = await import("@/utils/supabase/client");
  const supabase = createClient();

  try {
    const { error } = await supabase
      .from("form_templates")
      .delete()
      .eq("id", templateId);

    if (error) {
      console.error("Error deleting form template:", error);
      showToast.error(`Failed to delete form template: ${error.message}`);
      throw new Error(`Failed to delete form template: ${error.message}`);
    }

    return true;
  } catch (error) {
    console.error("Error in deleteFormTemplate:", error);
    throw error;
  }
}

/**
 * Client-side version of createFormFromTemplate
 * @param userId - ID of the user creating the form
 * @param templateId - ID of the template to use
 * @param name - Name for the new form
 * @param description - Optional description for the new form
 * @returns The created form
 * @throws Error if template not found
 */
export async function createFormFromTemplateClient(
  userId: string,
  templateId: string,
  name: string,
  description?: string
): Promise<Form> {
  const { createClient } = await import("@/utils/supabase/client");
  const supabase = createClient();

  try {
    // Get the template
    const { data: templateData, error: templateError } = await supabase
      .from("form_templates")
      .select("*")
      .eq("id", templateId)
      .single();

    if (templateError) {
      showToast.error(`Template with ID ${templateId} not found`);
      throw new Error(`Template with ID ${templateId} not found`);
    }

    const template = dbFormTemplateToAppTemplate(templateData);

    // Create a new form using the template fields
    const { data, error } = await supabase
      .from("forms")
      .insert({
        created_by: userId,
        name,
        description: description || template.description,
        fields: template.fields,
        template_id: templateId,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating form from template:", error);
      showToast.error(`Failed to create form: ${error.message}`);
      throw new Error(`Failed to create form: ${error.message}`);
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description || "",
      fields: data.fields || [],
      status: data.status || "draft",
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  } catch (error) {
    console.error("Error in createFormFromTemplateClient:", error);
    throw error;
  }
}

/**
 * Client-side version of getFormTemplateById
 * @param templateId - ID of the template to get
 * @returns The form template or null if not found
 */
export async function getFormTemplateByIdClient(
  templateId: string
): Promise<FormTemplate | null> {
  const { createClient } = await import("@/utils/supabase/client");
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("form_templates")
      .select("*")
      .eq("id", templateId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // PGRST116 means no rows returned by the query
        return null;
      }
      console.error("Error getting form template:", error);
      throw new Error(error.message);
    }

    return dbFormTemplateToAppTemplate(data);
  } catch (error) {
    console.error("Error in getFormTemplateByIdClient:", error);
    throw error;
  }
}

/**
 * Client-side version of getFormTemplates
 * @param userId - ID of the user
 * @returns Array of form templates
 */
export async function getFormTemplatesClient(
  userId?: string
): Promise<FormTemplate[]> {
  const { createClient } = await import("@/utils/supabase/client");
  const supabase = createClient();

  try {
    let query = supabase
      .from("form_templates")
      .select("*")
      .order("created_at", { ascending: false });

    if (userId) {
      query = query.eq("created_by", userId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error getting form templates:", error);
      throw new Error(error.message);
    }

    return (data || []).map(dbFormTemplateToAppTemplate);
  } catch (error) {
    console.error("Error in getFormTemplatesClient:", error);
    throw error;
  }
}

/**
 * Get all premium templates with usage counts
 * @returns Array of premium form templates with usage counts
 */
export async function getPremiumTemplates(): Promise<FormTemplate[]> {
  const { createClient } = await import("@/utils/supabase/client");
  const supabase = createClient();

  try {
    // Get premium templates
    const { data, error } = await supabase
      .from("form_templates")
      .select("*")
      .eq("is_premium", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error getting premium form templates:", error);
      throw new Error(error.message);
    }

    return (data || []).map(dbFormTemplateToAppTemplate);
  } catch (error) {
    console.error("Error in getPremiumTemplates:", error);
    throw error;
  }
}

/**
 * Get purchased premium templates for a user
 * @param userId - ID of the user
 * @returns Array of purchased premium templates
 */
export async function getUserPurchasedTemplates(
  userId: string
): Promise<FormTemplate[]> {
  const { createClient } = await import("@/utils/supabase/client");
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("purchased_templates")
      .select("template_id")
      .eq("user_id", userId);

    if (error) {
      console.error("Error getting user purchased templates:", error);
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      return [];
    }

    const templateIds = data.map((item) => item.template_id);

    const { data: templates, error: templatesError } = await supabase
      .from("form_templates")
      .select("*")
      .in("id", templateIds)
      .order("created_at", { ascending: false });

    if (templatesError) {
      console.error("Error getting purchased templates:", templatesError);
      throw new Error(templatesError.message);
    }

    return (templates || []).map(dbFormTemplateToAppTemplate);
  } catch (error) {
    console.error("Error in getUserPurchasedTemplates:", error);
    throw error;
  }
}

/**
 * Create a new premium template
 * @param userId - ID of the user creating the template
 * @param template - The template data to create
 * @param isPremium - Whether this is a premium template
 * @param price - Price in credits (required if isPremium is true)
 * @param previewImageUrl - URL to preview image (optional)
 * @returns The created form template
 */
export async function createPremiumTemplate(
  userId: string,
  template: Omit<
    FormTemplate,
    "id" | "createdAt" | "updatedAt" | "isPremium" | "price" | "previewImageUrl"
  >,
  isPremium: boolean,
  price?: number,
  previewImageUrl?: string
): Promise<FormTemplate> {
  const { createClient } = await import("@/utils/supabase/client");
  const supabase = createClient();

  if (isPremium && (!price || price <= 0)) {
    throw new Error("Premium templates require a positive price");
  }

  try {
    const { data, error } = await supabase
      .from("form_templates")
      .insert({
        created_by: userId,
        name: template.name,
        description: template.description,
        fields: template.fields,
        is_premium: isPremium,
        price: isPremium ? price : null,
        preview_image_url: previewImageUrl || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating premium template:", error);
      showToast.error(`Failed to create premium template: ${error.message}`);
      throw new Error(`Failed to create premium template: ${error.message}`);
    }

    return dbFormTemplateToAppTemplate(data);
  } catch (error) {
    console.error("Error in createPremiumTemplate:", error);
    throw error;
  }
}

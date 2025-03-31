import { createClient } from "@/utils/supabase/server";
import { unstable_cache } from "next/cache";
import { Form, FormStatus } from "@/lib/types";
import {
  dbFormToAppForm,
  dbSubmissionToAppSubmission,
} from "@/lib/transformers";
import { notify } from "../notify";

// Cache duration: 60 seconds
const CACHE_DURATION = 60;

/**
 * Get all forms for a user with optional status filter
 * Uses unstable_cache for improved performance on repeated requests
 * @param userId - ID of the user whose forms to retrieve
 * @param status - Optional status filter
 * @returns Array of forms
 */
export const getForms = unstable_cache(
  async (userId: string, status?: FormStatus) => {
    const supabase = await createClient();

    try {
      let query = supabase.from("forms").select("*").eq("created_by", userId);

      if (status) {
        query = query.eq("status", status);
      }

      const { data, error } = await query.order("updated_at", {
        ascending: false,
      });

      if (error) {
        console.error("Error getting forms:", error);
        notify.error(`Failed to get forms: ${error.message}`);
        throw new Error(`Failed to get forms: ${error.message}`);
      }

      return data.map(dbFormToAppForm);
    } catch (error) {
      console.error("Error in getForms:", error);
      throw error;
    }
  },
  ["form-list"],
  { revalidate: CACHE_DURATION, tags: ["forms"] }
);

/**
 * Get a specific form by ID
 * @param formId - ID of the form to retrieve
 * @returns The form or null if not found
 */
export const getFormById = unstable_cache(
  async (formId: string) => {
    const supabase = await createClient();

    try {
      const { data, error } = await supabase
        .from("forms")
        .select("*")
        .eq("id", formId)
        .single();

      if (error) {
        // Don't treat not found as an error to throw
        if (error.code === "PGRST116") {
          return null;
        }
        console.error("Error getting form:", error);
        notify.error(`Failed to get form: ${error.message}`);
        throw new Error(`Failed to get form: ${error.message}`);
      }

      if (!data) return null;

      return dbFormToAppForm(data);
    } catch (error) {
      console.error("Error in getFormById:", error);
      throw error;
    }
  },
  ["form-by-id"],
  { revalidate: CACHE_DURATION, tags: ["forms"] }
);

/**
 * Create a new form
 * @param userId - ID of the user creating the form
 * @param form - The form data to create
 * @returns The created form
 */
export async function createForm(
  userId: string,
  form: Omit<
    Form,
    "id" | "status" | "createdAt" | "updatedAt" | "publishedAt" | "archivedAt"
  >
) {
  const supabase = await createClient();

  try {
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

    if (error) {
      console.error("Error creating form:", error);
      throw new Error(`Failed to create form: ${error.message}`);
    }

    return dbFormToAppForm(data);
  } catch (error) {
    console.error("Error in createForm:", error);
    throw error;
  }
}

/**
 * Update an existing form
 * @param formId - ID of the form to update
 * @param updates - Partial form data to update
 * @returns The updated form
 */
export async function updateForm(
  formId: string,
  updates: Partial<
    Omit<Form, "id" | "createdAt" | "updatedAt" | "publishedAt" | "archivedAt">
  >
) {
  const supabase = await createClient();

  try {
    // Create update object with only the defined fields
    const updateData = Object.fromEntries(
      Object.entries({
        name: updates.name,
        description: updates.description,
        fields: updates.fields,
        status: updates.status,
      }).filter(([_, value]) => value !== undefined)
    );

    const { data, error } = await supabase
      .from("forms")
      .update(updateData)
      .eq("id", formId)
      .select()
      .single();

    if (error) {
      console.error("Error updating form:", error);
      throw new Error(`Failed to update form: ${error.message}`);
    }

    return dbFormToAppForm(data);
  } catch (error) {
    console.error("Error in updateForm:", error);
    throw error;
  }
}

/**
 * Publish a form
 * @param formId - ID of the form to publish
 * @returns The published form
 */
export async function publishForm(formId: string) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("forms")
      .update({
        status: "published",
        published_at: new Date().toISOString(),
      })
      .eq("id", formId)
      .select()
      .single();

    if (error) {
      console.error("Error publishing form:", error);
      throw new Error(`Failed to publish form: ${error.message}`);
    }

    return dbFormToAppForm(data);
  } catch (error) {
    console.error("Error in publishForm:", error);
    throw error;
  }
}

/**
 * Get all submissions for a form
 * @param formId - ID of the form whose submissions to retrieve
 * @returns Array of form submissions
 */
export const getFormSubmissions = unstable_cache(
  async (formId: string) => {
    const supabase = await createClient();

    try {
      const { data, error } = await supabase
        .from("form_submissions")
        .select("*")
        .eq("form_id", formId)
        .order("submitted_at", { ascending: false });

      if (error) {
        console.error("Error getting form submissions:", error);
        notify.error(`Failed to get form submissions: ${error.message}`);
        throw new Error(`Failed to get form submissions: ${error.message}`);
      }

      return data.map(dbSubmissionToAppSubmission);
    } catch (error) {
      console.error("Error in getFormSubmissions:", error);
      throw error;
    }
  },
  ["form-submissions"],
  { revalidate: CACHE_DURATION, tags: ["submissions"] }
);

/**
 * Delete a form
 * @param formId - ID of the form to delete
 * @returns true if deletion was successful
 */
export async function deleteForm(formId: string) {
  const supabase = await createClient();

  try {
    const { error } = await supabase.from("forms").delete().eq("id", formId);

    if (error) {
      console.error("Error deleting form:", error);
      throw new Error(`Failed to delete form: ${error.message}`);
    }

    return true;
  } catch (error) {
    console.error("Error in deleteForm:", error);
    throw error;
  }
}

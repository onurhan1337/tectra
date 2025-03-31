import { createClient } from "@/utils/supabase/server";
import { dbSubmissionToAppSubmission } from "@/lib/transformers";
import { FormSubmission } from "@/lib/types";

/**
 * Submit a form with the given data and metadata
 */
export async function submitForm(
  formId: string,
  formData: Record<string, any>,
  metadata: Record<string, any> = {}
): Promise<FormSubmission> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("form_submissions")
    .insert({
      form_id: formId,
      data: formData,
      submitter_ip: metadata.ipAddress || null,
      metadata,
    })
    .select()
    .single();

  if (error) throw error;

  return dbSubmissionToAppSubmission(data);
}

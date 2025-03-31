import {
  FormTemplate,
  Form,
  FormStatus,
  FormField,
  FormSubmission,
} from "@/lib/types";
import { Database } from "@/lib/database.types";

// Type aliases for better readability
export type DbFormTemplate =
  Database["public"]["Tables"]["form_templates"]["Row"];
export type DbForm = Database["public"]["Tables"]["forms"]["Row"];
export type DbFormSubmission =
  Database["public"]["Tables"]["form_submissions"]["Row"];
export type DbEmbeddingSite =
  Database["public"]["Tables"]["embedding_sites"]["Row"];
export type DbFormEmbedding =
  Database["public"]["Tables"]["form_embeddings"]["Row"];

// Convert database types to application types
export function dbFormTemplateToAppTemplate(
  dbTemplate: DbFormTemplate
): FormTemplate {
  return {
    id: dbTemplate.id,
    name: dbTemplate.name,
    description: dbTemplate.description || "",
    fields: dbTemplate.fields as FormField[],
    createdAt: new Date(dbTemplate.created_at),
    updatedAt: new Date(dbTemplate.updated_at),
  };
}

export function dbFormToAppForm(dbForm: DbForm): Form {
  return {
    id: dbForm.id,
    name: dbForm.name,
    description: dbForm.description || undefined,
    fields: dbForm.fields as FormField[],
    status: dbForm.status as FormStatus,
    createdAt: new Date(dbForm.created_at),
    updatedAt: new Date(dbForm.updated_at),
    publishedAt: dbForm.published_at
      ? new Date(dbForm.published_at)
      : undefined,
    archivedAt: dbForm.archived_at ? new Date(dbForm.archived_at) : undefined,
  };
}

export function dbSubmissionToAppSubmission(
  dbSubmission: DbFormSubmission
): FormSubmission {
  return {
    id: dbSubmission.id,
    formId: dbSubmission.form_id,
    submitterIp: dbSubmission.submitter_ip,
    data: dbSubmission.data as Record<string, any>,
    metadata: dbSubmission.metadata as Record<string, any>,
    submittedAt: new Date(dbSubmission.submitted_at),
  };
}

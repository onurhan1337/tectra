import { createClient } from "@/utils/supabase/server";
import { DbFormEmbedding } from "./db";

// Generate the embed code for a form to be used in an iframe
export function generateEmbedCode(
  embedKey: string,
  baseUrl: string,
  height: string = "600px",
  width: string = "100%"
): string {
  const embedUrl = `${baseUrl}/embed/${embedKey}`;
  return `<iframe src="${embedUrl}" width="${width}" height="${height}" frameborder="0" allow="camera; microphone" style="border: none;"></iframe>`;
}

// Verify that an embedding key is valid and the domain is authorized
export async function verifyEmbedKey(
  embedKey: string,
  refererDomain?: string
): Promise<{
  valid: boolean;
  formId?: string;
  error?: string;
}> {
  try {
    const supabase = await createClient();

    // Get the embedding record and related site
    const { data, error } = await supabase
      .from("form_embeddings")
      .select(
        `
        *,
        site:site_id(domain, is_approved),
        form:form_id(id, status, is_public)
      `
      )
      .eq("embedding_key", embedKey)
      .single();

    if (error) {
      return {
        valid: false,
        error: "Invalid embedding key",
      };
    }

    const embedding = data as DbFormEmbedding & {
      site: { domain: string; is_approved: boolean };
      form: { id: string; status: string; is_public: boolean };
    };

    // Check if the form is published
    if (embedding.form.status !== "published") {
      return {
        valid: false,
        error: "Form is not published",
      };
    }

    // Check if the site is approved
    if (!embedding.site.is_approved) {
      return {
        valid: false,
        error: "Site is not approved for embedding",
      };
    }

    // If a referer domain is provided, check if it matches
    if (refererDomain) {
      const normalizedReferer = normalizeUrl(refererDomain);
      const normalizedAllowed = normalizeUrl(embedding.site.domain);

      // Check if domains match (allowing subdomains)
      const isSubdomain =
        normalizedReferer === normalizedAllowed ||
        normalizedReferer.endsWith(`.${normalizedAllowed}`);

      if (!isSubdomain) {
        return {
          valid: false,
          error: "Unauthorized domain",
        };
      }
    }

    return {
      valid: true,
      formId: embedding.form.id,
    };
  } catch (err) {
    console.error("Error verifying embed key:", err);
    return {
      valid: false,
      error: "Error verifying embedding key",
    };
  }
}

// Log an embedding event when a form is loaded in an iframe
export async function logEmbedLoad(
  embedKey: string,
  referer?: string,
  userAgent?: string
): Promise<void> {
  try {
    const supabase = await createClient();

    await supabase.from("embed_logs").insert({
      embedding_key: embedKey,
      referer: referer || null,
      user_agent: userAgent || null,
      event_type: "load",
    });
  } catch (err) {
    console.error("Error logging embed load:", err);
  }
}

// Helper function to normalize URLs for comparison
function normalizeUrl(url: string): string {
  let normalized = url.toLowerCase();

  // Remove protocol if present
  normalized = normalized.replace(/^https?:\/\//, "");

  // Remove www. if present
  normalized = normalized.replace(/^www\./, "");

  // Remove trailing slash if present
  normalized = normalized.replace(/\/$/, "");

  return normalized;
}

// Get AI-generated form JSON schema from prompt
export async function generateFormFromAI(
  prompt: string
): Promise<Record<string, any>> {
  // In a real implementation, this would call an AI service
  // For now, we'll return a simple mock form based on the prompt
  const formName =
    prompt.length > 30 ? `${prompt.substring(0, 27)}...` : prompt;

  return {
    name: formName,
    description: `Form generated from: ${prompt}`,
    fields: [
      {
        id: "name",
        type: "text",
        label: "Name",
        placeholder: "Enter your name",
        validation: {
          required: true,
        },
      },
      {
        id: "email",
        type: "email",
        label: "Email",
        placeholder: "Enter your email address",
        validation: {
          required: true,
        },
      },
      {
        id: "message",
        type: "textarea",
        label: "Message",
        placeholder: "Your message...",
        validation: {
          required: false,
        },
      },
    ],
  };
}

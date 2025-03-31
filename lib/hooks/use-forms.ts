import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { FormStatus, Form } from "@/lib/types";

// Client-side type conversion helper
function transformFormData(formData: any): Form {
  return {
    id: formData.id,
    name: formData.name,
    description: formData.description || undefined,
    fields: formData.fields as any[],
    status: formData.status as FormStatus,
    createdAt: new Date(formData.created_at),
    updatedAt: new Date(formData.updated_at),
    publishedAt: formData.published_at
      ? new Date(formData.published_at)
      : undefined,
    archivedAt: formData.archived_at
      ? new Date(formData.archived_at)
      : undefined,
  };
}

// Get forms with optional status filter
export function useForms(userId?: string, status?: FormStatus) {
  return useQuery({
    queryKey: ["forms", userId, status],
    queryFn: async () => {
      if (!userId) return [];

      const supabase = createClient();
      let query = supabase
        .from("forms")
        .select("*")
        .eq("created_by", userId)
        .order("updated_at", { ascending: false });

      if (status) {
        query = query.eq("status", status);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data?.map(transformFormData) || [];
    },
    enabled: !!userId,
  });
}

// Get a single form by id
export function useForm(formId?: string) {
  return useQuery({
    queryKey: ["form", formId],
    queryFn: async () => {
      if (!formId) return null;

      const supabase = createClient();
      const { data, error } = await supabase
        .from("forms")
        .select("*")
        .eq("id", formId)
        .single();

      if (error) throw error;
      return data ? transformFormData(data) : null;
    },
    enabled: !!formId,
  });
}

// Update form status
export function useUpdateFormStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      formId,
      status,
    }: {
      formId: string;
      status: FormStatus;
    }) => {
      const supabase = createClient();

      let updates: any = { status };

      // Handle special status-related timestamps
      if (status === "published") {
        updates.published_at = new Date().toISOString();
      } else if (status === "archived") {
        updates.archived_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from("forms")
        .update(updates)
        .eq("id", formId)
        .select()
        .single();

      if (error) throw error;
      return transformFormData(data);
    },
    onSuccess: (data) => {
      // Invalidate related queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["forms"] });
      queryClient.invalidateQueries({ queryKey: ["form", data.id] });
    },
  });
}

// Get form submissions
export function useFormSubmissions(formId?: string) {
  return useQuery({
    queryKey: ["formSubmissions", formId],
    queryFn: async () => {
      if (!formId) return [];

      const supabase = createClient();
      const { data, error } = await supabase
        .from("form_submissions")
        .select("*")
        .eq("form_id", formId)
        .order("submitted_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!formId,
  });
}

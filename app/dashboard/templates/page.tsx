"use client";

import { useCallback } from "react";
import { TemplatesList } from "@/components/templates/templates-list";
import { PremiumTemplatesList } from "@/components/templates/premium-templates-list";
import { useUser } from "@/lib/hooks";
import useSWR from "swr";
import { createClient } from "@/utils/supabase/client";
import { getUserCreditBalance } from "@/lib/services/credit-service";
import { Separator } from "@/components/ui/separator";

interface TemplateData {
  id: string;
  name: string;
  description: string;
  fields: any[];
  createdAt: string;
  updatedAt: string;
  isPremium?: boolean;
  price?: number;
  previewImageUrl?: string;
}

export default function TemplatesPage() {
  const { user } = useUser();

  const fetchTemplates = async (userId: string) => {
    const supabase = createClient();

    let query = supabase
      .from("form_templates")
      .select("*")
      .eq("is_premium", false)
      .order("created_at", { ascending: false });

    if (userId) {
      query = query.eq("created_by", userId);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return (data || []).map((template) => ({
      id: template.id,
      name: template.name,
      description: template.description || "",
      fields: template.fields || [],
      createdAt: new Date(template.created_at),
      updatedAt: new Date(template.updated_at),
    }));
  };

  const fetchPremiumTemplates = async () => {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("form_templates")
      .select("*")
      .eq("is_premium", true)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return (data || []).map((template) => ({
      id: template.id,
      name: template.name,
      description: template.description || "",
      fields: template.fields || [],
      createdAt: new Date(template.created_at),
      updatedAt: new Date(template.updated_at),
      isPremium: template.is_premium,
      price: template.price || 0,
      previewImageUrl: template.preview_image_url,
    }));
  };

  const fetchPurchasedTemplateIds = async (userId: string) => {
    if (!userId) return [];

    const supabase = createClient();
    const { data, error } = await supabase
      .from("purchased_templates")
      .select("template_id")
      .eq("user_id", userId);

    if (error) {
      throw new Error(error.message);
    }

    return (data || []).map((item) => item.template_id);
  };

  const fetchUserCredits = async (userId: string) => {
    if (!userId) return 0;
    return await getUserCreditBalance(userId);
  };

  const {
    data: templates,
    error,
    isLoading,
    mutate: mutateTemplates,
  } = useSWR(
    user?.id ? `templates-${user.id}` : null,
    () => fetchTemplates(user?.id || ""),
    {
      revalidateOnFocus: true,
      dedupingInterval: 10000,
      errorRetryCount: 3,
    }
  );

  const {
    data: premiumTemplates,
    error: premiumError,
    isLoading: isPremiumLoading,
    mutate: mutatePremiumTemplates,
  } = useSWR("premium-templates", () => fetchPremiumTemplates(), {
    revalidateOnFocus: true,
    dedupingInterval: 10000,
    errorRetryCount: 3,
  });

  const {
    data: purchasedTemplateIds,
    error: purchasedError,
    isLoading: isPurchasedLoading,
    mutate: mutatePurchased,
  } = useSWR(
    user?.id ? `purchased-templates-${user.id}` : null,
    () => fetchPurchasedTemplateIds(user?.id || ""),
    {
      revalidateOnFocus: true,
      dedupingInterval: 10000,
      errorRetryCount: 3,
    }
  );

  const {
    data: userCredits,
    error: creditsError,
    isLoading: isCreditsLoading,
    mutate: mutateCredits,
  } = useSWR(
    user?.id ? `user-credits-${user.id}` : null,
    () => fetchUserCredits(user?.id || ""),
    {
      revalidateOnFocus: true,
      dedupingInterval: 10000,
      errorRetryCount: 3,
    }
  );

  const refreshAll = useCallback(async () => {
    mutateTemplates();
    mutatePremiumTemplates();
    mutatePurchased();
    mutateCredits();
  }, [mutateTemplates, mutatePremiumTemplates, mutatePurchased, mutateCredits]);

  const formattedTemplates: TemplateData[] = templates
    ? templates.map((template) => ({
        id: template.id,
        name: template.name,
        description: template.description,
        fields: template.fields,
        createdAt: template.createdAt.toISOString(),
        updatedAt: template.updatedAt.toISOString(),
      }))
    : [];

  const formattedPremiumTemplates: TemplateData[] = premiumTemplates
    ? premiumTemplates.map((template) => ({
        id: template.id,
        name: template.name,
        description: template.description,
        fields: template.fields,
        createdAt: template.createdAt.toISOString(),
        updatedAt: template.updatedAt.toISOString(),
        isPremium: template.isPremium,
        price: template.price,
        previewImageUrl: template.previewImageUrl,
      }))
    : [];

  return (
    <div className="p-4 space-y-8">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-semibold font-mono tracking-tight">
            Templates
          </h1>
          <p className="text-muted-foreground">
            Use and manage your form templates
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          <p>Failed to load your templates. Please try again.</p>
        </div>
      )}

      <TemplatesList
        templates={formattedTemplates}
        isLoading={isLoading}
        mutate={refreshAll}
        key={`templates-list-${Date.now()}`}
      />

      {premiumError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          <p>Failed to load premium templates. Please try again.</p>
        </div>
      )}

      {formattedPremiumTemplates.length > 0 && (
        <PremiumTemplatesList
          templates={formattedPremiumTemplates}
          userId={user?.id || ""}
          userCredits={userCredits || 0}
          purchasedTemplateIds={purchasedTemplateIds || []}
          isLoading={isPremiumLoading || isPurchasedLoading || isCreditsLoading}
          mutate={refreshAll}
        />
      )}
    </div>
  );
}

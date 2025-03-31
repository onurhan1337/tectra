import { UserCredit, CreditTransaction, TransactionType } from "@/lib/types";
import { showToast } from "@/lib/toast";

/**
 * Convert database credit record to application format
 */
function dbCreditToAppCredit(dbCredit: any): UserCredit {
  return {
    id: dbCredit.id,
    userId: dbCredit.user_id,
    amount: dbCredit.amount,
    createdAt: new Date(dbCredit.created_at),
    updatedAt: new Date(dbCredit.updated_at),
  };
}

/**
 * Convert database transaction record to application format
 */
function dbTransactionToAppTransaction(dbTransaction: any): CreditTransaction {
  return {
    id: dbTransaction.id,
    userId: dbTransaction.user_id,
    amount: dbTransaction.amount,
    transactionType: dbTransaction.transaction_type,
    referenceId: dbTransaction.reference_id,
    description: dbTransaction.description,
    createdAt: new Date(dbTransaction.created_at),
  };
}

/**
 * Get user credit balance
 * @param userId - User ID to get balance for
 * @returns Credit balance or 0 if no record exists
 */
export async function getUserCreditBalance(userId: string): Promise<number> {
  const { createClient } = await import("@/utils/supabase/client");
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("user_credits")
      .select("amount")
      .eq("user_id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No record found, return 0
        return 0;
      }
      console.error("Error getting user credit:", error);
      throw new Error(`Failed to get user credit: ${error.message}`);
    }

    return data?.amount || 0;
  } catch (error) {
    console.error("Error in getUserCreditBalance:", error);
    throw error;
  }
}

/**
 * Initialize user credit record if it doesn't exist
 * @param userId - User ID to initialize credit for
 * @returns Created/existing credit record
 */
export async function initializeUserCredit(
  userId: string
): Promise<UserCredit> {
  const { createClient } = await import("@/utils/supabase/client");
  const supabase = createClient();

  try {
    // Check if user already has a credit record
    const { data: existingCredit, error: queryError } = await supabase
      .from("user_credits")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!queryError && existingCredit) {
      return dbCreditToAppCredit(existingCredit);
    }

    // Create new credit record with 0 balance
    const { data, error } = await supabase
      .from("user_credits")
      .insert({
        user_id: userId,
        amount: 0,
      })
      .select()
      .single();

    if (error) {
      console.error("Error initializing user credit:", error);
      throw new Error(`Failed to initialize user credit: ${error.message}`);
    }

    return dbCreditToAppCredit(data);
  } catch (error) {
    console.error("Error in initializeUserCredit:", error);
    throw error;
  }
}

/**
 * Add credits to user account
 * @param userId - User ID to add credits to
 * @param amount - Amount of credits to add
 * @param description - Optional description for the transaction
 * @returns Updated credit balance
 */
export async function addCredits(
  userId: string,
  amount: number,
  description?: string
): Promise<number> {
  if (amount <= 0) {
    throw new Error("Credit amount must be positive");
  }

  const { createClient } = await import("@/utils/supabase/client");
  const supabase = createClient();

  try {
    // Start a transaction
    const { data, error } = await supabase.rpc("add_user_credits", {
      p_user_id: userId,
      p_amount: amount,
      p_description: description || "Credit purchase",
    });

    if (error) {
      console.error("Error adding credits:", error);
      showToast.error(`Failed to add credits: ${error.message}`);
      throw new Error(`Failed to add credits: ${error.message}`);
    }

    return data || 0;
  } catch (error) {
    console.error("Error in addCredits:", error);
    throw error;
  }
}

/**
 * Use credits from user account
 * @param userId - User ID to deduct credits from
 * @param amount - Amount of credits to use
 * @param referenceId - Optional reference ID (e.g., template ID)
 * @param description - Optional description for the transaction
 * @returns Updated credit balance
 * @throws Error if insufficient credits
 */
export async function useCredits(
  userId: string,
  amount: number,
  referenceId?: string,
  description?: string
): Promise<number> {
  if (amount <= 0) {
    throw new Error("Credit amount must be positive");
  }

  const { createClient } = await import("@/utils/supabase/client");
  const supabase = createClient();

  try {
    // Start a transaction
    const { data, error } = await supabase.rpc("use_user_credits", {
      p_user_id: userId,
      p_amount: amount,
      p_reference_id: referenceId || null,
      p_description: description || "Credit usage",
    });

    if (error) {
      console.error("Error using credits:", error);
      showToast.error(`Failed to use credits: ${error.message}`);
      throw new Error(`Failed to use credits: ${error.message}`);
    }

    return data || 0;
  } catch (error) {
    console.error("Error in useCredits:", error);
    throw error;
  }
}

/**
 * Get credit transaction history for a user
 * @param userId - User ID to get transactions for
 * @returns List of transactions
 */
export async function getUserTransactions(
  userId: string
): Promise<CreditTransaction[]> {
  const { createClient } = await import("@/utils/supabase/client");
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("credit_transactions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error getting user transactions:", error);
      throw new Error(`Failed to get user transactions: ${error.message}`);
    }

    return (data || []).map(dbTransactionToAppTransaction);
  } catch (error) {
    console.error("Error in getUserTransactions:", error);
    throw error;
  }
}

/**
 * Check if a user has purchased a specific template
 * @param userId - User ID to check
 * @param templateId - Template ID to check
 * @returns True if user has purchased the template
 */
export async function hasUserPurchasedTemplate(
  userId: string,
  templateId: string
): Promise<boolean> {
  const { createClient } = await import("@/utils/supabase/client");
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("purchased_templates")
      .select("id")
      .eq("user_id", userId)
      .eq("template_id", templateId)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error checking template purchase:", error);
      throw new Error(`Failed to check template purchase: ${error.message}`);
    }

    return !!data;
  } catch (error) {
    console.error("Error in hasUserPurchasedTemplate:", error);
    throw error;
  }
}

/**
 * Purchase a premium template
 * @param userId - User ID making the purchase
 * @param templateId - Template ID being purchased
 * @param price - Price of the template in credits
 * @returns True if purchase was successful
 */
export async function purchaseTemplate(
  userId: string,
  templateId: string,
  price: number
): Promise<boolean> {
  if (price <= 0) {
    throw new Error("Template price must be positive");
  }

  const { createClient } = await import("@/utils/supabase/client");
  const supabase = createClient();

  try {
    // Check if user has already purchased this template
    const alreadyPurchased = await hasUserPurchasedTemplate(userId, templateId);
    if (alreadyPurchased) {
      showToast.info("You already own this template");
      return true;
    }

    // Start a transaction
    const { data, error } = await supabase.rpc("purchase_template", {
      p_user_id: userId,
      p_template_id: templateId,
      p_price: price,
    });

    if (error) {
      console.error("Error purchasing template:", error);
      showToast.error(`Failed to purchase template: ${error.message}`);
      throw new Error(`Failed to purchase template: ${error.message}`);
    }

    showToast.success("Template purchased successfully");
    return true;
  } catch (error) {
    console.error("Error in purchaseTemplate:", error);
    throw error;
  }
}

import useSWR from "swr";
import { getUserCreditBalance } from "@/lib/services/credit-service";

export function useUserCredits(userId?: string) {
  const fetchUserCredits = async (userId: string) => {
    if (!userId) return 0;
    return await getUserCreditBalance(userId);
  };

  const {
    data: credits,
    error,
    isLoading,
    mutate,
  } = useSWR(
    userId ? `user-credits-${userId}` : null,
    () => fetchUserCredits(userId || ""),
    {
      revalidateOnFocus: true,
      dedupingInterval: 10000,
      errorRetryCount: 3,
    }
  );

  return {
    credits: credits || 0,
    error,
    isLoading,
    mutate,
  };
}

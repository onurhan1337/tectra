"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import useSWR from "swr";

interface UserData {
  id: string;
  email: string;
}

async function fetchUser() {
  try {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { user: null };
    }

    const userData: UserData = {
      id: user.id,
      email: user.email || "",
    };

    return { user: userData };
  } catch (error) {
    console.error("Error loading user data:", error);
    return { user: null };
  }
}

export function useUser() {
  const { data, error, isLoading, mutate } = useSWR("current-user", fetchUser, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
    errorRetryCount: 3,
  });

  return {
    user: data?.user || null,
    loading: isLoading,
    error,
    mutate,
  };
}

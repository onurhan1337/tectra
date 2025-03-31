"use client";

import { useState, useCallback } from "react";
import { ListFilter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FormsList } from "@/components/forms/forms-list";
import { FormActions } from "@/components/forms/form-actions";
import { useUser } from "@/lib/hooks";
import useSWR from "swr";
import { fetchForms } from "@/lib/fetchers";

export default function FormsPage() {
  const { user } = useUser();
  const [filter, setFilter] = useState("all");

  const {
    data: forms,
    error,
    isLoading,
    mutate,
  } = useSWR(
    user?.id ? [`forms-${user.id}`, filter] : null,
    () => fetchForms(user?.id, filter),
    {
      revalidateOnFocus: true,
      dedupingInterval: 10000,
      errorRetryCount: 3,
    }
  );

  const refreshForms = useCallback(async () => {
    return mutate();
  }, [mutate]);

  const handleFilterChange = (filterValue: string) => {
    setFilter(filterValue);
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold font-mono tracking-tight">
            Forms
          </h1>
          <p className="text-muted-foreground">Create and manage your forms</p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <ListFilter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuCheckboxItem
                checked={filter === "all"}
                onCheckedChange={() => handleFilterChange("all")}
              >
                All Forms
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filter === "published"}
                onCheckedChange={() => handleFilterChange("published")}
              >
                Published Forms
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filter === "draft"}
                onCheckedChange={() => handleFilterChange("draft")}
              >
                Draft Forms
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <FormActions />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          <p>Failed to load forms. Please try again.</p>
        </div>
      )}

      <FormsList
        forms={forms || []}
        isLoading={isLoading}
        mutate={refreshForms}
      />
    </div>
  );
}

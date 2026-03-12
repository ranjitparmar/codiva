"use client";

import { useQuery } from "@tanstack/react-query";
import { sitesApi } from "@/lib/api/sites.api";
import { GenerationStatusResponse } from "@/types";

export const useGenerationStatus = (generationId: string | null) => {
  return useQuery<GenerationStatusResponse>({
    queryKey: ["generation-status", generationId],
    queryFn: () => sitesApi.getStatus(generationId!),
    enabled: !!generationId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === "READY" || status === "FAILED") return false;
      return 2500;
    },
  });
};
import apiClient from "./client";
import { GenerationTier } from "@/types";

export const sitesApi = {
  getMySites: async () => {
    const res = await apiClient.get("/sites");
    return res.data;
  },

  generate: async (payload: {
    prompt: string;
    tier: GenerationTier;
    requestedSubdomain?: string;
  }) => {
    const res = await apiClient.post("/sites/generate", payload);
    return res.data;
  },

  regenerate: async (
    siteId: string,
    payload: { prompt: string; tier: GenerationTier }
  ) => {
    const res = await apiClient.post(`/sites/${siteId}/regenerate`, payload);
    return res.data;
  },

  getStatus: async (generationId: string) => {
    const res = await apiClient.get(`/sites/generations/${generationId}/status`);
    return res.data;
  },

  getSiteGenerations: async (siteId: string) => {
    const res = await apiClient.get(`/sites/${siteId}/generations`);
    return res.data;
  },
  deleteSite: async (siteId: string) => {
    const res = await apiClient.delete(`/sites/${siteId}`);
    return res.data;
  },
};
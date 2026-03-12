import apiClient from "./client";

export const creditsApi = {
  claim: async () => {
    const res = await apiClient.post("/credits/claim");
    return res.data;
  },
};